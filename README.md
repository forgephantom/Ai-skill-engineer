<picture>
  <source media="(prefers-color-scheme: dark)" srcset="media/banner.svg">
  <img alt="AI Skill Engineer" src="media/banner.svg" width="100%">
</picture>

<br>

<div align="center">

# AI Skill Engineer

> **Transform a single human idea into a complete, production-ready application — autonomously.**

<br>

[![GitHub stars](https://img.shields.io/github/stars/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=blue&label=Stars)](https://github.com/forgephantom/Ai-skill-engineer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=blue&label=Forks)](https://github.com/forgephantom/Ai-skill-engineer/forks)
[![CI](https://img.shields.io/github/actions/workflow/status/forgephantom/Ai-skill-engineer/ci.yml?style=for-the-badge&logo=githubactions&label=CI)](https://github.com/forgephantom/Ai-skill-engineer/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-for-the-badge?logo=typescript&color=3178C6)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-20%2B-for-the-badge?logo=node.js&color=339933)](https://nodejs.org)

[![Release](https://img.shields.io/github/v/release/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&label=Release)](https://github.com/forgephantom/Ai-skill-engineer/releases)
[![License](https://img.shields.io/badge/License-MIT-for_the_badge?color=green)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=blue)](https://github.com/forgephantom/Ai-skill-engineer/commits/main)
[![Open Issues](https://img.shields.io/github/issues/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=yellow)](https://github.com/forgephantom/Ai-skill-engineer/issues)
[![Open PRs](https://img.shields.io/github/issues-pr/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=brightgreen)](https://github.com/forgephantom/Ai-skill-engineer/pulls)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-for_the_badge?color=blue&logo=dependabot)](https://github.com/forgephantom/Ai-skill-engineer/network/updates)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-for_the_badge?color=brightgreen)](CONTRIBUTING.md)
[![Activity](https://img.shields.io/github/commit-activity/m/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&color=blue)](https://github.com/forgephantom/Ai-skill-engineer/commits/main)

<br>

**🏆 Orchestrate 24 AI engineering roles | 10-phase autonomous workflow | Plug any LLM provider**

<br>

[![](https://img.shields.io/github/created-at/forgephantom/Ai-skill-engineer?style=flat&logo=github&label=Created)](https://github.com/forgephantom/Ai-skill-engineer)
[![](https://img.shields.io/github/repo-size/forgephantom/Ai-skill-engineer?style=flat&logo=github&label=Size)](https://github.com/forgephantom/Ai-skill-engineer)
[![](https://img.shields.io/github/languages/code-size/forgephantom/Ai-skill-engineer?style=flat&logo=github&label=Code%20Size)](https://github.com/forgephantom/Ai-skill-engineer)
[![](https://img.shields.io/github/contributors/forgephantom/Ai-skill-engineer?style=flat&logo=github&label=Contributors)](https://github.com/forgephantom/Ai-skill-engineer/graphs/contributors)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Codespace-ready-blue?style=flat&logo=github)](https://github.com/codespaces/new/forgephantom/Ai-skill-engineer)

</div>

---

## Why AI Skill Engineer?

Unlike code assistants that generate snippets, AI Skill Engineer runs a **complete multi-skill, multi-phase engineering workflow** — from idea to production-ready delivery package.

```
Idea → Understand → Plan → Build → Review → Fix → Validate → Approve → Optimize → Deliver
```

| What makes it different | |
|------------------------|-|
| **24 simulated expert roles** | Product strategists, solution architects, frontend/backend/AI engineers, security, QA, DevOps, and more |
| **DAG-based parallel execution** | Skills run in dependency-respecting parallel groups |
| **State persistence** | Resume from the last completed phase — no data loss |
| **Validation pipeline** | Type-checking, linting, security scanning, performance tests built in |
| **Pluggable executors** | Connect any LLM provider (OpenAI, Anthropic, Ollama, etc.) via a simple interface |
| **Delivery packaging** | Complete project with architecture docs, code, tests, deployment, and runbooks |

---

## Quick Start

```bash
git clone https://github.com/forgephantom/Ai-skill-engineer.git
cd ai-skill-engineer && npm install && npm run build && npm link
ai-se init "Build a SaaS platform for compliance reporting"
ai-se run --project <project-id>
```

[📖 Full walkthrough with sample output →](docs/walkthrough.md)

---

## Live Demo

```bash
# Initialize a project from a natural-language idea
$ ai-se init "Build a SaaS platform for compliance reporting" --name compliance-saas

✔ Project initialized: compliance-saas (proj-a1b2c3d4)

# Run the full 10-phase autonomous workflow
$ ai-se run --project proj-a1b2c3d4 --no-human-approval

╔════════════════════════════════════════════════════════════╗
║         AI Skill Engineer - Autonomous Workflow            ║
╚════════════════════════════════════════════════════════════╝

✔ Phase 1/10: understand completed   (strategy + requirements)
✔ Phase 2/10: plan completed         (PRD + tech spec + roadmap)
✔ Phase 3/10: discover-skills completed (DAG built)
✔ Phase 4/10: build completed        (code + infra generated)
✔ Phase 5/10: review completed       (findings: 23)
✔ Phase 6/10: fix completed          (fixed: 15)
✔ Phase 7/10: validate completed     (stages passed: 6/6)
✔ Phase 8/10: human-approval completed
✔ Phase 9/10: optimize completed     (improvement: 23%)
✔ Phase 10/10: deliver completed     (package: 234 items)

╔════════════════════════════════════════════════════════════╗
║              WORKFLOW COMPLETED SUCCESSFULLY               ║
╚════════════════════════════════════════════════════════════╝

Delivery package: ./output/proj-a1b2c3d4/delivery/
```

## Connecting AI Providers — Skill Executors

Skills produce artifacts via **executors** — pluggable modules that implement the `SkillExecutor` interface. The framework ships with a stubbed `LLMExecutor` (placeholder content). To generate real output, implement `executor.ts` in any skill directory.

### Architecture

```
skill.yaml                         executor.ts
┌─────────────────┐              ┌────────────────────────────┐
│ id: my-skill     │              │ class MyExecutor           │
│ model: claude-3  │───injects──►│   implements SkillExecutor  │
│ temperature: 0.3 │  config     │   execute(inputs, context) │
│ maxTokens: 8192  │              │     → SkillResult          │
└─────────────────┘              └────────────────────────────┘
                                         │
                                    OpenAI / Anthropic / Ollama / etc.
```

Each skill receives runtime config from its YAML definition:

```typescript
interface SkillConfig {
  model?: string;        // "gpt-4", "claude-3-5-sonnet", "ollama/mistral"
  temperature?: number;  // 0-1
  maxTokens?: number;    // max tokens per response
  timeout?: number;      // ms
  retryAttempts?: number;
}
```

---

### 1. Anthropic Claude (Recommended)

Install: `npm install @anthropic-ai/sdk`

**`src/skills/definitions/ai-engineer/executor.ts`:**

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { SkillExecutor, SkillInput, ExecutionContext, SkillResult } from '../../../types';

export class ClaudeExecutor implements SkillExecutor {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> {
    const systemPrompt = `You are a senior AI engineer. Your mission: build production-quality output.
Input artifacts: ${JSON.stringify([...inputs.artifacts.keys()])}`;

    const response = await this.client.messages.create({
      model: inputs.config.model || 'claude-3-5-sonnet-20241022',
      max_tokens: inputs.config.maxTokens || 8192,
      temperature: inputs.config.temperature ?? 0.3,
      system: [{ type: 'text', text: systemPrompt }],
      messages: [
        { role: 'user', content: JSON.stringify([...inputs.artifacts.values()]) },
      ],
    });

    return {
      success: true,
      output: {
        artifacts: [{ content: response.content[0].text, metadata: { model: inputs.config.model } }],
        metadata: { model: inputs.config.model },
      },
      duration: 0,
    };
  }
}
```

**`src/skills/definitions/ai-engineer/skill.yaml`:**

```yaml
id: ai-engineer
name: AI Engineer
model: claude-3-5-sonnet-20241022
temperature: 0.3
maxTokens: 8192
```

---

### 2. OpenAI / GPT-4

Install: `npm install openai`

```typescript
import OpenAI from 'openai';
import { SkillExecutor, SkillInput, ExecutionContext, SkillResult } from '../../../types';

export class OpenAIExecutor implements SkillExecutor {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> {
    const response = await this.client.chat.completions.create({
      model: inputs.config.model || 'gpt-4-turbo',
      temperature: inputs.config.temperature ?? 0.3,
      max_tokens: inputs.config.maxTokens || 4096,
      messages: [
        { role: 'system', content: 'You are a senior software engineer.' },
        { role: 'user', content: JSON.stringify([...inputs.artifacts.values()]) },
      ],
    });

    return {
      success: true,
      output: {
        artifacts: [{ content: response.choices[0].message.content }],
        metadata: { model: inputs.config.model },
      },
      duration: 0,
    };
  }
}
```

**Compatible with any OpenAI-compatible API** (Azure OpenAI, Together AI, Groq, etc.) — just change the `baseURL`:

```typescript
this.client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT, // or https://api.groq.com/openai/v1
});
```

---

### 3. Ollama (Local, Free)

No SDK needed — uses `fetch` directly.

```typescript
export class OllamaExecutor implements SkillExecutor {
  async execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> {
    const model = (inputs.config.model || 'mistral').replace('ollama/', '');
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `You are a senior engineer. Generate based on:\n${JSON.stringify([...inputs.artifacts.values()], null, 2)}`,
        stream: false,
        options: { temperature: inputs.config.temperature ?? 0.3 },
      }),
    });
    const data = await res.json();
    return {
      success: true,
      output: { artifacts: [{ content: data.response }], metadata: { model } },
      duration: 0,
    };
  }
}
```

---

### 4. Google Gemini

Install: `npm install @google/generative-ai`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiExecutor implements SkillExecutor {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> {
    const model = this.genAI.getGenerativeModel({
      model: inputs.config.model || 'gemini-2.0-flash',
    });
    const result = await model.generateContent(JSON.stringify([...inputs.artifacts.values()]));
    return {
      success: true,
      output: { artifacts: [{ content: result.response.text() }], metadata: {} },
      duration: 0,
    };
  }
}
```

---

### 5. Multi-Model Routing

Use different models per skill for cost optimization:

```yaml
# src/skills/definitions/product-strategist/skill.yaml
id: product-strategist
model: claude-3-haiku          # cheap, fast — simple analysis
temperature: 0.5
```

```yaml
# src/skills/definitions/frontend-engineer/skill.yaml
id: frontend-engineer
model: claude-3-5-sonnet       # powerful — code generation
temperature: 0.2
maxTokens: 16384
```

```yaml
# src/skills/definitions/code-reviewer/skill.yaml
id: code-reviewer
model: gpt-4-turbo             # different provider entirely
temperature: 0.1
```

---

### Quick Reference: Provider Setup

| Provider | Install | Env Variable | Default Model |
|----------|---------|-------------|---------------|
| Anthropic | `npm install @anthropic-ai/sdk` | `ANTHROPIC_API_KEY` | `claude-3-5-sonnet-20241022` |
| OpenAI | `npm install openai` | `OPENAI_API_KEY` | `gpt-4-turbo` |
| Ollama | none (fetch API) | none | `mistral` |
| Google Gemini | `npm install @google/generative-ai` | `GEMINI_API_KEY` | `gemini-2.0-flash` |
| Azure OpenAI | `npm install openai` | `AZURE_OPENAI_KEY` + `AZURE_OPENAI_ENDPOINT` | `gpt-4` |

---

### Auto-Loading Executors

Place your `executor.ts` alongside the skill's YAML definition:

```
src/skills/definitions/
├── my-custom-skill/
│   ├── skill.yaml          ← skill metadata + model config
│   └── executor.ts         ← auto-loaded at runtime
├── frontend-engineer/
│   ├── skill.yaml
│   └── executor.ts         ← one per skill
└── ...
```

The `SkillRegistry` detects `executor.ts` automatically. No registration needed. Configure everything in YAML — model, temperature, tokens, timeout — all passed to `inputs.config` at runtime.

---

## CLI Reference

| Command | Description |
|---------|-------------|
| `init [idea]` | Initialize a new project |
| `run --project <id>` | Execute the workflow |
| `status --project <id>` | Show project state |
| `resume --project <id>` | Resume interrupted workflow |
| `stop --project <id>` | Stop running project |
| `validate --project <id>` | Run validation pipeline |
| `doctor` | Check system health |
| `skills list/show <id>` | Manage skill definitions |
| `templates list/show <name>` | Manage templates |
| `config show/set <key> <value>` | Manage project config |

Key options: `--max-parallel <n>` (default 4), `--validation-level <strict\|standard\|minimal>`, `--optimization-iterations <n>` (default 3), `--no-human-approval`.

---

## 10-Phase Workflow

| # | Phase | Skills | Key Outputs |
|---|-------|--------|-------------|
| 1 | **Understand** | Business Analyst, Product Strategist | Vision, goals, requirements, risks |
| 2 | **Plan** | Product Manager, Solution Architect, Technical Writer | PRD, user stories, tech spec, roadmap |
| 3 | **Discover Skills** | Skill Discovery Engine | Skill dependency DAG with parallel groups |
| 4 | **Build** | All project skills (parallel groups) | Architecture, code, UI, API, DB, infra |
| 5 | **Review** | Code Reviewer | Findings with severity breakdown |
| 6 | **Fix** | Code Fixer | Remediated artifacts, regression check |
| 7 | **Validate** | Validation Engine | Static analysis, lint, type-check, test results |
| 8 | **Human Approval** | Principal Engineer Simulator | Approval or feedback (auto or manual) |
| 9 | **Optimize** | Optimization Engine | Performance, security, cost, UX improvements |
| 10 | **Deliver** | Delivery Engineer | Complete package with docs, deploy guide, runbooks |

---

## Built-in Skills (24)

`product-strategist` · `business-analyst` · `product-manager` · `solution-architect` · `technical-writer` · `ux-designer` · `ui-designer` · `frontend-engineer` · `backend-engineer` · `mobile-engineer` · `ai-engineer` · `database-engineer` · `cloud-engineer` · `devops-engineer` · `security-engineer` · `qa-engineer` · `documentation-engineer` · `code-reviewer` · `code-fixer` · `validation-engine` · `optimization-engine` · `delivery-engineer` · `principal-engineer-simulator` · `skill-discovery-engine`

---

## Custom Skill Definitions

```yaml
id: my-skill
name: My Skill
version: "1.0.0"
mission: "One-sentence mission statement"
model: claude-3-5-sonnet          # optional: provider model
temperature: 0.3                  # optional: 0-1
maxTokens: 8192                   # optional: max tokens
responsibilities:
  - "Do X"
  - "Do Y"
knowledge_areas: ["domain"]
inputs:
  - artifact_id: "input-name"
    contract: "json|markdown|yaml|filesystem"
    required: true
outputs:
  - artifact_id: "output-name"
    contract: "markdown"
dependencies: ["dependency-skill-id"]
validation_rules:
  - rule: "Output must include X"
    severity: "BLOCKER"
```

---

## Development

```bash
npm run typecheck    # TypeScript strict mode
npm run lint         # ESLint
npm test             # Jest (unit + integration + E2E)
npm run build        # Compile to dist/
npm run dev -- init "My idea"   # Run in dev mode
```

**Stack:** TypeScript, Commander.js, Inquirer.js, Ora, Chalk, fs-extra, Handlebars, Zod, Jest, EventEmitter3.

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) and [ROADMAP.md](ROADMAP.md).

High-impact areas:
- ✦ **Custom executors** — Wire up real LLM providers (OpenAI, Anthropic, Ollama, Gemini, etc.)
- ✦ **New skill definitions** — Add YAML for additional engineering roles
- ✦ **Validation stages** — Extend the pipeline with new checks
- ✦ **Storage backends** — Add S3, DynamoDB, PostgreSQL adapters
- ✦ **UI dashboard** — Web interface for workflow visibility

---

## Show Your Support

<div align="center">

[![Star](https://img.shields.io/github/stars/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&label=★%20Star%20this%20repo)](https://github.com/forgephantom/Ai-skill-engineer/stargazers)
[![Fork](https://img.shields.io/github/forks/forgephantom/Ai-skill-engineer?style=for-the-badge&logo=github&label=Fork)](https://github.com/forgephantom/Ai-skill-engineer/forks)
[![Follow](https://img.shields.io/github/followers/forgephantom?style=for-the-badge&logo=github&label=Follow)](https://github.com/forgephantom)

</div>

**Starring the repo helps others discover this project and shows your appreciation.** Every star motivates continued development!

[![Star History Chart](https://api.star-history.com/svg?repos=forgephantom/Ai-skill-engineer&type=Date)](https://star-history.com/#forgephantom/Ai-skill-engineer&Date)

---

## License

[MIT](LICENSE) — Copyright (c) 2026 forgephantom. See [LICENSE](LICENSE) for full text.

---

## Legal Disclaimer

**AI Skill Engineer** is a development tool that generates code and project artifacts using AI models. By using this software:

1. **AI-generated code** — The output produced by this tool is generated by large language models and may contain errors, security vulnerabilities, or non-compliant code. You are responsible for reviewing, testing, and validating all generated output before deploying it to any production environment.

2. **No warranty** — The software is provided "AS IS", without warranty of any kind. The generated output is not guaranteed to be correct, secure, performant, or free of defects.

3. **`--no-human-approval`** — This flag bypasses the human review gate. Use it only for development/testing. For production use, always review generated code manually and ensure proper security and compliance checks.

4. **Third-party dependencies** — The generated project may include suggestions for third-party packages, libraries, or services. You are responsible for reviewing their licenses and terms of service.

5. **API keys** — You are responsible for all API usage and costs associated with your own API keys. The maintainer does not provide or manage API keys.

6. **Compliance** — You are solely responsible for ensuring that any project generated with this tool complies with all applicable laws, regulations, and industry standards.
