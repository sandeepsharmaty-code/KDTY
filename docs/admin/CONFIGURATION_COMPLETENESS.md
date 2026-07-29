# Sprint 7.5 — Configuration Completeness

Sprint 7.5's instruction: "every configurable value is managed through
the Settings module rather than hard-coded." This document is the
honest accounting of where that's fully true, partially true, and
explicitly not attempted.

## Fully Moved to Settings (genuinely single source of truth now)
| Value | Was | Now |
|---|---|---|
| Media upload max size / allowed types / min dimensions | Hardcoded in `StorageService` AND separately re-cited in the Sprint 7.3 media validator (two constants that happened to agree) | `BusinessSettingsEntity` columns, read by both via `SettingsService.getMediaSettings()` |
| Notification templates | Hardcoded in `EMAIL_TEMPLATES` (Sprint 5.4), no edit path | `NotificationTemplateEntity`, checked first by `EmailService`, falling back to the hardcoded default only if no override exists |
| Tax rates | Did not exist | `TaxRateEntity`, region-keyed |
| Shipping zones/methods | Did not exist | `ShippingZoneEntity` |
| SEO defaults (OG image, title suffix, Twitter handle, robots) | Did not exist as structured data | `BusinessSettingsEntity` columns |
| Feature flags | Did not exist as a concept | `FeatureFlagEntity`, 2 real integrations (see `FEATURE_FLAGS.md`) |

## Reference/Display Only (documented, not a shortfall)
| Value | Reality |
|---|---|
| **Active payment provider** | Still genuinely selected by the `PAYMENT_PROVIDER` env var at NestJS DI bootstrap time (Sprint 5's factory-provider pattern). `BusinessSettingsEntity.activePaymentProviderDisplay` exists so the configured value is *discoverable* through the Settings API — it does not and cannot hot-swap the actual DI-resolved provider instance without an app restart. This is a real architectural constraint, not an oversight: NestJS providers are resolved once at boot; making payment provider selection truly dynamic would mean re-architecting the provider factory to re-resolve per request, which introduces real risk for a payment integration that isn't justified by this sprint's scope. |
| **Branding** | Deliberately read-only (`GET /v1/admin/settings/branding`), per Phase 6 §10's own instruction that branding is "reference, not a theme editor." Returns the actual Phase 4 CSS token values (verified against `frontend/src/styles/tokens/colors.css` directly, not approximated from memory — an earlier draft of this endpoint had 5 of 10 values wrong for exactly that reason, caught and fixed before this sprint closed). |

## Explicitly Not Attempted (Known Issues, not silent gaps)
- **Currency conversion**: `acceptedCurrencies` is stored but nothing
  actually converts prices between currencies — the storefront and
  every price field remain USD-only regardless of what's configured
  here.
- **Tax calculation**: `TaxRateEntity` stores rates but
  `OrdersService.createOrder`'s total computation does not apply them
  — configuring a tax rate does not yet change checkout math (same
  disclosure as when `TaxRateEntity` was first added in Sprint 7).
- **Shipping cost calculation**: same gap — `ShippingZoneEntity` is
  configurable but `CartService.estimateShipping` remains the Sprint
  3/4 stub that returns "not yet implemented" regardless of what's
  configured.

These three are the honest reason this sprint is titled "Operational
Configuration" rather than "Operational Enforcement" — the *data* is
now real and admin-editable; wiring it into the actual price/checkout
math is a distinct, larger piece of work flagged for Sprint 8+.
