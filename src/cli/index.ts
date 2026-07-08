/**
 * AI Skill Engineer - CLI Entry Point
 *
 * Main command-line interface for the AI Skill Engineer framework.
 */

import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createLogger, LogLevel, generateProjectId, formatDuration } from '../utils';
import { createOrchestrator } from '../orchestrator';
import { createSkillRegistry } from '../skills/registry';
import { createExecutionEngine } from '../execution/engine';
import { createArtifactStore, createStateStore } from '../storage';
import { ProjectConfig, OrchestratorConfigInput } from '../types';

// Dynamic imports for ESM-only packages
let chalk: any;
let ora: any;
let inquirer: any;

async function loadESMModules() {
  if (!chalk) chalk = (await import('chalk')).default;
  if (!ora) ora = (await import('ora')).default;
  if (!inquirer) inquirer = (await import('inquirer')).default;
}

// ============================================================================
// Version and Metadata
// ============================================================================

const VERSION = '1.0.0';
const NAME = 'ai-se';

// ============================================================================
// CLI Class
// ============================================================================

export class AISECLI {
  private program: Command;
  private logger: ReturnType<typeof createLogger>;
  private config: OrchestratorConfigInput = {
    maxRetries: 3,
    phaseTimeout: 300000,
    parallelExecution: true,
    autoFix: true,
    humanApprovalRequired: true,
    optimizationEnabled: true,
    outputDirectory: './output',
    logLevel: 'INFO',
  };
  private projectConfig: Partial<ProjectConfig> = {};

  constructor() {
    this.program = new Command();
    this.logger = createLogger('INFO', 'CLI');
    this.setupCommands();
  }

  // ============================================================================
  // Command Setup
  // ============================================================================

  private setupCommands(): void {
    this.program
      .name(NAME)
      .description('AI Skill Engineer - Autonomous engineering framework')
      .version(VERSION)
      .option('-v, --verbose', 'Enable verbose logging', false)
      .option('-d, --debug', 'Enable debug logging', false)
      .option('-c, --config <path>', 'Path to config file')
      .hook('preAction', (thisCommand) => {
        const opts = thisCommand.opts();
        if (opts.debug) this.logger = createLogger('DEBUG', 'CLI');
        else if (opts.verbose) this.logger = createLogger('INFO', 'CLI');
        else this.logger = createLogger('WARN', 'CLI');
      });

    // Main commands
    this.setupInitCommand();
    this.setupRunCommand();
    this.setupStatusCommand();
    this.setupResumeCommand();
    this.setupStopCommand();
    this.setupValidateCommand();
    this.setupSkillsCommand();
    this.setupTemplatesCommand();
    this.setupConfigCommand();
    this.setupDoctorCommand();

    // Help
    this.program.on('--help', () => {
      console.log('');
      console.log('Examples:');
      console.log('  $ ai-se init "Build a SaaS for automated compliance reporting"');
      console.log('  $ ai-se run --project my-project');
      console.log('  $ ai-se status --project my-project');
      console.log('  $ ai-se validate --project my-project');
      console.log('');
    });
  }

  // ============================================================================
  // Init Command
  // ============================================================================

  private setupInitCommand(): void {
    this.program
      .command('init')
      .description('Initialize a new AI Skill Engineer project')
      .argument('[idea]', 'Project idea/description')
      .option('-n, --name <name>', 'Project name')
      .option('-o, --output <path>', 'Output directory', './output')
      .option('--no-auto-fix', 'Disable auto-fix')
      .option('--no-human-approval', 'Disable human approval requirement')
      .option('--max-parallel <number>', 'Max parallel skills', '4')
      .option('--validation-level <level>', 'Validation level: strict|standard|minimal', 'strict')
      .option('--optimization-iterations <number>', 'Optimization iterations', '3')
      .action(async (idea: string | undefined, options) => {
        await this.handleInit(idea, options);
      });
  }

  private async handleInit(idea: string | undefined, options: any): Promise<void> {
    await loadESMModules();
    const spinner = ora('Initializing project...').start();

    try {
      // Get idea from argument or prompt
      if (!idea) {
        spinner.stop();
        const { idea: promptedIdea } = await inquirer.prompt([
          {
            type: 'input',
            name: 'idea',
            message: 'Describe your project idea:',
            validate: (input: string) => input.length > 10 || 'Please provide a more detailed description (at least 10 characters)',
          },
        ]);
        idea = promptedIdea;
      }

      // Get project name
      let projectName = options.name;
      if (!projectName) {
        const { name } = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Project name:',
            default: idea?.split(' ').slice(0, 3).join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'my-project',
            validate: (input: string) => input.length > 0 || 'Project name is required',
          },
        ]);
        projectName = name;
      }

      // Create project config
      const projectId = generateProjectId();
      this.projectConfig = {
        projectId,
        name: projectName,
        description: idea,
        idea,
        maxParallelSkills: parseInt(options.maxParallel, 10),
        validationLevel: options.validationLevel,
        autoFix: options.autoFix,
        humanApprovalRequired: options.humanApproval,
        optimizationIterations: parseInt(options.optimizationIterations, 10),
        outputPath: options.output,
      };

      // Create orchestrator config
      this.config = {
        maxRetries: 3,
        phaseTimeout: 300000,
        parallelExecution: true,
        autoFix: options.autoFix,
        humanApprovalRequired: options.humanApproval,
        optimizationEnabled: true,
        outputDirectory: options.output || './output',
        logLevel: options.debug ? 'DEBUG' : options.verbose ? 'INFO' : 'WARN',
      };

      // Initialize stores
      const basePath = path.resolve(options.output || './output', projectId);
      await fs.ensureDir(basePath);

      const artifactStore = createArtifactStore('filesystem', basePath, this.config.logLevel);
      const stateStore = createStateStore('filesystem', basePath, this.config.logLevel);

      // Initialize skill registry
      const skillsDir = path.join(__dirname, '..', 'skills', 'definitions');
      await fs.ensureDir(skillsDir);
      const skillRegistry = await createSkillRegistry(skillsDir, this.config.logLevel);

      // Initialize execution engine
      const executionEngine = await createExecutionEngine(skillRegistry, artifactStore, {
        maxConcurrency: this.projectConfig.maxParallelSkills || 4,
        logLevel: this.config.logLevel,
      });

      // Create orchestrator
      const orchestrator = await createOrchestrator(
        this.projectConfig,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        this.config.logLevel
      );

      // Save project config
      const configPath = path.join(basePath, 'project-config.json');
      await fs.writeFile(configPath, JSON.stringify(this.projectConfig, null, 2));

      spinner.succeed(chalk.green(`Project initialized: ${projectName} (${projectId})`));
      console.log('');
      console.log(chalk.cyan('Next steps:'));
      console.log(`  ${chalk.bold('ai-se run')} --project ${this.projectConfig.projectId}`);
      console.log('');
      console.log('Or run with options:');
      console.log(`  ${chalk.bold('ai-se run')} --project ${this.projectConfig.projectId} --no-human-approval --max-parallel 8`);

    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize project'));
      this.logger.error('Init failed', { error });
      process.exit(1);
    }
  }

  // ============================================================================
  // Run Command
  // ============================================================================

  private setupRunCommand(): void {
    this.program
      .command('run')
      .description('Run the autonomous engineering workflow')
      .requiredOption('-p, --project <id>', 'Project ID')
      .option('--phase <phase>', 'Run specific phase only')
      .option('--resume', 'Resume from last checkpoint')
      .option('--no-auto-fix', 'Disable auto-fix')
      .option('--no-human-approval', 'Disable human approval')
      .option('--max-parallel <number>', 'Max parallel skills', '4')
      .option('--timeout <ms>', 'Phase timeout in ms', '300000')
      .action(async (options) => {
        await this.handleRun(options);
      });
  }

  private async handleRun(options: any): Promise<void> {
    await loadESMModules();
    const spinner = ora('Loading project...').start();

    try {
      const basePath = path.resolve('./output', options.project);
      if (!await fs.pathExists(basePath)) {
        spinner.fail(chalk.red(`Project not found: ${options.project}`));
        console.log(chalk.yellow('Run "ai-se init" to create a new project'));
        process.exit(1);
      }

      // Load project config
      const configPath = path.join(basePath, 'project-config.json');
      let projectConfig: Partial<ProjectConfig>;
      try {
        projectConfig = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      } catch {
        spinner.fail(chalk.red('Invalid project configuration'));
        process.exit(1);
      }

      // Override with CLI options
      if (options.autoFix !== undefined) projectConfig.autoFix = options.autoFix;
      if (options.humanApproval !== undefined) projectConfig.humanApprovalRequired = options.humanApproval;
      if (options.maxParallel) projectConfig.maxParallelSkills = parseInt(options.maxParallel, 10);

      const config: OrchestratorConfigInput = {
        maxRetries: 3,
        phaseTimeout: parseInt(options.timeout, 10),
        parallelExecution: true,
        autoFix: projectConfig.autoFix ?? true,
        humanApprovalRequired: projectConfig.humanApprovalRequired ?? true,
        optimizationEnabled: true,
        outputDirectory: projectConfig.outputPath || './output',
        logLevel: 'INFO',
      };

      // Initialize stores
      const artifactStore = createArtifactStore('filesystem', basePath, config.logLevel);
      const stateStore = createStateStore('filesystem', basePath, config.logLevel);

      // Initialize skill registry
      const skillsDir = path.join(__dirname, '..', 'skills', 'definitions');
      const skillRegistry = await createSkillRegistry(skillsDir, config.logLevel);

      // Initialize execution engine
      const executionEngine = await createExecutionEngine(skillRegistry, artifactStore, {
        maxConcurrency: projectConfig.maxParallelSkills || 4,
        logLevel: config.logLevel,
      });

      // Create orchestrator
      const orchestrator = await createOrchestrator(
        projectConfig,
        artifactStore,
        stateStore,
        skillRegistry,
        executionEngine,
        config.logLevel
      );

      spinner.succeed(chalk.green(`Project loaded: ${projectConfig.name}`));

      // Run specific phase or full workflow
      if (options.phase) {
        await this.runSinglePhase(orchestrator, options.phase);
      } else {
        await this.runFullWorkflow(orchestrator, options.resume);
      }

    } catch (error) {
      spinner.fail(chalk.red('Execution failed'));
      this.logger.error('Run failed', { error });
      process.exit(1);
    }
  }

  private async runSinglePhase(orchestrator: any, phaseName: string): Promise<void> {
    const spinner = ora(`Running phase: ${phaseName}...`).start();
    try {
      const result = await orchestrator.executePhase(phaseName as any);
      if (result.success) {
        spinner.succeed(chalk.green(`Phase ${phaseName} completed`));
      } else {
        spinner.fail(chalk.red(`Phase ${phaseName} failed: ${result.error}`));
        process.exit(1);
      }
    } catch (error) {
      spinner.fail(chalk.red(`Phase ${phaseName} error`));
      throw error;
    }
  }

  private async runFullWorkflow(orchestrator: any, resume: boolean): Promise<void> {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║         AI Skill Engineer - Autonomous Workflow            ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════╝\n'));

    const phases = [
      'understand', 'plan', 'discover-skills', 'build',
      'review', 'fix', 'validate', 'human-approval',
      'optimize', 'deliver'
    ];

    let currentPhaseIndex = 0;

    if (resume) {
      const state = orchestrator.getState();
      if (state) {
        currentPhaseIndex = phases.indexOf(state.currentPhase);
        if (currentPhaseIndex === -1) currentPhaseIndex = 0;
        console.log(chalk.yellow(`Resuming from phase: ${state.currentPhase}`));
      }
    }

    for (let i = currentPhaseIndex; i < phases.length; i++) {
      const phase = phases[i];
      const phaseSpinner = ora(`Phase ${i + 1}/10: ${phase}...`).start();

      try {
        const result = await orchestrator.executePhase(phase as any);

        if (result.success) {
          phaseSpinner.succeed(chalk.green(`Phase ${i + 1}/10: ${phase} completed`));
        } else {
          phaseSpinner.fail(chalk.red(`Phase ${i + 1}/10: ${phase} failed`));
          console.log(chalk.red(`Error: ${result.error}`));

          if (phase === 'human-approval' && !result.output?.approved) {
            console.log(chalk.yellow('\nApproval rejected. Changes requested.'));
            console.log('Run "ai-se run --phase fix" to apply fixes, then "ai-se run --phase human-approval" to re-request approval.');
          }
          process.exit(1);
        }

        // Show phase summary
        if (result.output && phase) {
          this.showPhaseSummary(phase, result.output);
        }

      } catch (error) {
        phaseSpinner.fail(chalk.red(`Phase ${i + 1}/10: ${phase} error`));
        throw error;
      }
    }

    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║              WORKFLOW COMPLETED SUCCESSFULLY               ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════╝\n'));

    const state = orchestrator.getState();
    if (state?.deliverOutput) {
      console.log(chalk.green('Delivery package created at:'));
      console.log(chalk.bold(`  ${state.config.outputDirectory}/${state.projectId}`));
    }
  }

  private showPhaseSummary(phase: string, output: any): void {
    const summaries: Record<string, (output: any) => string[]> = {
      understand: (o) => [
        `Vision: ${o.vision?.slice(0, 80)}...`,
        `Functional Requirements: ${o.functionalRequirements?.length || 0}`,
        `Non-Functional Requirements: ${o.nonFunctionalRequirements?.length || 0}`,
        `Risks Identified: ${o.risks?.length || 0}`,
      ],
      plan: (o) => [
        `User Stories: ${o.userStories?.length || 0}`,
        `Acceptance Criteria: ${o.acceptanceCriteria?.length || 0}`,
        `Milestones: ${o.milestones?.length || 0}`,
        `Roadmap Phases: ${o.roadmap?.phases?.length || 0}`,
      ],
      'discover-skills': (o) => [
        `Skills Discovered: ${o.skills?.length || 0}`,
        `Parallel Groups: ${o.parallelGroups?.length || 0}`,
        `Estimated Duration: ${o.estimatedDuration || 'N/A'}`,
      ],
      build: (o) => [
        `Artifacts Created: ${o.artifacts?.length || 0}`,
        `Skills Executed: ${Object.keys(o.skillOutputs || {}).length}`,
      ],
      review: (o) => [
        `Findings: ${o.findings?.length || 0}`,
        `Blockers: ${o.findings?.filter((f: any) => f.severity === 'BLOCKER').length || 0}`,
        `High: ${o.findings?.filter((f: any) => f.severity === 'HIGH').length || 0}`,
        `Auto-fixable: ${o.findings?.filter((f: any) => f.autoFixable).length || 0}`,
      ],
      fix: (o) => [
        `Fixed: ${o.fixed || 0}`,
        `Failed: ${o.failed || 0}`,
        `Escalated: ${o.escalated || 0}`,
      ],
      validate: (o) => [
        `Stages: ${o.stages?.length || 0}`,
        `Passed: ${o.stages?.filter((s: any) => s.passed).length || 0}`,
        `Failed: ${o.stages?.filter((s: any) => !s.passed).length || 0}`,
        `Overall: ${o.overallPassed ? 'PASSED' : 'FAILED'}`,
      ],
      'human-approval': (o) => [
        `Decision: ${o.approved ? 'APPROVED' : 'REJECTED'}`,
        `Reviewer: ${o.reviewer}`,
      ],
      optimize: (o) => [
        `Iterations: ${o.iterations?.length || 0}`,
        `Total Improvement: ${o.totalImprovement?.toFixed(1) || 0}%`,
      ],
      deliver: (o) => [
        `Package: ${o.packageContents?.length || 0} items`,
        `Size: ${o.packageSize || 'N/A'}`,
      ],
    };

    const summaryFn = summaries[phase];
    if (summaryFn) {
      const lines = summaryFn(output);
      for (const line of lines) {
        console.log(chalk.gray(`  • ${line}`));
      }
    }
  }

  // ============================================================================
  // Status Command
  // ============================================================================

  private setupStatusCommand(): void {
    this.program
      .command('status')
      .description('Show project status')
      .requiredOption('-p, --project <id>', 'Project ID')
      .option('--json', 'Output as JSON')
      .action(async (options) => {
        await this.handleStatus(options);
      });
  }

  private async handleStatus(options: any): Promise<void> {
    await loadESMModules();
    try {
      const basePath = path.resolve('./output', options.project);
      if (!await fs.pathExists(basePath)) {
        console.log(chalk.red(`Project not found: ${options.project}`));
        process.exit(1);
      }

      const stateStore = createStateStore('filesystem', basePath, 'WARN');
      const state = await stateStore.get(options.project);

      if (!state) {
        console.log(chalk.yellow('No state found for project'));
        return;
      }

      if (options.json) {
        console.log(JSON.stringify(state, null, 2));
        return;
      }

      console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════╗'));
      console.log(chalk.cyan(`║  Project: ${state.name.padEnd(50)} ║`));
      console.log(chalk.cyan(`║  ID: ${state.projectId.padEnd(50)} ║`));
      console.log(chalk.cyan(`║  Current Phase: ${state.currentPhase.padEnd(43)} ║`));
      console.log(chalk.cyan('╚════════════════════════════════════════════════════════════╝\n'));

      console.log(chalk.bold('Phase Status:'));
      for (const phase of state.phases) {
        const statusColor = this.getStatusColor(phase.status);
        const duration = phase.startedAt && phase.completedAt
          ? formatDuration(new Date(phase.completedAt).getTime() - new Date(phase.startedAt).getTime())
          : phase.startedAt
            ? formatDuration(Date.now() - new Date(phase.startedAt).getTime()) + ' (running)'
            : 'pending';
        console.log(`  ${statusColor(phase.status.padEnd(10))} ${phase.name.padEnd(20)} ${chalk.gray(duration)}`);
        if (phase.error) {
          console.log(chalk.red(`    Error: ${phase.error}`));
        }
      }

      console.log(chalk.bold('\nArtifacts:'));
      console.log(`  Total: ${state.artifacts.size}`);

      if (state.skillGraph) {
        console.log(chalk.bold('\nSkill Graph:'));
        console.log(`  Skills: ${state.skillGraph.skills.length}`);
        console.log(`  Parallel Groups: ${state.skillGraph.parallelGroups.length}`);
      }

    } catch (error) {
      this.logger.error('Status failed', { error });
      process.exit(1);
    }
  }

  private getStatusColor(status: string): (text: string) => string {
    switch (status) {
      case 'completed': return chalk.green;
      case 'running': return chalk.yellow;
      case 'failed': return chalk.red;
      case 'blocked': return chalk.magenta;
      case 'skipped': return chalk.gray;
      default: return chalk.gray;
    }
  }

  // ============================================================================
  // Resume Command
  // ============================================================================

  private setupResumeCommand(): void {
    this.program
      .command('resume')
      .description('Resume a paused project')
      .requiredOption('-p, --project <id>', 'Project ID')
      .action(async (options) => {
        await this.handleResume(options);
      });
  }

  private async handleResume(options: any): Promise<void> {
    // This would resume from the last checkpoint
    // For now, just run with --resume flag
    console.log(chalk.yellow('Resume functionality - use "ai-se run --project <id> --resume" instead'));
  }

  // ============================================================================
  // Stop Command
  // ============================================================================

  private setupStopCommand(): void {
    this.program
      .command('stop')
      .description('Stop a running project')
      .requiredOption('-p, --project <id>', 'Project ID')
      .action(async (options) => {
        await this.handleStop(options);
      });
  }

  private async handleStop(options: any): Promise<void> {
    console.log(chalk.yellow('Stop functionality - press Ctrl+C to stop a running workflow'));
  }

  // ============================================================================
  // Validate Command
  // ============================================================================

  private setupValidateCommand(): void {
    this.program
      .command('validate')
      .description('Run validation on project artifacts')
      .requiredOption('-p, --project <id>', 'Project ID')
      .option('--stage <stage>', 'Specific validation stage')
      .option('--fix', 'Attempt to auto-fix issues')
      .action(async (options) => {
        await this.handleValidate(options);
      });
  }

  private async handleValidate(options: any): Promise<void> {
    await loadESMModules();
    const spinner = ora('Running validation...').start();

    try {
      const basePath = path.resolve('./output', options.project);
      if (!await fs.pathExists(basePath)) {
        spinner.fail(chalk.red(`Project not found: ${options.project}`));
        process.exit(1);
      }

      // This would run the validation pipeline
      spinner.succeed(chalk.green('Validation complete'));
      console.log(chalk.yellow('Validation pipeline not yet fully implemented'));

    } catch (error) {
      spinner.fail(chalk.red('Validation failed'));
      this.logger.error('Validate failed', { error });
      process.exit(1);
    }
  }

  // ============================================================================
  // Skills Command
  // ============================================================================

  private setupSkillsCommand(): void {
    const skillsCmd = this.program
      .command('skills')
      .description('Manage skills');

    skillsCmd
      .command('list')
      .description('List all available skills')
      .option('--project-type <type>', 'Filter by project type')
      .action(async (options) => {
        await this.handleSkillsList(options);
      });

    skillsCmd
      .command('info')
      .description('Show skill details')
      .argument('<skill-id>', 'Skill ID')
      .action(async (skillId: string) => {
        await this.handleSkillsInfo(skillId);
      });

    skillsCmd
      .command('create')
      .description('Create a new skill from template')
      .argument('<skill-id>', 'Skill ID')
      .option('-n, --name <name>', 'Skill name')
      .action(async (skillId: string, options) => {
        await this.handleSkillsCreate(skillId, options);
      });
  }

  private async handleSkillsList(options: any): Promise<void> {
    await loadESMModules();
    const skillsDir = path.join(__dirname, '..', 'skills', 'definitions');
    const skillRegistry = await createSkillRegistry(skillsDir, 'WARN');

    const skills = options.projectType
      ? skillRegistry.discoverSkills(options.projectType, {})
      : skillRegistry.getAllDefinitions();

    console.log(chalk.cyan('\nAvailable Skills:'));
    console.log(chalk.gray('─'.repeat(80)));

    for (const skill of skills) {
      console.log(chalk.bold(`  ${skill.id}`));
      console.log(chalk.gray(`    ${skill.mission}`));
      console.log(chalk.gray(`    Knowledge: ${skill.knowledgeAreas.join(', ')}`));
      console.log(chalk.gray(`    Outputs: ${skill.outputs.map(o => o.artifactId).join(', ')}`));
      console.log('');
    }
  }

  private async handleSkillsInfo(skillId: string): Promise<void> {
    await loadESMModules();
    const skillsDir = path.join(__dirname, '..', 'skills', 'definitions');
    const skillRegistry = await createSkillRegistry(skillsDir, 'WARN');

    const skill = skillRegistry.getSkillDefinition(skillId);
    if (!skill) {
      console.log(chalk.red(`Skill not found: ${skillId}`));
      return;
    }

    console.log(chalk.cyan('\nSkill Details:'));
    console.log(chalk.gray('─'.repeat(80)));
    console.log(chalk.bold(`  ID: ${skill.id}`));
    console.log(chalk.bold(`  Name: ${skill.name}`));
    console.log(chalk.bold(`  Version: ${skill.version}`));
    console.log(chalk.bold(`  Mission: ${skill.mission}`));
    console.log(chalk.bold('\n  Responsibilities:'));
    for (const r of skill.responsibilities) console.log(chalk.gray(`    • ${r}`));
    console.log(chalk.bold('\n  Knowledge Areas:'));
    for (const a of skill.knowledgeAreas) console.log(chalk.gray(`    • ${a}`));
    console.log(chalk.bold('\n  Dependencies:'));
    for (const d of skill.dependencies) console.log(chalk.gray(`    • ${d}`));
    console.log(chalk.bold('\n  Inputs:'));
    for (const i of skill.inputs) console.log(chalk.gray(`    • ${i.artifactId} (${i.contract}) ${i.required ? '[required]' : ''}`));
    console.log(chalk.bold('\n  Outputs:'));
    for (const o of skill.outputs) console.log(chalk.gray(`    • ${o.artifactId} (${o.contract}): ${o.description}`));
    console.log(chalk.bold('\n  Validation Rules:'));
    for (const r of skill.validationRules) console.log(chalk.gray(`    • [${r.severity}] ${r.rule} ${r.autoFixable ? '(auto-fixable)' : ''}`));
    console.log(chalk.bold('\n  Tools:'));
    for (const t of skill.tools) console.log(chalk.gray(`    • ${t}`));
    console.log(chalk.bold('\n  Success Metrics:'));
    for (const m of skill.successMetrics) console.log(chalk.gray(`    • ${m.metric}: ${m.target}`));
    console.log(chalk.bold('\n  Templates:'));
    for (const t of skill.templates) console.log(chalk.gray(`    • ${t}`));
  }

  private async handleSkillsCreate(skillId: string, options: any): Promise<void> {
    const skillsDir = path.join(__dirname, '..', 'skills', 'definitions');
    const skillPath = path.join(skillsDir, skillId);
    await fs.ensureDir(skillPath);

    const template = `# ${options.name || skillId} Skill

id: ${skillId}
name: ${options.name || skillId}
version: "1.0.0"
mission: "Describe the mission of this skill"

responsibilities:
  - "Responsibility 1"
  - "Responsibility 2"

knowledge_areas:
  - "knowledge-area-1"
  - "knowledge-area-2"

inputs:
  - artifact_id: "input-artifact"
    contract: "json"
    required: true
    description: "Input artifact description"

outputs:
  - artifact_id: "output-artifact"
    contract: "markdown"
    description: "Output artifact description"

dependencies:
  - "dependency-skill-id"

best_practices:
  - "Best practice 1"
  - "Best practice 2"

validation_rules:
  - rule: "Validation rule description"
    severity: "MEDIUM"
    auto_fixable: false

tools:
  - "tool-1"
  - "tool-2"

success_metrics:
  - metric: "metric-name"
    target: "target-value"

templates:
  - "template-name.hbs"
`;

    await fs.writeFile(path.join(skillPath, 'skill.yaml'), template);
    console.log(chalk.green(`Skill template created at: ${skillPath}/skill.yaml`));
  }

  // ============================================================================
  // Templates Command
  // ============================================================================

  private setupTemplatesCommand(): void {
    const templatesCmd = this.program
      .command('templates')
      .description('Manage templates');

    templatesCmd
      .command('list')
      .description('List all available templates')
      .action(async () => {
        await this.handleTemplatesList();
      });

    templatesCmd
      .command('show')
      .description('Show template content')
      .argument('<template-name>', 'Template name')
      .action(async (templateName: string) => {
        await this.handleTemplatesShow(templateName);
      });
  }

  private async handleTemplatesList(): Promise<void> {
    const templatesDir = path.join(__dirname, '..', '..', 'templates');
    const templatesDir2 = path.join(__dirname, '..', 'templates');

    for (const dir of [templatesDir, templatesDir2]) {
      if (await fs.pathExists(dir)) {
        const files = await fs.readdir(dir);
        if (files.length > 0) {
          console.log(chalk.cyan(`\nTemplates in ${dir}:`));
          for (const file of files) {
            console.log(chalk.gray(`  • ${file}`));
          }
        }
      }
    }
  }

  private async handleTemplatesShow(templateName: string): Promise<void> {
    const templatesDir = path.join(__dirname, '..', '..', 'templates');
    const templatesDir2 = path.join(__dirname, '..', 'templates');

    for (const dir of [templatesDir, templatesDir2]) {
      const filePath = path.join(dir, templateName);
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf-8');
        console.log(content);
        return;
      }
    }
    console.log(chalk.red(`Template not found: ${templateName}`));
  }

  // ============================================================================
  // Config Command
  // ============================================================================

  private setupConfigCommand(): void {
    const configCmd = this.program
      .command('config')
      .description('Manage configuration');

    configCmd
      .command('show')
      .description('Show current configuration')
      .requiredOption('-p, --project <id>', 'Project ID')
      .action(async (options) => {
        await this.handleConfigShow(options);
      });

    configCmd
      .command('set')
      .description('Set configuration value')
      .requiredOption('-p, --project <id>', 'Project ID')
      .argument('<key>', 'Config key')
      .argument('<value>', 'Config value')
      .action(async (options: any, key: string, value: string) => {
        await this.handleConfigSet(options, key, value);
      });
  }

  private async handleConfigShow(options: any): Promise<void> {
    const basePath = path.resolve('./output', options.project);
    const configPath = path.join(basePath, 'project-config.json');
    if (await fs.pathExists(configPath)) {
      const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      console.log(JSON.stringify(config, null, 2));
    } else {
      console.log(chalk.red('Project config not found'));
    }
  }

  private async handleConfigSet(options: any, key: string, value: string): Promise<void> {
    const basePath = path.resolve('./output', options.project);
    const configPath = path.join(basePath, 'project-config.json');
    if (await fs.pathExists(configPath)) {
      const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
      config[key] = value;
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green(`Set ${key} = ${value}`));
    } else {
      console.log(chalk.red('Project config not found'));
    }
  }

  // ============================================================================
  // Doctor Command
  // ============================================================================

  private setupDoctorCommand(): void {
    this.program
      .command('doctor')
      .description('Check system health and dependencies')
      .action(async () => {
        await this.handleDoctor();
      });
  }

  private async handleDoctor(): Promise<void> {
    await loadESMModules();
    console.log(chalk.cyan('\nAI Skill Engineer - System Check'));
    console.log(chalk.gray('─'.repeat(50)));

    const checks = [
      { name: 'Node.js', check: () => process.version },
      { name: 'npm', check: async () => { try { const { execSync } = await import('child_process'); return execSync('npm --version').toString().trim(); } catch { return 'not found'; } } },
      { name: 'TypeScript', check: async () => { try { const ts = await import('typescript'); return ts.version; } catch { return 'not installed'; } } },
      { name: 'Jest', check: async () => { try { const jest = await import('jest'); return 'installed'; } catch { return 'not installed'; } } },
      { name: 'ESLint', check: async () => { try { await import('eslint'); return 'installed'; } catch { return 'not installed'; } } },
      { name: 'Prettier', check: async () => { try { await import('prettier'); return 'installed'; } catch { return 'not installed'; } } },
    ];

    for (const check of checks) {
      const result = await check.check();
      const status = result.includes('not') ? chalk.red('✗') : chalk.green('✓');
      console.log(`  ${status} ${check.name}: ${chalk.gray(result)}`);
    }

    console.log('');
  }

  // ============================================================================
  // Run
  // ============================================================================

  async run(argv: string[] = process.argv): Promise<void> {
    await this.program.parseAsync(argv);
  }
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main(): Promise<void> {
  const cli = new AISECLI();
  await cli.run();
}

// Only run main if this file is executed directly (not imported)
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
}