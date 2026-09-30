# Migration Guide: v1 skill.yaml to v2 SkillDef

## Format mapping

| v1 skill.yaml | v2 SkillDef |
| --- | --- |
| `id` | `id` (unchanged) |
| `name` | `name` (unchanged) |
| `mission` | `mission` (unchanged, one sentence) |
| `responsibilities` | `responsibilities` (keep all; only the first 5 reach the prompt) |
| `inputs` | `inputs` (same `artifact_id`, `required`; drop `contract` and `description`) |
| `outputs` | `outputs` (same `artifact_id`; drop `contract` and `description`) |
| `validation_rules` (full text) | `validate` (list of rule IDs from `core/validation-rules.md`) |
| `tools` | dropped |
| `best_practices` | dropped (replaced by CORE_GUIDELINES) |
| `knowledge_areas` | dropped (folded into the mission line) |
| `templates` | dropped |
| `success_metrics` | dropped |
| `dependencies` | dropped (PHASE_INPUTS owns dependency scoping) |
| `version` | dropped (v2 is the version) |

## What was dropped and why

- `tools`: listed CLIs and libraries the skill might use. It never
  reached the prompt as actionable instruction, so it only cost parse
  and maintenance overhead.
- `best_practices`: repeated per skill in every system prompt. v1's
  24 skill prompts carried ~4,000 tokens of near identical guidance in
  total. v2 injects one CORE_GUIDELINES paragraph per phase instead.
- `templates` (handlebars `.hbs` references): v2 generates directly
  through the LLM call; template rendering was a separate executor path
  that duplicated logic.
- `knowledge_areas`: a list of expertise labels that padded the role
  line. The mission sentence now carries the same signal in fewer
  words.
- `success_metrics`, `dependencies`, `version`: bookkeeping that no
  executor read at runtime.

## Behavior differences

- Scoped context: v1's `prepareInputs` searched all previous outputs
  and the TemplateBasedExecutor rendered with every prior output
  merged in. v2 only matches a declared input against the phases listed
  in PHASE_INPUTS. If a skill needs an artifact from a phase outside its
  declared inputs, add that phase to PHASE_INPUTS first.
- Refs vs full dumps: v1 JSON dumped full artifacts into each call.
  v2 sends full content only for declared inputs; everything else is an
  ArtifactRef (id, hash, byte size, 200 char preview). Design prompts
  to request an id explicitly if the preview is not enough.
- Rule IDs: validation rules are no longer inline text. Map each old
  rule to the closest ID in `core/validation-rules.md` and list the IDs
  in `validate`. If no ID fits, add one to the catalog.
- Phase outputs are plain `Record<string, string>` keyed by artifact
  id. v1's typed output interfaces (UnderstandOutput, PlanOutput, and
  so on) are gone; structure is the model's job now, which saves the
  ~26 KB types module.
- The engine has no external dependencies: it uses the global fetch
  against an OpenAI-compatible endpoint, not the openai SDK.
