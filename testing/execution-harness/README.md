# Sprint 7.6 — Live Execution Harness

## What This Is
Real, executed evidence — not a simulation — for the parts of the
application that don't require a database, HTTP server, or network
access: pure business-logic functions extracted from the actual
source tree (content validators, the order state machine, discount
computation, the permission matrix, template rendering, CSV
round-trip, media limit checks).

## How to Reproduce
```bash
cd backend
# Stage the pure-function source files (no NestJS decorators, no DB, no external deps):
mkdir -p /tmp/e2e-harness/src
cp src/admin/content-validation/validation-result.ts /tmp/e2e-harness/src/content-validation/
cp src/admin/content-validation/validators/*.ts /tmp/e2e-harness/src/content-validation/validators/
cp src/admin/common/admin-role.ts src/admin/import-export/csv.util.ts \
   src/integrations/common/with-retry.ts src/integrations/common/circuit-breaker.ts \
   src/integrations/email/templates/template.engine.ts /tmp/e2e-harness/src/

# Compile with the TypeScript compiler already used for every sprint's
# validation (no `npm install` needed — this is why these files were
# chosen: zero external dependencies):
npx --no-install tsc --ignoreConfig --target ES2020 --module commonjs \
  --outDir /tmp/e2e-harness/dist --esModuleInterop --skipLibCheck \
  --rootDir /tmp/e2e-harness/src $(find /tmp/e2e-harness/src -name "*.ts")

# Run:
cd /tmp/e2e-harness && cp /path/to/this/run-workflows.js . && node run-workflows.js
```

## Why This Is the Right Scope, Not a Shortcut
Confirmed, not assumed: `npm install` in this environment returns a
hard `403 Forbidden` from the npm registry (network access disabled
per the sandbox's own configuration), and no local Postgres/Redis
binaries exist. Full application boot, HTTP routing, TypeORM/database
behavior, and BullMQ queue processing genuinely cannot execute here —
that's R-7, unchanged and correctly still open. What CAN genuinely
execute — every scenario in `run-workflows.js` — was run for real, not
described as if it had been.

## Result
24/24 scenarios passed on the final run. One scenario failed on its
first run — investigated and confirmed to be a bug in the TEST
SCENARIO itself (validating an already-rendered template string for
`{{placeholder}}` syntax that had, correctly, already been substituted
away), not a product bug. Fixed and re-verified. See
`docs/sprint-reports/SPRINT_7_6_VALIDATION.md` for the full account.

---

## Sprint 8 Extension

`sprint8/` adds 12 genuinely-executed scenarios using globally
pre-installed tooling this project hadn't checked for before Sprint 8:
Playwright+Chromium (real browser rendering), `sharp` (real image
generation/measurement), and Python's `sqlite3` (real SQL execution).

```bash
# Backend/frontend logic (Sprint 7.6, now self-contained):
./setup-and-run.sh

# Browser rendering (real Chromium):
node sprint8/browser-render.spec.js

# Image validation (real sharp):
node sprint8/image-validation.spec.js

# Relational integrity (real SQLite — NOT Postgres, see the script's own caveat):
python3 sprint8/relational-integrity.spec.py
```

See `docs/sprint-reports/SPRINT_8_VALIDATION_REPORT.md` for full
results and the evidence-tier taxonomy these scenarios use.
