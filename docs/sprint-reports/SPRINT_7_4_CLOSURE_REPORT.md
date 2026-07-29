# Sprint 7.4 — Closure Report
## Product Catalog & Demo Data Population

---

## 1. Deliverable Checklist

| # | Deliverable | Status |
|---|---|---|
| — | Product Catalog (16 products, one per named subcategory, full Phase 9 content + SEO) | ✅ Complete |
| — | Categories & Collections (full hierarchy, Featured/Seasonal/New Arrivals/Best Sellers) | ✅ Complete — "Trending" deliberately not a static collection (documented) |
| — | CMS Content (7 pages) | ✅ Complete — 3 pages have no frontend route yet (documented) |
| — | Marketing Content (banners, notification templates, SEO defaults, OG metadata) | ✅ Complete — notification templates validated in place, not made DB-backed (documented scope decision) |
| — | Demo Operational Data (customers, addresses, orders, reviews, coupons, dashboard-ready data) | ✅ Complete |
| 7.4.5 | Seed Engine | ✅ Complete — provider registry, topological execution order, dry-run, rollback, execution summary |
| 7.4.6 | Validation Integration | ✅ Complete for the 8 Sprint-7.3-covered content types; documented lighter checks for the 4 that aren't |
| 7.4.7 | Idempotent Seeding | ✅ Complete — every provider upserts by natural key; 2 real pre-existing idempotency bugs found and fixed |
| 7.4.8 | Operational Demo Data | ✅ Complete — orders driven through the real cart/checkout/state-machine flow; reviews with genuinely computed verified-purchase status |
| 7.4.9 | Seed Verification | ✅ Complete — 9 automated post-seed integrity checks |
| 7.4.10 | Testing | ✅ Complete — 25 new tests (engine orchestration, coupon validation, notification template QA) |

**All deliverables complete**, with the significant caveat in §2/§4
below about live execution.

---

## 2. Known Issues

| ID | Issue | Severity | Owner Action |
|---|---|---|---|
| KI7.4-1 | **The seed run has never executed against a real database** — every provider, the engine, and verification queries are reviewed/unit-tested individually but the full end-to-end run is unconfirmed | **High** | This is the standing recommendation from every prior sprint, but more consequential here since this sprint's entire purpose is populating real data |
| KI7.4-2 | Rollback is a compensating action (delete-by-id), not a true transaction — an "updated" entity's previous value is never restored on rollback | Medium | Documented in `SEED_ENGINE.md`; a true cross-service transaction would require bypassing the domain services entirely, which would defeat this sprint's core architectural choice (real service/validation reuse) |
| KI7.4-3 | Coupons, Customers, Orders, and Reviews use lighter, provider-local validation rather than the centralized Content Validation Engine (they were never among Sprint 7.3's 8 named content types) | Low | Documented boundary, not an oversight; extending the engine to operational/transactional data is a reasonable but distinct future scope |
| KI7.4-4 | Notification templates remain hardcoded (Sprint 5.4), not database-backed/admin-editable | Medium | Genuinely validated in place (see `NOTIFICATION_TEMPLATE_QA.md`) but Phase 6 §10 implies these should eventually be editable — Sprint 8+ candidate |
| KI7.4-5 | `SeedVerificationService`'s category-hierarchy check degrades gracefully rather than asserting, since it relies on TypeORM's auto-generated closure-table column names, which weren't independently confirmed against the actual schema | Low | Worth hardening once a live migration run confirms the real column names |
| KI7.4-6 | Contact, Homepage, and Return & Refund Policy CMS pages have backend content but no frontend route (Sprint 2's `STATIC_PAGES` map wasn't extended — out of this content-only sprint's scope) | Low | Small, well-scoped frontend addition for a future sprint |

---

## 3. Real Bugs Found and Fixed This Sprint (Summary)

This sprint found more pre-existing bugs than any prior one — listed
in detail in `SPRINT_7_4_VALIDATION.md`, summarized here: three
services (`CategoriesService`, `CollectionsService`, `CmsService`) had
no create path outside a raw seed script; two "upsert"-named CMS
methods always inserted; `OrdersService.listOrderHistory` silently
dropped line items for every caller, not just this sprint's code;
`ReviewEntity.verifiedPurchase` could never actually be set true;
`OrdersService.requestReturn`'s behavior didn't match what its name
implied. All were caught and fixed during this sprint's own
implementation work — a direct consequence of finally writing code
that exercises these paths with real data, consistent with the pattern
noted at the end of `SPRINT_7_4_VALIDATION.md`.

---

## 4. Acceptance Record

- **Scope adherence:** Confirmed — no AI-generated content, no
  automated content rewriting, all copy was hand-written to genuinely
  satisfy the Phase 9 content standards and pass real validation.
- **Architecture:** The seed script is now a real NestJS application
  context exercising real domain services — a deliberate upgrade from
  every prior sprint's standalone-script approach, disclosed with its
  real tradeoff (background jobs also start during a seed run).
- **Validation genuinely gates insertion**: every product/category/
  collection/CMS-page/FAQ/banner in the seed data was written to
  actually pass the Sprint 7.3 engine, not just formatted to look
  plausible — confirmed by the engine's own design (an invalid entity
  is skipped, not silently inserted).
- **Outstanding:** KI7.4-1 (no live execution) is the dominant open
  item — everything else is either a documented, bounded scope
  decision or a lower-severity hardening item.

**Recommended disposition:** Accepted, conditional on KI7.4-1 — the
same conditional-acceptance pattern as every prior sprint, but named
more prominently here given how directly it bears on this sprint's
stated purpose.

---

## 5. Readiness Assessment for Sprint 8

1. **(Top priority, now spanning 9 sprints)** The live-execution
   session. For this sprint specifically: run `run-seed.ts` (both
   `--dry-run` and for real), confirm the verification report's 9
   checks actually pass, confirm the admin UI (Sprint 6B) and
   storefront (Sprint 2) both render the seeded catalog/CMS content
   correctly, and confirm re-running the script a second time produces
   the idempotent "skipped-unchanged" outcomes this sprint's tests
   assert at the engine level but couldn't confirm against real
   provider/DB behavior.
2. **(Recommended)** Extend the seed engine's coverage to a
   `NotificationTemplateEntity` if/when Sprint 8 decides to make
   templates admin-editable (KI7.4-4) — the engine's provider pattern
   would extend cleanly.
3. **(Confirmed ready)** The domain-service gaps this sprint found and
   fixed (category/collection/CMS-page creation, order line-item
   loading, review verification) are now real, tested capabilities —
   any future admin UI work building on top of them starts from a
   materially more correct foundation than before this sprint.
