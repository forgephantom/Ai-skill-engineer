/**
 * AI Skill Engineer - Unit Tests for Storage
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { FileSystemArtifactStore, FileSystemStateStore, MemoryArtifactStore, MemoryStateStore } from '../../src/storage';
import { Artifact, OrchestratorState, PhaseName, PhaseStatus } from '../../src/types';
import { generateId, createArtifact } from '../../src/utils';

describe('Storage', () => {
  const testBasePath = '/tmp/ai-se-test-storage';

  beforeEach(async () => {
    await fs.remove(testBasePath);
    await fs.ensureDir(testBasePath);
  });

  afterEach(async () => {
    await fs.remove(testBasePath);
  });

  describe('FileSystemArtifactStore', () => {
    let store: FileSystemArtifactStore;

    beforeEach(() => {
      store = new FileSystemArtifactStore(testBasePath, 'proj-test', 'WARN');
    });

    it('should save and retrieve artifact', async () => {
      const artifact = createArtifact('code', 'test.ts', 'content', 'typescript', 'test-skill');
      await store.save(artifact);

      const retrieved = await store.get(artifact.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(artifact.id);
      expect(retrieved!.content).toBe('content');
    });

    it('should return null for non-existent artifact', async () => {
      const retrieved = await store.get('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should list artifacts', async () => {
      const artifact1 = createArtifact('code', 'test1.ts', 'content1', 'typescript', 'skill1');
      const artifact2 = createArtifact('code', 'test2.ts', 'content2', 'typescript', 'skill2');
      await store.save(artifact1);
      await store.save(artifact2);

      const artifacts = await store.list();
      expect(artifacts).toHaveLength(2);
    });

    it('should list artifacts with prefix', async () => {
      const artifact1 = createArtifact('code', 'test1.ts', 'content1', 'typescript', 'skill1');
      const artifact2 = createArtifact('code', 'other.ts', 'content2', 'typescript', 'skill2');
      await store.save(artifact1);
      await store.save(artifact2);

      const artifacts = await store.list('code-test1');
      expect(artifacts).toHaveLength(1);
    });

    it('should delete artifact', async () => {
      const artifact = createArtifact('code', 'test.ts', 'content', 'typescript', 'test-skill');
      await store.save(artifact);

      await store.delete(artifact.id);
      const retrieved = await store.get(artifact.id);
      expect(retrieved).toBeNull();
    });

    it('should check existence', async () => {
      const artifact = createArtifact('code', 'test.ts', 'content', 'typescript', 'test-skill');
      expect(await store.exists(artifact.id)).toBe(false);

      await store.save(artifact);
      expect(await store.exists(artifact.id)).toBe(true);
    });

    it('should get artifacts by project', async () => {
      const artifact = createArtifact('code', 'test.ts', 'content', 'typescript', 'test-skill');
      await store.save(artifact);

      const artifacts = await store.getByProject('proj-test');
      expect(artifacts.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('FileSystemStateStore', () => {
    let store: FileSystemStateStore;

    beforeEach(() => {
      store = new FileSystemStateStore(testBasePath, 'WARN');
    });

    it('should save and retrieve state', async () => {
      const state: OrchestratorState = {
        projectId: 'proj-1',
        name: 'Test Project',
        description: 'Test',
        idea: 'Test idea',
        currentPhase: 'UNDERSTAND' as PhaseName,
        phases: [
          { name: 'UNDERSTAND' as PhaseName, status: 'COMPLETED' as PhaseStatus },
          { name: 'PLAN' as PhaseName, status: 'PENDING' as PhaseStatus },
        ],
        artifacts: new Map(),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        config: {
          maxRetries: 3,
          phaseTimeout: 300000,
          parallelExecution: true,
          autoFix: true,
          humanApprovalRequired: true,
          optimizationEnabled: true,
          outputDirectory: './output',
          logLevel: 'INFO',
        },
      };

      await store.save(state);
      const retrieved = await store.get('proj-1');

      expect(retrieved).not.toBeNull();
      expect(retrieved!.projectId).toBe('proj-1');
      expect(retrieved!.currentPhase).toBe('UNDERSTAND');
      expect(retrieved!.phases).toHaveLength(2);
      expect(retrieved!.artifacts).toBeInstanceOf(Map);
    });

    it('should return null for non-existent state', async () => {
      const retrieved = await store.get('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should list states', async () => {
      const state1: OrchestratorState = {
        projectId: 'proj-1',
        name: 'Project 1',
        description: '',
        idea: '',
        currentPhase: 'UNDERSTAND' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        config: {} as any,
      };
      const state2: OrchestratorState = {
        projectId: 'proj-2',
        name: 'Project 2',
        description: '',
        idea: '',
        currentPhase: 'PLAN' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        config: {} as any,
      };

      await store.save(state1);
      await store.save(state2);

      const states = await store.list();
      expect(states).toHaveLength(2);
      expect(states[0].projectId).toBe('proj-2'); // Sorted by updatedAt desc
    });

    it('should delete state', async () => {
      const state: OrchestratorState = {
        projectId: 'proj-1',
        name: 'Test',
        description: '',
        idea: '',
        currentPhase: 'UNDERSTAND' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
        config: {} as any,
      };

      await store.save(state);
      await store.delete('proj-1');
      const retrieved = await store.get('proj-1');
      expect(retrieved).toBeNull();
    });

    it('should get latest state', async () => {
      const state1: OrchestratorState = {
        projectId: 'proj-1',
        name: 'Project 1',
        description: '',
        idea: '',
        currentPhase: 'UNDERSTAND' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        config: {} as any,
      };
      const state2: OrchestratorState = {
        projectId: 'proj-2',
        name: 'Project 2',
        description: '',
        idea: '',
        currentPhase: 'PLAN' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        config: {} as any,
      };

      await store.save(state1);
      await store.save(state2);

      const latest = await store.getLatest();
      expect(latest).not.toBeNull();
      expect(latest!.projectId).toBe('proj-2');
    });
  });

  describe('MemoryArtifactStore', () => {
    let store: MemoryArtifactStore;

    beforeEach(() => {
      store = new MemoryArtifactStore();
    });

    it('should save and retrieve artifact', async () => {
      const artifact = createArtifact('code', 'test.ts', 'content', 'typescript', 'test-skill');
      await store.save(artifact);

      const retrieved = await store.get(artifact.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.content).toBe('content');
    });

    it('should list artifacts', async () => {
      const artifact1 = createArtifact('code', 'test1.ts', 'content1', 'typescript', 'skill1');
      const artifact2 = createArtifact('code', 'test2.ts', 'content2', 'typescript', 'skill2');
      await store.save(artifact1);
      await store.save(artifact2);

      const artifacts = await store.list();
      expect(artifacts).toHaveLength(2);
    });

    it('should delete artifact', async () => {
      const artifact = createArtifact('code', 'test.ts', 'content', 'typescript', 'test-skill');
      await store.save(artifact);

      await store.delete(artifact.id);
      expect(await store.exists(artifact.id)).toBe(false);
    });

    it('should clear all artifacts', async () => {
      const artifact = createArtifact('code', 'test.ts', 'content', 'typescript', 'test-skill');
      await store.save(artifact);

      store.clear();
      expect(await store.list()).toHaveLength(0);
    });
  });

  describe('MemoryStateStore', () => {
    let store: MemoryStateStore;

    beforeEach(() => {
      store = new MemoryStateStore();
    });

    it('should save and retrieve state', async () => {
      const state: OrchestratorState = {
        projectId: 'proj-1',
        name: 'Test',
        description: '',
        idea: '',
        currentPhase: 'UNDERSTAND' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
        config: {} as any,
      };

      await store.save(state);
      const retrieved = await store.get('proj-1');
      expect(retrieved).not.toBeNull();
    });

    it('should list states sorted by updatedAt', async () => {
      const state1: OrchestratorState = {
        projectId: 'proj-1',
        name: 'Project 1',
        description: '',
        idea: '',
        currentPhase: 'UNDERSTAND' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        config: {} as any,
      };
      const state2: OrchestratorState = {
        projectId: 'proj-2',
        name: 'Project 2',
        description: '',
        idea: '',
        currentPhase: 'PLAN' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        config: {} as any,
      };

      await store.save(state1);
      await store.save(state2);

      const states = await store.list();
      expect(states[0].projectId).toBe('proj-2');
    });

    it('should clear all states', async () => {
      const state: OrchestratorState = {
        projectId: 'proj-1',
        name: 'Test',
        description: '',
        idea: '',
        currentPhase: 'UNDERSTAND' as PhaseName,
        phases: [],
        artifacts: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
        config: {} as any,
      };

      await store.save(state);
      store.clear();
      expect(await store.list()).toHaveLength(0);
    });
  });
});