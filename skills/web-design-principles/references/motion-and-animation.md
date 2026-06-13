# Motion & Animation

Motion should clarify, not decorate. Good animation guides attention, communicates cause-and-effect and spatial relationships, and provides feedback — fast and unobtrusive.

## Purpose (why animate at all)

- **Feedback** — confirm an action happened (button press, toggle, form submit).
- **Continuity / orientation** — show where things come from and go (a panel slides from the edge it's anchored to; list items reorder visibly).
- **Focus** — direct attention to what changed (a new item gently appears).
- **Status** — communicate progress/loading (skeletons, spinners, progress bars).
- If an animation doesn't serve one of these, cut it.

## Timing & easing

- **Duration:** keep it short. ~**150–300ms** for most UI transitions; ~100ms for tiny state changes (hover); larger/full-screen transitions up to ~400–500ms. Longer feels sluggish.
- **Easing:** almost never linear. Use **ease-out** for elements entering/responding to user input (fast start, soft landing); **ease-in** for exits; **ease-in-out** for elements moving across the screen.
- **Stagger** related items slightly (~20–50ms apart) instead of moving as one block.

## What to animate (performance)

- Animate **`transform`** (translate/scale/rotate) and **`opacity`** — they're GPU-composited and cheap.
- **Avoid animating layout properties** (`width`, `height`, `top`/`left`, `margin`) — they trigger layout/paint and cause jank. Use transforms instead.
- Aim for 60fps; use `will-change` sparingly and only just before animating.

## Accessibility — reduced motion (required)

- **Always honor `prefers-reduced-motion`.** Many users get motion sickness/vestibular issues from large or parallax movement.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Reduce, don't necessarily remove — prefer a simple opacity fade over motion when reduced.
- Avoid large parallax, auto-playing motion, and anything flashing > 3 times/second (WCAG 2.3.1 seizure risk).

## Patterns & restraint

- **Microinteractions:** subtle hover/press/focus feedback; toggles and checkmarks; input validation.
- **Transitions:** route/page and modal enter/exit; accordion/disclosure expand.
- **Loading:** skeleton screens > spinners for content; show progress for long tasks.
- **Don't overdo it:** no gratuitous bouncing, no animating everything at once, nothing that delays the user from acting. Motion should never block input.

## Tools (cited resources)

- CSS animation utilities and JS animation libraries (e.g. GSAP, Motion/Framer Motion) are catalogued in bradtraversy/design-resources-for-developers.

## Checklist

- [ ] Does each animation serve feedback, continuity, focus, or status?
- [ ] Duration ~150–300ms with appropriate easing (not linear)?
- [ ] Animating only `transform`/`opacity` (no layout thrash)?
- [ ] `prefers-reduced-motion` handled?
- [ ] No flashing > 3×/sec; motion never blocks interaction?

**Sources:** WCAG 2.2 (2.3.1 flashing; 2.3.3 animation from interactions / reduced motion) via W3C; bradtraversy/design-resources-for-developers (CSS animations, JS animation libraries). See [sources.md](sources.md).
