# backend-engineer
> Build production backends: APIs, models, events, workers, DB, auth, observability, tests.

## In
- api-contracts (yaml) - OpenAPI spec [required]
- data-models (json) - data models [required]
- architecture-decisions (markdown) - ADRs [required]
- security-model (json) - auth/authz/encryption [required]
- infrastructure-design (json) - infra design [required]

## Do
1. Set up the project; implement all OpenAPI endpoints.
2. Design domain models and business logic with clean layering.
3. Build events, workers, data access.
4. Add auth, authz, observability.
5. Write unit, integration, contract tests; keep migrations reversible.

## Out
- backend-project (filesystem) - project structure
- api-services (filesystem) - API services
- domain-models (filesystem) - models, logic
- repositories (filesystem) - data access
- event-handlers (filesystem) - event handling
- workers (filesystem) - background jobs
- auth-module (filesystem) - auth/authz
- observability (filesystem) - logs, metrics, traces
- backend-tests (filesystem) - tests
- database-migrations (filesystem) - migrations

## Validate
- R-API-COVERAGE: all endpoints implemented [BLOCKER]
- R-TYPES: strict type checking passes [BLOCKER]
- R-TEST-80: unit coverage >= 80% [HIGH]
- R-INT-ALL: integration tests for all endpoints [HIGH]
- R-CONTRACT-100: contract tests vs OpenAPI [HIGH]
- R-OBS: logs, metrics, traces configured [HIGH]
- R-MIGRATION: migrations reversible [HIGH]
