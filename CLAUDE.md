# AI Skill Engineer — Claude Context

## Overview
AI Skill Engineer is a TypeScript CLI tool that orchestrates 24 simulated expert roles across a 10-phase autonomous workflow to convert natural-language ideas into complete projects.

## Key Files
- `src/cli/index.ts` — CLI entry point (Commander.js)
- `src/orchestrator/index.ts` — 10-phase workflow state machine
- `src/execution/engine.ts` — Execution engine + SkillExecutor interface
- `src/skills/registry.ts` — YAML skill loader, dynamic executor imports
- `src/skills/definitions/*/skill.yaml` — 24 skill definitions
- `src/types/index.ts` — All TypeScript types and interfaces
- `src/validation/index.ts` — Validation pipeline stages
- `SPEC.md` — Full architecture specification

## Architecture
CLI → Orchestrator (10 phases) → Skill Registry → Execution Engine → Storage Layer
Skills execute via pluggable `executor.ts` files (OpenAI, Anthropic, Ollama, etc.)

## Build & Test Commands
- `npm run build` — Compile TypeScript
- `npm test` — Run all tests
- `npm run lint` — ESLint
- `npm run typecheck` — tsc --noEmit
- `npm run dev -- init "idea"` — Run in dev mode

## Skill Pattern
Each skill has: `skill.yaml` (metadata + config) + optional `executor.ts` (runtime logic)
Place custom executors in `src/skills/definitions/<skill-id>/executor.ts`

## Project Config
Stored in `project-config.json`, supports: model, temperature, maxTokens, maxParallelSkills, validationLevel, humanApprovalRequired.
