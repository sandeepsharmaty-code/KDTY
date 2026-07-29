# Sprint 2.11 — Theme Usage

Three brand-tier themes exist per Phase 4 §1: **Hue Muse Essential**,
**Hue Muse Luxe** (default), and **Hue Muse Élite**. All three share
identical typography, spacing, and grid — only the accent color token
(`--color-tier-accent`) remaps.

## Applying a Theme
Set `data-theme` on any ancestor element (typically `<html>` or a
tier-scoped page wrapper):

```tsx
<html data-theme="elite">
```

Components should reference `var(--color-tier-accent)` (not a specific
tier's hex value) wherever tier-specific accenting is needed, so the same
component works correctly under any of the three themes without a
conditional.

## Dark Mode
Not launched in v1.0 (Phase 4 §2). Every color is already a token, so a
future dark theme is a `[data-theme="dark"]` block remapping
`--color-neutral-paper`/`--color-neutral-ink` — no component code changes
required. No dark theme file is created in Sprint 2 since it's explicitly
future-reserved, not current scope.
