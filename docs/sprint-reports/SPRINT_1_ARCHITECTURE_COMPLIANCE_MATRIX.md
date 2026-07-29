# KI-1 — Architecture Compliance Matrix

## Source Documents Reviewed
Sprint 1's original submission flagged that the frozen Phase 0–23 /
Governance documents had not been provided as input. They have now been
supplied (`HueMuseBeauty_CompleteDocumentationSet.zip`) and were read
directly for this review:

- `HueMuseBeauty_ProgramGovernance_EnterpriseDeliveryFramework_v1.0.docx`
- `HueMuseBeauty_EnterpriseProgramPortfolioBlueprint_v1.0.docx`
- `HueMuseBeauty_Phase0_Foundation_v1.0.docx`
- `HueMuseBeauty_Phase2_ProductArchitecture_v1.0.docx`
- `HueMuseBeauty_Phase4_UIDesignSystem_v1.0.docx`
- `HueMuseBeauty_Phase8_TechnicalArchitecture_v1.0.docx` (primary source for
  Sprint 1's technology choices)
- `HueMuseBeauty_Phase10_TestingQALaunchReadiness_v1.0.docx`
- `HueMuseBeauty_Phase13_UIUXDesign_v1.0.docx`
- `HueMuseBeauty_Phase14_FrontendFoundation_v1.0.docx` (primary source for
  Sprint 2's frontend structure — reviewed now to catch Sprint 1
  foundation choices that would conflict with it)
- `HueMuseBeauty_Phase16_BackendCoreServices_v1.0.docx`

Method: full-text conversion to Markdown (`pandoc`) followed by targeted
review of every section governing technology, tooling, or repository
structure. Quoted section references below are from Phase 8, Section 2
("Recommended Technology Stack") unless noted otherwise.

## Compliance Matrix

| # | Technology Area | Sprint 1 Selection | Approved Specification (source) | Match? | Required Change |
|---|---|---|---|---|---|
| 1 | Frontend framework | React + Next.js (documented as future direction; not installed in Sprint 1) | "React with a server-rendering framework (e.g., Next.js)" — Phase 8 §2; confirmed again in Phase 14 §14.1 | ✅ Match | None |
| 2 | Backend framework | Node.js + TypeScript, generic (no framework named) | "Node.js with a structured framework (e.g., NestJS)" — Phase 8 §2 | ⚠️ Partial | **Applied:** `backend/README.md` and `DEPENDENCY_POLICY.md` updated to confirm NestJS as the specified direction. No code change required (Sprint 1 has no backend app code to migrate). |
| 3 | Database | PostgreSQL | "PostgreSQL — relational integrity suits the structured product/order model" — Phase 8 §2 | ✅ Match | None |
| 4 | Cache / session store | **Not present in original Sprint 1 submission** | "Redis — session storage, cart state, and frequently-read catalog data caching" — Phase 8 §2 | ❌ Gap (now fixed) | **Applied:** Added `redis` service to `infrastructure/docker/docker-compose.yml`, `REDIS_URL` to `.env.example`, and documented in `LOCAL_DEV_SETUP.md`. |
| 5 | Object storage | MinIO (S3-compatible, local dev) | "S3-compatible cloud storage" — Phase 8 §2 | ✅ Match | None — MinIO is the correct local-dev stand-in for an S3-compatible target; production provider selection is out of scope for Sprint 1/local dev. |
| 6 | Email (local dev) | MailHog | Production target: "transactional email provider (e.g., SendGrid, Postmark)" — Phase 8 §2 | ✅ Match | None — MailHog is explicitly a local-dev-only substitute; doesn't conflict with the production provider decision, which remains unmade (correctly, since it's out of Sprint 1 scope). |
| 7 | CDN | Not configured (no prod environment in Sprint 1) | "A global CDN (e.g., CloudFront, Cloudflare)" — Phase 8 §2 | N/A | None — correctly out of scope; no production environment exists yet. |
| 8 | Search / indexing | Not configured | "A managed search/indexing service (e.g., Elasticsearch or Algolia)" — Phase 8 §2 | N/A | None — correctly out of scope for Sprint 1 (and for Sprint 2, which uses mock data only). |
| 9 | Payment gateway | Not configured | "A PCI-compliant provider (e.g., Stripe...)" — Phase 8 §2 | N/A | None — explicitly out of scope for Sprint 1. |
| 10 | Authentication | Not configured (`JWT_SECRET`/`SESSION_SECRET` reserved as placeholders only) | "Managed auth service or mature open-source library (e.g., OAuth2/JWT-based)" — Phase 8 §2 | ✅ Directionally aligned | None — placeholders use JWT/session terminology consistent with the approved direction; no implementation in Sprint 1 (correctly out of scope). |
| 11 | Logging | Structured JSON logging standard documented; no aggregation service selected | "Centralized structured logging (e.g., a hosted log aggregation service)" — Phase 8 §2 | ✅ Match (standard); service selection correctly deferred | None — Sprint 1 emits no logs yet (no app code), so a concrete aggregator isn't needed until one does. |
| 12 | Repository strategy (monorepo, branching, PR gates) | pnpm monorepo, `main`/`develop` branch model, required PR review + CI | Not mandated by governance docs at the tooling level; Governance §7 requires "code reviews before any code merges to the main branch" (matches) and §8 requires semantic versioning (matches) | ✅ Match | None |
| 13 | CI/CD platform | GitHub Actions | Not mandated by any reviewed document | ✅ No conflict | None |
| 14 | Package manager | pnpm | Not mandated by any reviewed document | ✅ No conflict | None |
| 15 | Test frameworks (Vitest/Playwright) | Vitest (unit/integration), Playwright (e2e) | Phase 10 (Testing/QA) defines *test types and coverage*, not specific tooling — no framework mandated | ✅ No conflict | None |
| 16 | TypeScript strict mode | Enabled repo-wide | "TypeScript throughout, with explicit prop types for every component — no implicit any" — Phase 14 §14.1 | ✅ Match | None |
| 17 | Frontend folder structure | Not yet implemented (Sprint 1 scope was the workspace shell only) | Detailed `src/app`, `components/{basic,composite,sections,patterns}`, `layouts/`, `styles/{tokens,themes}`, `hooks/`, `services/`, `state/`, `utils/`, `types/`, `constants/`, `assets/`, `config/` structure — Phase 14 §14.2 | N/A for Sprint 1 | **Confirmed as the required structure for Sprint 2.1** — carried forward as a Sprint 2 input, not a Sprint 1 defect (Sprint 1's scope was explicitly the workspace shell, not the frontend's internal structure). |

## Summary

- **1 gap found and corrected:** Redis was specified in the approved
  Technical Architecture but absent from Sprint 1's local infrastructure.
  Fixed by updating `docker-compose.yml`, `.env.example`, and
  `LOCAL_DEV_SETUP.md`.
- **1 under-specification corrected:** the backend framework was generically
  "Node.js + TypeScript" rather than confirming the specified NestJS
  direction. Documentation updated; no code change was needed since no
  backend code exists yet.
- **All other Sprint 1 technology choices match the approved specification
  or are correctly out of scope** (no production-only concerns — CDN,
  search, payments — were implemented, consistent with Sprint 1's charter).
- **No governance-level conflicts** (branching, PR policy, versioning, CI
  platform, package manager, test tooling) were found — these areas are
  either explicitly unconstrained by the approved documents or already
  consistent with Governance §7–8.

## Artifacts Changed as a Result of This Review
1. `infrastructure/docker/docker-compose.yml` — added `redis` service.
2. `.env.example` — added `REDIS_URL`.
3. `docs/onboarding/LOCAL_DEV_SETUP.md` — documented the Redis service.
4. `backend/README.md` — confirmed NestJS as the specified backend
   framework direction.
5. `docs/dependency-management/DEPENDENCY_POLICY.md` — recorded the
   confirmed (not-yet-installed) technology direction for all layers.
