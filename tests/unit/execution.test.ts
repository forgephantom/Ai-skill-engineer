/**
 * AI Skill Engineer - Unit Tests for Execution Engine
 */

import { ExecutionEngine, TemplateRenderer, TemplateBasedExecutor, LLMExecutor } from '../../src/execution/engine';
import { SkillRegistry } from '../../src/skills/registry';
import { createArtifactStore, createStateStore } from '../../src/storage';
import { Skill, SkillDefinition, SkillInput, SkillOutput, SkillResult, ExecutionContext, SkillGraph, Artifact, ArtifactStore } from '../../src/types';
import { generateId, createArtifact } from '../../src/utils';

// Mock SkillRegistry
class MockSkillRegistry extends SkillRegistry {
  private mockSkills: Map<string, Skill> = new Map();

  constructor() {
    super('/tmp', 'WARN');
  }

  registerMock(skill: Skill): void {
    this.mockSkills.set(skill.definition.id, skill);
  }

  getSkill(skillId: string): Skill | undefined {
    return this.mockSkills.get(skillId) || super.getSkill(skillId);
  }

  getSkillsByIds(skillIds: string[]): Skill[] {
    return skillIds.map(id => this.mockSkills.get(id)).filter((s): s is Skill => s !== undefined);
  }
}

// Mock ArtifactStore
class MockArtifactStore implements ArtifactStore {
  private artifacts: Map<string, Artifact> = new Map();

  async save(artifact: Artifact): Promise<void> {
    this.artifacts.set(artifact.id, artifact);
  }

  async get(id: string): Promise<Artifact | null> {
    return this.artifacts.get(id) || null;
  }

  async list(prefix?: string): Promise<Artifact[]> {
    let artifacts = Array.from(this.artifacts.values());
    if (prefix) {
      artifacts = artifacts.filter(a => a.id.startsWith(prefix));
    }
    return artifacts;
  }

  async delete(id: string): Promise<void> {
    this.artifacts.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.artifacts.has(id);
  }
}

describe('Execution Engine', () => {
  let skillRegistry: MockSkillRegistry;
  let artifactStore: MockArtifactStore;
  let executionEngine: ExecutionEngine;

  beforeEach(async () => {
    skillRegistry = new MockSkillRegistry();
    artifactStore = new MockArtifactStore();
    executionEngine = new ExecutionEngine(skillRegistry, artifactStore, 2, '/tmp/test-workspaces', 'WARN');
    await executionEngine.initialize();
  });

  describe('TemplateRenderer', () => {
    let renderer: TemplateRenderer;

    beforeEach(() => {
      renderer = new TemplateRenderer('/tmp/templates', 'WARN');
    });

    it('should render simple template', async () => {
      renderer.registerTemplate('test', 'Hello {{name}}!');
      const result = await renderer.render('test', { name: 'World' });
      expect(result).toBe('Hello World!');
    });

    it('should handle missing variables', async () => {
      renderer.registerTemplate('test', 'Hello {{name}}!');
      const result = await renderer.render('test', {});
      expect(result).toBe('Hello {{name}}!');
    });

    it('should handle conditionals', async () => {
      renderer.registerTemplate('test', '{{#if show}}Visible{{/if}}');
      const result1 = await renderer.render('test', { show: true });
      const result2 = await renderer.render('test', { show: false });
      expect(result1).toBe('Visible');
      expect(result2).toBe('<!-- conditional removed -->');
    });

    it('should throw on missing template', async () => {
      await expect(renderer.render('missing', {})).rejects.toThrow('Template not found');
    });
  });

  describe('TemplateBasedExecutor', () => {
    it('should execute with template renderer', async () => {
      const definition: SkillDefinition = {
        id: 'test-skill',
        name: 'Test Skill',
        version: '1.0.0',
        mission: 'Test',
        responsibilities: [],
        knowledgeAreas: [],
        inputs: [],
        outputs: [
          { artifactId: 'output1', contract: 'markdown', required: true, description: 'Output 1' },
        ],
        dependencies: [],
        bestPractices: [],
        validationRules: [],
        tools: [],
        successMetrics: [],
        templates: ['output1-template'],
      };

      const renderer = new TemplateRenderer('/tmp/templates', 'WARN');
      renderer.registerTemplate('output1-template', '# {{title}}\n\n{{content}}');

      const executor = new TemplateBasedExecutor(definition, renderer);
      const input: SkillInput = {
        artifacts: new Map(),
        config: {},
        context: {} as ExecutionContext,
      };

      const context: ExecutionContext = {
        projectId: 'proj-1',
        phase: 'test',
        config: {},
        artifacts: new Map(),
        previousOutputs: { title: 'Test Title', content: 'Test content' },
      };

      const result = await executor.execute(input, context);
      expect(result.success).toBe(true);
      expect(result.output?.artifacts).toHaveLength(1);
      expect(result.output?.artifacts[0].content).toContain('Test Title');
    });
  });

  describe('LLMExecutor', () => {
    it('should generate stub output', async () => {
      const definition: SkillDefinition = {
        id: 'test-skill',
        name: 'Test Skill',
        version: '1.0.0',
        mission: 'Test',
        responsibilities: [],
        knowledgeAreas: [],
        inputs: [],
        outputs: [
          { artifactId: 'output1', contract: 'markdown', required: true, description: 'Output 1' },
        ],
        dependencies: [],
        bestPractices: [],
        validationRules: [],
        tools: [],
        successMetrics: [],
        templates: [],
      };

      const executor = new LLMExecutor(definition, 'test-model');
      const input: SkillInput = {
        artifacts: new Map(),
        config: {},
        context: {} as ExecutionContext,
      };

      const context: ExecutionContext = {
        projectId: 'proj-1',
        phase: 'test',
        config: {},
        artifacts: new Map(),
        previousOutputs: {},
      };

      const result = await executor.execute(input, context);
      expect(result.success).toBe(true);
      expect(result.output?.artifacts).toHaveLength(1);
      expect(result.output?.artifacts[0].content).toContain('Generated by Test Skill');
    });
  });

  describe('ExecutionEngine', () => {
    it('should execute single skill', async () => {
      const mockSkill: Skill = {
        definition: {
          id: 'test-skill',
          name: 'Test Skill',
          version: '1.0.0',
          mission: 'Test',
          responsibilities: [],
          knowledgeAreas: [],
          inputs: [],
          outputs: [
            { artifactId: 'output1', contract: 'markdown', required: true, description: 'Output 1' },
          ],
          dependencies: [],
          bestPractices: [],
          validationRules: [],
          tools: [],
          successMetrics: [],
          templates: [],
        },
        executor: {
          execute: async () => ({
            success: true,
            output: {
              artifacts: [
                { id: 'test-output', type: 'markdown', name: 'output1', content: 'Test output', metadata: {} },
              ],
              metadata: {},
            },
            duration: 100,
          }),
        },
        config: {},
        validate: async () => ({ valid: true, errors: [], warnings: [] }),
        execute: async () => ({
          success: true,
          output: {
            artifacts: [
              { id: 'test-output', type: 'markdown', name: 'output1', content: 'Test output', metadata: {} },
            ],
            metadata: {},
          },
          duration: 100,
        }),
      };

      skillRegistry.registerMock(mockSkill);

      const context: ExecutionContext = {
        projectId: 'proj-1',
        phase: 'test',
        config: {},
        artifacts: new Map(),
        previousOutputs: {},
        workspace: '/tmp/workspace',
      };

      const result = await executionEngine.execute(mockSkill, context);
      expect(result.success).toBe(true);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should execute skills in parallel', async () => {
      const createMockSkill = (id: string): Skill => ({
        definition: {
          id,
          name: `Skill ${id}`,
          version: '1.0.0',
          mission: 'Test',
          responsibilities: [],
          knowledgeAreas: [],
          inputs: [],
          outputs: [{ artifactId: 'output', contract: 'markdown', required: true, description: 'Output' }],
          dependencies: [],
          bestPractices: [],
          validationRules: [],
          tools: [],
          successMetrics: [],
          templates: [],
        },
        executor: {
          execute: async () => ({
            success: true,
            output: { artifacts: [{ id: `${id}-output`, type: 'markdown', name: 'output', content: 'Test', metadata: {} }], metadata: {} },
            duration: 50,
          }),
        },
        config: {},
        validate: async () => ({ valid: true, errors: [], warnings: [] }),
        execute: async () => ({
          success: true,
          output: { artifacts: [{ id: `${id}-output`, type: 'markdown', name: 'output', content: 'Test', metadata: {} }], metadata: {} },
          duration: 50,
        }),
      });

      const skills = [createMockSkill('skill-1'), createMockSkill('skill-2'), createMockSkill('skill-3')];
      skills.forEach(s => skillRegistry.registerMock(s));

      const context: ExecutionContext = {
        projectId: 'proj-1',
        phase: 'test',
        config: {},
        artifacts: new Map(),
        previousOutputs: {},
        workspace: '/tmp/workspace',
      };

      const results = await executionEngine.executeParallel(skills, context);
      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should execute build phase with DAG', async () => {
      const createMockSkill = (id: string): Skill => ({
        definition: {
          id,
          name: `Skill ${id}`,
          version: '1.0.0',
          mission: 'Test',
          responsibilities: [],
          knowledgeAreas: [],
          inputs: [],
          outputs: [{ artifactId: 'output', contract: 'markdown', required: true, description: 'Output' }],
          dependencies: [],
          bestPractices: [],
          validationRules: [],
          tools: [],
          successMetrics: [],
          templates: [],
        },
        executor: {
          execute: async () => ({
            success: true,
            output: { artifacts: [{ id: `${id}-output`, type: 'markdown', name: 'output', content: 'Test', metadata: {} }], metadata: {} },
            duration: 50,
          }),
        },
        config: {},
        validate: async () => ({ valid: true, errors: [], warnings: [] }),
        execute: async () => ({
          success: true,
          output: { artifacts: [{ id: `${id}-output`, type: 'markdown', name: 'output', content: 'Test', metadata: {} }], metadata: {} },
          duration: 50,
        }),
      });

      const skills = [
        createMockSkill('skill-1'),
        createMockSkill('skill-2'),
        createMockSkill('skill-3'),
      ];
      skills.forEach(s => skillRegistry.registerMock(s));

      const skillGraph: SkillGraph = {
        skills: skills.map(s => s.definition),
        dependencyGraph: new Map([['skill-1', []], ['skill-2', ['skill-1']], ['skill-3', ['skill-1']]]),
        parallelGroups: [['skill-1'], ['skill-2', 'skill-3']],
        executionOrder: ['skill-1', 'skill-2', 'skill-3'],
        estimatedDuration: '1m',
        requiredTemplates: [],
      };

      const context: ExecutionContext = {
        projectId: 'proj-1',
        phase: 'build',
        config: {},
        artifacts: new Map(),
        previousOutputs: {},
        skillGraph,
        workspace: '/tmp/workspace',
      };

      const result = await executionEngine.executeBuild(skillGraph, context);
      expect(result.success).toBe(true);
      expect(result.artifacts.length).toBeGreaterThan(0);
    });
  });
});