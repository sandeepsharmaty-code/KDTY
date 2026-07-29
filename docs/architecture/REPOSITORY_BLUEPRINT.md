# Sprint 1.1 — Repository Strategy

## Assumptions
1. The actual content of the frozen Phase 0–23 / Enterprise Governance / UI-UX /
   Frontend / Backend / Deployment Blueprint documents was **not provided** to
   this sprint. Where those documents would normally dictate a specific choice
   (e.g. framework, hosting provider), a reasonable enterprise-standard default
   is assumed and explicitly flagged below. **All flagged assumptions must be
   validated against the actual frozen documents before Sprint 2 begins.**
2. Single product (Hue Muse Beauty storefront) — not a multi-brand platform —
   for Sprint 1 purposes.
3. GitHub is the source control host (industry-standard default; not confirmed
   against governance docs).
4. Team size is small-to-mid (a monorepo is assumed appropriate rather than
   polyrepo — see Design Decision 1).

## Design Decisions

**D1 — Monorepo, not polyrepo.**
A single repository with `frontend/`, `backend/`, and `shared/` workspace
packages (pnpm workspaces) is used instead of separate repos per service.
Rationale: Sprint 1 explicitly excludes ERP/CRM/HMEOS code, so this repo's
scope is bounded to the storefront + its API — a size where a monorepo
reduces cross-repo versioning overhead without yet requiring the operational
complexity of polyrepo release trains.

**D2 — Trunk-based-friendly Git flow.**
Branch model: `main` (production-released, protected) ← `develop`
(integration, protected) ← short-lived `feature/*`, `fix/*`, `chore/*`
branches. See `docs/standards/GIT_WORKFLOW.md`.

**D3 — Semantic Versioning + annotated tags.**
Releases are tagged `vMAJOR.MINOR.PATCH` on `main` only, matching the
release pipeline structure in `.github/workflows/release.yml`.

**D4 — Conventional Commits.**
Enforced via commitlint + Husky commit-msg hook. See
`docs/standards/COMMIT_CONVENTIONS.md`.

**D5 — Required PR review + status checks before merge.**
No direct pushes to `main`/`develop`. See `docs/standards/PR_POLICY.md`.

## Acceptance Criteria
- [ ] Repository exists with `main` and `develop` branches, both protected
      (require PR, require passing CI, require 1+ approval).
- [ ] Branch naming convention documented and enforced by PR template review.
- [ ] Tagging strategy documented and wired into `release.yml`.
- [ ] Commit convention enforced locally (Husky) and documented.
- [ ] `CODEOWNERS` present and referenced in branch protection.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Frozen architecture docs not actually reviewed against these defaults | High — rework in Sprint 2 if assumptions wrong | Explicit validation gate before Sprint 2 (see Readiness Assessment) |
| Monorepo choice may not match approved Backend/Frontend Architecture split (e.g. if separate deployables are mandated) | Medium | Workspace packages are independently buildable/deployable, minimizing migration cost if a split is later required |
| Team unfamiliar with Conventional Commits | Low | Documented in onboarding; enforced by tooling, not memory |
