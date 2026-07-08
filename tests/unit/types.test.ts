/**
 * AI Skill Engineer - Unit Tests for Types
 */

import {
  BusinessGoal,
  FunctionalRequirement,
  NonFunctionalRequirement,
  Constraint,
  Risk,
  Opportunity,
  SuccessCriterion,
  UnderstandOutput,
  UserStory,
  AcceptanceCriterion,
  TechnicalSpecification,
  ArchitectureDecision,
  APIContract,
  DataModel,
  DataModelField,
  DataModelRelationship,
  InfrastructureDesign,
  SecurityModel,
  Milestone,
  Roadmap,
  SkillDefinition,
  ArtifactContract,
  ValidationRule,
  SkillGraph,
  Artifact,
  ArtifactMetadata,
  SkillExecutionContext,
  SkillConfig,
  SkillResult,
  SkillError,
  SkillWarning,
  SkillMetrics,
  ReviewFinding,
  ReviewDimension,
  FindingLocation,
  ReviewResult,
  ReviewSummary,
  FixResult,
  ValidationStage,
  ValidationError,
  ValidationWarning,
  ValidationMetrics,
  ValidationResult,
  ValidationSummary,
  ApprovalDecision,
  ApprovalFeedback,
  OptimizationTarget,
  OptimizationResult,
  DeliveryPackage,
  PhaseStatus,
  PhaseName,
  PhaseState,
  OrchestratorState,
  OrchestratorConfig,
  OrchestratorEvent,
  OrchestratorEventType,
} from '../../src/types';

describe('Types', () => {
  describe('Phase 1: Understand Types', () => {
    it('should create valid BusinessGoal', () => {
      const goal: BusinessGoal = {
        metric: 'ARR',
        target: '$1M',
        timeline: '18 months',
      };
      expect(goal.metric).toBe('ARR');
      expect(goal.target).toBe('$1M');
      expect(goal.timeline).toBe('18 months');
    });

    it('should create valid FunctionalRequirement', () => {
      const req: FunctionalRequirement = {
        id: 'FR-001',
        description: 'User can login',
        priority: 'MUST',
        acceptanceCriteria: ['Given valid credentials, when user logs in, then access is granted'],
      };
      expect(req.priority).toBe('MUST');
      expect(req.acceptanceCriteria).toHaveLength(1);
    });

    it('should create valid NonFunctionalRequirement', () => {
      const req: NonFunctionalRequirement = {
        id: 'NFR-001',
        category: 'performance',
        requirement: 'API response time < 200ms',
        criteria: 'p99 latency < 200ms',
        measurable: true,
      };
      expect(req.category).toBe('performance');
      expect(req.measurable).toBe(true);
    });

    it('should create valid UnderstandOutput', () => {
      const output: UnderstandOutput = {
        vision: 'Test vision',
        targetAudience: ['developers'],
        businessGoals: [],
        functionalRequirements: [],
        nonFunctionalRequirements: [],
        constraints: [],
        risks: [],
        opportunities: [],
        successCriteria: [],
      };
      expect(output.vision).toBe('Test vision');
    });
  });

  describe('Phase 2: Plan Types', () => {
    it('should create valid UserStory', () => {
      const story: UserStory = {
        id: 'US-001',
        title: 'User Login',
        asA: 'user',
        iWantTo: 'login',
        soThat: 'access my account',
        acceptanceCriteria: [
          { id: 'AC-001', given: 'valid credentials', when: 'user logs in', then: 'access granted' },
        ],
        priority: 'P0',
      };
      expect(story.priority).toBe('P0');
      expect(story.acceptanceCriteria).toHaveLength(1);
    });

    it('should create valid TechnicalSpecification', () => {
      const spec: TechnicalSpecification = {
        architectureDecisions: [],
        apiContracts: [],
        dataModels: [],
        infrastructureDesign: {
          cloudProvider: 'AWS',
          regions: ['us-east-1'],
          compute: { type: 'KUBERNETES', specs: {} },
          storage: { databases: [], caches: [], objectStorage: [] },
          networking: { vpc: '', subnets: [], loadBalancers: [], cdn: false },
          observability: { metrics: [], logging: '', tracing: '', alerting: '' },
          estimatedMonthlyCost: 1000,
        },
        securityModel: {
          authentication: { providers: [], mfa: false, sessionManagement: '', tokenStrategy: 'JWT' },
          authorization: { model: 'RBAC', roles: [], permissions: [] },
          encryption: { atRest: '', inTransit: '', keyManagement: '' },
          compliance: [],
          threatModel: { assets: [], threats: [], mitigations: [] },
        },
      };
      expect(spec.infrastructureDesign.cloudProvider).toBe('AWS');
    });
  });

  describe('Phase 3: Discover Skills Types', () => {
    it('should create valid SkillDefinition', () => {
      const skill: SkillDefinition = {
        id: 'test-skill',
        name: 'Test Skill',
        version: '1.0.0',
        mission: 'Test mission',
        responsibilities: ['resp1'],
        knowledgeAreas: ['area1'],
        inputs: [{ artifactId: 'input', contract: 'json', required: true, description: 'Input' }],
        outputs: [{ artifactId: 'output', contract: 'markdown', required: true, description: 'Output' }],
        dependencies: [],
        bestPractices: ['practice1'],
        validationRules: [{ rule: 'rule1', severity: 'HIGH', autoFixable: false }],
        tools: ['tool1'],
        successMetrics: [{ metric: 'metric1', target: 'target1' }],
        templates: ['template1'],
      };
      expect(skill.id).toBe('test-skill');
      expect(skill.outputs).toHaveLength(1);
    });

    it('should create valid SkillGraph', () => {
      const graph: SkillGraph = {
        skills: [],
        dependencyGraph: new Map(),
        parallelGroups: [],
        executionOrder: [],
        estimatedDuration: '1h',
        requiredTemplates: [],
      };
      expect(graph.parallelGroups).toEqual([]);
    });
  });

  describe('Phase 4: Build Types', () => {
    it('should create valid Artifact', () => {
      const artifact: Artifact = {
        id: 'artifact-1',
        type: 'code',
        name: 'test.ts',
        content: 'console.log("test")',
        metadata: {
          format: 'typescript',
          size: 100,
          checksum: 'abc123',
          tags: ['test'],
          dependencies: [],
        },
        version: '1.0.0',
        createdBy: 'test-skill',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(artifact.metadata.format).toBe('typescript');
    });

    it('should create valid SkillExecutionContext', () => {
      const context: SkillExecutionContext = {
        skillId: 'test-skill',
        inputs: [],
        workspace: '/tmp/workspace',
        artifactStore: {} as any,
        config: {},
      };
      expect(context.skillId).toBe('test-skill');
    });
  });

  describe('Phase 5: Review Types', () => {
    it('should create valid ReviewFinding', () => {
      const finding: ReviewFinding = {
        id: 'finding-1',
        dimension: 'security',
        severity: 'HIGH',
        category: 'injection',
        title: 'SQL Injection Risk',
        description: 'User input not sanitized',
        location: { file: 'src/db.ts', line: 10 },
        impact: 'Data breach possible',
        fixSuggestion: 'Use parameterized queries',
        reference: 'OWASP A03',
        autoFixable: false,
        status: 'OPEN',
      };
      expect(finding.dimension).toBe('security');
      expect(finding.severity).toBe('HIGH');
    });

    it('should create valid ReviewResult', () => {
      const result: ReviewResult = {
        findings: [],
        summary: {
          total: 0,
          bySeverity: {},
          byDimension: {},
          autoFixable: 0,
          requiresHuman: 0,
        },
        passed: true,
      };
      expect(result.passed).toBe(true);
    });
  });

  describe('Phase 6: Fix Types', () => {
    it('should create valid FixResult', () => {
      const result: FixResult = {
        fixed: 5,
        failed: 1,
        escalated: 2,
        regressions: 0,
        findings: [],
      };
      expect(result.fixed).toBe(5);
    });
  });

  describe('Phase 7: Validate Types', () => {
    it('should create valid ValidationStage', () => {
      const stage: ValidationStage = {
        name: 'unit-tests',
        tool: 'Jest',
        passed: true,
        duration: 5000,
        output: 'All tests passed',
        errors: [],
        warnings: [],
        metrics: { coverage: 85 },
      };
      expect(stage.passed).toBe(true);
      expect(stage.metrics.coverage).toBe(85);
    });

    it('should create valid ValidationResult', () => {
      const result: ValidationResult = {
        stages: [],
        overallPassed: true,
        summary: {
          totalStages: 10,
          passedStages: 10,
          failedStages: 0,
          totalErrors: 0,
          totalWarnings: 5,
          duration: 120000,
        },
      };
      expect(result.overallPassed).toBe(true);
    });
  });

  describe('Phase 8: Human Approval Types', () => {
    it('should create valid ApprovalDecision', () => {
      const decision: ApprovalDecision = {
        decision: 'APPROVE',
        feedback: [
          { category: 'architecture', question: 'Is it maintainable?', response: 'Yes', actionRequired: false },
        ],
        reviewer: 'principal-engineer-simulator',
        timestamp: new Date(),
      };
      expect(decision.decision).toBe('APPROVE');
    });
  });

  describe('Phase 9: Optimize Types', () => {
    it('should create valid OptimizationTarget', () => {
      const target: OptimizationTarget = {
        name: 'API Latency',
        currentValue: 200,
        targetValue: 100,
        unit: 'ms',
        improvement: 50,
        techniques: ['caching', 'query optimization'],
      };
      expect(target.improvement).toBe(50);
    });
  });

  describe('Phase 10: Deliver Types', () => {
    it('should create valid DeliveryPackage', () => {
      const pkg: DeliveryPackage = {
        executiveSummary: 'Summary',
        productOverview: 'Overview',
        architecture: { decisions: [], diagrams: [], threatModel: '', dataFlow: '' },
        features: { userStories: '', acceptanceCriteria: '', featureFlags: '' },
        technicalDecisions: '',
        folderStructure: '',
        sourceCode: { structure: '', languages: [], frameworks: [], buildInstructions: '' },
        tests: { unit: '', integration: '', e2e: '', contract: '', performance: '', security: '' },
        documentation: { api: '', architecture: '', runbooks: '', onboarding: '', troubleshooting: '' },
        deploymentGuide: '',
        infrastructure: { terraform: '', helm: '', kubernetes: '' },
        ciCd: { pipelines: '', environments: '' },
        monitoring: { dashboards: '', alerts: '', slis: '' },
        futureImprovements: '',
        handoverNotes: '',
      };
      expect(pkg.executiveSummary).toBe('Summary');
    });
  });

  describe('Orchestrator Types', () => {
    it('should have valid PhaseStatus values', () => {
      const statuses: PhaseStatus[] = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'BLOCKED', 'SKIPPED'];
      expect(statuses).toHaveLength(6);
    });

    it('should have valid PhaseName values', () => {
      const phases: PhaseName[] = [
        'UNDERSTAND', 'PLAN', 'DISCOVER_SKILLS', 'BUILD',
        'REVIEW', 'FIX', 'VALIDATE', 'HUMAN_APPROVAL',
        'OPTIMIZE', 'DELIVER',
      ];
      expect(phases).toHaveLength(10);
    });

    it('should create valid OrchestratorState', () => {
      const state: OrchestratorState = {
        projectId: 'proj-1',
        idea: 'Test idea',
        currentPhase: 'UNDERSTAND',
        phases: [],
        artifacts: new Map(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
      expect(state.projectId).toBe('proj-1');
    });
  });

  describe('Event Types', () => {
    it('should have valid OrchestratorEventType values', () => {
      const types: OrchestratorEventType[] = [
        'PHASE_STARTED', 'PHASE_COMPLETED', 'PHASE_FAILED',
        'SKILL_STARTED', 'SKILL_COMPLETED', 'SKILL_FAILED',
        'ARTIFACT_CREATED', 'REVIEW_STARTED', 'REVIEW_COMPLETED',
        'VALIDATION_STARTED', 'VALIDATION_COMPLETED',
        'APPROVAL_REQUESTED', 'APPROVAL_RECEIVED',
        'OPTIMIZATION_STARTED', 'OPTIMIZATION_COMPLETED',
        'DELIVERY_COMPLETED', 'ERROR',
      ];
      expect(types).toHaveLength(17);
    });
  });
});