/**
 * AI Skill Engineer - Unit Tests for Orchestrator
 */

import { Orchestrator, PHASE_ORDER, PHASE_CONFIGS } from '../../src/orchestrator';
import { createArtifactStore, createStateStore } from '../../src/storage';
import { createSkillRegistry } from '../../src/skills/registry';
import { createExecutionEngine } from '../../src/execution/engine';
import { ProjectConfig, OrchestratorConfigInput, PhaseName, PhaseStatus } from '../../src/types';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('Orchestrator', () => {
  const testBasePath = '/tmp/ai-se-test-orchestrator';
  let artifactStore: any;
  let stateStore: any;
  let skillRegistry: any;
  let executionEngine: any;

  beforeEach(async () => {
    await fs.remove(testBasePath);
    await fs.ensureDir(testBasePath);

    artifactStore = createArtifactStore('filesystem', testBasePath, 'WARN');
    stateStore = createStateStore('filesystem', testBasePath, 'WARN');

    const skillsDir = path.join(__dirname, '..', '..', 'src', 'skills', 'definitions');
    await fs.ensureDir(skillsDir);
    skillRegistry = await createSkillRegistry(skillsDir, 'WARN');

    executionEngine = await createExecutionEngine(skillRegistry, artifactStore, {
      maxConcurrency: 2,
      logLevel: 'WARN',
    });
  });

  afterEach(async () => {
    await fs.remove(testBasePath);
  });

  describe('Phase Configuration', () => {
    it('should have all 10 phases in order', () => {
      expect(PHASE_ORDER).toHaveLength(10);
      expect(PHASE_ORDER).toEqual([
        'understand', 'plan', 'discover-skills', 'build',
        'review', 'fix', 'validate', 'human-approval',
        'optimize', 'deliver',
      ]);
    });

    it('should have config for each phase', () => {
      for (const phaseName of PHASE_ORDER) {
        expect(PHASE_CONFIGS[phaseName]).toBeDefined();
        expect(PHASE_CONFIGS[phaseName].name).toBe(phaseName);
        expect(PHASE_CONFIGS[phaseName].displayName).toBeDefined();
        expect(PHASE_CONFIGS[phaseName].description).toBeDefined();
      }
    });

    it('should have required skills for each phase', () => {
      for (const phaseName of PHASE_ORDER) {
        const config = PHASE_CONFIGS[phaseName];
        expect(config.requiredSkills).toBeDefined();
        expect(Array.isArray(config.requiredSkills)).toBe(true);
      }
    });
  });

  describe('Orchestrator Initialization', () => {
    it('should create initial state', async () => {
      const config: Partial<ProjectConfig> = {
        projectId: 'test-proj-1',
        name: 'Test Project',
        idea: 'Test idea',
      };

      const orchestrator = await createOrchestrator(
        config,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        'WARN'
      );

      const state = orchestrator.getState();
      expect(state).not.toBeNull();
      expect(state!.projectId).toBe('test-proj-1');
      expect(state!.name).toBe('Test Project');
      expect(state!.idea).toBe('Test idea');
      expect(state!.currentPhase).toBe('understand');
      expect(state!.phases).toHaveLength(10);
      expect(state!.phases.every(p => p.status === 'pending')).toBe(true);
    });

    it('should emit initialized event', async () => {
      const config: Partial<ProjectConfig> = {
        projectId: 'test-proj-2',
        name: 'Test Project 2',
        idea: 'Test idea 2',
      };

      const orchestrator = await createOrchestrator(
        config,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        'WARN'
      );

      let initialized = false;
      orchestrator.on('initialized', () => { initialized = true; });

      // Re-initialize to trigger event
      await orchestrator.initialize(config.idea!);
      expect(initialized).toBe(true);
    });
  });

  describe('Phase Execution', () => {
    it('should track phase status changes', async () => {
      const config: Partial<ProjectConfig> = {
        projectId: 'test-proj-3',
        name: 'Test Project 3',
        idea: 'Test idea 3',
      };

      const orchestrator = await createOrchestrator(
        config,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        'WARN'
      );

      // Check initial phase statuses
      const state = orchestrator.getState();
      expect(state!.phases.find(p => p.name === 'understand')?.status).toBe('pending');
    });
  });

  describe('State Persistence', () => {
    it('should save and load state', async () => {
      const config: Partial<ProjectConfig> = {
        projectId: 'test-proj-4',
        name: 'Test Project 4',
        idea: 'Test idea 4',
      };

      const orchestrator = await createOrchestrator(
        config,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        'WARN'
      );

      // Update phase status
      const state = orchestrator.getState()!;
      state.currentPhase = 'plan';
      const phase = state.phases.find(p => p.name === 'understand');
      if (phase) phase.status = 'completed';

      await stateStore.save(state);

      // Load state
      const loaded = await stateStore.get('test-proj-4');
      expect(loaded).not.toBeNull();
      expect(loaded!.currentPhase).toBe('plan');
      expect(loaded!.phases.find(p => p.name === 'understand')?.status).toBe('completed');
    });
  });

  describe('Artifact Management', () => {
    it('should save phase artifacts', async () => {
      const config: Partial<ProjectConfig> = {
        projectId: 'test-proj-5',
        name: 'Test Project 5',
        idea: 'Test idea 5',
      };

      const orchestrator = await createOrchestrator(
        config,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        'WARN'
      );

      // Access private method through state
      const state = orchestrator.getState()!;
      const testOutput = { test: 'data' };

      // Save artifact manually to test
      const artifact: any = {
        id: 'test-artifact-1',
        type: 'phase-output',
        name: 'test-output',
        content: JSON.stringify(testOutput),
        metadata: {
          format: 'json',
          size: JSON.stringify(testOutput).length,
          checksum: '',
          tags: ['test', 'output'],
          dependencies: [],
        },
        version: '1.0.0',
        createdBy: 'orchestrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await artifactStore.save(artifact);
      const retrieved = await artifactStore.get(artifact.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved!.content).toContain('test');
    });
  });

  describe('Configuration', () => {
    it('should use default config values', async () => {
      const config: Partial<ProjectConfig> = {
        projectId: 'test-proj-6',
        name: 'Test Project 6',
        idea: 'Test idea 6',
      };

      const orchestrator = await createOrchestrator(
        config,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        'WARN'
      );

      const orchConfig = orchestrator.getConfig();
      expect(orchConfig.maxParallelSkills).toBe(4);
      expect(orchConfig.autoFix).toBe(true);
      expect(orchConfig.humanApprovalRequired).toBe(true);
      expect(orchConfig.validationLevel).toBe('strict');
    });

    it('should override config with provided values', async () => {
      const config: Partial<ProjectConfig> = {
        projectId: 'test-proj-7',
        name: 'Test Project 7',
        idea: 'Test idea 7',
        maxParallelSkills: 8,
        autoFix: false,
        humanApprovalRequired: false,
      };

      const orchestrator = await createOrchestrator(
        config,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        'WARN'
      );

      const orchConfig = orchestrator.getConfig();
      expect(orchConfig.maxParallelSkills).toBe(8);
      expect(orchConfig.autoFix).toBe(false);
      expect(orchConfig.humanApprovalRequired).toBe(false);
    });
  });
});

// Helper function to create orchestrator
async function createOrchestrator(
  config: Partial<ProjectConfig>,
  artifactStore: any,
  stateStore: any,
  skillRegistry: any,
  executionEngine: any,
  logLevel: any
): Promise<any> {
  const orchestrator = new Orchestrator(
    config,
    artifactStore,
    stateStore,
    skillRegistry,
    executionEngine,
    logLevel
  );

  await orchestrator.initialize(config.idea || '');
  return orchestrator;
}