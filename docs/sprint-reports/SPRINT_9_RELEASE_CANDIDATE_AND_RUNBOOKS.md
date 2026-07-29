# Sprint 9 — Release Candidate Manifest & Operational Runbooks

## Release Candidate Manifest
- **Candidate ID:** RC-1, baseline `SPRINT-9-BASELINE` (builds on
  `SPRINT-7-BASELINE`/Sprint 8, per `SPRINT_7_FREEZE_MANIFEST.md`'s
  versioning method — no git tags exist in this environment).
- **Contents:** all Sprint 1–9 code, minus zero removed features.
  Two real defect fixes this sprint (DEF-9-01 wishlist IDOR, DEF-9-03
  SQL injection pattern), one config fix (DEF-9-05 standalone output),
  new deployment artifacts (Dockerfiles, prod compose, env template).
- **Blocking issues for a real release:** DEF-9-04 (no lockfile — the
  production Dockerfile will correctly refuse to build until one
  exists) and R-7 (no environment has ever confirmed this candidate
  actually boots, migrates, or serves a request).
- **Non-blocking known issues:** full register in
  `SPRINT_7_KNOWN_ISSUES_REGISTER.md` + `SPRINT_9_DEFECT_REGISTER.md`.

## Release Runbook (for the first real deployment)
1. In a real environment: `npm install` (backend and frontend) to
   generate real `package-lock.json` files — resolves DEF-9-04.
   Commit the lockfiles.
2. Copy `.env.production.example` → `.env.production`, fill in every
   `CHANGE_ME` value with real secrets (never commit the filled file).
3. `docker compose -f infrastructure/docker/docker-compose.prod.yml build`
4. Run migrations (`npm run migration:run` inside the backend
   container) — **first-ever real execution of this command** in this
   project's history.
5. Run the seed (optional, for a demo/staging environment only —
   `npm run seed`).
6. `docker compose -f infrastructure/docker/docker-compose.prod.yml up -d`
7. Confirm `GET /v1/health/ready` returns 200.
8. Log in as the seeded Super Admin and **change the password
   immediately** (repeated warning, every sprint since 6).
9. Run the Sprint 7.6/8 execution harness against this real
   environment as a smoke test, then extend it with real HTTP-level
   checks — the natural next step once R-7's blocker is gone.

## Rollback Runbook
1. `docker compose -f docker-compose.prod.yml down`
2. Redeploy the previous known-good image tag.
3. If a migration ran that needs reversing: `npm run migration:revert`
   (framework exists since Sprint 3, never exercised — verify carefully
   in a non-production environment first).
4. Restore the most recent Postgres backup if data was affected.

## Incident Response Runbook (starting point)
1. Check `GET /v1/integrations/status` first — most operational issues
   (payment/shipping/email provider trouble) surface here via circuit
   state.
2. Check `GET /v1/integrations/dead-letter/:queueName` for stuck
   background jobs.
3. Check structured logs (`nestjs-pino` JSON output) for the request
   correlation ID tied to the reported issue.
4. If the issue is data-integrity related, run
   `SeedVerificationService`'s 9 checks (Sprint 7.4) against the real
   database — the first legitimate production use case for that
   service beyond seeding.
5. Escalation path, on-call rotation, and paging integration are
   organizational decisions this document cannot make — flagged as an
   explicit gap, not filled with a placeholder.
