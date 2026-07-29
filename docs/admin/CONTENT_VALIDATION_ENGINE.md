# Sprint 7.3 — Content Validation Engine

## Architecture
```
ContentValidationService (src/admin/content-validation/)
        │
        ├─ validateProductContent()      ─┐
        ├─ validateCategoryContent()      │  each: (1) gather cross-entity
        ├─ validateCollectionContent()    │  data via the OWNING module's
        ├─ validateCmsPageContent()       │  service (never a repository
        ├─ validateBannerContent()        │  directly — Phase 8 §3), then
        ├─ validateFaqContent()           │  (2) delegate to a pure,
        ├─ validateMediaContent()         │  independently-tested validator
        ├─ validateNotificationTemplate...│  function, then (3) wrap in the
        ├─ validateSeoContent()           │  standard ValidationReport shape
        └─ validateAccessibilityContent() ┘
                │
                ▼
      validators/*.validator.ts — pure functions, zero DB access,
      zero NestJS decorators, fully unit-testable without mocking
```

## Why the Validators Are Pure Functions
Every `validators/*.validator.ts` file exports a plain function taking
a plain input object and returning `ValidationIssue[]` — no
`@Injectable()`, no repository, no `async`. `ContentValidationService`
is the only thing that talks to the database (via other modules'
services) and the only thing that's actually injected anywhere. This
means:
- The 21 new unit tests (`__tests__/*.spec.ts`) test real logic with
  zero mocking — a marked contrast to most of this project's service
  tests, which need mocked repositories.
- A future caller (e.g. a CLI content-linter, or the seed script
  itself) could import a validator function directly without spinning
  up any NestJS DI context.

## The Circular-Dependency Problem (and How It Was Avoided)
`ContentValidationService` depends on `ProductsService`/
`CategoriesService`/`CollectionsService`/`CmsService` for existence
checks (slug/SKU uniqueness). Naively wiring validation *into* those
same services (so e.g. `ProductsService.activate()` calls
`ContentValidationService.validateProductContent()` first) would
require `ProductsModule` to import `ContentValidationModule`, which
already imports `ProductsModule` — a circular module dependency.

Rather than use `forwardRef()` (a workable but fragile Nest escape
hatch avoided everywhere else in this project), integration is
centralized the other direction: `ContentValidationController`
(`POST /v1/admin/content-validation/products/:id/validate-and-activate`)
depends on all four content services (one-directional, no cycle),
validates first, and only calls the existing module's real business
method (`ProductsService.activate` — completely unchanged) if
validation passes. This is how "existing modules consume the shared
validation service" is satisfied without restructuring the module
graph that's held up cleanly since Sprint 3.

## Integration Coverage (What's Wired vs. Documented as Pending)
| Content Type | Validate-then-act endpoint | Status |
|---|---|---|
| Product | `POST .../products/:id/validate-and-activate` | ✅ Wired |
| Category, Collection, CMS Page, Banner, FAQ, Media, Notification Template | — | ⚠️ `ContentValidationService` methods exist and are tested; no `validate-and-*` orchestration endpoint wired for these yet (see Known Issues) |

Product was chosen as the one fully-wired example because it has the
richest validation surface (pricing, variants, SEO, media all at
once) and the clearest "must pass validation before going live"
semantics (`activate`). The same pattern (validate, then call the
existing action method) is mechanical to repeat for the others.

## Response Shape (7.3.9)
Every validation call returns:
```json
{
  "contentType": "product",
  "entityId": "...",
  "isValid": false,
  "issues": [
    { "severity": "error", "code": "PRODUCT_MISSING_INGREDIENTS", "message": "...", "field": "content.ingredients" }
  ],
  "validatedAt": "2026-07-28T12:00:00.000Z"
}
```
`isValid` is `true` iff there are zero `"error"`-severity issues —
warnings and suggestions never block an action.
