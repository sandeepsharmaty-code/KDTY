# Sprint 6 — Admin Architecture Guide

## Two Authorization Layers
Sprint 6 introduces a **second, finer-grained** authorization mechanism
alongside Sprint 3's coarse one — both are real, both are active, and
they serve different endpoints:

| | `@Roles("admin")` + `RolesGuard` | `@RequirePermission(module, level)` + `PermissionsGuard` |
|---|---|---|
| Introduced | Sprint 3 | Sprint 6 |
| Granularity | "is this user *some* admin?" | "does this user's specific role have *this* level on *this* module?" per Phase 6 §12 |
| Applied to | Every Sprint 3-5 admin endpoint (Products/Categories/Collections/Orders/Reviews/CMS/Storage/Email/SMS) | Sprint 6's new endpoints (Dashboard/Reports/Coupons/Audit Log/Import-Export) |
| Status this sprint | **Fixed** (see below) — was unsatisfiable by any real login until this sprint | New, fully enforced |

## The Bug This Sprint Found and Fixed
Every `@Roles("admin")` check since Sprint 3 compared a JWT's `role`
claim against the literal string `"admin"`. But no auth flow has ever
issued that value — customer login (Sprint 3) always issues `"customer"`,
and no admin login existed at all until this sprint. **Every admin-gated
endpoint across Sprints 3-5 has been unsatisfiable by any real login the
entire time.**

Fixed two ways, applied together:
1. A real, separate admin identity realm now exists
   (`AdminUserEntity`/`AdminAuthService`, issuing JWTs with `role` set
   to one of the 5 real `AdminRole` values).
2. `RolesGuard` treats the literal `"admin"` requirement as shorthand
   for "any real `AdminRole` value" — so all 15+ existing
   `@Roles("admin")` decorators start working correctly the moment an
   admin logs in, with zero changes to those controllers.

## Permission Matrix (Phase 6 §12)
Transcribed verbatim as `PERMISSION_MATRIX` in
`src/admin/common/admin-role.ts` — 5 roles × 11 modules × 4 levels
(none/view/edit/full), with `full ⊇ edit ⊇ view ⊇ none`. See
`docs/admin/ROLE_PERMISSION_MATRIX.md` for the full table rendered as
documentation.

## Audit Logging (Phase 6 §15)
`@Audit(module, action)` + `AuditInterceptor` (global) records every
successful mutation on a decorated endpoint: actor, module, action,
affected entity ID, and the response body as `after`. Login activity
(success and failure) is recorded directly by `AdminAuthService`, not
via the interceptor (a login isn't a "mutation" in the same sense, and
a *failed* login has no successful response for the interceptor to
hook into).

## What Reuses Sprint 3-5 Services (not duplicated)
Every Sprint 6 read/aggregation capability is a **new method on an
existing service**, not new business logic:
- `OrdersService.getTodaysOrderStats/searchOrders/getOrdersReport`
- `ProductsService.getLowStockCount/bulkActivate/bulkDeactivate/
  getProductsReport/listAllForExport/upsertFromImportRow`
- `ReviewsService.getPendingCount/adminList/bulkApprove`
- `CustomersService.adminSearch/getCustomersReport`

`bulkActivate`/`bulkDeactivate`/`bulkApprove` literally call the
existing single-item `activate`/`deactivate`/`approveReview` methods in
a loop — the status-rule validation and cache invalidation those
methods already do is reused unchanged, not reimplemented.
