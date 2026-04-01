import type { AgentMemory, Exercise, AgentInsight } from "@/types";
import { EXERCISES } from "@/data/exercises";
import { getExerciseParams } from "./plasticity";
import { analyzeNetwork, type NetworkAnalysis } from "./hebbian";

export type AgentRecommendation = {
  exercises: Exercise[];
  insights: AgentInsight[];
  networkAnalysis: NetworkAnalysis | null;
};

/**
 * The ReWire agent brain. Uses graph-theoretic analysis of the neural
 * network to identify bottleneck nodes and weakest pathways, then
 * selects exercises that target network-critical connections.
 */
export function getRecommendations(memory: AgentMemory): AgentRecommendation {
  const insights: AgentInsight[] = [];
  const now = new Date();

  // Run network resilience analysis on the brain graph
  const networkAnalysis = analyzeNetwork(
    memory.graphState.nodes,
    memory.graphState.edges
  );

  // Build priority map from network analysis
  // Bottleneck nodes and nodes on weakest paths get highest priority
  const nodePriority = new Map<string, number>();
  for (const node of memory.graphState.nodes) {
    nodePriority.set(node.id, 0.3); // baseline
  }

  // Bottleneck nodes are critical — losing them fragments the network
  for (const bottleneck of networkAnalysis.bottlenecks) {
    nodePriority.set(bottleneck, Math.max(nodePriority.get(bottleneck) ?? 0, 0.9));
  }

  // Nodes on weakest paths need strengthening
  for (const path of networkAnalysis.weakestPaths) {
    nodePriority.set(path.from, Math.max(nodePriority.get(path.from) ?? 0, 0.8));
    nodePriority.set(path.to, Math.max(nodePriority.get(path.to) ?? 0, 0.8));
  }

  // Nodes with low strength need activation
  for (const node of memory.graphState.nodes) {
    if (node.strength < 0.3) {
      nodePriority.set(node.id, Math.max(nodePriority.get(node.id) ?? 0, 0.7));
    }
  }

  // Score each exercise using graph analysis
  const scored = EXERCISES.map((exercise) => {
    const params = getExerciseParams(memory, exercise.id, exercise.baseDifficulty);
    let score = 0;

    // Graph-driven priority: target region priority from network analysis
    const regionPriority = nodePriority.get(exercise.targetRegion) ?? 0.3;
    score += regionPriority * 50;

    // Spaced repetition timing
    if (params.lastPerformed) {
      const hoursSince =
        (now.getTime() - new Date(params.lastPerformed).getTime()) / 3600000;
      if (hoursSince >= params.spacingIntervalHours) {
        score += 25;
      } else {
        score -= 15;
      }
    } else {
      score += 15;
    }

    // Category variety
    const recentLogs = memory.exerciseLogs.slice(-5);
    const recentCategories = new Set(
      recentLogs.map((l) => {
        const ex = EXERCISES.find((e) => e.id === l.exerciseId);
        return ex?.category;
      })
    );
    if (!recentCategories.has(exercise.category)) {
      score += 10;
    }

    // Bonus: exercise targets a node in a disconnected cluster
    if (networkAnalysis.clusters.length > 1) {
      const smallClusters = networkAnalysis.clusters.filter(
        (c) => c.length < memory.graphState.nodes.length / 2
      );
      for (const cluster of smallClusters) {
        if (cluster.includes(exercise.targetRegion)) {
          score += 20; // Help reconnect isolated regions
        }
      }
    }

    return { exercise, score, params };
  });

  scored.sort((a, b) => b.score - a.score);
  const recommended = scored.slice(0, 4).map((s) => s.exercise);

  // Generate insights from network analysis
  const totalAssessments = memory.assessments.length;
  const totalExercises = memory.exerciseLogs.length;

  if (totalAssessments === 0) {
    insights.push({
      id: "first-assessment",
      text: "Start with an assessment to establish your baseline. This activates nodes in your brain map and begins Hebbian learning.",
      type: "recommendation",
      timestamp: now.toISOString(),
    });
  }

  if (totalAssessments > 0 && totalExercises === 0) {
    insights.push({
      id: "start-exercises",
      text: "Baseline captured. Start exercises to strengthen weak neural pathways identified by the network analysis.",
      type: "recommendation",
      timestamp: now.toISOString(),
    });
  }

  // Network resilience insight
  if (totalAssessments > 0) {
    const resiliencePercent = Math.round(networkAnalysis.resilience * 100);
    if (resiliencePercent < 50) {
      insights.push({
        id: "low-resilience",
        text: `Network resilience is ${resiliencePercent}%. Several pathways are weak or disconnected. Focus on exercises targeting ${networkAnalysis.bottlenecks[0] ?? "motor cortex"} to rebuild critical connections.`,
        type: "warning",
        timestamp: now.toISOString(),
      });
    } else if (resiliencePercent > 70) {
      insights.push({
        id: "good-resilience",
        text: `Network resilience is ${resiliencePercent}%. Neural pathways are strengthening with redundant connections forming. Continue current intensity.`,
        type: "encouragement",
        timestamp: now.toISOString(),
      });
    }
  }

  // Disconnected cluster warning
  if (networkAnalysis.clusters.length > 1) {
    insights.push({
      id: "disconnected",
      text: `${networkAnalysis.clusters.length} disconnected regions detected in your brain map. Exercises targeting bridge nodes have been prioritized to restore connectivity.`,
      type: "warning",
      timestamp: now.toISOString(),
    });
  }

  // Streak
  const streak = getConsecutiveDays(memory);
  if (streak >= 3) {
    insights.push({
      id: "streak",
      text: `${streak}-day streak. Consistent practice drives Long-Term Potentiation — your weight floors are rising, making recovery gains more durable.`,
      type: "encouragement",
      timestamp: now.toISOString(),
    });
  }

  // Progress detection
  if (totalAssessments >= 4) {
    const recent = memory.assessments.slice(-3);
    const older = memory.assessments.slice(-6, -3);
    if (older.length > 0) {
      const recentAvg = recent.reduce((s, a) => s + a.value, 0) / recent.length;
      const olderAvg = older.reduce((s, a) => s + a.value, 0) / older.length;
      if (recentAvg > olderAvg + 5) {
        insights.push({
          id: "improving",
          text: `Scores up ${Math.round(recentAvg - olderAvg)}% from last cycle. Hebbian weight updates confirm: neurons that fire together are wiring together.`,
          type: "milestone",
          timestamp: now.toISOString(),
        });
      }
    }
  }

  // Pain warning
  const recentPain = memory.assessments.filter((a) => a.type === "pain").slice(-3);
  if (recentPain.length > 0) {
    const avgPain = recentPain.reduce((s, a) => s + (a.raw.painLevel ?? 0), 0) / recentPain.length;
    if (avgPain >= 7) {
      insights.push({
        id: "pain-warning",
        text: "High pain detected. Exercise intensity reduced via LTD (Long-Term Depression) to prevent maladaptive plasticity. Consult your therapist.",
        type: "warning",
        timestamp: now.toISOString(),
      });
    }
  }

  return { exercises: recommended, insights, networkAnalysis };
}

function getConsecutiveDays(memory: AgentMemory): number {
  const dates = new Set(
    [...memory.assessments, ...memory.exerciseLogs].map((item) =>
      new Date("timestamp" in item ? item.timestamp : "").toDateString()
    )
  );

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (dates.has(date.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function getRecoveryScore(memory: AgentMemory): number {
  if (memory.assessments.length === 0) return 0;
  const recent = memory.assessments.slice(-10);
  return Math.round(recent.reduce((sum, a) => sum + a.value, 0) / recent.length);
}
