# Logging Standards

- Structured (JSON) logging in all environments except local dev (human-
  readable acceptable locally).
- Required fields once a logger is wired: `timestamp`, `level`, `service`,
  `message`, `correlationId`.
- No PII or secrets in log output.
- Levels: `error`, `warn`, `info`, `debug` (`debug` off by default outside
  local dev).
- No `console.log` in committed code — enforced by ESLint `no-console` rule
  (`config/eslint/.eslintrc.base.json`, allows `warn`/`error` only).

## Acceptance Criteria
- [ ] Rule documented and mechanically enforced via lint.
- [ ] No logging library selected/installed yet (deferred — no code emits
      logs in Sprint 1); framework choice is a Sprint 2 prerequisite.
