# Sprint 5.12 — Security Guide

## Webhook Signature Verification
Every inbound webhook is rejected (401) unless its signature verifies
against the raw request body — see `WEBHOOK_SPECIFICATION.md`. No
webhook payload is ever trusted/processed without this check.

## Replay Protection
`(provider, providerEventId)` uniqueness in `webhook_events` prevents
the same event from being processed twice — relevant both for
malicious replay (an attacker resending a captured valid webhook) and
benign replay (every major provider redelivers on a missed 2xx).

## Idempotency (Payment)
Client-supplied idempotency keys prevent a network-retry on the
client side from double-charging — `IdempotencyService.runOnce`
returns the original response for a repeated key rather than
re-executing the payment initiation.

## Secrets Handling
- No live credentials exist anywhere in this sprint (`.env.example`
  has no real values, per Sprint 1's original policy, unchanged).
- `StripePaymentProvider` never logs its secret key or webhook secret.
- OTP codes are stored **hashed** (SHA-256), never in plaintext —
  same principle Sprint 3 established for passwords (bcrypt).
- Payment/shipping/email/SMS provider responses are logged via
  `IntegrationLoggerService` at the operation/outcome level only —
  never the full response body, which could contain PII or sensitive
  provider-side data.

## Rate Limiting
- OTP send: 3 requests/minute per caller (`SmsController`, tighter
  than the global default — an SMS-sending endpoint is directly
  abusable for cost/spam).
- OTP generation additionally rate-limited server-side at 5/hour per
  phone number (`OtpService.assertNotRateLimited`), independent of the
  HTTP-layer throttle — defense in depth against a caller rotating
  source IPs.
- Payment/refund endpoints inherit the global default (100/min) —
  Known Issues flags this as worth tightening once real payment
  volume/abuse patterns are understood.

## Known Security Gaps (Sprint 5)
- Circuit breaker state is in-memory per app instance — a
  multi-instance deployment wouldn't share "provider X is down"
  knowledge, meaning some instances could keep hammering a failing
  provider while others have already opened their breaker. Not a
  security gap per se, but a resilience one worth noting here since it
  affects how much the circuit breaker can actually be relied upon.
- No webhook IP allowlisting (relying on signature verification alone,
  which is the standard practice, but worth noting explicitly as a
  decision rather than an oversight).
