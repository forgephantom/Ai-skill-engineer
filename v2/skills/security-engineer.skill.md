# security-engineer
> Ensure security posture: threat model, requirements, hardening, compliance evidence.

## In
- threat-model (markdown) - threat model [required]
- security-model (json) - security model [required]
- api-contracts (yaml) - API contracts [required]
- infrastructure-design (json) - infra design [required]

## Do
1. Create and maintain the STRIDE threat model.
2. Define security requirements and controls mapped to compliance.
3. Harden app and infra: headers, CSP, WAF, rate limiting.
4. Add SAST, DAST, SCA, secrets scanning in CI/CD.
5. Configure monitoring and alerting; plan pen tests.

## Out
- threat-model-detailed (markdown) - STRIDE model
- security-requirements (markdown) - requirements, controls
- hardening-guide (markdown) - hardening guide
- sast-dast-config (filesystem) - pipeline config
- secrets-management (filesystem) - detection, rotation
- waf-config (filesystem) - WAF rules, rate limits
- compliance-evidence (filesystem) - evidence package
- pen-test-plan (markdown) - pen test plan
- security-monitoring (filesystem) - alerts, dashboards

## Validate
- R-STRIDE: all STRIDE categories [BLOCKER]
- R-SAST: SAST zero critical/high [BLOCKER]
- R-SCA: SCA zero critical/high CVEs [BLOCKER]
- R-SECRETS-CLEAN: secrets scan clean [BLOCKER]
- R-SEC-HEADERS: security headers implemented [HIGH]
- R-COMPLIANCE: evidence maps to controls [HIGH]
