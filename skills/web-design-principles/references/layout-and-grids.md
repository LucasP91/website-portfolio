# Layout & Grid Systems

Structure that organizes content into a coherent, scannable composition. Grids create alignment, rhythm, and predictability.

## Grid fundamentals

- **Columns** — a 12-column grid is the web default (divides cleanly into 2/3/4/6). Mobile often collapses to 4 columns.
- **Gutters** — consistent space between columns (commonly 16–24px).
- **Margins** — outer breathing room; grows on larger viewports.
- **Max content width** — cap measure for readability; full-bleed backgrounds are fine, full-bleed *text* is not (see Typography line length).

## Composition principles (Gestalt)

- **Alignment** — every element should line up with something. Strong edges (a shared left margin) make a layout feel intentional. Ragged alignment reads as sloppy.
- **Proximity** — group related items; gap unrelated ones. Spacing *is* grouping.
- **Similarity** — items that look alike are read as the same kind; keep consistent card/list styles.
- **Common region** — a shared container (card, panel) binds items together.
- **Balance** — distribute visual weight; symmetric = formal/stable, asymmetric = dynamic but needs a counterweight.

## Modern CSS layout

- **Flexbox** — one-dimensional (a row or a column): toolbars, nav, button groups, centering.
- **CSS Grid** — two-dimensional (rows *and* columns): page shells, dashboards, card galleries, complex forms.
- Prefer `gap` over margins for spacing between flex/grid children.
- Use `minmax()`, `auto-fit`/`auto-fill`, and `clamp()` for fluid, self-adjusting grids without media queries.

## Patterns

- **App shell:** header / sidebar / main / footer via Grid template areas.
- **Holy grail / 12-col content:** centered max-width container, 12-col grid inside.
- **Card grid:** `repeat(auto-fit, minmax(min, 1fr))` for responsive wrapping.
- **Split / hero:** two-column above the fold, stacks on mobile.

## Rules of thumb

- Establish a grid first, then place content — don't position pixel-by-pixel.
- Keep a consistent number of columns and gutter across a page.
- Align to the grid; intentional exceptions (a full-bleed image) should be obvious, not accidental.
- White space between sections > decorative dividers (see Spacing).

## Checklist

- [ ] Is content on a defined grid with consistent columns/gutters?
- [ ] Does everything align to shared edges (no random offsets)?
- [ ] Is text capped to a readable max width?
- [ ] Are related blocks grouped (proximity) and sections clearly separated?
- [ ] Flexbox for 1D, Grid for 2D — used appropriately?

**Sources:** robinstickel/awesome-design-principles (alignment, balance, proximity, similarity, grid); bradtraversy/design-resources-for-developers (CSS frameworks & methodologies — BEM/OOCSS, grid systems). See [sources.md](sources.md).
