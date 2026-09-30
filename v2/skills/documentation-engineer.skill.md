# documentation-engineer
> Produce complete docs: API docs, architecture docs, runbooks, user guides, onboarding.

## In
- api-contracts (yaml) - OpenAPI spec [required]
- architecture-decisions (markdown) - ADRs [required]
- c4-diagrams (markdown) - C4 diagrams [required]
- user-stories (json) - user stories [required]
- runbooks (markdown) - devops runbooks [required]
- deployment-guide (markdown) - deploy guide [required]

## Do
1. Generate API docs from OpenAPI for all endpoints.
2. Write architecture docs with C4 diagrams.
3. Create runbooks: symptom, diagnosis, resolution.
4. Write user guides, troubleshooting, deployment docs.
5. Create onboarding guide; maintain changelog.

## Out
- api-docs (filesystem) - API docs site
- architecture-docs (filesystem) - arch docs
- runbooks (filesystem) - runbooks
- user-guides (filesystem) - guides
- onboarding-guide (markdown) - onboarding
- troubleshooting-guide (markdown) - troubleshooting
- deployment-docs (filesystem) - deploy docs
- changelog (markdown) - changelog

## Validate
- R-DOCS-API: covers all endpoints [BLOCKER]
- R-RUNBOOK-SDR: symptom, diagnosis, resolution [HIGH]
- R-C4: includes C4 diagrams [HIGH]
- R-ONBOARDING: covers setup, build, test, deploy [HIGH]
- R-DOCS-A11Y: WCAG AA [HIGH]
