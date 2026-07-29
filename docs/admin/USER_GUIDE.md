# Sprint 6B — Admin User Guide

## Signing In
Go to `/admin/login`. Use your admin email and password. The seeded
account for local/test use is `admin@huemusebeauty.local` /
`ChangeMe123!` — a Super Admin account with full access to everything.
**Change this password immediately in any shared or non-local
environment** (see `docs/integrations/CONFIGURATION_GUIDE.md`'s
credential guidance — the same principle applies here).

## What You'll See Depends On Your Role
The left navigation only shows sections your role has at least "view"
access to (Phase 6 §12's permission matrix — see
`docs/admin/ROLE_PERMISSION_MATRIX.md` for the full table). If you
don't see a section you expect, your role doesn't include it — this
isn't a bug, and asking a Super Admin to check your assigned role is
the right next step.

| Role | Can fully manage | Can view/edit only | Cannot see at all |
|---|---|---|---|
| Super Admin | Everything | — | — |
| Store Manager | Orders, Coupons, Reports | Products, Categories (edit, no delete) | Settings, User Roles |
| Product Manager | Products, Categories | Dashboard, Reviews, Reports (view) | Orders, Customers, Coupons, Content, Settings |
| Content Manager | Content (pages/banners/FAQs) | Dashboard, Products, Categories, Reviews (view/edit) | Orders, Customers, Coupons, Settings, Reports |
| Customer Support | — | Orders, Customers, Reviews (edit) | Categories, Coupons, Content, Settings, Reports |

## Dashboard
Your landing page after login. Shows today's order count and revenue,
how many products are low/out of stock, how many reviews are awaiting
approval, a short list of things that need your attention (Pending
Tasks), and a feed of the most recent changes anyone made (Recent
Activity).

## Managing Products
`Products` in the nav. Each product can be **Activated** (must have at
least one shade/variant first) or **Deactivated** (archives it — never
deleted). Select multiple rows with the checkboxes to Bulk Activate or
Bulk Deactivate.

## Categories & Collections
The five main categories are fixed and can't be added/removed — you
can toggle visibility and set display order. Collections additionally
support a Featured toggle.

## Orders
Search by customer or filter by status. Click an order to view details
and update its status — the system only allows valid transitions (e.g.
you can't mark a `pending_payment` order `delivered` directly).

## Customers
Search by name or email. Click through to see a customer's profile and
full order history.

## Review Moderation
New reviews start `pending` and aren't shown on the storefront until
approved. Approve or Hide individually, or select multiple and Bulk
Approve.

## CMS
- **Static Pages**: edit the content of About, FAQ, Privacy, Terms, and
  other fixed pages.
- **Banners**: create time-windowed promotional banners (a default
  7-day window is used — edit the dates via the API directly if you
  need something different; a date-picker UI wasn't built this sprint).
- **FAQs**: add question/answer pairs.

## Media Library
Upload product/CMS images (JPEG, PNG, or WebP, up to 8MB). **Note:**
this sprint's Media Library only shows images you've uploaded in the
current browser session — there's no "browse everything ever
uploaded" view yet (see Known Issues).

## Coupons
Create percentage or fixed-amount discount codes. New coupons default
to a 30-day active window. Toggle Active/Inactive at any time.

## Reports
Four tabs: Sales Summary, Customers, Products (lowest stock), and
Coupons (by redemption count). All cover the trailing 30 days by
default.

## Audit Log
A read-only record of who changed what, when. Filter by module (auth,
products, orders, content, coupons, reviews).

## Import / Export
Download your full product catalog as a CSV, or bulk-upload one to
create/update products. Required columns: `slug, name, category,
price`. Failed rows are reported individually — a bad row doesn't stop
the rest of the import.

## Queue Monitor & Integration Status
Under **System** in the nav — shows background job queue health
(email/SMS/webhook processing) and the status of external service
connections (payment/shipping providers). Useful for confirming
nothing is silently failing behind the scenes.
