#!/bin/bash
# Sprint 8.7 — self-contained setup script, added after discovering
# (during Sprint 8's own regression re-run) that run-workflows.js
# cannot be executed directly from this directory — it requires a
# manually-staged and compiled ./dist/ that the README's reproduction
# steps describe but that a first-time user could easily skip, exactly
# as happened during this sprint's own regression check. See
# DEF-8-01 in the Sprint 8 Defect Register.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_SRC="$(cd "$SCRIPT_DIR/../../backend/src" && pwd)"
WORK_DIR="$(mktemp -d)"
mkdir -p "$WORK_DIR/src/content-validation/validators"

cp "$BACKEND_SRC/admin/content-validation/validation-result.ts" "$WORK_DIR/src/content-validation/"
cp "$BACKEND_SRC"/admin/content-validation/validators/*.ts "$WORK_DIR/src/content-validation/validators/"
cp "$BACKEND_SRC/admin/common/admin-role.ts" \
   "$BACKEND_SRC/admin/import-export/csv.util.ts" \
   "$BACKEND_SRC/integrations/common/with-retry.ts" \
   "$BACKEND_SRC/integrations/common/circuit-breaker.ts" \
   "$BACKEND_SRC/integrations/email/templates/template.engine.ts" \
   "$WORK_DIR/src/"

cd "$BACKEND_SRC/.."
npx --no-install tsc --ignoreConfig --target ES2020 --module commonjs \
  --outDir "$WORK_DIR/dist" --esModuleInterop --skipLibCheck \
  --rootDir "$WORK_DIR/src" $(find "$WORK_DIR/src" -name "*.ts")

cp "$SCRIPT_DIR/run-workflows.js" "$WORK_DIR/"
cd "$WORK_DIR" && node run-workflows.js
