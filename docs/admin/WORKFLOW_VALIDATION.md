# Sprint 7.5 — Customer & Admin Workflow Validation

Sandbox disclosure, as every prior sprint: no live database, no live
app. What follows is a code-level trace of each workflow confirming
the Settings module is genuinely consulted where claimed — backed by
the automated tests listed, not just asserted in prose.

## Customer-Facing Workflows

| Workflow | Settings dependency | Verified by |
|---|---|---|
| Storefront footer / Contact Us page reads business info | `GET /v1/admin/settings/business` (public) | Endpoint exists, `@Public()`, cached — same pattern proven working since Sprint 7 |
| Applying a coupon code at checkout | `coupons.enabled` feature flag | `CartService.applyCoupon` throws a domain error when disabled — code-level, not yet exercised against a live disabled flag |
| Submitting a review with a photo | `reviews.mediaUploadsEnabled` feature flag | `ReviewsService.submitReview` drops `mediaUrl` when disabled — same caveat |
| Uploading media (product/review images) | `maxUploadSizeBytes`, `allowedMimeTypes` | `StorageService.validate()` now `await`s `SettingsService.getMediaSettings()` instead of reading a hardcoded constant — confirmed by reading the updated implementation, not executed live |
| Receiving a transactional email (order confirmation, etc.) | `NotificationTemplateEntity` override, falling back to Sprint 5.4 default | `EmailService` — **directly tested**, both branches (`email.service.spec.ts`), the one workflow in this table backed by an actual passing test rather than code-reading alone |

## Admin Workflows

| Workflow | Settings dependency | Verified by |
|---|---|---|
| Editing business settings (store name, support contact, socials) | `PATCH /v1/admin/settings/business` | Unchanged from Sprint 7, already real |
| Configuring a tax rate | `POST /v1/admin/settings/tax-rates`, upserts by region | **Directly tested** (`settings.service.spec.ts`) — confirms a second call for the same region updates rather than duplicates, the exact bug this sprint found and fixed |
| Configuring a shipping zone | `POST /v1/admin/settings/shipping-zones`, upserts by name | Same — directly tested |
| Toggling a feature flag | `PATCH /v1/admin/settings/feature-flags/:key` | `isFeatureEnabled` behavior directly tested for both explicit states and the permissive absent-key default |
| Editing a notification template | `POST /v1/admin/settings/notification-templates` | `upsertNotificationTemplate` — code-reviewed, not directly unit-tested this sprint (Known Issues) |
| Viewing branding reference | `GET /v1/admin/settings/branding` | Values verified against the actual frontend token file before this sprint closed (see `CONFIGURATION_COMPLETENESS.md`'s own note about catching 5 wrong values) |

## What This Table Deliberately Does NOT Claim
No row above claims a live HTTP round-trip happened. "Verified by:
code-level trace" means exactly that — the implementation was read and
confirmed to call the right method, not that a server was started and
a request was sent. Where a real automated test exists, that's stated
explicitly and is the stronger claim of the two. This distinction is
kept visible rather than blurred, consistent with every prior sprint's
validation reports.
