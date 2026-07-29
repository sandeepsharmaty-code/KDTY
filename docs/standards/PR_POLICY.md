# Pull Request Policy

## Requirements to Merge
1. PR template (`.github/PULL_REQUEST_TEMPLATE.md`) fully filled out.
2. CI `quality-gate` job green.
3. At least 1 approval from a relevant `CODEOWNERS` reviewer.
4. No unresolved review comments.
5. Branch up to date with target branch.

## Size & Scope
- Prefer small, single-purpose PRs.
- Foundation-scoped PRs (Sprint 1) must not introduce business logic.

## Review SLA
- Reviewers should respond within 1 business day (process target; not yet
  automated/tracked — recommend a bot reminder in a later sprint if this
  slips in practice).

## Acceptance Criteria
- [ ] Every merged PR in the repo's history satisfies items 1–5 above.
