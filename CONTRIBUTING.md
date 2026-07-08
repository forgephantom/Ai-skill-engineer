# Contributing to AI Skill Engineer

Thank you for your interest in contributing! This document outlines the process for contributing to the AI Skill Engineer framework.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Skill Development](#skill-development)
- [Template Contributions](#template-contributions)
- [Testing](#testing)
- [Documentation](#documentation)
- [Review Process](#review-process)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

---

## Getting Started

### Prerequisites

- Git 2.40+
- Node.js 20+ (for tooling)
- Python 3.11+ (for orchestration)
- Go 1.22+ (for CLI)
- Docker 24+ (for container testing)
- Kubernetes CLI (kubectl) 1.28+
- Terraform 1.7+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ai-skill-engineer
cd ai-skill-engineer

# Install development dependencies
make dev-setup

# Run tests to verify setup
make test
```

---

## Development Workflow

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready, protected |
| `develop` | Integration branch for next release |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation updates |
| `skill/*` | New skill development |
| `template/*` | New template development |

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation only
- `style` — Formatting, no logic changes
- `refactor` — Code restructuring
- `perf` — Performance improvement
- `test` — Adding/updating tests
- `chore` — Maintenance, tooling
- `skill` — New skill definition
- `template` — New template

**Examples:**
```
feat(orchestrator): add parallel skill execution
fix(templates): correct dockerfile health check syntax for arm64
skill(ai-engineer): add RAG pipeline skill definition
template(ci-cd): add GitLab CI alternative
```

### Pull Request Process

1. **Create issue** — Discuss the change before implementing
2. **Fork & branch** — Create feature branch from `develop`
3. **Implement** — Write code, add tests, update docs
4. **Self-review** — Run `make lint`, `make test`, `make validate`
5. **Submit PR** — Target `develop` branch
6. **CI passes** — All checks must pass
7. **Review** — Minimum 2 approvals required
8. **Merge** — Squash and merge to `develop`

### PR Requirements

- [ ] Linked to issue
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for user-facing changes)
- [ ] No breaking changes without major version bump
- [ ] All CI checks pass

---

## Skill Development

### Adding a New Skill

Skills are the core building blocks of AI Skill Engineer. Each skill must be complete and self-contained.

#### 1. Skill Structure

```
skills/
└── your-skill-name/
    ├── skill.yaml          # Skill definition (required)
    ├── templates/          # Skill-specific templates
    ├── workflows/          # Skill execution workflows
    ├── validators/         # Custom validation rules
    ├── examples/           # Usage examples
    └── README.md           # Skill documentation
```

#### 2. Skill Definition (skill.yaml)

```yaml
id: unique-skill-id
name: Human Readable Name
version: "1.0.0"
mission: "One-sentence purpose statement"
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

#### 3. Skill Implementation

Each skill must implement:
- **Executor** — Main logic that produces outputs from inputs
- **Validator** — Validates outputs meet contracts
- **Fixer** — Auto-fixes common issues (where possible)
- **Test Suite** — Unit + integration tests

#### 4. Registration

Add skill to registry:
```yaml
# skills/registry.yaml
skills:
  your-skill-name:
    path: "skills/your-skill-name"
    triggers:
      - project_type: "web"
      - project_type: "api"
    version: "1.0.0"
```

---

## Template Contributions

Templates live in `templates/` and are used by skills to generate artifacts.

### Template Guidelines

1. **Use Handlebars syntax** — `{{VARIABLE}}` for variables, `{{#if CONDITION}}` for conditionals
2. **Include all placeholders** — Document every variable in template header
3. **Provide examples** — Include `examples/` with filled templates
4. **Version templates** — SemVer in template filename: `prd-v1.0.0.md`
5. **Test rendering** — Verify with `make template-test TEMPLATE=prd`

### Template Structure

```markdown
# {{TEMPLATE_NAME}}

> **Variables:**
> - `{{VAR_1}}` — Description
> - `{{VAR_2}}` — Description (required)
> - `{{#if CONDITION}}` — Conditional section

---

## Section 1

Content with {{VAR_1}} interpolation.

{{#if CONDITION}}
Conditional content.
{{/if}}
```

---

## Testing

### Test Types

| Type | Location | Command | Coverage Target |
|------|----------|---------|-----------------|
| Unit | `tests/unit/` | `make test-unit` | ≥80% |
| Integration | `tests/integration/` | `make test-integration` | All paths |
| Contract | `tests/contract/` | `make test-contract` | 100% |
| E2E | `tests/e2e/` | `make test-e2e` | Critical flows |
| Template | `tests/templates/` | `make test-templates` | All templates |

### Running Tests

```bash
# All tests
make test

# Specific type
make test-unit
make test-integration
make test-e2e

# With coverage
make test-coverage

# Watch mode
make test-watch
```

### Test Guidelines

- **Unit tests** — Fast, isolated, no external dependencies
- **Integration tests** — Testcontainers for DB, LocalStack for AWS
- **Contract tests** — Pact for API contracts
- **E2E tests** — Playwright for web, custom for CLI
- **Golden files** — For template rendering tests

---

## Documentation

### Documentation Standards

- **Diátaxis framework** — Tutorial, How-to, Reference, Explanation
- **Markdown** — GitHub-flavored
- **Diagrams** — Mermaid.js (rendered in GitHub)
- **Code examples** — Runnable, tested
- **Versioned** — Match code versions

### Documentation Structure

```
docs/
├── getting-started/
├── concepts/
├── skills/
├── templates/
├── workflows/
├── api/
├── architecture/
└── runbooks/
```

---

## Review Process

### Review Criteria

Reviewers check for:

1. **Correctness** — Logic, edge cases, error handling
2. **Architecture** — Patterns, boundaries, scalability
3. **Security** — OWASP, secrets, dependencies, authz
4. **Performance** — Complexity, caching, queries, bundles
5. **Maintainability** — Complexity, naming, modularity, tests
6. **Accessibility** — WCAG 2.1 AA (for UI)
7. **Documentation** — Completeness, accuracy, examples

### Review Levels

| Level | Scope | Reviewers |
|-------|-------|-----------|
| L1 — Quick | Docs, typos, formatting | 1 |
| L2 — Standard | Features, fixes, skills | 2 |
| L3 — Deep | Architecture, security, core | 2 + domain expert |
| L4 — Critical | Breaking changes, releases | 3 + architect + security |

### Automated Checks

All PRs must pass:

- [ ] Lint (ESLint, golangci-lint, ruff, hadolint)
- [ ] Type check (TypeScript, mypy, go vet)
- [ ] Unit tests (≥80% coverage)
- [ ] Integration tests
- [ ] Security scan (CodeQL, Trivy, TruffleHog)
- [ ] Dependency review
- [ ] Template rendering tests
- [ ] Documentation build

---

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Major** — Breaking changes to skill contracts, template APIs
- **Minor** — New skills, templates, backward-compatible features
- **Patch** — Bug fixes, documentation, internal improvements

### Release Checklist

- [ ] All CI passes on `main`
- [ ] CHANGELOG.md updated
- [ ] Version bumped in `package.json`, `pyproject.toml`, `go.mod`
- [ ] Git tag created: `v{{VERSION}}`
- [ ] GitHub Release published with notes
- [ ] Docker images published
- [ ] Documentation deployed
- [ ] Announcement sent

---

## Getting Help

- **Discord:** [AI Skill Engineer Community](https://discord.gg/ai-skill-engineer)
- **GitHub Discussions:** For questions and ideas
- **Issues:** For bugs and feature requests
- **Email:** maintainers@ai-skill-engineer.dev

---

## Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md`
- Release notes
- Hall of Fame on website

Thank you for contributing! 🚀