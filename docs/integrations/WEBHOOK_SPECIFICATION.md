# Sprint 5.12 — Webhook Specification

## Endpoints
- `POST /v1/webhooks/payment/:provider`
- `POST /v1/webhooks/shipping/:provider`

`:provider` must match the currently-*active* provider's name (e.g.
`mock`) — a mismatch is rejected with 401, so a webhook can't be
silently verified against the wrong provider's signature scheme.

## Required Headers
| Header | Purpose |
|---|---|
| `x-webhook-signature` | Provider-specific signature over the raw request body — see `PROVIDER_ADAPTER_GUIDE.md`'s scheme table |
| `x-webhook-event-id` | Provider's own unique event/delivery ID — the replay-protection key. If absent, a random UUID is generated per-request, which means **replay protection is not meaningful without this header** (documented, not silently broken) |

## Processing Flow
1. Signature verified against the raw request body (`rawBody: true` in
   `main.ts` preserves exact bytes).
2. `(provider, providerEventId)` checked against `webhook_events` — a
   duplicate returns `{ duplicate: true }` with HTTP 200 (never reject
   a duplicate outright — providers redeliver on anything but a 2xx,
   so rejecting would cause an infinite redelivery loop).
3. A new event is recorded (`status: "received"`) and enqueued to the
   `webhook-retry` BullMQ queue.
4. `WebhookProcessor` (the queue worker) processes it asynchronously:
   for payment events, re-syncs the payment status against the
   provider (`PaymentService.syncStatus`) rather than trusting the
   webhook payload's claimed status directly.
5. On success: `status: "processed"`. On failure: `status: "failed"`,
   error recorded, and the job re-throws so BullMQ's own retry/backoff
   (5 attempts, exponential) applies. After exhausting attempts, the
   job sits in BullMQ's failed-job list — inspectable via
   `GET /v1/integrations/dead-letter/webhook-retry`.

## Testing a Webhook Locally (Mock Provider)
```bash
BODY='{"event":"payment.succeeded","providerReference":"mock_pi_..."}'
SIGNATURE=$(node -e "console.log(require('crypto').createHmac('sha256','mock-webhook-secret').update(process.argv[1]).digest('hex'))" "$BODY")

curl -X POST http://localhost:4000/v1/webhooks/payment/mock \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: $SIGNATURE" \
  -H "x-webhook-event-id: test-event-001" \
  -d "$BODY"
```
Send it twice with the same `x-webhook-event-id` to confirm the second
call returns `{ duplicate: true }`.

## Not Implemented in Sprint 5
- Shipping webhook → Orders status trigger (tracking sync is received
  and could be processed, but no concrete downstream effect on the
  Order entity is wired yet — see Known Issues).
- Any provider besides Mock actually delivering a webhook (Stripe's
  signature *verification* logic is real; nothing sends Stripe
  webhooks in this sprint since no live Stripe account exists).
