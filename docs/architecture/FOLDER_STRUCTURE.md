# Sprint 1.2 — Folder Structure

## Structure

```
hue-muse-beauty-ecommerce/
├── frontend/          # Customer-facing web app (Next.js/React + TS) — empty shell
├── backend/           # API server (Node/TS) — empty shell
├── shared/            # Cross-package types/constants/utilities — empty shell
├── infrastructure/    # Local dev infra (Docker Compose) + IaC placeholder (Terraform)
├── docs/              # All Sprint 1 documentation (this package)
├── deployment/        # Deployment pipeline config + env definitions (future sprints)
├── testing/           # Test frameworks + folder structure (no suites yet)
├── assets/            # Design/brand assets (none committed yet)
├── scripts/           # Setup/dev/lint/test automation
├── config/            # Shared ESLint/Prettier/TypeScript base configs
└── .github/           # CI/CD workflows, PR template, CODEOWNERS
```

## Naming Conventions
- **Folders:** `kebab-case`.
- **TypeScript/JavaScript files:** `kebab-case.ts` for modules,
  `PascalCase.tsx` for React components.
- **Test files:** `*.test.ts` (unit), `*.spec.ts` (integration), colocated
  under the relevant `testing/<type>/` mirror path or alongside source per
  `docs/standards/TESTING_STANDARDS.md`.
- **Config files:** dot-prefixed where tool convention requires it
  (`.eslintrc.*`, `.prettierrc.*`), otherwise `UPPER_SNAKE_CASE.md` for docs.
- **Environment files:** `.env.example` committed; `.env*` gitignored.

## Assumptions
- Business domain folders (e.g. `catalog/`, `checkout/`, `cart/`) are
  intentionally **not created** in Sprint 1 — they are OUT OF SCOPE and will
  be scaffolded in the sprint(s) that implement those features.

## Acceptance Criteria
- [ ] All top-level folders exist and are documented above.
- [ ] Naming conventions documented and reflected consistently in all
      Sprint 1 files.
- [ ] No business-domain folders present.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Folder layout doesn't match the (unreviewed) approved Frontend/Backend Architecture docs | Medium | Layout uses conventional, low-lock-in structure (workspace packages); validate against real docs before Sprint 2 |
