/**
 * AI Skill Engineer - Orchestrator
 *
 * The core orchestrator that manages the 10-phase autonomous workflow.
 */

import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import { EventEmitter } from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import {
  IdeaInput,
  UnderstandOutput,
  PlanOutput,
  SkillGraph,
  BuildOutput,
  ReviewOutput,
  FixOutput,
  ValidateOutput,
  ApprovalOutput,
  OptimizeOutput,
  DeliverOutput,
  OrchestratorState,
  PhaseName,
  PhaseStatus,
  PhaseResult,
  Artifact,
  ProjectConfig,
  OrchestratorConfig,
  SkillDefinition,
  ExecutionContext,
  OrchestratorEvents,
  PhaseConfig,
} from '../types';
import { ArtifactStore, StateStore } from '../storage';
import { createLogger, LogLevel, generateProjectId, sleep } from '../utils';
import { SkillRegistry } from '../skills/registry';
import { ExecutionEngine } from '../execution/engine';

// ============================================================================
// Phase Configuration
// ============================================================================

export const PHASE_CONFIGS: Record<PhaseName, PhaseConfig> = {
  understand: {
    name: 'understand',
    displayName: 'Understand',
    description: 'Extract complete problem space from natural language input',
    estimatedDuration: 30000,
    requiredSkills: ['business-analyst', 'product-strategist'],
    optionalSkills: [],
    inputs: ['idea'],
    outputs: ['vision', 'goals', 'requirements', 'constraints', 'risks'],
  },
  plan: {
    name: 'plan',
    displayName: 'Plan',
    description: 'Produce complete planning artifacts (PRD, stories, tech spec, roadmap)',
    estimatedDuration: 60000,
    requiredSkills: ['product-manager', 'solution-architect', 'technical-writer'],
    optionalSkills: [],
    inputs: ['understand-output'],
    outputs: ['prd', 'user-stories', 'acceptance-criteria', 'tech-spec', 'roadmap'],
  },
  'discover-skills': {
    name: 'discover-skills',
    displayName: 'Discover Skills',
    description: 'Determine complete expert roster and execution graph',
    estimatedDuration: 15000,
    requiredSkills: ['skill-discovery-engine'],
    optionalSkills: [],
    inputs: ['plan-output'],
    outputs: ['skill-graph', 'execution-order', 'parallel-groups'],
  },
  build: {
    name: 'build',
    displayName: 'Build',
    description: 'Execute all skills in dependency order to produce artifacts',
    estimatedDuration: 300000,
    requiredSkills: [],
    optionalSkills: [],
    inputs: ['skill-graph'],
    outputs: ['all-artifacts'],
  },
  review: {
    name: 'review',
    displayName: 'Review',
    description: 'Senior-engineer level code review across all dimensions',
    estimatedDuration: 60000,
    requiredSkills: ['code-reviewer'],
    optionalSkills: [],
    inputs: ['build-output'],
    outputs: ['review-findings'],
  },
  fix: {
    name: 'fix',
    displayName: 'Fix',
    description: 'Auto-remediate all review findings',
    estimatedDuration: 120000,
    requiredSkills: ['code-fixer'],
    optionalSkills: [],
    inputs: ['review-findings', 'build-output'],
    outputs: ['fixed-artifacts'],
  },
  validate: {
    name: 'validate',
    displayName: 'Validate',
    description: 'Comprehensive quality gate simulation',
    estimatedDuration: 180000,
    requiredSkills: ['validation-engine'],
    optionalSkills: [],
    inputs: ['fixed-artifacts'],
    outputs: ['validation-results'],
  },
  'human-approval': {
    name: 'human-approval',
    displayName: 'Human Approval',
    description: 'Principal Engineer PR review simulation',
    estimatedDuration: 30000,
    requiredSkills: ['principal-engineer-simulator'],
    optionalSkills: [],
    inputs: ['validation-results'],
    outputs: ['approval-decision'],
  },
  optimize: {
    name: 'optimize',
    displayName: 'Optimize',
    description: 'Continuous improvement until diminishing returns',
    estimatedDuration: 120000,
    requiredSkills: ['optimization-engine'],
    optionalSkills: [],
    inputs: ['approval-decision'],
    outputs: ['optimized-artifacts'],
  },
  deliver: {
    name: 'deliver',
    displayName: 'Deliver',
    description: 'Package complete project for handoff',
    estimatedDuration: 30000,
    requiredSkills: ['delivery-engineer'],
    optionalSkills: [],
    inputs: ['optimized-artifacts'],
    outputs: ['delivery-package'],
  },
};

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

// ============================================================================
// Orchestrator Class
// ============================================================================

export class Orchestrator extends EventEmitter<OrchestratorEvents> {
  private state: OrchestratorState | null = null;
  private config: Required<ProjectConfig>;
  private orchestratorConfig: OrchestratorConfig;
  private artifactStore: ArtifactStore;
  private stateStore: StateStore;
  private skillRegistry: SkillRegistry;
  private executionEngine: ExecutionEngine;
  private logger: ReturnType<typeof createLogger>;
  private running = false;
  private paused = false;

  constructor(
    config: Partial<ProjectConfig> = {},
    artifactStore: ArtifactStore,
    stateStore: StateStore,
    skillRegistry: SkillRegistry,
    executionEngine: ExecutionEngine,
    logLevel: LogLevel = 'INFO'
  ) {
    super();
    const projectId = config.projectId || generateProjectId();
    this.config = {
      projectId,
      name: config.name || 'AI Skill Engineer Project',
      description: config.description || '',
      idea: config.idea || '',
      maxParallelSkills: config.maxParallelSkills || 4,
      validationLevel: config.validationLevel || 'strict',
      autoFix: config.autoFix ?? true,
      humanApprovalRequired: config.humanApprovalRequired ?? true,
      optimizationIterations: config.optimizationIterations || 3,
      outputPath: config.outputPath || './output',
      ...config,
    } as Required<ProjectConfig>;

    this.orchestratorConfig = {
      maxRetries: 3,
      phaseTimeout: 300000,
      parallelExecution: true,
      autoFix: config.autoFix ?? true,
      humanApprovalRequired: config.humanApprovalRequired ?? true,
      optimizationEnabled: true,
      outputDirectory: config.outputPath || './output',
      logLevel,
    };

    this.artifactStore = artifactStore;
    this.stateStore = stateStore;
    this.skillRegistry = skillRegistry;
    this.executionEngine = executionEngine;
    this.logger = createLogger(logLevel, 'Orchestrator');
  }

  // ============================================================================
  // Public API
  // ============================================================================

  async initialize(idea: string): Promise<void> {
    this.logger.info('Initializing orchestrator', { projectId: this.config.projectId });

    // Check for existing state
    const existingState = await this.stateStore.get(this.config.projectId);
    if (existingState) {
      this.state = existingState;
      this.logger.info('Resumed from existing state', { phase: this.state.currentPhase });
    } else {
      // Create initial state
      this.state = this.createInitialState(idea);
      await this.saveState();
    }

    this.emit('initialized', { projectId: this.config.projectId });
  }

  async execute(): Promise<DeliverOutput> {
    if (this.running) {
      throw new Error('Orchestrator already running');
    }
    this.running = true;

    try {
      this.logger.info('Starting autonomous execution', { projectId: this.config.projectId });

      // Execute phases in order
      for (const phaseName of PHASE_ORDER) {
        if (this.shouldSkipPhase(phaseName)) {
          this.logger.info(`Skipping phase: ${phaseName}`);
          continue;
        }

        await this.executePhase(phaseName);

        // Check for pause/stop
        if (this.paused) {
          await this.waitForResume();
        }

        if (!this.running) {
          throw new Error('Execution stopped');
        }
      }

      this.logger.info('Execution completed successfully');
      return this.state?.deliverOutput || { packageContents: [], packageSize: 0, deliveryPath: '' };
    } catch (error) {
      this.logger.error('Execution failed', { error });
      throw error;
    } finally {
      this.running = false;
    }
  }

  async executePhase(phaseName: PhaseName): Promise<PhaseResult> {
    if (!this.state) throw new Error('Orchestrator not initialized');

    this.logger.info(`Starting phase: ${phaseName}`);
    this.emit('phase-start', { phase: phaseName, projectId: this.config.projectId });

    const phaseConfig = PHASE_CONFIGS[phaseName];
    const startTime = Date.now();

    // Update state
    this.updatePhaseStatus(phaseName, 'running');
    await this.saveState();

    try {
      let result: PhaseResult;

      switch (phaseName) {
        case 'understand':
          result = await this.executeUnderstand();
          break;
        case 'plan':
          result = await this.executePlan();
          break;
        case 'discover-skills':
          result = await this.executeDiscoverSkills();
          break;
        case 'build':
          result = await this.executeBuild();
          break;
        case 'review':
          result = await this.executeReview();
          break;
        case 'fix':
          result = await this.executeFix();
          break;
        case 'validate':
          result = await this.executeValidate();
          break;
        case 'human-approval':
          result = await this.executeHumanApproval();
          break;
        case 'optimize':
          result = await this.executeOptimize();
          break;
        case 'deliver':
          result = await this.executeDeliver();
          break;
        default:
          throw new Error(`Unknown phase: ${phaseName}`);
      }

      const duration = Date.now() - startTime;

      if (result.success) {
        this.updatePhaseStatus(phaseName, 'completed', result.output);
        this.logger.info(`Phase completed: ${phaseName}`, { duration: `${duration}ms` });
        this.emit('phase-complete', { phase: phaseName, result, projectId: this.config.projectId });
      } else {
        this.updatePhaseStatus(phaseName, 'failed', undefined, result.error);
        this.logger.error(`Phase failed: ${phaseName}`, { error: result.error });
        this.emit('phase-failed', { phase: phaseName, error: result.error, projectId: this.config.projectId });
      }

      await this.saveState();
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.updatePhaseStatus(phaseName, 'failed', undefined, errorMessage);
      this.logger.error(`Phase error: ${phaseName}`, { error: errorMessage, duration });
      await this.saveState();
      throw error;
    }
  }

  async resume(): Promise<void> {
    if (!this.state) throw new Error('No state to resume');
    this.paused = false;
    this.emit('resumed', { projectId: this.config.projectId });
  }

  async pause(): Promise<void> {
    this.paused = true;
    this.emit('paused', { projectId: this.config.projectId });
  }

  async stop(): Promise<void> {
    this.running = false;
    this.paused = false;
    this.emit('stopped', { projectId: this.config.projectId });
  }

  getState(): OrchestratorState | null {
    return this.state;
  }

  getConfig(): ProjectConfig {
    return { ...this.config };
  }

  // ============================================================================
  // Phase Implementations
  // ============================================================================

  private async executeUnderstand(): Promise<PhaseResult<UnderstandOutput>> {
    const skills = this.skillRegistry.getSkillsByIds(['business-analyst', 'product-strategist']);
    const context = this.createExecutionContext('understand');

    // Execute skills in parallel
    const results = await this.executionEngine.executeParallel(skills, context);

    // Merge outputs
    const output: UnderstandOutput = {
      vision: '',
      targetAudience: [],
      businessGoals: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      constraints: [],
      risks: [],
      opportunities: [],
      successCriteria: [],
    };

    for (const result of results) {
      if (result.success && result.output) {
        // Merge skill output into phase output
        const skillOutput = result.output as Record<string, any>;
        Object.assign(output, skillOutput);
      }
    }

    // Save artifacts
    await this.savePhaseArtifacts('understand', output);

    return { success: true, output };
  }

  private async executePlan(): Promise<PhaseResult<PlanOutput>> {
    const understandOutput = this.getPhaseOutput<UnderstandOutput>('understand');
    if (!understandOutput) throw new Error('Understand phase output not found');

    const skills = this.skillRegistry.getSkillsByIds(['product-manager', 'solution-architect', 'technical-writer']);
    const context = this.createExecutionContext('plan', { understandOutput });

    const results = await this.executionEngine.executeParallel(skills, context);

    const output: PlanOutput = {
      prd: '',
      userStories: [],
      acceptanceCriteria: [],
      technicalSpecification: {
        architectureDecisions: [],
        apiContracts: [],
        dataModels: [],
        infrastructureDesign: {
          cloudProvider: 'AWS',
          regions: [],
          compute: { type: 'SERVERLESS', specs: {} },
          storage: { databases: [], caches: [], objectStorage: [] },
          networking: { vpc: '', subnets: [], loadBalancers: [], cdn: false },
          observability: { metrics: [], logging: '', tracing: '', alerting: '' },
          estimatedMonthlyCost: 0,
        },
        securityModel: {
          authentication: { providers: [], mfa: false, sessionManagement: '', tokenStrategy: 'JWT' },
          authorization: { model: 'RBAC', roles: [], permissions: [] },
          encryption: { atRest: '', inTransit: '', keyManagement: '' },
          compliance: [],
          threatModel: { assets: [], threats: [], mitigations: [] },
        },
      },
      milestones: [],
      roadmap: { phases: [], totalDuration: '', resourcePlan: { roles: [], budget: { compute: 0, storage: 0, network: 0, licenses: 0, personnel: 0, total: 0, currency: 'USD' } } },
    };

    for (const result of results) {
      if (result.success && result.output) {
        // Merge skill output into phase output
        const skillOutput = result.output as Record<string, any>;
        Object.assign(output, skillOutput);
      }
    }

    await this.savePhaseArtifacts('plan', output);
    return { success: true, output };
  }

  private async executeDiscoverSkills(): Promise<PhaseResult<SkillGraph>> {
    const planOutput = this.getPhaseOutput<PlanOutput>('plan');
    if (!planOutput) throw new Error('Plan phase output not found');

    const skill = this.skillRegistry.getSkill('skill-discovery-engine');
    if (!skill) throw new Error('Skill discovery engine not found');

    const context = this.createExecutionContext('discover-skills', { planOutput });
    const result = await this.executionEngine.execute(skill, context);

    if (!result.success || !result.output) {
      throw new Error(`Skill discovery failed: ${result.error}`);
    }

    const skillGraph = result.output as unknown as SkillGraph;
    this.state!.skillGraph = skillGraph;

    await this.savePhaseArtifacts('discover-skills', skillGraph);
    return { success: true, output: skillGraph };
  }

  private async executeBuild(): Promise<PhaseResult<BuildOutput>> {
    if (!this.state?.skillGraph) throw new Error('Skill graph not found');

    const context = this.createExecutionContext('build', { skillGraph: this.state.skillGraph });
    const result = await this.executionEngine.executeBuild(this.state.skillGraph, context);

    if (!result.success) {
      throw new Error(`Build failed: ${result.error}`);
    }

    const buildOutput: BuildOutput = {
      artifacts: result.artifacts || [],
      skillOutputs: result.skillOutputs || {},
    };

    this.state.buildOutput = buildOutput;
    await this.savePhaseArtifacts('build', buildOutput);
    return { success: true, output: buildOutput };
  }

  private async executeReview(): Promise<PhaseResult<ReviewOutput>> {
    const buildOutput = this.getPhaseOutput<BuildOutput>('build');
    if (!buildOutput) throw new Error('Build output not found');

    const skill = this.skillRegistry.getSkill('code-reviewer');
    if (!skill) throw new Error('Code reviewer skill not found');

    const context = this.createExecutionContext('review', { buildOutput });
    const result = await this.executionEngine.execute(skill, context);

    if (!result.success || !result.output) {
      throw new Error(`Review failed: ${result.error}`);
    }

    const reviewOutput = result.output as unknown as ReviewOutput;
    this.state!.reviewOutput = reviewOutput;

    await this.savePhaseArtifacts('review', reviewOutput);
    return { success: true, output: reviewOutput };
  }

  private async executeFix(): Promise<PhaseResult<FixOutput>> {
    const reviewOutput = this.getPhaseOutput<ReviewOutput>('review');
    const buildOutput = this.getPhaseOutput<BuildOutput>('build');
    if (!reviewOutput || !buildOutput) throw new Error('Required outputs not found');

    const skill = this.skillRegistry.getSkill('code-fixer');
    if (!skill) throw new Error('Code fixer skill not found');

    const context = this.createExecutionContext('fix', { reviewOutput, buildOutput });
    const result = await this.executionEngine.execute(skill, context);

    if (!result.success || !result.output) {
      throw new Error(`Fix failed: ${result.error}`);
    }

    const fixOutput = result.output as unknown as FixOutput;
    this.state!.fixOutput = fixOutput;

    // Re-run validation on fixed artifacts
    if (this.config.autoFix && fixOutput.fixedArtifacts?.length) {
      // Update build output with fixed artifacts
      this.state!.buildOutput!.artifacts.push(...(fixOutput.fixedArtifacts || []));
    }

    await this.savePhaseArtifacts('fix', fixOutput);
    return { success: true, output: fixOutput };
  }

  private async executeValidate(): Promise<PhaseResult<ValidateOutput>> {
    const buildOutput = this.getPhaseOutput<BuildOutput>('build');
    if (!buildOutput) throw new Error('Build output not found');

    const skill = this.skillRegistry.getSkill('validation-engine');
    if (!skill) throw new Error('Validation engine skill not found');

    const context = this.createExecutionContext('validate', { buildOutput, config: this.config });
    const result = await this.executionEngine.execute(skill, context);

    if (!result.success || !result.output) {
      throw new Error(`Validation failed: ${result.error}`);
    }

    const validateOutput = result.output as unknown as ValidateOutput;
    this.state!.validateOutput = validateOutput;

    await this.savePhaseArtifacts('validate', validateOutput);
    return { success: true, output: validateOutput };
  }

  private async executeHumanApproval(): Promise<PhaseResult<ApprovalOutput>> {
    const validateOutput = this.getPhaseOutput<ValidateOutput>('validate');
    if (!validateOutput) throw new Error('Validation output not found');

    if (!this.config.humanApprovalRequired) {
      // Auto-approve if not required
      const output: ApprovalOutput = {
        approved: true,
        feedback: [],
        reviewer: 'auto-approved',
        timestamp: new Date(),
      };
      this.state!.approvalOutput = output;
      await this.savePhaseArtifacts('human-approval', output);
      return { success: true, output };
    }

    const skill = this.skillRegistry.getSkill('principal-engineer-simulator');
    if (!skill) throw new Error('Principal engineer simulator not found');

    const context = this.createExecutionContext('human-approval', { validateOutput });
    const result = await this.executionEngine.execute(skill, context);

    if (!result.success || !result.output) {
      throw new Error(`Approval failed: ${result.error}`);
    }

    const approvalOutput = result.output as unknown as ApprovalOutput;
    this.state!.approvalOutput = approvalOutput;

    if (!approvalOutput.approved) {
      // Request changes - loop back to fix phase
      this.state!.currentPhase = 'fix';
      this.updatePhaseStatus('fix', 'pending');
    }

    await this.savePhaseArtifacts('human-approval', approvalOutput);
    return { success: true, output: approvalOutput };
  }

  private async executeOptimize(): Promise<PhaseResult<OptimizeOutput>> {
    const approvalOutput = this.getPhaseOutput<ApprovalOutput>('human-approval');
    if (!approvalOutput || !approvalOutput.approved) {
      throw new Error('Cannot optimize without approval');
    }

    const skill = this.skillRegistry.getSkill('optimization-engine');
    if (!skill) throw new Error('Optimization engine not found');

    let currentArtifacts = this.getPhaseOutput<BuildOutput>('build')?.artifacts || [];
    const optimizationResults: any[] = [];

    for (let i = 0; i < this.config.optimizationIterations; i++) {
      const context = this.createExecutionContext('optimize', {
        artifacts: currentArtifacts,
        iteration: i + 1,
        config: this.config,
      });

      const result = await this.executionEngine.execute(skill, context);
      if (!result.success || !result.output) break;

      const skillOutput = result.output as any;
      optimizationResults.push(skillOutput);
      currentArtifacts = skillOutput.optimizedArtifacts || currentArtifacts;
    }

    const output: OptimizeOutput = {
      iterations: optimizationResults,
      finalArtifacts: currentArtifacts,
      totalImprovement: optimizationResults.reduce((sum, r) => sum + (r.improvement || 0), 0),
    };

    this.state!.optimizeOutput = output;
    this.state!.buildOutput!.artifacts = currentArtifacts;

    await this.savePhaseArtifacts('optimize', output);
    return { success: true, output };
  }

  private async executeDeliver(): Promise<PhaseResult<DeliverOutput>> {
    const skill = this.skillRegistry.getSkill('delivery-engineer');
    if (!skill) throw new Error('Delivery engineer not found');

    const context = this.createExecutionContext('deliver', {
      projectConfig: this.config,
      allArtifacts: this.state?.buildOutput?.artifacts || [],
      state: this.state,
    });

    const result = await this.executionEngine.execute(skill, context);

    if (!result.success || !result.output) {
      throw new Error(`Delivery failed: ${result.error}`);
    }

    const deliverOutput: DeliverOutput = result.output as any;
    this.state!.deliverOutput = deliverOutput;

    // Save final delivery package
    await this.saveDeliveryPackage(deliverOutput);

    return { success: true, output: deliverOutput };
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private createInitialState(idea: string): OrchestratorState {
    return {
      projectId: this.config.projectId,
      name: this.config.name,
      description: this.config.description,
      idea,
      currentPhase: 'understand',
      phases: PHASE_ORDER.map(name => ({
        name,
        status: 'pending' as PhaseStatus,
        retryCount: 0,
      })),
      artifacts: new Map(),
      skillGraph: undefined,
      understandOutput: undefined,
      planOutput: undefined,
      buildOutput: undefined,
      reviewOutput: undefined,
      fixOutput: undefined,
      validateOutput: undefined,
      approvalOutput: undefined,
      optimizeOutput: undefined,
      deliverOutput: undefined,
      reviewFindings: [],
      validationResults: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      config: this.orchestratorConfig,
    };
  }

  private createExecutionContext(phase: PhaseName, data: Record<string, any> = {}): ExecutionContext {
    return {
      projectId: this.config.projectId,
      phase,
      config: this.orchestratorConfig,
      artifacts: this.state?.artifacts || new Map(),
      skillGraph: this.state?.skillGraph,
      previousOutputs: this.getAllPreviousOutputs(phase),
      ...data,
      workspace: '',
    };
  }

  private getAllPreviousOutputs(currentPhase: PhaseName): Record<string, any> {
    const outputs: Record<string, any> = {};
    const currentIndex = PHASE_ORDER.indexOf(currentPhase);

    if (currentIndex >= 0) {
      for (let i = 0; i < currentIndex; i++) {
        const phase = PHASE_ORDER[i] as PhaseName;
        const output = this.getPhaseOutput(phase);
        if (output) outputs[phase] = output;
      }
    }

    return outputs;
  }

  private getPhaseOutput<T>(phase: PhaseName): T | null {
    if (!this.state) return null;

    switch (phase) {
      case 'understand': return this.state.understandOutput as T;
      case 'plan': return this.state.planOutput as T;
      case 'discover-skills': return this.state.skillGraph as T;
      case 'build': return this.state.buildOutput as T;
      case 'review': return this.state.reviewOutput as T;
      case 'fix': return this.state.fixOutput as T;
      case 'validate': return this.state.validateOutput as T;
      case 'human-approval': return this.state.approvalOutput as T;
      case 'optimize': return this.state.optimizeOutput as T;
      case 'deliver': return this.state.deliverOutput as T;
    }
    return null;
  }

  private updatePhaseStatus(
    phase: PhaseName,
    status: PhaseStatus,
    output?: any,
    error?: string
  ): void {
    if (!this.state) return;

    const phaseState = this.state.phases.find(p => p.name === phase);
    if (phaseState) {
      phaseState.status = status;
      if (status === 'running') phaseState.startedAt = new Date();
      if (status === 'completed' || status === 'failed') phaseState.completedAt = new Date();
      if (error) phaseState.error = error;
    }

    this.state.currentPhase = phase;
    this.state.updatedAt = new Date();

    // Store phase output
    switch (phase) {
      case 'understand': this.state.understandOutput = output; break;
      case 'plan': this.state.planOutput = output; break;
      case 'build': this.state.buildOutput = output; break;
      case 'review': this.state.reviewOutput = output; break;
      case 'fix': this.state.fixOutput = output; break;
      case 'validate': this.state.validateOutput = output; break;
      case 'human-approval': this.state.approvalOutput = output; break;
      case 'optimize': this.state.optimizeOutput = output; break;
      case 'deliver': this.state.deliverOutput = output; break;
    }
  }

  private shouldSkipPhase(phase: PhaseName): boolean {
    if (!this.state) return false;
    const phaseState = this.state.phases.find(p => p.name === phase);
    return phaseState?.status === 'completed';
  }

  private async waitForResume(): Promise<void> {
    while (this.paused && this.running) {
      await sleep(1000);
    }
  }

  private async saveState(): Promise<void> {
    if (this.state) {
      await this.stateStore.save(this.state);
    }
  }

  private async savePhaseArtifacts(phase: string, output: any): Promise<void> {
    if (!this.state) return;

    // Create artifact for phase output
    const artifact: Artifact = {
      id: `${phase}-output-${Date.now()}`,
      type: 'phase-output',
      name: `${phase}-output`,
      content: JSON.stringify(output, null, 2),
      metadata: {
        format: 'json',
        size: JSON.stringify(output).length,
        checksum: '',
        tags: [phase, 'output'],
        dependencies: [],
      },
      version: '1.0.0',
      createdBy: 'orchestrator',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    artifact.metadata.checksum = crypto.createHash('sha256').update(typeof artifact.content === 'string' ? artifact.content : JSON.stringify(artifact.content)).digest('hex');

    this.state.artifacts.set(artifact.id, artifact);
    await this.artifactStore.save(artifact);
  }

  private async saveDeliveryPackage(output: DeliverOutput): Promise<void> {
    const outputDir = path.join(this.config.outputPath || './output', this.config.projectId);
    await fs.ensureDir(outputDir);

    // Write delivery manifest
    const manifest = {
      projectId: this.config.projectId,
      name: this.config.name,
      deliveredAt: new Date().toISOString(),
      contents: output.packageContents,
    };
    await fs.writeFile(
      path.join(outputDir, 'DELIVERY_MANIFEST.json'),
      JSON.stringify(manifest, null, 2)
    );

    this.logger.info(`Delivery package saved to: ${outputDir}`);
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export async function createOrchestrator(
  config: Partial<ProjectConfig>,
  artifactStore: ArtifactStore,
  stateStore: StateStore,
  skillRegistry: SkillRegistry,
  executionEngine: ExecutionEngine,
  logLevel: LogLevel = 'INFO'
): Promise<Orchestrator> {
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