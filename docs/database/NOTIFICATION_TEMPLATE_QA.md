# Sprint 7.4 — Notification Template QA

## Scope Decision
Sprint 7.4's "Marketing Content: Notification templates" deliverable
is satisfied by validating Sprint 5.4's 5 existing hardcoded email
templates against the Sprint 7.3 Content Validation Engine — not by
building a new database-backed, admin-editable template system (a
real, larger feature, tracked as a Known Issue rather than attempted
here).

## What Was Actually Checked
`src/integrations/email/templates/__tests__/templates.qa.spec.ts` is a
real, executable test — not just this document's prose — that calls
each of the 5 `EMAIL_TEMPLATES` functions and runs the result through
`validateNotificationTemplate`, confirming every required variable
each template needs is genuinely present in its subject/HTML source.

| Template | Required variables | Result |
|---|---|---|
| `welcome` | `firstName` | ✅ Present |
| `orderConfirmation` | `firstName`, `orderId`, `total` | ✅ All present |
| `passwordReset` | `firstName`, `resetLink` | ✅ Present |
| `shipmentNotification` | `firstName`, `orderId`, `trackingNumber` | ✅ All present |
| `refundNotification` | `firstName`, `orderId`, `amount` | ✅ All present |

All 5 templates also have a non-empty plain-text fallback (Sprint 5.4
built these correctly the first time).

## Known Issue
These templates remain code, not data — there is no
`NotificationTemplateEntity`, no admin UI to edit them, and no way to
add a 6th template without a code change and redeploy. Phase 6 §10
("Email Templates: Edit the content ... within a fixed set of
brand-approved templates") implies these should eventually be
admin-editable. Flagged as a Sprint 8+ addition.
