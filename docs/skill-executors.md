# Skill Executors — Connect AI Providers

Skills produce artifacts via **executors** — pluggable modules that implement the `SkillExecutor` interface. The framework ships with a stubbed `LLMExecutor`. To generate real output, implement executor files for your chosen AI provider.

---

## Architecture

```
skill.yaml                         executor.ts
┌─────────────────┐              ┌────────────────────────────┐
│ id: my-skill     │              │ class MyExecutor           │
│ model: claude-3  │───injects──►│   implements SkillExecutor  │
│ temperature: 0.3 │  config     │   execute(inputs, context) │
│ maxTokens: 8192  │              │     → SkillResult          │
└─────────────────┘              └────────────────────────────┘
                                          │
                                     OpenAI / Anthropic / Ollama / Gemini
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

## Provider Setup

### 1. Anthropic Claude (Recommended)

**Install:**
```bash
npm install @anthropic-ai/sdk
```

**Implementation:** `src/skills/definitions/ai-engineer/executor.ts`

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

**YAML config:**
```yaml
id: ai-engineer
name: AI Engineer
model: claude-3-5-sonnet-20241022
temperature: 0.3
maxTokens: 8192
```

**Environment variable:** `ANTHROPIC_API_KEY`

---

### 2. OpenAI / GPT-4

**Install:**
```bash
npm install openai
```

**Implementation:**
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

**Compatible with any OpenAI-compatible API** (Azure OpenAI, Together AI, Groq, etc.):

```typescript
this.client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT, // or https://api.groq.com/openai/v1
});
```

**Environment variable:** `OPENAI_API_KEY`

---

### 3. Ollama (Local, Free)

**No SDK needed** — uses `fetch` directly.

**Implementation:**
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

**Requirements:**
- [Ollama](https://ollama.ai) installed and running locally
- Model pulled: `ollama pull mistral`

---

### 4. Google Gemini

**Install:**
```bash
npm install @google/generative-ai
```

**Implementation:**
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

**Environment variable:** `GEMINI_API_KEY`

---

## Multi-Model Routing

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

## Quick Reference

| Provider | Install | Env Variable | Default Model |
|----------|---------|-------------|---------------|
| Anthropic | `npm install @anthropic-ai/sdk` | `ANTHROPIC_API_KEY` | `claude-3-5-sonnet-20241022` |
| OpenAI | `npm install openai` | `OPENAI_API_KEY` | `gpt-4-turbo` |
| Ollama | none (fetch API) | none | `mistral` |
| Google Gemini | `npm install @google/generative-ai` | `GEMINI_API_KEY` | `gemini-2.0-flash` |
| Azure OpenAI | `npm install openai` | `AZURE_OPENAI_KEY` + `AZURE_OPENAI_ENDPOINT` | `gpt-4` |

---

## Auto-Loading Executors

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

## Next Steps

- [Quick Start Guide](quickstart.md) — Run your first project
- [Custom Skills](custom-skills.md) — Create your own skill definitions
- [Workflow Phases](workflow-phases.md) — Understand the 10-phase pipeline
