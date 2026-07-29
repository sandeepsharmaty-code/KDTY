# Sprint 1.10 — Security Foundation

## Secret Management
- No secrets are ever committed. `.gitignore` excludes `.env*`, `*.pem`,
  `*.key`, `secrets.*`.
- Local dev secrets live in `.env` (gitignored), seeded from `.env.example`
  (which contains placeholder/non-real values only).
- CI/CD and any non-local environment secrets are expected to be stored in
  the CI/CD platform's encrypted secret store (e.g. GitHub Actions
  Environments/Secrets) — none are configured in Sprint 1 since no
  non-local environment exists yet.
- Full secret rotation / vault strategy (e.g. AWS Secrets Manager, Vault) is
  deferred to the sprint that introduces a real deployment target — flagged
  as a Sprint 2+ prerequisite, not resolved here.

## Environment Protection
- `main` and `develop` branches are protected (PR required, review required,
  CI required, no force-push).
- No production environment exists yet in Sprint 1, so environment-level
  approval gates (e.g. required reviewers for prod deploys) are deferred.

## Access Control
- Repository access follows least-privilege: `CODEOWNERS` defines required
  reviewers per path.
- No shared/generic credentials — CI uses platform-native tokens (e.g.
  `GITHUB_TOKEN`), not personal access tokens, wherever possible.

## Dependency Scanning
- `pnpm audit` runs in CI on every PR (currently non-blocking — see
  `docs/ci-cd/CI_CD_FOUNDATION.md` Risks).
- Recommend Dependabot/Renovate security updates as a Sprint 2 CI/CD
  enhancement.

## Security Policies (Sprint 1 baseline)
- No PII, credentials, or internal URLs in logs (`docs/standards/
  CODING_STANDARDS.md` → Logging Standards).
- No secrets in commit history — enforced by PR checklist and code review,
  not yet by an automated secret scanner (flagged as a gap below).
- All dependencies must pass the license review process
  (`docs/dependency-management/DEPENDENCY_POLICY.md`).

## Acceptance Criteria
- [ ] `.gitignore` blocks all known secret file patterns.
- [ ] `.env.example` contains no real credentials.
- [ ] Branch protection enabled on `main`/`develop`.
- [ ] `CODEOWNERS` present and enforced.
- [ ] `pnpm audit` runs in CI (even if non-blocking).

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| No automated secret scanner (e.g. gitleaks/truffleHog) in CI yet | Medium | Add as a Sprint 2 CI/CD enhancement before any real credentials exist in the system |
| `pnpm audit` non-blocking | Medium | Make blocking once a real dependency baseline (frameworks) is introduced |
| No formal vault/secrets-manager strategy | Medium | Explicit Sprint 2 prerequisite — must be resolved before any non-local environment is stood up |
| Access control relies on GitHub's native RBAC only | Low | Sufficient for current team size; revisit if org grows |
