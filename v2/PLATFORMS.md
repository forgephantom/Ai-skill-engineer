# Platforms (v2)

One idea can ship to five targets: web, android, ios, mac, windows.
The skill-discovery-engine picks build skills from the target platforms
declared in phase 1 (understand). If the user names no platform, ask;
never assume.

## Platform to skill matrix

| Platform | Skill | Notes |
|---|---|---|
| web | frontend-engineer | Responsive web app or PWA. Needs design-system, mockups, api-contracts. |
| android | mobile-engineer | Native or cross-platform (Flutter, React Native, Kotlin Multiplatform). Store pipeline included. |
| ios | mobile-engineer | Same skill as android; one codebase when cross-platform, two when native. |
| mac | desktop-engineer | macOS app: dmg/pkg installer, Apple code signing and notarization. |
| windows | desktop-engineer | Windows app: msix/exe installer, Authenticode signing. |

Shared across all platforms: backend-engineer (APIs), database-engineer
(data layer), ai-engineer (AI features), cloud-engineer and devops-engineer
(infra and pipelines), qa-engineer and validation-engine (quality gates).

## How discovery picks

1. Read target platforms from the understand-phase output (required field).
2. Map each platform to its skill via the table above.
3. android + ios share one mobile-engineer run when the stack is
   cross-platform; split into two runs only for fully native builds.
4. mac + windows share one desktop-engineer run; the skill produces
   both installers from one codebase where the stack allows.
5. web always pairs with backend-engineer unless the PRD says static only.

## Platform validation

Each platform skill carries its own gate rules: R-STORE-BUILD for
mobile store builds, R-SIGNED and R-INSTALLER for desktop binaries,
plus the shared R-TYPES and R-E2E-CRIT. A platform ships only when
its own rules pass.
