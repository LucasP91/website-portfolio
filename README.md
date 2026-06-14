# Lucas Picard — Portfolio

Personal portfolio of Lucas Picard — mechanical & robotics engineering student at WPI and hands-on mechatronics builder.

**Live:** https://lucasp91.github.io/website-portfolio/

The hero showcase is a scroll-driven turntable of my **SCARA robot arm** — designed in CAD, rendered in Blender, and played back as a 120-frame transparent canvas sequence over an animated aurora background.

## Tech
Vite · React · TypeScript · plain CSS (design tokens) · [Motion](https://motion.dev) for scroll-driven animation.

## Develop
```bash
npm install
npm run dev
```

## Build
```bash
npm run build   # outputs to dist/
```

Deploys automatically to GitHub Pages on every push to `main` (see `.github/workflows/deploy.yml`).

## Notes
- `public/frames/` — turntable frames for the showcase; regenerate from Blender renders with `scripts/import-robot-frames.mjs`.
- `docs/cad-render-recipe.md` — the reusable Blender CAD→web render recipe behind the robot animation.
