# Git Workflow

## Branches
- `main` — production-released code only. Protected. Tagged on release.
- `develop` — integration branch. Protected. All feature/fix branches merge
  here first.
- `feature/<short-description>` — new work, branched from `develop`.
- `fix/<short-description>` — bug fixes, branched from `develop` (or `main`
  for hotfixes, see below).
- `chore/<short-description>` — tooling/docs/non-functional changes.
- `hotfix/<short-description>` — urgent production fix, branched from
  `main`, merged to both `main` and `develop`.

## Flow
1. Branch from `develop` (or `main` for hotfixes).
2. Commit using Conventional Commits (see `COMMIT_CONVENTIONS.md`).
3. Open a PR against `develop` (or `main` for hotfixes) per `PR_POLICY.md`.
4. CI must pass; 1+ approval required.
5. Squash-merge (keeps `develop`/`main` history linear and readable).
6. Delete the branch after merge.

## Tagging
- Tag `main` only, on release: `vMAJOR.MINOR.PATCH`.
- Tags trigger `.github/workflows/release.yml`.

## Acceptance Criteria
- [ ] Branch protection matches this document exactly.
- [ ] No history of direct commits to `main`/`develop` after Sprint 1 setup
      commit.
