# Sprint 1.5 / 1.9 — Build Environment & CI/CD Foundation

## Build Environment (1.5)
- **Development build:** unoptimized, source maps on, hot reload where
  applicable (wired per-package once app code exists).
- **Production build:** optimized, minified, source maps generated but not
  publicly served (wired in a later sprint alongside actual app code —
  Sprint 1 defines the *pipeline shape* only).
- **Environment configuration:** loaded from `.env` locally; from the CI/CD
  platform's secret store in every non-local environment (see
  `docs/security/SECRET_MANAGEMENT.md`). No environment values are
  hardcoded.
- **Configuration validation:** each package is expected to validate its
  required environment variables at startup and fail fast with a clear
  error if one is missing (implementation deferred to the sprint that adds
  the first real server entrypoint).

## CI/CD Foundation (1.9)
Implemented as GitHub Actions:

- **`ci.yml`** — runs on every PR and push to `develop`/`main`:
  1. Install (frozen lockfile)
  2. Lint (`scripts/lint.sh`)
  3. Build (placeholder step — no buildable app yet)
  4. Test (`scripts/test.sh`)
  5. Dependency vulnerability scan (`pnpm audit`, non-blocking in Sprint 1 —
     see Risks)
  6. Artifact generation job (placeholder — structure only, gated on
     `develop`)

- **`release.yml`** — triggers on `v*.*.*` tags. **Deliberately a no-op** in
  Sprint 1: it validates the pipeline structure exists and exits
  successfully without deploying anything, per OUT OF SCOPE.

## Assumptions
- GitHub Actions is the CI/CD platform (default; not confirmed against the
  frozen Deployment Blueprint).
- No cloud deployment target (AWS/GCP/Azure/etc.) is selected in Sprint 1.

## Acceptance Criteria
- [ ] `ci.yml` runs successfully on a trivial PR (lint/build/test all green).
- [ ] `release.yml` runs successfully on a test tag and performs no deploy.
- [ ] Branch protection on `main`/`develop` requires the `quality-gate` job.
- [ ] Pipeline fails loudly (not silently) if lint or test fails.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| `pnpm audit` is non-blocking, so vulnerabilities won't fail CI yet | Medium | Flagged in Known Issues; recommend making it blocking once a baseline dependency set exists (Sprint 2+) |
| CI/CD platform choice may not match Deployment Blueprint | Medium | GitHub Actions config is portable/replaceable without restructuring the repo; validate before Sprint 2 |
| No real build step to validate yet | Low | Placeholder step is intentionally explicit rather than silently passing |
