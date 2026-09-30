# frontend-engineer
> Build production web frontend: components, pages, state, routing, tests, performance, accessibility.

## In
- design-system (json) - design system [required]
- high-fidelity-mockups (markdown) - mockups [required]
- component-specs (json) - component specs [required]
- api-contracts (yaml) - OpenAPI spec [required]
- user-flows (markdown) - user flows [required]
- design-tokens (json) - tokens [required]

## Do
1. Set up project with typed API client and routing.
2. Build design system components with Storybook.
3. Build pages from mockups with state management.
4. Write unit, integration, E2E tests.
5. Optimize bundle and load; meet WCAG 2.1 AA.

## Out
- frontend-project (filesystem) - project
- component-library (filesystem) - components
- pages (filesystem) - pages, layouts
- hooks (filesystem) - hooks
- state-management (filesystem) - state
- api-client (filesystem) - API client
- storybook (filesystem) - stories
- frontend-tests (filesystem) - tests
- frontend-config (filesystem) - configs

## Validate
- R-TYPES: strict mode passes [BLOCKER]
- R-LINT: ESLint zero errors [BLOCKER]
- R-TEST-80: unit coverage >= 80% [HIGH]
- R-E2E-CRIT: critical journeys covered [HIGH]
- R-BUNDLE: under 100KB gzipped [HIGH]
- R-A11Y: zero axe-core violations [BLOCKER]
- R-SB-STORIES: stories for all components [MEDIUM]
