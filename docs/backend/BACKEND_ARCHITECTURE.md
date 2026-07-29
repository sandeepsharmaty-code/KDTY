# Sprint 3.12 — Backend Architecture Guide

## Layered Architecture (Phase 8 §1 / Phase 16 §16.1)
```
Request -> Controller (validation, auth check)
        -> Service (business logic, module-owned)
        -> Repository (data access, module-owned)
        -> Database / Cache / Storage
```
Controllers never contain business logic — they parse/validate the
request (via DTOs + the global `ValidationPipe`), check auth (via guards),
call exactly one service method, and let interceptors shape the response.

## Module Boundaries (Phase 8 §3)
Every module owns its entities exclusively. Cross-module calls happen
**only** through another module's exported `*Service`, injected via its
`*Module`'s `exports` array — never through a direct repository import.
Concretely in this codebase:
- `CartService` calls `ProductsService.checkAvailability(...)` — never
  touches `ProductVariantEntity`'s repository directly.
- `WishlistService` calls `CartService.addItem(...)` for `moveToCart`.
- `AuthService` calls `CustomersService.create/findByEmail/findById(...)`
  — `AuthModule` never injects `CustomerEntity`'s repository.

This is enforced by convention + code review today (see Known Issues for
a recommended dependency-cruiser/lint rule to make it mechanical).

## Request Pipeline (Sprint 3.6/3.7, wired in `app.module.ts` + `main.ts`)
1. `helmet()` — security headers
2. `compression()` — response compression
3. CORS allowlist check
4. URI versioning resolution (`/v1/...`)
5. `JwtAuthGuard` — auth required unless `@Public()`
6. `RolesGuard` — role check if `@Roles(...)` present
7. `ThrottlerGuard` — rate limiting
8. Global `ValidationPipe` — DTO validation
9. Controller -> Service -> Repository
10. `HttpCacheInterceptor` — serves/populates cache for `@Cacheable()` GETs
11. `ResponseEnvelopeInterceptor` — wraps successful responses
12. `GlobalExceptionFilter` — catches anything thrown, shapes the error response
13. `RequestLoggingInterceptor` — logs the outcome either way

## Entity/Data Ownership (Phase 8 §4)
| Domain | Entities | Owning Module |
|---|---|---|
| Product | Product, ProductVariant | Products |
| Taxonomy | Category | Categories |
| Merchandising | Collection | Collections |
| Customer | Customer, Address | Customers |
| Auth | RefreshToken | Auth |
| Transaction | Cart, CartLineItem | Cart |
| Transaction | Order, OrderLineItem, OrderStatusHistory | Orders |
| Engagement | Wishlist, WishlistItem | Wishlist |
| Engagement | Review, ReviewReply | Reviews |
| Content | StaticPage, Banner, FaqEntry | CMS |

## What's Deliberately NOT Built in Sprint 3
Per Sprint 3's OUT OF SCOPE and Sprint 3.5's module list: Checkout
Services (payment gateway), Search Services, Notifications, Coupons,
Settings, and Admin APIs are **not scaffolded**. Where a scaffolded
module's method signature references one of these (e.g.
`CartService.applyCoupon`, `CartService.estimateShipping`), the method
exists with the exact Phase 16 signature but returns a documented
placeholder rather than real logic — see each service's inline comments
and `docs/sprint-reports/SPRINT_3_CLOSURE_REPORT.md`'s Known Issues.
