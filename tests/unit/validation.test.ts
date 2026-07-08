/**
 * AI Skill Engineer - Unit Tests for Validation Pipeline
 */

import { ValidationPipeline } from '../../src/validation';
import { ValidationConfig } from '../../src/types';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('Validation Pipeline', () => {
  const testProjectDir = '/tmp/ai-se-test-validation';
  let validationPipeline: ValidationPipeline;

  beforeEach(async () => {
    await fs.remove(testProjectDir);
    await fs.ensureDir(testProjectDir);

    // Create a minimal package.json for npm audit
    await fs.writeFile(
      path.join(testProjectDir, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        dependencies: {},
        devDependencies: {
          typescript: '^5.0.0',
          jest: '^29.0.0',
          eslint: '^8.0.0',
        },
      }, null, 2)
    );

    // Create minimal tsconfig.json
    await fs.writeFile(
      path.join(testProjectDir, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
          strict: true,
          outDir: './dist',
        },
        include: ['src/**/*'],
      }, null, 2)
    );

    // Create src directory
    await fs.ensureDir(path.join(testProjectDir, 'src'));
    await fs.writeFile(
      path.join(testProjectDir, 'src', 'index.ts'),
      'export function hello(): string { return "Hello, World!"; }'
    );

    const config: ValidationConfig = {
      maxConcurrency: 2,
      failFast: true,
      coverageThreshold: 80,
    };

    validationPipeline = new ValidationPipeline(testProjectDir, config, 'WARN');
  });

  afterEach(async () => {
    await fs.remove(testProjectDir);
  });

  describe('Stage Definitions', () => {
    it('should have all required stages', () => {
      const stages = (validationPipeline as any).getStages();
      expect(stages).toHaveLength(10);

      const stageNames = stages.map((s: any) => s.name);
      expect(stageNames).toContain('static-analysis');
      expect(stageNames).toContain('type-checking');
      expect(stageNames).toContain('linting');
      expect(stageNames).toContain('unit-tests');
      expect(stageNames).toContain('integration-tests');
      expect(stageNames).toContain('e2e-tests');
      expect(stageNames).toContain('security-scan');
      expect(stageNames).toContain('performance-test');
      expect(stageNames).toContain('accessibility-test');
      expect(stageNames).toContain('contract-tests');
    });

    it('should have correct parallel groups', () => {
      const stages = (validationPipeline as any).getStages();
      const groups = (validationPipeline as any).getParallelGroups(stages);

      expect(groups).toHaveLength(3);

      // Group 1: Static analysis
      expect(groups[0].map((s: any) => s.name).sort()).toEqual([
        'linting', 'static-analysis', 'type-checking',
      ]);

      // Group 2: Tests
      expect(groups[1].map((s: any) => s.name).sort()).toEqual([
        'e2e-tests', 'integration-tests', 'unit-tests',
      ]);

      // Group 3: Security, performance, accessibility, contract
      expect(groups[2].map((s: any) => s.name).sort()).toEqual([
        'accessibility-test', 'contract-tests', 'performance-test', 'security-scan',
      ]);
    });
  });

  describe('Coverage Calculation', () => {
    it('should calculate coverage from coverage map', () => {
      const coverageMap = {
        'file1.ts': {
          s: { '1': 1, '2': 0, '3': 1 },
        },
        'file2.ts': {
          s: { '1': 1, '2': 1 },
        },
      };

      const coverage = (validationPipeline as any).calculateCoverage(coverageMap);
      expect(coverage).toBe(80); // 4 covered out of 5 total
    });

    it('should handle empty coverage map', () => {
      const coverage = (validationPipeline as any).calculateCoverage({});
      expect(coverage).toBe(0);
    });
  });

  describe('Type Checking Stage', () => {
    it('should run type checking', async () => {
      const stage = await (validationPipeline as any).runTypeChecking();
      expect(stage.name).toBe('type-checking');
      expect(stage.tool).toBe('TypeScript (tsc --noEmit)');
      expect(typeof stage.passed).toBe('boolean');
      expect(stage.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Linting Stage', () => {
    it('should run linting', async () => {
      const stage = await (validationPipeline as any).runLinting();
      expect(stage.name).toBe('linting');
      expect(stage.tool).toBe('ESLint + Prettier');
      expect(typeof stage.passed).toBe('boolean');
    });
  });

  describe('Security Scan Stage', () => {
    it('should run security scan', async () => {
      const stage = await (validationPipeline as any).runSecurityScan();
      expect(stage.name).toBe('security-scan');
      expect(stage.tool).toContain('npm audit');
      expect(typeof stage.passed).toBe('boolean');
      expect(stage.metrics.vulnerabilities).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance Test Stage', () => {
    it('should skip if no test file exists', async () => {
      const stage = await (validationPipeline as any).runPerformanceTest();
      expect(stage.name).toBe('performance-test');
      expect(stage.passed).toBe(true); // Should pass when skipped
      expect(stage.output).toContain('skipping');
    });
  });

  describe('Accessibility Test Stage', () => {
    it('should run accessibility test', async () => {
      const stage = await (validationPipeline as any).runAccessibilityTest();
      expect(stage.name).toBe('accessibility-test');
      expect(stage.tool).toContain('axe-core');
      expect(typeof stage.passed).toBe('boolean');
    });
  });

  describe('Contract Tests Stage', () => {
    it('should skip if no contract tests exist', async () => {
      const stage = await (validationPipeline as any).runContractTests();
      expect(stage.name).toBe('contract-tests');
      expect(stage.passed).toBe(true); // Should pass when skipped
      expect(stage.output).toContain('skipping');
    });
  });

  describe('Result Generation', () => {
    it('should generate validation result', () => {
      const mockResults = [
        { name: 'stage1', passed: true, duration: 1000, errors: [], warnings: [] },
        { name: 'stage2', passed: false, duration: 2000, errors: [{ message: 'error' }], warnings: [] },
      ];

      (validationPipeline as any).results = mockResults;
      const result = (validationPipeline as any).generateResult(3000);

      expect(result.overallPassed).toBe(false);
      expect(result.summary.totalStages).toBe(2);
      expect(result.summary.passedStages).toBe(1);
      expect(result.summary.failedStages).toBe(1);
      expect(result.summary.totalErrors).toBe(1);
      expect(result.summary.duration).toBe(3000);
    });
  });
});