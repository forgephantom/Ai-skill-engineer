# Skills Index

25 skills. Target platforms: web, android, ios, mac, windows.

| id | purpose |
|---|---|
| ai-engineer | Production AI/ML features: LLMs, RAG, agents, embeddings, guardrails, evaluation |
| backend-engineer | Production backend services: APIs, domain models, events, workers, DB, auth, tests |
| business-analyst | Extract and structure business requirements from natural language input |
| cloud-engineer | Cloud infrastructure: Terraform, networking, IAM, security, cost estimates |
| code-fixer | Remediate auto-fixable review findings; verify no regressions; escalate the rest |
| code-reviewer | Senior-level review: correctness, architecture, security, perf, a11y, reliability |
| database-engineer | Data layer: schema, migrations, indexes, RLS, seeds, docs, backup |
| delivery-engineer | Package the complete project for handoff: code, tests, docs, deploy guide, roadmap |
| desktop-engineer | Production desktop apps for macOS and Windows: installers, signing, auto-update, tests |
| devops-engineer | CI/CD pipelines, deployment automation, environments, rollback, secrets |
| documentation-engineer | Complete docs: API docs, architecture docs, runbooks, user guides, onboarding |
| frontend-engineer | Production web frontend: components, pages, state, routing, tests, a11y |
| mobile-engineer | Production mobile apps: offline support, tests, app store pipelines |
| optimization-engine | Continuous improvement until diminishing returns across all targets |
| principal-engineer-simulator | Simulate Principal Engineer approval: APPROVE, REQUEST_CHANGES, or REJECT |
| product-manager | PRD with INVEST user stories and executable Gherkin acceptance criteria |
| product-strategist | Product strategy: positioning, market analysis, pricing, GTM, roadmap |
| qa-engineer | Quality strategy: test plans, automation, test data, reports |
| security-engineer | Security posture: threat model, requirements, hardening, compliance evidence |
| skill-discovery-engine | Determine the expert roster and execution graph from project requirements |
| solution-architect | System architecture: ADRs, API contracts, data models, infra, security, costs |
| technical-writer | Technical docs: API docs, architecture docs, runbooks, guides |
| ui-designer | Visual design system, mockups, component specs, design tokens |
| ux-designer | User journeys, wireframes, information architecture, usability criteria |
| validation-engine | Quality gate: static analysis, types, lint, unit, integration, E2E, security, perf, a11y |

How to discover the right skill:
1. Match the current workflow phase: analyze (business-analyst, product-strategist, product-manager), design (ux-designer, ui-designer, solution-architect), build (frontend, backend, mobile, desktop, ai, database, cloud, devops), assure (qa, code-reviewer, code-fixer, security, validation), ship (delivery), govern (skill-discovery, principal-engineer-simulator, optimization).
2. Match target platforms: web -> frontend-engineer; android + ios -> mobile-engineer; mac + windows -> desktop-engineer. See PLATFORMS.md for the full matrix.
3. Check the skill's In section: a skill is eligible only when all [required] inputs are available as artifacts from earlier phases.
4. Resolve ties with validation rule IDs: the skill whose Validate rules cover the current quality gate wins.
