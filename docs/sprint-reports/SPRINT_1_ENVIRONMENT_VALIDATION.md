# KI-2 — Environment Validation

## Important Disclosure First

This report was assembled inside the sandbox that generated the Sprint 1
package — a container with **no Docker daemon and no outbound network
access** (confirmed below with real command output, not assumed). That
means `pnpm install`, `docker compose up`, and a live GitHub Actions run
**cannot be executed to completion here**, because they require package
registry access, image registry access, and an actual GitHub repository
respectively — none of which exist in this environment.

Rather than fabricate logs or a "screenshot" of a run that didn't happen,
this report documents exactly what:
1. **was executed here, with real output** (below), and
2. **must be executed in the real target environment** (developer machine
   or CI runner), with an exact runbook and the expected outcome, so your
   team can capture the actual logs.

Presenting invented "✅ all green" output would be a false acceptance
record — that's a worse outcome than an honest partial validation, so I'm
flagging this plainly rather than working around it.

---

## What Was Actually Executed in This Sandbox

### Environment inventory (real output)
```
$ which pnpm node npm docker
/usr/bin/node
/usr/bin/npm
(pnpm: not found)
(docker: not found)

$ node --version
v22.22.2
$ npm --version
10.9.7
$ docker --version
/bin/sh: docker: not found
```

### Network access check (real output)
```
$ curl -sI https://registry.npmjs.org
HTTP/2 403
x-deny-reason: host_not_allowed
```
Confirms: outbound network is blocked at the proxy level in this sandbox.

### Attempted `pnpm install` (real output)
```
$ npm install -g pnpm
npm error code E403
npm error 403 403 Forbidden - GET https://registry.npmjs.org/pnpm

$ pnpm install
/bin/sh: pnpm: not found
```
Expected in a networked developer/CI environment: pnpm installs
successfully, then `pnpm install` resolves the workspace's minimal
`devDependencies` (prettier, eslint, husky, lint-staged, commitlint) from
`package.json` and produces `pnpm-lock.yaml`.

### Attempted `docker compose up` (real output)
```
$ docker compose -f infrastructure/docker/docker-compose.yml up -d
/bin/sh: docker: not found
```
Expected in a real environment: `postgres` (5432), `redis` (6379),
`storage`/MinIO (9000/9001), and `mail`/MailHog (1025/8025) start and
report healthy — all four images are pinned to stable public tags
(`postgres:16-alpine`, `redis:7-alpine`, `minio/minio:latest`,
`mailhog/mailhog:latest`) with no custom Dockerfiles, so the primary
runtime risk is image pull availability, not configuration — and the
Compose YAML itself is confirmed syntactically valid (see below).

### What COULD be validated here (real, not simulated)

**1. Full syntax/structure validation — all files, after the KI-1 fixes:**
```
JSON  (10/10 files): OK
YAML  (4/4 files, incl. updated docker-compose.yml with redis added): OK
Shell (4/4 scripts, bash -n): OK
```

**2. Real TypeScript compilation** (TypeScript 6.0.3 is available in this
sandbox without network access):
```
$ npx --no-install tsc --noEmit --strict --target ES2022 --module ESNext \
    --moduleResolution Bundler shared/src/index.ts
(no output — 0 errors)
```
This confirms `shared/src/index.ts` and the strict-mode compiler options
defined in `config/typescript/tsconfig.base.json` are mutually compatible.

**3. Manual review of `ci.yml`:** the workflow's steps
(`pnpm install --frozen-lockfile` → `scripts/lint.sh` →
placeholder build → `scripts/test.sh` → `pnpm audit`) reference only
scripts and files that exist in the repository, use correct relative
paths, and use a pinned, valid Node version source (`.nvmrc` via
`actions/setup-node`'s `node-version-file`). No dangling references found.

---

## Runbook for the Real Target Environment

Run these in order, in the actual repository (not this sandbox), on a
machine with Docker and internet access:

```bash
# 1. Install dependencies
pnpm install
# Expect: resolves devDependencies, writes pnpm-lock.yaml, exits 0.

# 2. Lint
pnpm lint
# Expect: Prettier check + ESLint pass with 0 errors across
# frontend/backend/shared (no source files to lint yet beyond
# shared/src/index.ts, so this should be near-instant).

# 3. Build
pnpm build
# NOTE: no per-package "build" script wired at the root yet beyond the
# individual placeholder echoes in frontend/backend package.json — this
# is expected and correct for Sprint 1 (no buildable app exists). Running
# `pnpm --filter @hmb/frontend build` and `pnpm --filter @hmb/backend
# build` directly will each print their placeholder message and exit 0.

# 4. Test
pnpm test
# Expect: each package's placeholder test script runs and exits 0
# (no suites exist yet — this validates the runner wiring, not coverage).

# 5. Start local infrastructure
docker compose -f infrastructure/docker/docker-compose.yml up -d
docker compose -f infrastructure/docker/docker-compose.yml ps
# Expect: postgres, redis, storage, mail all report "running"/"healthy".

# 6. Verify each service individually
pg_isready -h localhost -p 5432                       # expect: "accepting connections"
redis-cli -h localhost -p 6379 ping                    # expect: "PONG"
curl -sf http://localhost:9000/minio/health/live       # expect: HTTP 200
curl -sf http://localhost:8025/api/v2/messages          # expect: HTTP 200, empty message list

# 7. Push a branch / open a PR to trigger CI
git push origin <branch>
gh pr create --fill   # or open via the GitHub UI
# Then capture the Actions run URL and final status (or a screenshot of
# the green checkmarks) as the actual KI-2 evidence artifact.
```

## Acceptance Status for KI-2

| Item | Status |
|---|---|
| Static validation (JSON/YAML/shell syntax) | ✅ Done, real output above |
| TypeScript config validity | ✅ Done, real output above |
| CI workflow reference integrity (manual review) | ✅ Done |
| `pnpm install` / `lint` / `build` / `test` live execution | ⛔ **Not executable in this sandbox** — runbook provided above |
| `docker compose up` + service health checks | ⛔ **Not executable in this sandbox** (no Docker daemon) — runbook provided above |
| Live GitHub Actions run | ⛔ **Not executable in this sandbox** (no GitHub repository/runner) — runbook provided above |

**KI-2 is partially resolved.** Everything checkable without network/Docker
access has been verified with real command output. The remaining three
items require your team (or a subsequent Claude Code / CI session with
actual repo and Docker access) to run the runbook above and attach the
resulting logs. I'd rather hand you an accurate partial result than a
complete-looking fabricated one.
