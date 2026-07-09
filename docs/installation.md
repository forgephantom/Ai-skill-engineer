# Installation Guide

## Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|--------------|
| [Node.js](https://nodejs.org) | 20+ | `node --version` |
| [npm](https://www.npmjs.com) | 9+ | `npm --version` |
| [Git](https://git-scm.com) | 2.40+ | `git --version` |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/forgephantom/Ai-skill-engineer.git
cd Ai-skill-engineer
```

**Example:**
```
$ git clone https://github.com/forgephantom/Ai-skill-engineer.git
Cloning into 'Ai-skill-engineer'...
remote: Enumerating objects: 1500, done.
Receiving objects: 100% (1500/1500), done.
$ cd Ai-skill-engineer
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`:
- **Runtime:** Commander.js (CLI), Inquirer.js (prompts), Ora (spinners), Chalk (colors), Handlebars (templates), Zod (validation), fs-extra (file system), uuid (IDs), EventEmitter3 (events)
- **Development:** TypeScript, Jest (testing), ESLint (linting)

**Example output:**
```
$ npm install
added 842 packages in 12s
```

---

## Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript (`dist/`) and copies skill YAML definitions and templates into the output directory.

**Example output:**
```
$ npm run build
> ai-skill-engineer@1.0.0 build
> tsc && npm run build:assets
```

---

## Step 4: Link the CLI (Optional)

```bash
npm link
```

This makes the `ai-se` command available globally on your system.

**Example:**
```
$ npm link
up to date, audited 842 packages in 2s
/Users/you/.nvm/versions/node/v20.0.0/bin/ai-se -> ...
```

After linking, verify it works:

```bash
ai-se --help
```

---

## Step 5: Verify Installation

Run the built-in health check:

```bash
ai-se doctor
```

**Expected output:**
```
✔ System health check passed
✔ TypeScript: 5.4+
✔ Node: 20+
✔ Dependencies: installed
✔ Configuration: valid
```

---

## Alternative: Run Without Linking

If you prefer not to link globally, use `npx` or run directly:

```bash
npx ai-se --help
# or
node dist/cli/index.js --help
```

---

## Platform-Specific Notes

### macOS (Apple Silicon)
Works out of the box. No special configuration needed.

### Linux
Requires Node.js 20+. Use [nvm](https://github.com/nvm-sh/nvm) for version management.

### Windows
Use [Git Bash](https://git-scm.com/download/win) or [WSL](https://learn.microsoft.com/windows/wsl/) for the best experience.

---

## Troubleshooting

| Symptom | Solution |
|---------|----------|
| `command not found: ai-se` | Run `npm link` or use `npx ai-se` |
| `npm install` fails | Ensure Node.js 20+ is installed |
| Build errors | Run `npm run clean && npm install && npm run build` |
| Permission errors | Avoid `sudo` — use `npm link` without root |

---

## Next Steps

- [Quick Start Guide](quickstart.md) — Run your first project
- [CLI Reference](cli-reference.md) — All available commands
- [Workflow Phases](workflow-phases.md) — Understand the 10-phase pipeline
