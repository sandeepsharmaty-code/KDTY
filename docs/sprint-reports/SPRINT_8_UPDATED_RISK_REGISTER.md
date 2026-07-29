# Sprint 8 — Updated Risk Register

Supersedes `SPRINT_7_OPEN_RISKS_REGISTER.md` for R-7's status only; the
3 secondary risks (R7-A/B/C) are unchanged and not repeated here in
full — see the Sprint 7 register for their complete entries.

## R-7 — Full Integrated Runtime Validation

| Field | Sprint 7 Value | **Sprint 8 Update** |
|---|---|---|
| Status | Open | **Still Open** — genuinely attempted this sprint, not resolved |
| Evidence base | 24 executed pure-logic scenarios (Sprint 7.6) | **36 executed scenarios** (24 carried + 12 new: real browser rendering, real image processing, real SQL relational-integrity enforcement) |
| Scope still blocked | Backend/frontend app boot, live Postgres, live Redis, live HTTP, live queue processing | **Unchanged** — confirmed again this sprint via direct attempts (`npm install` → 403, `apt-get` → 403, `pip install` → no distribution found), not merely re-assumed |
| New finding | — | This sprint's more exhaustive environment probe found genuine additional execution capability (Playwright+Chromium, `sharp`, SQLite) that prior sprints did not check for — DEF-8-03. This narrows R-7's practical scope without closing it: the application/database/queue layer remains completely unexecuted, but the browser and image-processing layers now have real evidence where none existed before. |
| Exit Criteria | Real environment + ordered validation sequence (`SPRINT_8_READINESS_ASSESSMENT.md` §1) | **Unchanged** — this sprint's findings do not substitute for it. A real `npm install`, real Postgres/Redis, a real app boot, and a real HTTP round-trip remain the actual exit criteria. |
| Owner | Whoever executes in a provisioned environment | Unchanged |

**R-7 remains open.** This update should not be read as narrowing its
severity — it documents that Sprint 8 tried harder and found more than
any prior sprint, not that the core gap closed.

## Secondary Risks (unchanged from Sprint 7, referenced not restated)
R7-A (seed rollback is compensating, not transactional), R7-B (RBAC
permission matrix duplication risk), R7-C (payment provider selection
is DI-bootstrap-fixed) — full detail:
`docs/sprint-reports/SPRINT_7_OPEN_RISKS_REGISTER.md`.

## New Risks Identified This Sprint
None. DEF-8-01/02/03 (Defect Register) were all resolved or are scope
gaps, not risks requiring separate tracking.
