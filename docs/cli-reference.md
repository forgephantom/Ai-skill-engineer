# CLI Reference

All commands are accessed via the `ai-se` CLI tool.

---

## Global Options

| Option | Description |
|--------|-------------|
| `--help` | Show help for any command |
| `--version` | Show version number |

---

## `init` — Initialize a New Project

```bash
ai-se init [idea] [options]
```

Create a new project from a natural-language idea.

### Examples

**Interactive mode (no arguments):**
```bash
ai-se init
```
Prompts you to enter a project idea interactively.

**Direct idea with defaults:**
```bash
ai-se init "Build a SaaS platform for compliance reporting"
```

**Full options:**
```bash
ai-se init "A marketplace connecting freelancers with founders" \
  --name freelancer-marketplace \
  --output ./projects \
  --no-human-approval
```

### Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--name <name>` | `-n` | auto-generated | Project display name |
| `--output <dir>` | `-o` | `./output` | Output directory for artifacts |
| `--no-human-approval` | | `false` | Skip the human approval gate |

### Output

```
✔ Project initialized: freelancer-marketplace (proj-a1b2c3d4)
```

---

## `run` — Execute the Workflow

```bash
ai-se run --project <id> [options]
```

Run the full 10-phase autonomous workflow.

### Examples

**Basic run:**
```bash
ai-se run --project proj-a1b2c3d4
```

**Run without human approval gate (auto-approve):**
```bash
ai-se run --project proj-a1b2c3d4 --no-human-approval
```

**Run with custom validation and parallelization:**
```bash
ai-se run --project proj-a1b2c3d4 \
  --max-parallel 8 \
  --validation-level strict \
  --optimization-iterations 5
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--project <id>` | required | Project ID or path to project directory |
| `--max-parallel <n>` | `4` | Maximum number of parallel skills |
| `--validation-level <level>` | `standard` | Validation strictness: `strict`, `standard`, or `minimal` |
| `--optimization-iterations <n>` | `3` | Number of optimization passes |
| `--no-human-approval` | `false` | Auto-approve at phase 8 |

### Output

```
✔ Phase 1/10: understand completed
✔ Phase 2/10: plan completed
...
╔════════════════════════════════════════════════════════════╗
║              WORKFLOW COMPLETED SUCCESSFULLY               ║
╚════════════════════════════════════════════════════════════╝

Delivery package: ./output/proj-a1b2c3d4/delivery/
```

---

## `status` — Show Project State

```bash
ai-se status --project <id>
```

Display the current status of a project.

### Example

```bash
ai-se status --project ./output/proj-a1b2c3d4
```

### Output

```
Project: freelancer-marketplace (proj-a1b2c3d4)
Current Phase: build (completed)
Phases:
  understand:         completed
  plan:               completed
  discover-skills:    completed
  build:              in-progress
  review:             pending
  ...
```

---

## `resume` — Resume an Interrupted Workflow

```bash
ai-se resume --project <id> [options]
```

Resume the workflow from the last completed phase.

### Example

```bash
ai-se resume --project ./output/proj-a1b2c3d4 --no-human-approval
```

### Options

Same as `run`.

---

## `stop` — Stop a Running Project

```bash
ai-se stop --project <id>
```

Gracefully stop a running project. State is persisted for later resumption.

### Example

```bash
ai-se stop --project proj-a1b2c3d4
```

---

## `validate` — Run Validation Pipeline

```bash
ai-se validate --project <id> [options]
```

Run the validation pipeline on a completed project.

### Example

```bash
ai-se validate --project ./output/proj-a1b2c3d4 --level strict
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--level <level>` | `standard` | Validation strictness |

---

## `doctor` — System Health Check

```bash
ai-se doctor
```

Verify system requirements and configuration.

### Example

```bash
ai-se doctor
```

### Output

```
✔ System health check passed
✔ TypeScript: 5.4+
✔ Node: 20+
✔ Dependencies: installed
✔ Configuration: valid
```

---

## `skills` — Manage Skill Definitions

```bash
ai-se skills <subcommand> [options]
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `list` | List all registered skills |
| `show <id>` | Show skill definition details |

### Examples

```bash
ai-se skills list
ai-se skills show frontend-engineer
```

---

## `templates` — Manage Templates

```bash
ai-se templates <subcommand> [options]
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `list` | List all available templates |
| `show <name>` | Show template content |

### Examples

```bash
ai-se templates list
ai-se templates show prd
```

---

## `config` — Manage Configuration

```bash
ai-se config <subcommand> [options]
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `show` | Show current configuration |
| `set <key> <value>` | Set a configuration value |

### Examples

```bash
ai-se config show
ai-se config set model claude-3-5-sonnet
ai-se config set temperature 0.3
```

---

## Quick Reference Table

| Command | Description |
|---------|-------------|
| `init` | Create a new project |
| `run` | Execute the 10-phase workflow |
| `status` | Check project state |
| `resume` | Resume interrupted workflow |
| `stop` | Stop a running project |
| `validate` | Run validation pipeline |
| `doctor` | Check system health |
| `skills list` | List all skills |
| `skills show` | Show skill details |
| `templates list` | List all templates |
| `templates show` | Show template content |
| `config show` | Show configuration |
| `config set` | Set configuration value |

---

## Next Steps

- [Quick Start Guide](quickstart.md) — Run your first project
- [Workflow Phases](workflow-phases.md) — Understand the 10-phase pipeline
- [Skill Executors](skill-executors.md) — Connect AI providers
