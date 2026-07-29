# Sprint 3.12 — Backend Environment Setup Guide

Builds on Sprint 1's `docs/onboarding/LOCAL_DEV_SETUP.md` — this covers
what's specific to running the backend.

## Prerequisites
Everything in Sprint 1's local dev setup (Node 20.14, pnpm, Docker) plus
the same local infrastructure stack — Postgres, Redis, MinIO, MailHog —
which Sprint 1 already provisions via
`infrastructure/docker/docker-compose.yml`.

## Environment Variables
All required variables are validated at boot (`src/config/
env.validation.ts`) — the app refuses to start with a clear error if any
are missing. See `.env.example` at the repo root (already includes
`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `SESSION_SECRET`,
`STORAGE_*` from Sprint 1).

## First-Time Setup
```bash
# From repo root
bash scripts/setup.sh          # installs deps, starts Postgres/Redis/MinIO/MailHog

# From backend/
pnpm migration:run              # applies the schema (once a migration exists — see below)
pnpm seed                       # seeds 5 categories + 1 sample product/variants
pnpm dev                        # starts the API on :4000 with --watch
```

## Generating the Initial Migration
No migration has been generated yet in Sprint 3 (requires a live
Postgres connection this sandbox doesn't have). First real step in a
live environment:
```bash
pnpm migration:generate src/database/migrations/InitialSchema
pnpm migration:run
```

## Verifying It's Running
```bash
curl http://localhost:4000/v1/health/live    # {"status":"ok"}
curl http://localhost:4000/v1/health/ready   # pings Postgres
open http://localhost:4000/api/docs          # Swagger UI
```

## Running Tests
```bash
pnpm test          # unit tests (Jest)
pnpm test:cov       # unit tests with coverage
pnpm test:e2e       # e2e tests (requires the app + Postgres running)
```
