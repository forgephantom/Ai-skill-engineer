# desktop-engineer
> Build production desktop apps for macOS and Windows with native installers, signing, auto-update, tests.

## In
- design-system (json) - design system spec [required]
- high-fidelity-mockups (markdown) - mockups [required]
- api-contracts (yaml) - OpenAPI spec [required]
- user-flows (markdown) - user flows [required]

## Do
1. Pick the stack by need: web-tech shell (Electron/Tauri) or native per OS.
2. Implement windows, menus, tray, shortcuts, deep links per OS conventions.
3. Wire a type-safe API client with offline cache and background sync.
4. Set up code signing, platform installers (dmg/pkg, msix/exe), and auto-update.
5. Write unit, integration, E2E tests; optimize launch time and bundle size.

## Out
- desktop-project (filesystem) - project structure
- app-windows (filesystem) - windows, menus, tray
- api-client (filesystem) - typed API client
- installers (filesystem) - macOS and Windows installers
- auto-update (filesystem) - update feed and channels
- desktop-tests (filesystem) - tests
- ci-cd-desktop (filesystem) - signing and release pipelines

## Validate
- R-TYPES: strict mode passes [BLOCKER]
- R-SCREENS: all mockup screens implemented [HIGH]
- R-SIGNED: binaries code-signed for both OSes [BLOCKER]
- R-INSTALLER: installer builds and installs clean on macOS and Windows [BLOCKER]
- R-AUTOUPDATE: auto-update feed verified end to end [HIGH]
- R-E2E-CRIT: E2E for critical journeys [HIGH]
