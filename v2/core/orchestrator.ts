/*
 * AI Skill Engineer v2 - Orchestrator
 * Copyright (c) 2026 forgephantom
 * MIT License
 *
 * Runs the 10 phase pipeline. The key v2 change: each phase declares
 * exactly which prior phase outputs it needs (PHASE_INPUTS) instead of
 * receiving every previous output like v1's getAllPreviousOutputs did.
 * That removes the O(n^2) context growth. A small rolling digest keeps
 * every phase oriented without dumping full history.
 */

import { PhaseName, ScopedContext, SkillDef } from './types';
import { LLMExecutor, makeRef } from './engine';

export const PHASE_ORDER: PhaseName[] = [
  'understand',
  'plan',
  'discover-skills',
  'build',
  'review',
  'fix',
  'validate',
  'human-approval',
  'optimize',
  'deliver',
];

/**
 * The core token optimization. For each phase, the prior phases whose
 * outputs it genuinely needs. v1 passed all prior outputs to every
 * phase; v2 passes only what is declared here, plus a digest.
 */
export const PHASE_INPUTS: Record<PhaseName, PhaseName[]> = {
  'understand': [],
  'plan': ['understand'],
  'discover-skills': ['plan'],
  'build': ['plan', 'discover-skills'],
  'review': ['build'],
  'fix': ['review', 'build'],
  'validate': ['fix', 'build'],
  'human-approval': ['validate'],
  'optimize': ['validate', 'build'],
  'deliver': ['optimize', 'human-approval'],
};

/** Default skill roster per phase. The build phase fills this from the skill graph. */
export const PHASE_SKILLS: Record<PhaseName, string[]> = {
  'understand': ['business-analyst', 'product-strategist'],
  'plan': ['product-manager', 'solution-architect', 'technical-writer'],
  'discover-skills': ['skill-discovery-engine'],
  'build': [],
  'review': ['code-reviewer'],
  'fix': ['code-fixer'],
  'validate': ['validation-engine'],
  'human-approval': ['principal-engineer-simulator'],
  'optimize': ['optimization-engine'],
  'deliver': ['delivery-engineer'],
};

/** Rolling digest is hard capped near 300 tokens. */
export const DIGEST_MAX_CHARS = 1200;

export interface RunState {
  project: string;
  idea: string;
  decisions: string[];
  outputs: Partial<Record<PhaseName, Record<string, string>>>;
  artifacts: Map<string, string>;
  statuses: Partial<Record<PhaseName, 'pending' | 'running' | 'done' | 'failed'>>;
}

/**
 * Rolling digest: project, idea summary, recent decisions, completed
 * phases, current phase, and known artifact ids. Everything that fits
 * in the budget, newest information kept, oldest trimmed.
 */
export function buildDigest(state: RunState, phase: PhaseName): string {
  const parts: string[] = [
    `Project: ${state.project}.`,
    `Idea: ${state.idea.slice(0, 120)}.`,
  ];

  if (state.decisions.length > 0) {
    parts.push(`Decisions: ${state.decisions.slice(-5).join(' | ')}.`);
  }

  const done = PHASE_ORDER.filter((p) => state.statuses[p] === 'done');
  parts.push(`Done: ${done.join(', ') || 'none'}. Current: ${phase}.`);

  const names = [...state.artifacts.keys()].slice(0, 12);
  if (names.length > 0) {
    parts.push(`Artifacts: ${names.join(', ')}.`);
  }

  let digest = parts.join(' ');
  if (digest.length > DIGEST_MAX_CHARS) {
    digest = digest.slice(0, DIGEST_MAX_CHARS - 3) + '...';
  }
  return digest;
}

/**
 * Scope a phase context for one skill. Declared inputs are matched only
 * against the phases listed in PHASE_INPUTS, so a skill never pays for
 * output from a phase it does not depend on. Everything else becomes
 * an ArtifactRef.
 */
export function scopeContext(phase: PhaseName, skill: SkillDef, state: RunState): ScopedContext {
  const allowed = PHASE_INPUTS[phase];
  const inputs: Record<string, string> = {};

  for (const decl of skill.inputs) {
    for (const prior of allowed) {
      const out = state.outputs[prior];
      const content = out?.[decl.artifact_id];
      if (content !== undefined) {
        inputs[decl.artifact_id] = content;
        break;
      }
    }
    if (decl.required && inputs[decl.artifact_id] === undefined) {
      inputs[decl.artifact_id] = `[missing required input: ${decl.artifact_id}]`;
    }
  }

  const used = new Set(Object.keys(inputs));
  const refs = [...state.artifacts.entries()]
    .filter(([id]) => !used.has(id))
    .map(([id, content]) => makeRef(id, content));

  return { phase, digest: buildDigest(state, phase), inputs, refs };
}

/**
 * Minimal 10 phase runner. Each phase runs its skills, stores their
 * output under the declared artifact ids, and appends decisions to the
 * rolling digest state.
 */
export class Orchestrator {
  private executor: LLMExecutor;
  private registry: Map<string, SkillDef>;
  private buildSkills: string[];

  constructor(executor: LLMExecutor, registry: Map<string, SkillDef>, buildSkills: string[] = []) {
    this.executor = executor;
    this.registry = registry;
    this.buildSkills = buildSkills;
  }

  async run(idea: string, project = 'project'): Promise<RunState> {
    const state: RunState = {
      project,
      idea,
      decisions: [],
      outputs: {},
      artifacts: new Map(),
      statuses: {},
    };

    for (const phase of PHASE_ORDER) {
      const skillIds = phase === 'build' ? this.buildSkills : PHASE_SKILLS[phase];
      state.statuses[phase] = 'running';

      const phaseOutputs: Record<string, string> = {};
      for (const id of skillIds) {
        const skill = this.registry.get(id);
        if (!skill) continue;

        const ctx = scopeContext(phase, skill, state);
        const result = await this.executor.execute(skill, ctx);
        if (!result.success) {
          state.statuses[phase] = 'failed';
          throw new Error(`Phase ${phase} failed in skill ${id}: ${result.error}`);
        }

        for (const out of skill.outputs) {
          const content = result.output ?? '';
          phaseOutputs[out.artifact_id] = content;
          state.artifacts.set(out.artifact_id, content);
        }
      }

      state.outputs[phase] = phaseOutputs;
      state.statuses[phase] = 'done';
      state.decisions.push(`${phase}: ${skillIds.length} skill(s) completed.`);
    }

    return state;
  }
}
