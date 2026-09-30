# devops-engineer
> Build CI/CD pipelines, deployment automation, environments, promotion, rollback, secrets.

## In
- frontend-project (filesystem) - frontend project [required]
- backend-project (filesystem) - backend project [required]
- terraform-modules (filesystem) - Terraform modules [required]
- security-model (json) - security requirements [required]

## Do
1. Create CI: lint, typecheck, test, security scan.
2. Create CD with approval gates, blue-green/canary, automated rollback.
3. Define dev, staging, prod with promotion gates.
4. Manage secrets outside the repo with rotation and audit.
5. Add image scanning, PR previews, runbooks, alerts.

## Out
- ci-pipeline (filesystem) - build, test, scan
- cd-pipeline (filesystem) - deploy, promote, rollback
- environments (filesystem) - environment configs
- deployment-strategy (markdown) - strategy docs
- secrets-management (filesystem) - secrets setup
- container-security (filesystem) - scanning, signing
- preview-environments (filesystem) - PR previews
- runbooks-cicd (markdown) - operational runbooks

## Validate
- R-CI-CHECK: CI runs lint, typecheck, test, scan [BLOCKER]
- R-CD-GATE: production approval gate [BLOCKER]
- R-ROLLBACK: rollback automated and tested [HIGH]
- R-NO-SECRETS-REPO: no secrets in repo [BLOCKER]
- R-IMG-SCAN: images scanned [HIGH]
- R-PREVIEW-ENVS: preview envs for all PRs [MEDIUM]
