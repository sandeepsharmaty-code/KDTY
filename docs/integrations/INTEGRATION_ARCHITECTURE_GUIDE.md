# Sprint 5.12 — Integration Architecture Guide

## The Resilient Call Path (Sprint 5.1)
Every provider adapter method — payment, shipping, email, SMS — is
called through `ResilientCallService.execute()`, never directly:

```
Business Service (PaymentService, ShippingService, ...)
        │
        ▼
ResilientCallService.execute({ provider, operation, timeoutMs, retry })
        │
        ▼
  CircuitBreaker.execute()  ── open? ──▶ throw CircuitOpenError (fail fast)
        │ closed/half-open
        ▼
  withRetry()  ── exponential backoff + jitter, capped attempts
        │
        ▼
  withTimeout()  ── races the actual call against a timeout
        │
        ▼
  provider.methodCall()  ── the concrete adapter (Mock/Stripe/...)
```
Logging (`IntegrationLoggerService`) and status reporting
(`ProviderStatusService`) wrap the whole thing, tagged with the request's
correlation ID (`correlation-id.store.ts`, populated by
`RequestLoggingInterceptor`).

## Provider Abstraction Pattern
Every integration category follows the same shape:
1. An interface (`*-provider.interface.ts`) + a Symbol DI token.
2. One or more concrete providers implementing it (`providers/`).
3. A config-driven factory in the category's `*.module.ts` selecting
   which concrete class the DI token resolves to.
4. A business service (`PaymentService`, `ShippingService`, ...) that
   depends only on the interface/token — never a concrete class.

**Swapping a provider is a config change** (`PAYMENT_PROVIDER=stripe`
in `.env`), not a code change — `PaymentService`, `PaymentController`,
and every caller of `PaymentService` are completely unaffected.

## Dependency Injection
Standard NestJS `Symbol`-token pattern: `PAYMENT_PROVIDER`,
`SHIPPING_PROVIDER`, `EMAIL_PROVIDER`, `SMS_PROVIDER` (each defined
alongside its interface). A module's factory provider (`useFactory`)
reads `ConfigService` and returns whichever concrete provider instance
is selected.

## Retry Policies
`withRetry` (`src/integrations/common/with-retry.ts`): exponential
backoff with ±15% jitter, capped attempts, and an optional
`isRetryable` predicate so a caller can distinguish transient failures
(worth retrying) from permanent ones (a 4xx validation error retrying
would never fix).

## Timeout Handling
`withTimeout` races the real call against a timer; a hung provider call
never blocks a request thread indefinitely.

## Circuit Breaker Foundation
Per-provider `CircuitBreaker` instance (closed → open → half-open),
in-memory per app instance. **Foundation**, per this sprint's own
wording — no shared/distributed state across multiple app instances
yet (see Known Issues).
