# Sprint 7.4 — Seed Engine

## Architecture
```
run-seed.ts
  └─ NestFactory.createApplicationContext(AppModule)   ← real DI, real DB connection
       └─ SeedEngineService.register(...11 providers)
            └─ SeedEngineService.execute(dryRun)
                 ├─ topological sort by dependsOn
                 ├─ for each provider (in order): provider.run(dryRun)
                 │     └─ validates via ContentValidationService (real engine, Sprint 7.3)
                 │     └─ upserts via the SAME domain service the API uses
                 ├─ on fatal error: roll back completed providers, reverse order
                 └─ returns SeedExecutionSummary
       └─ SeedVerificationService.verify()   ← post-seed integrity checks (7.4.9)
```

## Why a Real NestJS Application Context
Sprints 3–6's seed script ran as a standalone TypeORM script against a
raw `DataSource` — fast and simple, but meant seeding could never
actually exercise business logic (stock rules, permission checks, the
Content Validation Engine). Sprint 7.4 upgrades this to
`NestFactory.createApplicationContext(AppModule)`, so every provider
injects and calls the **same services** (`ProductsService`,
`ContentValidationService`, `OrdersService`, ...) the running API does.
Concretely: seeded orders go through the real cart → checkout →
state-machine flow (`OrdersSeedProvider`), and seeded reviews compute
"verified purchase" by actually checking order history, not asserting
a flag.

**Tradeoff, disclosed plainly**: bootstrapping the full `AppModule`
also starts BullMQ queue connections and Sprint 5.8's scheduled cron
jobs for the script's duration — harmless for a one-off seed run, but
worth knowing before wrapping this in a tight CI job.

## Execution Order
Enforced two ways: `run-seed.ts` registers providers in the documented
order (1. Settings → 11. Reviews) for a human reader's benefit, and
`SeedEngineService.resolveExecutionOrder()` independently re-derives
the same order via topological sort over each provider's `dependsOn` —
the sort is what's actually load-bearing; registration order is not.

## Validation Integration
Every provider that seeds one of Sprint 7.3's 8 supported content
types calls `ContentValidationService` before writing anything.
**Coupons, Customers, Orders, and Reviews are the deliberate
exception** — none of the four were among Sprint 7.3's named content
types (editorial/catalog content, not operational/transactional data).
Coupons gets minimal inline validation (date range, discount sanity)
in its own provider; Customers/Orders/Reviews get lighter structural
checks only. This boundary is documented in each provider's own
comments, not silently inconsistent.

## Idempotency (7.4.7)
Every provider upserts by a natural key:

| Provider | Natural key |
|---|---|
| Settings | fixed `"default"` row |
| Categories | slug |
| Collections | slug |
| Products | slug (variants: SKU) |
| CMS Pages | slug |
| FAQs | question text |
| Banners | (placement, headline) |
| Coupons | code |
| Customers | email |
| Orders | one order per seeded customer (skipped if any exists) |
| Reviews | (customerId, variantId) |

**Real bugs found and fixed while building this**: `CmsService.upsertFaq`
and `.scheduleBanner` (Sprint 3) were named "upsert"/were the only
write path available, but always inserted a new row — running the old
seed script twice would have created duplicate FAQs/banners. Fixed as
part of this sprint (`upsertFaqByQuestion`, `upsertBanner`), not
worked around in the provider.

## Rollback (partial, documented limitation)
On a fatal error, already-completed providers roll back in reverse
order via each provider's own `rollback()` — a **compensating action**
(delete-by-id for entities it created), not a true database
transaction rollback. This was a deliberate architecture choice: a
real cross-service transaction would require every provider to share
one `QueryRunner`'s `EntityManager` instead of each domain service's
own injected repository, which would mean bypassing the services
entirely (defeating the point of using them for real validation/business
logic). The documented gap: **rollback of an "updated" entity does not
restore its previous value** — no provider snapshots the pre-update
state. Orders are a further special case: rollback calls
`OrdersService.requestCancellation` (releasing committed stock
correctly) rather than deleting the row, since a raw delete would leave
inventory counts wrong.

## Dry-Run Mode
Every provider honors `dryRun: true` by validating and reporting what
*would* happen without writing. `OrdersSeedProvider` is the one
exception worth calling out: creating a cart is itself a database
write, so dry-run for Orders reports the planned count without
simulating the full flow (documented in the provider itself).
