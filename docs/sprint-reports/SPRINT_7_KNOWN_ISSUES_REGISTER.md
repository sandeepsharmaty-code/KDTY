# Sprint 7 — Consolidated Known Issues Register

Consolidates every Known Issue from Sprints 7.3–7.6's individual
closure reports into one register. IDs are unchanged from their
origin report (no renumbering) so this register and each sub-sprint's
closure report always agree. Two Sprint 6B issues are carried forward
because they're still open and were directly referenced by Sprint 7
work (KI6B-1/7 relate to media/product-creation UI that Sprint 7
touched but didn't resolve).

| Issue ID | Description | Impact | Severity | Planned Resolution Sprint |
|---|---|---|---|---|
| KI6B-1 | Media Library shows only session-uploaded images — no backend listing endpoint for all previously-uploaded objects | Admin can't browse the full media library, only what they just uploaded | Low | Sprint 8+ |
| KI6B-7 | No guided single-product creation form — CSV import is the only bulk path | An admin without CSV/API access can't add one new product through the UI | Medium | Sprint 8+ |
| KI7.3-1 | Only Product has a wired "validate-then-act" orchestration endpoint — 6 other content types' validators exist and are tested but aren't called from any write path | New Category/Collection/CMS/Banner/FAQ/Media/Notification-Template content can be saved without passing through the Content Validation Engine | Medium | Sprint 8+ |
| KI7.3-2 | Validation orchestration is centralized in one controller rather than distributed per-module — a developer adding a new "publish" action elsewhere won't automatically get validation | Process/discoverability risk, not a functional defect | Low-Medium | Ongoing (process fix — lint rule or review checklist) |
| KI7.3-3 | `ProductEntity.mediaUrls` has no admin UI to populate it | Same UI gap as KI6B-7 | Low | Sprint 8+ |
| KI7.4-2 | Seed Engine rollback is a compensating action (delete-by-id), not a true DB transaction — an "updated" entity's prior value is never restored on rollback | A failed seed run leaves updated rows at their new (not original) values | Medium | Not planned — architectural tradeoff, documented as accepted |
| KI7.4-3 | Coupons/Customers/Orders/Reviews use lighter provider-local validation, not the centralized Content Validation Engine | Consistent, bounded gap — these were never among Sprint 7.3's 8 named content types | Low | Not planned — documented boundary |
| KI7.4-4 | Notification templates existed only as hardcoded Sprint 5.4 code until Sprint 7.5 — **superseded**, see Status | Resolved in Sprint 7.5 (`NotificationTemplateEntity`) | Medium → Closed | Closed (Sprint 7.5) |
| KI7.4-5 / KI7.6-2 | `SeedVerificationService`'s category-hierarchy check relies on assumed TypeORM closure-table column names, unconfirmed against a real schema | Verification report may under- or over-report on this one check until confirmed live | Low | Sprint 8 (first live migration run) |
| KI7.4-6 | Contact, Homepage, and Return & Refund Policy CMS pages have backend content but no frontend route | Content exists but isn't reachable via the storefront yet | Low | Sprint 8+ (small frontend addition) |
| KI7.5-1 | Tax rates and shipping zones are configurable but not applied to checkout math | Configuring a tax rate or shipping zone has no visible effect on order totals yet | Medium | Sprint 8+ |
| KI7.5-2 | `acceptedCurrencies` is stored but nothing converts prices — platform remains USD-only regardless of configuration | Same category as KI7.5-1 | Low | Sprint 8+ (if multi-currency remains a goal) |
| KI7.5-3 | Payment provider selection remains env-var/DI-bootstrap-driven, not dynamically switchable from Settings | Real architectural constraint, not an oversight — documented rationale in `CONFIGURATION_COMPLETENESS.md` | Low | Not planned unless a concrete multi-provider need arises |
| KI7.5-4 | `upsertNotificationTemplate` has no direct unit test | Lower confidence in this one method vs. its siblings, which are tested | Low | Any future sprint (quick addition) |
| KI7.5-5 | `search.enabled` feature flag is seeded but gates nothing — search doesn't exist as a feature | No functional impact — intentionally reserved, not a placeholder pretending to work | Low | Whenever search is built |
| KI7.6-1 | Execution harness covers only dependency-free pure functions — no NestJS service, TypeORM entity, or controller was ever instantiated or run | Structural ceiling of what's executable without `node_modules`; not closeable without a real environment | Medium | Sprint 8 (real-environment session) |

## Superseded / Closed This Sprint Arc
- **KI7.4-4** (notification templates hardcoded) — closed by Sprint 7.5's `NotificationTemplateEntity` + `EmailService` fallback logic.

## Status Summary
15 open, 1 closed within the Sprint 7 arc itself. Zero issues rated
**High** severity remain — the one recurring High-severity item across
every sub-sprint's own closure report (live execution) is tracked as
**Risk R-7**, not a Known Issue, per this register's scope boundary
(see `SPRINT_7_OPEN_RISKS_REGISTER.md`).
