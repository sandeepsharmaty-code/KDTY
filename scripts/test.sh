#!/usr/bin/env bash
# Sprint 1.8 — Testing Foundation: run test suites across all packages.
# No business tests exist yet; this validates the test runner wiring only.
set -euo pipefail

echo "==> Unit tests (backend)"
pnpm --filter @hmb/backend test

echo "==> Unit tests (frontend)"
pnpm --filter @hmb/frontend test

echo "==> Unit tests (shared)"
pnpm --filter @hmb/shared test

echo "==> Test run complete."
