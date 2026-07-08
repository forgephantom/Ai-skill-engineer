# AI Skill Engineer — Complete Specification

> **Version:** 1.0.0  
> **Status:** Reference Implementation Specification  
> **Classification:** Autonomous Engineering Framework

---

## 1. Overview

### 1.1 Purpose
AI Skill Engineer (AISE) is a specification for an autonomous software engineering organization that transforms a single natural-language idea into a complete, production-ready application through a defined 10-phase process.

### 1.2 Scope
This specification defines:
- The **10-phase autonomous workflow**
- **Skill definitions** for 12+ expert roles
- **Artifact contracts** (inputs/outputs/validation) per skill
- **Quality gates** and validation criteria
- **Governance** for human approval and feedback loops
- **Extensibility** mechanisms for new skills and domains

### 1.3 Non-Goals
- Interactive chatbot behavior
- Partial deliveries or prototypes
- Human-driven technical decision making
- One-off code generation without full lifecycle

---

## 2. Core Architecture

### 2.1 System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                              │
│  State Machine │ Phase Controller │ Dependency Resolver     │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ SKILL REGISTRY │  │ EXECUTION     │  │ ARTIFACT STORE│
│ - Discovery    │  │ ENGINE        │  │ - Versioned   │
│ - Generation   │  │ - Parallel    │  │ - Immutable   │
│ - Versioning   │  │ - Isolated    │  │ - Queryable   │
└───────────────┘  └───────────────┘  └───────────────┘
        ▲                  ▲                  ▲
        │                  │                  │
┌───────┴───────┐  ┌───────┴───────┐  ┌───────┴───────┐
│ VALIDATION    │  │ HUMAN GATE    │  │ OPTIMIZATION  │
│ PIPELINE      │  │ INTERFACE     │  │ ENGINE        │
│ - Static      │  │ - Approval    │  │ - Perf        │
│ - Security    │  │ - Feedback    │  │ - Cost        │
│ - Perf        │  │ - Override    │  │ - Reliability │
└───────────────┘  └───────────────┘  └───────────────┘
```

### 2.2 Data Flow

```
IDEA (natural language)
    │
    ▼
[1] UNDERSTAND → Vision, Goals, Requirements, Risks, Constraints
    │
    ▼
[2] PLAN → PRD, Stories, Acceptance Criteria, Tech Spec, Roadmap
    │
    ▼
[3] DISCOVER SKILLS → Skill Graph (DAG), Dependencies, Parallel Groups
    │
    ▼
[4] BUILD (parallel per skill) → Architecture, Code, Infra, Tests, Docs
    │
    ▼
[5] REVIEW → Findings (bugs, arch, security, perf, a11y, maintainability)
    │
    ▼
[6] FIX → Auto-remediate → Re-review (loop until clean)
    │
    ▼
[7] VALIDATE → Static, Type, Lint, Unit, Integration, E2E, Security, Perf
    │
    ▼
[8] HUMAN APPROVAL → Principal Engineer simulation → Approve/Request Changes
    │
    ▼
[9] OPTIMIZE → Perf, Security, Scale, DX, UX, Cost, Reliability (loop)
    │
    ▼
[10] DELIVER → Complete Project Package
```

---

## 3. Phase Specifications

### Phase 1: Understand

**Objective:** Extract complete problem space from natural language input.

**Inputs:**
- `idea: string` — Raw human description

**Outputs:**
```json
{
  "vision": "string",
  "targetAudience": "string[]",
  "businessGoals": "BusinessGoal[]",
  "functionalRequirements": "FunctionalRequirement[]",
  "nonFunctionalRequirements": "NonFunctionalRequirement[]",
  "constraints": "Constraint[]",
  "risks": "Risk[]",
  "opportunities": "Opportunity[]",
  "successCriteria": "SuccessCriterion[]"
}
```

**Validation Rules:**
- Every functional requirement maps to ≥1 user story (Phase 2)
- Every non-functional requirement has measurable criteria
- Risks have mitigation strategies identified
- Constraints are categorized: technical, business, regulatory, resource

**Skill:** `BusinessAnalyst` + `ProductStrategist`

---

### Phase 2: Plan

**Objective:** Produce complete planning artifacts.

**Inputs:** Phase 1 outputs

**Outputs:**
| Artifact | Format | Description |
|----------|--------|-------------|
| PRD | Markdown | Product Requirements Document |
| User Stories | Markdown/JSON | INVEST-format stories with acceptance criteria |
| Acceptance Criteria | Gherkin/JSON | Executable specifications |
| Technical Specification | Markdown | Architecture decisions, APIs, data models, infra |
| Milestones | JSON | Dated deliverables with dependencies |
| Roadmap | JSON | Phase-gated timeline with resources |

**Validation Rules:**
- PRD covers: problem, solution, users, metrics, scope, out-of-scope
- Stories follow INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable
- Acceptance criteria are executable (Given/When/Then)
- Tech spec includes: ADRs, API contracts, data models, infra diagram, security model
- Milestones have clear exit criteria

**Skill:** `ProductManager` + `SolutionArchitect` + `TechnicalWriter`

---

### Phase 3: Discover Skills

**Objective:** Determine complete expert roster and execution graph.

**Inputs:** Phase 2 outputs

**Outputs:**
```json
{
  "skills": "SkillDefinition[]",
  "dependencyGraph": "DAG<SkillId, SkillId[]>",
  "parallelGroups": "SkillId[][]",
  "executionOrder": "SkillId[]",
  "estimatedDuration": "Duration",
  "requiredTemplates": "string[]"
}
```

**SkillDefinition:**
```json
{
  "id": "string",
  "name": "string",
  "mission": "string",
  "responsibilities": "string[]",
  "knowledgeAreas": "string[]",
  "inputs": "ArtifactContract[]",
  "outputs": "ArtifactContract[]",
  "dependencies": "SkillId[]",
  "bestPractices": "string[]",
  "validationRules": "ValidationRule[]",
  "tools": "string[]",
  "successMetrics": "Metric[]",
  "templates": "string[]"
}
```

**Standard Skill Set (auto-selected based on project type):**

| Skill | Trigger Conditions |
|-------|-------------------|
| ProductManager | Always |
| SolutionArchitect | Always |
| UXDesigner | Has user-facing UI |
| UIDesigner | Has user-facing UI |
| FrontendEngineer | Has web/mobile frontend |
| BackendEngineer | Has server-side logic |
| MobileEngineer | Has native mobile |
| AIEngineer | Has ML/LLM/RAG/agents |
| DatabaseEngineer | Has persistent data |
| CloudEngineer | Needs cloud infrastructure |
| DevOpsEngineer | Needs CI/CD/deployment |
| SecurityEngineer | Always (baseline) |
| QAEngineer | Always |
| PerformanceEngineer | High-scale or latency-sensitive |
| ComplianceEngineer | Regulated domain |
| DocumentationEngineer | Always |

**Skill Generation:** If required skill doesn't exist in registry, auto-generate from template with domain-specific customization.

**Validation Rules:**
- Graph is acyclic
- All required skills present
- No circular dependencies
- Parallel groups are truly independent
- Every output artifact has a producer skill

**Skill:** `SkillDiscoveryEngine` (meta-skill)

---

### Phase 4: Build

**Objective:** Execute all skills in dependency order to produce artifacts.

**Execution Model:**
- Skills in same parallel group → execute concurrently
- Each skill runs in isolated workspace
- Artifacts written to Artifact Store with versioning
- Progress streamed to orchestrator

**Per-Skill Execution:**
```
INPUT ARTIFACTS (from dependencies)
    │
    ▼
SKILL EXECUTION (LLM + tools + templates)
    │
    ▼
OUTPUT ARTIFACTS → VALIDATION → ARTIFACT STORE
```

**Artifact Categories:**

| Category | Examples |
|----------|----------|
| Architecture | ADRs, C4 diagrams, sequence diagrams, threat model |
| UI/UX | Wireframes, mockups, design system, component library, prototypes |
| Backend | API specs (OpenAPI), services, domains, events, workers |
| Frontend | Pages, components, hooks, state, routing, tests |
| Database | Schema, migrations, seeds, indexes, RLS policies |
| Auth | Providers, flows, tokens, sessions, MFA, RBAC |
| Payments | Providers, webhooks, idempotency, reconciliation |
| Notifications | Templates, providers, preferences, delivery tracking |
| AI/ML | Models, prompts, pipelines, evaluation, guardrails |
| CI/CD | Pipelines, environments, promotion, rollback |
| Infrastructure | Terraform, Helm, K8s manifests, networking, secrets |
| Monitoring | Dashboards, alerts, SLIs/SLOs, runbooks, traces |
| Documentation | API docs, architecture docs, runbooks, user guides |

**Validation Rules (per skill):**
- Outputs match declared contracts
- No placeholder/TODO implementations
- Code compiles/passes type check
- Tests exist for all public interfaces
- Security review passed
- Documentation complete

---

### Phase 5: Review

**Objective:** Senior-engineer level code review across all dimensions.

**Review Dimensions:**

| Dimension | Checks | Severity Threshold |
|-----------|--------|-------------------|
| Correctness | Logic bugs, edge cases, null handling, race conditions | Zero critical |
| Architecture | Coupling, cohesion, boundaries, patterns, scalability | Zero critical |
| Security | OWASP Top 10, secrets, injection, authz, crypto, deps | Zero high |
| Performance | N+1, unbounded loops, memory leaks, caching, DB indexes | Zero critical |
| Scalability | Horizontal scaling, statelessness, partitioning, backpressure | Zero critical |
| Maintainability | Complexity, duplication, naming, modularity, testability | Zero high |
| Accessibility | WCAG 2.1 AA, semantic HTML, ARIA, contrast, keyboard | Zero critical |
| Reliability | Error handling, retries, timeouts, circuit breakers, observability | Zero high |

**Review Process:**
1. Each dimension reviewed by specialized reviewer agent
2. Findings categorized: `BLOCKER` / `HIGH` / `MEDIUM` / `LOW` / `NIT`
3. Findings include: location, description, impact, fix suggestion, reference
4. Auto-fixable findings → Phase 6
5. Non-auto-fixable → Human gate (Phase 8)

**Skill:** `CodeReviewer` (multi-agent panel)

---

### Phase 6: Fix

**Objective:** Automatically remediate all review findings.

**Process:**
```
FOR each finding IN review_findings:
    IF auto_fixable:
        APPLY FIX
        RE-RUN VALIDATION
        IF passes: MARK RESOLVED
        ELSE: ESCALATE TO HUMAN
    ELSE:
        ESCALATE TO HUMAN
REPEAT until zero BLOCKER/HIGH findings
```

**Auto-Fix Capabilities:**
- Code pattern corrections (lint, style, best practices)
- Security hardening (headers, validation, sanitization)
- Performance optimizations (indexes, caching, query rewrites)
- Accessibility fixes (ARIA, semantics, contrast)
- Test additions (boilerplate, missing coverage)
- Documentation updates (sync with code)

**Non-Auto-Fixable (Human Required):**
- Architecture redesign
- Business logic changes
- UX flow changes
- Technology substitutions
- Scope negotiations

**Validation Rules:**
- No regressions introduced
- All original functionality preserved
- Test suite passes
- No new findings introduced

---

### Phase 7: Validate

**Objective:** Comprehensive quality gate simulation.

**Validation Pipeline:**

| Stage | Tool/Method | Pass Criteria |
|-------|-------------|---------------|
| Static Analysis | ESLint, SonarQube, CodeQL | Zero errors, <10 warnings |
| Type Checking | TypeScript, mypy, go vet | Zero errors |
| Linting | Project-specific rules | Zero errors |
| Unit Tests | Jest, Vitest, pytest, Go test | ≥80% coverage, 100% pass |
| Integration Tests | Testcontainers, LocalStack | 100% pass |
| E2E Tests | Playwright, Cypress | 100% critical paths pass |
| Security Scan | SAST, DAST, SCA, secrets | Zero critical/high |
| Performance Test | k6, Artillery | Meet all budgets |
| Accessibility Test | axe-core, Lighthouse | WCAG 2.1 AA |
| Contract Tests | Pact, Schemathesis | 100% pass |
| Chaos Engineering | Litmus, Chaos Mesh | System recovers |

**Failure Handling:**
```
IF any stage FAILS:
    ANALYZE root cause
    IF auto-fixable: Phase 6 → Re-run Phase 7
    ELSE: Human gate (Phase 8)
```

**Skill:** `ValidationEngine` (orchestrates parallel test execution)

---

### Phase 8: Human Approval

**Objective:** Principal Engineer PR review simulation.

**Review Checklist:**

| Category | Questions |
|----------|-----------|
| Architecture | Would I approve this for production? Is it maintainable? |
| Code Quality | Is it readable? Consistent? Well-tested? |
| Security | Are threats mitigated? Secrets managed? Compliance met? |
| Operations | Observable? Debuggable? Recoverable? Scalable? |
| User Experience | Intuitive? Accessible? Performant? Reliable? |
| Team | Can a new engineer onboard? Is knowledge captured? |

**Decision Matrix:**
| Outcome | Action |
|---------|--------|
| APPROVE | Proceed to Phase 9 |
| REQUEST_CHANGES | Specific, actionable feedback → Phase 6 |
| REJECT | Fundamental issues → Phase 2 (re-plan) |

**Simulation Criteria:** The autonomous system simulates this review using a "Principal Engineer" persona with strict standards. Only proceeds if simulated approval = YES.

---

### Phase 9: Optimize

**Objective:** Continuous improvement until diminishing returns.

**Optimization Targets:**

| Target | Metrics | Techniques |
|--------|---------|------------|
| Performance | Latency, throughput, p99, resource utilization | Profiling, caching, query optimization, CDN, pooling |
| Security | Attack surface, vuln density, compliance score | Hardening, rotation, least privilege, encryption |
| Scalability | Max concurrent users, scaling latency, cost/user | Stateless design, partitioning, async, sharding |
| Developer Experience | Build time, test time, deploy time, onboarding | Caching, parallelization, tooling, documentation |
| User Experience | Core Web Vitals, TTI, error rate, satisfaction | Bundle optimization, prefetching, progressive enhancement |
| Cost | $/request, $/user, infrastructure efficiency | Right-sizing, spot instances, serverless, tiering |
| Reliability | MTBF, MTTR, SLO compliance, error budget | Circuit breakers, retries, chaos engineering, runbooks |

**Process:**
```
LOOP:
    MEASURE all targets
    IDENTIFY top 3 improvement opportunities
    APPLY optimizations
    RE-RUN Phase 7 validation
    IF improvement < 5% on all targets: BREAK
```

**Stopping Criteria:**
- No improvement >5% on any target in 2 consecutive iterations
- All targets meet/exceed benchmarks
- Budget/time constraints reached

---

### Phase 10: Deliver

**Objective:** Package complete project for handoff.

**Delivery Package:**

```
project-delivery/
├── EXECUTIVE_SUMMARY.md
├── PRODUCT_OVERVIEW.md
├── ARCHITECTURE/
│   ├── DECISIONS/ (ADRs)
│   ├── DIAGRAMS/ (C4, sequence, deployment)
│   ├── THREAT_MODEL.md
│   └── DATA_FLOW.md
├── FEATURES/
│   ├── USER_STORIES.md
│   ├── ACCEPTANCE_CRITERIA.md
│   └── FEATURE_FLAGS.md
├── TECHNICAL_DECISIONS.md
├── FOLDER_STRUCTURE.md
├── SOURCE_CODE/ (complete, buildable)
├── TESTS/
│   ├── UNIT/
│   ├── INTEGRATION/
│   ├── E2E/
│   ├── CONTRACT/
│   ├── PERFORMANCE/
│   └── SECURITY/
├── DOCUMENTATION/
│   ├── API/ (OpenAPI + guides)
│   ├── ARCHITECTURE/
│   ├── RUNBOOKS/
│   ├── ONBOARDING.md
│   └── TROUBLESHOOTING.md
├── DEPLOYMENT_GUIDE.md
├── INFRASTRUCTURE/ (Terraform, Helm, K8s)
├── CI_CD/ (pipelines, environments)
├── MONITORING/ (dashboards, alerts, SLIs)
├── FUTURE_IMPROVEMENTS.md
└── HANDOVER_NOTES.md
```

**Handover Notes Include:**
- "What I would do next if I had more time"
- "Known technical debt (with tickets)"
- "Scaling triggers and responses"
- "Team onboarding sequence"
- "Critical runbooks"

---

## 4. Skill Definitions

### 4.1 Skill Template

Every skill follows this structure:

```yaml
id: unique-skill-id
name: Human Readable Name
version: "1.0.0"
mission: "One-sentence purpose"
responsibilities:
  - "Specific responsibility 1"
  - "Specific responsibility 2"
knowledge_areas:
  - "Domain knowledge 1"
  - "Domain knowledge 2"
inputs:
  - artifact_id: "artifact-name"
    contract: "schema-or-format"
    required: true
outputs:
  - artifact_id: "artifact-name"
    contract: "schema-or-format"
    description: "What this produces"
dependencies:
  - "skill-id-1"
  - "skill-id-2"
best_practices:
  - "Practice 1"
  - "Practice 2"
validation_rules:
  - rule: "rule-description"
    severity: "BLOCKER|HIGH|MEDIUM|LOW"
    auto_fixable: true/false
tools:
  - "tool-1"
  - "tool-2"
success_metrics:
  - metric: "metric-name"
    target: "value"
templates:
  - "template-path-1"
  - "template-path-2"
```

### 4.2 Core Skills (Abbreviated)

#### ProductManager
- **Mission:** Define what to build and why
- **Outputs:** PRD, Roadmap, Success Metrics, Stakeholder Alignment
- **Validation:** PRD completeness, story traceability, metric measurability

#### SolutionArchitect
- **Mission:** Define how to build it at system level
- **Outputs:** Tech Spec, ADRs, API Contracts, Data Models, Infra Design
- **Validation:** ADR completeness, contract consistency, scalability evidence

#### UXDesigner
- **Mission:** Design user journeys and interactions
- **Outputs:** User Flows, Wireframes, Journey Maps, Usability Criteria
- **Validation:** Flow completeness, accessibility, user goal alignment

#### UIDesigner
- **Mission:** Create visual design system and mockups
- **Outputs:** Design System, High-fidelity Mockups, Component Specs, Tokens
- **Validation:** Design system consistency, token coverage, handoff readiness

#### FrontendEngineer
- **Mission:** Build production web/mobile frontend
- **Outputs:** Components, Pages, State, Routing, Tests, Storybook
- **Validation:** Type safety, test coverage, performance budgets, a11y

#### BackendEngineer
- **Mission:** Build production backend services
- **Outputs:** Services, APIs, Domain Models, Events, Workers, Tests
- **Validation:** Contract compliance, test coverage, observability, security

#### AIEngineer
- **Mission:** Build production AI/ML features
- **Outputs:** Models, Prompts, Pipelines, Evaluation, Guardrails, Monitoring
- **Validation:** Evaluation benchmarks, latency budgets, safety, cost

#### DatabaseEngineer
- **Mission:** Design and implement data layer
- **Outputs:** Schema, Migrations, Indexes, RLS, Seeds, Documentation
- **Validation:** Normalization, index coverage, migration safety, performance

#### CloudEngineer
- **Mission:** Design cloud infrastructure
- **Outputs:** Terraform, Networking, Security Groups, IAM, Cost Estimates
- **Validation:** IaC validity, least privilege, multi-AZ, drift detection

#### DevOpsEngineer
- **Mission:** Build CI/CD and deployment automation
- **Outputs:** Pipelines, Environments, Promotion, Rollback, Secrets Management
- **Validation:** Pipeline reliability, deploy time, rollback time, security

#### SecurityEngineer
- **Mission:** Ensure security posture
- **Outputs:** Threat Model, Security Requirements, Hardening, Compliance Evidence
- **Validation:** OWASP coverage, secret scanning, dependency scanning, pen test ready

#### QAEngineer
- **Mission:** Define and execute quality strategy
- **Outputs:** Test Strategy, Test Plans, Automation, Test Data, Reports
- **Validation:** Coverage targets, flakiness <1%, execution time budgets

#### DocumentationEngineer
- **Mission:** Produce complete documentation
- **Outputs:** API Docs, Architecture Docs, Runbooks, User Guides, Onboarding
- **Validation:** Completeness, accuracy, freshness, accessibility

---

## 5. Artifact Contracts

### 5.1 Standard Formats

| Artifact Type | Format | Schema/Standard |
|---------------|--------|-----------------|
| PRD | Markdown | Custom template |
| User Stories | JSON | INVEST + Gherkin AC |
| Tech Spec | Markdown | ADR + OpenAPI + C4 |
| Architecture Diagrams | Mermaid/PlantUML | C4 Model |
| API Spec | YAML | OpenAPI 3.1 |
| Database Schema | SQL | Migration files (golang-migrate) |
| Infrastructure | HCL | Terraform 1.x |
| K8s Manifests | YAML | Helm 3 + Kustomize |
| CI/CD | YAML | GitHub Actions / GitLab CI |
| Tests | Code | Language-native (Jest, pytest, etc.) |
| Documentation | Markdown | Diátaxis framework |

### 5.2 Contract Enforcement

- Every artifact declares its schema/format
- Producers validate before publishing
- Consumers validate on read
- Versioning: SemVer for artifacts
- Breaking changes require new major version + migration

---

## 6. Quality Standards

### 6.1 Code Quality

| Metric | Target | Tool |
|--------|--------|------|
| Cyclomatic Complexity | <10 per function | SonarQube |
| Cognitive Complexity | <15 per function | SonarQube |
| Duplication | <3% | SonarQube |
| Maintainability Index | >80 | SonarQube |
| Type Coverage | 100% | TypeScript/mypy |
| Documentation Coverage | >90% public API | TypeDoc/JSDoc |

### 6.2 Test Quality

| Metric | Target |
|--------|--------|
| Unit Coverage | ≥80% lines, ≥90% branches |
| Integration Coverage | All API endpoints, all DB operations |
| E2E Coverage | All critical user journeys |
| Contract Coverage | 100% provider/consumer pairs |
| Flakiness | <1% |
| Execution Time | Unit <30s, Integration <2m, E2E <10m |

### 6.3 Security Quality

| Check | Standard |
|-------|----------|
| SAST | Zero critical/high (CodeQL, Semgrep) |
| SCA | Zero critical/high CVEs (OSV, GitHub Advisory) |
| Secrets | Zero detected (TruffleHog, GitLeaks) |
| Dependencies | All pinned, license compliant |
| Container | Distroless/minimal, non-root, read-only rootfs |
| Runtime | Falco/Sysdig policies enforced |

### 6.4 Performance Quality

| Budget | Target |
|--------|--------|
| API p99 Latency | <200ms (simple), <500ms (complex) |
| Page Load (LCP) | <2.5s |
| Bundle Size (gzipped) | <100KB initial |
| DB Query p99 | <50ms |
| Cold Start | <1s (serverless) |
| Memory/Request | <50MB |

### 6.5 Accessibility Quality

| Standard | Level |
|----------|-------|
| WCAG | 2.1 AA |
| axe-core | Zero violations |
| Lighthouse Accessibility | 100 |
| Keyboard Navigation | Full support |
| Screen Reader | Tested (NVDA/VoiceOver) |

---

## 7. Governance & Human Interaction

### 7.1 Approval Gates

| Gate | Phase | Trigger | Simulated By |
|------|-------|---------|--------------|
| Plan Approval | 2 | PRD + Tech Spec complete | Principal PM + Architect |
| Architecture Review | 3-4 | Skill graph + key ADRs | Principal Architect |
| Code Review | 5-6 | All artifacts produced | Senior Engineers (panel) |
| Quality Gate | 7 | All validations pass | QA Lead + Security Lead |
| Production Approval | 8 | Simulated approval = YES | Principal Engineer |
| Delivery Acceptance | 10 | Package complete | Stakeholder (simulated) |

### 7.2 Human Override

At any gate, human can:
- **Approve** — Continue autonomous execution
- **Request Changes** — Specific, actionable feedback → loop back
- **Redirect** — Change direction → re-plan from Phase 2
- **Abort** — Stop with reason

### 7.3 Feedback Incorporation

Human feedback → structured input → re-execution of affected phases only (incremental).

---

## 8. Extensibility

### 8.1 Adding New Skills

1. Define skill using template (Section 4.1)
2. Register in Skill Registry
3. Define triggers (project type detection)
4. Provide templates and validation rules
5. Add to standard skill set or domain-specific pack

### 8.2 Domain Packs

Pre-configured skill sets for domains:

| Pack | Skills Included |
|------|-----------------|
| `saas-b2b` | All core + Compliance, Billing, Multi-tenancy |
| `ai-product` | All core + AIEngineer, MLEngineer, DataEngineer, PromptEngineer |
| `fintech` | All core + Compliance, Audit, Ledger, Reconciliation |
| `healthcare` | All core + Compliance (HIPAA), Audit, Consent, FHIR |
| `ecommerce` | All core + Payments, Inventory, Catalog, Search |
| `platform` | All core + API Gateway, Developer Portal, Rate Limiting |

### 8.3 Custom Validation Rules

```yaml
validation_rules:
  - id: "custom-rule-1"
    description: "All API responses must include request-id header"
    check: "response.headers.has('x-request-id')"
    severity: "HIGH"
    auto_fixable: true
    fix: "add_request_id_middleware()"
```

---

## 9. Execution Model Details

### 9.1 Isolation

Each skill execution runs in:
- Dedicated workspace (temp directory)
- Defined tool allowlist
- Resource limits (CPU, memory, time, network)
- Artifact store access (read deps, write outputs)
- No access to other skill workspaces

### 9.2 Parallelization

```
Phase 4 Build:
  Group 1 (parallel): [ProductManager, SolutionArchitect, UXDesigner]
  Group 2 (parallel): [FrontendEngineer, BackendEngineer, DatabaseEngineer] 
                      (after Group 1 outputs available)
  Group 3 (parallel): [AIEngineer, CloudEngineer, DevOpsEngineer]
                      (after Group 2)
  Group 4 (parallel): [SecurityEngineer, QAEngineer, DocumentationEngineer]
                      (after Group 3)
```

### 9.3 State Management

Orchestrator maintains:
- Phase status: `PENDING | RUNNING | COMPLETED | FAILED | BLOCKED`
- Artifact versions and lineage
- Skill execution logs
- Review findings and fix history
- Validation results
- Human decisions

### 9.4 Resumability

- All state persisted after each skill
- Can resume from any phase/skill
- Idempotent skill execution (re-run safe)
- Artifact store provides history

---

## 10. Metrics & Observability

### 10.1 Execution Metrics

| Metric | Description |
|--------|-------------|
| Phase Duration | Time per phase |
| Skill Duration | Time per skill |
| Parallel Efficiency | Actual vs sequential time |
| Fix Loop Count | Review→Fix iterations |
| Validation Pass Rate | First-pass vs retries |
| Human Interventions | Count and type |

### 10.2 Output Quality Metrics

| Metric | Target |
|--------|--------|
| Defect Escape Rate | <0.1% |
| Change Failure Rate | <5% |
| Mean Time to Recovery | <30min |
| Deployment Frequency | On demand |
| Lead Time | <1 day (idea→production) |

---

## 11. Reference Implementation Notes

### 11.1 Technology Choices (for implementation)

| Layer | Recommendation |
|-------|----------------|
| Orchestrator | Temporal / Hatchet / custom state machine |
| Skill Runtime | Isolated containers (gVisor/Firecracker) or WASM |
| Artifact Store | Git + Object Storage (S3/GCS) + SQLite index |
| Validation Pipeline | Dagger / Earthly / custom DAG executor |
| LLM Integration | Multi-model (Claude, GPT-4, local) with routing |
| Human Interface | Web dashboard + CLI + GitHub PR integration |

### 11.2 Prompt Engineering Patterns

- **System Prompts:** Role-specific, include full skill definition
- **Few-Shot:** 3-5 examples per skill output type
- **Chain-of-Thought:** Required for complex reasoning skills
- **Structured Output:** JSON Schema enforcement for all artifacts
- **Self-Correction:** Built-in reflection step before output

### 11.3 Cost Optimization

- Route simple skills to smaller models
- Cache repeated computations
- Parallelize aggressively
- Early validation to catch failures fast
- Human-in-the-loop only at gates

---

## 12. Appendix: Complete Example Flow

### Input
```
"SaaS for automated SOC2 compliance evidence collection"
```

### Phase 1 Output (abridged)
```json
{
  "vision": "Continuous compliance platform that auto-collects SOC2 evidence from cloud infra, code, and processes",
  "targetAudience": ["Security teams at B2B SaaS companies (50-5000 employees)"],
  "businessGoals": [
    {"metric": "ARR", "target": "$1M", "timeline": "18 months"},
    {"metric": "Customers", "target": "50", "timeline": "12 months"}
  ],
  "functionalRequirements": [
    "Connect to AWS/GCP/Azure/K8s/GitHub/GitLab/Jira/Slack",
    "Map controls to evidence collection for all 64 SOC2 criteria",
    "Continuous monitoring with drift detection",
    "Auditor-ready report generation",
    "Team collaboration workflows"
  ],
  "nonFunctionalRequirements": [
    {"requirement": "Data sovereignty", "criteria": "EU/US region selection"},
    {"requirement": "Collection latency", "criteria": "<5min for new evidence"},
    {"requirement": "Availability", "criteria": "99.9%"}
  ]
}
```

### Phase 3 Skill Graph (partial)
```
ProductManager → SolutionArchitect → [UXDesigner, UIDesigner]
                                    → [FrontendEngineer, BackendEngineer, DatabaseEngineer, AIEngineer]
                                                                    → [CloudEngineer, DevOpsEngineer]
                                                                                  → [SecurityEngineer, QAEngineer, DocumentationEngineer]
```

### Phase 10 Delivery
Complete production-ready repository with:
- Next.js + tRPC + Prisma + PostgreSQL + Redis + BullMQ
- Terraform for AWS (ECS Fargate, RDS, ElastiCache, S3, CloudFront)
- GitHub Actions CI/CD with preview environments
- Datadog monitoring, PagerDuty alerting
- 87% test coverage, 0 critical vulnerabilities
- SOC2-ready documentation and runbooks
- 3-month improvement roadmap

---

## 13. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-07-06 | Initial specification |

---

*This specification is the authoritative reference for AI Skill Engineer implementations. All autonomous engineering systems claiming AISE compliance must satisfy every requirement herein.*