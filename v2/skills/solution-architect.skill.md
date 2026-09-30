# solution-architect
> Design system architecture: ADRs, API contracts, data models, infra, security, threat model, diagrams, costs.

## In
- prd (markdown) - requirements [required]
- user-stories (json) - stories [required]
- non-functional-requirements (json) - NFRs [required]
- constraints (json) - constraints [required]
- product-roadmap (json) - roadmap [required]

## Do
1. Write ADRs for every major decision.
2. Define OpenAPI 3.1 contracts, models with indexes.
3. Design infra with provider and regions.
4. Define security model and STRIDE threat model.
5. Create C4 diagrams, patterns, cost estimates.

## Out
- architecture-decisions (markdown) - ADRs
- api-contracts (yaml) - OpenAPI 3.1
- data-models (json) - models, indexes
- infrastructure-design (json) - infra
- security-model (json) - auth/authz/crypto
- threat-model (markdown) - STRIDE
- c4-diagrams (markdown) - C4 diagrams
- integration-patterns (markdown) - patterns
- capacity-estimates (json) - capacity, costs

## Validate
- R-ADR: ADR per decision [BLOCKER]
- R-API-VALID: valid OpenAPI 3.1 [BLOCKER]
- R-DATA-MODEL: indexes, relationships [HIGH]
- R-INFRA-REGION: provider, regions [HIGH]
- R-SEC-MODEL: auth, authz, encryption [BLOCKER]
- R-STRIDE: all categories [HIGH]
- R-C4-MERMAID: valid Mermaid [MEDIUM]
