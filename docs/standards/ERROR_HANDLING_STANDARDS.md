# Error Handling Standards

- Never swallow errors silently.
- Backend: typed error classes (domain taxonomy defined starting Sprint 2)
  normalized to a consistent API error response shape at the boundary.
- Frontend: user-facing error messages never leak stack traces, internal
  identifiers, or backend implementation details.
- Every caught error is logged (per `LOGGING_STANDARDS.md`) before being
  handled, transformed, or re-thrown.
- Retryable vs. terminal errors should be distinguishable once real
  network/IO code exists (Sprint 2+).

## Acceptance Criteria
- [ ] Standard documented (this file).
- [ ] No error-handling code exists yet to validate against — this is
      framework-level policy, applied starting with the first real
      endpoint/component in Sprint 2.
