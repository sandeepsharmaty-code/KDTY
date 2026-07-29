# Hue Muse Beauty E-commerce Platform — Release Notes
## Version 1.0.0-rc1

## Summary
A full-stack e-commerce platform (NestJS/TypeORM backend, Next.js
frontend) covering storefront, cart/checkout, order lifecycle, reviews,
CMS, an admin console with RBAC, a content validation engine, a seed/
demo-data engine, operational configuration, and production hardening
— built across 10 sprints (Sprints 1–10, including 6B and 7.1–7.7 sub-
sprints). This is a **release candidate**, not a confirmed production
release — see the Go/No-Go decision in
`SPRINT_10_PRODUCTION_SIGNOFF_AND_GO_NO_GO.md`.

## What's Included

**Storefront (Customer Platform):** registration/login, product
browsing/search/filter, product detail pages, cart, coupons, checkout,
order history, reviews (with verified-purchase detection), wishlist,
CMS static pages, FAQs, banners.

**Admin Platform:** role-based console (5-role permission matrix: Super
Admin, Store Manager, Product Manager, Content Manager, Customer
Support) covering dashboard, product/category/collection management,
order management, customer management, review moderation, CMS editor,
media upload, coupon management, reports, audit log, import/export,
queue monitor, integration status.

**Platform Services:** payment/shipping/email/SMS provider abstraction
(mock providers active; Stripe adapter structurally complete),
background job queue (BullMQ), Redis caching, object storage (S3/MinIO
compatible), a centralized Content Validation Engine (10 validators),
a Seed Engine (11 dependency-ordered, idempotent, rollback-capable
providers), and a Settings module (taxes, shipping zones, feature
flags, DB-backed notification templates, media settings, branding
reference, SEO defaults).

**Demo Data:** a validated 16-product catalog, 5 collections, 7 CMS
pages, FAQs, banners, 8 customers, 8 orders (spanning all order
statuses via the real state machine), ~16 reviews, 3 coupons.

## Security
- Helmet, CORS (configured origin, never wildcard), global + per-
  endpoint rate limiting, bcrypt (12 rounds), fail-fast environment
  validation.
- **Fixed this release cycle**: a High-severity IDOR in the wishlist
  module (any caller could read/modify any customer's wishlist by
  supplying their ID) and a SQL-injection-pattern in seed data
  backdating (not exploitable as shipped, corrected regardless).
- Zero open Critical or High severity defects as of this release.

## Known Limitations (see the full registers for detail)
- Tax rates and shipping zones are configurable but not yet applied to
  order-total calculations.
- No currency conversion (USD only, regardless of configured accepted
  currencies).
- Payment provider selection is fixed at application boot, not
  dynamically switchable.
- No persistent media library browsing (session-uploaded only) and no
  guided single-product creation form (CSV import is the bulk path).
- Wishlist has no automated test coverage (DEF-9-02).
- **No `package-lock.json` exists for either package** (DEF-9-04) —
  required before any real `npm ci`-based production build can
  succeed.

## What Has Never Been Executed (the reason this is a Release Candidate, not a confirmed release)
No code in this project has ever run against a live database, served a
real HTTP request, or executed in a browser-hosted production build.
Every sprint since Sprint 5 has disclosed this; Sprint 8 and this
sprint found and used real execution capability where it genuinely
existed (a real headless browser, real image processing, real SQL
constraint enforcement — 36 total genuinely-executed scenarios), but
the application, database, and deployment layers themselves remain
unexecuted. This is a sandbox-environment constraint (confirmed via
direct, repeated `npm`/`docker`/`postgres` checks every sprint since),
not a claim about code quality.

## Upgrade / Deployment Path
See `SPRINT_9_RELEASE_CANDIDATE_AND_RUNBOOKS.md` for the ordered
release runbook — the concrete steps from "real environment available"
to "deployed and verified."

## Versioning
No git repository exists in this environment (see
`SPRINT_7_FREEZE_MANIFEST.md` §3). This release is identified as
`v1.0.0-rc1` / baseline `SPRINT-10-BASELINE`, delivered as a packaged
zip archive — the project's actual versioning mechanism, stated
plainly rather than implied to be commit-based.
