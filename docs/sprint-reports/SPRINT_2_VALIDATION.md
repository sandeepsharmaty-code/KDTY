# Sprint 2.12 — Sprint Validation

Same disclosure as Sprint 1's KI-2: this sandbox has no network access and
no installed `node_modules` (confirmed with real command output in Sprint
1's `SPRINT_1_ENVIRONMENT_VALIDATION.md`). `next dev`/`next build` cannot
run here. What follows is what was actually, genuinely checked — plus an
exact runbook for what still needs to run in a real environment.

## What Was Actually Executed and Verified (real output)

**1. Full-tree TypeScript strict-mode check** (all 72 `.ts`/`.tsx` files
under `frontend/src/`, using the globally available TypeScript 6.0.3,
resolving the real `@/*` path aliases against real local files):
```
npx tsc -p tsconfig.check.json
→ 0 errors (only expected "cannot find module 'next'/'react'" noise from
  packages that aren't installed in this no-network sandbox, and one
  benign TS7.0-deprecation notice unrelated to any Sprint 2 code)
```
This is real validation of every internal import/export across the whole
component tree — not just per-file syntax.

**2. React Server/Client Component boundary audit** (a genuine, common
Next.js App Router bug class — not a syntax check): scanned every `.tsx`
file for inline event handlers (`onClick`/`onSubmit`/`onChange`/etc.)
attached without a `"use client"` directive.
- **Found and fixed 1 confirmed, currently-triggered bug:** `Footer.tsx`
  (rendered on every single page) attached an inline `onSubmit` handler
  without being a Client Component — this would have failed `next build`
  outright. Fixed by extracting the interactive piece into a new
  `NewsletterForm.tsx` client component, keeping `Footer` itself a Server
  Component (smaller client JS bundle — also a Sprint 2.8 performance win).
- **Found and fixed 2 latent risks:** `EmptyState.tsx` and
  `ErrorRecovery.tsx` conditionally attach a handler depending on which
  page uses them; current usage happens not to trigger it, but future
  usage easily could. Marked both `"use client"` defensively.
- Re-ran the audit after fixes: **0 remaining issues.**

**3. Manual structural review:**
- Every route in Sprint 2.5's required page list has a corresponding
  `page.tsx` (see `docs/frontend/ROUTING.md`).
- Every component named in the frozen Phase 4 §17 vocabulary that Sprint
  2's page set actually needs has a corresponding file, using the exact
  frozen name (see `docs/frontend/COMPONENT_LIBRARY.md`).
- Design tokens in `tailwind.config.ts`/`styles/tokens/*` were cross-
  checked line-by-line against Phase 4 §2–4, §18 during authoring (not
  after the fact) — see inline citations in each token file.

## What Requires the Real Target Environment (not executable here)

| Item | Why it can't run here | Runbook |
|---|---|---|
| `pnpm install` | No network | `pnpm install` from `frontend/` (workspace root already covers this) |
| `next dev` / manual click-through | No Node runtime with deps installed | `pnpm --filter @hmb/frontend dev`, visit `http://localhost:3000` |
| `next build` (production build success, bundle size) | Same | `pnpm --filter @hmb/frontend build` — watch for any remaining RSC boundary errors beyond what static analysis can catch, and record the reported bundle sizes for Sprint 2.8 performance tracking |
| `vitest run` (unit tests) | No installed deps | `pnpm --filter @hmb/frontend test` — 5 real test cases across Button/QuantitySelector/ShadeSelector should pass |
| `playwright test` (e2e/responsive/a11y) | No installed deps, no running app | `pnpm --filter @hmb/frontend build && pnpm --filter @hmb/frontend e2e` — runs 4 breakpoint projects × the specs in `testing/e2e/`, including a real axe-core scan |
| Real Lighthouse/Core Web Vitals measurement | No running app, no browser | Run Lighthouse against the built app once deployed to a preview environment |

## Acceptance Criteria Checklist (Sprint 2.12, as specified)

| Requirement | Status |
|---|---|
| Responsive layouts work | ⚠️ Built mobile-first against the exact frozen breakpoints (`bp-mobile`/`tablet`/`desktop`/`large`); Playwright specs cover all 4, but **visual confirmation requires a live run** (see runbook) |
| Components are reusable | ✅ Verified structurally — every component takes typed props, no component imports mock data directly except pages (see `COMPONENT_LIBRARY.md` mock data boundary note) |
| Navigation functions | ⚠️ Header/MegaMenu/MobileMenu/Footer/SearchBar wired with real `next/link`/`next/navigation` — **needs a live run to confirm** (e2e spec `navigation.e2e.ts` covers this) |
| Placeholder pages render correctly | ⚠️ All required routes exist with real mock data and pass static/type checks — **needs a live run to confirm actual rendering** |
| Accessibility requirements satisfied | ✅ Every interactive component has explicit ARIA roles/states/labels (see `COMPONENT_LIBRARY.md`); axe-core e2e scan written — **live pass/fail needs a real run** |
| Performance targets met | ⚠️ `next/font`, `next/image`, code-split-friendly structure in place — **no actual measurement possible without a live build/deploy** |

**Net assessment:** everything checkable through static analysis in this
sandbox passed, including catching and fixing a real bug that only static
analysis (not just "does it look right") surfaced. Live rendering,
bundle-size, and performance verification remain genuinely open until run
in a real environment — logged as a tracked risk below, following the
same pattern Sprint 1 used for R-7.
