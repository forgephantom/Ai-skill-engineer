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

## Use Case Walkthrough

### End-to-End Example: "Build a Freelancer Marketplace"

This walkthrough demonstrates a complete run from idea to delivery using a real-world scenario.

---

#### Step 1: Initialize the Project

```bash
ai-se init "A marketplace connecting freelance developers with non-technical founders" \
  --name freelancer-marketplace \
  --output ./output \
  --no-human-approval
```

**What happens behind the scenes:**
- A unique `projectId` is generated (e.g., `proj-a1b2c3d4`)
- Project configuration is created with default settings
- Output directory structure is created at `./output/proj-a1b2c3d4/`
- The skill registry loads all 24 built-in skill definitions from YAML
- The orchestrator initializes with phase 1 (`understand`) set as current

**Expected output:**
```
✔ Project initialized: freelancer-marketplace (proj-a1b2c3d4)
```

---

#### Step 2: Inspect the Project State

```bash
ai-se status --project ./output/proj-a1b2c3d4
```

This shows the current phase, completed phases, and registered artifacts:

```
Project: freelancer-marketplace (proj-a1b2c3d4)
Current Phase: understand (pending)
Phases:
  understand:   pending
  plan:         pending
  discover-skills: pending
  build:        pending
  review:       pending
  fix:          pending
  validate:     pending
  human-approval: pending
  optimize:     pending
  deliver:      pending
```

---

#### Step 3: Run the Autonomous Workflow

```bash
ai-se run --project ./output/proj-a1b2c3d4 --no-human-approval
```

The system executes all 10 phases sequentially. Below is the annotated output for each phase.

---

##### Phase 1: Understand

```
╔════════════════════════════════════════════════════════════╗
║         AI Skill Engineer - Autonomous Workflow            ║
╚════════════════════════════════════════════════════════════╝

- Phase 1/10: understand...
```

**Skills executed in parallel:** Business Analyst, Product Strategist

| Skill | Input | Output |
|-------|-------|--------|
| Business Analyst | Project idea text | Functional requirements, constraints, risks |
| Product Strategist | Project idea text | Vision statement, business goals, success criteria |

**Artifacts produced:**
```
artifacts/
├── vision.md                    # Product vision statement
├── business-goals.json          # Measurable business objectives
├── functional-requirements.json # Feature requirements with priorities
├── non-functional-requirements.json # Performance, security, scalability specs
├── constraints.json             # Technical, business, regulatory constraints
├── risks.json                   # Identified risks with mitigations
└── success-criteria.json        # Acceptance criteria for measuring success
```

**Output:**
```
  • Vision: A digital marketplace connecting freelance developers with non-technical founders
  • Functional Requirements: 12
  • Non-Functional Requirements: 8
  • Risks Identified: 5
✔ Phase 1/10: understand completed
```

---

##### Phase 2: Plan

```
- Phase 2/10: plan...
```

**Skills executed in parallel:** Product Manager, Solution Architect, Technical Writer

| Skill | Input | Output |
|-------|-------|--------|
| Product Manager | Understand output (requirements, goals) | PRD, user stories, roadmap, milestones |
| Solution Architect | Understand output + requirements | Technical specification, architecture decisions, API contracts, data models |
| Technical Writer | All plan artifacts | Technical documentation structure |

**Artifacts produced:**
```
artifacts/
├── prd.md                        # Product Requirements Document
├── user-stories.json             # 47 user stories with acceptance criteria
├── acceptance-criteria.json      # Detailed acceptance criteria per story
├── technical-specification.json  # Complete tech spec
│   ├── architecture-decisions    # ADRs (e.g., "Use microservices on Kubernetes")
│   ├── api-contracts             # REST/GraphQL API specifications
│   ├── data-models               # PostgreSQL schema, Redis cache strategy
│   ├── infrastructure-design     # GKE cluster, Cloud SQL, VPC layout
│   └── security-model            # OAuth2, RBAC, encryption at rest/in-transit
├── milestones.json               # 12-week delivery roadmap
└── roadmap.json                  # Phased release plan
```

**Output:**
```
  • User Stories: 47
  • Acceptance Criteria: 142
  • Milestones: 6
  • Roadmap Phases: 4
✔ Phase 2/10: plan completed
```

---

##### Phase 3: Discover Skills

```
- Phase 3/10: discover-skills...
```

**Skill executed:** Skill Discovery Engine

This phase analyzes the plan output and determines which engineering skills are required, builds a dependency graph (DAG), and identifies parallel execution groups.

**Logic executed by the skill-discovery-engine:**
1. Parse the technical specification for technology choices
2. Identify required roles (frontend, backend, database, DevOps, etc.)
3. Group skills by dependencies (e.g., database must complete before backend can start)
4. Estimate duration for each skill group
5. Identify missing skills that need to be generated

**Artifacts produced:**
```
artifacts/
├── skill-graph.json               # Complete DAG of required skills
│   ├── skills: ["frontend-engineer", "backend-engineer", ...]
│   ├── dependency-graph: { "frontend-engineer": ["ux-designer"], ... }
│   ├── parallel-groups: [["ux-designer","security-engineer"], ["frontend-engineer","backend-engineer"]]
│   └── execution-order: ["ux-designer", "security-engineer", "frontend-engineer", ...]
├── skill-definitions.json         # Selected skill configurations
├── parallel-groups.json           # Groups that can run concurrently
├── execution-order.json           # Topological execution sequence
├── estimated-duration.json        # Per-skill time estimates
└── required-templates.json        # Templates needed for code generation
```

**Output:**
```
  • Skills Discovered: 12
  • Parallel Groups: 4
  • Estimated Duration: 45m
✔ Phase 3/10: discover-skills completed
```

---

##### Phase 4: Build

```
- Phase 4/10: build...
```

**Skills executed in parallel groups** (DAG-based, respecting dependencies):

| Group | Skills | Description |
|-------|--------|-------------|
| 1 | UX Designer, Security Engineer | Design foundations |
| 2 | UI Designer, Database Engineer | Interface + data layer |
| 3 | Frontend Engineer, Backend Engineer, AI Engineer | Core application |
| 4 | Cloud Engineer, DevOps Engineer, QA Engineer | Infrastructure + quality |

Each skill receives inputs from previous phases and produces its artifacts independently. The execution engine manages the parallel execution with configurable concurrency (default: 4).

**Artifacts produced (per skill):**
```
artifacts/
├── frontend-engineer/
│   ├── ui-components/         # React/Next.js components
│   ├── pages/                 # Route pages
│   ├── hooks/                 # Custom React hooks
│   └── styles/                # Tailwind CSS
├── backend-engineer/
│   ├── api/                   # REST/GraphQL endpoints
│   ├── services/              # Business logic layer
│   ├── middleware/            # Auth, logging, error handling
│   └── tests/                 # Integration tests
├── database-engineer/
│   ├── schema.sql             # PostgreSQL schema
│   ├── migrations/            # Versioned migrations
│   ├── indexes.sql            # Performance indexes
│   └── seeds.sql              # Development seed data
├── devops-engineer/
│   ├── Dockerfile             # Multi-stage container build
│   ├── k8s-deployment.yaml    # Kubernetes manifests
│   └── ci-cd.yaml             # GitHub Actions pipeline
└── ... (other skills)
```

**Output:**
```
  • Artifacts Created: 156
  • Skills Executed: 12
✔ Phase 4/10: build completed
```

---

##### Phase 5: Review

```
- Phase 5/10: review...
```

**Skill executed:** Code Reviewer

The reviewer analyzes all artifacts across multiple dimensions:
- **Correctness** — Logic errors, edge cases, null safety
- **Architecture** — Coupling, cohesion, pattern violations
- **Security** — OWASP Top 10, secrets exposure, input validation
- **Performance** — N+1 queries, memory leaks, bundle size
- **Scalability** — Statelessness, caching strategy, database indexing
- **Maintainability** — Code duplication, naming, documentation

**Artifacts produced:**
```
artifacts/
├── review-findings.json           # All issues found
│   ├── findings: [
│   │   { severity: "BLOCKER", dimension: "security", title: "SQL injection in user search", ... },
│   │   { severity: "HIGH", dimension: "performance", title: "N+1 query on dashboard", ... },
│   │   ...
│   ]
├── review-summary.json            # Aggregated statistics
│   ├── total: 23
│   ├── blockers: 2
│   ├── high: 7
│   ├── medium: 9
│   └── low: 5
└── review-report.md               # Human-readable report
```

**Output:**
```
  • Findings: 23
  • Blockers: 2
  • High: 7
  • Auto-fixable: 15
✔ Phase 5/10: review completed
```

---

##### Phase 6: Fix

```
- Phase 6/10: fix...
```

**Skill executed:** Code Fixer

The fixer applies automated fixes to all auto-fixable findings (15 out of 23). Non-fixable items (blockers that require human judgment) are escalated.

**Artifacts produced:**
```
artifacts/
├── fix-summary.json               # Fix results
│   ├── fixed: 15
│   ├── failed: 0
│   ├── escalated: 2
│   └── regressions: 0
└── fixed-artifacts/               # Updated files
    └── ... (patched source files)
```

**Output:**
```
  • Fixed: 15
  • Failed: 0
  • Escalated: 2
✔ Phase 6/10: fix completed
```

---

##### Phase 7: Validate

```
- Phase 7/10: validate...
```

**Skill executed:** Validation Engine

Runs the complete validation pipeline:

| Stage | Tool | Checks |
|-------|------|--------|
| Type Checking | TypeScript `tsc --noEmit` | Type safety, strict null checks |
| Linting | ESLint | Code style, anti-patterns, unused variables |
| Security Scan | ESLint security plugin | OWASP rules, secrets detection, dependency audit |
| Performance Test | Custom benchmarks | Response times, memory usage, bundle size budgets |
| Accessibility Test | axe-core rules | WCAG 2.1 AA compliance, contrast ratios, ARIA attributes |
| Contract Tests | OpenAPI spec validation | API request/response conformance |

**Artifacts produced:**
```
artifacts/
├── validation-results.json         # Per-stage results
│   ├── stages: [
│   │   { name: "type-checking", passed: true, errors: 0, warnings: 2 },
│   │   { name: "linting", passed: true, errors: 0, warnings: 5 },
│   │   { name: "security-scan", passed: true, errors: 0, warnings: 0 },
│   │   ...
│   ]
├── validation-summary.json         # Overall pass/fail
│   ├── totalStages: 6
│   ├── passedStages: 6
│   └── duration: 12s
└── validation-report.md            # Detailed report
```

**Output:**
```
  • Stages: 6
  • Passed: 6
  • Failed: 0
✔ Phase 7/10: validate completed
```

---

##### Phase 8: Human Approval

```
- Phase 8/10: human-approval...
```

Since we ran with `--no-human-approval`, this phase auto-approves. In manual mode, the Principal Engineer Simulator presents a PR-style review for human sign-off.

**Output:**
```
  • Decision: APPROVED
  • Reviewer: auto-approved
✔ Phase 8/10: human-approval completed
```

---

##### Phase 9: Optimize

```
- Phase 9/10: optimize...
```

**Skill executed:** Optimization Engine (3 iterations)

Each iteration analyzes current artifacts and applies optimizations:

- **Performance** — Bundle splitting, lazy loading, database query optimization, caching headers
- **Security** — Additional input sanitization, rate limiting, CORS hardening
- **Scalability** — Connection pooling, horizontal scaling config, CDN setup
- **Cost** — Cloud resource right-sizing, serverless where appropriate
- **Developer Experience** — Hot reload, debug configurations, improved error messages

**Artifacts produced:**
```
artifacts/
├── optimization-results.json       # Per-iteration results
│   ├── iterations: [
│   │   { iteration: 1, improvements: ["lazy load routes", "add Redis cache"] },
│   │   { iteration: 2, improvements: ["optimize DB queries", "add CDN"] },
│   │   { iteration: 3, improvements: ["right-size k8s resources", "add connection pool"] }
│   ]
└── optimization-summary.json       # Total improvement metrics
    ├── totalImprovement: "23%"
    └── finalArtifacts: [...]       # Optimized artifact references
```

**Output:**
```
  • Iterations: 3
  • Total Improvement: 23.0%
✔ Phase 9/10: optimize completed
```

---

##### Phase 10: Deliver

```
- Phase 10/10: deliver...
```

**Skill executed:** Delivery Engineer

Assembles all artifacts into a comprehensive delivery package:

**Delivery package structure:**
```
delivery/
├── executive-summary.md            # One-page overview
├── product-overview.md             # Vision, goals, target audience
├── architecture/
│   ├── decisions.md                # Architecture Decision Records
│   ├── diagrams.md                 # System architecture, data flow
│   └── threat-model.md             # Security threat model
├── features/
│   ├── user-stories.md             # All implemented stories
│   └── acceptance-criteria.md      # Criteria per feature
├── source-code/
│   ├── structure.md                # Folder structure explanation
│   ├── languages.md                # Tech stack summary
│   └── build-instructions.md       # How to build and run
├── tests/
│   ├── unit-coverage.md            # Unit test report
│   ├── integration-tests.md        # API contract tests
│   └── e2e-scenarios.md            # Critical user journeys
├── deployment/
│   ├── guide.md                    # Step-by-step deploy instructions
│   ├── dockerfile                  # Production container config
│   └── kubernetes-manifests/       # K8s YAML files
├── infrastructure/
│   ├── terraform/                  # IaC modules
│   └── helm-charts/                # Helm package configs
├── monitoring/
│   ├── dashboards.md               # Grafana dashboard configs
│   ├── alerts.md                   # PagerDuty alert rules
│   └── slis.md                     # Service Level Indicators
├── runbooks/
│   ├── deployment.md               # Deploy runbook
│   ├── incident-response.md        # Incident handling procedures
│   └── rollback.md                 # Rollback instructions
└── future-improvements.md          # 3-month improvement roadmap
```

**Output:**
```
  • Package: 234 items
  • Size: 12.4 MB

╔════════════════════════════════════════════════════════════╗
║              WORKFLOW COMPLETED SUCCESSFULLY               ║
╚════════════════════════════════════════════════════════════╝

Delivery package created at:
  ./output/proj-a1b2c3d4/delivery/
```

---

#### Step 4: Inspect the Delivery Package

```bash
ls -la ./output/proj-a1b2c3d4/delivery/
tree ./output/proj-a1b2c3d4/delivery/
```

---

#### Step 5: Resume an Interrupted Workflow

If the process is interrupted (e.g., Ctrl+C), the state is persisted. Resume from the last completed phase:

```bash
ai-se resume --project ./output/proj-a1b2c3d4
```

This restores the orchestrator state, artifact store, and continues execution from where it left off — no data loss.

---

#### Example: Running Multiple Projects

```bash
# Project 1: SaaS platform
ai-se init "B2B SaaS for automated compliance reporting" -n compliance-saas -o ./projects

# Project 2: Mobile app
ai-se init "Fitness tracking app with AI coaching" -n fitness-app -o ./projects

# Run both independently (separate terminals)
ai-se run --project ./projects/proj-xxx1 --no-human-approval
ai-se run --project ./projects/proj-xxx2 --no-human-approval
```

---

#### Example: Using Validation Gates in CI

```bash
# Validate an existing project without re-running the full workflow
ai-se validate --project ./output/proj-a1b2c3d4
```

This runs the validation pipeline (type-checking, linting, security scan, performance tests) against the project's artifacts, useful for CI/CD integration.

---

#### Example: Interactive Initialization

For a guided setup, omit the idea argument:

```bash
ai-se init
```

This launches an interactive prompt:

```
? Describe your project idea: A platform for managing remote team standups
? Project name: (remote-standup-app)
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
