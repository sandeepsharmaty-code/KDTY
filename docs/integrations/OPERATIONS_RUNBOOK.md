# Sprint 5.12 — Operations Runbook

## Checking Provider Health
```bash
curl http://localhost:4000/v1/integrations/status
```
Returns per-provider circuit state (`closed`/`open`/`half-open`), last
success/failure timestamps, and the last error message. An `open`
circuit means that provider has failed enough consecutive calls to
trip the breaker — calls are failing fast rather than actually being
attempted until `resetTimeoutMs` elapses.

## Checking Queue Health
```bash
curl http://localhost:4000/v1/integrations/status   # includes queue stats
curl http://localhost:4000/v1/integrations/dead-letter/email   # failed email jobs
curl http://localhost:4000/v1/integrations/dead-letter/sms
curl http://localhost:4000/v1/integrations/dead-letter/webhook-retry
```

## Common Scenarios

**"Emails aren't sending"**
1. Check `GET /v1/integrations/status` — is the `mock`/configured email
   provider's circuit open?
2. Check `GET /v1/integrations/dead-letter/email` — are jobs failing
   and exhausting retries?
3. Check `GET /v1/email/sent` (admin-only) — if using the mock
   provider, confirm the email actually reached the mock's in-memory
   log (proves the queue → processor → provider path works; a missing
   entry here with no dead-letter jobs either suggests the email was
   never enqueued in the first place — check the calling code, e.g.
   `OrdersService`/`AuthService`, actually calls `EmailService`).

**"A webhook keeps getting redelivered by the provider"**
This means the endpoint isn't returning 2xx. Check:
1. Is the signature actually valid? (401 responses cause redelivery.)
2. Is the `:provider` URL segment correct? (Mismatch also 401s.)
3. Check `webhook_events` table directly — if an event with that
   `providerEventId` already exists with `status: "processed"`, but the
   provider is still redelivering, the provider itself may have a
   redelivery bug or the endpoint response is timing out before the
   200 is sent back (should be near-instant since processing is queued,
   not inline).

**"Circuit breaker won't close"**
The breaker moves from `open` to `half-open` automatically after
`resetTimeoutMs` (default 30s), then re-closes on the next successful
call. If it keeps flipping back to `open`, the underlying provider is
still genuinely failing — check `lastError` in the status endpoint.

## Restarting Background Workers
Workers run in the same process as the API in this sprint's setup (no
separate worker process/deployment yet — see Known Issues). Restarting
the app restarts all queue workers. No standalone "restart just the
email worker" operation exists.

## Manually Retrying a Dead-Lettered Job
Not yet exposed via an API endpoint in Sprint 5 (read-only inspection
only) — requires direct BullMQ/Redis access (`queue.retryJobs()`) or a
future admin-endpoint addition. Documented as a Known Issue.
