# Sprint 3.12 — Module Documentation

Each module's public API is its `*Service`'s exported methods; each
maps 1:1 to a Phase 16 §16.x method signature (cited in that service's
source comments). Summary:

| Module | Service | Phase 16 Ref | Key Endpoints |
|---|---|---|---|
| Auth | `AuthService` | §16.2 | `POST /v1/auth/{register,login,refresh,logout}` |
| Customers | `CustomersService` | §16.3 | `GET/PATCH /v1/customers/me`, `/me/addresses/*` |
| Products | `ProductsService` | §16.4 | `GET /v1/products`, `/v1/products/:slug`, `/v1/products/availability/:sku` |
| Categories | `CategoriesService` | §16.4 | `GET /v1/categories`, `/v1/categories/:slug` |
| Collections | `CollectionsService` | §16.4 | `GET /v1/collections`, `/v1/collections/:slug` |
| Wishlist | `WishlistService` | §16.5 | `GET/POST /v1/wishlist`, `/v1/wishlist/share`, `/v1/wishlist/shared/:token` |
| Cart | `CartService` | §16.6 | `POST /v1/carts`, `/v1/carts/:id/items`, `/v1/carts/:id/validate` |
| Orders | `OrdersService` | §16.8 | `GET /v1/orders`, `/v1/orders/:id/{cancel,return,tracking,invoice}` |
| Reviews | `ReviewsService` | §16.9 | `GET /v1/reviews/product/:variantId`, `POST /v1/reviews` |
| CMS | `CmsService` | §16.11 | `GET /v1/cms/{pages/:slug,banners,faqs}` |
| Storage | `StorageService` | §16.14 (secure uploads) | `POST /v1/storage/upload` |

Full parameter/response types are in each module's `dto/` and
`entities/` folders, and are also machine-readable via the generated
OpenAPI document (`docs/backend/API_STANDARDS.md`).

## Deferred Method Bodies (documented, not silent)
| Method | Module | Why deferred |
|---|---|---|
| `AuthService.requestPasswordReset/resetPassword/verifyOtp/validateAdminSession` | Auth | Requires email/SMS delivery (out of scope) or an admin realm (out of scope) |
| `CartService.applyCoupon` (discount calculation) | Cart | Coupons module not scaffolded this sprint |
| `CartService.estimateShipping` (real rate) | Cart | Settings module not scaffolded this sprint |
| `ReviewsService` Verified Purchase cross-check | Reviews | Requires an Orders integration decision beyond "minimal business logic" |
| `OrdersService.generateInvoice` (PDF rendering) | Orders | Needs a document-generation dependency, not part of this sprint |
| `StorageService` virus/content scanning | Storage | Needs a scanning provider decision, out of scope |
