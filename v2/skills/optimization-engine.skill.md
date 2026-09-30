# optimization-engine
> Continuous improvement until diminishing returns: perf, security, scale, DX, UX, cost, reliability.

## In
- artifacts (filesystem) - current artifacts to optimize [required]
- approval-decision (json) - approval decision [required]
- config (json) - optimization configuration [required]

## Do
1. Measure all optimization targets before changing anything.
2. Identify the top 3 improvement opportunities.
3. Apply one optimization at a time and re-validate.
4. Stop when improvement is under 5% on all targets for 2 iterations.
5. Track total improvement; never sacrifice correctness.

## Out
- optimized-artifacts (filesystem) - optimized artifacts
- optimization-report (json) - per-iteration improvement metrics
- optimization-targets (json) - target metrics with current/target values

## Validate
- R-REQUIRE-APPROVAL: approval required before optimizing [BLOCKER]
- R-NO-REGRESSION: no regressions in validation after optimization [BLOCKER]
- R-STOP: stop when <5% improvement on all targets for 2 iterations [HIGH]
- R-TRACK-IMPROVEMENT: track improvement per target per iteration [HIGH]
