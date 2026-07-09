# 10-Phase Workflow

The AI Skill Engineer runs a **10-phase autonomous workflow** that transforms a natural-language idea into a complete, production-ready application.

---

## Overview

```
Idea → Understand → Plan → Discover Skills → Build → Review → Fix → Validate → Approve → Optimize → Deliver
```

Each phase executes a set of skills (simulated expert roles) in parallel. Skills within a phase may depend on each other, forming a **DAG** (Directed Acyclic Graph) that the orchestrator resolves before execution.

---

## Phase 1: Understand

**Purpose:** Analyze the idea and produce structured requirements.

**Skills executed in parallel:**
- **Business Analyst** — Extracts functional requirements, constraints, and risks
- **Product Strategist** — Defines vision statement, business goals, and success criteria

**Input:** Raw project idea text

**Output artifacts:**
```
artifacts/
├── vision.md                    # Product vision statement
├── business-goals.json          # Measurable business objectives
├── functional-requirements.json # Feature requirements with priorities
├── non-functional-requirements.json
├── constraints.json
└── risks.json
```

**Example output:**
```
✔ Phase 1/10: understand completed
  • Vision: A digital marketplace connecting freelance developers with non-technical founders
  • Functional Requirements: 12
  • Non-Functional Requirements: 8
  • Risks Identified: 5
```

---

## Phase 2: Plan

**Purpose:** Transform requirements into detailed plans and specifications.

**Skills executed in parallel:**
- **Product Manager** — Produces PRD, user stories, roadmap, milestones
- **Solution Architect** — Produces technical specification, ADRs, API contracts, data models
- **Technical Writer** — Creates documentation structure

**Input:** Phase 1 (Understand) artifacts

**Output artifacts:**
```
artifacts/
├── prd.md                      # Product Requirements Document
├── user-stories.json           # User stories with acceptance criteria
├── roadmap.json                # Timeline and milestones
├── tech-spec.md                # Technical specification
├── adrs/                       # Architecture Decision Records
├── api-contracts.json          # API contracts
└── data-models.json            # Data models
```

---

## Phase 3: Discover Skills

**Purpose:** Analyze the plan and determine which engineering skills are needed.

**Skills executed:**
- **Skill Discovery Engine** — Single skill that analyzes the plan, builds a skill dependency DAG, and identifies parallel execution groups

**Input:** Phase 2 (Plan) artifacts

**Output:**
```
  • Skills Discovered: 12
  • Parallel Groups: 4
  • Estimated Duration: 45m
```

---

## Phase 4: Build

**Purpose:** Generate all project artifacts — code, infrastructure, UI, database, tests.

**Skills executed in parallel groups (DAG-based):**

| Group | Skills | Purpose |
|-------|--------|---------|
| 1 | UX Designer, Security Engineer | Wireframes, threat model |
| 2 | UI Designer, Database Engineer | UI mockups, DB schema |
| 3 | Frontend Engineer, Backend Engineer, AI Engineer | Application code |
| 4 | Cloud Engineer, DevOps Engineer, QA Engineer | Infra, CI/CD, tests |

**Input:** Phase 3 (Discover Skills) DAG + Phase 2 (Plan) specifications

**Output:**
```
  • Artifacts Created: 156
  • Skills Executed: 12
```

---

## Phase 5: Review

**Purpose:** Analyze all build artifacts for correctness, quality, and security.

**Skills executed:**
- **Code Reviewer** — Reviews code for architecture, security, performance, scalability, and maintainability

**Output:**
```
  • Findings: 23
  • Blockers: 2
  • High: 7
  • Auto-fixable: 15
```

---

## Phase 6: Fix

**Purpose:** Apply automated fixes to issues found during review.

**Skills executed:**
- **Code Fixer** — Applies automated fixes to auto-fixable findings, runs regression checks

**Output:**
```
  • Fixed: 15
  • Failed: 0
  • Escalated: 2
```

Non-fixable items are escalated for human attention.

---

## Phase 7: Validate

**Purpose:** Run the validation pipeline against the generated project.

**Skills executed:**
- **Validation Engine** — Runs multiple validation stages:

| Stage | Description |
|-------|-------------|
| Type Checking | TypeScript `tsc --noEmit` |
| Linting | ESLint analysis |
| Security Scan | Dependency vulnerability check |
| Performance Test | Load and stress tests |
| Accessibility | WCAG compliance checks |
| Contract Tests | API contract validation |

**Output:**
```
  • Stages: 6
  • Passed: 6
  • Failed: 0
```

---

## Phase 8: Human Approval

**Purpose:** Review gate before final delivery.

**Skills executed:**
- **Principal Engineer Simulator** — Presents a PR-style review summary for sign-off

**Two modes:**

| Mode | Behavior |
|------|----------|
| Manual (default) | Presents review summary, waits for approval/rejection/feedback |
| Auto (`--no-human-approval`) | Auto-approves |

**Output:**
```
  • Decision: APPROVED
  • Reviewer: auto-approved
```

---

## Phase 9: Optimize

**Purpose:** Apply iterative improvements across multiple dimensions.

**Skills executed:**
- **Optimization Engine** — Runs configurable iterations (default: 3) targeting:

| Dimension | Focus |
|-----------|-------|
| Performance | Load time, bundle size, query optimization |
| Security | Vulnerability remediation |
| Scalability | Architecture improvements |
| Cost | Resource optimization |
| Developer Experience | Code quality, documentation |

**Output:**
```
  • Iterations: 3
  • Total Improvement: 23.0%
```

---

## Phase 10: Deliver

**Purpose:** Assemble everything into a complete delivery package.

**Skills executed:**
- **Delivery Engineer** — Packages all artifacts into a structured delivery

**Delivery package contents:**
```
delivery/
├── docs/
│   ├── architecture.md          # System architecture
│   ├── api-reference.md         # API documentation
│   └── deployment-guide.md     # Deployment instructions
├── src/                         # Source code
├── tests/                       # Test suite
├── infra/                       # Infrastructure as code
├── monitoring/                  # Monitoring dashboards
├── scripts/
│   ├── setup.sh                # Setup script
│   ├── deploy.sh               # Deployment script
│   └── rollback.sh             # Rollback script
├── runbooks/
│   ├── incident-response.md    # Incident response procedures
│   └── scaling-guide.md        # Scaling instructions
└── README.md                   # Project README
```

**Output:**
```
  • Package: 234 items
  • Size: 12.4 MB
  Delivery package created at: ./output/proj-a1b2c3d4/delivery/
```

---

## State Persistence & Resumption

At the end of each phase, the orchestrator persists state to disk. If the process is interrupted (Ctrl+C, crash), you can resume from the last completed phase:

```bash
ai-se resume --project ./output/proj-a1b2c3d4
```

**What is persisted:**
- Current phase index
- Completed artifacts
- Phase statuses
- Project configuration

---

## Next Steps

- [Quick Start Guide](quickstart.md) — Run through a complete example
- [CLI Reference](cli-reference.md) — All available commands
- [Skill Executors](skill-executors.md) — Connect AI providers
