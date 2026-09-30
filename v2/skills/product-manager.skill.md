# product-manager
> Create a comprehensive PRD with user stories and acceptance criteria.

## In
- vision (text) - vision [required]
- target-audience (json) - audience [required]
- business-goals (json) - goals, metrics [required]
- functional-requirements (json) - functional reqs [required]
- non-functional-requirements (json) - NFRs [required]
- product-positioning (markdown) - positioning [required]
- market-analysis (markdown) - market analysis [required]

## Do
1. Write PRD: problem, solution, users, features, metrics, timeline, risks.
2. Create INVEST user stories.
3. Define executable Gherkin acceptance criteria.
4. Prioritize with MoSCoW/RICE; define MVP scope.
5. Define personas, journeys, analytics events.

## Out
- prd (markdown) - requirements doc
- user-stories (json) - stories
- acceptance-criteria (json) - Gherkin criteria
- feature-specs (markdown) - specs
- user-personas (json) - personas
- user-journeys (markdown) - journeys
- mvp-scope (json) - MVP scope
- analytics-events (json) - events

## Validate
- R-PRD-SECTIONS: all sections [BLOCKER]
- R-STORY-TRACE: each req maps to >=1 story [BLOCKER]
- R-INVEST: all stories INVEST [HIGH]
- R-GHERKIN: Gherkin format [BLOCKER]
- R-MVP: exit criteria defined [HIGH]
- R-PERSONA: goals, pain points [MEDIUM]
