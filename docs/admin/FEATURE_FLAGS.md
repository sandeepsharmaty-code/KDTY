# Sprint 7.5 — Feature Flags

## What Exists
`FeatureFlagEntity` (key, enabled, description) + `SettingsService.
isFeatureEnabled(key)`. **Absence means enabled** — a key nobody has
ever explicitly configured defaults to `true`, so introducing a new
flag check in code never silently disables something that was working
before the flag existed.

## The Two Real Integrations (not just stored data)
| Flag | Gates | Where |
|---|---|---|
| `coupons.enabled` | Applying a coupon code to a cart | `CartService.applyCoupon` — throws a clear domain error if disabled |
| `reviews.mediaUploadsEnabled` | Whether a submitted review's photo is kept | `ReviewsService.submitReview` — review still submits; the photo is dropped, not rejected outright |
| `search.enabled` | Reserved, seeded `false` | Not yet wired to anything — search doesn't exist as a feature yet (see Known Issues) |

## Why Only Two Real Integrations
Sprint 7.5's instruction was to make configuration genuinely
consultable, not to retrofit a flag onto every feature that exists.
Two real, meaningfully-gated integrations were chosen over a longer
list of flags nothing actually checks — a flag nobody reads is worse
than no flag, since it implies control that doesn't exist.

## Admin API
- `GET /v1/admin/settings/feature-flags` — list all
- `PATCH /v1/admin/settings/feature-flags/:key` — `{ enabled, description? }`
