# Responsive Design

One interface that works across the full range of devices, screen sizes, and input modes. This is the W3C **media independence** principle in practice: don't assume a device — adapt to it.

## Mobile-first

- Design the smallest viewport first, then **enhance upward** with `min-width` media queries. Forces prioritization and yields leaner CSS.
- Start from ~**320px** width as the practical floor.
- Always include `<meta name="viewport" content="width=device-width, initial-scale=1">`.

## Fluid by default, breakpoints as needed

- Prefer **intrinsically responsive** techniques over many breakpoints:
  - Fluid type/space with `clamp()`.
  - Self-adjusting grids: `repeat(auto-fit, minmax(min, 1fr))`.
  - `%`, `fr`, `min()`/`max()`/`minmax()`, `flex-wrap`.
  - Container queries (`@container`) to make components respond to *their* space, not the viewport.
- Add breakpoints where the **content** breaks, not at fixed "device" widths. Common ranges: ~480 (phone), ~768 (tablet), ~1024 (laptop), ~1280+ (desktop) — but let the design dictate.

## Layout adaptation patterns

- **Stack → columns:** single column on mobile expands to multi-column grid on wider screens.
- **Priority / progressive disclosure:** show essentials on small screens; reveal secondary content/nav (e.g. hamburger → inline nav) as space allows.
- **Reflow over zoom-out:** content rewraps; never force horizontal scrolling for primary content (WCAG 1.4.10 reflow at 320px/400%).
- Cap line length even on large screens (max-width container).

## Input & device independence

- **Touch targets ≥ 24×24px** (WCAG 2.5.8); 44×44px comfortable. Space them to avoid mis-taps.
- Support touch, mouse, keyboard, and stylus — don't gate features on hover. Provide non-hover access to anything revealed on `:hover`.
- Respect device capabilities/preferences: `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-reduced-data`, safe-area insets (notches), and dynamic viewport units (`dvh`) for mobile browser chrome.

## Media

- **Responsive images:** `srcset`/`sizes` and `<picture>` for art direction; `width`/`height` (or `aspect-ratio`) to prevent layout shift; `loading="lazy"` for below-the-fold.
- Use modern formats (AVIF/WebP) and compress (see resource lists).

## Performance is part of responsive

- Slow = broken on real devices/networks. Watch Core Web Vitals: **LCP, CLS, INP**.
- Reserve space for media/ads to avoid layout shift (CLS); avoid huge above-the-fold payloads.

## Checklist

- [ ] Mobile-first; viewport meta present; usable at 320px?
- [ ] Fluid type/space (`clamp`) and self-adjusting grids before manual breakpoints?
- [ ] Breakpoints placed where content needs them?
- [ ] No horizontal scroll / content loss at 320px or 400% zoom?
- [ ] Touch targets ≥ 24px; no hover-only functionality?
- [ ] Responsive images with dimensions set (no layout shift)?
- [ ] User preference media queries honored?

**Sources:** W3C Web Platform Design Principles — "Support the full range of devices and platforms" (media independence); WCAG 2.2 (1.4.10 reflow, 2.5.8 target size); bradtraversy/design-resources-for-developers (CSS frameworks, image compression). See [sources.md](sources.md).
