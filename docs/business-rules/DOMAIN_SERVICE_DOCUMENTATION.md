# Sprint 4.13 — Domain Service Documentation

Extends Sprint 3's `docs/backend/MODULE_DOCUMENTATION.md` with what
Sprint 4 added to each service. Only new/changed methods are listed —
unchanged Sprint 3 methods are already documented there.

| Service | New/Changed in Sprint 4 |
|---|---|
| `CustomersService` | `changePassword` (new — was missing from Sprint 3 despite being in the Phase 16 spec) |
| `ProductsService` | `activate`, `deactivate`, `addVariant`, `adjustStock` (new); `findById`, `findVariantById` (new, added to support other modules going through the service interface instead of injecting repositories) |
| `CategoriesService` | `setVisibility`, `setDisplayOrder` (new); `listCategories`/`getCategory` now filter/require `visible: true` |
| `CollectionsService` | `assignProduct`, `unassignProduct`, `setFeatured`, `setDisplayOrder` (new); constructor changed from injecting `ProductEntity`'s repository to injecting `ProductsService` (Sprint 4 structural-audit fix) |
| `CartService` | `addItem`/`updateQuantity` now validate real stock quantity (was: no validation at write time, only at `validateCart`); `getTotals` (new); `mergeGuestCart` (new) |
| `WishlistService` | `addItem` now validates the variant exists and raises `DUPLICATE_WISHLIST_ITEM` instead of silently no-opping on a duplicate |
| `OrdersService` | `createOrder`, `confirmOrder`, `failOrder`, `checkRefundEligibility` (all new); `updateStatus` now enforces `VALID_TRANSITIONS`; `requestCancellation` now releases stock and runs in a transaction; `requestReturn` now checks the 30-day return window |
| `ReviewsService` | `approveReview`/`hideReview` now validate the current status before transitioning |
| `CmsService` | Every write method (`updateStaticPage`, `scheduleBanner`, `upsertFaq`) now calls `CacheInvalidationService.invalidatePrefix("cms")` |

## New Cross-Cutting Services (Sprint 4)
| Service | Purpose |
|---|---|
| `TransactionService` (`src/database/`) | Wraps TypeORM `QueryRunner` transactions with commit/rollback |
| `CacheInvalidationService` (`src/cache/`, made globally injectable via `CacheUtilsModule`) | Existed in Sprint 3 but was unused; Sprint 4 wires it into every write path on the now-cached modules |
| `DomainException` (`src/common/exceptions/`) | Business-error-code carrying exception, replacing generic `BadRequestException`/`ConflictException` usage in the modules touched this sprint |
