# Sprint 5.12 — Configuration Guide

## New Environment Variables (Sprint 5)
All optional (defaulting to the mock provider) except where noted —
`env.validation.ts` was NOT extended to require any of these, since
every Sprint 5 environment is expected to run on mocks only.

| Variable | Default | Purpose |
|---|---|---|
| `PAYMENT_PROVIDER` | `mock` | `mock` or `stripe` |
| `STRIPE_SECRET_KEY` | unset | Only read if `PAYMENT_PROVIDER=stripe` — never set in Sprint 5 |
| `STRIPE_WEBHOOK_SECRET` | unset | Same |
| `SHIPPING_PROVIDER` | `mock` | Only `mock` is actually registered this sprint |
| `EMAIL_PROVIDER` | `mock` | Only `mock` is actually registered this sprint |
| `EMAIL_FROM_ADDRESS` | `no-reply@huemusebeauty.local` | |
| `SMS_PROVIDER` | `mock` | Only `mock` is actually registered this sprint |

## Provider Selection
Changing `PAYMENT_PROVIDER` (or any `*_PROVIDER` var) from `mock` to a
real provider name requires **also** supplying that provider's
credentials, or the app boots fine (constructors don't throw — see
`PROVIDER_ADAPTER_GUIDE.md` point 2) but every actual call to that
provider will throw a clear "not configured" error at call time.

## File Lifecycle Policy (Sprint 5.6)
- Uploads are tagged by category: `product-media/`, `cms-assets/`,
  `review-media/` (S3 key prefix).
- **Policy** (not yet automated — see Known Issues): objects with no
  referencing entity row (e.g. an upload abandoned mid-form) should be
  deleted after 30 days. `StorageService.deleteObject()` is the
  building block; no scheduled job calls it yet.
- Signed read URLs expire after 15 minutes
  (`SIGNED_URL_TTL_SECONDS`).

## Credential Rotation Guidance
No live credentials exist in this sprint, so there's nothing to
actually rotate — this is forward-looking guidance for whichever sprint
first configures a real provider:
1. Never commit a credential to `.env` in version control — Sprint 1's
   `.gitignore` already excludes `.env*`.
2. Generate the new credential in the provider's dashboard *before*
   revoking the old one — avoid a window with no valid credential.
3. Update the credential in whatever secret store the deployment
   environment uses (out of scope to specify further — no deployment
   environment exists yet, per every prior sprint's closure).
4. Restart/redeploy so the new `ConfigService` value is picked up (no
   hot-reload of secrets exists — each provider reads its credential
   once, at construction/first-use).
5. Revoke the old credential only after confirming the new one works
   (check `GET /v1/integrations/status` for the provider's
   `lastSuccessAt`).
