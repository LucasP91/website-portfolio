# Spacing & Whitespace

Space is an active design material, not "empty." Consistent spacing creates rhythm; generous whitespace creates clarity and perceived quality.

## Spacing scale

- Use a **single spacing scale** everywhere — don't invent one-off margins.
- Base on a **4px or 8px grid**: 4, 8, 12, 16, 24, 32, 48, 64, 96… (multiplicative scales feel more harmonious than linear).
- Expose as tokens/variables (`--space-2: 8px`) or use a framework scale (e.g. Tailwind's 0/1/2/4/8…). Reuse them; consistency > precision.

## Whitespace (negative space)

- **Macro whitespace** — between major sections/regions. Drives the overall calm and structure.
- **Micro whitespace** — between lines, list items, label and input, icon and text. Drives legibility.
- More whitespace generally reads as more premium and more focused. When in doubt, add space rather than borders.

## Proximity = meaning

- Elements close together are perceived as related; far apart as separate. **Spacing communicates grouping** more reliably than lines or boxes.
- A label belongs nearer its field than the field above it. A caption belongs nearer its image.
- Tighten *within* a group; loosen *between* groups.

## Density

- Match density to context: marketing pages = airy; data tables/dashboards = denser but still rhythmic.
- Even dense UIs need consistent gaps and alignment — don't cram.

## Common pitfalls

- Inconsistent gaps (13px here, 15px there) — snap to the scale.
- Equal spacing inside and outside a group (destroys grouping).
- Relying on borders/dividers where whitespace would do.
- Cramped touch targets — see Responsive (min 24×24px, comfortable 44px) and pad accordingly.

## Practical CSS

- Prefer `gap` (flex/grid) over margins for inter-element spacing.
- Use a consistent vertical rhythm; consider `margin-block` with a single owner (e.g. "stack" / `> * + *` lobotomized-owl pattern) to avoid margin collisions.
- Pad containers with scale values; keep symmetric padding unless intentionally asymmetric.

## Checklist

- [ ] All spacing drawn from one 4/8px-based scale (tokens)?
- [ ] Related items tighter than unrelated items (proximity)?
- [ ] Generous macro whitespace between sections?
- [ ] Spacing used for grouping before borders/dividers?
- [ ] No off-scale, one-off magic numbers?

**Sources:** robinstickel/awesome-design-principles (white space, proximity, consistency as core principles); design-system spacing scales it indexes (Material, Carbon, Polaris). See [sources.md](sources.md).
