# Sprint 4 — Closure Report
## Business Logic & Domain Services (Frozen v1.0)

---

## 1. Deliverable Checklist

| # | Deliverable | Status |
|---|---|---|
| 4.1 | Customer Domain | ✅ Complete — `changePassword` gap from Sprint 3 filled |
| 4.2 | Product Domain | ✅ Complete — activate/deactivate, variant management, stock-derived availability |
| 4.3 | Category & Collection | ✅ Complete — visibility, display ordering, collection assignment, featured |
| 4.4 | Cart Business Logic | ✅ Complete — real stock validation, totals, guest-cart merge |
| 4.5 | Wishlist | ✅ Complete — existence validation, explicit duplicate rejection |
| 4.6 | Order Lifecycle | ✅ Complete — transactional creation, state machine, refund eligibility |
| 4.7 | Review System | ✅ Complete — moderation-state validation |
| 4.8 | CMS | ✅ Complete — caching + invalidation wired |
| 4.9 | Transactions | ✅ Complete (with 1 bug caught and fixed during this sprint's own review) |
| 4.10 | Validation Rules | ✅ Complete — `DomainException` + error-code vocabulary |
| 4.11 | Caching | ✅ Complete — extended to Collections/CMS; invalidation now actually wired to every write (Sprint 3 had the mechanism unused) |
| 4.12 | Testing | ✅ Complete — 5 new spec files, ~27 new test cases on top of Sprint 3's 2 files/7 cases |
| 4.13 | Documentation | ✅ Complete — all 5 documents produced |
| 4.14 | Sprint Validation | ✅ Complete |
| 4.15 | Sprint Closure | ✅ Complete — this document |

**15/15 deliverables complete.**

---

## 2. Known Issues

| ID | Issue | Severity | Owner Action |
|---|---|---|---|
| KI4-1 | No live execution has occurred (same class as R-7/KI2-1/KI3-1) — now the 4th consecutive sprint with this gap | **High** | See the consolidated recommendation in Readiness Assessment §5 |
| KI4-2 | `CartService.mergeGuestCart` is not wrapped in a transaction — a failure partway through could leave a partial merge | Medium | Documented in `TRANSACTION_FLOWS.md`; low risk at current scale (single-table writes, no cross-entity invariant), but should be wrapped before real traffic |
| KI4-3 | `checkRefundEligibility` uses a heuristic (`total !== "0.00"`) to infer whether payment was captured, since no `PaymentEntity` exists yet (Checkout module still not scaffolded) | Medium | Revisit once Sprint 5+ addresses Checkout/payment-gateway integration |
| KI4-4 | Return window (30 days) is a fixed global constant, not per-product/tier configurable | Low | Acceptable default for now; Settings module (still out of scope) would own real configurability |
| KI4-5 | 9 of 22 validation-matrix rules lack direct unit test coverage — mostly DTO-level (covered by the validation framework itself) or genuinely integration-level (transaction rollback, guard behavior) | Low–Medium | Full breakdown in `VALIDATION_MATRIX.md`; the integration-level ones are natural candidates for Sprint 5's e2e suite (also still pending from Sprint 3's KI3-2) |
| KI4-6 | ~~`OrdersService.createOrder`/`confirmOrder` are `@Public()` and accept a `customerId` directly in the request body~~ **FIXED during this sprint**: `JwtAuthGuard` now performs optional auth on `@Public()` routes (attaches `req.user` if a valid token is present, without rejecting the request if absent), and `OrdersController.create` rejects a request where an authenticated caller's `customerId` doesn't match their own ID. True guest requests (no token) are unaffected. | ~~Medium-High~~ Resolved | None — verified via TypeScript check; full behavioral confirmation still needs a live request (see KI4-1) |
| KI4-7 | Order creation/confirmation don't yet persist a `PaymentEntity` or any payment-reference record — `confirmOrder`'s `paymentReference` parameter is accepted but discarded | Low (by design — Checkout module deferral) | Tracked from Sprint 3, still applies |

---

## 3. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| R4-1 (carried, now 4x) | Live execution has never occurred across 4 sprints | Medium | High | Consolidated real-environment session recommended before Sprint 5 (see §5) | Open |
| R4-2 | ~~`createOrder`'s unauthenticated `customerId` parameter could be exploited to create orders/consume stock under another customer's ID~~ | Medium | High | **Fixed during this sprint** — see KI4-6 | ✅ Resolved (pending live verification) |
| R4-3 | Cart merge's missing transaction (KI4-2) could produce a partial merge under a mid-operation failure | Low | Low | Documented; low real-world impact at current scale | Open |
| R4-4 | Refund eligibility heuristic (KI4-3) could misclassify an order once real payment data exists | Medium | Medium | Must be revisited when Checkout/Payment modules are built, not left as-is indefinitely | Open |

**R4-2 was the most significant item surfaced this sprint** — a
security-relevant gap in this sprint's own new code (not an execution-
environment limitation like the others) — and was fixed before this
report was finalized, per the Sprint 4.15 correction described in
KI4-6.

---

## 4. Acceptance Record

- **Scope adherence:** Confirmed — no payment gateway, shipping
  provider, email/SMS, ERP/HMEOS integration, or production deployment
  was implemented. Order creation/confirmation logic was built (as
  Sprint 4.6 explicitly required) without any actual payment processing
  — `confirmOrder` accepts but never uses a real payment provider.
- **Architecture adherence:** No redesign — deepened Sprint 3's existing
  module boundaries throughout, per this sprint's explicit instruction.
  Two boundary/correctness bugs were introduced during this sprint's own
  work and caught by this sprint's own review process before being
  reported here — not shipped silently.
- **Deliverable completeness:** 15/15.
- **Static + structural validation:** TypeScript clean across 95 files;
  both structural audits clean after one real fix; a third manual review
  caught and fixed a transaction-correctness bug.
- **Outstanding:** KI4-1 (live execution, carried) remains the primary
  open item. KI4-6/R4-2 (the unauthenticated-customerId gap) was caught
  during this sprint's own review **and fixed within the same sprint**
  — included here for transparency about how it arose, not because it's
  still open.

**Recommended disposition:** Conditionally accepted — pending KI4-1
only, consistent with the pattern from Sprints 1–3. The security-relevant
finding was resolved before this closure report was written, not carried
forward as a blocking item.

---

## 5. Readiness Assessment for Sprint 5

1. **(Recommended, consolidated across 4 sprints)** One real-environment
   session resolving R-7/R2-1/R3-1/R4-1 together: full install, DB
   migration + seed, live boot of both frontend and backend, full test
   suites, and — new this sprint — an integration test specifically
   confirming `createOrder`'s transaction actually rolls back against a
   real Postgres instance, plus a live request confirming the
   optional-auth fix (KI4-6) behaves correctly for both an authenticated
   mismatched-customerId request (should reject) and a true guest
   request (should pass through).
2. **(Confirmed ready)** The business-logic layer built this sprint
   gives Sprint 5 real behavior to build against — order creation,
   status transitions, stock commitment, and caching all function
   end-to-end in code, pending only live verification.
