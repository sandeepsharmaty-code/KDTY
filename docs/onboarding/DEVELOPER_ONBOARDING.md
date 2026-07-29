# Sprint 1.11 — Developer Onboarding Guide

## Day 1
1. Get repository access (request from a `CODEOWNERS` entry).
2. Read `README.md` (root), then this document, then
   `docs/architecture/ARCHITECTURE_OVERVIEW.md`.
3. Follow `docs/onboarding/LOCAL_DEV_SETUP.md` to get a running local
   environment.
4. Read `docs/standards/GIT_WORKFLOW.md`,
   `docs/standards/COMMIT_CONVENTIONS.md`, and
   `docs/standards/PR_POLICY.md` before opening your first PR.
5. Read `docs/security/SECURITY_BASELINE.md` — especially secret handling.

## First Contribution
Since Sprint 1 explicitly excludes business features, a first PR at this
stage should be foundation-scoped (docs fix, tooling improvement, test
scaffolding) — not application code, which begins in Sprint 2.

## Who to Ask
See `.github/CODEOWNERS` for path-specific owners (placeholder handles —
update with real team members before Sprint 2).

## Acceptance Criteria
- [ ] A new hire can go from repo access to a running local environment and
      an understanding of current scope using only this document set.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| `CODEOWNERS` uses placeholder handles | Low | Must be updated with real GitHub usernames before Sprint 2 — tracked in Known Issues |
