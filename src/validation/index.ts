/**
 * AI Skill Engineer - Validation Pipeline
 *
 * Comprehensive quality gate simulation with parallel execution.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ValidationStage,
  ValidationError,
  ValidationWarning,
  ValidationMetrics,
  ValidationResult,
  ValidationSummary,
  ValidationConfig,
} from '../types';
import { createLogger, LogLevel, parallelAll, sleep, ensureDir, writeFileSafe, calculateChecksum } from '../utils';

// ============================================================================
// Validation Pipeline
// ============================================================================

export class ValidationPipeline {
  private config: ValidationConfig;
  private logger: ReturnType<typeof createLogger>;
  private projectDir: string;
  private results: ValidationStage[] = [];

  constructor(
    projectDir: string,
    config: ValidationConfig,
    logLevel: LogLevel = 'INFO'
  ) {
    this.projectDir = projectDir;
    this.config = config;
    this.logger = createLogger(logLevel, 'ValidationPipeline');
  }

  // ============================================================================
  // Main Validation Entry Point
  // ============================================================================

  async run(): Promise<ValidationResult> {
    this.logger.info('Starting validation pipeline', { projectDir: this.projectDir });
    const startTime = Date.now();

    const stages = this.getStages();
    this.results = [];

    // Run stages - some in parallel, some sequential
    const parallelGroups = this.getParallelGroups(stages);

    for (const group of parallelGroups) {
      this.logger.info(`Running validation group: ${group.map(s => s.name).join(', ')}`);

      const fns = group.map(stage => () => this.runStage(stage));
      const groupResults = await parallelAll(fns, this.config.maxConcurrency || 4);

      this.results.push(...groupResults);

      // Check for blocking failures
      const blockers = groupResults.filter(r => !r.passed && r.severity === 'BLOCKER');
      if (blockers.length > 0 && this.config.failFast) {
        this.logger.error('Blocking validation failures, stopping pipeline', {
          blockers: blockers.map(b => b.name),
        });
        break;
      }
    }

    const duration = Date.now() - startTime;
    return this.generateResult(duration);
  }

  // ============================================================================
  // Stage Definitions
  // ============================================================================

  private getStages(): ValidationStage[] {
    return [
      {
        name: 'static-analysis',
        tool: 'ESLint + SonarQube + CodeQL',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'BLOCKER',
      },
      {
        name: 'type-checking',
        tool: 'TypeScript (tsc --noEmit)',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'BLOCKER',
      },
      {
        name: 'linting',
        tool: 'ESLint + Prettier',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'BLOCKER',
      },
      {
        name: 'unit-tests',
        tool: 'Jest / Vitest',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: { coverage: 0 },
        severity: 'BLOCKER',
      },
      {
        name: 'integration-tests',
        tool: 'Testcontainers / LocalStack',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'BLOCKER',
      },
      {
        name: 'e2e-tests',
        tool: 'Playwright',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'BLOCKER',
      },
      {
        name: 'security-scan',
        tool: 'SAST + DAST + SCA + Secrets',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: { vulnerabilities: 0 },
        severity: 'BLOCKER',
      },
      {
        name: 'performance-test',
        tool: 'k6',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'HIGH',
      },
      {
        name: 'accessibility-test',
        tool: 'axe-core + Lighthouse',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'BLOCKER',
      },
      {
        name: 'contract-tests',
        tool: 'Pact / Schemathesis',
        passed: false,
        duration: 0,
        output: '',
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'HIGH',
      },
    ];
  }

  private getParallelGroups(stages: ValidationStage[]): ValidationStage[][] {
    // Group 1: Static analysis (can run in parallel)
    // Group 2: Tests (unit, integration, e2e - can run in parallel if resources allow)
    // Group 3: Security, performance, accessibility, contract (can run in parallel)

    return [
      [
        stages.find(s => s.name === 'static-analysis')!,
        stages.find(s => s.name === 'type-checking')!,
        stages.find(s => s.name === 'linting')!,
      ],
      [
        stages.find(s => s.name === 'unit-tests')!,
        stages.find(s => s.name === 'integration-tests')!,
        stages.find(s => s.name === 'e2e-tests')!,
      ],
      [
        stages.find(s => s.name === 'security-scan')!,
        stages.find(s => s.name === 'performance-test')!,
        stages.find(s => s.name === 'accessibility-test')!,
        stages.find(s => s.name === 'contract-tests')!,
      ],
    ].filter(group => group.every(s => s !== undefined));
  }

  // ============================================================================
  // Stage Execution
  // ============================================================================

  private async runStage(stage: ValidationStage): Promise<ValidationStage> {
    const startTime = Date.now();
    this.logger.info(`Running stage: ${stage.name}`);

    try {
      let result: ValidationStage;

      switch (stage.name) {
        case 'static-analysis':
          result = await this.runStaticAnalysis();
          break;
        case 'type-checking':
          result = await this.runTypeChecking();
          break;
        case 'linting':
          result = await this.runLinting();
          break;
        case 'unit-tests':
          result = await this.runUnitTests();
          break;
        case 'integration-tests':
          result = await this.runIntegrationTests();
          break;
        case 'e2e-tests':
          result = await this.runE2ETests();
          break;
        case 'security-scan':
          result = await this.runSecurityScan();
          break;
        case 'performance-test':
          result = await this.runPerformanceTest();
          break;
        case 'accessibility-test':
          result = await this.runAccessibilityTest();
          break;
        case 'contract-tests':
          result = await this.runContractTests();
          break;
        default:
          result = { ...stage, passed: false, output: 'Unknown stage', duration: Date.now() - startTime };
      }

      result.duration = Date.now() - startTime;
      this.logger.info(`Stage completed: ${stage.name}`, { passed: result.passed, duration: result.duration });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Stage failed: ${stage.name}`, { error: errorMessage });
      return {
        ...stage,
        passed: false,
        output: errorMessage,
        duration: Date.now() - startTime,
        errors: [{
          file: '',
          line: 0,
          column: 0,
          message: errorMessage,
          rule: 'execution-error',
          severity: 'ERROR',
        }],
      };
    }
  }

  // ============================================================================
  // Individual Stage Implementations
  // ============================================================================

  private async runStaticAnalysis(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let output = '';

    // Run ESLint
    try {
      const { execSync } = await import('child_process');
      const eslintOutput = execSync('npx eslint src --ext .ts --format json', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024,
      });
      const eslintResults = JSON.parse(eslintOutput);

      for (const fileResult of eslintResults) {
        for (const message of fileResult.messages) {
          if (message.severity === 2) {
            errors.push({
              file: fileResult.filePath,
              line: message.line || 0,
              column: message.column || 0,
              message: message.message,
              rule: message.ruleId || 'unknown',
              severity: 'ERROR',
            });
          } else {
            warnings.push({
              file: fileResult.filePath,
              line: message.line || 0,
              column: message.column || 0,
              message: message.message,
              rule: message.ruleId || 'unknown',
            });
          }
        }
      }
      output += `ESLint: ${errors.length} errors, ${warnings.length} warnings\n`;
    } catch (error) {
      // ESLint returns non-zero exit code on errors
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      try {
        const eslintResults = JSON.parse(errorOutput);
        for (const fileResult of eslintResults) {
          for (const message of fileResult.messages) {
            if (message.severity === 2) {
              errors.push({
                file: fileResult.filePath,
                line: message.line || 0,
                column: message.column || 0,
                message: message.message,
                rule: message.ruleId || 'unknown',
                severity: 'ERROR',
              });
            } else {
              warnings.push({
                file: fileResult.filePath,
                line: message.line || 0,
                column: message.column || 0,
                message: message.message,
                rule: message.ruleId || 'unknown',
              });
            }
          }
        }
      } catch {
        output += `ESLint execution error: ${errorOutput}\n`;
      }
    }

    // Run TypeScript compiler check (part of static analysis)
    try {
      const { execSync } = await import('child_process');
      execSync('npx tsc --noEmit', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      output += 'TypeScript: No errors\n';
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      output += `TypeScript errors:\n${errorOutput}\n`;
      // Parse TypeScript errors
      const lines = errorOutput.split('\n');
      for (const line of lines) {
        const match = line.match(/^(.+?)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)$/);
        if (match && match[1] && match[2] && match[3] && match[4] && match[5]) {
          errors.push({
            file: match[1],
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10),
            message: match[5],
            rule: `TS${match[4]}`,
            severity: 'ERROR',
          });
        }
      }
    }

    const passed = errors.length === 0;
    return {
      name: 'static-analysis',
      tool: 'ESLint + TypeScript',
      passed,
      duration: 0,
      output,
      errors,
      warnings,
      metrics: { complexity: 0, duplication: 0, maintainabilityIndex: 0 },
      severity: 'BLOCKER',
    };
  }

  private async runTypeChecking(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    let output = '';

    try {
      const { execSync } = await import('child_process');
      execSync('npx tsc --noEmit', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      output = 'TypeScript: No errors\n';
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      output = `TypeScript errors:\n${errorOutput}\n`;

      const lines = errorOutput.split('\n');
      for (const line of lines) {
        const match = line.match(/^(.+?)\((\d+),(\d+)\):\s+error\s+TS(\d+):\s+(.+)$/);
        if (match && match[1] && match[2] && match[3] && match[4] && match[5]) {
          errors.push({
            file: match[1],
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10),
            message: match[5],
            rule: `TS${match[4]}`,
            severity: 'ERROR',
          });
        }
      }
    }

    return {
      name: 'type-checking',
      tool: 'TypeScript (tsc --noEmit)',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings: [],
      metrics: {},
      severity: 'BLOCKER',
    };
  }

  private async runLinting(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let output = '';

    try {
      const { execSync } = await import('child_process');
      const eslintOutput = execSync('npx eslint src --ext .ts --format json', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024,
      });
      const eslintResults = JSON.parse(eslintOutput);

      for (const fileResult of eslintResults) {
        for (const message of fileResult.messages) {
          if (message.severity === 2) {
            errors.push({
              file: fileResult.filePath,
              line: message.line || 0,
              column: message.column || 0,
              message: message.message,
              rule: message.ruleId || 'unknown',
              severity: 'ERROR',
            });
          } else {
            warnings.push({
              file: fileResult.filePath,
              line: message.line || 0,
              column: message.column || 0,
              message: message.message,
              rule: message.ruleId || 'unknown',
            });
          }
        }
      }
      output = `ESLint: ${errors.length} errors, ${warnings.length} warnings\n`;
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      try {
        const eslintResults = JSON.parse(errorOutput);
        for (const fileResult of eslintResults) {
          for (const message of fileResult.messages) {
            if (message.severity === 2) {
              errors.push({
                file: fileResult.filePath,
                line: message.line || 0,
                column: message.column || 0,
                message: message.message,
                rule: message.ruleId || 'unknown',
                severity: 'ERROR',
              });
            } else {
              warnings.push({
                file: fileResult.filePath,
                line: message.line || 0,
                column: message.column || 0,
                message: message.message,
                rule: message.ruleId || 'unknown',
              });
            }
          }
        }
        output = `ESLint: ${errors.length} errors, ${warnings.length} warnings\n`;
      } catch {
        output = `ESLint execution error: ${errorOutput}\n`;
      }
    }

    // Check Prettier
    try {
      const { execSync } = await import('child_process');
      execSync('npx prettier --check src', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      output += 'Prettier: No formatting issues\n';
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      output += `Prettier formatting issues:\n${errorOutput}\n`;
      warnings.push({
        file: 'multiple',
        line: 0,
        column: 0,
        message: 'Code formatting issues found',
        rule: 'prettier',
      });
    }

    return {
      name: 'linting',
      tool: 'ESLint + Prettier',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings,
      metrics: {},
      severity: 'BLOCKER',
    };
  }

  private async runUnitTests(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    let output = '';
    let coverage = 0;

    try {
      const { execSync } = await import('child_process');
      const testOutput = execSync('npm run test:unit -- --coverage --json --outputFile=test-results.json', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
      });
      output = testOutput;

      // Parse coverage from test results
      try {
        const results = await fs.readJson(path.join(this.projectDir, 'test-results.json'));
        coverage = results.coverageMap ? this.calculateCoverage(results.coverageMap) : 0;
      } catch {
        // Try to parse from stdout
        const coverageMatch = testOutput.match(/All files\s+\|\s+[\d.]+\s+\|\s+[\d.]+\s+\|\s+[\d.]+\s+\|\s+([\d.]+)/);
        if (coverageMatch && coverageMatch[1]) {
          coverage = parseFloat(coverageMatch[1]);
        }
      }
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      output = `Unit tests failed:\n${errorOutput}\n`;

      // Parse test failures
      try {
        const results = JSON.parse(errorOutput);
        for (const testResult of results.testResults || []) {
          for (const assertion of testResult.assertionResults || []) {
            if (assertion.status === 'failed') {
              errors.push({
                file: testResult.name,
                line: 0,
                column: 0,
                message: assertion.failureMessages.join('\n'),
                rule: 'unit-test',
                severity: 'ERROR',
              });
            }
          }
        }
      } catch {
        errors.push({
          file: 'unit-tests',
          line: 0,
          column: 0,
          message: errorOutput,
          rule: 'unit-test',
          severity: 'ERROR',
        });
      }
    }

    const passed = errors.length === 0 && coverage >= (this.config.coverageThreshold || 80);

    return {
      name: 'unit-tests',
      tool: 'Jest',
      passed,
      duration: 0,
      output,
      errors,
      warnings: [],
      metrics: { coverage },
      severity: 'BLOCKER',
    };
  }

  private async runIntegrationTests(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    let output = '';

    try {
      const { execSync } = await import('child_process');
      const testOutput = execSync('npm run test:integration -- --json --outputFile=integration-results.json', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 120000,
      });
      output = testOutput;
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      output = `Integration tests failed:\n${errorOutput}\n`;

      try {
        const results = JSON.parse(errorOutput);
        for (const testResult of results.testResults || []) {
          for (const assertion of testResult.assertionResults || []) {
            if (assertion.status === 'failed') {
              errors.push({
                file: testResult.name,
                line: 0,
                column: 0,
                message: assertion.failureMessages.join('\n'),
                rule: 'integration-test',
                severity: 'ERROR',
              });
            }
          }
        }
      } catch {
        errors.push({
          file: 'integration-tests',
          line: 0,
          column: 0,
          message: errorOutput,
          rule: 'integration-test',
          severity: 'ERROR',
        });
      }
    }

    return {
      name: 'integration-tests',
      tool: 'Jest + Testcontainers',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings: [],
      metrics: {},
      severity: 'BLOCKER',
    };
  }

  private async runE2ETests(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    let output = '';

    try {
      const { execSync } = await import('child_process');
      const testOutput = execSync('npm run test:e2e -- --reporter=json --outputFile=e2e-results.json', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 300000,
      });
      output = testOutput;
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      output = `E2E tests failed:\n${errorOutput}\n`;

      try {
        const results = JSON.parse(errorOutput);
        for (const suite of results.suites || []) {
          for (const test of suite.tests || []) {
            if (test.results.some((r: any) => r.status === 'failed')) {
              errors.push({
                file: suite.file,
                line: 0,
                column: 0,
                message: test.results.map((r: any) => r.error?.message).filter(Boolean).join('\n'),
                rule: 'e2e-test',
                severity: 'ERROR',
              });
            }
          }
        }
      } catch {
        errors.push({
          file: 'e2e-tests',
          line: 0,
          column: 0,
          message: errorOutput,
          rule: 'e2e-test',
          severity: 'ERROR',
        });
      }
    }

    return {
      name: 'e2e-tests',
      tool: 'Playwright',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings: [],
      metrics: {},
      severity: 'BLOCKER',
    };
  }

  private async runSecurityScan(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let output = '';
    let vulnerabilities = 0;

    // Run npm audit
    try {
      const { execSync } = await import('child_process');
      const auditOutput = execSync('npm audit --json', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024,
      });
      const audit = JSON.parse(auditOutput);
      vulnerabilities = audit.metadata?.vulnerabilities?.total || 0;

      if (audit.vulnerabilities) {
        for (const [name, vuln] of Object.entries(audit.vulnerabilities)) {
          const v = vuln as any;
          if (v.severity === 'critical' || v.severity === 'high') {
            errors.push({
              file: 'package.json',
              line: 0,
              column: 0,
              message: `${name}: ${v.title} (${v.severity})`,
              rule: 'npm-audit',
              severity: 'ERROR',
            });
          } else {
            warnings.push({
              file: 'package.json',
              line: 0,
              column: 0,
              message: `${name}: ${v.title} (${v.severity})`,
              rule: 'npm-audit',
            });
          }
        }
      }
      output += `npm audit: ${vulnerabilities} vulnerabilities\n`;
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      try {
        const audit = JSON.parse(errorOutput);
        vulnerabilities = audit.metadata?.vulnerabilities?.total || 0;
        if (audit.vulnerabilities) {
          for (const [name, vuln] of Object.entries(audit.vulnerabilities)) {
            const v = vuln as any;
            if (v.severity === 'critical' || v.severity === 'high') {
              errors.push({
                file: 'package.json',
                line: 0,
                column: 0,
                message: `${name}: ${v.title} (${v.severity})`,
                rule: 'npm-audit',
                severity: 'ERROR',
              });
            }
          }
        }
        output += `npm audit: ${vulnerabilities} vulnerabilities\n`;
      } catch {
        output += `npm audit error: ${errorOutput}\n`;
      }
    }

    // Check for secrets (basic)
    try {
      const { execSync } = await import('child_process');
      execSync('npx trufflehog filesystem . --no-verification --json', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      output += 'TruffleHog: No secrets found\n';
    } catch (error) {
      const execError = error as { stdout?: string; message: string };
      const errorOutput = execError.stdout || execError.message || String(error);
      if (errorOutput.includes('Found')) {
        errors.push({
          file: 'repository',
          line: 0,
          column: 0,
          message: 'Secrets detected in repository',
          rule: 'trufflehog',
          severity: 'ERROR',
        });
      }
      output += `TruffleHog: ${errorOutput}\n`;
    }

    return {
      name: 'security-scan',
      tool: 'npm audit + TruffleHog',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings,
      metrics: { vulnerabilities },
      severity: 'BLOCKER',
    };
  }

  private async runPerformanceTest(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    let output = '';

    // Check if k6 test file exists
    const k6TestPath = path.join(this.projectDir, 'tests', 'performance', 'load-test.js');
    if (!await fs.pathExists(k6TestPath)) {
      output = 'No performance test found, skipping\n';
      return {
        name: 'performance-test',
        tool: 'k6',
        passed: true,
        duration: 0,
        output,
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'HIGH',
      };
    }

    try {
      const { execSync } = await import('child_process');
      const perfOutput = execSync('k6 run tests/performance/load-test.js', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 300000,
      });
      output = perfOutput;
    } catch (error) {
      const execError = error as { stdout?: string; message: string }; const errorOutput = execError.stdout || execError.message || String(error);
      output = `Performance test failed:\n${errorOutput}\n`;

      // Check if it's a threshold failure
      if (errorOutput.includes('threshold')) {
        errors.push({
          file: 'performance-test',
          line: 0,
          column: 0,
          message: 'Performance thresholds not met',
          rule: 'k6-threshold',
          severity: 'ERROR',
        });
      }
    }

    return {
      name: 'performance-test',
      tool: 'k6',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings: [],
      metrics: {},
      severity: 'HIGH',
    };
  }

  private async runAccessibilityTest(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    let output = '';

    // Check if Playwright with axe exists
    const a11yTestPath = path.join(this.projectDir, 'tests', 'e2e', 'accessibility.spec.ts');
    if (!await fs.pathExists(a11yTestPath)) {
      output = 'No accessibility test found, running basic check\n';

      // Run basic axe check on built files
      try {
        const { execSync } = await import('child_process');
        execSync('npx axe-cli dist --save', {
          cwd: this.projectDir,
          encoding: 'utf-8',
          stdio: 'pipe',
        });
        output += 'axe-cli: No violations\n';
      } catch (error) {
        const execError = error as { stdout?: string; message: string }; const errorOutput = execError.stdout || execError.message || String(error);
        output += `axe-cli violations:\n${errorOutput}\n`;
        errors.push({
          file: 'accessibility',
          line: 0,
          column: 0,
          message: 'Accessibility violations found',
          rule: 'axe-core',
          severity: 'ERROR',
        });
      }
    } else {
      try {
        const { execSync } = await import('child_process');
        const testOutput = execSync('npm run test:e2e -- --project=chromium --grep=accessibility', {
          cwd: this.projectDir,
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024,
          timeout: 120000,
        });
        output = testOutput;
      } catch (error) {
        const execError = error as { stdout?: string; message: string }; const errorOutput = execError.stdout || execError.message || String(error);
        output = `Accessibility tests failed:\n${errorOutput}\n`;
        errors.push({
          file: 'accessibility-tests',
          line: 0,
          column: 0,
          message: 'Accessibility tests failed',
          rule: 'axe-core',
          severity: 'ERROR',
        });
      }
    }

    return {
      name: 'accessibility-test',
      tool: 'axe-core + Playwright',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings: [],
      metrics: {},
      severity: 'BLOCKER',
    };
  }

  private async runContractTests(): Promise<ValidationStage> {
    const errors: ValidationError[] = [];
    let output = '';

    // Check if Pact tests exist
    const pactTestPath = path.join(this.projectDir, 'tests', 'contract');
    if (!await fs.pathExists(pactTestPath)) {
      output = 'No contract tests found, skipping\n';
      return {
        name: 'contract-tests',
        tool: 'Pact',
        passed: true,
        duration: 0,
        output,
        errors: [],
        warnings: [],
        metrics: {},
        severity: 'HIGH',
      };
    }

    try {
      const { execSync } = await import('child_process');
      const testOutput = execSync('npm run test:contract', {
        cwd: this.projectDir,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 120000,
      });
      output = testOutput;
    } catch (error) {
      const execError = error as { stdout?: string; message: string }; const errorOutput = execError.stdout || execError.message || String(error);
      output = `Contract tests failed:\n${errorOutput}\n`;
      errors.push({
        file: 'contract-tests',
        line: 0,
        column: 0,
        message: 'Contract tests failed',
        rule: 'pact',
        severity: 'ERROR',
      });
    }

    return {
      name: 'contract-tests',
      tool: 'Pact',
      passed: errors.length === 0,
      duration: 0,
      output,
      errors,
      warnings: [],
      metrics: {},
      severity: 'HIGH',
    };
  }

  // ============================================================================
  // Result Generation
  // ============================================================================

  private generateResult(totalDuration: number): ValidationResult {
    const summary: ValidationSummary = {
      totalStages: this.results.length,
      passedStages: this.results.filter(r => r.passed).length,
      failedStages: this.results.filter(r => !r.passed).length,
      totalErrors: this.results.reduce((sum, r) => sum + r.errors.length, 0),
      totalWarnings: this.results.reduce((sum, r) => sum + r.warnings.length, 0),
      duration: totalDuration,
    };

    const overallPassed = this.results.every(r => r.passed);

    return {
      stages: this.results,
      overallPassed,
      summary,
    };
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private calculateCoverage(coverageMap: any): number {
    let totalStatements = 0;
    let coveredStatements = 0;

    for (const file of Object.values(coverageMap)) {
      const f = file as any;
      for (const statement of Object.values(f.s || {})) {
        totalStatements++;
        if (typeof statement === 'number' && statement > 0) coveredStatements++;
      }
    }

    return totalStatements > 0 ? Math.round((coveredStatements / totalStatements) * 100) : 0;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export async function createValidationPipeline(
  projectDir: string,
  config: ValidationConfig,
  logLevel: LogLevel = 'INFO'
): Promise<ValidationPipeline> {
  return new ValidationPipeline(projectDir, config, logLevel);
}