# code-reviewer
> Senior-level code review: correctness, architecture, security, performance, scalability, maintainability, accessibility, reliability.

## In
- frontend-project (filesystem) - frontend project code [required]
- backend-project (filesystem) - backend project code [required]
- mobile-project (filesystem) - mobile project code [optional]
- infrastructure (filesystem) - infrastructure code [required]
- api-contracts (yaml) - API contracts [required]
- security-model (json) - security model [required]

## Do
1. Review each dimension independently with specialized checks.
2. Categorize findings: BLOCKER, HIGH, MEDIUM, LOW, NIT.
3. Mark findings that can be auto-fixed.
4. Each finding needs location, description, impact, fix suggestion, reference.
5. Summarize findings by severity and dimension.

## Out
- review-findings (json) - findings with severity and location
- review-summary (json) - summary by severity and dimension
- auto-fixable-findings (json) - findings that can be auto-fixed

## Validate
- R-NO-BLOCKERS: zero BLOCKER findings allowed [BLOCKER]
- R-NO-HIGH-SEC: zero HIGH security findings [BLOCKER]
- R-FINDING-QUALITY: findings have location and fix suggestion [HIGH]
- R-DIMENSIONS: each dimension reviewed [HIGH]
- R-MARK-AUTOFIX: auto-fixable findings marked [MEDIUM]
