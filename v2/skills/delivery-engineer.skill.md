# delivery-engineer
> Package the project for handoff: summary, code, tests, docs, deploy guide, infra, roadmap.

## In
- all-artifacts (filesystem) - all artifacts [required]
- state (json) - orchestrator state [required]
- project-config (json) - project config [required]

## Do
1. Write executive summary and product overview.
2. Package architecture and features.
3. Package buildable source code and all test types.
4. Package full docs: API, architecture, runbooks, onboarding.
5. Write deploy guide with rollback, handover notes, roadmap.

## Out
- delivery-package (filesystem) - package dir
- executive-summary (markdown) - summary
- product-overview (markdown) - overview
- architecture-package (filesystem) - arch docs
- features-package (filesystem) - feature docs
- source-code-package (filesystem) - source code
- tests-package (filesystem) - tests
- documentation-package (filesystem) - docs
- deployment-guide (markdown) - deploy guide
- infrastructure-package (filesystem) - infra
- ci-cd-package (filesystem) - pipelines
- monitoring-package (filesystem) - monitoring
- future-improvements (markdown) - roadmap
- handover-notes (markdown) - handover notes

## Validate
- R-PACKAGE-DIRS: all dirs present [BLOCKER]
- R-BUILDABLE: source builds [BLOCKER]
- R-TEST-TYPES: all test types included [HIGH]
- R-DEPLOY-GUIDE: guide complete [HIGH]
- R-HANDOVER: 5 required topics [HIGH]
