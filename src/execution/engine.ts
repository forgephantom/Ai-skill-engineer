/**
 * AI Skill Engineer - Execution Engine
 *
 * Executes skills in dependency order with parallelization support.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  Skill,
  SkillDefinition,
  SkillInput,
  SkillOutput,
  SkillResult,
  ExecutionContext,
  SkillGraph,
  Artifact,
  ArtifactStore,
} from '../types';
import { SkillRegistry } from '../skills/registry';
import { createLogger, LogLevel, ensureDir, generateId, calculateChecksum, parallelAll, sleep } from '../utils';

// ============================================================================
// Execution Engine
// ============================================================================

export class ExecutionEngine {
  private skillRegistry: SkillRegistry;
  private artifactStore: ArtifactStore;
  private logger: ReturnType<typeof createLogger>;
  private maxConcurrency: number;
  private workspacesDir: string;

  constructor(
    skillRegistry: SkillRegistry,
    artifactStore: ArtifactStore,
    maxConcurrency: number = 4,
    workspacesDir: string = '.ai-se/workspaces',
    logLevel: LogLevel = 'INFO'
  ) {
    this.skillRegistry = skillRegistry;
    this.artifactStore = artifactStore;
    this.maxConcurrency = maxConcurrency;
    this.workspacesDir = workspacesDir;
    this.logger = createLogger(logLevel, 'ExecutionEngine');
  }

  async initialize(): Promise<void> {
    await ensureDir(this.workspacesDir);
    this.logger.info('Execution engine initialized', { maxConcurrency: this.maxConcurrency });
  }

  // ============================================================================
  // Single Skill Execution
  // ============================================================================

  async execute(skill: Skill, context: ExecutionContext): Promise<SkillResult> {
    const startTime = Date.now();
    const skillId = skill.definition.id;

    this.logger.info(`Executing skill: ${skillId}`);

    try {
      // Prepare inputs
      const inputs = await this.prepareInputs(skill.definition, context);

      // Create workspace
      const workspace = await this.createWorkspace(context.projectId, skillId);

      // Execute skill
      const execContext: ExecutionContext = {
        ...context,
        workspace,
      };

      const result = await skill.execute(inputs, execContext);

      // Save outputs as artifacts
      if (result.success && result.output?.artifacts) {
        for (const artifact of result.output.artifacts) {
          const savedArtifact = this.createArtifact(skillId, artifact, context.projectId);
          await this.artifactStore.save(savedArtifact);
        }
      }

      const duration = Date.now() - startTime;
      this.logger.info(`Skill completed: ${skillId}`, { duration, success: result.success });

      return {
        ...result,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Skill failed: ${skillId}`, { error: errorMessage, duration });
      return {
        success: false,
        error: errorMessage,
        duration,
      };
    }
  }

  // ============================================================================
  // Parallel Skill Execution
  // ============================================================================

  async executeParallel(skills: Skill[], context: ExecutionContext): Promise<SkillResult[]> {
    this.logger.info(`Executing ${skills.length} skills in parallel`, { concurrency: this.maxConcurrency });

    const fns = skills.map(skill => () => this.execute(skill, context));
    return parallelAll(fns, this.maxConcurrency);
  }

  // ============================================================================
  // Build Phase Execution (DAG-based)
  // ============================================================================

  async executeBuild(skillGraph: SkillGraph, context: ExecutionContext): Promise<SkillResult> {
    this.logger.info('Starting build phase', {
      totalSkills: skillGraph.skills.length,
      parallelGroups: skillGraph.parallelGroups.length,
    });

    const allResults: SkillResult[] = [];
    const allArtifacts: Artifact[] = [];
    const skillOutputs: Record<string, any> = {};

    // Execute each parallel group sequentially
    for (let groupIndex = 0; groupIndex < skillGraph.parallelGroups.length; groupIndex++) {
      const group = skillGraph.parallelGroups[groupIndex] || [];
      this.logger.info(`Executing parallel group ${groupIndex + 1}/${skillGraph.parallelGroups.length}`, {
        skills: group,
      });

      const groupSkills = this.skillRegistry.getSkillsByIds(group);
      const groupContext: ExecutionContext = {
        ...context,
        skillGraph,
        previousOutputs: {
          ...context.previousOutputs,
          ...skillOutputs,
        },
      };

      const results = await this.executeParallel(groupSkills, groupContext);

      // Collect results - iterate by results since getSkillsByIds may filter out missing skills
      for (let i = 0; i < results.length; i++) {
        const skill = groupSkills[i];
        const result = results[i];
        if (!skill || !result) continue;

        allResults.push(result);

        if (result.success && result.output?.artifacts) {
          allArtifacts.push(...result.output.artifacts);
          skillOutputs[skill.definition.id] = result.output;
        } else if (!result.success) {
          this.logger.warn(`Skill failed in group ${groupIndex}: ${skill.definition.id}`, { error: result.error });
        }
      }
    }

    const success = allResults.every(r => r.success);
    const duration = allResults.reduce((sum, r) => sum + r.duration, 0);

    return {
      success,
      artifacts: allArtifacts,
      skillOutputs,
      duration,
      error: success ? undefined : 'One or more skills failed',
    };
  }

  // ============================================================================
  // Input Preparation
  // ============================================================================

  private async prepareInputs(definition: SkillDefinition, context: ExecutionContext): Promise<SkillInput> {
    const artifacts = new Map<string, any>();

    // Load required input artifacts
    for (const inputContract of definition.inputs) {
      if (inputContract.required) {
        // Try to find artifact in previous outputs
        let found = false;

        // Check previous phase outputs
        for (const [phase, output] of Object.entries(context.previousOutputs)) {
          if (output && typeof output === 'object') {
            const artifact = this.findArtifact(output, inputContract.artifactId);
            if (artifact) {
              artifacts.set(inputContract.artifactId, artifact);
              found = true;
              break;
            }
          }
        }

        // Check artifact store
        if (!found) {
          const storedArtifacts = await this.artifactStore.list(inputContract.artifactId);
          if (storedArtifacts.length > 0) {
            artifacts.set(inputContract.artifactId, storedArtifacts[0]);
            found = true;
          }
        }

        if (!found) {
          this.logger.warn(`Required input artifact not found: ${inputContract.artifactId}`);
        }
      }
    }

    return {
      artifacts,
      config: context.config,
      context,
    };
  }

  private findArtifact(obj: any, artifactId: string): any {
    if (!obj || typeof obj !== 'object') return null;

    // Check if it's an array of artifacts
    if (Array.isArray(obj)) {
      return obj.find(a => a.id === artifactId || a.name === artifactId) || null;
    }

    // Check direct properties
    if (obj.id === artifactId || obj.name === artifactId) return obj;

    // Recursively search
    for (const value of Object.values(obj)) {
      const found = this.findArtifact(value, artifactId);
      if (found) return found;
    }

    return null;
  }

  // ============================================================================
  // Workspace Management
  // ============================================================================

  private async createWorkspace(projectId: string, skillId: string): Promise<string> {
    const workspace = path.join(this.workspacesDir, projectId, skillId, uuidv4().slice(0, 8));
    await ensureDir(workspace);
    return workspace;
  }

  private createArtifact(skillId: string, artifactData: any, projectId: string): Artifact {
    const content = typeof artifactData.content === 'string' ? artifactData.content : JSON.stringify(artifactData.content, null, 2);

    return {
      id: generateId('artifact'),
      type: artifactData.type || 'generated',
      name: artifactData.name || 'unnamed',
      content,
      metadata: {
        format: artifactData.metadata?.format || 'text',
        size: Buffer.byteLength(content, 'utf-8'),
        checksum: calculateChecksum(content),
        tags: [skillId, 'generated'],
        dependencies: [],
      },
      version: '1.0.0',
      createdBy: skillId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  async cleanupWorkspaces(projectId: string): Promise<void> {
    const projectWorkspace = path.join(this.workspacesDir, projectId);
    if (await fs.pathExists(projectWorkspace)) {
      await fs.remove(projectWorkspace);
      this.logger.debug(`Cleaned up workspace: ${projectWorkspace}`);
    }
  }

  getMaxConcurrency(): number {
    return this.maxConcurrency;
  }

  setMaxConcurrency(concurrency: number): void {
    this.maxConcurrency = Math.max(1, concurrency);
  }
}

// ============================================================================
// Skill Executor Implementations
// ============================================================================

export interface SkillExecutor {
  execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult>;
}

export class TemplateBasedExecutor implements SkillExecutor {
  private templateRenderer: TemplateRenderer;
  private skillDefinition: SkillDefinition;

  constructor(skillDefinition: SkillDefinition, templateRenderer: TemplateRenderer) {
    this.skillDefinition = skillDefinition;
    this.templateRenderer = templateRenderer;
  }

  async execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> {
    const startTime = Date.now();
    const artifacts: any[] = [];

    try {
      for (const outputContract of this.skillDefinition.outputs) {
        const template = this.skillDefinition.templates.find(t => t.includes(outputContract.artifactId));
        if (template) {
          const rendered = await this.templateRenderer.render(template, {
            ...Object.fromEntries(inputs.artifacts),
            ...context.previousOutputs,
            projectId: context.projectId,
            skillId: this.skillDefinition.id,
          });

          artifacts.push({
            id: `${this.skillDefinition.id}-${outputContract.artifactId}`,
            type: outputContract.contract,
            name: outputContract.artifactId,
            content: rendered,
            metadata: {
              format: outputContract.contract,
              generatedBy: this.skillDefinition.id,
              template: template,
            },
          });
        }
      }

      return {
        success: true,
        output: { artifacts, metadata: {} },
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime,
      };
    }
  }
}

export class LLMExecutor implements SkillExecutor {
  private model: string;
  private systemPrompt: string;
  private skillDefinition: SkillDefinition;

  constructor(skillDefinition: SkillDefinition, model: string = 'claude-3-5-sonnet') {
    this.skillDefinition = skillDefinition;
    this.model = model;
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    return `You are a ${this.skillDefinition.name}, an expert in ${this.skillDefinition.knowledgeAreas.join(', ')}.

Mission: ${this.skillDefinition.mission}

Responsibilities:
${this.skillDefinition.responsibilities.map(r => `- ${r}`).join('\n')}

Best Practices:
${this.skillDefinition.bestPractices.map(p => `- ${p}`).join('\n')}

Output Requirements:
${this.skillDefinition.outputs.map(o => `- ${o.artifactId} (${o.contract}): ${o.description}`).join('\n')}

Produce high-quality, production-ready outputs. Follow all best practices and validation rules.`;
  }

  async execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> {
    const startTime = Date.now();

    // In production, this would call an LLM API
    // For now, return template-based outputs
    const artifacts: any[] = [];

    for (const outputContract of this.skillDefinition.outputs) {
      artifacts.push({
        id: `${this.skillDefinition.id}-${outputContract.artifactId}`,
        type: outputContract.contract,
        name: outputContract.artifactId,
        content: `// Generated by ${this.skillDefinition.name} (${this.model})\n// Input artifacts: ${Array.from(inputs.artifacts.keys()).join(', ')}\n// TODO: Implement actual LLM generation\n\n${this.generateStubOutput(outputContract)}`,
        metadata: {
          format: outputContract.contract,
          generatedBy: this.skillDefinition.id,
          model: this.model,
        },
      });
    }

    return {
      success: true,
      output: { artifacts, metadata: {} },
      duration: Date.now() - startTime,
    };
  }

  private generateStubOutput(contract: { artifactId: string; contract: string }): string {
    switch (contract.contract) {
      case 'markdown':
        return `# ${contract.artifactId}\n\nGenerated content here...`;
      case 'json':
        return JSON.stringify({ [contract.artifactId]: {} }, null, 2);
      case 'yaml':
        return `${contract.artifactId}: {}`;
      case 'typescript':
        return `// ${contract.artifactId}\nexport interface ${contract.artifactId} {}\n`;
      default:
        return `// ${contract.artifactId}\n// Content placeholder`;
    }
  }
}

// ============================================================================
// Template Renderer
// ============================================================================

export class TemplateRenderer {
  private templates: Map<string, string> = new Map();
  private logger: ReturnType<typeof createLogger>;

  constructor(templatesDir: string, logLevel: LogLevel = 'INFO') {
    this.logger = createLogger(logLevel, 'TemplateRenderer');
    this.loadTemplates(templatesDir);
  }

  private async loadTemplates(templatesDir: string): Promise<void> {
    try {
      const glob = await import('glob');
      const fsExtra = await import('fs-extra');
      const files = await glob.glob('**/*.hbs', { cwd: templatesDir });
      for (const file of files) {
        const content = await fsExtra.readFile(path.join(templatesDir, file), 'utf-8');
        this.templates.set(file.replace('.hbs', ''), content);
      }
      this.logger.info(`Loaded ${this.templates.size} templates`);
    } catch (error) {
      this.logger.warn('No templates found', { error });
    }
  }

  async render(templateName: string, data: Record<string, any>): Promise<string> {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    // Simple Handlebars-like rendering
    return this.simpleRender(template, data);
  }

  private simpleRender(template: string, data: Record<string, any>): string {
    // Handle conditionals first: {{#if condition}}content{{/if}}
    let result = template;
    const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    result = result.replace(ifRegex, (match, condition, content) => {
      return data[condition] ? content : '<!-- conditional removed -->';
    });

    // Handle simple variable substitution
    result = result.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
      const key = expr.trim();
      return data[key] !== undefined ? String(data[key]) : match;
    });

    return result;
  }

  registerTemplate(name: string, content: string): void {
    this.templates.set(name, content);
  }

  getTemplates(): string[] {
    return Array.from(this.templates.keys());
  }
}

// ============================================================================
// Factory
// ============================================================================

export async function createExecutionEngine(
  skillRegistry: SkillRegistry,
  artifactStore: ArtifactStore,
  options: {
    maxConcurrency?: number;
    workspacesDir?: string;
    logLevel?: LogLevel;
  } = {}
): Promise<ExecutionEngine> {
  const engine = new ExecutionEngine(
    skillRegistry,
    artifactStore,
    options.maxConcurrency,
    options.workspacesDir,
    options.logLevel
  );
  await engine.initialize();
  return engine;
}