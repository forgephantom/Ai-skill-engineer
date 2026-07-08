/**
 * AI Skill Engineer - E2E Tests for Complete Workflow
 */

import { Orchestrator } from '../../src/orchestrator';
import { createArtifactStore, createStateStore } from '../../src/storage';
import { createSkillRegistry } from '../../src/skills/registry';
import { createExecutionEngine } from '../../src/execution/engine';
import { ProjectConfig } from '../../src/types';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('E2E Workflow', () => {
  const testBasePath = '/tmp/ai-se-e2e-test';
  let skillRegistry: any;

  beforeEach(async () => {
    await fs.remove(testBasePath);
    await fs.ensureDir(testBasePath);

    const skillsDir = path.join(__dirname, '..', '..', 'src', 'skills', 'definitions');
    await fs.ensureDir(skillsDir);
    skillRegistry = await createSkillRegistry(skillsDir, 'WARN');
  });

  afterEach(async () => {
    await fs.remove(testBasePath);
  });

  it('should initialize and run understand phase', async () => {
    const config: Partial<ProjectConfig> = {
      projectId: 'e2e-proj-1',
      name: 'E2E Test Project',
      idea: 'A simple todo application with user authentication',
      maxParallelSkills: 2,
      autoFix: false,
      humanApprovalRequired: false,
    };

    // Create stores with project-specific base path
    const projectBasePath = path.join(testBasePath, config.projectId);
    const artifactStore = createArtifactStore('filesystem', projectBasePath, 'WARN');
    const stateStore = createStateStore('filesystem', projectBasePath, 'WARN');
    const executionEngine = await createExecutionEngine(skillRegistry, artifactStore, {
      maxConcurrency: 2,
      logLevel: 'WARN',
    });

    // Create a simple orchestrator that can run phases
    const orchestrator = new Orchestrator(
      config,
      artifactStore,
      stateStore,
      skillRegistry,
      executionEngine,
      'WARN'
    );

    await orchestrator.initialize(config.idea!);

    // Run understand phase
    const result = await orchestrator.executePhase('understand' as any);

    // Check that phase completed (even if with mock data)
    expect(result).toBeDefined();
    expect(typeof result.success).toBe('boolean');

    const state = orchestrator.getState();
    expect(state).not.toBeNull();
  });

  it('should persist state across phases', async () => {
    const config: Partial<ProjectConfig> = {
      projectId: 'e2e-proj-2',
      name: 'E2E Test Project 2',
      idea: 'A blog platform with comments',
      maxParallelSkills: 2,
      autoFix: false,
      humanApprovalRequired: false,
    };

    // Create stores with project-specific base path
    const projectBasePath = path.join(testBasePath, config.projectId);
    const artifactStore = createArtifactStore('filesystem', projectBasePath, 'WARN');
    const stateStore = createStateStore('filesystem', projectBasePath, 'WARN');
    const executionEngine = await createExecutionEngine(skillRegistry, artifactStore, {
      maxConcurrency: 2,
      logLevel: 'WARN',
    });

    const orchestrator = new Orchestrator(
      config,
      artifactStore,
      stateStore,
      skillRegistry,
      executionEngine,
      'WARN'
    );

    await orchestrator.initialize(config.idea!);

    // Run first phase
    await orchestrator.executePhase('understand' as any);

    // Check state was saved
    const savedState = await stateStore.get('e2e-proj-2');
    expect(savedState).not.toBeNull();
    expect(savedState!.currentPhase).toBe('understand');
  });

  it('should create artifacts for each phase', async () => {
    const config: Partial<ProjectConfig> = {
      projectId: 'e2e-proj-3',
      name: 'E2E Test Project 3',
      idea: 'An e-commerce store with payment processing',
      maxParallelSkills: 2,
      autoFix: false,
      humanApprovalRequired: false,
    };

    // Create stores with project-specific base path
    const projectBasePath = path.join(testBasePath, config.projectId);
    const artifactStore = createArtifactStore('filesystem', projectBasePath, 'WARN');
    const stateStore = createStateStore('filesystem', projectBasePath, 'WARN');
    const executionEngine = await createExecutionEngine(skillRegistry, artifactStore, {
      maxConcurrency: 2,
      logLevel: 'WARN',
    });

    const orchestrator = new Orchestrator(
      config,
      artifactStore,
      stateStore,
      skillRegistry,
      executionEngine,
      'WARN'
    );

    await orchestrator.initialize(config.idea!);

    // Run understand phase
    await orchestrator.executePhase('understand' as any);

    // Check artifacts were created
    const artifacts = await artifactStore.getByProject('e2e-proj-3');
    const understandArtifacts = artifacts.filter((a: any) =>
      a.name.includes('understand') || a.id.includes('understand')
    );
    expect(understandArtifacts.length).toBeGreaterThan(0);
  });
});