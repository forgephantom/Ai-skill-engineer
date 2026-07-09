# Custom Skill Definitions

Create your own skills to extend AI Skill Engineer with new expert roles.

---

## Skill Structure

Each skill lives in its own directory under `src/skills/definitions/`:

```
src/skills/definitions/my-custom-skill/
├── skill.yaml          # Required: skill definition
└── executor.ts         # Optional: custom executor
```

---

## skill.yaml — Full Reference

```yaml
id: my-skill                    # Unique identifier (kebab-case)
name: My Skill                  # Human-readable name
version: "1.0.0"                # SemVer version
mission: "One-sentence mission statement"
model: claude-3-5-sonnet        # Optional: provider model
temperature: 0.3                # Optional: 0-1
maxTokens: 8192                 # Optional: max tokens
timeout: 300000                 # Optional: timeout in ms
retryAttempts: 3                # Optional: retry count

responsibilities:
  - "Do X"
  - "Do Y"

knowledge_areas:
  - "Domain knowledge area"

inputs:
  - artifact_id: "input-name"
    contract: "json"             # json | markdown | yaml | filesystem
    required: true               # true | false
    description: "What this input provides"

outputs:
  - artifact_id: "output-name"
    contract: "markdown"         # json | markdown | yaml | filesystem
    description: "What this output produces"

dependencies:
  - "dependency-skill-id"        # IDs of skills that must run first

best_practices:
  - "Best practice 1"
  - "Best practice 2"

validation_rules:
  - rule: "Output must include X"
    severity: "BLOCKER"          # BLOCKER | HIGH | MEDIUM | LOW
    auto_fixable: true

tools:
  - "Tool name"

success_metrics:
  - metric: "Metric name"
    target: "Target value"

templates:
  - "template-name"
```

---

## Contracts — Input/Output Types

| Contract | Description | File Extension |
|----------|-------------|----------------|
| `json` | Structured data | `.json` |
| `markdown` | Human-readable docs | `.md` |
| `yaml` | Configuration data | `.yaml` |
| `filesystem` | Directory structure | (directory) |

---

## Example: Custom Skill

### Step 1: Create the directory

```bash
mkdir -p src/skills/definitions/performance-engineer
```

### Step 2: Create skill.yaml

```yaml
# src/skills/definitions/performance-engineer/skill.yaml
id: performance-engineer
name: Performance Engineer
version: "1.0.0"
mission: "Analyze and optimize application performance"
model: claude-3-haiku
temperature: 0.3

responsibilities:
  - "Analyze application performance bottlenecks"
  - "Recommend optimization strategies"
  - "Generate performance testing plans"

knowledge_areas:
  - "Web performance optimization"
  - "Database query optimization"
  - "Caching strategies"
  - "Load testing"

inputs:
  - artifact_id: "source-code"
    contract: "filesystem"
    required: true
    description: "Application source code to analyze"

outputs:
  - artifact_id: "performance-report"
    contract: "markdown"
    description: "Detailed performance analysis and recommendations"
  - artifact_id: "optimization-plan"
    contract: "json"
    description: "Actionable optimization steps with priorities"

dependencies:
  - "code-reviewer"

best_practices:
  - "Always measure before optimizing"
  - "Focus on the 80/20 rule — biggest impact first"
  - "Document all performance assumptions"

validation_rules:
  - rule: "Report must include response times and throughput"
    severity: "HIGH"
    auto_fixable: false
```

### Step 3: Create executor.ts (Optional)

```typescript
// src/skills/definitions/performance-engineer/executor.ts
import { SkillExecutor, SkillInput, ExecutionContext, SkillResult } from '../../../types';

export class PerformanceEngineerExecutor implements SkillExecutor {
  async execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> {
    // Implement your logic here
    // This could call an LLM, run static analysis, etc.

    return {
      success: true,
      output: {
        artifacts: [
          {
            id: 'performance-report',
            type: 'markdown',
            name: 'Performance Report',
            content: '# Performance Analysis\n\n...',
            metadata: { model: inputs.config.model },
          },
        ],
        metadata: {},
      },
      duration: 0,
    };
  }
}
```

---

## Skill Dependencies

Skills declare dependencies via the `dependencies` field:

```yaml
id: backend-engineer
dependencies:
  - "solution-architect"    # Must run before backend-engineer
  - "database-engineer"     # Must run before backend-engineer
```

The orchestrator resolves the dependency graph into parallel execution groups (DAG).

---

## Best Practices

1. **Use descriptive IDs** — Follow kebab-case: `my-custom-skill`
2. **Write clear missions** — One sentence explaining the skill's purpose
3. **List concrete responsibilities** — Action-oriented, specific
4. **Define validation rules** — Helps ensure output quality
5. **Test your skill** — Create unit tests for your executor
6. **Version your skills** — Use SemVer to track changes

---

## Next Steps

- [Skill Executors](skill-executors.md) — Connect AI providers to your skills
- [Quick Start Guide](quickstart.md) — Run your first project
- [Workflow Phases](workflow-phases.md) — Understand the 10-phase pipeline
