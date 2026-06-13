# Typography

Type is most of the web. Readable, well-scaled text does more for perceived quality than almost anything else.

## Type scale

- Use a **modular scale**, not arbitrary sizes. Pick a base (commonly 16px) and a ratio (1.2 minor third, 1.25, 1.333 perfect fourth, 1.5).
- Example (1.25): 16 → 20 → 25 → 31 → 39 → 49px. Round to sensible values.
- Limit to ~5–7 sizes total across the whole UI.

## Readability metrics

- **Line length (measure):** ~45–75 characters per line for body (≈ 50–66 ideal). Too wide tires the eye; too narrow breaks rhythm. Control with `max-width: 60ch`.
- **Line height (leading):** ~1.4–1.6 for body; tighter (~1.1–1.25) for large headings. Longer lines need more leading.
- **Paragraph spacing:** space between paragraphs ≥ line height; don't indent *and* space.
- **Font size:** body ≥ 16px on the web (smaller feels cramped and hurts mobile/accessibility).

## Hierarchy with type

- Differentiate levels by **size + weight** (and sometimes color/case), not size alone.
- Use weight contrast (e.g. 700 headings vs 400 body) rather than many subtle sizes.
- Avoid ALL CAPS for long text (slower to read); fine for short labels with added letter-spacing.

## Pairing & families

- **One or two typefaces.** A common safe pattern: one neutral sans for UI/body, optionally one contrasting face for display headings.
- Pair by **contrast** (e.g. a serif display + sans body) or stay in one well-built superfamily.
- Prefer system font stacks or self-hosted web fonts for performance; subset and use `font-display: swap`.
- Use real font weights, not browser faux-bold/italic.

## Practical CSS

- `font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem)` for fluid type.
- Set `line-height` unitless (e.g. `1.5`) so it scales with size.
- Enable sensible defaults: `text-wrap: balance` for headings, `text-wrap: pretty` for body; `hanging-punctuation` where supported.
- Respect user zoom — never disable it; size in `rem`/`em`, not fixed `px` for text.

## Checklist

- [ ] Modular type scale (one base + ratio), ≤ ~7 sizes?
- [ ] Body ≥ 16px, line-height ~1.5, measure 45–75ch?
- [ ] ≤ 2 typefaces, paired by clear contrast or one superfamily?
- [ ] Hierarchy via size **and** weight, not size alone?
- [ ] Sizes in rem/em; user zoom and reflow preserved?

**Sources:** nicolesaidy/awesome-web-design (Typography resources, Google Web Fonts) and bradtraversy/design-resources-for-developers (Fonts) for font sourcing; robinstickel/awesome-design-principles (hierarchy/scale). See [sources.md](sources.md).
