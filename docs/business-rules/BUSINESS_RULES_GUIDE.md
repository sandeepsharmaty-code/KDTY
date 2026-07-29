# Sprint 4.13 — Business Rules Guide

## Customer Domain (4.1)
- Password changes require re-authentication: the current password must
  verify against the stored hash before a new one is accepted
  (`CustomersService.changePassword`).
- Only one address per customer may be `isDefault: true` — enforced by
  `setDefaultAddress` clearing all others in the same call before setting
  the new one.

## Product Domain (4.2)
- A product cannot be **activated** with zero variants
  (`CANNOT_ACTIVATE_WITHOUT_VARIANT`) — nothing purchasable can go live.
- **Status** (draft/active/archived) and **visibility** (visible/hidden)
  are independent — a product can be active but temporarily hidden, or
  visible-in-admin-preview but not yet active.
- Deactivation archives (soft-deletes) — `archivedAt` is set, the row is
  never hard-deleted, per Phase 8 §4.
- Stock state is **derived**, never set directly: `≤0` → out-of-stock,
  `1–10` → low-stock, `>10` → in-stock (`LOW_STOCK_THRESHOLD = 10`).
- Stock writes use optimistic locking (`@VersionColumn`) — a concurrent
  write to the same variant's stock fails with `STALE_WRITE_CONFLICT`
  rather than silently overwriting the other write.

## Category & Collection (4.3)
- Only `visible: true` categories and `active: true` collections are
  ever returned by the public list/detail endpoints.
- Both support `displayOrder` for intentional, non-alphabetical ordering.
- `listActiveCollections("featured")` filters to `featured: true` only.

## Cart (4.4)
- Quantity must be a positive integer (`INVALID_QUANTITY` otherwise).
- Every add/update checks **actual current stock quantity** — not just
  the coarser `StockState` — against the *total* requested (existing
  cart quantity + new quantity), so a customer can't add past available
  stock across multiple calls.
- Guest cart → logged-in cart merge sums quantities for duplicate
  variants and deletes the guest cart afterward (`mergeGuestCart`).
- Cart totals compute live from current product price — cart does **not**
  snapshot price (only Orders do, per Phase 8 §4).

## Wishlist (4.5)
- A variant must exist to be wishlisted (`findVariantById` throws
  otherwise).
- Adding a duplicate raises `DUPLICATE_WISHLIST_ITEM` — a deliberate
  Sprint 4 change from Sprint 3's silent no-op, giving the frontend a
  specific signal to show "already in your wishlist" rather than a
  falsely-successful response.

## Order Lifecycle (4.6)
- **Creation**: snapshots cart line items into immutable `OrderLineItem`
  rows (product name + price captured at that moment) and commits stock,
  atomically — either the whole order + all stock adjustments succeed,
  or none of them do.
- **Status transitions** follow a strict state machine
  (`VALID_TRANSITIONS`): `pending_payment → {confirmed, payment_failed,
  cancelled}`, `confirmed → {processing, cancelled}`, `processing →
  {shipped, cancelled}`, `shipped → {delivered, returned}`, `delivered →
  {returned}`. `cancelled` and `returned` are terminal — no transition
  out of either is legal.
- **Cancellation** is only legal before `shipped`, and releases
  previously-committed stock back to inventory.
- **Returns** are only legal after `delivered`, and only within a
  30-day window from the delivery status-history timestamp
  (`RETURN_WINDOW_DAYS`).
- **Refund eligibility** (new in Sprint 4) is `true` only for orders in
  `returned` status, or `cancelled` orders where payment had already
  been captured (`total !== "0.00"` — a heuristic pending a real
  Payment entity, see Known Issues).

## Review System (4.7)
- Rating must be 1–5 (DTO-level `class-validator`).
- New reviews always start `pending`.
- `approveReview` requires the review to currently be `pending`
  (`REVIEW_NOT_PENDING` otherwise) — an approved review can't be
  re-approved.
- `hideReview` is legal from `pending` or `approved`, not from an
  already-`hidden` review.
- The public rating aggregate (average + count) is computed **live**
  from currently-`approved` reviews on every read — not stored and
  separately recalculated — so it's always consistent by construction.
- `verifiedPurchase` remains a placeholder (`false` by default) —
  explicitly named as such in this sprint's own deliverable wording.

## CMS (4.8)
- Banners are time-windowed (`startAt`/`endAt`) and filtered to
  currently-active ones at read time — no background job flips a status
  flag; activation is computed, not stored.

## Transactions (4.9)
- Multi-entity writes that must be all-or-nothing go through
  `TransactionService.runInTransaction`, which uses a real TypeORM
  `QueryRunner` (connect → startTransaction → work → commit, or
  rollback on any thrown error → release). Currently applied to
  `OrdersService.createOrder` and `requestCancellation`.
- Any service call made *inside* a transaction that also needs to
  participate in it (e.g. `ProductsService.adjustStock`) must be passed
  the transaction's `EntityManager` explicitly — this was a real bug
  caught and fixed during Sprint 4 (see
  `docs/sprint-reports/SPRINT_4_VALIDATION.md`).

## Validation Rules (4.10)
- Every business-rule violation throws a `DomainException` carrying a
  stable `errorCode` (see `src/common/exceptions/domain.exception.ts`
  for the full vocabulary), surfaced by `GlobalExceptionFilter` in
  preference to the generic HTTP-status-derived code.
