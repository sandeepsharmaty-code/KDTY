# Sprint 6 — Admin API Reference

## Auth
- `POST /v1/admin/auth/login` — `{ email, password }` → `{ sessionToken, role, expiresAt }`

## Dashboard (Phase 6 §1)
- `GET /v1/admin/dashboard/overview` — KPIs, pending tasks, recent activity

## Reports (Phase 6 §11)
- `GET /v1/admin/reports/sales-summary?dateFrom&dateTo`
- `GET /v1/admin/reports/orders?dateFrom&dateTo`
- `GET /v1/admin/reports/customers?dateFrom&dateTo`
- `GET /v1/admin/reports/products`
- `GET /v1/admin/reports/coupons`

## Audit Log (Phase 6 §15)
- `GET /v1/admin/audit-logs?module=&entityId=&page=&pageSize=`

## Coupons (Phase 6 §8)
- `POST /v1/admin/coupons` — create
- `GET /v1/admin/coupons?activeOnly=&page=&pageSize=`
- `PATCH /v1/admin/coupons/:id/active`

## Import/Export (Phase 6 — bulk operations)
- `GET /v1/admin/products/export` — CSV download
- `POST /v1/admin/products/import` — `{ csv: "..." }` → `{ succeeded, failed[] }`

## Bulk Operations
- `POST /v1/products/:id/{activate,deactivate}` (Sprint 4, per-item) —
  bulk variants (`ProductsService.bulkActivate/bulkDeactivate`) are
  **service-layer only in Sprint 6** — no dedicated bulk HTTP endpoint
  was added (see Known Issues); call the service methods directly if
  building an admin UI against them, or add the thin controller
  wrapper as a quick Sprint 7 addition.
- `ReviewsService.bulkApprove` — same status: service-layer only.

## Existing Sprint 3-5 Admin Endpoints (now actually usable)
All of these were previously unsatisfiable by any login (see
`ADMIN_ARCHITECTURE_GUIDE.md`) — now functional once an admin logs in:
- `POST/PATCH /v1/products/:id/{activate,deactivate,variants}`
- `PATCH /v1/categories/:id/{visibility,display-order}`
- `POST/DELETE /v1/collections/:id/products/:productId`, `PATCH .../{featured,display-order}`
- `PATCH /v1/orders/:id/status`
- `POST/DELETE /v1/reviews/:id/{approve,hide}`, `DELETE /v1/reviews/:id`, `POST /v1/reviews/:id/reply`
- `PATCH /v1/cms/pages/:slug`, `POST /v1/cms/banners`, `POST /v1/cms/faqs`
- `POST /v1/storage/upload`
- `GET /v1/email/sent`, `GET /v1/sms/sent`
