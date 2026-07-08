---
name: AI Skill Engineer
description: >-
  Autonomous engineering framework that orchestrates 24 simulated expert roles
  across a 10-phase workflow to convert natural-language ideas into complete,
  production-ready applications.
version: 1.0.0
author: forgephantom
repository: https://github.com/forgephantom/Ai-skill-engineer
type: framework
tags:
  - typescript
  - cli
  - autonomous
  - code-generation
  - llm
  - workflow
config:
  node: ">=20"
  npm: ">=9"
skills:
  - product-strategist
  - business-analyst
  - product-manager
  - solution-architect
  - technical-writer
  - ux-designer
  - ui-designer
  - frontend-engineer
  - backend-engineer
  - mobile-engineer
  - ai-engineer
  - database-engineer
  - cloud-engineer
  - devops-engineer
  - security-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer
  - code-fixer
  - validation-engine
  - optimization-engine
  - delivery-engineer
  - principal-engineer-simulator
  - skill-discovery-engine
phases:
  - understand
  - plan
  - discover-skills
  - build
  - review
  - fix
  - validate
  - human-approval
  - optimize
  - deliver
---

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

```
CLI → Orchestrator (10 phases) → Skill Registry → Execution Engine → Storage Layer
```

Skills execute via pluggable `executor.ts` files. Supported providers: OpenAI, Anthropic, Ollama, Google Gemini.

## Build & Test Commands

- `npm run build` — Compile TypeScript
- `npm test` — Run all tests (126 passing)
- `npm run lint` — ESLint
- `npm run typecheck` — tsc --noEmit
- `npm run dev -- init "idea"` — Run in dev mode

## Skill Pattern

Each skill has a YAML definition file and an optional executor:

```yaml
# src/skills/definitions/<skill-id>/skill.yaml
id: my-skill
name: My Skill
model: claude-3-5-sonnet
temperature: 0.3
```

```typescript
// src/skills/definitions/<skill-id>/executor.ts
import { SkillExecutor, SkillInput, ExecutionContext, SkillResult } from '../../../types';

export class MyExecutor implements SkillExecutor {
  execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult>;
}
```

## Project Config

Stored in `project-config.json`. Supports: model, temperature, maxTokens, maxParallelSkills (default 4), validationLevel (strict/standard/minimal), humanApprovalRequired (default true).
