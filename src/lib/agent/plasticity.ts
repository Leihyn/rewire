import type { AgentMemory, ExerciseParams } from "@/types";
import { ASSESSMENT_NODE_MAP } from "@/data/brain-regions";

/**
 * Neuroplasticity-based difficulty adjustment.
 *
 * Use-dependent plasticity: exercises targeting weak areas get priority.
 * Progressive overload: difficulty increases when success rate > 80%.
 * Spaced repetition: intervals grow with consistent success (SM-2 inspired).
 */

export function getExerciseParams(
  memory: AgentMemory,
  exerciseId: string,
  baseDifficulty: number
): ExerciseParams {
  return (
    memory.exerciseParams[exerciseId] ?? {
      currentDifficulty: baseDifficulty,
      lastPerformed: null,
      streakDays: 0,
      spacingIntervalHours: 4,
      successRate: 0.5,
    }
  );
}

export function adjustDifficulty(params: ExerciseParams, perceivedEffort: number, painDuring: number): ExerciseParams {
  const updated = { ...params };

  // Pain-based safety: reduce difficulty if pain is high
  if (painDuring >= 7) {
    updated.currentDifficulty = Math.max(1, updated.currentDifficulty - 2);
    updated.spacingIntervalHours = Math.min(48, updated.spacingIntervalHours * 1.5);
    return updated;
  }

  // Success rate rolling update
  const effortScore = perceivedEffort <= 3 ? 1 : perceivedEffort <= 4 ? 0.5 : 0;
  updated.successRate = updated.successRate * 0.7 + effortScore * 0.3;

  // Progressive overload
  if (updated.successRate > 0.8) {
    updated.currentDifficulty = Math.min(10, updated.currentDifficulty + 1);
    updated.streakDays += 1;
  } else if (updated.successRate < 0.4) {
    updated.currentDifficulty = Math.max(1, updated.currentDifficulty - 1);
    updated.streakDays = 0;
  }

  // Spaced repetition: longer intervals with consistent success
  if (updated.streakDays >= 5) {
    updated.spacingIntervalHours = Math.min(72, updated.spacingIntervalHours * 1.3);
  } else if (updated.streakDays <= 1) {
    updated.spacingIntervalHours = Math.max(4, updated.spacingIntervalHours * 0.8);
  }

  updated.lastPerformed = new Date().toISOString();

  return updated;
}

/**
 * Calculate which brain regions need the most work based on assessments.
 * Returns a map of nodeId -> priority (0-1, higher = needs more work)
 */
export function calculateRegionPriorities(memory: AgentMemory): Record<string, number> {
  const priorities: Record<string, number> = {};

  // Default all to medium priority
  for (const node of memory.graphState.nodes) {
    priorities[node.id] = 0.5;
  }

  // Weight by inverse of recent assessment scores
  const recentAssessments = memory.assessments.slice(-20);
  
  for (const assessment of recentAssessments) {
    const affectedNodes: string[] = ASSESSMENT_NODE_MAP[assessment.type] ?? [];
    for (const nodeId of affectedNodes) {
      // Lower assessment score = higher priority (needs more work)
      const priority = 1 - assessment.value / 100;
      priorities[nodeId] = Math.max(priorities[nodeId] ?? 0, priority);
    }
  }

  return priorities;
}

/**
 * Update graph node strengths based on assessment data.
 * This is the visual representation of neuroplasticity.
 */
export function updateGraphFromAssessments(memory: AgentMemory): AgentMemory {
    const nodes = memory.graphState.nodes.map((n) => ({ ...n }));
  const edges = memory.graphState.edges.map((e) => ({ ...e }));

  // Group recent assessments by type, take average of last 3
  const byType = new Map<string, number[]>();
  for (const a of memory.assessments.slice(-30)) {
    const existing = byType.get(a.type) ?? [];
    existing.push(a.value);
    byType.set(a.type, existing);
  }

  for (const [type, values] of byType) {
    const recent = values.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const strength = avg / 100;

    const affectedNodes: string[] = ASSESSMENT_NODE_MAP[type] ?? [];
    for (const nodeId of affectedNodes) {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        // Blend: 60% new data, 40% existing (gradual change = neuroplasticity)
        node.strength = node.strength * 0.4 + strength * 0.6;
      }
    }
  }

  // Update edge weights based on connected node strengths
  for (const edge of edges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (sourceNode && targetNode) {
      edge.weight = (sourceNode.strength + targetNode.strength) / 2;
    }
  }

  return {
    ...memory,
    graphState: { nodes, edges },
  };
}
