# Sprint 2.1 / 2.11 — Routing Strategy

Next.js App Router with two route groups (Phase 14 §14.10), sharing the
same `StorefrontLayout` (Header/Footer/AnnouncementBar) but organized
separately so account-only middleware/guards (Sprint 3+) can be added to
`(account)/` without touching public routes.

| Route | Group | Notes |
|---|---|---|
| `/` | storefront | Home |
| `/shop` | storefront | All-products listing |
| `/shop/:category` | storefront | Category listing (5 fixed categories, Phase 1 §4) |
| `/collections/:slug` | storefront | Collection detail |
| `/products/:slug` | storefront | Product detail |
| `/search?q=` | storefront | Search results; `noindex` |
| `/cart` | storefront | Cart (client component — interactive local state) |
| `/pages/:slug` | storefront | Static content pages (About, FAQ, Privacy, etc.) |
| `/account` | account | Dashboard; `noindex` |
| `/account/wishlist` | account | `noindex` |
| `/account/orders` | account | Order tracking timeline; `noindex` |

## Not Built (explicitly out of scope for Sprint 2)
- `/checkout` and any checkout-step routes — no checkout page is listed in
  Sprint 2.5, and Checkout Steps (Phase 4 §17 Page Section) is not
  implemented as a result.
- `/account/login`, `/account/register` — authentication is explicitly out
  of scope (Sprint 2 OUT OF SCOPE; Sprint 3.3 covers auth framework only).
