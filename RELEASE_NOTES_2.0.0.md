# v2.0.0 - Token-Optimized Edition

The framework now uses **50-75% fewer tokens** for the same output quality. v1 is untouched; v2 lives alongside it.

## What changed

- **New: five target platforms.** One idea now ships to web, Android, iOS, macOS, and Windows. New `desktop-engineer` skill (signed installers, auto-update) joins `frontend-engineer` (web) and `mobile-engineer` (Android/iOS); the skill-discovery-engine maps platforms to skills. See `v2/PLATFORMS.md`.
- **Scoped phase context** (biggest win): v1 dumped every previous phase output into every later phase (O(n^2) context). v2 gives each phase only the prior outputs it declares, plus a compact rolling digest. Estimated 70-80% cut on phase context.
- **Compact skill format**: 24 skills rewritten from ~950-token YAML to ~300-token `.skill.md` files. Same missions, inputs, outputs, validation rules. Dropped dead weight: generic best-practice lists, tool lists, template references to files that never existed.
- **Artifact references**: phases pass `{id, hash, bytes, 200-char preview}` instead of full JSON dumps. Full content is fetched only for artifacts a skill declares as required inputs.
- **Single-source templates**: the divergent `.md` duplicates are gone; one `.hbs` per template.
- **Shared guidelines**: universal engineering guidance is injected once per phase, not repeated in every skill prompt.

## Agent-ready

- `agents/plugin.json` - install manifest for agent frameworks
- `agents/mcp.json` - MCP-style tool definitions (`run_project`, `run_phase`, `list_skills`)
- `agents/AGENTS.md` - discovery guide for coding agents
- `v2/skills/INDEX.md` - all 24 skills, one line each

## Docs

- `v2/README.md` - quick start
- `v2/MIGRATION.md` - v1 to v2 mapping
- `v2/TOKEN_BUDGET.md` - measured v1 vs v2 token breakdown (estimates from code analysis)

## One-click import

Run the framework inside the agent you already use. Copy one pack, paste once. Every pack now asks for target platforms (web, android, ios, mac, windows) and builds for all of them:

- Meta Muse: `agents/one-click/muse.md`
- ChatGPT: `agents/one-click/chatgpt-gpt-pack.md` (custom GPT fields ready to paste)
- Grok: `agents/one-click/grok-pack.md` (custom instructions)
- Web installer with copy buttons: `docs/one-click-install.html` (served on GitHub Pages)

## Upgrade

v2 is additive: nothing in v1 was modified. Point your runner at `v2/core/orchestrator.ts` to use the optimized pipeline.
