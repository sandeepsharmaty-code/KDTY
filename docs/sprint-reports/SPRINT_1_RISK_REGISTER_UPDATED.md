# Sprint 1 — Updated Risk Register (post KI-1/KI-2)

| ID | Risk | Likelihood | Impact | Status | Notes |
|---|---|---|---|---|---|
| R-1 | Foundation choices don't match the real frozen architecture docs | ~~Medium~~ | ~~High~~ | ✅ **Closed** | Resolved by KI-1 — 17-point Compliance Matrix completed against actual Phase 0–23 documents; 1 gap (Redis) and 1 under-specification (NestJS) fixed. |
| R-2 | Docker unavailable in some developer environments | Low | Medium | Open | Unchanged. Documented constraint in `LOCAL_DEV_SETUP.md`. |
| R-3 | CI/CD platform may not match approved Deployment Blueprint | ~~Medium~~ | ~~Medium~~ | ✅ **Closed** | Resolved by KI-1 — confirmed no document mandates a specific CI/CD platform; GitHub Actions has no conflict. |
| R-4 | No secret scanner / non-blocking audit could let a real issue through once real code lands | Medium | Medium | Open | Unchanged (KI-3/KI-4 from original closure report, still pending — targeted for Sprint 2 CI/CD hardening). |
| R-5 | Placeholder CODEOWNERS could allow unreviewed merges once branch protection requires named reviewers | Low | Medium | Open | Unchanged — must be resolved with real GitHub handles before enabling required-reviewer protection. |
| R-6 | Team unfamiliarity with Conventional Commits / trunk-based flow | Low | Low | Open | Unchanged — mitigated by tooling + onboarding docs. |
| **R-7 (new)** | **Live runtime validation (KI-2) has not occurred** — `pnpm install`, `docker compose up`, and a live CI run remain unexecuted because this sandbox has no network/Docker/GitHub access | Medium | High | **Open — tracked to Sprint 2 kickoff** | A first-time execution failure (bad image tag, registry auth issue, a Node/pnpm version mismatch not visible via static checks) is only catchable by actually running the runbook in `SPRINT_1_ENVIRONMENT_VALIDATION.md`. This must happen before real feature work begins on top of this foundation. |
| **R-8 (new)** | **Redis was silently absent from the original Sprint 1 submission** despite being explicitly specified — indicates the original tech-choice review was done from general knowledge/defaults, not the actual approved documents | Low (now mitigated) | Medium | **Closed by KI-1, but flagged as a process lesson** | Recommend: any future foundation/architecture work should require the actual governing documents as input *before* implementation starts, not retrofitted afterward. |

## Summary of Change
- **2 risks closed** (R-1, R-3) via KI-1.
- **1 risk downgraded implicitly**: general "unvalidated assumptions" risk
  is now narrowed specifically to runtime/live execution (R-7), since the
  architecture-level uncertainty is resolved.
- **2 new risks logged** (R-7, R-8) rather than treating KI-1/KI-2 as
  fully closing all uncertainty — R-7 in particular remains genuinely open
  and should gate Sprint 2 kickoff, not just Sprint 1 sign-off.
