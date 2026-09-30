# Validation Rule Catalog (v2)

Stable rule IDs with one-line descriptions. Skills reference these IDs in
their `validate` list instead of repeating full rule text. Deduped across
all 24 v1 skill definitions.

## API and contracts

- R-API-COVERAGE: Every endpoint in the OpenAPI spec has a working implementation.
- R-API-CONTRACT: Contract tests pass against the OpenAPI 3.1 spec for all endpoints.
- R-API-VALID: API contracts are valid OpenAPI 3.1.

## Tests

- R-TEST-80: Unit coverage reaches at least 80 percent of lines and 90 percent of branches, with all tests passing.
- R-TEST-INTEG: Integration tests exist for every API endpoint and all pass.
- R-TEST-E2E: End to end tests cover every critical user journey and all pass.
- R-TEST-PERF: Performance tests meet the defined latency and throughput budgets.
- R-TEST-NOFLAKE: Test flakiness stays under 1 percent across repeated runs.

## Security

- R-SEC-SAST: Static analysis reports zero critical or high findings.
- R-SEC-SCA: Dependency scanning reports zero critical or high CVEs.
- R-SEC-SECRETS: Secret scanning is clean and no credentials live in the repo.
- R-SEC-HEADERS: Security response headers are implemented.
- R-SEC-STRIDE: The threat model covers every STRIDE category.
- R-SEC-LEAST: IAM policies grant only the permissions each role needs.
- R-SEC-COMPLIANCE: Compliance evidence maps to each claimed control.

## Code quality

- R-CODE-TYPES: Strict type checking passes with zero errors.
- R-CODE-LINT: Linting passes with zero errors.
- R-CODE-OBSV: Logs, metrics, and traces are wired for every service.
- R-CODE-REGRESS: No regressions are introduced; the full suite passes after every change.

## Data

- R-DB-PK: Every table has a primary key.
- R-DB-INDEX: Every foreign key has an index.
- R-DB-RLS: Row level security with policies is enabled on all tables.
- R-DB-MIGRATE: Migrations are reversible and seeds are idempotent.
- R-DB-DICT: The data dictionary documents every column.

## Documentation

- R-DOC-API: API documentation covers every endpoint in the OpenAPI spec.
- R-DOC-RUNBOOK: Each runbook states symptoms, diagnosis, and resolution steps.
- R-DOC-C4: Architecture docs include C4 diagrams in valid Mermaid syntax.
- R-DOC-ONBOARD: Onboarding covers setup, build, test, and deploy.
- R-DOC-TUTORIAL: User guides include at least three worked tutorials.
- R-DOC-ACCESS: All documentation meets WCAG AA accessibility.

## UX and UI

- R-UX-CONTRAST: Text contrast meets WCAG AA on all screens.
- R-UX-STATES: Every component is specified for all of its states.
- R-UX-FLOW: Every user story has a matching user flow and wireframes cover all MVP screens.
- R-UX-MEASURE: Usability criteria are stated in measurable terms.
- R-UX-TOKENS: Design tokens are platform agnostic and cover color, type, and spacing.
- R-UX-RESPONSIVE: Responsive specs define at least four breakpoints.

## Infrastructure and delivery

- R-INFRA-TERRA: Terraform fmt, validate, and plan all pass.
- R-INFRA-TAGS: Every resource carries the required tags.
- R-INFRA-HA: Stateful services run across multiple availability zones.
- R-INFRA-ENCRYPT: Encryption is enabled on all storage.
- R-INFRA-COST: The cost estimate stays within the approved budget.
- R-INFRA-CI: CI runs lint, typecheck, tests, and a security scan.
- R-INFRA-GATE: Production deploys require an approval gate.
- R-INFRA-ROLLBACK: Rollback is automated and has been tested.
- R-INFRA-SCAN: Container images are scanned before deploy.
- R-INFRA-PREVIEW: Every pull request gets a preview environment.

## AI specific

- R-AI-EVAL: RAG pipelines ship with evaluation benchmarks that run in CI.
- R-AI-PROMPTS: All prompts are versioned and tested.
- R-AI-GUARD: Guardrails block PII leaks, prompt injection, and hallucinations.
- R-AI-COST: Cost monitoring with alerts covers model usage.
- R-AI-LATENCY: Latency budgets are defined and monitored.

## Process and planning

- R-PROC-VISION: The vision statement is present and under 500 characters.
- R-PROC-REQ: Requirements use MoSCoW priorities and every functional requirement maps to a user story.
- R-PROC-GHERKIN: Acceptance criteria are written in Gherkin format.
- R-PROC-INVEST: User stories follow the INVEST criteria.
- R-PROC-ADR: Every major architecture decision is recorded in an ADR.
- R-PROC-GRAPH: The skill graph is acyclic with a valid topological execution order.
- R-PROC-ROSTER: Every output artifact has a producer skill and all required skills are present.
- R-PROC-DELIVER: The delivery package includes buildable source, tests, a deployment guide, and handover notes.
- R-PROC-APPROVAL: Approval decisions are APPROVE, REQUEST_CHANGES, or REJECT, with specific feedback when changes are requested.
- R-PROC-STOP: Optimization stops after two iterations with under 5 percent improvement on all targets.

## Additional rules (from skill definitions)

- R-A11Y: zero axe-core violations [BLOCKER]
- R-A11Y-REQ: references WCAG 2.1 AA [BLOCKER]
- R-ADR: ADR per decision [BLOCKER]
- R-APPROVAL: decision is APPROVE, REQUEST_CHANGES, or REJECT [BLOCKER]
- R-ARTIFACT-PRODUCER: every artifact has a producer [BLOCKER]
- R-AUDIENCE: at least one segment identified [BLOCKER]
- R-AUTOFIX-ADDRESSED: all auto-fixable findings addressed [HIGH]
- R-BREAKPOINTS: 4+ breakpoints [MEDIUM]
- R-BUILDABLE: source builds [BLOCKER]
- R-BUNDLE: under 100KB gzipped [HIGH]
- R-C4: includes C4 diagrams [HIGH]
- R-C4-MERMAID: valid Mermaid [MEDIUM]
- R-CATEGORIES: all categories evaluated [HIGH]
- R-CD-GATE: production approval gate [BLOCKER]
- R-CI-CHECK: CI runs lint, typecheck, test, scan [BLOCKER]
- R-COMPLIANCE: evidence maps to controls [HIGH]
- R-CONSTRAINTS-CAT: constraints categorized [MEDIUM]
- R-CONTRACT-100: contract tests vs OpenAPI [HIGH]
- R-CONTRAST: contrast meets WCAG AA [BLOCKER]
- R-COST: cost estimate within budget [MEDIUM]
- R-COST-ALERT: cost monitoring with alerts [HIGH]
- R-DATA-MODEL: indexes, relationships [HIGH]
- R-DEPLOY-GUIDE: guide complete [HIGH]
- R-DICT: data dictionary covers all columns [HIGH]
- R-DIMENSIONS: each dimension reviewed [HIGH]
- R-DOCS-A11Y: WCAG AA [HIGH]
- R-DOCS-API: covers all endpoints [BLOCKER]
- R-DS-TOKENS: color, typography, spacing [BLOCKER]
- R-E2E-CRIT: critical journeys covered [HIGH]
- R-ENCRYPT: encryption on all storage [BLOCKER]
- R-ESCALATE: non-auto-fixable findings escalated [HIGH]
- R-EVAL-CI: evaluation runs in CI/CD [HIGH]
- R-FEEDBACK: REQUEST_CHANGES includes specific feedback [BLOCKER]
- R-FINDING-QUALITY: findings have location and fix suggestion [HIGH]
- R-FK-INDEX: foreign keys have indexes [HIGH]
- R-FLAKY: flakiness < 1% [HIGH]
- R-FLOWS: every story has a user flow [BLOCKER]
- R-GHERKIN: Gherkin format [BLOCKER]
- R-GOAL: at least one goal with metric and timeline [BLOCKER]
- R-GRAPH-ACYCLIC: graph acyclic [BLOCKER]
- R-GTM-3: at least 3 channels [MEDIUM]
- R-GUARDRAILS: guardrails cover PII, injection, hallucination [BLOCKER]
- R-HANDOVER: 5 required topics [HIGH]
- R-IA-VALID: validated navigation [HIGH]
- R-IAM: IAM follows least privilege [BLOCKER]
- R-IMG-SCAN: images scanned [HIGH]
- R-INFRA-REGION: provider, regions [HIGH]
- R-INT-100: integration tests 100% pass [BLOCKER]
- R-INT-ALL: integration tests for all endpoints [HIGH]
- R-INVEST: all stories INVEST [HIGH]
- R-KPI: leading and lagging indicators [HIGH]
- R-LATENCY-BUDGET: latency budgets set and monitored [HIGH]
- R-LINT: ESLint zero errors [BLOCKER]
- R-MARK-AUTOFIX: auto-fixable findings marked [MEDIUM]
- R-MIGRATION: migrations reversible [HIGH]
- R-MOCKUPS-ALL: mockups cover all screens [HIGH]
- R-MULTI-AZ: multi-AZ for stateful services [HIGH]
- R-MVP: exit criteria defined [HIGH]
- R-NFR-MEASURABLE: 2+ NFRs with measurable criteria [HIGH]
- R-NO-BLOCKERS: zero BLOCKER findings allowed [BLOCKER]
- R-NO-CROSS-DEP: no cross-dependencies in parallel groups [HIGH]
- R-NO-HIGH-SEC: zero HIGH security findings [BLOCKER]
- R-NO-REGRESSION: no regressions, all tests pass [BLOCKER]
- R-NO-SECRETS-REPO: no secrets in repo [BLOCKER]
- R-OBS: logs, metrics, traces configured [HIGH]
- R-OFFLINE: offline for critical flows [HIGH]
- R-ONBOARDING: covers setup, build, test, deploy [HIGH]
- R-PACKAGE-DIRS: all dirs present [BLOCKER]
- R-PERF-BUDGET: meets budgets [HIGH]
- R-PERSONA: goals, pain points [MEDIUM]
- R-PK: all tables have primary key [BLOCKER]
- R-POSITIONING: standard format [BLOCKER]
- R-PRD-SECTIONS: all sections [BLOCKER]
- R-PREVIEW-ENVS: preview envs for all PRs [MEDIUM]
- R-PRICING: model and tiers defined [HIGH]
- R-PROMPTS: prompts versioned and tested [HIGH]
- R-PUSH: push notifications configured [MEDIUM]
- R-RAG-EVAL: RAG has evaluation benchmarks [BLOCKER]
- R-REJECT-ISSUES: REJECT identifies fundamental issues [BLOCKER]
- R-REQ-MOSCOW: 3+ functional requirements with MoSCoW priority [HIGH]
- R-REQUIRE-APPROVAL: approval required before optimizing [BLOCKER]
- R-RISK-MITIGATION: all risks have mitigations [HIGH]
- R-RLS: RLS enabled on all tables with policies [BLOCKER]
- R-ROADMAP-3: at least 3 phases [HIGH]
- R-ROLLBACK: rollback automated and tested [HIGH]
- R-RUNBOOK-SDR: symptom, diagnosis, resolution [HIGH]
- R-SAST: SAST zero critical/high [BLOCKER]
- R-SB-STORIES: stories for all components [MEDIUM]
- R-SCA: SCA zero critical/high CVEs [BLOCKER]
- R-SCREENS: all mockup screens implemented [HIGH]
- R-SEC-MODEL: auth, authz, encryption [BLOCKER]
- R-SEC-STAGES: security zero critical/high [BLOCKER]
- R-SECRETS-CLEAN: secrets scan clean [BLOCKER]
- R-SEEDS: seeds idempotent [MEDIUM]
- R-SKILL-COVERAGE: all required skills present [BLOCKER]
- R-STATES: specs for all component states [HIGH]
- R-STATIC: static analysis zero errors, under 10 warnings [BLOCKER]
- R-STOP: stop when <5% improvement on all targets for 2 iterations [HIGH]
- R-STORE-BUILD: app store build passes [BLOCKER]
- R-STORY-TRACE: each req maps to >=1 story [BLOCKER]
- R-STRIDE: all STRIDE categories [BLOCKER]
- R-SUCCESS-MEASURABLE: criteria have measurement method [HIGH]
- R-TAGS: all resources tagged [HIGH]
- R-TAM: includes TAM/SAM/SOM [HIGH]
- R-TEST-TYPES: all test types included [HIGH]
- R-TF-VALID: Terraform passes fmt, validate, plan [BLOCKER]
- R-TOKENS-PLATFORM: tokens platform-agnostic [HIGH]
- R-TOPO: execution order topologically valid [BLOCKER]
- R-TRACK-IMPROVEMENT: track improvement per target per iteration [HIGH]
- R-TUTORIALS-3: at least 3 tutorials [MEDIUM]
- R-TYPES: strict type checking passes [BLOCKER]
- R-USABILITY-MEASURABLE: criteria measurable [HIGH]
- R-VISION: vision non-empty, under 500 chars [BLOCKER]
- R-WIREFRAMES-MVP: wireframes cover MVP screens [HIGH]

## Desktop

- R-SIGNED: Binaries are code-signed for both macOS and Windows.
- R-INSTALLER: Installer builds and installs clean on macOS and Windows.
- R-AUTOUPDATE: Auto-update feed verified end to end.
