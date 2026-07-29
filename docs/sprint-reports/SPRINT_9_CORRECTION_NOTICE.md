# Correction Notice — Wishlist Was Incorrectly Reported as Unimplemented

## What Happened

`SPRINT_7_FREEZE_MANIFEST.md` (§2, §4, §7) and `SPRINT_7_CHANGE_LOG.md`
(§5) both stated: *"no wishlist module exists in this codebase (not
built in any sprint 1–7)."* `SPRINT_8_VALIDATION_REPORT.md` (§8.2) and
`SPRINT_8_DEFECT_REGISTER.md` (DEF-8-02) repeated this claim.

**This was wrong.** While auditing entity index coverage during Sprint
9's performance review, a real, substantial wishlist implementation
was found:
- `backend/src/modules/wishlist/` — `WishlistEntity`,
  `WishlistItemEntity`, `WishlistService` (8 real methods: get/add/
  remove items, move-to-cart, guest-to-customer merge on login, and
  share-link generation/retrieval), `WishlistController` (4 endpoints),
  wired into `app.module.ts`.
- `frontend/src/app/(account)/account/wishlist/` — a real account page.

## Root Cause

This session was compacted partway through (noted in the conversation
history's own compaction summary). The wishlist module was built
before that compaction point and was not mentioned in the compacted
summary I was working from afterward. When Sprint 7.7's Freeze
Manifest asked me to confirm the freeze scope, I stated wishlist
didn't exist **without checking the actual filesystem first** —
relying on incomplete recollection instead of verification, which is
precisely the failure mode this project's own discipline (documented
repeatedly across Sprints 5–9) exists to catch. It should have been
caught then and wasn't; it was caught now, during an unrelated
performance-review grep.

## Correction (per `SPRINT_7_FREEZE_MANIFEST.md` §5's own policy: additive, not retroactive)

- `SPRINT_7_FREEZE_MANIFEST.md`, `SPRINT_7_CHANGE_LOG.md`,
  `SPRINT_8_VALIDATION_REPORT.md`, and `SPRINT_8_DEFECT_REGISTER.md`
  (DEF-8-02) are **not edited**. Per the Freeze Manifest's own
  Modification Policy ("replacement of validation evidence" is not
  permitted — corrections must be additive), this notice supersedes
  their wishlist-related claims without altering the original text.
- **Corrected status: Wishlist IS implemented** — backend module,
  frontend page, 8 service methods, 4 endpoints. It has never been
  reviewed, tested, or validated in any sprint's closure process
  (unlike every other customer-platform module, which has at least
  been code-traced). This is now tracked as a genuine gap in its own
  right: **DEF-9-01** (see `SPRINT_9_DEFECT_REGISTER.md`) — not "missing
  feature," but "existing feature never validated."
- `SPRINT_7_TRACEABILITY_MATRIX.md` did not claim wishlist coverage
  either way (it wasn't in Sprint 7's own scope), so no correction is
  needed there.

## What This Changes About Sprint 9's Own Work

Wishlist is added to Sprint 9's security/performance review scope
(originally scoped only to what was believed to be the full feature
set). See `SPRINT_9_SECURITY_HARDENING_CHECKLIST.md` and
`SPRINT_9_PERFORMANCE_REVIEW.md` for its real findings.
