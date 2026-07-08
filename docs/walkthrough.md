# Use Case Walkthrough

## End-to-End Example: "Build a Freelancer Marketplace"

This walkthrough demonstrates a complete run from idea to delivery using a real-world scenario.

---

### Step 1: Initialize the Project

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

### Step 2: Inspect the Project State

```bash
ai-se status --project ./output/proj-a1b2c3d4
```

This shows the current phase, completed phases, and registered artifacts:

```
Project: freelancer-marketplace (proj-a1b2c3d4)
Current Phase: understand (pending)
Phases:
  understand:         pending
  plan:               pending
  discover-skills:    pending
  build:              pending
  review:             pending
  fix:                pending
  validate:           pending
  human-approval:     pending
  optimize:           pending
  deliver:            pending
```

---

### Step 3: Run the Autonomous Workflow

```bash
ai-se run --project ./output/proj-a1b2c3d4 --no-human-approval
```

The system executes all 10 phases sequentially. Below is the annotated output for each phase.

---

#### Phase 1: Understand

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
├── non-functional-requirements.json
├── constraints.json
├── risks.json
└── success-criteria.json
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

#### Phase 2: Plan

```
- Phase 2/10: plan...
```

**Skills executed in parallel:** Product Manager, Solution Architect, Technical Writer

| Skill | Input | Output |
|-------|-------|--------|
| Product Manager | Understand output | PRD, user stories, roadmap, milestones |
| Solution Architect | Understand + requirements | Tech spec, ADRs, API contracts, data models |
| Technical Writer | All plan artifacts | Documentation structure |

**Output:**
```
  • User Stories: 47
  • Acceptance Criteria: 142
  • Milestones: 6
  • Roadmap Phases: 4
✔ Phase 2/10: plan completed
```

---

#### Phase 3: Discover Skills

```
- Phase 3/10: discover-skills...
```

**Skill executed:** Skill Discovery Engine

Analyzes the plan output, determines required engineering skills, builds a dependency DAG, and identifies parallel execution groups.

**Output:**
```
  • Skills Discovered: 12
  • Parallel Groups: 4
  • Estimated Duration: 45m
✔ Phase 3/10: discover-skills completed
```

---

#### Phase 4: Build

```
- Phase 4/10: build...
```

**Skills executed in parallel groups** (DAG-based):

| Group | Skills |
|-------|--------|
| 1 | UX Designer, Security Engineer |
| 2 | UI Designer, Database Engineer |
| 3 | Frontend Engineer, Backend Engineer, AI Engineer |
| 4 | Cloud Engineer, DevOps Engineer, QA Engineer |

**Output:**
```
  • Artifacts Created: 156
  • Skills Executed: 12
✔ Phase 4/10: build completed
```

---

#### Phase 5: Review

```
- Phase 5/10: review...
```

**Skill executed:** Code Reviewer — analyzes artifacts for correctness, architecture, security, performance, scalability, and maintainability.

**Output:**
```
  • Findings: 23
  • Blockers: 2
  • High: 7
  • Auto-fixable: 15
✔ Phase 5/10: review completed
```

---

#### Phase 6: Fix

```
- Phase 6/10: fix...
```

**Skill executed:** Code Fixer — applies automated fixes to auto-fixable findings. Non-fixable items are escalated.

**Output:**
```
  • Fixed: 15
  • Failed: 0
  • Escalated: 2
✔ Phase 6/10: fix completed
```

---

#### Phase 7: Validate

```
- Phase 7/10: validate...
```

**Skill executed:** Validation Engine — runs type-checking, linting, security scan, performance tests, accessibility checks, and contract tests.

**Output:**
```
  • Stages: 6
  • Passed: 6
  • Failed: 0
✔ Phase 7/10: validate completed
```

---

#### Phase 8: Human Approval

```
- Phase 8/10: human-approval...
```

With `--no-human-approval`, this auto-approves. In manual mode, the Principal Engineer Simulator presents a PR-style review for sign-off.

**Output:**
```
  • Decision: APPROVED
  • Reviewer: auto-approved
✔ Phase 8/10: human-approval completed
```

---

#### Phase 9: Optimize

```
- Phase 9/10: optimize...
```

**Skill executed:** Optimization Engine (3 iterations) — applies performance, security, scalability, cost, and DX improvements.

**Output:**
```
  • Iterations: 3
  • Total Improvement: 23.0%
✔ Phase 9/10: optimize completed
```

---

#### Phase 10: Deliver

```
- Phase 10/10: deliver...
```

**Skill executed:** Delivery Engineer — assembles all artifacts into a comprehensive delivery package with architecture docs, source code, tests, deployment guides, monitoring dashboards, and runbooks.

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

### Step 4: Inspect the Delivery Package

```bash
ls -la ./output/proj-a1b2c3d4/delivery/
tree ./output/proj-a1b2c3d4/delivery/
```

---

### Step 5: Resume an Interrupted Workflow

If the process is interrupted (e.g., Ctrl+C), the state is persisted. Resume from the last completed phase:

```bash
ai-se resume --project ./output/proj-a1b2c3d4
```

---

### Additional Examples

#### Running Multiple Projects

```bash
ai-se init "B2B SaaS for automated compliance reporting" -n compliance-saas -o ./projects
ai-se init "Fitness tracking app with AI coaching" -n fitness-app -o ./projects
ai-se run --project ./projects/proj-xxx1 --no-human-approval
ai-se run --project ./projects/proj-xxx2 --no-human-approval
```

#### Using Validation Gates in CI

```bash
ai-se validate --project ./output/proj-a1b2c3d4
```

#### Interactive Initialization

```bash
ai-se init
```
<!-- WALKTHROUGH -->