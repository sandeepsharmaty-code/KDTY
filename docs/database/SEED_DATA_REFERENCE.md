# Sprint 7.4 — Seed Data Reference

## Scale (calibrated, not exhaustive — see each data file's own comments)
| Entity | Count | Notes |
|---|---|---|
| Main categories | 5 | Fixed per Phase 1 §4, unchanged since Sprint 3 |
| Subcategories | 16 | Every one Sprint 7.4 named, nested under the correct main category |
| Products | 16 | One per subcategory, each with the full Phase 9 §3 content template |
| Product variants | 21 | 1-2 shades/sizes per product |
| Collections | 5 | Featured (×3), Seasonal, Limited Edition — "Trending" deliberately NOT a static collection (see collections.ts) |
| CMS static pages | 7 | Homepage, About, Contact, Privacy, Terms, Shipping Policy, Return & Refund Policy |
| FAQs | 7 | General, categorized (shipping/returns/product/orders) |
| Banners | 3 | 2× homepage-hero, 1× category-top |
| Coupons | 3 | Percentage + fixed-amount, with and without usage limits |
| Customers | 8 | Each with one address, alternating marketing-consent preferences |
| Orders | 8 | One per customer, spanning all 6 named statuses via the real state machine |
| Reviews | ~16 | 1-2 per customer, mix of verified/unverified and approved/pending |

## Known Content Gaps Surfaced While Building This
Building real seed data against the real Content Validation Engine
surfaced several schema gaps that had existed since earlier sprints —
fixed here rather than worked around:
- `ProductEntity` had no image field at all (Sprint 7.3 already found
  and fixed this).
- `CategoryEntity`, `CollectionEntity`, and `StaticPageEntity` had no
  SEO fields (metaTitle/metaDescription) — added this sprint.
- `BannerEntity` had no alt-text field — added this sprint.
- `ReviewEntity.verifiedPurchase` was hardcoded `false` everywhere,
  with no code path that ever computed or set it `true` — added an
  optional parameter and real computation logic (checks the
  customer's actual order history) in `ReviewsSeedProvider`.
- `OrdersService.listOrderHistory` never loaded the `lineItems`
  relation — every caller (customer order history, Sprint 6B's admin
  customer-detail page, and this sprint's review-verification logic)
  would have silently received orders with an undefined line-items
  array. Fixed at the source.
- `CategoriesService`, `CollectionsService`, and `CmsService.
  upsertStaticPage` had **no create path at all** — categories,
  collections, and new static pages were only ever creatable via
  direct repository access in the old Sprint 3 seed script.

## What's NOT Modeled (documented scope cuts)
- **Notification templates** remain Sprint 5.4's hardcoded email
  templates — no `NotificationTemplateEntity` was built this sprint
  (would be new, non-trivial scope). Sprint 7.4's "notification
  templates" deliverable is satisfied by validating the 5 existing
  templates against Sprint 7.3's `validateNotificationTemplate`
  (documented in `docs/database/NOTIFICATION_TEMPLATE_QA.md`), not by
  making them database-backed/admin-editable.
- **"Trending" collection**: not a static row (see
  `collections.ts`) — it's inherently a computed signal, not curated
  content.
- **Homepage CMS page**: stores SEO/meta content only. The actual
  Next.js homepage is component-composed (Sprint 2's Hero + Category
  Grid + Collections), not rendered from CMS page content.
- **Contact, Homepage, and Return & Refund Policy pages** don't yet
  have a corresponding Sprint 2 frontend route — the backend content
  exists; wiring a new page route is a frontend change out of this
  content-only sprint's scope.
