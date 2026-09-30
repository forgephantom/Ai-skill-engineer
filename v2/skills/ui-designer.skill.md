# ui-designer
> Create visual design system, high-fidelity mockups, component specs, design tokens.

## In
- wireframes (markdown) - wireframes from UX [required]
- user-flows (markdown) - user flows [required]
- brand-guidelines (markdown) - brand guidelines [optional]
- accessibility-requirements (json) - WCAG reqs [required]

## Do
1. Create design system: colors, typography, spacing, shadows.
2. Design mockups for all screens in all states.
3. Define platform-agnostic design tokens, component specs.
4. Design responsive breakpoints (4+) and icon system.
5. Define motion guidelines and handoff assets.

## Out
- design-system (json) - design system spec
- high-fidelity-mockups (markdown) - mockups
- component-specs (json) - component specs
- design-tokens (json) - design tokens
- responsive-specs (json) - responsive specs
- icon-system (json) - icon specs
- motion-guidelines (markdown) - motion guidelines
- handoff-assets (json) - handoff package

## Validate
- R-DS-TOKENS: color, typography, spacing [BLOCKER]
- R-STATES: specs for all component states [HIGH]
- R-CONTRAST: contrast meets WCAG AA [BLOCKER]
- R-TOKENS-PLATFORM: tokens platform-agnostic [HIGH]
- R-MOCKUPS-ALL: mockups cover all screens [HIGH]
- R-BREAKPOINTS: 4+ breakpoints [MEDIUM]
