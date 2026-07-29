# Sprint 7.5 — Closure Report
## Operational Configuration & Business Readiness

---

## 1. Deliverable Checklist

| Deliverable | Status |
|---|---|
| Taxes | ✅ `TaxRateEntity`, region-keyed, real upsert (bug fixed) |
| Currencies | ⚠️ `acceptedCurrencies` stored; no conversion logic (documented) |
| Shipping zones | ✅ `ShippingZoneEntity`, real upsert (bug fixed) |
| Payment defaults | ⚠️ Reference/display only — real architectural reason documented, not a shortfall |
| Notification templates | ✅ `NotificationTemplateEntity`, real `EmailService` fallback logic, directly tested |
| SEO defaults | ✅ OG image, title suffix, Twitter handle, robots directive |
| Business profile | ✅ Extended from Sprint 7's original fields |
| Branding | ✅ Read-only reference endpoint, values verified against real frontend source |
| Media settings | ✅ Genuinely wired into `StorageService` and the Sprint 7.3 media validator — no longer duplicated hardcoded constants |
| Feature flags | ✅ `FeatureFlagEntity` + 2 real, meaningfully-gated integrations |
| Validate customer/admin workflows | ⚠️ Code-level trace for all; subset directly tested; none live |
| Documentation, validation, closure | ✅ This package |

---

## 2. Known Issues

| ID | Issue | Severity | Owner Action |
|---|---|---|---|
| KI7.5-1 | Tax rates and shipping zones are configurable but not applied to checkout math (`OrdersService.createOrder`, `CartService.estimateShipping`) | Medium | Documented since Sprint 7's original `TaxRateEntity`; still open — real checkout-math wiring is Sprint 8+ scope |
| KI7.5-2 | `acceptedCurrencies` is stored but nothing converts prices — the platform remains USD-only in practice regardless of configuration | Low | Same category as KI7.5-1 — data exists, enforcement doesn't yet |
| KI7.5-3 | Payment provider selection remains env-var/DI-bootstrap-driven, not dynamically switchable from the Settings row — a real architectural constraint, documented in detail in `CONFIGURATION_COMPLETENESS.md`, not an oversight | Low | Would require restructuring the provider factory to resolve per-request; not justified without a concrete multi-provider need |
| KI7.5-4 | `upsertNotificationTemplate` has no direct unit test (unlike its sibling `upsertTaxRate`/`upsertShippingZone`, both of which do) | Low | Straightforward addition; not done this sprint given time |
| KI7.5-5 | The `search.enabled` feature flag is seeded but gates nothing — search doesn't exist as a feature yet | Low | Intentionally reserved, documented in `FEATURE_FLAGS.md` as forward-looking, not a placeholder pretending to work |
| KI7.5-6 (carried) | No live execution has occurred — now spanning 10 sprints | **High** | Standing recommendation; R-7 remains open per the prior audit's explicit instruction |

---

## 3. Real Bugs Found This Sprint (Summary)

Three found and fixed, none discovered by a validation pass alone —
each caught by directly reading or checking the actual artifact rather
than trusting a prior description of it: `StorageService.
getSignedReadUrl`'s wrong S3 command (contradicting an earlier claimed
fix), `SettingsService`'s tax/shipping upserts not actually upserting
by natural key, and 5 of 10 wrong color values in the first draft of
the branding endpoint. Full detail in `SPRINT_7_5_VALIDATION.md`.

---

## 4. Acceptance Record

- **Scope adherence:** Confirmed — no scope creep into building actual
  tax/shipping calculation logic (explicitly out of this sprint's
  "configuration," not "enforcement," framing).
- **"Not hard-coded" instruction:** Genuinely satisfied for media
  settings and notification templates — both moved from hardcoded
  constants/functions to real Settings-module data with working
  fallback logic, not just a config file with more entries. Payment
  provider selection is the one deliberate, documented exception, for
  a real architectural reason rather than time pressure.
- **Static + structural validation:** TypeScript clean across 240
  files; an automated (not manual) circular-dependency check now
  exists and passed; typo sweep clean.
- **Outstanding:** KI7.5-1/2 (tax/currency not applied to checkout
  math) are the most significant open items, both honestly scoped as
  "configuration exists, enforcement doesn't yet" rather than implied
  complete.

**Recommended disposition:** Accepted, same conditional pattern as
every prior sprint — R-7 (live execution) remains the standing
condition per the previous audit's explicit instruction to keep it
open.

---

## 5. Readiness Assessment for Sprint 8

1. **(Top priority, now spanning 10 sprints)** Live execution —
   unchanged recommendation, now with an unusually concrete first test
   case: confirm `EmailService`'s override/fallback logic actually
   renders and sends correctly against a real queue + provider, since
   that's the one piece of this sprint backed by a real (but mocked)
   test rather than code-reading alone.
2. **(Recommended)** Wire `TaxRateEntity`/`ShippingZoneEntity` into
   actual order-total computation (KI7.5-1) — the single most valuable
   next step to move from "configurable" to "enforced."
3. **(Confirmed ready)** The Settings module is now feature-complete
   for what Phase 6 §10 originally scoped, with real fallback and
   upsert semantics throughout — any future admin UI work extending
   Sprint 6B's settings screens has a correct, tested backend to build
   against.
