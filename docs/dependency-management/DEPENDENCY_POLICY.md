# Sprint 1.6 — Dependency Management

## Approved Libraries (Sprint 1 baseline only)
| Category | Library | Notes |
|---|---|---|
| Package manager | pnpm | Workspace support, disk-efficient |
| Linting | ESLint + typescript-eslint | See `config/eslint/` |
| Formatting | Prettier | See `config/prettier/` |
| Commit linting | commitlint + Husky | Enforces Conventional Commits |
| Language | TypeScript | Strict mode baseline in `config/typescript/` |

No frontend framework, backend framework, database driver, or ORM is
selected/installed in Sprint 1 — those are OUT OF SCOPE (business
functionality) and belong to the sprint that first needs them, at which
point they go through the process below.

**Confirmed direction (not installed in Sprint 1), per Architecture
Compliance review against Phase 8 Technical Architecture:** React +
Next.js (frontend), Node.js + NestJS (backend), PostgreSQL (database),
Redis (cache/session — infrastructure provisioned in Sprint 1, see
`docs/onboarding/LOCAL_DEV_SETUP.md`). See
`docs/sprint-reports/SPRINT_1_ARCHITECTURE_COMPLIANCE_MATRIX.md` for the
full comparison.

## Package Management
- Single lockfile per workspace root (`pnpm-lock.yaml`), committed.
- No direct `npm install` / `yarn add` — pnpm only, to avoid multiple
  lockfiles.

## Version Policy
- Pin exact versions for build tooling; caret ranges (`^`) acceptable for
  well-maintained libraries once introduced.
- No `latest` tags in any manifest.

## Update Policy
- Dependency updates reviewed monthly (cadence to be operationalized once a
  project management tool is connected).
- Security patches (from `pnpm audit` / Dependabot) are prioritized outside
  the regular cadence.
- Major version bumps require a dedicated PR with a changelog review, not
  bundled with feature work.

## License Review Process
- Before adding any new dependency: confirm license is permissive
  (MIT/Apache-2.0/BSD family) or explicitly approved by legal.
- Copyleft licenses (GPL/AGPL) require legal sign-off before use.
- License check is a manual step in Sprint 1 (no automated license scanner
  wired yet — see Risks).

## Acceptance Criteria
- [ ] Policy documented (this file).
- [ ] Sprint 1 baseline dependencies match `package.json` files exactly.
- [ ] No dependency uses a non-approved license.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| No automated license scanning yet | Medium | Add a license-checker step to CI in Sprint 2 as a prerequisite before framework dependencies are introduced |
| Manual update cadence may slip without a tracked reminder | Low | Recommend Dependabot/Renovate config as a Sprint 2 CI/CD enhancement |
