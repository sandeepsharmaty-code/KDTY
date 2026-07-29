# Sprint 7 — Open Risks Register

## R-7 — Full Integrated Runtime Validation (Mandatory Entry)

| Field | Value |
|---|---|
| **Risk ID** | R-7 |
| **Title** | No live database, HTTP, or browser execution has occurred at any point in this project |
| **Origin** | First raised Sprint 5; carried through every subsequent sprint's audit |
| **Current Status** | **Open** — explicitly kept open by the Sprint 7.4, 7.5, and 7.6 audit approvals |
| **Likelihood** | Certain (100% — it is a confirmed, not probabilistic, current state) |
| **Impact** | High — every claim of correctness for database-dependent or HTTP-dependent behavior rests on static analysis, code tracing, and dependency-free execution only |
| **Evidence This Is Concretely Scoped, Not Assumed** | Sprint 7.6 ran `npm install` for real and captured a hard `403 Forbidden` from the npm registry; confirmed zero packages in `node_modules`; confirmed no local Postgres/Redis binaries exist |
| **Mitigation (in place)** | (1) Full TypeScript compilation across both frontend (107 files) and backend (240 files) on every sprint. (2) Structural audits (cross-module boundaries, circular dependencies — now automated) re-run at full scope. (3) `testing/execution-harness/` — genuine `node`-executed evidence (24/24 scenarios) for every dependency-free piece of business logic across all 10 named workflow categories. (4) Every validation report distinguishes `[EXECUTED]` from `[TRACED]` claims explicitly, per the Sprint 7.6 audit's own instruction to continue doing so. |
| **Mitigation (not yet possible here)** | Cannot install real dependencies, cannot run a real database, cannot boot the NestJS app, cannot render the frontend in a browser — all blocked by this sandbox's disabled network access, not by project effort. |
| **Exit Criteria** | A real environment (network + Postgres + Redis) becomes available, and the ordered steps in `SPRINT_8_READINESS_ASSESSMENT.md` §1 are completed: real `npm install` + `npm test`, real migration + seed run (including a THIRD repeat run to confirm idempotency under real conditions, not just the engine's mocked test), a real HTTP smoke test of at least the dashboard and product-list endpoints, a real admin login confirming the Sprint 6A RolesGuard fix, and the Sprint 6B frontend loaded in an actual browser for the first time. |
| **Owner** | Whoever executes Sprint 8 in a provisioned environment |

---

## Secondary Risks

| Risk ID | Title | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| R7-A | Seed Engine rollback (KI7.4-2) is compensating, not transactional — a failed real seed run could leave the database in a partially-updated state beyond what rollback restores | Low (seed runs are typically clean; risk activates only on a genuine mid-run failure) | Medium | Documented tradeoff; `SeedVerificationService`'s post-seed checks would surface most resulting inconsistencies | Open — accepted architectural tradeoff, not planned for closure |
| R7-B | The two independently-maintained RBAC permission matrices (backend `admin-role.ts`, frontend `permissions.ts` — Sprint 6B's KI6B-3) could silently drift, since there's no shared-package infrastructure enforcing agreement | Low (both are currently spot-tested against the same matrix cells) | Medium (a drift would be a UI/backend mismatch, not a security hole — backend always wins) | Both copies tested against identical cells in their respective suites | Open — carried from Sprint 6B, unresolved by Sprint 7 |
| R7-C | Payment provider selection is architecturally fixed at DI-bootstrap time (KI7.5-3) — a future requirement for runtime provider switching would need a real factory redesign, not a config change | Low (no concrete multi-provider requirement exists yet) | Low | Documented rationale; deliberate, not accidental | Open — not planned unless requirement changes |

## Risks Closed or Superseded This Sprint Arc
None — R-7 and its secondary risks all remain open. No risk from any
prior sprint's register was resolved during Sprint 7 (7.1–7.6); the
one Known Issue that closed (KI7.4-4, notification templates) was
tracked as a Known Issue, not a Risk, and is recorded in
`SPRINT_7_KNOWN_ISSUES_REGISTER.md`.
