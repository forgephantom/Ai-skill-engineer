# business-analyst
> Extract and structure business requirements from natural language input.

## In
- idea (text) - raw project idea [required]

## Do
1. Extract vision, goals, audience, personas.
2. Identify functional requirements with MoSCoW priorities.
3. Define measurable non-functional requirements.
4. Discover constraints; assess risks with mitigations.
5. Define success criteria with measurement methods.

## Out
- vision (text) - vision statement
- target-audience (json) - segments and personas
- business-goals (json) - goals, metrics, timelines
- functional-requirements (json) - prioritized (MoSCoW)
- non-functional-requirements (json) - measurable requirements
- constraints (json) - tech, business, regulatory, resource
- risks (json) - risks with mitigations
- opportunities (json) - opportunities, impact/effort
- success-criteria (json) - measurable criteria

## Validate
- R-VISION: vision non-empty, under 500 chars [BLOCKER]
- R-AUDIENCE: at least one segment identified [BLOCKER]
- R-GOAL: at least one goal with metric and timeline [BLOCKER]
- R-REQ-MOSCOW: 3+ functional requirements with MoSCoW priority [HIGH]
- R-NFR-MEASURABLE: 2+ NFRs with measurable criteria [HIGH]
- R-RISK-MITIGATION: all risks have mitigations [HIGH]
- R-CONSTRAINTS-CAT: constraints categorized [MEDIUM]
- R-SUCCESS-MEASURABLE: criteria have measurement method [HIGH]
