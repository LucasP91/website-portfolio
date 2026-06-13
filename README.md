# Website Portfolio — Session Backup

Backup of the UI/design toolchain set up on **2026-06-13**. This is a reference/restore snapshot, not the live config (the working copies live in `~/.claude/` and `~/motion-dev-mcp`).

## Contents

| Path | What it is |
|---|---|
| [SESSION-SETUP.md](SESSION-SETUP.md) | Full reproduction notes — Node, skills, MCP servers, build steps, the workflow |
| `skills/web-design-principles/` | Full copy of the authored design-principles skill (SKILL.md + 8 references + sources) |
| `config/CLAUDE.md` | The required UI Development Workflow (Design → Magic `/ui` → Motion MCP) |
| `config/mcp-servers.json` | The `magic` + `motion-dev` MCP entries (**API key redacted**) |

## ⚠️ Action item
Rotate the **21st.dev Magic API key** at https://21st.dev/magic/console — it was shared in chat this session. The live value is in `~/.claude.json`; this backup has it redacted.

## Notes
- Third-party skills installed this session (`ui-ux-pro-max` + 6 `ckm:*` extras) are **not** duplicated here — they're large and re-downloadable; see SESSION-SETUP.md for sources and reinstall steps.
- This folder appears to be a non-OneDrive Desktop path; verify your own backup/sync if you want it preserved off-machine.
