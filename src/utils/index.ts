/**
 * AI Skill Engineer - Utility Functions
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { Artifact, ArtifactMetadata } from '../types';

// ============================================================================
// File System Utilities
// ============================================================================

export async function ensureDir(dir: string): Promise<void> {
  await fs.ensureDir(dir);
}

export async function writeFileSafe(filePath: string, content: string | Buffer): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

export async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function listFiles(dir: string, pattern?: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  if (pattern) {
    const regex = new RegExp(pattern);
    return files.filter(f => regex.test(f));
  }
  return files;
}

export async function copyDir(src: string, dest: string): Promise<void> {
  await fs.ensureDir(dest);
  await fs.copy(src, dest);
}

export async function removeDir(dir: string): Promise<void> {
  await fs.remove(dir);
}

// ============================================================================
// ID and Hash Utilities
// ============================================================================

export function generateId(prefix?: string): string {
  const id = uuidv4();
  return prefix ? `${prefix}-${id}` : id;
}

export function generateProjectId(): string {
  return `proj-${uuidv4().slice(0, 8)}`;
}

export function generateArtifactId(type: string, name: string): string {
  const hash = crypto.createHash('md5').update(`${type}-${name}-${Date.now()}`).digest('hex').slice(0, 8);
  return `${type}-${name}-${hash}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

export function calculateChecksum(content: string | Buffer): string {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function calculateSize(content: string | Buffer): number {
  return Buffer.isBuffer(content) ? content.length : Buffer.byteLength(content);
}

// ============================================================================
// Artifact Utilities
// ============================================================================

export function createArtifact(
  type: string,
  name: string,
  content: string | object,
  format: string,
  createdBy: string,
  schema?: string,
  tags: string[] = [],
  dependencies: string[] = []
): Artifact {
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const metadata: ArtifactMetadata = {
    schema,
    format,
    size: calculateSize(contentStr),
    checksum: calculateChecksum(contentStr),
    tags,
    dependencies,
  };

  return {
    id: generateArtifactId(type, name),
    type,
    name,
    content: contentStr,
    metadata,
    version: '1.0.0',
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function updateArtifact(artifact: Artifact, content: string | object): Artifact {
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  return {
    ...artifact,
    content: contentStr,
    metadata: {
      ...artifact.metadata,
      size: calculateSize(contentStr),
      checksum: calculateChecksum(contentStr),
    },
    version: incrementVersion(artifact.version),
    updatedAt: new Date(),
  };
}

function incrementVersion(version: string): string {
  const parts = version.split('.').map(Number);
  parts[2] += 1;
  return parts.join('.');
}

// ============================================================================
// Template Utilities
// ============================================================================

export function extractTemplateVariables(template: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables = new Set<string>();
  let match;
  while ((match = regex.exec(template)) !== null) {
    const capture = match[1];
    if (capture) {
      const parts = capture.trim().split(' ');
      const varName = parts[0];
      if (varName && !varName.startsWith('#') && !varName.startsWith('/') && !varName.startsWith('^') && !varName.startsWith('>')) {
        variables.add(varName);
      }
    }
  }
  return Array.from(variables);
}

export function validateTemplateVariables(template: string, variables: Record<string, any>): string[] {
  const required = extractTemplateVariables(template);
  const missing = required.filter(v => !(v in variables));
  return missing;
}

// ============================================================================
// Time and Duration Utilities
// ============================================================================

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

export function parseDuration(str: string): number {
  const match = str.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m|h)$/i);
  if (!match || !match[1] || !match[2]) throw new Error(`Invalid duration format: ${str}`);
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  switch (unit) {
    case 'ms': return value;
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    default: throw new Error(`Invalid duration unit: ${unit}`);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Retry Utilities
// ============================================================================

export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors?: string[];
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === options.maxAttempts) break;
      if (options.retryableErrors && !options.retryableErrors.some(e => lastError.message.includes(e))) {
        throw lastError;
      }
      const delay = Math.min(
        options.baseDelay * Math.pow(options.backoffFactor, attempt - 1),
        options.maxDelay
      );
      await sleep(delay);
    }
  }
  throw lastError!;
}

// ============================================================================
// Parallel Execution Utilities
// ============================================================================

export interface ParallelOptions<T> {
  concurrency: number;
  onProgress?: (completed: number, total: number) => void;
}

export async function parallelMap<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  options: ParallelOptions<T>
): Promise<R[]> {
  const results = new Map<number, R>();
  const executing: Promise<void>[] = [];
  let completed = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const promise = fn(item, i).then(result => {
      results.set(i, result);
      completed++;
      options.onProgress?.(completed, items.length);
    });

    executing.push(promise);

    if (executing.length >= options.concurrency) {
      await Promise.race(executing);
      // Remove completed promises
      const done = executing.filter(p => p);
      // This is a simplified version - in reality we'd track which completed
    }
  }

  await Promise.all(executing);

  // Convert Map to array in correct order
  const finalResults: R[] = [];
  for (let i = 0; i < items.length; i++) {
    const value = results.get(i);
    if (value !== undefined) {
      finalResults.push(value);
    }
  }
  return finalResults;
}

export async function parallelAll<T>(
  fns: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const queue = [...fns];
  const running: Promise<void>[] = [];

  async function runNext() {
    if (queue.length === 0) return;
    const fn = queue.shift()!;
    const promise = fn().then(result => {
      results.push(result);
    });
    running.push(promise);
    try {
      await promise;
    } finally {
      const idx = running.indexOf(promise);
      if (idx >= 0) running.splice(idx, 1);
      if (queue.length > 0) await runNext();
    }
  }

  const starters = Array(Math.min(concurrency, fns.length)).fill(null).map(() => runNext());
  await Promise.all(starters);
  await Promise.all(running);
  return results;
}

// ============================================================================
// Logging Utilities
// ============================================================================

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface Logger {
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
}

export function createLogger(level: LogLevel = 'INFO', prefix?: string): Logger {
  const levels: Record<LogLevel, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
  const currentLevel = levels[level];

  function log(logLevel: LogLevel, message: string, meta?: any) {
    if (levels[logLevel] < currentLevel) return;
    const timestamp = new Date().toISOString();
    const prefixStr = prefix ? `[${prefix}] ` : '';
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    const method = logLevel === 'DEBUG' ? 'log' : logLevel.toLowerCase();
    (console as any)[method](
      `${timestamp} ${logLevel} ${prefixStr}${message}${metaStr}`
    );
  }

  return {
    debug: (msg: string, meta?: any) => log('DEBUG', msg, meta),
    info: (msg: string, meta?: any) => log('INFO', msg, meta),
    warn: (msg: string, meta?: any) => log('WARN', msg, meta),
    error: (msg: string, meta?: any) => log('ERROR', msg, meta),
  };
}

// ============================================================================
// Validation Utilities
// ============================================================================

export function validateRequired(obj: any, fields: string[]): string[] {
  const missing: string[] = [];
  for (const field of fields) {
    const value = field.split('.').reduce((o, k) => o?.[k], obj);
    if (value === undefined || value === null || value === '') {
      missing.push(field);
    }
  }
  return missing;
}

export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// ============================================================================
// YAML/JSON Utilities
// ============================================================================

import * as yaml from 'yaml';

export function parseYaml(content: string): any {
  return yaml.parse(content);
}

export function stringifyYaml(obj: any): string {
  return yaml.stringify(obj, { indent: 2, lineWidth: 120 });
}

export function parseJsonSafe(content: string): any {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function stringifyJson(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

// ============================================================================
// Path Utilities
// ============================================================================

export function resolveWorkspacePath(base: string, projectId: string, skillId?: string): string {
  const parts = [base, projectId];
  if (skillId) parts.push(skillId);
  return path.resolve(...parts);
}

export function resolveArtifactPath(base: string, projectId: string, artifactId: string): string {
  return path.resolve(base, projectId, 'artifacts', `${artifactId}.json`);
}

// ============================================================================
// Error Handling
// ============================================================================

export class AISEError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = false,
    public context?: any
  ) {
    super(message);
    this.name = 'AISEError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PhaseError extends AISEError {
  constructor(
    message: string,
    public phase: string,
    recoverable: boolean = true,
    context?: any
  ) {
    super(message, `PHASE_${phase.toUpperCase()}_ERROR`, recoverable, context);
    this.name = 'PhaseError';
  }
}

export class SkillError extends AISEError {
  constructor(
    message: string,
    public skillId: string,
    recoverable: boolean = true,
    context?: any
  ) {
    super(message, `SKILL_${skillId.toUpperCase()}_ERROR`, recoverable, context);
    this.name = 'SkillError';
  }
}

export class ValidationError extends AISEError {
  constructor(
    message: string,
    public stage: string,
    context?: any
  ) {
    super(message, `VALIDATION_${stage.toUpperCase()}_ERROR`, false, context);
    this.name = 'ValidationError';
  }
}

export class ArtifactError extends AISEError {
  constructor(
    message: string,
    public artifactId: string,
    context?: any
  ) {
    super(message, `ARTIFACT_ERROR`, false, context);
    this.name = 'ArtifactError';
  }
}

// ============================================================================
// Result Type
// ============================================================================

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) return result.value;
  throw result.error;
}

export function unwrapErr<T, E>(result: Result<T, E>): E {
  if (!result.ok) return result.error;
  throw new Error('Expected error result');
}