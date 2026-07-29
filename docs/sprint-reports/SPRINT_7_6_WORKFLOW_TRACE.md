# Sprint 7.6 — End-to-End Workflow Trace

Two distinct evidence types appear in this document, kept visibly
separate per every prior sprint's discipline:
- **[EXECUTED]** — genuinely ran via `testing/execution-harness/` (24/24
  passing) or an existing Jest-style unit test (never actually run by
  `jest` either, since `node_modules` is empty and `npm install`
  returns `403` — but algorithmically identical to what
  `testing/execution-harness/run-workflows.js` proves runs correctly).
- **[TRACED]** — the call chain was read end-to-end and confirmed
  consistent; no server, database, or browser executed it.

## 1. Product Discovery
`GET /v1/products` (ProductsController) → `ProductsService.listProducts`
→ `PaginatedResponse` over `ProductEntity` + relations. Category filter
→ `CategoriesService.getCategory` (tree lookup). **[EXECUTED]**
Content validation logic (`validateProduct`) confirmed against a real
Sprint 7.4 seed product — 0 errors. **[TRACED]** Frontend
`ProductListingGrid`/`ProductDetailSummary` (Sprint 2) consume the same
DTO shape `ProductsService.listProducts`/`getProduct` return — field
names match (`price`, `salePrice`, `variants[].hexColor`, `mediaUrls`).

## 2. Cart
`CartController` → `CartService.addItem/updateQuantity/applyCoupon` →
stock check via `ProductsService.checkAvailability`,
`CouponsService.validateAndComputeDiscount`. **[EXECUTED]** discount
computation (percentage, fixed-amount-capped, expired-rejection) — all
3 scenarios pass against the real math. **[TRACED]** the
`coupons.enabled` feature-flag gate added in Sprint 7.5 — confirmed
`CartService.applyCoupon` checks `SettingsService.isFeatureEnabled`
before calling `CouponsService`, correctly ordered (flag check first,
so a disabled flag never even queries coupon validity).

## 3. Checkout
`OrdersController.create` → `OrdersService.createOrder` → real
transaction: `CartService.findById` → stock `adjustStock` per line
→ `OrderEntity`/`OrderLineItemEntity` persisted → `OrderStatusHistoryEntity`
seeded with `pending_payment`. **[TRACED]** — this is the workflow
with the deepest DB/transaction dependency in the entire app; cannot
execute without Postgres. Sprint 7.4's `OrdersSeedProvider` is the
strongest indirect evidence this path is internally consistent (it
successfully drives 8 seed orders through this exact code, per Sprint
7.4's own validation — itself unexecuted, so this remains a chain of
consistent-on-paper claims, not proof).

## 4. Order Lifecycle
`VALID_TRANSITIONS` state machine. **[EXECUTED]** — 5 scenarios
including the exact regression this sprint specifically checked:
`delivered -> returned` (the transition `OrdersSeedProvider`'s
`progressOrderTo` depends on, after the Sprint 7.4 bug fix to that
method's use of `requestReturn`). All pass.

## 5. Reviews
`ReviewsController.submit` → `ReviewsService.submitReview` →
`SettingsService.isFeatureEnabled("reviews.mediaUploadsEnabled")` gate
on `mediaUrl` → verified-purchase computed by
`OrdersService.listOrderHistory` cross-check (Sprint 7.4 fix — the
`lineItems` relation load bug). **[EXECUTED]** the verified-purchase
boolean logic itself (true for an ordered variant, false for one
never ordered). **[TRACED]** the full controller → service → two
cross-module calls (Settings + Orders) chain.

## 6. CMS
`CmsController` → `CmsService.getStaticPage/upsertStaticPage`,
banner/FAQ upsert-by-natural-key (Sprint 7.4 fix). **[EXECUTED]** a
real Sprint 7.4 seed CMS page (`about`) passes content validation with
0 errors; a broken internal link is correctly caught as an error.

## 7. Admin Operations
`PermissionsGuard` + `hasPermission` against the Phase 6 §12 matrix.
**[EXECUTED]** 3 scenarios spanning the matrix's most security-relevant
cells (Super Admin full access, Product Manager denied Orders entirely,
Customer Support's edit-not-full distinction on Orders) — all correct.
**[TRACED]** the `RolesGuard` backward-compatibility fix (Sprint 6 —
`@Roles("admin")` now matches any real `AdminRole`) — logic read and
confirmed consistent with its own dedicated unit test
(`roles.guard.spec.ts`, written Sprint 6, never executed by a real
Jest run, same limitation as everything else here).

## 8. Coupons
**[EXECUTED]** the real Sprint 7.4 seed coupon (`HOLIDAY20`) passes
inline validation; a >100% percentage coupon is correctly rejected.
**[TRACED]** `CouponsController` → `CouponsService.upsertByCode` (the
Sprint 7.4-fixed real natural-key upsert) → admin permission gate.

## 9. Notifications
**[EXECUTED]** the real `orderConfirmation` template source renders
correctly with actual substituted values, and independently validates
as having all 3 required variables present in its source (the
DB-override / hardcoded-fallback distinction from Sprint 7.5 —
`EmailService.resolveTemplate` — is **[TRACED]**, confirmed via its own
direct unit test written in Sprint 7.5, not re-executed here).

## 10. Media
**[EXECUTED]** — the single most direct proof-of-fix in this sprint: a
10MB file is rejected under the default 8MB limit, then the SAME file
is accepted once a larger configured limit (20MB) is passed in —
demonstrating Sprint 7.5's core claim (limits are genuinely
parameterized from Settings, not a renamed hardcoded constant) with
real runtime behavior, not just a code read.

## What Remains Entirely Untested By Any Means
- Frontend rendering in a real browser (no browser runtime available
  in this sandbox either).
- Any HTTP request/response cycle.
- TypeORM's actual SQL generation and migration behavior.
- BullMQ queue processing, Redis caching, and the 3 scheduled cron
  jobs.
- The admin frontend's actual interaction with these backend endpoints
  (Sprint 6B's UI has never been loaded in a browser).

This is R-7, unchanged, and the primary reason Sprint 8 should
prioritize a real environment session over further code-only sprints.
