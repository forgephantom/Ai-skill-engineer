# mobile-engineer
> Build production native or cross-platform mobile apps with offline support, tests, store pipelines.

## In
- design-system (json) - design system spec [required]
- high-fidelity-mockups (markdown) - mockups [required]
- api-contracts (yaml) - OpenAPI spec [required]
- user-flows (markdown) - user flows [required]

## Do
1. Set up project with navigation and deep linking.
2. Implement screens with a type-safe API client.
3. Add offline support, push notifications, biometric auth.
4. Write unit, integration, E2E tests.
5. Configure store CI/CD; optimize size and cold start.

## Out
- mobile-project (filesystem) - project structure
- screens (filesystem) - screens
- navigation (filesystem) - navigation
- api-client (filesystem) - typed API client
- offline-storage (filesystem) - offline, caching
- push-notifications (filesystem) - push setup
- mobile-tests (filesystem) - tests
- ci-cd-mobile (filesystem) - store pipelines

## Validate
- R-TYPES: strict mode passes [BLOCKER]
- R-SCREENS: all mockup screens implemented [HIGH]
- R-OFFLINE: offline for critical flows [HIGH]
- R-PUSH: push notifications configured [MEDIUM]
- R-E2E-CRIT: E2E for critical journeys [HIGH]
- R-STORE-BUILD: app store build passes [BLOCKER]
