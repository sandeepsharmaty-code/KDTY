# Sprint 8 — Readiness Assessment

## 1. Top Priority: Close R-7 With a Real Environment Session

Every sprint since Sprint 5 has recommended this; Sprint 7.6 makes the
strongest case yet. Concretely, in priority order once a real
environment (network access + Postgres + Redis) is available:

1. `npm install` for real, then `npm run typecheck` / `npm run test`
   — confirm the 26 spec files this project has written actually pass
   under a real Jest run (they've only ever been statically type-
   checked).
2. Run migrations, then `npm run seed` — the Sprint 7.4 Seed Engine's
   first real execution. Confirm the `SeedVerificationService`'s 9
   integrity checks actually pass, and specifically confirm
   `checkCategoryHierarchyIntegrity`'s degraded-gracefully closure-
   table query (flagged as unconfirmed against real TypeORM-generated
   column names since Sprint 7.4).
3. Run `npm run seed -- --dry-run` then the real run, then run it a
   THIRD time — confirm the idempotency claims (every provider's
   natural-key upsert) hold under real repeated execution, not just
   the engine-level mocked test.
4. Boot the app, hit `GET /v1/admin/dashboard/overview` and
   `GET /v1/products` — the two highest-value smoke-test endpoints.
5. Log in as the seeded Super Admin (`admin@huemusebeauty.local` /
   `ChangeMe123!` — **change this password immediately**, per every
   prior sprint's own warning) and confirm the RolesGuard fix (Sprint
   6A's most significant finding) actually works against a real login.
6. Load the Sprint 6B admin frontend in an actual browser for the
   first time in this project's history.

## 2. Second Priority: Close the Named Configuration Gaps

Per Sprint 7.5's `CONFIGURATION_COMPLETENESS.md`, three items are
"configurable but not enforced":
- Apply `TaxRateEntity` rates to `OrdersService.createOrder`'s total
  computation.
- Apply `ShippingZoneEntity` to `CartService.estimateShipping` (still
  the Sprint 3/4 stub).
- Currency conversion, if multi-currency is still a real product goal.

## 3. Third Priority: Named UI Gaps From Sprint 6B

- A guided product-creation form (KI6B-7 — CSV import remains the only
  bulk path; there's still no single-product "create from scratch"
  screen).
- Persistent media browsing (KI6B-1) and per-job dead-letter
  inspection (KI6B-2).

## 4. What's Confirmed Ready, No Further Foundational Work Needed

- The Settings module, Content Validation Engine, and Seed Engine are
  all architecturally complete and internally consistent (240 backend
  files, zero structural violations, zero circular dependencies,
  confirmed by an automated check).
- The RBAC permission matrix is correct against its own spec (directly
  executed this sprint, not just read).
- The notification-template override/fallback pattern is real and
  tested in both directions.
- A genuine, reproducible execution harness now exists
  (`testing/execution-harness/`) — Sprint 8 can and should extend it
  rather than starting from zero once more pure logic exists to cover.

## 5. One Process Recommendation

Across Sprint 7's five sub-sprints, the single highest-value practice
was direct empirical checking over trusting a prior claim — reading
the actual token file instead of approximating it, running code
instead of only reading it, re-deriving execution order instead of
trusting registration order. Sprint 8 should continue this rather than
treating Sprint 7's cumulative bug count as fully exhausted — the
pattern held for five straight sprints, which is reason to expect more
exists, not less.
