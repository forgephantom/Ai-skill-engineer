# Configuration

AI Skill Engineer is configured through `project-config.json` and CLI options.

---

## project-config.json

Created when you run `ai-se init`. Stored in the project output directory.

### Default Configuration

```json
{
  "model": "claude-3-5-sonnet",
  "temperature": 0.3,
  "maxTokens": 8192,
  "maxParallelSkills": 4,
  "validationLevel": "standard",
  "optimizationIterations": 3,
  "humanApprovalRequired": true
}
```

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `model` | string | `claude-3-5-sonnet` | Default AI model for skills |
| `temperature` | number | `0.3` | Model temperature (0-1) |
| `maxTokens` | number | `8192` | Max tokens per response |
| `maxParallelSkills` | number | `4` | Max concurrent skill executions |
| `validationLevel` | string | `standard` | Validation strictness |
| `optimizationIterations` | number | `3` | Number of optimization passes |
| `humanApprovalRequired` | boolean | `true` | Require human approval gate |

---

## Validation Levels

| Level | Description |
|-------|-------------|
| `minimal` | Basic syntax checks only |
| `standard` | Type-checking, linting, security scan (default) |
| `strict` | All checks including performance and accessibility |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | For Claude | Anthropic API key |
| `OPENAI_API_KEY` | For OpenAI | OpenAI API key |
| `GEMINI_API_KEY` | For Gemini | Google Gemini API key |
| `NVIDIA_NIM_API_KEY` | For NVIDIA NIM | NVIDIA NIM API key |
| `NVIDIA_NIM_ENDPOINT` | For NVIDIA NIM | NVIDIA NIM endpoint URL |
| `AZURE_OPENAI_KEY` | For Azure | Azure OpenAI key |
| `AZURE_OPENAI_ENDPOINT` | For Azure | Azure OpenAI endpoint |

---

## CLI Config Commands

View or modify configuration via the CLI:

```bash
# View current config
ai-se config show

# Set a value
ai-se config set model claude-3-haiku
ai-se config set temperature 0.5
ai-se config set maxParallelSkills 8
```

---

## Runtime Configuration Overrides

CLI options override `project-config.json` at runtime:

```bash
ai-se run --project proj-a1b2c3d4 \
  --max-parallel 8 \
  --validation-level strict \
  --optimization-iterations 5 \
  --no-human-approval
```

---

## Per-Skill Configuration

Each skill's `skill.yaml` can override the global config:

```yaml
# src/skills/definitions/frontend-engineer/skill.yaml
id: frontend-engineer
model: claude-3-5-sonnet    # Overrides global model
temperature: 0.2            # Overrides global temperature
maxTokens: 16384            # Overrides global maxTokens
```

---

## Next Steps

- [Quick Start Guide](quickstart.md) — Run your first project
- [CLI Reference](cli-reference.md) — All available commands
- [Skill Executors](skill-executors.md) — Connect AI providers
