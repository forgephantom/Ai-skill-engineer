# AGENTS.md - AI Skill Engineer v2

Autonomous engineering framework. One natural-language idea in, one production-ready application out, for web, android, ios, mac, and windows. 25 expert skills, 10 phases. Token-optimized: ~50-75% fewer tokens than v1 for the same output.

## For an agent that wants to use this framework

1. Read `v2/skills/INDEX.md` (25 skills, one line each) to find the right expert.
2. Read only that skill's `v2/skills/<id>.skill.md` (under 350 tokens each).
3. Read `v2/PLATFORMS.md` for the platform to skill matrix (web -> frontend, android/ios -> mobile, mac/windows -> desktop).
4. Run phases in order via `v2/core/orchestrator.ts`. Each phase receives a compact digest plus only the prior outputs it needs. Never paste full history into a phase.
5. Templates live in `v2/templates/` (single-source `.hbs` files only).
6. Validation rule IDs are defined once in `v2/core/validation-rules.md`; skills reference IDs, not full text.

## For an agent that wants to extend it

- New skill: copy the format in any `v2/skills/*.skill.md`. Keep it under 350 tokens: one-line mission, max 5 responsibilities, in/out contracts, rule IDs.
- New template: add one `.hbs` file to `v2/templates/`. Never add a second copy in another format.

## Token budget

See `v2/TOKEN_BUDGET.md` for the measured breakdown. Rule of thumb: pass artifact references (`id`, `hash`, `bytes`, 200-char preview) between phases; fetch full content only for artifacts a skill declares as required inputs.
