# code-fixer
> Remediate review findings marked auto-fixable, verify no regressions, escalate the rest.

## In
- review-findings (json) - review findings from code reviewer [required]
- build-output (filesystem) - build output artifacts [required]
- frontend-project (filesystem) - frontend project [required]
- backend-project (filesystem) - backend project [required]

## Do
1. Fix only findings marked auto_fixable: lint, style, security headers, perf patterns, accessibility.
2. Apply fixes in batches and validate after each batch.
3. Add missing test boilerplate and sync docs with code.
4. Revert and escalate if tests fail; preserve all original functionality.
5. Produce a report of fixes applied, failed, and escalated.

## Out
- fixed-artifacts (filesystem) - fixed code artifacts
- fix-report (json) - fixes applied, failed, escalated
- regressions (json) - any regressions introduced

## Validate
- R-NO-REGRESSION: no regressions, all tests pass [BLOCKER]
- R-AUTOFIX-ADDRESSED: all auto-fixable findings addressed [HIGH]
- R-ESCALATE: non-auto-fixable findings escalated [HIGH]
