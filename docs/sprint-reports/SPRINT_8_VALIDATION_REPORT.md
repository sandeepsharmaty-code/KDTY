# Sprint 8 — Validation Report
## System Integration Testing & Quality Assurance

Evidence taxonomy, extended from Sprint 7.6's `[EXECUTED]`/`[TRACED]`
per the audit's instruction to keep distinguishing evidence types:

- **[EXECUTED-PURE]** — dependency-free TypeScript, compiled and run
  with `node` (Sprint 7.6's original method).
- **[EXECUTED-BROWSER]** — genuine headless Chromium rendering via
  Playwright (new this sprint).
- **[EXECUTED-IMAGE]** — genuine image generation/measurement via
  `sharp` (new this sprint).
- **[EXECUTED-SQL]** — genuine SQL execution via SQLite (new this
  sprint; **not** Postgres — caveated at every use).
- **[TRACED]** — code read and confirmed consistent; no execution of
  any kind occurred.

---

## 8.2 System Integration Testing

Full application boot (backend + frontend + Postgres + Redis) is
blocked (`SPRINT_8_ENVIRONMENT_SETUP_REPORT.md`). No customer or admin
platform workflow listed in Sprint 8's scope could be executed
end-to-end through a real HTTP request this sprint. Every item below
is **[TRACED]** — code-level confirmed, not executed — building on
Sprint 7.6's `SPRINT_7_6_WORKFLOW_TRACE.md`, not repeating it.

| Area | Status |
|---|---|
| Customer: registration/login, browsing, search/filter, product detail, cart, coupons, checkout, orders, reviews, CMS | [TRACED] — unchanged since Sprint 7.6; re-confirmed via this sprint's full regression TS check (backend 240 files, frontend 107 files, both clean) |
| Customer: Wishlist | **Not implemented** — confirmed no wishlist module exists in this codebase (any sprint 1–7); not a defect, a scope gap, recorded in the Defect Register as DEF-8-02 for visibility |
| Admin: authentication, dashboard, product/category/collection management, CMS, reports, coupons, settings, media, audit log | [TRACED] — unchanged since Sprint 6B/7.6 |

---

## 8.3 Database Validation

| Check | Evidence |
|---|---|
| Migrations execute successfully | **Not applicable — none have ever been generated** (confirmed: `backend/src/database/migrations/` contains only its own README). This is itself the finding, not a gap in this report. |
| Schema integrity | [TRACED] — 31 entity files reviewed; no structural inconsistency found |
| Foreign-key relationships | **[EXECUTED-SQL]** — `testing/execution-harness/sprint8/relational-integrity.spec.py`. 6/6 real scenarios pass: valid Product→Category, Order→Customer, and Review→Variant+Customer inserts succeed; a Product referencing a non-existent Category is genuinely rejected by a real FK constraint; a duplicate Category slug is genuinely rejected by a real UNIQUE constraint. **Caveat, stated plainly: this is SQLite, not the project's actual PostgreSQL** — TypeORM's real generated DDL, Postgres-specific types (`jsonb`, `uuid`, `timestamptz`), and TypeORM's own migration behavior are NOT exercised by this. What's genuinely tested is the relational STRUCTURE the entities describe, expressed as real SQL and given real invalid data to reject. |
| Seed data integrity | [TRACED] — Sprint 7.4's Seed Engine and its 9 verification checks reviewed; never executed against a real database (unchanged this sprint) |
| Transaction handling | [TRACED] — `OrdersService.createOrder`'s real transaction code reviewed; not executable without Postgres |
| Rollback behaviour | [TRACED] — Seed Engine's compensating-action rollback (KI7.4-2) reviewed; `SeedEngineService.spec.ts`'s mocked rollback-ordering test re-confirmed structurally sound this sprint, not re-executed (Jest itself remains uninstallable) |

---

## 8.4 API Validation

All items **[TRACED]** — no HTTP server could be started
(`SPRINT_8_ENVIRONMENT_SETUP_REPORT.md`). REST endpoint definitions,
`JwtAuthGuard`/`PermissionsGuard`/`RolesGuard` logic, class-validator
DTOs, the global `HttpExceptionFilter`, `PaginatedResponse`, and rate
limiting were all re-read this sprint for consistency against their
own unit tests and found consistent; none were executed against a real
request. Performance of common endpoints could not be measured at all
— no baseline exists (recorded as an outstanding Sprint 8 gap, not a
pass/fail).

---

## 8.5 Frontend Validation

| Check | Evidence |
|---|---|
| Routing, forms, state management, API integration | [TRACED] — Next.js App Router file structure and component code reviewed; no dev server ran |
| Responsive layouts | [TRACED] — Tailwind breakpoint usage reviewed in `AdminShell` and storefront layouts; not visually rendered at multiple viewport sizes |
| Error handling | [TRACED] |
| **Accessibility basics** | **[EXECUTED-BROWSER]** — `testing/execution-harness/sprint8/browser-render.spec.js`. A real headless Chromium instance rendered actual markup styled with the project's real, unmodified `colors.css` token file. Confirmed by reading back genuine computed styles (not asserted): the rendered button's background-color and the price text's color exactly match the hex values in the source token file, converted to their real rendered RGB. A real Playwright accessibility-tree snapshot (Chromium's own accessibility API, not a static analysis) confirms the button's accessible name is correctly exposed, and a real image element's `alt` attribute is correctly read back from the live DOM. This is the first genuine browser execution in this project's history. |

---

## 8.6 Integration Validation

| Integration | Evidence |
|---|---|
| Storage | [TRACED] — `StorageService` code reviewed (including the Sprint 7.5 `getSignedReadUrl` fix); no live S3/MinIO connection possible. **[EXECUTED-IMAGE]** supplements this: `testing/execution-harness/sprint8/image-validation.spec.js` genuinely generates real JPEG files via `sharp`, measures their real dimensions and file size (not claimed values), and feeds those real measurements through the actual Sprint 7.3 `validateMedia` function — confirming a real 1200×1200 image passes and a real 200×200 image is correctly rejected for being below the configured minimum. |
| Email | [TRACED] — `EmailService`'s DB-override/fallback logic re-confirmed via its existing Sprint 7.5 unit test structure; not executed against a real queue/provider |
| Settings | [TRACED] — unchanged since Sprint 7.5 |
| Feature flags | [TRACED] |
| Notification templates | [TRACED] |
| Content Validation Engine | **[EXECUTED-PURE]** (regression, see §8.7) + **[EXECUTED-IMAGE]** (new, media validator against real files) |
| Seed Engine | [TRACED] — unchanged since Sprint 7.4/7.6 |

---

## 8.7 Regression Testing

- **Execution harness (Sprint 7.6's original 24 scenarios):**
  **[EXECUTED-PURE]** — re-run via the documented reproduction
  sequence. Result: **24/24 pass**, no regressions.
- **12 new Sprint 8 scenarios** (4 browser, 2 image, 6 SQL): all pass
  on first genuine run.
- **Full-codebase TypeScript check:** backend (240 files) and frontend
  (107 files), both clean.
- **Shell-comment typo sweep:** clean.
- **Seed verification / validation engine tests:** structurally
  reviewed, unchanged since Sprint 7.6 — Jest itself remains
  uninstallable, so the 26 existing `*.spec.ts` files were not
  re-executed by a real test runner this sprint either.

**Total genuinely executed scenarios across this project's history:
24 (Sprint 7.6) + 12 (Sprint 8) = 36, zero failures on final run.**

## A Real Process Finding From This Sprint's Own Regression Check

Re-running Sprint 7.6's harness directly from its permanent repo
location (`node testing/execution-harness/run-workflows.js`, without
first following the README's staging/compile steps) **failed** with
`MODULE_NOT_FOUND`. Investigated: this is not a product regression —
the harness has always required a manual multi-step reproduction
(stage pure-function files, compile via `tsc`, copy the script in,
then run), documented in its README but not enforced. Logged as
DEF-8-01 (Low severity) in the Defect Register, and fixed proactively
this sprint with a new self-contained `setup-and-run.sh`, verified
working end-to-end.
