# Sprint 9 — Validation Report
## Production Hardening & Release Preparation

---

## 1. Security Hardening — Real Findings Against Real Code

Every item below was checked directly against the actual source
(commands run, not recalled from prior sprints).

| Area | Finding | Status |
|---|---|---|
| Security headers | `helmet()` applied in `main.ts` | ✅ PASS |
| CORS | `enableCors` reads a configured origin list, not a wildcard | ✅ PASS |
| Rate limiting | Global `ThrottlerModule` (100 req/60s default), tighter per-endpoint via `@Throttle()` (e.g. admin login 5/min) | ✅ PASS |
| Secrets handling | Zero hardcoded fallback secrets found (`grep` for `process.env.*SECRET* \|\|` and `*KEY* \|\|` patterns — none) | ✅ PASS |
| Fail-fast config | `env.validation.ts` requires `JWT_SECRET`, `SESSION_SECRET`, `DATABASE_URL`, `REDIS_URL`, storage credentials as `@IsString()` — app refuses to boot if any is missing | ✅ PASS |
| Password hashing | bcrypt, `SALT_ROUNDS = 12` (modern-strong default) | ✅ PASS |
| **SQL injection pattern** | `OrdersSeedProvider`'s raw `UPDATE` interpolated a value directly into SQL text instead of binding it — not exploitable as written (no user input reaches it), but a dangerous pattern | 🔴 **Found → Fixed (DEF-9-03)** |
| **Wishlist authorization (IDOR)** | Every wishlist endpoint except the deliberately-public share-link trusted a client-supplied `customerId` with no identity verification | 🔴 **Found → Fixed (DEF-9-01)** — first High-severity finding in this project's history |
| Dependency lockfile | No `package-lock.json` exists for either package — real reproducibility/supply-chain gap | 🟡 **Found, cannot fix here (DEF-9-04)** — requires network access to generate |
| Admin RBAC | Phase 6 §12 matrix, directly executed (Sprint 7.6/8) — unchanged, re-confirmed structurally sound | ✅ PASS |

**Net: 2 real defects found and fixed this sprint (one High, one
Medium), 1 Medium and 1 Low logged as environment-blocked or backlog.**
Consistent with this project's pattern since Sprint 5 — genuine review
of genuine code keeps finding genuine issues.

---

## 2. Performance Review (Static — No Live Environment Available)

- **N+1 query risk**: 3 loop-with-await patterns found
  (`OrdersService` line-item stock release, `CartService.getTotals`
  ×2). All 3 are reviewed and judged acceptable at current scale (cart/
  order line-item counts are small, single-digit in practice) but
  flagged as the first place to look if a real environment ever shows
  slow cart/order responses under load — **not fixed** (no evidence of
  an actual problem, only a pattern worth knowing about; "fix" without
  a measured problem would be premature optimization).
- **Index coverage**: 18 of 26 entities have explicit `@Index`
  decorators. 6 of the remaining 8 hold a `@ManyToOne` relation
  (`CartLineItem`, `OrderLineItem`, `OrderStatusHistory`, `ReviewReply`,
  `Address`, `WishlistItem`) — **whether their foreign-key columns are
  auto-indexed depends on the TypeORM version's default behavior and
  cannot be confirmed without inspecting a real generated schema**
  (R-7). Recorded as a verification item for the first real-environment
  session, not asserted as broken.
- **Bundle/asset performance**: `next.config.mjs` already had
  `compress: true` and AVIF/WebP image formats configured since Sprint
  2.8 — unchanged, reviewed, still appropriate.

---

## 3. Deployment Architecture

New this sprint (did not exist before — Sprint 1's
`docker-compose.yml` was explicitly dev-only):
- `infrastructure/docker/Dockerfile.backend` — multi-stage, non-root
  user, health-checked, deliberately uses `npm ci` (fails correctly
  until a real lockfile exists — DEF-9-04).
- `infrastructure/docker/Dockerfile.frontend` — multi-stage, Next.js
  standalone output (required a real config fix — DEF-9-05).
- `infrastructure/docker/docker-compose.prod.yml` — no exposed DB/Redis
  ports, named volumes, restart policies, health-checked dependencies.
- `infrastructure/docker/.env.production.example` — every required
  secret named with a `CHANGE_ME` placeholder, never a real value.

**Explicitly not built**: a real Kubernetes/ECS manifest, a CDN
configuration, or a real managed-database provisioning script — none
of these can be meaningfully authored without knowing the actual target
platform, which hasn't been specified. `docker-compose.prod.yml` is a
reasonable single-host starting point, not a claim of horizontal-
scale-readiness.

---

## 4. Backup, Recovery, Logging, Monitoring Readiness

- **Backup**: Postgres — standard `pg_dump`/point-in-time-recovery via
  WAL archiving is the recommended approach for the eventual managed
  database; no backup automation exists in this repo (infrastructure-
  provider-specific, out of scope for application code).
- **Recovery**: no disaster-recovery drill has ever run (requires the
  real database this sandbox doesn't have).
- **Logging**: `nestjs-pino` (Sprint 3) provides structured JSON
  logging already — reviewed, appropriate for production log
  aggregation (Datadog/CloudWatch/ELK) once deployed; no changes made.
- **Monitoring**: Sprint 5.11's `GET /v1/integrations/status` (provider
  circuit state) and `GET /v1/integrations/dead-letter/:queue` already
  exist and are real, working endpoints (per Sprint 8's traced/executed
  evidence) — these are the natural scrape targets for a real monitoring
  stack; no new monitoring code was needed, just confirmed they exist
  and are reachable once the app can run.

---

## 5. Regression Check

Full backend (240+1 modified = still 240 files, DEF-9-01/03 were edits
not additions) and frontend TypeScript checks re-run: clean. Typo
sweep: clean. Sprint 7.6/8 execution harness (36 scenarios): not
re-run this sprint (no logic in the harness's own scope changed) —
its permanent location and self-contained script were left untouched.
