/**
 * AI Skill Engineer - Skill Registry
 *
 * Manages skill discovery, registration, and retrieval.
 */

import { EventEmitter } from 'eventemitter3';
import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import {
  SkillDefinition,
  SkillConfig,
  SkillExecutor,
  ArtifactContract,
  ValidationRule,
  SkillInput,
  SkillOutput,
  SkillResult,
  Skill,
  SkillValidationResult,
  ExecutionContext,
} from '../types';
import { createLogger, LogLevel, ensureDir, readFileSafe, writeFileSafe } from '../utils';

// ============================================================================
// Skill Registry Class
// ============================================================================

export class SkillRegistry extends EventEmitter {
  private skills: Map<string, Skill> = new Map();
  private skillDefinitions: Map<string, SkillDefinition> = new Map();
  private triggers: Map<string, string[]> = new Map(); // projectType -> skillIds
  private logger: ReturnType<typeof createLogger>;
  private skillsDir: string;

  constructor(skillsDir: string, logLevel: LogLevel = 'INFO') {
    super();
    this.skillsDir = skillsDir;
    this.logger = createLogger(logLevel, 'SkillRegistry');
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing skill registry');
    await this.loadBuiltInSkills();
    await this.loadCustomSkills();
    this.buildTriggerMap();
    this.logger.info(`Loaded ${this.skills.size} skills`);
  }

  // ============================================================================
  // Skill Registration
  // ============================================================================

  register(skill: Skill): void {
    const id = skill.definition.id;
    if (this.skills.has(id)) {
      this.logger.warn(`Skill already registered, overwriting: ${id}`);
    }
    this.skills.set(id, skill);
    this.skillDefinitions.set(id, skill.definition);
    this.emit('skill-registered', { skillId: id });
  }

  unregister(skillId: string): boolean {
    const result = this.skills.delete(skillId);
    this.skillDefinitions.delete(skillId);
    if (result) {
      this.emit('skill-unregistered', { skillId });
    }
    return result;
  }

  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getSkillDefinition(skillId: string): SkillDefinition | undefined {
    return this.skillDefinitions.get(skillId);
  }

  getSkillsByIds(skillIds: string[]): Skill[] {
    return skillIds.map(id => this.skills.get(id)).filter((s): s is Skill => s !== undefined);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getAllDefinitions(): SkillDefinition[] {
    return Array.from(this.skillDefinitions.values());
  }

  // ============================================================================
  // Skill Discovery
  // ============================================================================

  discoverSkills(projectType: string, requirements: any): SkillDefinition[] {
    const skillIds = this.triggers.get(projectType) || [];
    return skillIds.map(id => this.skillDefinitions.get(id)).filter((d): d is SkillDefinition => d !== undefined);
  }

  getRequiredSkills(projectType: string): SkillDefinition[] {
    const baseTypes = ['saas', 'web', 'api', 'mobile', 'ai', 'data', 'platform'];
    const allSkills = new Set<string>();

    for (const type of baseTypes) {
      const skills = this.triggers.get(type) || [];
      skills.forEach(s => allSkills.add(s));
    }

    // Add project-specific skills
    const specificSkills = this.triggers.get(projectType) || [];
    specificSkills.forEach(s => allSkills.add(s));

    return Array.from(allSkills).map(id => this.skillDefinitions.get(id)).filter((d): d is SkillDefinition => d !== undefined);
  }

  private buildTriggerMap(): void {
    for (const [id, definition] of this.skillDefinitions) {
      // Extract triggers from knowledge areas and responsibilities
      const triggers = this.extractTriggers(definition);
      for (const trigger of triggers) {
        if (!this.triggers.has(trigger)) {
          this.triggers.set(trigger, []);
        }
        this.triggers.get(trigger)!.push(id);
      }
    }
  }

  private extractTriggers(definition: SkillDefinition): string[] {
    const triggers = new Set<string>();

    // Map knowledge areas to project types
    const knowledgeMap: Record<string, string[]> = {
      'product-management': ['saas', 'web', 'mobile', 'platform'],
      'system-architecture': ['saas', 'web', 'api', 'platform'],
      'frontend-development': ['web', 'mobile', 'saas'],
      'backend-development': ['api', 'saas', 'platform', 'data'],
      'mobile-development': ['mobile'],
      'ai-ml': ['ai', 'data', 'saas'],
      'database-design': ['data', 'saas', 'platform'],
      'cloud-infrastructure': ['saas', 'platform', 'api'],
      'devops': ['saas', 'platform', 'api'],
      'security': ['saas', 'platform', 'fintech', 'healthcare'],
      'quality-assurance': ['saas', 'web', 'mobile', 'api', 'platform'],
      'technical-writing': ['saas', 'web', 'api', 'mobile', 'platform'],
      'ux-design': ['web', 'mobile', 'saas'],
      'ui-design': ['web', 'mobile', 'saas'],
    };

    for (const area of definition.knowledgeAreas) {
      const mapped = knowledgeMap[area.toLowerCase()];
      if (mapped) mapped.forEach(t => triggers.add(t));
    }

    // Default triggers
    triggers.add('saas');
    triggers.add('web');

    return Array.from(triggers);
  }

  // ============================================================================
  // Loading Skills
  // ============================================================================

  private async loadBuiltInSkills(): Promise<void> {
    // Built-in skills are registered programmatically
    this.logger.debug('Loading built-in skills');
  }

  private async loadCustomSkills(): Promise<void> {
    try {
      const skillDirs = await glob('*/skill.yaml', { cwd: this.skillsDir });
      for (const skillDir of skillDirs) {
        const skillPath = path.join(this.skillsDir, skillDir);
        await this.loadSkillFromDirectory(skillPath);
      }
    } catch (error) {
      this.logger.debug('No custom skills found', { error });
    }
  }

  private async loadSkillFromDirectory(skillPath: string): Promise<void> {
    try {
      const definitionPath = path.join(skillPath, 'skill.yaml');
      const definitionContent = await readFileSafe(definitionPath);
      if (!definitionContent) return;

      const definition = this.parseSkillDefinition(definitionContent);
      const executorPath = path.join(skillPath, 'executor.ts');

      let executor: SkillExecutor;
      if (await fs.pathExists(executorPath)) {
        // Dynamic import would go here in production
        executor = this.createDefaultExecutor(definition);
      } else {
        executor = this.createDefaultExecutor(definition);
      }

      const skill: Skill = {
        definition,
        executor,
        config: {},
        validate: async (inputs) => ({ valid: true, errors: [], warnings: [] }),
        execute: async (inputs, context) => executor.execute(inputs, context),
      };

      this.register(skill);
      this.logger.debug(`Loaded skill: ${definition.id}`);
    } catch (error) {
      this.logger.warn(`Failed to load skill from ${skillPath}`, { error });
    }
  }

  private parseSkillDefinition(content: string): SkillDefinition {
    // Simple YAML parsing - in production use proper YAML parser
    const lines = content.split('\n');
    const definition: Partial<SkillDefinition> = {
      inputs: [],
      outputs: [],
      dependencies: [],
      bestPractices: [],
      validationRules: [],
      tools: [],
      successMetrics: [],
      templates: [],
    };

    let currentArray: string | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Check if this is an array header (ends with : and value is empty)
      const colonIndex = trimmed.indexOf(':');
      const isArrayHeader = trimmed.endsWith(':') && colonIndex === trimmed.length - 1;

      if (isArrayHeader) {
        currentArray = trimmed.slice(0, -1);
        continue;
      }

      if (colonIndex === -1) continue;

      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();

      if (!key) continue;

      switch (key) {
        case 'id': definition.id = value; break;
        case 'name': definition.name = value; break;
        case 'version': definition.version = value; break;
        case 'mission': definition.mission = value; break;
        case 'responsibilities':
          if (value.startsWith('- ')) {
            (definition.responsibilities || []).push(value.slice(2));
          }
          break;
        case 'knowledge_areas':
        case 'knowledge-areas':
          if (value.startsWith('- ')) {
            (definition.knowledgeAreas || []).push(value.slice(2));
          }
          break;
        case 'dependencies':
          if (value.startsWith('- ')) {
            (definition.dependencies || []).push(value.slice(2));
          }
          break;
      }
    }

    return definition as SkillDefinition;
  }

  private createDefaultExecutor(definition: SkillDefinition): SkillExecutor {
    return {
      execute: async (inputs: SkillInput, context: ExecutionContext) => {
        // Default executor - in production, this would call LLM
        this.logger.info(`Executing skill: ${definition.id}`);

        const outputs = [];
        for (const outputContract of definition.outputs) {
          outputs.push({
            id: `${definition.id}-${outputContract.artifactId}-${Date.now()}`,
            type: outputContract.contract,
            name: outputContract.artifactId,
            content: `// Generated by ${definition.name}\n// TODO: Implement ${outputContract.artifactId}`,
            metadata: {
              format: outputContract.contract,
              generatedBy: definition.id,
            },
          });
        }

        return {
          success: true,
          output: { artifacts: outputs, metadata: {} },
          duration: 100,
        };
      },
    };
  }
}

// ============================================================================
// Skill Builder (for creating skills programmatically)
// ============================================================================

export class SkillBuilder {
  private definition: Partial<SkillDefinition> = {
    inputs: [],
    outputs: [],
    dependencies: [],
    bestPractices: [],
    validationRules: [],
    tools: [],
    successMetrics: [],
    templates: [],
  };

  id(id: string): this {
    this.definition.id = id;
    return this;
  }

  name(name: string): this {
    this.definition.name = name;
    return this;
  }

  version(version: string): this {
    this.definition.version = version;
    return this;
  }

  mission(mission: string): this {
    this.definition.mission = mission;
    return this;
  }

  responsibility(resp: string): this {
    (this.definition.responsibilities ||= []).push(resp);
    return this;
  }

  responsibilities(resps: string[]): this {
    this.definition.responsibilities = resps;
    return this;
  }

  knowledgeArea(area: string): this {
    (this.definition.knowledgeAreas ||= []).push(area);
    return this;
  }

  knowledgeAreas(areas: string[]): this {
    this.definition.knowledgeAreas = areas;
    return this;
  }

  input(artifactId: string, contract: string, required: boolean = true, description: string = ''): this {
    (this.definition.inputs ||= []).push({ artifactId, contract, required, description });
    return this;
  }

  output(artifactId: string, contract: string, description: string = ''): this {
    (this.definition.outputs ||= []).push({ artifactId, contract, required: true, description });
    return this;
  }

  dependency(skillId: string): this {
    (this.definition.dependencies ||= []).push(skillId);
    return this;
  }

  bestPractice(practice: string): this {
    (this.definition.bestPractices ||= []).push(practice);
    return this;
  }

  validationRule(rule: string, severity: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM', autoFixable: boolean = false): this {
    (this.definition.validationRules ||= []).push({ rule, severity, autoFixable });
    return this;
  }

  tool(tool: string): this {
    (this.definition.tools ||= []).push(tool);
    return this;
  }

  successMetric(metric: string, target: string): this {
    (this.definition.successMetrics ||= []).push({ metric, target });
    return this;
  }

  template(template: string): this {
    (this.definition.templates ||= []).push(template);
    return this;
  }

  build(): SkillDefinition {
    const required = ['id', 'name', 'version', 'mission', 'responsibilities', 'knowledgeAreas'];
    for (const field of required) {
      if (!this.definition[field as keyof SkillDefinition]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    return this.definition as SkillDefinition;
  }
}

// ============================================================================
// Skill Template Generator
// ============================================================================

export function generateSkillTemplate(definition: SkillDefinition): string {
  return `# ${definition.name} Skill

id: ${definition.id}
name: ${definition.name}
version: ${definition.version}
mission: "${definition.mission}"

responsibilities:
${definition.responsibilities.map(r => `  - "${r}"`).join('\n')}

knowledge_areas:
${definition.knowledgeAreas.map(a => `  - "${a}"`).join('\n')}

inputs:
${definition.inputs.map(i => `  - artifact_id: "${i.artifactId}"\n    contract: "${i.contract}"\n    required: ${i.required}\n    description: "${i.description}"`).join('\n')}

outputs:
${definition.outputs.map(o => `  - artifact_id: "${o.artifactId}"\n    contract: "${o.contract}"\n    description: "${o.description}"`).join('\n')}

dependencies:
${definition.dependencies.map(d => `  - "${d}"`).join('\n')}

best_practices:
${definition.bestPractices.map(p => `  - "${p}"`).join('\n')}

validation_rules:
${definition.validationRules.map(r => `  - rule: "${r.rule}"\n    severity: "${r.severity}"\n    auto_fixable: ${r.autoFixable}`).join('\n')}

tools:
${definition.tools.map(t => `  - "${t}"`).join('\n')}

success_metrics:
${definition.successMetrics.map(m => `  - metric: "${m.metric}"\n    target: "${m.target}"`).join('\n')}

templates:
${definition.templates.map(t => `  - "${t}"`).join('\n')}
`;
}

// ============================================================================
// Factory
// ============================================================================

export async function createSkillRegistry(
  skillsDir: string,
  logLevel: LogLevel = 'INFO'
): Promise<SkillRegistry> {
  const registry = new SkillRegistry(skillsDir, logLevel);
  await registry.initialize();
  return registry;
}