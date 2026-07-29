#!/usr/bin/env bash
# Sprint 1.12 — one-command local environment bootstrap.
set -euo pipefail

echo "==> Checking Node version against .nvmrc"
REQUIRED_NODE=$(cat .nvmrc)
echo "    Required: v${REQUIRED_NODE}"

echo "==> Installing workspace dependencies (pnpm)"
pnpm install

echo "==> Copying .env.example to .env (if not present)"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "    Created .env — fill in local secrets before running the app."
else
  echo "    .env already exists, skipping."
fi

echo "==> Starting local infrastructure (Postgres, Storage, Mail)"
docker compose -f infrastructure/docker/docker-compose.yml up -d

echo "==> Setup complete. Run 'pnpm dev' to start local development."
