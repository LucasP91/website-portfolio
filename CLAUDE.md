# CLAUDE.md

Project-level guidance for Claude Code in the **Website portfolio** project. This is a UI-driven project, so the workflow below applies to essentially all work here.

## UI Development Workflow (required)

**Whenever you build, generate, restyle, or substantially review UI** — any page, screen, component, form, section, or styled markup/CSS — follow these four steps in order. Apply this consistently; it is the default process for visual work, not an opt-in. **Step 4 is a gate: UI work is not done until it passes.**

### 1. Design decisions → consult the `web-design-principles` skill

Before writing any UI code, consult the **`web-design-principles`** skill and apply its references for every design decision: visual hierarchy, layout/grid, typography, spacing/whitespace, color/contrast, accessibility (WCAG 2.2 AA), responsive behavior, and motion.

- Use it to *decide* structure, type scale, spacing scale, palette/tokens, and breakpoints **before** generating components.
- Run its Quick Review checklist when reviewing UI, and cite the principle behind non-obvious choices.
- Accessibility and responsive/device-independence are baselines, never afterthoughts.

### 2. Component generation → 21st.dev Magic `/ui`

To produce UI components, use the **21st.dev Magic** MCP via the **`/ui`** command to generate component options, e.g.:

```
/ui a responsive project card with image, title, tags, and a hover state
```

- Prefer generating a few options with `/ui`, then choose/refine the one that best fits the design decisions from step 1 (use the Magic component refiner to iterate, and `logo_search` for logos).
- Reconcile generated output with this project's conventions and the principles from step 1 — Magic provides the starting point, not the final word. Adjust hierarchy, spacing, tokens, and a11y as needed.

### 3. Animations → Motion MCP

For **any** animation or transition (entrances/exits, hover/press feedback, scroll/reveal, route/modal transitions, loaders), use the **Motion MCP** (motion-dev) to source correct Motion.dev patterns and generate/optimize the animation code.

- Query it for docs, examples, and framework-correct code (`get_motion_docs`, `search_motion_docs`, `generate_motion_component`, `create_animation_sequence`, `optimize_motion_code`, `convert_between_frameworks`).
- Follow the motion guidance in the `web-design-principles` skill (purposeful, ~150–300ms, eased, GPU-friendly `transform`/`opacity`) and **always honor `prefers-reduced-motion`**.

### 4. Verify in the browser → chrome-devtools MCP (required gate)

**After you build or change any UI, verify it in a real browser before considering the work done.** Make sure the dev server is running (`npm run dev`), then use the **chrome-devtools** MCP against the affected local page(s):

1. **Open the page** — `navigate_page` to the local URL (e.g. `http://localhost:5173/…`).
2. **Take a screenshot** — `take_screenshot`; visually confirm layout, hierarchy, spacing, and responsive behavior match the design decisions from step 1.
3. **Run a Lighthouse / performance audit** — `lighthouse_audit` and/or `performance_start_trace` (autoStop) + `performance_analyze_insight`. Watch accessibility, performance, and Core Web Vitals (LCP, CLS, INP).
4. **Check the console for errors** — `list_console_messages` (and `list_network_requests` for failed requests). There should be **no errors or warnings** introduced by the change.

**Then fix any issues you find and re-run step 4 until it passes** — no console errors, no failed requests, accessibility findings addressed, and no performance regressions. Only then is the UI work complete.

Safety: chrome-devtools is registered with `--isolated` (throwaway Chrome profile) and exposes whatever page is open to the client. Point it only at this project's local dev server or public, non-sensitive URLs — **never at pages containing personal accounts or sensitive data.**

### Summary

> **Design with `web-design-principles` → generate with Magic `/ui` → animate with Motion MCP → verify with chrome-devtools (screenshot + Lighthouse/perf + console), then fix and re-verify before done.**

If any of these tools is unavailable (e.g. an MCP isn't connected), say so and proceed with the principles from step 1 rather than skipping the design step. If chrome-devtools specifically is unavailable, still verify the build runs and the page renders without console errors by whatever means you have, and note that the full audit was skipped.
