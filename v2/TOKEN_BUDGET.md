# Token Budget: v1 vs v2 (estimates)

These are estimates derived from measuring the v1 source, not from
benchmarked runs. Tokens are estimated at 4 characters per token.
Actual savings depend on phase output sizes and the skill roster used
in a given run.

## Measured v1 inputs

- 24 skill yamls: 90,754 bytes total.
- v1 system prompts (built by `buildSystemPrompt` from name,
  knowledge_areas, mission, responsibilities, bestPractices, and full
  output contracts): measured average 1,680 bytes = ~420 tokens per
  skill, ~10,100 tokens for all 24 skills called once each.
- v1 phase context: `getAllPreviousOutputs` passes every earlier phase
  output to every later phase. Over 10 phases that is 45 phase-output
  transfers, growing quadratically with output size.
- v1 input serialization: input artifacts are JSON dumped in full into
  each skill call, and the deliver phase receives the entire orchestrator
  state.

## Measured v2 targets

- v2 compact system prompts (role plus mission line, up to 5 numbered
  responsibilities, artifact ids, rule IDs): measured average 546 bytes
  = ~137 tokens per skill, ~3,300 tokens for 24 skills.
- CORE_GUIDELINES (~100 tokens) injected once per phase: ~1,000 tokens
  per 10-phase run.
- Rolling digest: hard capped at 1,200 chars = ~300 tokens per phase,
  ~3,000 tokens per run.
- PHASE_INPUTS: each phase sees only its declared prior outputs
  (14 transfers across 10 phases instead of 45).
- Undeclared artifacts travel as ArtifactRef (~60-90 tokens each) with
  a 200 character preview instead of full dumps.

## Estimate table

Assumes a representative run: 24 skill calls (one per skill), 10
phases, average phase output ~3,000 tokens, ~40 artifacts in the build
phase.

| Area | v1 (est. tokens) | v2 (est. tokens) | Reduction |
| --- | --- | --- | --- |
| System prompts | ~10,100 | ~4,300 (incl. guidelines) | ~57% |
| Phase context (prior outputs) | ~135,000 (45 transfers) | ~42,000 (14 scoped transfers) | ~69% |
| Digest overhead | 0 | ~3,000 | n/a (new) |
| Input serialization (build/review) | ~30,000 (full artifact dumps) | ~3,000 (refs + declared only) | ~90% |
| **Total per run** | **~175,000** | **~52,000** | **~70%** |

## Reading this table honestly

- The 50 to 75 percent target is met in this estimate (~70%), with the
  biggest wins from scoped phase context and artifact refs.
- If phase outputs are small (toy projects), the fixed digest and
  guideline overhead eats a larger share and savings skew toward ~50%.
- If phase outputs are large (real builds), savings skew toward ~75%
  because v1's quadratic dumping dominates.
- Output quality is preserved by design: no skill loses its declared
  inputs, its mission, its responsibilities, or its validation rules.
  What was removed was repetition (best practices copied into every
  prompt, every prior output copied into every phase).

Re-run these numbers against real runs with the `usage` field on
`SkillResult` before quoting them publicly.
