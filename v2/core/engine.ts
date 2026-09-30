/*
 * AI Skill Engineer v2 - Execution Engine
 * Copyright (c) 2026 forgephantom
 * MIT License
 *
 * Runs one skill against one LLM call. v2 keeps every prompt small:
 * the system prompt is capped around 300 tokens, universal guidance is
 * injected once per phase, and skills see only their declared inputs.
 * Everything else arrives as compact artifact references.
 */

import { SkillDef, ScopedContext, SkillResult, ArtifactRef } from './types';

/**
 * Universal engineering guidance. Injected once per phase, not repeated
 * in every skill's system prompt like v1 did with bestPractices.
 */
export const CORE_GUIDELINES =
  'Write clean, minimal, working output. Prefer the smallest design that ' +
  'meets the requirements and match the patterns already in use. Keep ' +
  'functions short and types explicit. Handle errors at boundaries and ' +
  'never swallow them. Add tests only for behavior you can state in one ' +
  'sentence. Never add comments that restate the code, never add a ' +
  'dependency without a stated reason, and never pad output. Stop when ' +
  'the requirements are met.';

/** Maximum responsibilities kept in a system prompt. */
export const MAX_PROMPT_RESPONSIBILITIES = 5;

/** Length of the artifact preview carried in an ArtifactRef. */
export const REF_PREVIEW_LENGTH = 200;

/**
 * Compact system prompt for one skill. One line of role plus mission,
 * up to five responsibilities, the output artifact ids, and rule IDs.
 * Validation rule text lives in validation-rules.md, not in the prompt.
 */
export function buildSystemPrompt(skill: SkillDef): string {
  const lines: string[] = [];
  lines.push(`${skill.name}: ${skill.mission}`);
  lines.push('Do:');
  skill.responsibilities
    .slice(0, MAX_PROMPT_RESPONSIBILITIES)
    .forEach((r, i) => lines.push(`${i + 1}. ${r}`));
  lines.push(`Out: ${skill.outputs.map((o) => o.artifact_id).join(', ') || 'none'}`);
  lines.push(`Rules: ${skill.validate.join(', ') || 'none'}`);
  lines.push('Follow CORE_GUIDELINES.');
  return lines.join('\n');
}

/**
 * Build an ArtifactRef for stored content: short hash, byte size, and a
 * 200 character preview. Lets the model decide if it needs the full text.
 */
export function makeRef(id: string, content: string): ArtifactRef {
  return {
    id,
    hash: fnv1a(content),
    bytes: Buffer.byteLength(content, 'utf-8'),
    preview: content.slice(0, REF_PREVIEW_LENGTH),
  };
}

/** FNV-1a 32 bit hash, hex encoded. No dependency needed. */
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export interface ExecutorOptions {
  model: string;
  endpoint?: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Calls an OpenAI-compatible chat completions endpoint with the compact
 * system prompt plus the scoped user message. Uses the global fetch, so
 * there are no runtime dependencies.
 */
export class LLMExecutor {
  private model: string;
  private endpoint: string;
  private apiKey: string;
  private temperature: number;
  private maxTokens: number;

  constructor(options: ExecutorOptions) {
    this.model = options.model;
    const base = (
      options.endpoint ||
      process.env.OPENAI_BASE_URL ||
      'https://api.openai.com/v1'
    ).replace(/\/$/, '');
    this.endpoint = `${base}/chat/completions`;
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || '';
    this.temperature = options.temperature ?? 0.3;
    this.maxTokens = options.maxTokens ?? 8192;
  }

  async execute(skill: SkillDef, ctx: ScopedContext): Promise<SkillResult> {
    const system = `${buildSystemPrompt(skill)}\n\n${CORE_GUIDELINES}`;
    const user = this.buildUserMessage(ctx);

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
      });

      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}: ${await res.text()}` };
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };

      const content = data.choices?.[0]?.message?.content ?? '';
      const result: SkillResult = { success: true, output: content };
      if (data.usage) {
        result.usage = {
          promptTokens: data.usage.prompt_tokens ?? 0,
          completionTokens: data.usage.completion_tokens ?? 0,
        };
      }
      return result;
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /**
   * User message carries only what the skill declared: phase, digest,
   * full content of declared inputs, and refs for everything else.
   */
  private buildUserMessage(ctx: ScopedContext): string {
    const parts: string[] = [`Phase: ${ctx.phase}`, `Digest: ${ctx.digest}`];

    for (const [id, content] of Object.entries(ctx.inputs)) {
      parts.push(`--- ${id} ---\n${content}`);
    }

    if (ctx.refs.length > 0) {
      const refLines = ctx.refs
        .map((r) => `- ${r.id} [${r.hash}] ${r.bytes} bytes: ${r.preview}`)
        .join('\n');
      parts.push(`Known artifacts (use the id if you need full content):\n${refLines}`);
    }

    return parts.join('\n\n');
  }
}
