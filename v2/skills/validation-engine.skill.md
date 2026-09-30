# validation-engine
> Orchestrate the quality gate: static analysis, types, lint, unit, integration, E2E, security, perf, accessibility, contract, chaos.

## In
- fixed-artifacts (filesystem) - fixed build artifacts [required]
- build-output (filesystem) - build output [required]
- config (json) - validation configuration [required]

## Do
1. Run static analysis, type checking, and linting; fail fast on critical stages.
2. Run unit, integration, E2E, and contract tests in parallel.
3. Run security scans: SAST, DAST, SCA, secrets.
4. Run performance, accessibility, and chaos tests.
5. Aggregate results into pass/fail with failed stages for retry.

## Out
- validation-results (json) - validation results per stage
- validation-summary (json) - overall pass/fail and metrics
- failed-stages (json) - stages that failed, for retry

## Validate
- R-STATIC: static analysis zero errors, under 10 warnings [BLOCKER]
- R-TYPES: type checking zero errors [BLOCKER]
- R-LINT: linting zero errors [BLOCKER]
- R-TEST-80: unit tests >= 80% coverage, 100% pass [BLOCKER]
- R-INT-100: integration tests 100% pass [BLOCKER]
- R-E2E-CRIT: E2E critical paths 100% pass [BLOCKER]
- R-SEC-STAGES: security zero critical/high [BLOCKER]
- R-PERF-BUDGET: performance meets all budgets [HIGH]
- R-A11Y: accessibility WCAG 2.1 AA [BLOCKER]
- R-CONTRACT-100: contract tests 100% pass [HIGH]
