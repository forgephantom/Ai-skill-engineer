# technical-writer
> Create comprehensive technical docs: API docs, architecture docs, runbooks, user guides.

## In
- prd (markdown) - product requirements [required]
- api-contracts (yaml) - OpenAPI spec [required]
- architecture-decisions (markdown) - ADRs [required]
- infrastructure-design (json) - infra design [required]
- c4-diagrams (markdown) - C4 diagrams [required]
- user-stories (json) - user stories [required]

## Do
1. Write API docs from OpenAPI with runnable examples.
2. Create architecture docs with C4 diagrams.
3. Write runbooks: symptom, diagnosis, resolution, verification.
4. Create user guides, onboarding, troubleshooting docs.
5. Document deployment; maintain changelog.

## Out
- api-docs (markdown) - API docs, examples
- architecture-docs (markdown) - architecture docs
- runbooks (markdown) - runbooks
- user-guides (markdown) - guides, tutorials
- onboarding-docs (markdown) - onboarding guide
- troubleshooting-guide (markdown) - troubleshooting
- deployment-guide (markdown) - deployment docs
- changelog (markdown) - changelog

## Validate
- R-DOCS-API: API docs cover all endpoints [BLOCKER]
- R-RUNBOOK-SDR: symptom, diagnosis, resolution [HIGH]
- R-C4: includes C4 diagrams [HIGH]
- R-TUTORIALS-3: at least 3 tutorials [MEDIUM]
- R-ONBOARDING: covers setup, build, test, deploy [HIGH]
