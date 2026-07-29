# Sprint 2.11 — Frontend Folder Structure

Matches the frozen Phase 14 §14.2 structure exactly (see Sprint 1's
Architecture Compliance Matrix, item 17, which flagged this as the
confirmed Sprint 2 input).

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (storefront)/       # Public storefront routes (own layout)
│   │   ├── page.tsx                    → /
│   │   ├── shop/page.tsx               → /shop
│   │   ├── shop/[category]/page.tsx    → /shop/:category
│   │   ├── collections/[slug]/page.tsx → /collections/:slug
│   │   ├── products/[slug]/page.tsx    → /products/:slug
│   │   ├── search/page.tsx             → /search
│   │   ├── cart/page.tsx               → /cart
│   │   └── pages/[slug]/page.tsx       → /pages/:slug (static pages)
│   ├── (account)/          # Customer account routes (own layout, shares chrome)
│   │   └── account/{page,wishlist,orders}
│   ├── layout.tsx          # Root layout — fonts, base SEO metadata
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── basic/        # Button, Input, Checkbox, Radio, Toggle, Icon, Badge, Label, Divider, Avatar
│   ├── composite/    # ProductCard, ReviewCard, ShadeSelector, SearchBar, Toast, Modal, Drawer, Tabs, SkeletonLoader...
│   ├── sections/     # Header, MegaMenu, Footer, Hero, ProductDetailSummary, CartPanel...
│   └── patterns/     # EmptyState, ErrorRecovery, FilterPanel, Breadcrumb, Pagination...
├── layouts/          # StorefrontLayout (page-level wrapper)
├── styles/
│   ├── tokens/       # colors.css, typography.css, spacing.css, misc.css
│   ├── themes/       # essential.css, luxe.css, elite.css
│   └── globals.css
├── hooks/            # useMediaQuery, useFilters
├── services/
│   └── mock/         # products.ts — MOCK DATA ONLY, replaced wholesale in a later sprint
├── state/            # Reserved for cross-page state (empty in Sprint 2 — see state/README.md)
├── utils/            # formatCurrency, cn
├── types/            # product.ts — shared domain types
├── constants/         # routes.ts, navigation.ts (footer/nav sourced from Phase 1 IA)
├── assets/           # Reserved for brand assets (none committed — see Known Issues)
└── config/           # site.ts — SEO/metadata config
```

## Naming Conventions (Phase 14 §14.1, confirmed)
- Component files/folders: PascalCase (`ProductCard.tsx`).
- Utility/hook files: camelCase (`useCartState.ts` pattern — actual hooks
  are `useMediaQuery.ts`, `useFilters.ts`).
- Component names match Phase 4 §17 / Phase 13 §13.7 vocabulary exactly —
  no internal synonyms (e.g. always `ProductCard`, never `ItemTile`).
- CSS/design tokens named identically to Phase 4 §18 token names (e.g.
  `color-primary-rose`, `space-4`), implemented as CSS custom properties
  and mapped into Tailwind's theme rather than using Tailwind's defaults.
