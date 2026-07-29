#!/usr/bin/env bash
# Sprint 1.12 — local development launcher.
# NOTE: No application code exists yet in Sprint 1; this script documents
# the intended workflow for Sprint 2+ and currently runs placeholder tasks.
set -euo pipefail

echo "==> Starting local infrastructure"
docker compose -f infrastructure/docker/docker-compose.yml up -d

echo "==> Running workspace dev tasks (placeholders in Sprint 1)"
pnpm --filter @hmb/backend dev &
pnpm --filter @hmb/frontend dev &
wait
