# AI Skill Engineer

> **Transform a single human idea into a complete, production-ready application — autonomously.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-20%2B-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-126%20passing-brightgreen)](.)
[![Coverage](https://img.shields.io/badge/Coverage-56%25-yellow)](.)

---

## Overview

AI Skill Engineer is a **TypeScript-based autonomous engineering framework** that orchestrates a team of simulated expert roles — product managers, architects, engineers, QA, and DevOps — to convert a natural-language description into a fully realized project. It runs as a CLI tool, manages state across 10 sequential phases, persists artifacts, and produces a complete delivery package.

Unlike code assistants that generate snippets, AI Skill Engineer runs a **multi-skill, multi-phase workflow** with dependency-aware execution, artifact versioning, validation gates, and human-approval checkpoints.

---

## Features

- **10-Phase Autonomous Workflow** — From understanding to delivery, each phase feeds the next
- **24 Built-in Skill Definitions** — Product strategist, solution architect, frontend/backend/mobile engineers, AI engineer, security engineer, QA engineer, and more
- **DAG-Based Execution** — Skills execute in parallel groups respecting dependency order
- **Artifact Store** — File-system and in-memory storage for all phase outputs
- **State Persistence** — Resume interrupted projects from the last completed phase
- **CLI Interface** — `init`, `run`, `status`, `resume`, `stop`, `validate`, `doctor` commands
- **Custom Skill Loading** — Load skill definitions from YAML files with dynamic executor imports
- **Validation Pipeline** — Type-checking, linting, security scanning, performance testing, accessibility checks
- **Human Approval Gate** — Optional review checkpoint before optimization and delivery
- **Delivery Packaging** — Complete project output with architecture, code, tests, docs, and deploy guide

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       CLI (Commander)                     │
│   init │ run │ status │ resume │ stop │ validate │ doctor │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│                    Orchestrator                           │
│  Phase Management │ State │ Event Emitter │ Retry Logic   │
│  10-phase sequential workflow with parallel skill groups  │
└──────┬───────────────────────────────────┬───────────────┘
       │                                   │
┌──────▼──────────┐             ┌──────────▼──────────────┐
│   Skill Registry │             │   Execution Engine       │
│  24 built-in     │             │  Parallel / DAG / Single │
│  skills          │◄───────────►│  Template Renderer       │
│  YAML parsing    │             │  LLM Executor (stub)    │
│  Dynamic imports │             │  Workspace Management   │
└──────┬──────────┘             └──────────┬──────────────┘
       │                                   │
       └───────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│                    Storage Layer                          │
│   Artifact Store (filesystem / memory)                    │
│   State Store   (filesystem / memory)                    │
│   Per-project isolation │ JSON serialization             │
└──────────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- **Node.js** v20.0.0 or later
- **npm** v9 or later

### Install from source

```bash
git clone https://github.com/forgephantom/Ai-skill-engineer.git
cd ai-skill-engineer
npm install
npm run build
```

### Global CLI (optional)

```bash
npm link
ai-se --help
```

---

## Quick Start

```bash
# Initialize a new project
ai-se init "Build a SaaS platform for automated compliance reporting"

# Run the full 10-phase workflow
ai-se run --project <project-id>

# Run without human approval gates
ai-se run --project <project-id> --no-human-approval

# Check system health
ai-se doctor

# Resume a paused project
ai-se resume --project <project-id>
```

### Output

After completion, the delivery package is available at:

```
./output/<project-id>/
├── project-config.json
├── state.json
└── artifacts/
    └── ...
```

---

## CLI Reference

### `init [idea]`

Initialize a new project.

| Option | Description | Default |
|--------|-------------|---------|
| `-n, --name <name>` | Project name | Auto-generated from idea |
| `-o, --output <path>` | Output directory | `./output` |
| `--no-auto-fix` | Disable auto-fix | Enabled |
| `--no-human-approval` | Skip human approval | Required |
| `--max-parallel <n>` | Max parallel skills | `4` |
| `--validation-level <level>` | strict, standard, minimal | `strict` |
| `--optimization-iterations <n>` | Optimization rounds | `3` |

### `run`

Execute the autonomous workflow.

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --project <id>` | Project ID or path | Required |
| `--no-auto-fix` | Disable auto-fix | Enabled |
| `--no-human-approval` | Skip human approval | Required |
| `--max-parallel <n>` | Max parallel skills | `4` |

### `status`

Show current project status.

| Option | Description |
|--------|-------------|
| `-p, --project <id>` | Project ID or path |

### `resume`

Resume a paused or interrupted project.

| Option | Description |
|--------|-------------|
| `-p, --project <id>` | Project ID or path |

### `stop`

Stop a running project.

| Option | Description |
|--------|-------------|
| `-p, --project <id>` | Project ID or path |

### `validate`

Run validation on project artifacts.

| Option | Description |
|--------|-------------|
| `-p, --project <id>` | Project ID or path |

### `doctor`

Check system health, Node.js version, and installed dependencies.

### `skills`

Manage skill definitions.

| Subcommand | Description |
|------------|-------------|
| `list` | List all registered skills |
| `show <id>` | Show skill details |

### `templates`

Manage templates.

| Subcommand | Description |
|------------|-------------|
| `list` | List available templates |
| `show <name>` | Show template content |

### `config`

Manage project configuration.

| Subcommand | Description |
|------------|-------------|
| `show` | Show current config |
| `set <key> <value>` | Set a config value |

---

## The 10-Phase Workflow

| Phase | Name | Skills Executed | Key Outputs |
|-------|------|-----------------|-------------|
| 1 | **Understand** | Business Analyst, Product Strategist | Vision, goals, requirements, risks |
| 2 | **Plan** | Product Manager, Solution Architect, Technical Writer | PRD, user stories, tech spec, roadmap |
| 3 | **Discover Skills** | Skill Discovery Engine | Skill graph with dependency DAG |
| 4 | **Build** | All project skills (parallel groups) | Architecture, code, UI, API, DB, infra |
| 5 | **Review** | Code Reviewer | Review findings, severity breakdown |
| 6 | **Fix** | Code Fixer | Remediated artifacts, regression check |
| 7 | **Validate** | Validation Engine | Static analysis, lint, type-check, test results |
| 8 | **Human Approval** | Principal Engineer Simulator | Approval decision, feedback (auto or manual) |
| 9 | **Optimize** | Optimization Engine | Performance, security, cost, UX improvements |
| 10 | **Deliver** | Delivery Engineer | Complete project package with docs and deploy guide |

---

## Built-in Skills

| Skill ID | Role | Knowledge Areas |
|----------|------|----------------|
| `product-strategist` | Strategy & Vision | product-management, market-analysis |
| `business-analyst` | Requirements & Analysis | requirements-engineering, stakeholder |
| `product-manager` | Product Definition | product-management, agile |
| `solution-architect` | System Architecture | system-architecture, microservices |
| `technical-writer` | Documentation | technical-writing, api-docs |
| `ux-designer` | User Experience | ux-design, user-research |
| `ui-designer` | Visual Design | ui-design, design-systems |
| `frontend-engineer` | Frontend Development | frontend-development, react |
| `backend-engineer` | Backend Development | backend-development, api-design |
| `mobile-engineer` | Mobile Development | mobile-development, react-native |
| `ai-engineer` | AI/ML Engineering | llm-applications, rag, agents |
| `database-engineer` | Database Engineering | database-design, postgresql |
| `cloud-engineer` | Cloud Infrastructure | cloud-infrastructure, terraform |
| `devops-engineer` | DevOps & CI/CD | ci-cd, kubernetes, helm |
| `security-engineer` | Security | security, threat-modeling |
| `qa-engineer` | Quality Assurance | quality-assurance, test-automation |
| `documentation-engineer` | Docs & Runbooks | technical-writing, documentation |
| `code-reviewer` | Code Review | code-review, static-analysis |
| `code-fixer` | Automated Fixes | code-fix, refactoring |
| `validation-engine` | Validation Pipeline | validation, testing |
| `optimization-engine` | Performance Optimization | optimization, profiling |
| `delivery-engineer` | Project Delivery | delivery, packaging |
| `principal-engineer-simulator` | Approval & Oversight | engineering-leadership |
| `skill-discovery-engine` | Skill Graph Builder | skill-engineering, dependency-resolution |

---

## Project Structure

```
ai-skill-engineer/
├── src/
│   ├── cli/                    # Commander-based CLI
│   │   └── index.ts            # All CLI commands
│   ├── orchestrator/
│   │   └── index.ts            # 10-phase workflow orchestration
│   ├── execution/
│   │   └── engine.ts           # Single, parallel, DAG execution
│   ├── skills/
│   │   ├── registry.ts         # Skill loading, registration, discovery
│   │   └── definitions/        # 24 built-in skill YAML definitions
│   │       ├── product-strategist/
│   │       ├── frontend-engineer/
│   │       └── ...
│   ├── storage/
│   │   └── index.ts            # Artifact & state stores (FS/memory)
│   ├── types/
│   │   └── index.ts            # All TypeScript interfaces & types
│   ├── utils/
│   │   └── index.ts            # Logging, IDs, templates, retry, validation
│   └── validation/
│       └── index.ts            # Validation pipeline stages
├── templates/
│   └── (Handlebars templates for project generation)
├── tests/
│   ├── unit/                   # Unit tests (skills, utils, storage, etc.)
│   ├── integration/            # CLI integration tests
│   └── e2e/                    # End-to-end workflow tests
├── dist/                       # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── jest.config.js
└── .eslintrc.json
```

---

## Configuration

### Project Config

Set on `init` or edited via `config set`:

```json
{
  "projectId": "proj-abc123",
  "name": "my-project",
  "maxParallelSkills": 4,
  "validationLevel": "strict",
  "autoFix": true,
  "humanApprovalRequired": true,
  "optimizationIterations": 3,
  "outputPath": "./output"
}
```

### Orchestrator Config

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `maxRetries` | number | 3 | Max retries per phase |
| `phaseTimeout` | number (ms) | 300000 | Phase timeout |
| `parallelExecution` | boolean | true | Enable parallel skill execution |
| `autoFix` | boolean | true | Auto-fix review findings |
| `humanApprovalRequired` | boolean | true | Require human approval |
| `optimizationEnabled` | boolean | true | Enable optimization phase |
| `outputDirectory` | string | `./output` | Output path |
| `logLevel` | enum | `INFO` | DEBUG, INFO, WARN, ERROR |

---

## Skill Definitions

Skills are defined in YAML format with a schema that includes:

```yaml
id: frontend-engineer
name: Frontend Engineer
version: "1.0.0"
mission: "Build responsive, accessible UI with modern frameworks"

responsibilities:
  - "Set up project scaffolding and build tooling"

knowledge_areas:
  - "frontend-development"
  - "react"

inputs:
  - artifact_id: "wireframes"
    contract: "markdown"
    required: true

outputs:
  - artifact_id: "ui-components"
    contract: "filesystem"

dependencies:
  - "solution-architect"
  - "ux-designer"

validation_rules:
  - rule: "All components must have TypeScript types"
    severity: "BLOCKER"
```

Custom executors can be placed as `executor.ts` (or `.js`) alongside a `skill.yaml` and will be dynamically loaded at runtime.

---

## Development

```bash
# Type-check
npm run typecheck

# Lint
npm run lint

# Run tests
npm test                      # All tests
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests
npm run test:e2e              # End-to-end tests

# Build
npm run build

# Run in development mode
npm run dev -- init "My idea"
npm run dev -- run --project <id> --no-human-approval

# Generate coverage report
npm test -- --coverage

# Full validation (lint + typecheck + test)
npm run validate
```

### Architecture Decisions

- **TypeScript** — Full static typing with strict mode
- **Commander.js** — CLI framework with subcommands and options
- **Inquirer.js** — Interactive prompts for init
- **Ora** — Terminal spinners for long-running operations
- **Chalk** — Colored terminal output
- **fs-extra** — File system operations with promises
- **Handlebars** — Template rendering for generated artifacts
- **Zod** — Runtime configuration validation
- **Jest** — Testing (unit, integration, E2E)
- **EventEmitter3** — Event-driven orchestrator communication
- **Glob** — File matching for skill discovery

---

## Testing

The test suite is organized into three layers:

| Layer | Directory | Count | Focus |
|-------|-----------|-------|-------|
| Unit | `tests/unit/` | 113+ tests | Individual modules in isolation |
| Integration | `tests/integration/` | 7 tests | CLI command registration |
| E2E | `tests/e2e/` | 3 tests | Full workflow from init to delivery |

Run the entire suite with `npm test` (coverage generated automatically).

---

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Key areas for contribution:
- **Custom skill executors** — Implement real LLM-powered executors for any of the 24 skills
- **New skill definitions** — Add YAML definitions for additional engineering roles
- **Validation pipeline stages** — Extend the validation engine with new checks (e.g., bundle size, dependency audit)
- **Storage backends** — Add S3, DynamoDB, or PostgreSQL storage adapters
- **UI dashboard** — Build a web interface for workflow visibility and manual approval

---

## License

[MIT](LICENSE) — Build autonomous engineering systems freely.
