# Sprint 8.1 — Environment Setup Report

## Objective
Establish an executable test environment: backend, frontend,
PostgreSQL, Redis, object storage, email service, migrations, seed
execution. This report records the actual, evidence-backed outcome of
attempting each — not an assumed or repeated limitation.

## What Was Actually Attempted and Its Real Outcome

| Component | Attempted | Real Outcome |
|---|---|---|
| `npm install` (backend & frontend real dependencies) | `npm install --no-audit --no-fund` | **Blocked** — `403 Forbidden` from `registry.npmjs.org`, confirmed by direct attempt |
| `apt-get` (system packages, e.g. for a local Postgres/Redis) | `apt-get update` | **Blocked** — `403 Forbidden` from `archive.ubuntu.com`, same egress-blocking pattern as npm |
| `pip install` (any Python package requiring network) | `pip install --break-system-packages redis` | **Blocked** — "No matching distribution found" (no index reachable) |
| Local Postgres/Redis/Docker binaries | `which postgres redis-server docker` | **None present** — confirmed via direct filesystem check |
| Backend application startup (`npm run dev`) | N/A — cannot start without real `@nestjs/core`, `typeorm`, `pg` packages, none installed and none installable | **Not possible in this environment** |
| Frontend application startup (`npm run dev`) | N/A — `frontend/node_modules` confirmed empty (0 packages); cannot start without `next` | **Not possible in this environment** |
| Database migrations | N/A — requires a live Postgres connection | **Not possible**; confirmed 0 migration files have ever been generated (`backend/src/database/migrations/` contains only its own README) |
| Seed execution (`npm run seed`) | N/A — requires the backend app + a live Postgres connection | **Not possible** |

## What WAS Discovered and Genuinely Used

Contrary to the assumption carried since Sprint 5 that *nothing*
beyond static analysis is executable, this sprint found real,
pre-installed global tooling that Sprints 1–7 never checked for:

| Tool | Location | Genuine Capability Unlocked |
|---|---|---|
| `playwright` (with Chromium browser binaries) | `/home/claude/.npm-global`, browser at `/opt/pw-browsers/chromium-1194` | **Real headless browser execution** — confirmed by rendering actual HTML and reading back real computed styles and a real accessibility tree |
| `sharp` (real image processing library) | `/home/claude/.npm-global/lib/node_modules/sharp` | **Real image generation and measurement** — not asserted dimensions, genuinely created and measured |
| `ts-node`/`tsx` | `/home/claude/.npm-global` | Convenience for running dependency-free TypeScript directly (does not unlock running application code, which still requires the missing npm packages) |
| Python's `sqlite3` (stdlib, always available) | Built into Python 3.12 | **Real SQL execution** — genuine foreign-key and unique-constraint enforcement, though on SQLite, not the project's actual PostgreSQL (caveated explicitly everywhere this is used — see `SPRINT_8_VALIDATION_REPORT.md`) |

These were used to build 12 new genuinely-executed test scenarios
(`testing/execution-harness/sprint8/`), extending Sprint 7.6's
24-scenario pure-logic harness — see `SPRINT_8_VALIDATION_REPORT.md`
for full results.

## Deliverables Status

| Deliverable | Status |
|---|---|
| Environment setup guide | This report + `testing/execution-harness/README.md` (updated) |
| Configuration validation | Not achievable — no live app to validate config against; `.env.example` and `configuration.ts` remain statically reviewed only (unchanged since Sprint 3) |
| Successful application startup | **Not achieved** — blocked, per table above |
| Successful seed execution | **Not achieved** — blocked, per table above |

## Conclusion

The core premise of Sprint 8.1 — a fully executable backend+frontend+
Postgres+Redis environment — **could not be established**, for the
same confirmed, evidence-backed reason as every sprint since 5: this
sandbox's network access is disabled at the egress layer for both npm
and system package registries. This is a sandbox constraint, not a
project defect.

What changed this sprint is that the *search for alternatives* was
more thorough than any prior sprint's — and found genuine, unexpected
capability (a real browser, a real image library, real SQL execution)
that materially expands the evidence base beyond pure-function
execution alone, without overstating what remains blocked (the actual
application, database, and queue layers).
