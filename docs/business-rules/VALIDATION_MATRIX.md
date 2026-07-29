# Sprint 4.13 — Validation Matrix

| # | Layer | Rule | Enforced By | Test Coverage |
|---|---|---|---|---|
| 1 | Input | Email format | `class-validator` `@IsEmail` (Register/Login DTOs) | DTO-level, not unit-tested directly (framework-provided) |
| 2 | Input | Password ≥8, ≤72 chars | `@MinLength`/`@MaxLength` (RegisterDto) | DTO-level |
| 3 | Input | Rating 1–5 | `@Min(1)`/`@Max(5)` (SubmitReviewDto) | DTO-level |
| 4 | Input | Cart quantity ≥1, integer | `CartService.validateQuantity` | ✅ `cart.service.spec.ts` |
| 5 | Domain | Password change requires current-password verification | `CustomersService.changePassword` | Not yet unit-tested (Known Issues) |
| 6 | Domain | Product needs ≥1 variant to activate | `ProductsService.activate` | Not yet unit-tested (Known Issues) |
| 7 | Domain | Stock cannot go negative | `ProductsService.adjustStock` | ✅ `products.service.spec.ts` |
| 8 | Domain | Optimistic lock conflict → specific error | `ProductsService.adjustStock` (catches `OptimisticLockVersionMismatchError`) | ✅ `products.service.spec.ts` |
| 9 | Domain | Cart add/update respects real stock quantity | `CartService.assertStockAvailable` | ✅ `cart.service.spec.ts` |
| 10 | Domain | Wishlist variant must exist | `WishlistService.addItem` | Not yet unit-tested (Known Issues) |
| 11 | Domain | Wishlist duplicate rejected | `WishlistService.addItem` | Not yet unit-tested (Known Issues) |
| 12 | Domain | Order status transitions follow the state machine | `OrdersService.updateStatus` | ✅ `order-status-transitions.spec.ts` |
| 13 | Domain | Cancellation only before `shipped` | `OrdersService.requestCancellation` | ✅ `orders.service.spec.ts` (Sprint 3) |
| 14 | Domain | Return only after `delivered` | `OrdersService.requestReturn` | ✅ `orders.service.spec.ts` (Sprint 3) |
| 15 | Domain | Return window (30 days) | `OrdersService.requestReturn` | Not yet unit-tested (Known Issues — needs a mocked clock) |
| 16 | Domain | Refund eligibility by status | `OrdersService.checkRefundEligibility` | ✅ `refund-eligibility.spec.ts` |
| 17 | Domain | Review approve only from `pending` | `ReviewsService.approveReview` | ✅ `reviews.service.spec.ts` |
| 18 | Domain | Review hide not from already-`hidden` | `ReviewsService.hideReview` | ✅ `reviews.service.spec.ts` |
| 19 | Domain | Rating aggregate excludes non-approved | `ReviewsService.getReviewsForProduct` | ✅ `reviews.service.spec.ts` |
| 20 | Transaction | Order creation is all-or-nothing | `OrdersService.createOrder` + `TransactionService` | Not yet unit-tested (Known Issues — needs an integration-level test against a real/test DB, not mockable meaningfully at the unit level) |
| 21 | Security | Auth required by default, opt-out via `@Public()` | `JwtAuthGuard` | Not yet unit-tested (Sprint 3 gap, carried) |
| 22 | Security | Role check via `@Roles()` | `RolesGuard` | Not yet unit-tested (Sprint 3 gap, carried) |

**13 of 22 rules have direct unit test coverage.** The remaining 9 are
either DTO-level (covered by the validation framework itself, not
meaningfully unit-testable beyond what `class-validator`'s own test
suite already covers), or — for items 20–22 specifically — the kind of
rule that's only meaningfully testable at an integration level (a real
transaction rolling back against a real DB, a real HTTP request hitting
a real guard), which requires the live environment this sandbox doesn't
have. All are listed explicitly in Known Issues rather than left
implicit.
