# Sprint 9 — Defect Register

| Defect ID | Severity | Component | Reproduction Steps | Root Cause | Resolution | Regression Result | Status |
|---|---|---|---|---|---|---|---|
| DEF-9-01 | High | `WishlistController` (all endpoints except `getShared`) | Call `GET /v1/wishlist?customerId=<any-real-customer-id>` or `POST /v1/wishlist/items` with an arbitrary `customerId` in the body — no authentication required | Every endpoint was `@Public()` and trusted a client-supplied `customerId` with zero verification against the caller's actual identity — an IDOR (Insecure Direct Object Reference). Root cause of this NOT being caught earlier: the wishlist module's existence itself was incorrectly believed absent since Sprint 7.7 (`SPRINT_9_CORRECTION_NOTICE.md`), so it was never in scope for any prior sprint's security review. | Applied the exact optional-auth + identity-match pattern Sprint 4 already established for the identical problem in `OrdersController.create`: `@CurrentUser()` populated when a valid JWT is present (route stays `@Public()` for legitimate guest/`sessionId` access), with an explicit `ForbiddenException` when a supplied `customerId` doesn't match the authenticated user | TypeScript compilation clean; no automated test existed before or after (wishlist has zero test coverage — see DEF-9-02) | **Resolved** |
| DEF-9-02 | Medium | `WishlistService`/`WishlistController` | N/A — coverage gap, not a runtime defect | Wishlist was built with no accompanying `*.spec.ts` file at any point, unlike every other customer-facing module | Not fixed this sprint — flagged for Sprint 10+, since writing real tests is feature-adjacent work and Sprint 9's scope is hardening, not test-suite expansion, beyond what's needed to validate defect fixes (DEF-9-01's fix has no direct test, which is itself worth naming as a limitation) | N/A | **Open — Sprint 10+ backlog** |
| DEF-9-03 | Medium | `OrdersSeedProvider` (`orders.provider.ts`) | Read the raw SQL in the order-backdating `UPDATE` statement | `daysAgo` (a loop-computed number) was string-interpolated directly into SQL text (`INTERVAL '${daysAgo} days'`) instead of bound as a parameter — not exploitable as written (no user input reaches it), but a dangerous pattern if ever copied elsewhere | Rewritten using `make_interval(days => $1)` with `daysAgo` as a real bound parameter; no value in the query is string-interpolated | TypeScript compilation clean | **Resolved** |
| DEF-9-04 | Medium | Repository root (`backend/`, `frontend/`) | Check for `package-lock.json` | No lockfile has ever been committed for either package — a real production/CI reproducibility and supply-chain-integrity gap: `npm install` (as opposed to lockfile-enforced `npm ci`) resolves to whatever versions match the `^`-range constraints AT INSTALL TIME, which can differ between environments and over time | Production Dockerfiles (Sprint 9) deliberately use `npm ci`, which will correctly FAIL until a real lockfile is generated in an environment with network access — the fix requires that real environment (R-7's scope), so this is flagged rather than worked around | N/A — cannot be resolved in this sandbox (no network to generate a real lockfile) | **Open — requires real-environment session (same class of gap as R-7)** |
| DEF-9-05 | Low | `frontend/next.config.mjs` | Attempt to build the production Docker image using `infrastructure/docker/Dockerfile.frontend` against the original `next.config.mjs` | `output: "standalone"` was never set, so `.next/standalone` (which the Dockerfile copies from) would never exist — the Dockerfile would fail at the `COPY --from=builder /app/.next/standalone` step | Added `output: "standalone"` to `next.config.mjs`; also wired the previously-empty `images.remotePatterns` to the real storage host now that Sprint 3.8's StorageService exists | Not executable (no real `next build` possible in this sandbox — same R-7 limitation); config change reviewed and is a standard, well-documented Next.js flag | **Resolved (config), unverified by real build (R-7)** |

## Summary

| Severity | Count | Open | Resolved |
|---|---|---|---|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 3 | 2 | 1 |
| Low | 1 | 0 | 1 |

**One High-severity defect this sprint (DEF-9-01, the wishlist IDOR)** —
the first High-severity finding since this project's Known Issues
Register began tracking severity (every prior register has been
Medium-or-lower). Found and fixed within the same sprint. Two Medium
items (DEF-9-02, DEF-9-04) remain genuinely open — one is a real
backlog item, the other is architecturally blocked by the same R-7
sandbox constraint as everything else requiring network access.
