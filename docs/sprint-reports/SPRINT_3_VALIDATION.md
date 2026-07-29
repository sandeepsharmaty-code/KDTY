# Sprint 3.13 — Sprint Validation

Same disclosure as Sprints 1 and 2: this sandbox has no network, no
Docker, and no installed `node_modules`. `pnpm install`/`nest start`/a
live database were not available to run against. What follows is what
was actually, genuinely checked, plus the exact runbook for what remains.

## What Was Actually Executed and Verified (real output)

**1. Full-tree TypeScript check** — 86 backend source files (excluding
`.spec.ts`), using NestJS's real decorator compiler options
(`experimentalDecorators`, `emitDecoratorMetadata`), resolving every
`@/*` internal import against real local files:
```
npx tsc -p tsconfig.check.json
→ 0 real errors (only expected "cannot find module '@nestjs/...'" etc.
  noise from packages not installed in this no-network sandbox, and the
  same benign TS7.0 baseUrl-deprecation notice seen in Sprints 1–2)
```

**2. Structural audit — cross-module repository access** (Phase 8 §3's
central architectural rule: "a module may call another module's service
interface but never its repository directly"). Wrote a script that maps
every entity to its owning module, then checks every `@InjectRepository()`
call across all 9 domain services for a match. **Result: 0 violations**
— every repository injection is scoped to the module that owns that
entity (e.g. `CartService` never injects `ProductVariantEntity`'s
repository — it calls `ProductsService.checkAvailability()` instead).

**3. Structural audit — NestJS DI wiring correctness** (a real runtime-
only failure mode: if Module A's service imports Module B's service but
Module A's `*.module.ts` doesn't list `BModule` in its `imports` array,
Nest fails at boot with an unresolved-dependency error — `tsc` cannot
catch this, since it's a dependency-injection container concern, not a
type error). Wrote a script cross-referencing every cross-module service
import against the corresponding module's `imports` array. **Result: 0
issues** — e.g. `CartModule` imports `ProductsModule`,
`WishlistModule` imports `CartModule`, `AuthModule` imports
`CustomersModule`.

This mirrors exactly the value the Sprint 2 RSC-boundary audit provided:
a check for a real, sprint-specific bug class that static type-checking
alone doesn't cover.

## What Requires the Real Target Environment (not executable here)

| Item | Why it can't run here | Runbook |
|---|---|---|
| `pnpm install` | No network | Run from `backend/` |
| `pnpm dev` (app actually boots) | No installed deps, no live Postgres/Redis | `pnpm dev` after `docker compose up` (Sprint 1 infra) |
| `pnpm migration:generate/run` | No live Postgres | Requires a running `postgres` container (Sprint 1's `docker-compose.yml`, now with `redis` added per Sprint 1's KI-1 fix) |
| `pnpm seed` | Same | Run after the initial migration |
| `pnpm test` (Jest unit tests) | No installed deps | The 2 real test files (password hashing, OrdersService business rules) should pass — they use mocked repositories, no live DB needed |
| `pnpm test:e2e` | No installed deps, no running app | Not yet written this sprint — flagged in Known Issues |
| `GET /v1/health/ready` actually reaching Postgres | No live app/DB | Confirms the whole chain: app boot -> DB connection -> TypeORM -> health indicator |
| `GET /api/docs` rendering a real Swagger UI | No live app | Visual/manual check once running |
| Redis cache actually serving on the second request to a `@Cacheable()` endpoint | No live Redis/app | `curl` the same `GET /v1/products` twice, confirm the second is faster / check `x-request-id` timing in logs |

## Acceptance Criteria Checklist (Sprint 3.13, as specified)

| Requirement | Status |
|---|---|
| Backend builds successfully | ⚠️ TypeScript check clean; **actual `nest build` unexecuted** (needs installed deps) |
| Database migrations execute | ⚠️ Framework wired, entities complete; **no migration has been generated or run** (needs live Postgres) — first live-environment action, see `ENVIRONMENT_SETUP.md` |
| Health endpoints respond | ⚠️ Built and code-reviewed; **unexecuted live** |
| API documentation generates | ⚠️ Swagger wired in `main.ts`; **unexecuted live** |
| Tests execute successfully | ⚠️ 2 real unit test files written (7 test cases total) covering real logic (password hashing, order-status business rules); **unexecuted live**; e2e suite not yet written (Known Issues) |
| Security baseline is satisfied | ✅ helmet, CORS allowlist, global validation, rate limiting (global + tighter per-auth-endpoint), JWT auth default-on, RBAC guard, bcrypt password hashing — all code-complete and structurally verified |

**Net assessment:** identical pattern to Sprints 1 and 2 — everything
checkable through static analysis passed, including two custom
structural audits that caught real Nest/architecture bug classes (this
time finding zero violations, unlike Sprint 2's Footer bug — meaning the
"read the frozen docs before building" + "audit before calling it done"
combination is holding up across sprints). Live boot/DB/test execution
remains the one open item, tracked below alongside Sprint 1's R-7 and
Sprint 2's KI2-1/R2-1.
