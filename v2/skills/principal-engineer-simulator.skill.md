# principal-engineer-simulator
> Simulate Principal Engineer production approval: evaluate architecture, code, security, ops, UX, team; decide APPROVE, REQUEST_CHANGES, or REJECT.

## In
- validation-results (json) - complete validation results [required]
- review-findings (json) - code review findings [required]
- fix-report (json) - fix report from code fixer [required]
- architecture-decisions (markdown) - Architecture Decision Records [required]
- security-model (json) - security model [required]
- delivery-package (json) - delivery package preview [required]

## Do
1. Evaluate architecture, code quality, security, operations, UX, and team readiness.
2. Decide: APPROVE, REQUEST_CHANGES, or REJECT.
3. For REQUEST_CHANGES, give specific actionable feedback with file and line.
4. For REJECT, identify fundamental issues requiring a re-plan.
5. Approve only if simulated approval is yes.

## Out
- approval-decision (json) - APPROVE, REQUEST_CHANGES, or REJECT
- approval-feedback (json) - detailed feedback per category
- required-changes (json) - specific changes if REQUEST_CHANGES

## Validate
- R-APPROVAL: decision is APPROVE, REQUEST_CHANGES, or REJECT [BLOCKER]
- R-FEEDBACK: REQUEST_CHANGES includes specific feedback [BLOCKER]
- R-REJECT-ISSUES: REJECT identifies fundamental issues [BLOCKER]
- R-CATEGORIES: all categories evaluated [HIGH]
