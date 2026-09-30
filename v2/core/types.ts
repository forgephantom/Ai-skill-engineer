/*
 * AI Skill Engineer v2 - Core Types
 * Copyright (c) 2026 forgephantom
 * MIT License
 *
 * Minimal type surface for the v2 engine. v2 drops the large v1 type
 * graph in favor of plain string artifacts and scope-limited context.
 */

export type PhaseName =
  | 'understand'
  | 'plan'
  | 'discover-skills'
  | 'build'
  | 'review'
  | 'fix'
  | 'validate'
  | 'human-approval'
  | 'optimize'
  | 'deliver';

export interface SkillInputDecl {
  artifact_id: string;
  required: boolean;
}

export interface SkillOutputDecl {
  artifact_id: string;
}

/**
 * A skill definition in v2. Only fields that reach the prompt are kept.
 * Validation rules are referenced by stable ID (see validation-rules.md)
 * instead of being repeated in full per skill.
 */
export interface SkillDef {
  id: string;
  name: string;
  mission: string;
  inputs: SkillInputDecl[];
  outputs: SkillOutputDecl[];
  responsibilities: string[];
  validate: string[];
}

/**
 * A pointer to an artifact the skill does not declare as an input.
 * The skill sees id, content hash, size, and a short preview instead of
 * the full content. Full content is fetched on demand.
 */
export interface ArtifactRef {
  id: string;
  hash: string;
  bytes: number;
  preview: string;
}

/**
 * Everything a skill call is allowed to see: the current phase, a rolling
 * digest of the run so far, only the artifacts it declared as inputs, and
 * refs to everything else.
 */
export interface ScopedContext {
  phase: PhaseName;
  digest: string;
  inputs: Record<string, string>;
  refs: ArtifactRef[];
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
}

export interface SkillResult {
  success: boolean;
  output?: string;
  error?: string;
  usage?: TokenUsage;
}
