# Sprint 8 — Defect Register

| Defect ID | Severity | Component | Reproduction Steps | Root Cause | Resolution | Regression Result | Status |
|---|---|---|---|---|---|---|---|
| DEF-8-01 | Low | `testing/execution-harness/run-workflows.js` | Run `node testing/execution-harness/run-workflows.js` directly from its permanent repo location, without first performing the README's manual staging/compile steps | The harness's `require("./dist/...")` calls assume a `dist/` folder that only exists after a separate, manual `tsc` compile step described in the README but not automated or enforced | Added `testing/execution-harness/setup-and-run.sh`. **The first version of this fix had its own bug**: it resolved its own script directory via `$(dirname "$0")` *after* the script had already `cd`ed elsewhere, so the relative path no longer resolved — caught during final packaging re-verification (run from 3 different invocation contexts, not just the one that happened to work first), not assumed correct because the first test passed. Fixed by resolving the script's directory to an absolute path before any `cd`. | Re-verified from 3 separate invocation contexts (repo root, the script's own directory, and an unrelated directory via absolute path) — 24/24 scenarios pass in all three | **Resolved** |
| DEF-8-02 | Informational | Customer Platform — Wishlist | N/A — not a runtime defect | Wishlist was never implemented in any sprint (1–7); its absence was first surfaced by Sprint 7.7's Freeze Manifest (§7) and is repeated here because Sprint 8.2's own scope explicitly lists it | No resolution attempted — out of Sprint 8's scope per its own "no new business modules" instruction | N/A | **Deferred — Sprint 8+ backlog, not a defect in existing functionality** |
| DEF-8-03 | Low | Sprint 8 environment tooling discovery | N/A — process observation, not a code defect | Sprints 5 through 7 did not check for pre-installed global npm packages (`playwright`, `sharp`, `ts-node`) before concluding "no execution beyond pure TypeScript is possible" — the conclusion was correct for application-level execution but incomplete regarding what tooling was actually available | This sprint performed a more exhaustive environment probe (documented in `SPRINT_8_ENVIRONMENT_SETUP_REPORT.md`) and found genuine additional execution capability | Extended the execution harness with `testing/execution-harness/sprint8/` (12 new scenarios) | 12/12 new scenarios pass | **Resolved (process improvement, not a code fix)** |

## Summary

| Severity | Count | Open | Resolved |
|---|---|---|---|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 2 | 0 | 2 |
| Informational | 1 | 1 (deferred, not a defect) | — |

**Zero Critical or High severity defects found or open.** No defect in
this register required a code change to existing Sprint 1–7 business
logic — DEF-8-01 and DEF-8-03 are both testing-infrastructure
improvements, and DEF-8-02 is a scope gap (an unbuilt feature), not a
runtime defect. This is consistent with Sprint 8's "no new business
modules; defect fixes only" instruction — no such fix was required
this sprint.
