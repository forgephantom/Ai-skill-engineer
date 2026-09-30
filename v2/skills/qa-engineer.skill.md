# qa-engineer
> Define and execute quality strategy: test plans, automation, test data, reports.

## In
- acceptance-criteria (json) - criteria from PM [required]
- user-stories (json) - stories [required]
- api-contracts (yaml) - API contracts [required]
- frontend-project (filesystem) - frontend [required]
- backend-project (filesystem) - backend [required]

## Do
1. Create test strategy and plan from criteria.
2. Design test cases on the test pyramid.
3. Build automation framework with test data.
4. Add contract, perf, a11y, chaos tests.
5. Report results; flakiness under 1%.

## Out
- test-strategy (markdown) - strategy
- test-plan (markdown) - plan
- test-cases (json) - cases
- automation-framework (filesystem) - automation
- unit-tests (filesystem) - unit tests
- integration-tests (filesystem) - integration
- e2e-tests (filesystem) - E2E tests
- contract-tests (filesystem) - contract tests
- performance-tests (filesystem) - perf tests
- accessibility-tests (filesystem) - a11y tests
- chaos-experiments (filesystem) - chaos tests
- test-data (filesystem) - fixtures
- test-reports (filesystem) - reports

## Validate
- R-TEST-80: unit >= 80%/90% [BLOCKER]
- R-INT-ALL: tests for all endpoints [HIGH]
- R-E2E-CRIT: critical journeys [HIGH]
- R-CONTRACT-100: 100% coverage [HIGH]
- R-PERF-BUDGET: meets budgets [HIGH]
- R-A11Y: zero axe violations [BLOCKER]
- R-FLAKY: flakiness < 1% [HIGH]
