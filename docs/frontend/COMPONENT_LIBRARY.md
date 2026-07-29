# Sprint 2.11 — Component Library Documentation

All component names and their tier (Basic/Composite/Section/Pattern) are
taken verbatim from the frozen Phase 4 §17 Component Library and Phase 14
§14.2 folder structure — no internal synonyms were introduced.

## Basic (`src/components/basic/`)
| Component | Purpose | Key a11y behavior |
|---|---|---|
| `Button` | All button variants (Primary/Secondary/Outline/Text/Icon/Success/Danger) | `aria-busy` while loading; disabled state removes hover/focus feedback per Phase 4 §6 |
| `Input` | Text/email/etc. form field | Label always visible above field (never placeholder-only); `aria-describedby` links helper/error text; `aria-invalid` on error |
| `Checkbox` / `RadioButton` | Selection controls | Label wraps the control so the whole label is tappable |
| `ToggleSwitch` | Binary preference toggle | `role="switch"`, `aria-checked`, labeled via `aria-labelledby` |
| `Badge` | Status/promo pill | Decorative only — never the sole carrier of meaning (paired with text everywhere it's used) |
| `Label`, `Divider`, `Avatar`, `Icon` | Primitives | `Icon` requires an explicit `label` prop for meaningful icons (renders `role="img"`); decorative icons default to `aria-hidden` |

## Composite (`src/components/composite/`)
| Component | Purpose | Key a11y behavior |
|---|---|---|
| `ProductCard`, `CategoryCard`, `CollectionCard` | Listing grid cards | Image `alt` required on the underlying `Product`/`Category`/`Collection` type — enforced by TypeScript, not optional |
| `ReviewCard` | Single review display | `StarRating` exposes `role="img"` with a text alternative (`"Rated X out of 5 stars"`) — never color/shape alone |
| `ShadeSelector` | Circular swatch picker | `role="radiogroup"`/`role="radio"`; out-of-stock shades are `disabled`, not hidden, per Phase 4 §10 |
| `QuantitySelector` | Stepper | Buttons disable at min/max; live region (`aria-live="polite"`) announces the new value |
| `SearchBar` | Autocomplete search | `role="combobox"` + `aria-expanded`/`aria-controls` on the input, `role="listbox"`/`role="option"` on suggestions |
| `Toast` | Non-blocking confirmation | `role="status"`, `aria-live="polite"`, auto-dismiss |
| `Alert` | Page-level notice | `role="alert"` for errors, `role="status"` otherwise |
| `Modal` | Confirmation dialog | Focus trap on open, focus returns to trigger on close, `Escape` closes, `role="dialog"` + `aria-modal` |
| `Drawer` | Slide-in panel (underlies Mobile Menu, Cart) | Same dialog semantics as `Modal` |
| `Tabs` | Content grouping (account/PDP only, never primary nav) | Full `role="tablist"`/`tab`/`tabpanel` wiring with roving `tabIndex` |
| `SkeletonLoader` / `ProductCardSkeleton` | Loading placeholder | `role="status"` with an accessible "Loading" label |

## Page Sections (`src/components/sections/`)
Header, MegaMenu, MobileMenu, Footer, AnnouncementBar, Hero,
CategoryDiscoveryGrid, ProductListingGrid, ProductDetailSummary, CartPanel,
AccountDashboard, OrderTrackingTimeline — one per Phase 4 §17 Page
Sections entry that Sprint 2's page set actually needs. Checkout Steps is
intentionally **not** built — no checkout page exists in Sprint 2 scope.

## Reusable Patterns (`src/components/patterns/`)
EmptyState, ErrorRecovery, FilterPanel, RelatedCarousel, TrustSignalStrip,
Breadcrumb, Pagination — each maps to its Phase 4 §17 pattern name.

## Mock Data Boundary
Every component takes typed props (`src/types/product.ts`); none import
`src/services/mock/*` directly except page components. This means the
mock service module is the **only** file that needs to change when real
API integration replaces it — component code is untouched.
