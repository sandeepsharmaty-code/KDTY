# Secret Management Reference

Quick reference — see `docs/security/SECURITY_BASELINE.md` for full context.

## Rules
1. Never commit `.env`, `*.pem`, `*.key`, or anything matching `secrets.*`.
2. `.env.example` must only ever contain placeholder values.
3. Local dev secrets are low-stakes by design (throwaway local DB creds,
   MailHog, MinIO test keys) — they are not sensitive, but the pattern must
   still be followed so it generalizes correctly once real secrets exist.
4. Non-local secrets belong in the CI/CD platform's secret store, injected
   as environment variables at runtime — never baked into images or
   committed config.
5. If a secret is ever accidentally committed: rotate it immediately, then
   scrub history — do not merely delete the file in a follow-up commit.
