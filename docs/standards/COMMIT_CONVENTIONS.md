# Commit Conventions (Conventional Commits)

Format: `<type>(<scope>): <description>`

## Types
- `feat` — new feature (business functionality only — not used in Sprint 1)
- `fix` — bug fix
- `chore` — tooling, config, non-functional maintenance
- `docs` — documentation only
- `test` — adding/updating tests, no production code change
- `refactor` — code change that neither fixes a bug nor adds a feature
- `ci` — CI/CD pipeline changes
- `build` — build system or dependency changes

## Examples
```
chore(repo): scaffold Sprint 1 folder structure
docs(security): add secret management reference
ci(pipeline): wire lint/test quality gate
```

## Enforcement
Enforced locally via Husky `commit-msg` hook + commitlint
(`@commitlint/config-conventional`), configured against the root
`package.json` devDependencies.

## Acceptance Criteria
- [ ] Non-conforming commit messages are rejected locally before push.
