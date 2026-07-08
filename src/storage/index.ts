/**
 * AI Skill Engineer - Storage Implementations
 *
 * Provides file-system based implementations for ArtifactStore and StateStore.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  Artifact,
  ArtifactStore,
  OrchestratorState,
  StateStore,
  PhaseName,
} from '../types';
import { createLogger, LogLevel, resolveArtifactPath } from '../utils';

// ============================================================================
// FileSystemArtifactStore
// ============================================================================

export class FileSystemArtifactStore implements ArtifactStore {
  private basePath: string;
  private projectId: string;
  private logger: ReturnType<typeof createLogger>;

  constructor(basePath: string, projectId: string, logLevel: LogLevel = 'INFO') {
    this.basePath = basePath;
    this.projectId = projectId;
    this.logger = createLogger(logLevel, 'ArtifactStore');
  }

  async save(artifact: Artifact): Promise<void> {
    const artifactPath = resolveArtifactPath(this.basePath, this.projectId, artifact.id);

    await fs.ensureDir(path.dirname(artifactPath));
    await fs.writeFile(artifactPath, JSON.stringify(artifact, null, 2));

    this.logger.debug(`Saved artifact: ${artifact.id}`, { path: artifactPath });
  }

  async get(id: string): Promise<Artifact | null> {
    // We need to search for the artifact across projects
    try {
      const projects = await fs.readdir(this.basePath);
      for (const project of projects) {
        const artifactPath = resolveArtifactPath(this.basePath, project, id);
        if (await fs.pathExists(artifactPath)) {
          const content = await fs.readFile(artifactPath, 'utf-8');
          return JSON.parse(content);
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  async list(prefix?: string): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];
    try {
      const projects = await fs.readdir(this.basePath);
      for (const project of projects) {
        const artifactsDir = path.join(this.basePath, project, 'artifacts');
        if (await fs.pathExists(artifactsDir)) {
          const files = await fs.readdir(artifactsDir);
          for (const file of files) {
            if (file.endsWith('.json') && (!prefix || file.startsWith(prefix))) {
              const content = await fs.readFile(path.join(artifactsDir, file), 'utf-8');
              artifacts.push(JSON.parse(content));
            }
          }
        }
      }
    } catch (error) {
      this.logger.warn('Failed to list artifacts', { error });
    }
    return artifacts;
  }

  async delete(id: string): Promise<void> {
    try {
      const projects = await fs.readdir(this.basePath);
      for (const project of projects) {
        const artifactPath = resolveArtifactPath(this.basePath, project, id);
        if (await fs.pathExists(artifactPath)) {
          await fs.remove(artifactPath);
          this.logger.debug(`Deleted artifact: ${id}`);
          return;
        }
      }
    } catch (error) {
      this.logger.warn('Failed to delete artifact', { id, error });
    }
  }

  async exists(id: string): Promise<boolean> {
    const artifact = await this.get(id);
    return artifact !== null;
  }

  async getByProject(projectId: string): Promise<Artifact[]> {
    const artifacts: Artifact[] = [];
    const artifactsDir = path.join(this.basePath, projectId, 'artifacts');
    if (await fs.pathExists(artifactsDir)) {
      const files = await fs.readdir(artifactsDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.readFile(path.join(artifactsDir, file), 'utf-8');
          artifacts.push(JSON.parse(content));
        }
      }
    }
    return artifacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

// ============================================================================
// FileSystemStateStore
// ============================================================================

export class FileSystemStateStore implements StateStore {
  private basePath: string;
  private logger: ReturnType<typeof createLogger>;

  constructor(basePath: string, logLevel: LogLevel = 'INFO') {
    this.basePath = basePath;
    this.logger = createLogger(logLevel, 'StateStore');
  }

  private getStatePath(projectId: string): string {
    return path.join(this.basePath, projectId, 'state.json');
  }

  async save(state: OrchestratorState): Promise<void> {
    const statePath = this.getStatePath(state.projectId);
    await fs.ensureDir(path.dirname(statePath));

    // Convert Map to object for serialization
    const serializableState = {
      ...state,
      artifacts: Object.fromEntries(state.artifacts),
      phases: state.phases.map(p => ({
        ...p,
        startedAt: p.startedAt?.toISOString(),
        completedAt: p.completedAt?.toISOString(),
      })),
      createdAt: state.createdAt.toISOString(),
      updatedAt: state.updatedAt.toISOString(),
    };

    await fs.writeFile(statePath, JSON.stringify(serializableState, null, 2));
    this.logger.debug(`Saved state for project: ${state.projectId}`);
  }

  async get(projectId: string): Promise<OrchestratorState | null> {
    const statePath = this.getStatePath(projectId);
    if (!(await fs.pathExists(statePath))) {
      return null;
    }

    try {
      const content = await fs.readFile(statePath, 'utf-8');
      const data = JSON.parse(content);

      // Convert back to Map and Date objects
      return {
        ...data,
        artifacts: new Map(Object.entries(data.artifacts || {})),
        phases: data.phases.map((p: any) => ({
          ...p,
          startedAt: p.startedAt ? new Date(p.startedAt) : undefined,
          completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
        })),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      this.logger.error('Failed to load state', { projectId, error });
      return null;
    }
  }

  async list(): Promise<OrchestratorState[]> {
    const states: OrchestratorState[] = [];
    try {
      const projects = await fs.readdir(this.basePath);
      for (const project of projects) {
        const projectPath = path.join(this.basePath, project);
        const statePath = path.join(projectPath, 'state.json');
        if (await fs.pathExists(statePath)) {
          const content = await fs.readFile(statePath, 'utf-8');
          const data = JSON.parse(content);
          states.push({
            ...data,
            artifacts: new Map(Object.entries(data.artifacts || {})),
            phases: data.phases.map((p: any) => ({
              ...p,
              startedAt: p.startedAt ? new Date(p.startedAt) : undefined,
              completedAt: p.completedAt ? new Date(p.completedAt) : undefined,
            })),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          });
        }
      }
    } catch (error) {
      this.logger.warn('Failed to list states', { error });
    }
    return states.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async delete(projectId: string): Promise<void> {
    const statePath = path.join(this.basePath, projectId, 'state.json');
    if (await fs.pathExists(statePath)) {
      await fs.remove(statePath);
      this.logger.debug(`Deleted state for project: ${projectId}`);
    }
  }

  async getLatest(): Promise<OrchestratorState | null> {
    const states = await this.list();
    return states[0] || null;
  }
}

// ============================================================================
// Memory Stores (for testing)
// ============================================================================

export class MemoryArtifactStore implements ArtifactStore {
  private artifacts: Map<string, Artifact> = new Map();

  async save(artifact: Artifact): Promise<void> {
    this.artifacts.set(artifact.id, artifact);
  }

  async get(id: string): Promise<Artifact | null> {
    return this.artifacts.get(id) || null;
  }

  async list(prefix?: string): Promise<Artifact[]> {
    const artifacts = Array.from(this.artifacts.values());
    if (prefix) {
      return artifacts.filter(a => a.id.startsWith(prefix));
    }
    return artifacts;
  }

  async delete(id: string): Promise<void> {
    this.artifacts.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.artifacts.has(id);
  }

  async getByProject(projectId: string): Promise<Artifact[]> {
    const artifacts = Array.from(this.artifacts.values());
    return artifacts.filter(a => a.metadata.tags?.includes(projectId) || a.createdBy === projectId);
  }

  clear(): void {
    this.artifacts.clear();
  }
}

export class MemoryStateStore implements StateStore {
  private states: Map<string, OrchestratorState> = new Map();

  async save(state: OrchestratorState): Promise<void> {
    this.states.set(state.projectId, { ...state });
  }

  async get(projectId: string): Promise<OrchestratorState | null> {
    return this.states.get(projectId) || null;
  }

  async list(): Promise<OrchestratorState[]> {
    return Array.from(this.states.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  async delete(projectId: string): Promise<void> {
    this.states.delete(projectId);
  }

  async getLatest(): Promise<OrchestratorState | null> {
    const states = await this.list();
    return states[0] || null;
  }

  clear(): void {
    this.states.clear();
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createArtifactStore(
  type: 'filesystem' | 'memory',
  basePath?: string,
  logLevel?: LogLevel
): ArtifactStore {
  switch (type) {
    case 'filesystem': {
      if (!basePath) throw new Error('basePath required for filesystem store');
      // Extract projectId from basePath (e.g., /output/proj-123 -> proj-123)
      const projectId = path.basename(basePath);
      return new FileSystemArtifactStore(basePath, projectId, logLevel);
    }
    case 'memory':
      return new MemoryArtifactStore();
    default:
      throw new Error(`Unknown artifact store type: ${type}`);
  }
}

export function createStateStore(
  type: 'filesystem' | 'memory',
  basePath?: string,
  logLevel?: LogLevel
): StateStore {
  switch (type) {
    case 'filesystem':
      if (!basePath) throw new Error('basePath required for filesystem store');
      return new FileSystemStateStore(basePath, logLevel);
    case 'memory':
      return new MemoryStateStore();
    default:
      throw new Error(`Unknown state store type: ${type}`);
  }
}

// Re-export interfaces for external use
export type { ArtifactStore, StateStore } from '../types';