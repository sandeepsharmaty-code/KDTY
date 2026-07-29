# Sprint 4.13 — API Behavior Notes

Behavioral changes/additions a frontend integration needs to know about,
beyond what's already in `docs/backend/API_STANDARDS.md`.

## New Error Codes to Handle
Every `DomainException` (see `BUSINESS_RULES_GUIDE.md`) surfaces its
specific `errorCode` in the error response body — worth branching on
these specifically rather than just the HTTP status, since several map
to the same status (e.g. both `INSUFFICIENT_STOCK` and `INVALID_QUANTITY`
are HTTP 400):

| errorCode | HTTP Status | When |
|---|---|---|
| `INSUFFICIENT_STOCK` | 400 | Cart add/update exceeds available stock, or order creation hits a stock conflict |
| `STALE_WRITE_CONFLICT` | 409 | Concurrent stock write race — **client should retry the request** |
| `INVALID_QUANTITY` | 400 | Cart quantity isn't a positive integer |
| `CANNOT_ACTIVATE_WITHOUT_VARIANT` | 400 | Admin tried to activate a product with no shades/variants |
| `DUPLICATE_WISHLIST_ITEM` | 400 | Item already wishlisted (new behavior — Sprint 3 silently succeeded instead) |
| `CART_EMPTY` | 400 | Order creation attempted against an empty cart |
| `ORDER_NOT_CANCELLABLE` | 400 | Order has progressed past the cancellable window |
| `ORDER_NOT_RETURNABLE` | 400 | Order hasn't reached `delivered` yet |
| `RETURN_WINDOW_EXPIRED` | 400 | Past the 30-day return window |
| `INVALID_STATUS_TRANSITION` | 400 | Illegal order/review status change attempted |
| `REVIEW_NOT_PENDING` | 400 | Tried to approve a non-pending review |

## New Endpoints
- `POST /v1/orders` — create an order from a cart. **Public** (guest
  checkout supported per Phase 8 §6) — pass `customerId` explicitly.
  **If the caller IS authenticated** (a valid Bearer token is present),
  the supplied `customerId` must match the authenticated identity or the
  request is rejected with `REAUTHENTICATION_REQUIRED` — added as a
  Sprint 4.15 fix once this was identified as a spoofing risk. True
  guest requests (no token at all) are unaffected.
- `POST /v1/orders/:id/confirm` — pass an opaque `paymentReference`
  string; this endpoint does **not** talk to a payment provider itself.
- `POST /v1/orders/:id/fail`
- `GET /v1/orders/:id/refund-eligibility`
- `POST/DELETE /v1/collections/:id/products/:productId`
- `PATCH /v1/collections/:id/{featured,display-order}`
- `PATCH /v1/categories/:id/{visibility,display-order}`
- `POST /v1/products/:id/{activate,deactivate}`
- `POST /v1/products/:id/variants`
- `GET /v1/carts/:id/totals`
- `POST /v1/carts/merge` — call immediately after login/registration
- `PATCH /v1/customers/me/password`

## Behavior Changes (not just additions)
- **Wishlist duplicate add** now returns `400 DUPLICATE_WISHLIST_ITEM`
  instead of a silent `200` no-op. If the frontend was relying on the
  old silent-success behavior, it needs a small update.
- **Cart add/update** can now fail with `400 INSUFFICIENT_STOCK` at
  write time — previously this was only caught later at
  `GET /v1/carts/:id/validate`. Frontend add-to-cart flows should handle
  this error inline rather than assuming success and finding out at
  checkout.
- **Category/Collection list endpoints** now filter to
  `visible`/`active` — unchanged in practice from Sprint 3 (both already
  defaulted `true`), but now explicit and admin-controllable.

## Caching Behavior (Sprint 4.11)
`GET` responses on Products, Categories, Collections, and CMS are now
cached (see TTLs in `docs/backend/PERFORMANCE_FOUNDATION.md`). A write
through the corresponding admin endpoints invalidates that module's
cache immediately — but if a write happens through any path that
*isn't* one of the endpoints listed above (there isn't one currently,
but worth knowing for future additions), the cache would go stale until
TTL expiry.
