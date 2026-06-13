# Session Setup — UI/Design Toolchain (backup & reproduction notes)

Snapshot of everything configured in the Claude Code session on **2026-06-13**. This documents how to reproduce the setup on a fresh machine. Authored artifacts are copied into this folder; large re-downloadable third-party content is documented (with sources) rather than duplicated.

---

## 1. Node.js (prerequisite for the MCP servers)

- Installed **portably** (no admin) because winget's MSI stalled on a UAC elevation prompt.
- Location: `C:\Users\Lucas\nodejs` (added to **user PATH**).
- Version: **Node 22.22.3 LTS** (npm 10.9.8).
- ⚠️ Use **Node 22**, not 24 — native npm modules (e.g. `better-sqlite3`, used by motion-dev-mcp) have no prebuilt binaries for Node 24 and fail to compile without Python + MSVC build tools.
- Reproduce: download `https://nodejs.org/dist/latest-v22.x/node-v22.x.x-win-x64.zip`, unzip to `~/nodejs`, add to user PATH.

## 2. Skills installed (in `~/.claude/skills/`)

### Authored this session (copied into `./skills/`)
- **web-design-principles** — created from scratch. SKILL.md + 8 reference notes + sources.md. Core web design principles (hierarchy, layout, type, spacing, color/contrast, WCAG, responsive, motion). Sources cited: W3C Web Platform Design Principles, robinstickel/awesome-design-principles, nicolesaidy/awesome-web-design, bradtraversy/design-resources-for-developers.

### Installed from third parties (NOT duplicated here — re-installable from source)
From **github.com/nextlevelbuilder/ui-ux-pro-max-skill** (manually materialized; repo uses symlink stubs into `src/`):
- `ui-ux-pro-max` (the official plugin skill — data/ CSV databases + BM25 search scripts, pure Python stdlib)
- Plus 6 bundled extras (named `ckm:*`): `design-system`, `brand`, `ui-styling`, `slides`, `banner-design`, `design`
- Reinstall: clone the repo, copy `src/ui-ux-pro-max/{data,scripts}` into `~/.claude/skills/ui-ux-pro-max/` (the repo's `.claude/skills/*/data` and `*/scripts` are symlinks on Windows and check out as broken stubs).

## 3. MCP servers (user scope, in `~/.claude.json` → top-level `mcpServers`)

See `./config/mcp-servers.json` (key redacted). Both require Node on PATH.

### magic (21st.dev Magic) — `/ui` command
- `npx -y @21st-dev/magic@latest API_KEY=<key>`
- API key from **https://21st.dev/magic/console** (Motion+ unrelated; this is 21st.dev's own key).
- ⚠️ **Rotate the key** — it was pasted in chat this session.
- Verified: `initialize` handshake OK (`21st-magic` v0.0.46); tools: `21st_magic_component_builder`, `21st_magic_component_inspiration`, `21st_magic_component_refiner`, `logo_search`.

### motion-dev (community Motion.dev MCP) — offline animation docs/codegen
- Source: **github.com/Abhishekrajpurohit/motion-dev-mcp**, cloned to `~/motion-dev-mcp`. Free, offline, no API key.
- Build (with Node 22 on PATH):
  ```bash
  cd ~/motion-dev-mcp
  npm install
  npx tsc && cp src/database/schema.sql dist/database/   # run tsc + copy manually (npm build script's `cp` fails on Windows cmd)
  npm run rebuild                                          # builds FTS5 docs DB: 26 docs, 232 components, 391 examples
  ```
- Verified: `initialize` OK (`motion-dev-mcp` v1.0.0); 9 tools incl. `get_motion_docs`, `search_motion_docs`, `generate_motion_component`, `create_animation_sequence`, `optimize_motion_code`, `convert_between_frameworks`.

### NOT installed: Motion AI Kit (`npx motion-ai`)
- Skipped — its skill content is paywalled behind a **Motion+ subscription** (token-gated registry); no public/manual route. The free `motion-dev` MCP above covers Motion.dev docs instead.

## 4. UI Development Workflow (CLAUDE.md)

- Added to the `car_scraper` repo root; copy in `./config/CLAUDE.md`.
- Required workflow for any UI work: **Design with `web-design-principles` → generate with Magic `/ui` → animate with Motion MCP.**

---

## To activate in a new session
1. Ensure `~/nodejs` is on PATH (`node --version` → v22.x).
2. Restart Claude Code; run `/mcp` → confirm `magic` and `motion-dev` are **connected**.
3. Skills auto-activate from `~/.claude/skills/`.
