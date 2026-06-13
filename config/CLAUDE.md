# CLAUDE.md

Project-level guidance for Claude Code in this repository.

## UI Development Workflow (required)

**Whenever you build, generate, restyle, or substantially review UI** — any page, screen, component, form, dashboard, or styled markup/CSS — follow these three steps in order. Apply this consistently; it is the default process for visual work, not an opt-in.

### 1. Design decisions → consult the `web-design-principles` skill

Before writing any UI code, consult the **`web-design-principles`** skill and apply its references for every design decision: visual hierarchy, layout/grid, typography, spacing/whitespace, color/contrast, accessibility (WCAG 2.2 AA), responsive behavior, and motion.

- Use it to *decide* structure, type scale, spacing scale, palette/tokens, and breakpoints **before** generating components.
- Run its Quick Review checklist when reviewing UI, and cite the principle behind non-obvious choices.
- Accessibility and responsive/device-independence are baselines, never afterthoughts.

### 2. Component generation → 21st.dev Magic `/ui`

To produce UI components, use the **21st.dev Magic** MCP via the **`/ui`** command to generate component options, e.g.:

```
/ui a responsive pricing card with a highlighted "popular" tier
```

- Prefer generating a few options with `/ui`, then choose/refine the one that best fits the design decisions from step 1 (use the Magic component refiner to iterate, and `logo_search` for logos).
- Reconcile generated output with this project's conventions and the principles from step 1 — Magic provides the starting point, not the final word. Adjust hierarchy, spacing, tokens, and a11y as needed.

### 3. Animations → Motion MCP

For **any** animation or transition (entrances/exits, hover/press feedback, scroll/reveal, route/modal transitions, loaders), use the **Motion MCP** (motion-dev) to source correct Motion.dev patterns and generate/optimize the animation code.

- Query it for docs, examples, and framework-correct code (`get_motion_docs`, `search_motion_docs`, `generate_motion_component`, `create_animation_sequence`, `optimize_motion_code`, `convert_between_frameworks`).
- Follow the motion guidance in the `web-design-principles` skill (purposeful, ~150–300ms, eased, GPU-friendly `transform`/`opacity`) and **always honor `prefers-reduced-motion`**.

### Summary

> **Design with `web-design-principles` → generate with Magic `/ui` → animate with Motion MCP.**

If any of these tools is unavailable (e.g. an MCP isn't connected), say so and proceed with the principles from step 1 rather than skipping the design step.
