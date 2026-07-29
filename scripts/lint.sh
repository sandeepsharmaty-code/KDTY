#!/usr/bin/env bash
# Sprint 1.7 — Code Quality: run lint + format check across all packages.
set -euo pipefail

echo "==> Prettier format check"
pnpm format:check

echo "==> ESLint (frontend)"
pnpm --filter @hmb/frontend lint

echo "==> ESLint (backend)"
pnpm --filter @hmb/backend lint

echo "==> ESLint (shared)"
pnpm --filter @hmb/shared lint

echo "==> Lint passed."
