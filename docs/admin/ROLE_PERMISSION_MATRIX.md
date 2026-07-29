# Sprint 6 — Role & Permission Matrix

Transcribed verbatim from the frozen Phase 6 §12. "Full" = create/edit/
delete; "Edit" = create/edit, no delete; "View" = read-only; "None" =
module not visible to that role.

| Module | Super Admin | Store Manager | Product Manager | Content Manager | Customer Support |
|---|---|---|---|---|---|
| Dashboard | Full | Full | View | View | View |
| Products | Full | Edit | Full | View | View |
| Categories/Collections | Full | Edit | Full | View | None |
| Orders | Full | Full | None | None | Edit |
| Customers | Full | View | None | None | Edit |
| Reviews | Full | Edit | View | Edit | Edit |
| Coupons/Promotions | Full | Full | None | None | None |
| Banners/Content/FAQ | Full | View | None | Full | View |
| Website Settings | Full | None | None | None | None |
| Reports | Full | Full | View | None | None |
| User Roles | Full | None | None | None | None |

## Enforcement
`hasPermission(role, module, requiredLevel)` in
`src/admin/common/admin-role.ts` — checked by `PermissionsGuard`
against `@RequirePermission(module, level)`. See
`ADMIN_ARCHITECTURE_GUIDE.md` for which endpoints use this vs. the
coarser Sprint 3 `@Roles("admin")` mechanism.

## Login
`POST /v1/admin/auth/login` — separate from customer login
(`POST /v1/auth/login`). Seeded Super Admin account for local/test use:
`admin@huemusebeauty.local` / `ChangeMe123!` (see
`src/database/seeds/run-seed.ts` — never a real credential, must be
changed immediately in any non-local environment).
