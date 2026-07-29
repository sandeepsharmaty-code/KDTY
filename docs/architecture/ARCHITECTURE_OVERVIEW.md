# Sprint 1.11 — Architecture Overview (Documentation Deliverable)

## Purpose
This document orients a new engineer to the shape of the repository. It is
**not** a redesign or restatement of the frozen Frontend/Backend
Architecture, UI/UX Blueprint, or Deployment Blueprint — those remain
authoritative and were not altered by Sprint 1. This overview only describes
what Sprint 1 actually built: the foundation.

## What Exists After Sprint 1
- A pnpm workspace monorepo with three empty-shell packages: `frontend`,
  `backend`, `shared`.
- Shared tooling config (`config/`) all three packages consume.
- Local dev infrastructure via Docker Compose (Postgres, MinIO, MailHog).
- A CI pipeline that lints, builds (placeholder), and tests on every PR.
- A release pipeline that validates its own structure without deploying.
- Documented standards for git workflow, commits, PRs, code quality,
  testing, logging, error handling, dependency management, and security.

## What Does Not Exist After Sprint 1
- Any page, component, route, endpoint, database schema, or business logic.
- Any production infrastructure or deployment target.
- Any HMEOS integration code (only a reserved, empty env-var placeholder).

## Document Index
See `docs/README.md` and the root `README.md` for the full documentation
map.

## Acceptance Criteria
- [ ] A new engineer can read this file plus the onboarding guide and
      understand the repo's current state without asking a human.
- [ ] Document makes no claims about business features.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Overview could go stale as Sprint 2+ adds real code | Low | Treat as a living doc; update at the close of each sprint |
