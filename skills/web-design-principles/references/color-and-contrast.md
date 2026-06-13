# Color & Contrast

Color carries brand, meaning, and emphasis — but must never be the *only* carrier of meaning, and must always meet contrast minimums.

## Building a palette

- **Keep it small.** A typical system: 1 primary (brand), 1 accent, a neutral gray ramp (5–9 steps), plus semantic colors.
- **Semantic colors:** success (green), warning (amber), error (red), info (blue). Define by *role*, not hue, so themes can swap.
- **Tints/shades ramp:** generate consistent steps (e.g. 50–900) for each hue; use lighter steps for backgrounds, darker for text.
- **Tokens, not literals:** name by role — `--color-bg`, `--color-text`, `--color-primary`, `--color-danger` — so dark mode and theming are swaps, not rewrites.

## The 60-30-10 rule

A balanced screen ≈ 60% dominant/neutral, 30% secondary, 10% accent (CTAs, highlights). Accent scarcity is what makes it pop.

## Contrast (WCAG 2.2)

- **Normal text:** ≥ **4.5:1** against its background (1.4.3 AA). AAA = 7:1.
- **Large text** (≥ 24px, or ≥ 18.66px bold): ≥ **3:1**.
- **Non-text UI** (icons, input borders, focus indicators, graph elements): ≥ **3:1** (1.4.11).
- Test the *actual* foreground/background pair, including on images/gradients (add a scrim).

## Don't rely on color alone (WCAG 1.4.1)

- Pair color with a second cue: icon, label, underline, shape, pattern.
- Error states: red border **+** icon **+** text message. Charts: color **+** labels/patterns.
- ~8% of men have color-vision deficiency — verify legends and statuses work in grayscale.

## Dark mode & theming

- Don't just invert. Use slightly desaturated colors; avoid pure `#000`/`#fff` (prefer near-black/near-white to reduce halation).
- Re-check contrast in *both* themes — a pair that passes on light can fail on dark.
- Drive with tokens + `prefers-color-scheme`.

## Tools (cited resources)

- Palette generators: Coolors, Adobe Color (via the awesome lists).
- Contrast checkers: WebAIM Contrast Checker; browser devtools contrast hints.

## Checklist

- [ ] Limited palette + semantic, role-named tokens?
- [ ] Body text ≥ 4.5:1, large text & UI components ≥ 3:1?
- [ ] Meaning never conveyed by color alone (icon/label/shape backup)?
- [ ] Accent used sparingly (≈10%) and consistently for primary actions?
- [ ] Contrast re-verified in dark mode / all themes?

**Sources:** WCAG 2.2 (1.4.1, 1.4.3, 1.4.11) via W3C; nicolesaidy/awesome-web-design and bradtraversy/design-resources-for-developers (Colors — Coolors, Adobe Color, palette tools). See [sources.md](sources.md).
