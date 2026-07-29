# Sprint 7.4 — Sprint Validation

Same sandbox disclosure as every prior sprint: no network, no Docker,
no installed `node_modules`, no live database.

## What Was Actually Executed and Verified (real output)

**1. Full backend TypeScript check** — 235 files (up from Sprint 7.3's
209), clean, across multiple validation passes as this sprint's
interconnected code was built (seed data → entity changes → service
methods → providers → engine → run-seed.ts rewrite).

**2. Shell-comment typo sweep** — caught 3 more live instances this
sprint (in `collections.ts`, `shipping-zone.entity.ts`, and
`reviews.provider.ts`), fixed each immediately, full-repo sweep clean
at the end.

**3. Cross-module repository access audit**, extended to
`src/database/seeds/` — clean. The two places that use `@InjectDataSource()`
raw access instead of a domain service (`SeedVerificationService` and
`OrdersSeedProvider`'s backdating query) are both explicitly documented
exceptions, not oversights the audit happened to miss.

**4. Real bugs found and fixed during this sprint's own work** — an
unusually high count, because this sprint was the first to actually
*exercise* write paths that had existed since Sprint 3-4 but were
never called with real data before:
- `CategoriesService`, `CollectionsService`, and `CmsService` had **no
  create path at all** for their entities outside a raw seed script —
  discovered while trying to seed real categories/collections/pages
  through the service layer, as this sprint's architecture requires.
- `CmsService.upsertFaq`/`.scheduleBanner` were named "upsert" but
  always inserted a new row — would have broken idempotent re-seeding
  (Sprint 7.4.7's explicit requirement) if not caught.
- `OrdersService.listOrderHistory` never loaded the `lineItems`
  relation — silently affecting every existing caller (customer order
  history, Sprint 6B's admin customer-detail page), not just this
  sprint's new code. Fixed at the source.
- `ReviewsService.submitReview` hardcoded `verifiedPurchase: false`
  with no way to ever set it `true` — added real computation.
- `OrdersService.requestReturn`'s parameter order was different from
  what I initially assumed, and — more importantly — it doesn't itself
  transition order status (only checks eligibility). Caught while
  writing `OrdersSeedProvider`, before this reached any validation
  pass.
- `ProductEntity`, `CategoryEntity`, `CollectionEntity`, and
  `StaticPageEntity` were all missing SEO fields; `BannerEntity` had no
  alt-text field. Same gap class as Sprint 7.3's `mediaUrls` finding —
  found by trying to actually populate and validate real content
  against the fields that should exist.

**5. 25 new tests**: `SeedEngineService` orchestration (11 tests —
dependency ordering, circular-dependency detection, dry-run,
duplicate-execution idempotency, validation-failure handling,
rollback-on-fatal-failure, rollback does NOT fire during dry-run),
`CouponsSeedProvider`'s inline validation logic (8 tests — valid/
invalid/boundary), and a genuine QA pass of the 5 existing Sprint 5.4
notification templates against the Content Validation Engine (7 tests,
including one negative control confirming the check isn't vacuous).

## What Requires the Real Target Environment (not executable here)

The single largest gap this sprint, more so than most: **the actual
seed run has never executed against a real database.** Every provider,
the engine's orchestration, and the verification queries are
individually reviewed and (where feasible) unit-tested, but the
end-to-end "run `run-seed.ts` against a real Postgres instance and
confirm 16 products / 5 collections / 8 customers / 8 orders / ~16
reviews actually land correctly, with the Content Validation Engine
genuinely rejecting nothing" has not happened. Given this sprint's
entire premise is "populate the platform with validated demo data,"
this is the most consequential unexecuted-code gap of any sprint so
far — flagged with unusual emphasis for that reason.

## Acceptance Criteria Checklist (as specified)

| Requirement | Status |
|---|---|
| Every seeded entity passes through the Content Validation Engine | ⚠️ True for the 8 content types Sprint 7.3 covers (Product/Category/Collection/CMS/FAQ/Banner + SEO/Accessibility helpers); Coupons/Customers/Orders/Reviews use documented lighter-weight inline checks, by design, not oversight |
| Seed process is repeatable and idempotent | ✅ Every provider upserts by natural key; 2 real idempotency bugs found and fixed in existing services along the way |
| Dependency ordering is enforced | ✅ Topological sort, tested directly (registration-order-independent) |
| Verification reports are generated automatically | ✅ `SeedVerificationService.verify()`, 9 checks, called automatically after every non-dry-run seed |
| Demo data supports both storefront and admin portal | ⚠️ Structurally sound (real relations, real business-flow-derived orders/reviews) but **never confirmed live** against either UI |

**Net assessment:** this sprint's review process caught more real,
pre-existing bugs than any prior sprint — a direct consequence of
finally exercising write paths that had sat unused since Sprint 3-4.
That's the strongest evidence yet for the standing recommendation to
run a real end-to-end session; it would likely surface more.
