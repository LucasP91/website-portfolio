# Accessibility (WCAG)

Accessibility is a baseline, not a feature. Target **WCAG 2.2 Level AA**. The four POUR principles: content must be **Perceivable, Operable, Understandable, Robust**.

## Semantic HTML first

- Use the right element: `<button>` for actions, `<a href>` for navigation, `<nav>`, `<main>`, `<header>`, `<footer>`, `<ul>`/`<ol>` for lists, `<table>` for tabular data.
- One `<h1>` per page; **don't skip heading levels** (h1→h2→h3). Headings define the document outline screen-reader users navigate by.
- Native elements bring keyboard support, focus, and roles for free. Reach for ARIA only when no native element fits.

## Keyboard & focus (Operable)

- **Everything interactive must be keyboard operable** (Tab/Shift+Tab, Enter/Space, arrows for composite widgets). No mouse-only controls.
- **Visible focus indicator** on every focusable element (2.4.7) — never `outline: none` without a replacement; ensure the indicator has ≥ 3:1 contrast (2.4.11/2.4.13 focus appearance).
- **Logical focus order** matches reading order (2.4.3). Manage focus on route changes, modal open/close (trap focus in modal, return it on close).
- Provide a **"skip to content"** link.

## Perceivable

- **Text alternatives** (1.1.1): meaningful `alt` for informative images; empty `alt=""` for decorative ones; label icon-only buttons (`aria-label`).
- **Contrast:** text ≥ 4.5:1, large text/UI ≥ 3:1 (see Color & Contrast).
- **Don't rely on color alone** (1.4.1).
- **Reflow** (1.4.10): usable at 320px wide / 400% zoom with no loss of content or horizontal scrolling.
- **Captions/transcripts** for audio/video.

## Forms

- Every input has a programmatically associated `<label>` (not placeholder-as-label).
- Group related fields with `<fieldset>`/`<legend>`.
- Errors: identify in text, link to the field, set `aria-invalid`/`aria-describedby`; don't signal by color only.
- Don't disable submit silently; explain what's needed.

## Targets & input (2.2 additions)

- **Target size** (2.5.8 AA): interactive targets ≥ **24×24 CSS px** (or adequate spacing). 44×44 is the comfortable mobile standard.
- Support both pointer and keyboard; **dragging has a single-pointer alternative** (2.5.7).
- **Focus not obscured** (2.4.11): sticky headers/footers must not hide the focused element.

## ARIA & components

- "No ARIA is better than bad ARIA." Follow the **WAI-ARIA Authoring Practices (APG)** patterns for tabs, menus, dialogs, comboboxes, disclosure, etc.
- Use roles/states (`aria-expanded`, `aria-selected`, `aria-current`, `aria-live` for dynamic updates) correctly and keep them in sync.

## Motion & timing

- Honor **`prefers-reduced-motion`** (see Motion). Avoid content that flashes > 3×/sec (2.3.1 seizure risk).
- No content auto-updating/timing out without a way to pause, stop, or extend.

## Checklist

- [ ] Semantic HTML; one h1; no skipped heading levels?
- [ ] Fully keyboard operable with visible, high-contrast focus?
- [ ] All images have appropriate alt; icon buttons labeled?
- [ ] Contrast AA met; meaning not color-only?
- [ ] Inputs labeled; errors described in text + ARIA?
- [ ] Targets ≥ 24px; reflow works at 320px/400%?
- [ ] Components follow ARIA APG; `prefers-reduced-motion` respected?

**Sources:** WCAG 2.2 (W3C, success criteria cited inline) and WAI-ARIA Authoring Practices via W3C; the W3C Web Platform Design Principles' "put user needs first" / device independence ethos. See [sources.md](sources.md).
