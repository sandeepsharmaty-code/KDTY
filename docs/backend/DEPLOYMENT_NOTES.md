# Sprint 3.12 — Deployment Notes (Non-Deployment)

**No production deployment occurs in Sprint 3** — explicitly out of
scope, consistent with Sprint 1's `deployment/README.md`. These are
notes for whoever picks up real deployment work later, not a deployment
guide.

## What's Deployment-Ready
- `main.ts` reads its port from `API_PORT`/`config.get('port')` — no
  hardcoded port.
- `app.enableShutdownHooks()` — the app closes DB/Redis connections
  cleanly on `SIGTERM`, which matters for zero-downtime rolling deploys.
- `helmet()` + explicit CORS allowlist (empty in production until a real
  frontend origin is configured — see `configuration.ts`'s `cors.origin`,
  which is deliberately `[]` in production today since no deployed
  frontend origin exists yet).
- Health endpoints (`/v1/health/live`, `/v1/health/ready`) are ready to
  wire into any orchestrator's liveness/readiness probes.

## What's NOT Deployment-Ready (by design, this sprint)
- No Dockerfile for the backend itself exists yet (Sprint 1's Docker
  Compose covers local *infrastructure* — Postgres/Redis/MinIO/MailHog —
  not the app itself).
- No CI step builds/publishes a backend container image yet (Sprint 1's
  `ci.yml` `artifact` job is still a structural placeholder).
- No environment beyond local dev has real secrets provisioned.
- `cors.origin` needs a real value the moment a frontend is deployed
  somewhere other than `localhost:3000`.

These are reasonable Sprint 4+/deployment-sprint items, not gaps in
Sprint 3's own scope.
