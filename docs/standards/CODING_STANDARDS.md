# Sprint 1.3 — Development Standards

## Coding Standards
- Language: TypeScript (strict mode — see `config/typescript/tsconfig.base.json`).
- No `any` without an inline justification comment.
- Functions should do one thing; prefer composition over deep inheritance.
- Public exports require a one-line JSDoc summary.

## File & Folder Naming
See `docs/architecture/FOLDER_STRUCTURE.md` (single source of truth — not
duplicated here to avoid drift).

## Documentation Standards
- Every package (`frontend/`, `backend/`, `shared/`) has a `README.md`
  describing its purpose and structure.
- Every non-trivial module has a top-of-file comment describing intent.
- Architectural decisions that deviate from this Sprint 1 package must be
  recorded as a new dated entry appended to the relevant doc, not a silent
  edit.

## Comment Standards
- Comments explain **why**, not **what** (the code already shows what).
- `TODO(username): description` for deferred work; `FIXME(username):` for
  known defects. Both must reference a tracked issue once issue tracking is
  wired up (Sprint 2+).

## Error Handling Standards
- Never swallow errors silently.
- Backend: errors are thrown as typed error classes (to be defined per
  domain starting Sprint 2) and normalized to a consistent API error shape
  at the boundary — actual error taxonomy is deferred (no business logic in
  Sprint 1).
- Frontend: errors surfaced to the user must never leak stack traces or
  internal identifiers.
- All errors are logged (see Logging Standards) before being handled or
  re-thrown.

## Logging Standards
- Structured (JSON) logging in all environments except local dev, where
  human-readable output is acceptable.
- Required fields once logging is wired: `timestamp`, `level`, `service`,
  `message`, `correlationId`.
- No PII or secrets in log output — enforced by code review checklist below.
- Log levels: `error`, `warn`, `info`, `debug` (debug disabled by default in
  non-local environments).

## Code Review Checklist (Quality Gate)
- [ ] Follows naming and structure conventions
- [ ] No `console.log` left in (use approved logger once introduced)
- [ ] No secrets or credentials in the diff
- [ ] Tests added/updated where applicable
- [ ] Lint and format pass (`scripts/lint.sh`)
- [ ] No unexplained `any` / type suppressions
- [ ] Public APIs documented

## Acceptance Criteria
- [ ] Standards documented (this file) and linked from root `README.md`.
- [ ] ESLint/Prettier configs in `config/` enforce the applicable subset
      programmatically.
- [ ] Code review checklist included in `.github/PULL_REQUEST_TEMPLATE.md`.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Standards not enforced beyond tooling (style/architecture judgment calls) | Medium | Human code review checklist + CODEOWNERS review requirement |
| Error taxonomy deferred could cause inconsistent error handling once features start | Low–Medium | Explicitly flagged as a Sprint 2 prerequisite in Readiness Assessment |

---

# Sprint 1.7 — Code Quality (Tooling)

## Formatting & Linting
- Prettier is the single source of truth for formatting (`config/prettier/`).
- ESLint enforces correctness/style rules on top of formatting
  (`config/eslint/`), scoped per-package via each package's `lint` script.

## Static Analysis
- TypeScript `strict: true` is the primary static analysis layer in
  Sprint 1 (see `config/typescript/tsconfig.base.json`).
- No additional static analysis tool (e.g. SonarQube) is wired in Sprint 1
  — flagged as a future enhancement, not a gap in current scope.

## Quality Gates (enforced in CI — `ci.yml`)
1. Format check must pass.
2. Lint must pass with zero errors (warnings allowed, tracked).
3. Test suite must pass (framework wiring only in Sprint 1).
4. Dependency audit runs (non-blocking — see CI/CD Risks).

## Acceptance Criteria
- [ ] `pnpm format:check` passes on a clean checkout.
- [ ] `bash scripts/lint.sh` passes on a clean checkout.
- [ ] CI enforces all of the above on every PR.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| No static analysis beyond TS strict + ESLint | Low | Acceptable for foundation stage; revisit if code complexity grows in later sprints |
