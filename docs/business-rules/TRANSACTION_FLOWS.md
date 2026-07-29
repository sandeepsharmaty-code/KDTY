# Sprint 4.13 — Transaction Flow Diagrams

## Order Creation (`OrdersService.createOrder`)
```
customer, cartId, shippingAddress
        │
        ▼
  Load cart + active (non-saved-for-later) line items
        │
        ├─ cart has 0 active lines? ──▶ throw CART_EMPTY (no transaction opened)
        ▼
  BEGIN TRANSACTION (TransactionService.runInTransaction)
        │
        ├─ for each cart line:
        │     ├─ look up variant (with product, for price)
        │     ├─ compute unit price (salePrice ?? price)
        │     ├─ accumulate order total
        │     ├─ build OrderLineItem snapshot (name + price frozen)
        │     └─ adjustStock(variantId, -quantity, transactionManager)
        │           │
        │           ├─ would go negative? ──▶ throw INSUFFICIENT_STOCK ──▶ ROLLBACK (all prior stock decrements in this loop undone)
        │           └─ optimistic lock conflict? ──▶ throw STALE_WRITE_CONFLICT ──▶ ROLLBACK
        │
        ├─ save Order (status: pending_payment)
        ├─ save each OrderLineItem
        ├─ save OrderStatusHistory (pending_payment)
        │
        ▼
  COMMIT TRANSACTION
        │
        ▼
  return the created Order (freshly re-read with relations)
```
**Rollback guarantee:** if item 3 of 5 fails on `INSUFFICIENT_STOCK`, the
stock decrements already made for items 1–2 in this same call are rolled
back too — the customer never ends up with an order that partially
reserved inventory.

## Order Cancellation (`OrdersService.requestCancellation`)
```
orderId, reason
        │
        ▼
  Load order (+ lineItems, statusHistory)
        │
        ├─ order.status not in {pending_payment, confirmed, processing}?
        │       ──▶ throw ORDER_NOT_CANCELLABLE (no transaction opened)
        ▼
  BEGIN TRANSACTION
        │
        ├─ for each order line item:
        │     └─ adjustStock(variantId, +quantity, transactionManager)  // release reserved stock
        │
        ├─ update Order.status = "cancelled" (via transaction manager directly)
        ├─ save OrderStatusHistory (cancelled)
        │
        ▼
  COMMIT TRANSACTION
```

## Cart Merge After Login (`CartService.mergeGuestCart`)
```
sessionId, customerId
        │
        ▼
  Find guest cart by sessionId (may not exist)
  Find or create customer's cart by customerId
        │
        ├─ no guest cart? ──▶ return customer's cart unchanged
        ▼
  for each guest cart line item:
        ├─ matching variant already in customer cart (not saved-for-later)?
        │     ──▶ sum quantities
        └─ else ──▶ create new line item on customer cart
        │
        ▼
  delete guest cart
        │
        ▼
  return customer's (now-merged) cart
```
**Note:** this flow is NOT wrapped in `TransactionService` — flagged in
Known Issues, since a failure partway through could leave some guest
items merged and others not (low risk at Sprint 4's scale: single-table
writes, no cross-entity invariant at stake the way stock/order creation
has, but still a gap worth closing before this sees real traffic).
