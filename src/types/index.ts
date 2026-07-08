/**
 * AI Skill Engineer - Core Type Definitions
 *
 * This file contains all the core types used throughout the framework.
 * Based on the SPEC.md specification.
 */

// ============================================================================
// Phase 1: Understand - Input/Output Types
// ============================================================================

export interface BusinessGoal {
  metric: string;
  target: string;
  timeline: string;
}

export interface FunctionalRequirement {
  id: string;
  description: string;
  priority: 'MUST' | 'SHOULD' | 'COULD' | 'WONT';
  acceptanceCriteria: string[];
}

export interface NonFunctionalRequirement {
  id: string;
  category: 'performance' | 'security' | 'scalability' | 'availability' | 'usability' | 'maintainability' | 'compliance' | 'data-sovereignty';
  requirement: string;
  criteria: string;
  measurable: boolean;
}

export interface Constraint {
  id: string;
  category: 'technical' | 'business' | 'regulatory' | 'resource';
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Risk {
  id: string;
  description: string;
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  mitigation: string;
}

export interface Opportunity {
  id: string;
  description: string;
  potentialImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SuccessCriterion {
  id: string;
  metric: string;
  target: string;
  measurementMethod: string;
}

export interface UnderstandOutput {
  vision: string;
  targetAudience: string[];
  businessGoals: BusinessGoal[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  constraints: Constraint[];
  risks: Risk[];
  opportunities: Opportunity[];
  successCriteria: SuccessCriterion[];
}

// ============================================================================
// Phase 2: Plan - Output Types
// ============================================================================

export interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWantTo: string;
  soThat: string;
  acceptanceCriteria: AcceptanceCriterion[];
  storyPoints?: number;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  dependsOn?: string[];
}

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
}

export interface TechnicalSpecification {
  architectureDecisions: ArchitectureDecision[];
  apiContracts: APIContract[];
  dataModels: DataModel[];
  infrastructureDesign: InfrastructureDesign;
  securityModel: SecurityModel;
}

export interface ArchitectureDecision {
  id: string;
  title: string;
  status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'SUPERSEDED';
  context: string;
  decision: string;
  consequences: string;
  alternatives: string[];
}

export interface APIContract {
  path: string;
  method: string;
  summary: string;
  requestSchema?: any;
  responseSchema?: any;
  authRequired: boolean;
  rateLimit?: string;
}

export interface DataModel {
  name: string;
  fields: DataModelField[];
  indexes: string[];
  relationships: DataModelRelationship[];
}

export interface DataModelField {
  name: string;
  type: string;
  nullable: boolean;
  unique: boolean;
  default?: string;
  description: string;
}

export interface DataModelRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  targetModel: string;
  foreignKey: string;
}

export interface InfrastructureDesign {
  cloudProvider: 'AWS' | 'GCP' | 'AZURE' | 'MULTI' | 'ON-PREM';
  regions: string[];
  compute: ComputeSpec;
  storage: StorageSpec;
  networking: NetworkingSpec;
  observability: ObservabilitySpec;
  estimatedMonthlyCost: number;
}

export interface ComputeSpec {
  type: 'KUBERNETES' | 'SERVERLESS' | 'VM' | 'CONTAINER';
  specs: Record<string, any>;
}

export interface StorageSpec {
  databases: DatabaseSpec[];
  caches: CacheSpec[];
  objectStorage: ObjectStorageSpec[];
}

export interface DatabaseSpec {
  engine: 'POSTGRESQL' | 'MYSQL' | 'MONGODB' | 'DYNAMODB' | 'REDIS';
  version: string;
  size: string;
  backup: string;
  replication: boolean;
}

export interface CacheSpec {
  engine: 'REDIS' | 'MEMCACHED';
  size: string;
  clusterMode: boolean;
}

export interface ObjectStorageSpec {
  provider: 'S3' | 'GCS' | 'AZURE_BLOB';
  bucketName: string;
  lifecycleRules: string[];
}

export interface NetworkingSpec {
  vpc: string;
  subnets: SubnetSpec[];
  loadBalancers: LoadBalancerSpec[];
  cdn: boolean;
}

export interface SubnetSpec {
  name: string;
  cidr: string;
  type: 'PUBLIC' | 'PRIVATE' | 'PROTECTED';
  az: string;
}

export interface LoadBalancerSpec {
  name: string;
  type: 'APPLICATION' | 'NETWORK';
  scheme: 'INTERNET_FACING' | 'INTERNAL';
  targets: string[];
}

export interface ObservabilitySpec {
  metrics: string[];
  logging: string;
  tracing: string;
  alerting: string;
}

export interface SecurityModel {
  authentication: AuthSpec;
  authorization: AuthzSpec;
  encryption: EncryptionSpec;
  compliance: string[];
  threatModel: ThreatModel;
}

export interface AuthSpec {
  providers: string[];
  mfa: boolean;
  sessionManagement: string;
  tokenStrategy: 'JWT' | 'OPAQUE' | 'SESSION';
}

export interface AuthzSpec {
  model: 'RBAC' | 'ABAC' | 'REBAC';
  roles: RoleSpec[];
  permissions: PermissionSpec[];
}

export interface RoleSpec {
  name: string;
  description: string;
  permissions: string[];
}

export interface PermissionSpec {
  resource: string;
  actions: string[];
  conditions?: string;
}

export interface EncryptionSpec {
  atRest: string;
  inTransit: string;
  keyManagement: string;
}

export interface ThreatModel {
  assets: string[];
  threats: ThreatSpec[];
  mitigations: string[];
}

export interface ThreatSpec {
  id: string;
  category: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  exitCriteria: string[];
  startDate: string;
  endDate: string;
  dependencies: string[];
  responsibleSkills: string[];
}

export interface Roadmap {
  phases: RoadmapPhase[];
  totalDuration: string;
  resourcePlan: ResourcePlan;
}

export interface RoadmapPhase {
  name: string;
  duration: string;
  milestones: string[];
  skills: string[];
  deliverables: string[];
}

export interface ResourcePlan {
  roles: ResourceRole[];
  budget: BudgetSpec;
}

export interface ResourceRole {
  role: string;
  count: number;
  duration: string;
  skills: string[];
}

export interface BudgetSpec {
  compute: number;
  storage: number;
  network: number;
  licenses: number;
  personnel: number;
  total: number;
  currency: string;
}

export interface PlanOutput {
  prd: string; // Markdown content
  userStories: UserStory[];
  acceptanceCriteria: AcceptanceCriterion[];
  technicalSpecification: TechnicalSpecification;
  milestones: Milestone[];
  roadmap: Roadmap;
}

// ============================================================================
// Phase 3: Discover Skills - Types
// ============================================================================

export interface SkillDefinition {
  id: string;
  name: string;
  version: string;
  mission: string;
  responsibilities: string[];
  knowledgeAreas: string[];
  inputs: ArtifactContract[];
  outputs: ArtifactContract[];
  dependencies: string[];
  bestPractices: string[];
  validationRules: ValidationRule[];
  tools: string[];
  successMetrics: SuccessMetric[];
  templates: string[];
}

export interface ArtifactContract {
  artifactId: string;
  contract: string; // Schema/format reference
  required: boolean;
  description: string;
}

export interface ValidationRule {
  rule: string;
  severity: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NIT';
  autoFixable: boolean;
  description?: string;
}

export interface SuccessMetric {
  metric: string;
  target: string;
}

export interface SkillGraph {
  skills: SkillDefinition[];
  dependencyGraph: Map<string, string[]>;
  parallelGroups: string[][];
  executionOrder: string[];
  estimatedDuration: string;
  requiredTemplates: string[];
}

// ============================================================================
// Phase 4: Build - Types
// ============================================================================

export interface Artifact {
  id: string;
  type: string;
  name: string;
  content: string | object;
  metadata: ArtifactMetadata;
  version: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtifactMetadata {
  schema?: string;
  format: string;
  size: number;
  checksum: string;
  tags: string[];
  dependencies: string[];
}

export interface SkillExecutionContext {
  skillId: string;
  inputs: Artifact[];
  workspace: string;
  artifactStore: ArtifactStore;
  config: SkillConfig;
}

export interface SkillConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  retryAttempts?: number;
}

export interface SkillResult {
  success: boolean;
  output?: SkillOutput;
  error?: string;
  errors?: SkillError[];
  warnings?: SkillWarning[];
  metrics?: SkillMetrics;
  duration: number;
  artifacts?: any[];
  skillOutputs?: Record<string, any>;
}

export interface SkillError {
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
  recoverable: boolean;
  context?: any;
}

export interface SkillWarning {
  code: string;
  message: string;
  suggestion?: string;
}

export interface SkillMetrics {
  tokensUsed: number;
  apiCalls: number;
  duration: number;
  outputSize: number;
}

// ============================================================================
// Phase 5: Review - Types
// ============================================================================

export interface ReviewFinding {
  id: string;
  dimension: ReviewDimension;
  severity: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NIT';
  category: string;
  title: string;
  description: string;
  location: FindingLocation;
  impact: string;
  fixSuggestion: string;
  reference: string;
  autoFixable: boolean;
  status: 'OPEN' | 'FIXED' | 'ESCALATED' | 'WONT_FIX';
}

export type ReviewDimension =
  | 'correctness'
  | 'architecture'
  | 'security'
  | 'performance'
  | 'scalability'
  | 'maintainability'
  | 'accessibility'
  | 'reliability';

export interface FindingLocation {
  file: string;
  line?: number;
  column?: number;
  function?: string;
  artifactId?: string;
}

export interface ReviewResult {
  findings: ReviewFinding[];
  summary: ReviewSummary;
  passed: boolean;
}

export interface ReviewSummary {
  total: number;
  bySeverity: Record<string, number>;
  byDimension: Record<string, number>;
  autoFixable: number;
  requiresHuman: number;
}

// ============================================================================
// Phase 6: Fix - Types
// ============================================================================

export interface FixResult {
  fixed: number;
  failed: number;
  escalated: number;
  regressions: number;
  findings: ReviewFinding[];
}

// ============================================================================
// Phase 7: Validate - Types
// ============================================================================

export interface ValidationStage {
  name: string;
  tool: string;
  passed: boolean;
  duration: number;
  output: string;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metrics: ValidationMetrics;
  severity?: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ValidationError {
  file: string;
  line: number;
  column: number;
  message: string;
  rule: string;
  severity: 'ERROR' | 'WARNING';
}

export interface ValidationWarning {
  file: string;
  line: number;
  column: number;
  message: string;
  rule: string;
}

export interface ValidationMetrics {
  coverage?: number;
  complexity?: number;
  duplication?: number;
  maintainabilityIndex?: number;
  vulnerabilities?: number;
}

export interface ValidationResult {
  stages: ValidationStage[];
  overallPassed: boolean;
  summary: ValidationSummary;
}

export interface ValidationSummary {
  totalStages: number;
  passedStages: number;
  failedStages: number;
  totalErrors: number;
  totalWarnings: number;
  duration: number;
}

// ============================================================================
// Phase 8: Human Approval - Types
// ============================================================================

export interface ApprovalDecision {
  decision: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';
  feedback: ApprovalFeedback[];
  reviewer: string;
  timestamp: Date;
}

export interface ApprovalFeedback {
  category: 'architecture' | 'code-quality' | 'security' | 'operations' | 'user-experience' | 'team';
  question: string;
  response: string;
  actionRequired: boolean;
}

// ============================================================================
// Phase 9: Optimize - Types
// ============================================================================

export interface OptimizationTarget {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  improvement: number;
  techniques: string[];
}

export interface OptimizationResult {
  targets: OptimizationTarget[];
  iterations: number;
  stoppedReason: string;
  totalImprovement: number;
}

// ============================================================================
// Phase 10: Deliver - Types
// ============================================================================

export interface DeliveryPackage {
  executiveSummary: string;
  productOverview: string;
  architecture: ArchitectureDelivery;
  features: FeaturesDelivery;
  technicalDecisions: string;
  folderStructure: string;
  sourceCode: SourceCodeDelivery;
  tests: TestsDelivery;
  documentation: DocumentationDelivery;
  deploymentGuide: string;
  infrastructure: InfrastructureDelivery;
  ciCd: CICDDelivery;
  monitoring: MonitoringDelivery;
  futureImprovements: string;
  handoverNotes: string;
}

export interface ArchitectureDelivery {
  decisions: string[];
  diagrams: string[];
  threatModel: string;
  dataFlow: string;
}

export interface FeaturesDelivery {
  userStories: string;
  acceptanceCriteria: string;
  featureFlags: string;
}

export interface SourceCodeDelivery {
  structure: string;
  languages: string[];
  frameworks: string[];
  buildInstructions: string;
}

export interface TestsDelivery {
  unit: string;
  integration: string;
  e2e: string;
  contract: string;
  performance: string;
  security: string;
}

export interface DocumentationDelivery {
  api: string;
  architecture: string;
  runbooks: string;
  onboarding: string;
  troubleshooting: string;
}

export interface InfrastructureDelivery {
  terraform: string;
  helm: string;
  kubernetes: string;
}

export interface CICDDelivery {
  pipelines: string;
  environments: string;
}

export interface MonitoringDelivery {
  dashboards: string;
  alerts: string;
  slis: string;
}

// ============================================================================
// Orchestrator Types
// ============================================================================

export type PhaseStatus = 'pending' | 'running' | 'completed' | 'failed' | 'blocked' | 'skipped';

export type PhaseName =
  | 'understand'
  | 'plan'
  | 'discover-skills'
  | 'build'
  | 'review'
  | 'fix'
  | 'validate'
  | 'human-approval'
  | 'optimize'
  | 'deliver';

export interface PhaseResult<T = any> {
  success: boolean;
  output?: T;
  error?: string;
}

export interface OrchestratorEvents {
  'phase-start': { phase: string; projectId: string };
  'phase-complete': { phase: string; result: any; projectId: string };
  'phase-failed': { phase: string; error: string; projectId: string };
  'skill-start': { skill: string; projectId: string };
  'skill-complete': { skill: string; result: any; projectId: string };
  'skill-failed': { skill: string; error: string; projectId: string };
  'artifact-created': { artifact: string; projectId: string };
  'review-started': { projectId: string };
  'review-completed': { findings: any; projectId: string };
  'validation-started': { projectId: string };
  'validation-completed': { result: any; projectId: string };
  'approval-requested': { projectId: string };
  'approval-received': { decision: string; projectId: string };
  'optimization-started': { projectId: string };
  'optimization-completed': { improvement: number; projectId: string };
  'delivery-completed': { path: string; projectId: string };
  'error': { error: string; projectId: string };
  'initialized': { projectId: string };
  'resumed': { projectId: string };
  'paused': { projectId: string };
  'stopped': { projectId: string };
}

export interface PhaseConfig {
  name: string;
  displayName: string;
  description: string;
  estimatedDuration: number;
  requiredSkills: string[];
  optionalSkills: string[];
  inputs: string[];
  outputs: string[];
}

export type OrchestratorEventType =
  | 'PHASE_STARTED'
  | 'PHASE_COMPLETED'
  | 'PHASE_FAILED'
  | 'SKILL_STARTED'
  | 'SKILL_COMPLETED'
  | 'SKILL_FAILED'
  | 'ARTIFACT_CREATED'
  | 'REVIEW_STARTED'
  | 'REVIEW_COMPLETED'
  | 'VALIDATION_STARTED'
  | 'VALIDATION_COMPLETED'
  | 'APPROVAL_REQUESTED'
  | 'APPROVAL_RECEIVED'
  | 'OPTIMIZATION_STARTED'
  | 'OPTIMIZATION_COMPLETED'
  | 'DELIVERY_COMPLETED'
  | 'ERROR';

export interface OrchestratorEvent {
  type: OrchestratorEventType;
  projectId: string;
  phase?: PhaseName;
  timestamp: Date;
  data: any;
}

export interface PhaseState {
  name: PhaseName;
  status: PhaseStatus;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  retryCount: number;
}

// ============================================================================
// Orchestrator Phase Output Types
// ============================================================================

export interface UnderstandOutput {
  vision: string;
  targetAudience: string[];
  businessGoals: BusinessGoal[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  constraints: Constraint[];
  risks: Risk[];
  opportunities: Opportunity[];
  successCriteria: SuccessCriterion[];
}

export interface PlanOutput {
  prd: string;
  userStories: UserStory[];
  acceptanceCriteria: AcceptanceCriterion[];
  technicalSpecification: TechnicalSpecification;
  milestones: Milestone[];
  roadmap: Roadmap;
}

export interface BuildOutput {
  artifacts: Artifact[];
  skillOutputs: Record<string, any>;
}

export interface ReviewOutput {
  findings: ReviewFinding[];
  summary: ReviewSummary;
  passed: boolean;
}

export interface FixOutput {
  fixed: number;
  failed: number;
  escalated: number;
  regressions: number;
  findings: ReviewFinding[];
  fixedArtifacts: Artifact[];
}

export interface ValidateOutput {
  stages: ValidationStage[];
  overallPassed: boolean;
  summary: ValidationSummary;
}

export interface ApprovalOutput {
  approved: boolean;
  feedback: ApprovalFeedback[];
  reviewer: string;
  timestamp: Date;
}

export interface OptimizeOutput {
  iterations: any[];
  finalArtifacts: Artifact[];
  totalImprovement: number;
}

export interface DeliverOutput {
  packageContents: string[];
  packageSize: number;
  deliveryPath: string;
}

export interface OrchestratorState {
  projectId: string;
  name: string;
  description: string;
  idea: string;
  currentPhase: PhaseName;
  phases: PhaseState[];
  artifacts: Map<string, Artifact>;
  skillGraph?: SkillGraph;
  understandOutput?: UnderstandOutput;
  planOutput?: PlanOutput;
  buildOutput?: BuildOutput;
  reviewOutput?: ReviewOutput;
  fixOutput?: FixOutput;
  validateOutput?: ValidateOutput;
  approvalOutput?: ApprovalOutput;
  optimizeOutput?: OptimizeOutput;
  deliverOutput?: DeliverOutput;
  reviewFindings: ReviewFinding[];
  validationResults: ValidationResult[];
  approvalDecision?: ApprovalDecision;
  optimizationResults?: OptimizationResult;
  deliveryPackage?: DeliveryPackage;
  createdAt: Date;
  updatedAt: Date;
  config: OrchestratorConfig;
}

export interface OrchestratorConfig {
  maxRetries: number;
  phaseTimeout: number;
  parallelExecution: boolean;
  autoFix: boolean;
  humanApprovalRequired: boolean;
  optimizationEnabled: boolean;
  outputDirectory: string;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
}

// ============================================================================
// Storage Types
// ============================================================================

export interface ArtifactStore {
  save(artifact: Artifact): Promise<void>;
  get(id: string): Promise<Artifact | null>;
  list(prefix?: string): Promise<Artifact[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  getByProject(projectId: string): Promise<Artifact[]>;
}

export interface StateStore {
  save(state: OrchestratorState): Promise<void>;
  get(projectId: string): Promise<OrchestratorState | null>;
  list(): Promise<OrchestratorState[]>;
  delete(projectId: string): Promise<void>;
  getLatest(): Promise<OrchestratorState | null>;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// Skill Types (used by skills/registry and execution/engine)
// ============================================================================

export interface SkillInput {
  artifacts: Map<string, any>;
  config: SkillConfig;
  context: ExecutionContext;
}

export interface SkillOutput {
  artifacts: any[];
  metadata: Record<string, any>;
}

export interface SkillResult {
  success: boolean;
  output?: SkillOutput;
  error?: string;
  artifacts?: any[];
  skillOutputs?: Record<string, any>;
  duration: number;
}

export interface SkillExecutor {
  execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult>;
}

export interface Skill {
  definition: SkillDefinition;
  executor: SkillExecutor;
  config: SkillConfig;
  validate(inputs: SkillInput): Promise<SkillValidationResult>;
  execute(inputs: SkillInput, context: ExecutionContext): Promise<SkillResult>;
}

export interface SkillValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ExecutionContext {
  projectId: string;
  phase: string;
  config: any;
  artifacts: Map<string, any>;
  skillGraph?: any;
  previousOutputs: Record<string, any>;
  workspace: string;
}

// ============================================================================
// Orchestrator Phase Output Types
// ============================================================================

export interface IdeaInput {
  idea: string;
}

export interface UnderstandOutput {
  vision: string;
  targetAudience: string[];
  businessGoals: BusinessGoal[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  constraints: Constraint[];
  risks: Risk[];
  opportunities: Opportunity[];
  successCriteria: SuccessCriterion[];
}

export interface PlanOutput {
  prd: string;
  userStories: UserStory[];
  acceptanceCriteria: AcceptanceCriterion[];
  technicalSpecification: TechnicalSpecification;
  milestones: Milestone[];
  roadmap: Roadmap;
}

export interface BuildOutput {
  artifacts: Artifact[];
  skillOutputs: Record<string, any>;
}

export interface ReviewOutput {
  findings: ReviewFinding[];
  summary: ReviewSummary;
  passed: boolean;
}

export interface FixOutput {
  fixed: number;
  failed: number;
  escalated: number;
  regressions: number;
  findings: ReviewFinding[];
  fixedArtifacts: Artifact[];
}

export interface ValidateOutput {
  stages: ValidationStage[];
  overallPassed: boolean;
  summary: ValidationSummary;
}

export interface ApprovalOutput {
  approved: boolean;
  feedback: ApprovalFeedback[];
  reviewer: string;
  timestamp: Date;
}

export interface OptimizeOutput {
  iterations: any[];
  finalArtifacts: Artifact[];
  totalImprovement: number;
}

export interface DeliverOutput {
  packageContents: string[];
  packageSize: number;
  deliveryPath: string;
}

// ============================================================================
// Project Config
// ============================================================================

export interface ProjectConfig {
  projectId?: string;
  name?: string;
  description?: string;
  idea?: string;
  maxParallelSkills?: number;
  validationLevel?: 'strict' | 'standard' | 'minimal';
  autoFix?: boolean;
  humanApprovalRequired?: boolean;
  optimizationIterations?: number;
  outputPath?: string;
}

// ============================================================================
// Validation Config
// ============================================================================

export interface ValidationConfig {
  maxConcurrency?: number;
  failFast?: boolean;
  coverageThreshold?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================================
// Configuration Schema (Zod)
// ============================================================================

import { z } from 'zod';

export const OrchestratorConfigSchema = z.object({
  maxRetries: z.number().min(0).max(10).default(3),
  phaseTimeout: z.number().min(60000).default(300000),
  parallelExecution: z.boolean().default(true),
  autoFix: z.boolean().default(true),
  humanApprovalRequired: z.boolean().default(false),
  optimizationEnabled: z.boolean().default(true),
  outputDirectory: z.string().default('./output'),
  logLevel: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),
});

export type OrchestratorConfigInput = z.infer<typeof OrchestratorConfigSchema>;