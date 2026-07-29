# Sprint 1.4 — Local Development Environment

## Required Software
| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20.14.0 (see `.nvmrc`) | Runtime |
| pnpm | ≥ 9.0.0 | Package manager / workspaces |
| Docker + Docker Compose | Current stable | Local infra (DB, storage, mail) |
| Git | ≥ 2.40 | Version control |

## Environment Variables
Copy `.env.example` → `.env` and fill in local values. See that file for the
full list (database URL, local storage credentials, local SMTP, auth
secrets, and reserved-but-empty HMEOS integration placeholders).

## Local Database
PostgreSQL 16, provisioned via `infrastructure/docker/docker-compose.yml`
(`postgres` service). No schema/migrations exist yet — Sprint 1 provides the
running instance only.

## Local Cache / Session Store
Redis 7, provisioned via the `redis` service in
`infrastructure/docker/docker-compose.yml` (port `6379`). Confirmed as the
caching/session/cart-state layer in the approved Phase 8 Technical
Architecture, Section 2. Added during Sprint 1 Architecture Compliance
review — see `docs/sprint-reports/SPRINT_1_ARCHITECTURE_COMPLIANCE_MATRIX.md`.

## Local Storage
MinIO (S3-compatible), provisioned via the `storage` service in the same
Compose file. Used for local file/asset storage in future sprints.

## Local Email Testing
MailHog, provisioned via the `mail` service. Web UI at `http://localhost:8025`;
SMTP at `localhost:1025`. All outbound email in local dev is captured here,
never sent externally.

## Setup Steps
1. Install required software above.
2. `nvm use` (or otherwise activate Node per `.nvmrc`).
3. `bash scripts/setup.sh` — installs dependencies, creates `.env`, starts
   local infra.
4. `pnpm dev` — starts placeholder dev servers (no app functionality yet).

## Assumptions
- Docker Desktop or an equivalent Docker engine is available on developer
  machines. If a given environment cannot run Docker, local infra
  substitutes (native Postgres install, etc.) are out of scope for Sprint 1
  and would need a documented exception.

## Acceptance Criteria
- [ ] A developer following this guide on a clean machine reaches a running
      `docker compose up` stack with no manual troubleshooting.
- [ ] `.env.example` covers every variable actually referenced anywhere in
      the repo.
- [ ] `scripts/setup.sh` is idempotent (safe to re-run).

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Docker unavailable in some corporate environments | Medium | Document as a known constraint; evaluate remote dev container in a later sprint if it recurs |
| Version drift between `.nvmrc` and CI Node version | Low | CI reads `.nvmrc` directly (`node-version-file`) to guarantee parity |
