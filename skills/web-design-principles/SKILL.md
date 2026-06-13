---
name: web-design-principles
description: "Core web design principles for building and reviewing user interfaces. Use ANY time you are designing, building, generating, styling, or reviewing UI — pages, layouts, components, forms, dashboards, landing pages, or design systems. Covers visual hierarchy, layout and grid systems, typography, spacing and whitespace, color and contrast, accessibility (WCAG), responsive design, and motion/animation. Consult the references/ notes before producing or critiquing any interface so output is hierarchical, legible, accessible, responsive, and consistent."
---

# Web Design Principles

A compact, opinionated reference for making and judging web UI. The goal: every interface you produce should be **hierarchical, legible, accessible (WCAG 2.2 AA), responsive, and consistent** — by default, not as an afterthought.

## When to use this skill

Use it **whenever UI is involved**, including:

- Designing or building a new page, screen, layout, or component.
- Generating markup/CSS/Tailwind/component code that renders visually.
- Reviewing, refining, or critiquing existing UI (yours or the user's).
- Choosing colors, fonts, spacing, breakpoints, or animations.
- Setting up or auditing a design system / style guide.

If the task changes what a user sees or interacts with, this skill applies.

## How to use it

1. **Before generating UI:** skim the relevant reference file(s) below and apply their checklists. At minimum, always honor visual hierarchy, contrast, spacing rhythm, and accessibility.
2. **While generating:** prefer a consistent spacing scale, a type scale, a small color system with tokens, and semantic, accessible HTML.
3. **When reviewing UI:** run the "Quick review checklist" below, then open the specific reference for any area that looks weak and cite the rule you're applying.
4. **Cite sources** when you make a non-obvious recommendation — see [references/sources.md](references/sources.md).

## Reference index

| Topic | File | Use when |
|---|---|---|
| Visual hierarchy | [references/visual-hierarchy.md](references/visual-hierarchy.md) | Deciding what draws the eye first; emphasis, scale, order |
| Layout & grid systems | [references/layout-and-grids.md](references/layout-and-grids.md) | Page structure, columns, alignment, composition |
| Typography | [references/typography.md](references/typography.md) | Fonts, type scale, line length, line height |
| Spacing & whitespace | [references/spacing-and-whitespace.md](references/spacing-and-whitespace.md) | Padding, margins, density, rhythm |
| Color & contrast | [references/color-and-contrast.md](references/color-and-contrast.md) | Palettes, semantic color, contrast ratios |
| Accessibility (WCAG) | [references/accessibility-wcag.md](references/accessibility-wcag.md) | Semantics, keyboard, focus, ARIA, contrast |
| Responsive design | [references/responsive-design.md](references/responsive-design.md) | Breakpoints, fluid layout, touch, device independence |
| Motion & animation | [references/motion-and-animation.md](references/motion-and-animation.md) | Transitions, easing, duration, reduced motion |

## Quick review checklist

- **Hierarchy:** Is there one clear focal point? Can you read the screen in priority order?
- **Layout:** Is everything aligned to a grid? Is content width readable (not full-bleed text)?
- **Type:** ≤ 2 typefaces, a real type scale, body line length ~45–75 chars, line-height ~1.5.
- **Spacing:** Consistent spacing scale (e.g. 4/8px steps); generous whitespace; related items grouped (proximity).
- **Color:** Limited palette + semantic tokens; meaning never conveyed by color alone.
- **Contrast:** Body text ≥ 4.5:1, large text/UI ≥ 3:1 (WCAG AA).
- **Accessibility:** Semantic HTML, keyboard operable, visible focus, labels on inputs, alt text, logical heading order.
- **Responsive:** Works fluidly from ~320px up; touch targets ≥ 24×24px (44px comfortable); no horizontal scroll.
- **Motion:** Purposeful, fast (~150–300ms), eased; respects `prefers-reduced-motion`.

## Guiding ethos (from the W3C)

Per the **W3C Web Platform Design Principles**: *put user needs first* (Priority of Constituencies — users before authors before implementors), *support the full range of devices and platforms* (media independence), and *minimize the data you ask of users*. Accessibility and device independence are defaults, not features. See [references/sources.md](references/sources.md).
