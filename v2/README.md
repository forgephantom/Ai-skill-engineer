# AI Skill Engineer v2

A token-optimized rewrite of the v1 autonomous engineering framework.
Same 10 phase workflow (understand, plan, discover-skills, build,
review, fix, validate, human-approval, optimize, deliver), now 25
skills (v1 had 24; v2 adds desktop-engineer for macOS and Windows),
but each run spends an estimated 50 to 75 percent fewer tokens with
no loss of skill context that matters.

## Target platforms

One idea ships to web, android, ios, mac, and windows. The
skill-discovery-engine maps platforms to build skills: web goes to
frontend-engineer, android and ios to mobile-engineer, mac and windows
to desktop-engineer. See [PLATFORMS.md](PLATFORMS.md) for the full
matrix. Phase 1 records the target platforms; if the user names none,
the framework asks instead of assuming.

## The 4 token optimizations

1. **Compact system prompts.** One role-plus-mission line, up to 5
   numbered responsibilities, output artifact ids, and rule IDs.
   Measured: ~137 tokens per skill vs ~420 in v1. Rule text lives in
   `core/validation-rules.md`, not in the prompt.
2. **Guidelines injected once per phase.** v1 repeated each skill's
   best practices in every call. v2 uses one CORE_GUIDELINES paragraph
   per phase instead.
3. **Scoped inputs.** A skill receives full content only for artifacts
   it declares in `inputs`. Everything else arrives as an ArtifactRef
   (id, hash, byte size, 200 char preview) instead of a full JSON dump.
4. **Declared phase inputs.** v1 passed every prior phase output to
   every later phase (45 transfers over 10 phases, quadratic growth).
   v2's PHASE_INPUTS declares exactly what each phase needs (14
   transfers), plus a rolling digest capped at ~300 tokens per phase.

See [TOKEN_BUDGET.md](TOKEN_BUDGET.md) for the measured math.

## Quick start

```ts
import { LLMExecutor } from './core/engine';
import { Orchestrator } from './core/orchestrator';
import { SkillDef } from './core/types';

const executor = new LLMExecutor({
  model: 'gpt-4o-mini',
  apiKey: process.env.OPENAI_API_KEY,
});

const registry = new Map<string, SkillDef>([
  ['business-analyst', {
    id: 'business-analyst',
    name: 'Business Analyst',
    mission: 'Extract a crisp problem space from the raw idea.',
    inputs: [],
    outputs: [{ artifact_id: 'vision' }, { artifact_id: 'requirements' }],
    responsibilities: [
      'Write a vision statement under 500 characters.',
      'List target audience segments.',
      'Capture business goals with metrics and timelines.',
      'Record functional requirements with MoSCoW priorities.',
      'Record measurable non-functional requirements.',
    ],
    validate: ['R-PROC-VISION', 'R-PROC-REQ'],
  }],
  // ... rest of the 24 skills
]);

const orchestrator = new Orchestrator(executor, registry);
const state = await orchestrator.run('A marketplace for local tutors', 'tutor-market');
```

Set `OPENAI_API_KEY` (and optionally `OPENAI_BASE_URL` for any
OpenAI-compatible endpoint). No other dependencies.

## How to add a skill

1. Write a `SkillDef`: id, name, one sentence mission, declared
   inputs, declared outputs, up to 5 key responsibilities, and rule
   IDs from `core/validation-rules.md`.
2. Register it in the registry map and, if it runs outside the build
   phase, add its id to PHASE_SKILLS for that phase.
3. If the skill needs artifacts from a phase not in PHASE_INPUTS for
   its own phase, add that phase to the map.

## Migrating from v1

Read [MIGRATION.md](MIGRATION.md) for the skill.yaml to SkillDef
mapping, the list of dropped fields, and behavior differences.

## Layout

- `core/types.ts` - minimal types (SkillDef, ArtifactRef, ScopedContext, PhaseName)
- `core/engine.ts` - LLMExecutor, compact prompts, CORE_GUIDELINES, ArtifactRef builder
- `core/orchestrator.ts` - 10 phase pipeline, PHASE_INPUTS, rolling digest
- `core/validation-rules.md` - canonical rule catalog with stable IDs
- `TOKEN_BUDGET.md` - honest v1 vs v2 token estimates from measured code
- `MIGRATION.md` - v1 to v2 migration notes
