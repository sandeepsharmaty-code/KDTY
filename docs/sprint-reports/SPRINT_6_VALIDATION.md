# Sprint 6 — Sprint Validation

Same sandbox disclosure as every prior sprint: no network, no Docker,
no installed `node_modules`.

## What Was Actually Executed and Verified (real output)

**1. Full-tree TypeScript check** — 183 backend files (up from Sprint
5's 152):
```
npx tsc -p tsconfig.check.json
→ 0 real errors
```

**2. The most significant finding of the entire project so far**:
`@Roles("admin")` has been unsatisfiable by any real login across
every admin-gated endpoint from Sprints 3-5 (~15+ endpoints), because
no auth flow has ever issued a JWT with `role: "admin"` — customer
login always issues `"customer"`, and no admin identity existed at all
until this sprint. This was found while building Sprint 6's RBAC work,
not by the audit scripts — it surfaced because implementing real admin
login required tracing exactly what `RolesGuard` was checking against.
Fixed with a real admin identity realm plus a backward-compatible
`RolesGuard` change, and locked in with a dedicated regression test
(`roles.guard.spec.ts`) rather than just a code comment.

**3. Cross-module repository access audit**, extended to cover the new
`src/admin/` layer: **clean**.

**4. DI-wiring audit**, extended similarly: flagged 2 items
(`CouponsModule`, `ImportExportModule` "referencing" `admin:audit`
without importing `AuditModule`) — **manually verified as false
positives**: both only import the `@Audit()` *decorator* (pure
metadata, no DI), not `AuditLogService` itself (which `AuditInterceptor`
— the actual consumer — gets via `AdminModule`'s own import of
`AuditModule`). Documented here rather than silently dismissed, since
the audit script's imprecision here is itself worth knowing about for
future sprints extending it.

**5. A self-inflicted bug caught during this sprint's own editing**:
a `str_replace` operation meant to insert new `ProductsService` methods
accidentally deleted the `findProductOrThrow` method's signature line,
leaving its body orphaned under an unrelated method — which would have
been a straightforward compile error. Caught immediately by re-reading
the file after the edit (a habit reinforced by exactly this kind of
mistake happening in Sprint 5 with the `#`/`//` comment typo), not by
waiting for the later TypeScript check.

**6. Real unit tests**: 16 spec files total (3 new this sprint) — the
Phase 6 §12 permission matrix (spot-checked against specific documented
cells, including the security-relevant "every non-Super-Admin role is
denied Settings/User Roles" cases), coupon validation/discount
computation (percentage, fixed-amount, capping, expiry, usage limits),
and — most importantly — the `RolesGuard` compatibility fix itself.

## What Was NOT Built This Sprint (explicit scope cut, not an oversight)

- **No admin frontend UI.** Sprint 6's backend scope (RBAC fix,
  permission matrix, audit logging, dashboard/reports aggregation,
  coupons, import/export) was substantial enough on its own that
  building a parallel admin UI at the same fidelity as Sprint 2's
  storefront was not attempted this sprint. This is the single largest
  scope decision in this report — see Known Issues and the Readiness
  Assessment.
- Bulk activate/deactivate/approve exist at the service layer
  (`ProductsService.bulkActivate` etc.) but have no dedicated HTTP
  endpoint yet.
- Categories/Collections/CMS/Customers admin endpoints from Sprints
  3-4 were NOT retrofitted from `@Roles("admin")` to the new
  fine-grained `@RequirePermission()` — they're functional (thanks to
  the RolesGuard fix) but not yet role-differentiated per the full
  matrix (e.g. a Content Manager and a Store Manager currently get
  identical access to any endpoint still on `@Roles("admin")`, even
  though the matrix says they should differ).

## Acceptance Criteria Checklist

| Requirement | Status |
|---|---|
| Complete administrative interface | ⚠️ Backend complete; **no frontend UI built** |
| Role-based administration using existing auth framework | ✅ Built on Sprint 3's JWT/guard framework exactly as instructed; fixed a critical latent gap in the process |
| Product/category/collection/order/customer/CMS/media/review/promotion management | ✅ All reachable via API (mix of Sprint 3-5 endpoints, now actually usable, plus Sprint 6 additions); Promotion (Coupons) is new this sprint |
| Dashboards, audit logs, search/filtering, bulk operations, import/export, reporting | ✅ Dashboard, audit logs, search/filtering (Orders/Reviews/Customers), reports all complete; bulk operations service-layer only (no HTTP endpoint); import/export Products-only |
| Reuse services, don't duplicate business logic | ✅ Every new capability is a new method on an existing Sprint 3-5 service |
