# Sprint 1.8 — Testing Foundation

## Frameworks
- **Unit tests:** Vitest (fast, TS-native, works across `frontend`/`backend`/
  `shared`).
- **Integration tests:** Vitest with a real local Postgres instance
  (provisioned via `infrastructure/docker/docker-compose.yml`); no
  integration suites exist yet.
- **UI/E2E tests:** Playwright, wired into `testing/e2e/` structure; no
  scenarios exist yet (no pages to test).

## Test Folder Structure
```
testing/
├── unit/          # cross-cutting unit test config/utilities
├── integration/   # integration test config/utilities
└── e2e/           # Playwright config/utilities
```
Package-local unit tests are colocated as `*.test.ts` next to source once
source exists; `testing/unit/` holds shared test utilities and global
config rather than duplicating package tests.

## Test Naming Standards
- Unit: `<subject>.test.ts`
- Integration: `<subject>.integration.test.ts`
- E2E: `<flow-name>.e2e.ts`
- Test descriptions read as behavior statements: `describe("CartService")`
  → `it("throws when quantity is negative")`.

## Explicitly Out of Scope
No business/feature test suites are written in Sprint 1 (there is no
business logic to test yet). This deliverable establishes frameworks,
structure, and naming only.

## Acceptance Criteria
- [ ] `pnpm test` runs successfully (even with zero suites) across all
      packages.
- [ ] Test folder structure exists and is documented.
- [ ] Naming convention documented.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Framework choices (Vitest/Playwright) unconfirmed against approved architecture docs | Medium | Flagged for validation before Sprint 2; both are low-lock-in, widely-adopted choices |
| Zero real coverage until Sprint 2+ | Expected | Not a defect — Sprint 1 explicitly excludes business logic |
