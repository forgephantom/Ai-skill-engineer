import { SkillExecutor, SkillInput, ExecutionContext, SkillResult, SkillGraph, SkillDefinition } from '../../../types';

export function createExecutor(): SkillExecutor {
  return {
    execute: async (inputs: SkillInput, context: ExecutionContext): Promise<SkillResult> => {
      const allDefinitions: SkillDefinition[] = [];
      if (inputs.artifacts) {
        for (const artifact of inputs.artifacts.values()) {
          if (artifact && typeof artifact === 'object' && 'id' in artifact) {
            allDefinitions.push(artifact as unknown as SkillDefinition);
          }
        }
      }

      const skillGraph: SkillGraph = {
        skills: allDefinitions,
        dependencyGraph: new Map<string, string[]>(),
        parallelGroups: [],
        executionOrder: allDefinitions.map(d => d.id),
        estimatedDuration: `${allDefinitions.length * 5}m`,
        requiredTemplates: [],
      };

      return {
        success: true,
        output: {
          artifacts: [],
          metadata: {},
          ...skillGraph,
        },
        duration: 5,
      };
    },
  };
}
