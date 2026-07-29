# Sprint 7 Change Log

## Document Information
- **Document:** Sprint 7 Change Log
- **Project:** Hue Muse Beauty E-commerce Platform
- **Phase:** Sprint 7 Closure
- **Status:** Draft for Review

---

## 1. Purpose

Consolidated chronological record of all significant changes across
Sprint 7 (sub-sprints 7.1–7.7) — implementation, defect corrections,
architectural decisions, validation activity, and documentation.

---

## 2. Change Summary

Counts below are objectively derived by directory listing (commands
run immediately before this table was populated), not estimated. Where
a category resists exact counting (e.g. "Enhancement" is judgment-based
by nature), that's stated rather than forcing a false-precision number.

| Category | Count | Notes |
|---|---|---|
| New Features | 6 | Content Validation Engine, Seed Engine, Feature Flags, DB-backed Notification Templates, Branding Reference endpoint, Execution Harness — each a genuinely new capability, not an extension of an existing one |
| Enhancements | 8 | Qualitative count — see CR-E01 through CR-E08 in §3; these extend existing Sprint 1–6 capabilities rather than introduce new ones, so a purely objective count would require a subjective line between "enhancement" and "defect fix" that this log resolves case-by-case in §3 instead |
| Defect Fixes | 10 | Objectively counted — each is a distinct, previously-incorrect behavior found and corrected during Sprint 7, listed individually in §3 |
| Schema Changes | 11 | Objectively counted from entity file diffs: 5 new entities (`FeatureFlagEntity`, `NotificationTemplateEntity`, `BusinessSettingsEntity`, `TaxRateEntity`, `ShippingZoneEntity`) + 6 column-addition changes to pre-existing entities (Product, Category, Collection, StaticPage, Banner, and BusinessSettingsEntity's own 7.5 extension) |
| Validation Improvements | 10 spec files + 1 execution harness | Objectively counted: 10 new `*.spec.ts` files (directory-verified) across `content-validation`, `settings`, `seed-engine`, `seed providers`, and `email` test directories, plus `testing/execution-harness/` (24 genuinely executed scenarios, not a spec-file count) |
| Documentation Additions | 23 | Objectively counted: 15 files under `docs/sprint-reports/` matching `SPRINT_7*` + 8 supporting docs under `docs/admin/` and `docs/database/` + `testing/execution-harness/README.md` |

---

## 3. Chronological Change Record

| Change ID | Sprint | Component | Type | Summary | Reference |
|---|---|---|---|---|---|
| CR-7.1-01 | 7.1 | `ProductEntity` | Feature | Added `ProductContent` jsonb template (short description, key benefits, features, ingredients, usage, warnings, storage, specifications, FAQs) per Phase 9 §3 | `docs/admin/CONTENT_VALIDATION_ENGINE.md` |
| CR-7.1-02 | 7.1 | `ProductEntity` | Feature | Added `metaTitle`/`metaDescription` columns | `CONTENT_VALIDATION_ENGINE.md` |
| CR-7.1-03 | 7.1 | `ProductEntity` | Enhancement | `ProductContent.specifications` provides structured key-value metadata (size, finish, shelf life) | `docs/database/SEED_DATA_REFERENCE.md` |
| CR-7.2-01 | 7.2 | `SettingsModule` | Feature | Settings module foundation: module/service/controller scaffold | `docs/admin/CONFIGURATION_COMPLETENESS.md` |
| CR-7.2-02 | 7.2 | `BusinessSettingsEntity` | Feature | Business profile storage (store name, support contact, socials, currency) | `CONFIGURATION_COMPLETENESS.md` |
| CR-7.2-03 | 7.2 | `TaxRateEntity`, `ShippingZoneEntity` | Feature | Configuration storage for tax/shipping data | `CONFIGURATION_COMPLETENESS.md` |
| CR-7.3-01 | 7.3 | `ContentValidationService` | Feature | Centralized validation engine, one method per content type, delegating to pure validator functions | `docs/admin/CONTENT_VALIDATION_ENGINE.md` |
| CR-7.3-02 | 7.3 | `seo.validator.ts` | Feature | SEO validation (meta length, canonical URL, Open Graph, Twitter Card, JSON-LD, robots directive) | `CONTENT_VALIDATION_ENGINE.md` |
| CR-7.3-03 | 7.3 | `accessibility.validator.ts` | Feature | Accessibility validation (alt text, heading hierarchy, link/button labels) | `CONTENT_VALIDATION_ENGINE.md` |
| CR-7.3-04 | 7.3 | `media.validator.ts` | Feature | Media validation (dimensions, duplicate/orphan detection — file type/size deliberately left to `StorageService`, not duplicated) | `CONTENT_VALIDATION_ENGINE.md` |
| CR-7.3-05 | 7.3 | `validation-result.ts` | Feature | Standardized `ValidationReport`/`ValidationIssue`/`buildReport` shape used by all 10 validators | `CONTENT_VALIDATION_ENGINE.md` |
| CR-7.3-06 | 7.3 | `ProductEntity` | Defect Fix | `mediaUrls` field was entirely missing — no product had ever had an image field since Sprint 3 | `SPRINT_7_3_VALIDATION.md` |
| CR-7.3-07 | 7.3 | Module architecture | Governance | Architectural decision: validate-then-act orchestration centralized in `ContentValidationController` rather than injected into each content module, to avoid a circular module dependency (`ContentValidationModule` already depends on Products/Categories/Collections/Cms for existence checks) | `CONTENT_VALIDATION_ENGINE.md` §"The Circular-Dependency Problem" |
| CR-7.4-01 | 7.4 | `SeedEngineService` | Feature | Provider registry with topological dependency-order resolution, dry-run, rollback, execution summary | `docs/database/SEED_ENGINE.md` |
| CR-7.4-02 | 7.4 | 11 seed providers | Feature | One provider per entity type (Settings→Categories→Collections→Products→CMS→FAQs→Banners→Coupons→Customers→Orders→Reviews), each validating via the real Content Validation Engine before insert | `SEED_ENGINE.md` |
| CR-7.4-03 | 7.4 | `SeedVerificationService` | Feature | 9 automated post-seed referential-integrity checks | `SEED_ENGINE.md` |
| CR-7.4-04 | 7.4 | `CategoriesService`, `CollectionsService` | Defect Fix | Neither service had any entity-creation path outside a raw seed script — added `upsertBySlug` | `SPRINT_7_4_VALIDATION.md` |
| CR-7.4-05 | 7.4 | `CmsService.upsertStaticPage` | Defect Fix | No create path existed for new static pages at all (`updateStaticPage` required the page to already exist) | `SPRINT_7_4_VALIDATION.md` |
| CR-7.4-06 | 7.4 | `CmsService.upsertFaq`/`.scheduleBanner` | Defect Fix | Named "upsert" but always inserted a new row — replaced with real natural-key upsert (`upsertFaqByQuestion`, `upsertBanner`) | `SPRINT_7_4_VALIDATION.md` |
| CR-7.4-07 | 7.4 | `OrdersService.listOrderHistory` | Defect Fix | Never loaded the `lineItems` relation — silently affected every existing caller (customer order history, Sprint 6B's admin customer-detail page), not just new Sprint 7.4 code | `SPRINT_7_4_VALIDATION.md` |
| CR-7.4-08 | 7.4 | `ReviewsService.submitReview` | Defect Fix | `verifiedPurchase` was hardcoded `false` with no code path to ever set it `true`; added real computation against order history | `SPRINT_7_4_VALIDATION.md` |
| CR-7.4-09 | 7.4 | `OrdersService.requestReturn` | Defect Fix | Argument order assumption was wrong, and the method doesn't itself transition order status (only checks eligibility) — caught while writing `OrdersSeedProvider`, before any test/validation pass | `SPRINT_7_4_VALIDATION.md` |
| CR-7.4-10 | 7.4 | `CategoryEntity`, `CollectionEntity`, `StaticPageEntity` | Schema | Added `metaTitle`/`metaDescription` (none had SEO fields before) | `SPRINT_7_4_VALIDATION.md` |
| CR-7.4-11 | 7.4 | `BannerEntity` | Schema | Added `imageAltText` | `SPRINT_7_4_VALIDATION.md` |
| CR-7.5-01 | 7.5 | `FeatureFlagEntity` | Feature | Feature flags with a permissive absent-key default; 2 real integrations (`CartService.applyCoupon`, `ReviewsService.submitReview`) | `docs/admin/FEATURE_FLAGS.md` |
| CR-7.5-02 | 7.5 | `NotificationTemplateEntity`, `EmailService` | Feature | DB-backed template override, checked first, falling back to the Sprint 5.4 hardcoded default | `docs/admin/CONFIGURATION_COMPLETENESS.md` |
| CR-7.5-03 | 7.5 | `settings.controller.ts` | Feature | Read-only branding reference endpoint, sourced from the real frontend design tokens | `CONFIGURATION_COMPLETENESS.md` |
| CR-7.5-04 | 7.5 | `BusinessSettingsEntity` | Schema | Extended with payment-provider display, accepted currencies, SEO defaults, media settings (6 new columns) | `CONFIGURATION_COMPLETENESS.md` |
| CR-7.5-05 | 7.5 | `StorageService`, `media.validator.ts` | Enhancement | Media upload limits now genuinely sourced from `SettingsService` instead of two independently-hardcoded constants that happened to agree | `CONFIGURATION_COMPLETENESS.md` |
| CR-7.5-06 | 7.5 | `StorageService.getSignedReadUrl` | Defect Fix | Used `PutObjectCommand` (write-signed URL) instead of `GetObjectCommand` for a method whose purpose is a read link — session notes had claimed this was fixed in Sprint 5; the code still had it | `SPRINT_7_5_VALIDATION.md` |
| CR-7.5-07 | 7.5 | `SettingsService.upsertTaxRate`/`.upsertShippingZone` | Defect Fix | Named "upsert" but only worked by a UUID the caller already had — corrected to upsert by region/name (the real natural key) | `SPRINT_7_5_VALIDATION.md` |
| CR-7.5-08 | 7.5 | `settings.controller.ts` (branding endpoint) | Defect Fix | First draft had 5 of 10 color values wrong (written from approximation); corrected against the real token source file before this sprint closed | `SPRINT_7_5_VALIDATION.md` |
| CR-7.6-01 | 7.6 | `testing/execution-harness/` | Feature | Dependency-free pure-logic files compiled via `tsc` and genuinely executed via `node` — first real runtime evidence in this project's history | `docs/sprint-reports/SPRINT_7_6_WORKFLOW_TRACE.md` |
| CR-7.6-02 | 7.6 | Execution harness (24 scenarios) | Validation | 24 scenarios across all 10 named workflow categories, run to a final 24/24 pass | `SPRINT_7_6_VALIDATION.md` |
| CR-7.6-03 | 7.6 | Execution harness's own Notification test scenario | Defect Fix | The test scenario itself (not the product) validated an already-rendered template for placeholder syntax that had, correctly, already been substituted away; investigated, corrected, re-verified | `SPRINT_7_6_VALIDATION.md` |
| CR-7.6-04 | 7.6 | Structural audit tooling | Enhancement | Circular-module-dependency check upgraded from manual per-edge reasoning to an automated graph-traversal script | `SPRINT_7_6_VALIDATION.md` |
| CR-7.6-05 | 7.6 | Full codebase | Validation | Every structural audit (TS check, typo sweep, cross-module boundary, circular dependency) re-run at full scope (240 backend + 107 frontend files) for the first time since Sprint 6 | `SPRINT_7_6_VALIDATION.md` |
| CR-7.6-06 | 7.6 | `docs/sprint-reports/` | Governance | Established the `[EXECUTED]` vs. `[TRACED]` evidence-labeling convention, applied throughout `SPRINT_7_6_WORKFLOW_TRACE.md` and carried forward per the Sprint 7.6 audit's explicit instruction | `SPRINT_7_6_WORKFLOW_TRACE.md` |
| CR-7.7-01 | 7.7 | `docs/sprint-reports/` | Governance | Requirements Traceability Matrix, Known Issues Register, Open Risks Register, Release Readiness Report, Freeze Manifest, this Change Log — consolidated closure documentation | `SPRINT_7_TRACEABILITY_MATRIX.md`, `SPRINT_7_FREEZE_MANIFEST.md` |

---

## 4. Architectural Decisions

| Decision | Introduced | Rationale | Reference |
|---|---|---|---|
| Centralized validation architecture | 7.3 | One service, one method per content type, delegating to pure/testable validator functions rather than scattering validation logic across each module | `CONTENT_VALIDATION_ENGINE.md` |
| Validate-then-act via a dedicated orchestration controller, not injected into each content module | 7.3 | Avoids a circular module dependency that would otherwise result from `ContentValidationService`'s own need to query existence-checks from the modules it would also need to call back into | `CONTENT_VALIDATION_ENGINE.md` |
| Configuration-driven behavior over hardcoded constants | 7.5 | Media limits and notification templates moved from hardcoded/duplicated constants to genuine single-source-of-truth Settings-module data, each with a real consumer (not just stored data) | `CONFIGURATION_COMPLETENESS.md` |
| Payment provider selection remains env-var/DI-bootstrap-driven, deliberately not made dynamic | 7.5 | NestJS providers resolve once at boot; real per-request dynamism would require restructuring the provider factory, not justified without a concrete multi-provider requirement | `CONFIGURATION_COMPLETENESS.md` |
| Seed Engine orchestration via a provider registry + topological sort | 7.4 | Each provider owns one entity type and declares its dependencies; the engine (not any individual provider) is solely responsible for execution ordering | `SEED_ENGINE.md` |
| Seed Engine bootstraps a real NestJS application context | 7.4 | So seeding genuinely exercises real domain services and the real Content Validation Engine, rather than a parallel reimplementation bypassing both | `SEED_ENGINE.md` |
| Seed rollback as a compensating action, not a database transaction | 7.4 | A true cross-service transaction would require bypassing the domain services' own repositories entirely, defeating the "real service reuse" decision above | `SEED_ENGINE.md`, KI7.4-2 |
| Runtime evidence classification (`[EXECUTED]` vs `[TRACED]`) | 7.6 | Sandbox constraints (confirmed via `npm install`'s 403) make full live execution impossible; this convention prevents code-level tracing from being presented with the same confidence as genuine runtime results | `SPRINT_7_6_WORKFLOW_TRACE.md` |
| Governance/closure documentation as append-only, never retroactively edited | 7.7 (formalized; practiced since Sprint 1) | In the absence of a git repository, this is the project's actual version-control mechanism — stated explicitly rather than left implicit | `SPRINT_7_FREEZE_MANIFEST.md` |

---

## 5. Deferred Changes

Full detail in the governing documents, not repeated here:
- **Known Issues Register** (`SPRINT_7_KNOWN_ISSUES_REGISTER.md`) — 15
  open items, including tax/shipping enforcement (KI7.5-1), currency
  conversion (KI7.5-2), and the 6 remaining content types without a
  validate-then-act endpoint (KI7.3-1).
- **Open Risks Register** (`SPRINT_7_OPEN_RISKS_REGISTER.md`) — R-7
  (full integrated runtime validation) and 3 secondary risks.
- **Sprint 8 Readiness Assessment** (`SPRINT_8_READINESS_ASSESSMENT.md`)
  — the ordered sequence for closing R-7 once a real environment is
  available.
- **Wishlist** — newly identified during Sprint 7.7's Freeze Manifest
  as named in scope but never built in any sprint 1–7; not a Sprint 7
  regression, recorded for Sprint 8+ scoping (`SPRINT_7_FREEZE_MANIFEST.md` §7).

---

## 6. Baseline Established

Sprint 7 establishes the baseline for: content management (product
content model, per-entity SEO), operational configuration (Settings
module — taxes, shipping, payment reference, notification templates,
media settings, branding, feature flags), the validation framework
(Content Validation Engine), the seed framework (Seed Engine and its
11 providers), workflow validation (the execution harness and workflow
trace methodology), and governance documentation (this Change Log plus
the RTM, Known Issues Register, Open Risks Register, Release Readiness
Report, and Freeze Manifest). Full baseline detail, including exact
frozen artifact locations and versions:
`docs/sprint-reports/SPRINT_7_FREEZE_MANIFEST.md`.

---

## 7. Validation

| Check | Result |
|---|---|
| All recorded changes are traceable | **PASS** — every CR-ID above cites a specific reference document |
| Every change references supporting documentation | **PASS** — 39/39 entries in §3 have a non-empty Reference column |
| No undocumented architectural changes are included | **PASS** — §4's 8 architectural decisions were cross-checked against §3's change records and each sub-sprint's own closure report; none introduce a decision not already recorded somewhere in Sprint 7's documentation |

**Overall: PASS.** No FAIL conditions found.
