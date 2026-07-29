# Sprint 2.11 — Frontend Development Guidelines

1. **Never hard-code a design value.** Colors, spacing, radius, shadow,
   and breakpoints must come from the token system (`styles/tokens/*` /
   `tailwind.config.ts`), never an inline hex/px value. Enforced by
   convention and code review today; a Stylelint rule to catch raw hex
   values programmatically is a recommended Sprint 3+ addition (see Known
   Issues).
2. **One component per file; variants live inside, not as siblings.**
   Per Phase 14 §14.1 — `Button` has one file covering all 7 variants via
   the `variant` prop, not `PrimaryButton.tsx` + `SecondaryButton.tsx`.
3. **No business logic in presentational components.** Components receive
   data/callbacks as props only (Phase 14 §14.1) — see how `ProductCard`
   takes a `Product` and calls back via `onSelect`-style props rather than
   reaching into `services/mock` itself.
4. **Explicit prop types, no implicit `any`.** TypeScript strict mode is
   enforced repo-wide (`config/typescript/tsconfig.base.json`).
5. **Accessibility is not optional per component.** Every interactive
   component ships with the ARIA role/state/label it needs — see
   `docs/frontend/COMPONENT_LIBRARY.md`'s a11y column. New components
   should follow the same pattern: figure out the accessible name, state,
   and keyboard interaction before writing the visual layer.
6. **Mock data lives only in `services/mock/`.** Pages import from there;
   no component imports mock data directly. This is the seam a future
   sprint replaces wholesale.
