# Sprint 3.11 — Performance Foundation

## Redis Caching Framework
`@Cacheable({ ttlSeconds, keyPrefix })` (`src/cache/cacheable.decorator.ts`)
marks a GET controller method as cacheable; `HttpCacheInterceptor`
(registered globally in `app.module.ts`) reads that metadata, serves from
Redis on a hit, and populates it on a miss. Non-GET requests and
undecorated endpoints pass through untouched.

**Applied in Sprint 3 to:** `GET /v1/products`, `GET /v1/products/:slug`
(60s TTL), `GET /v1/categories` (300s TTL — changes far less often per
Phase 1 §4's fixed 5-category structure).

**Not yet applied:** Collections, CMS banners/FAQs. These are equally
good caching candidates per Phase 8 §8 but weren't wired in Sprint 3 —
tracked in Known Issues as a quick Sprint 4 addition (the framework
already supports it; it's a one-line decorator per endpoint).

## Cache Invalidation
`CacheInvalidationService.invalidatePrefix(keyPrefix)` clears every
cached response under a module's key prefix (Phase 16 §16.15: "product
update triggers cache invalidation for that product's cache entries").

**Not yet wired to a write path** — Sprint 3.5 deliberately does not
build admin write/mutation endpoints for Products (Admin APIs, Phase 16
§16.13, isn't in Sprint 3.5's module list). There is currently no
Products write endpoint to call `invalidatePrefix("products")` from.
This is not a gap in Sprint 3 scope, but it is the first thing Sprint 4's
Admin API work should wire up, since the mechanism already exists.

## Pagination
`PaginationQueryDto`/`PaginatedResponse` (`src/common/dto/`) — offset-based,
consistent across every list endpoint, per Phase 8 §5/Phase 16 §16.15.

## Query Optimization Guidelines
- Every entity relationship that's queried by a foreign key in a
  list/filter path should have that column indexed — see
  `@Index()` usage on `email` (Customer), `slug` (Product/Category/
  Collection), `customerId` (Cart/Wishlist/Order/Review), `sku`
  (ProductVariant).
- `ProductsService.listProducts` builds its query via `QueryBuilder`
  with explicit `leftJoinAndSelect` rather than loading relations
  N+1-style — this is the pattern to follow for any new list endpoint.
- Sort fields are allow-listed (`ProductsService.listProducts`'s
  `allowed` set) rather than interpolating an arbitrary client-supplied
  column name into `ORDER BY` — both a performance guardrail (no
  accidental unindexed sort) and a SQL-injection guardrail (Phase 8 §7).
- No full-table scan is expected on any customer-facing read path
  (Phase 8 §8) — this is a design guideline for Sprint 4+ endpoints to
  follow, not something enforced by tooling yet (see Known Issues:
  no query-plan/slow-query monitoring wired in Sprint 3).

## Background Jobs
Phase 16 §16.15 calls for non-blocking background jobs (search
reindexing, notification dispatch, invoice generation). **Not
implemented in Sprint 3** — no job queue (e.g. BullMQ) is wired. All
current operations (e.g. `generateInvoice`) run synchronously within the
request. This is a deliberate Sprint 3 scope boundary (Search and
Notifications modules aren't scaffolded this sprint either) rather than
an oversight — flagged in Known Issues as a Sprint 4+ addition once
those modules exist.

## Compression
`compression()` middleware applied in `main.ts` (Sprint 3.2/3.11).
