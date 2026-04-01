/**
 * Computational Hebbian Neuroplasticity Model
 *
 * Implements real neuroscience principles as computable algorithms:
 *
 * 1. Hebbian Learning: "Neurons that fire together wire together"
 *    - When two connected nodes are both activated (via assessments/exercises),
 *      the edge weight increases.
 *    - ΔW = η * pre * post (learning rate × pre-synaptic × post-synaptic activation)
 *
 * 2. Synaptic Pruning: connections that aren't used weaken over time.
 *    - W(t) = W(t-1) * decay_factor
 *    - Pruning threshold: edges below 0.05 are functionally disconnected.
 *
 * 3. Long-Term Potentiation (LTP): repeated co-activation above threshold
 *    converts temporary strengthening into durable change.
 *    - After N consecutive successful activations, the weight floor is raised.
 *
 * 4. Long-Term Depression (LTD): repeated failure weakens connections faster.
 *
 * 5. Homeostatic Plasticity: prevents runaway excitation by normalizing
 *    total synaptic weight per node (Turrigiano, 2008).
 *
 * 6. Network Resilience: graph-theoretic analysis of recovery potential.
 */

import type { AgentMemory, BrainNode, BrainEdge, AssessmentRecord } from "@/types";
import { ASSESSMENT_NODE_MAP } from "@/data/brain-regions";

// Model parameters (tuned for rehabilitation timescales)
const LEARNING_RATE = 0.15;        // η — how fast connections strengthen
const DECAY_RATE = 0.995;          // per-hour decay for unused connections
const LTP_THRESHOLD = 3;           // consecutive successes needed for LTP
const LTD_MULTIPLIER = 1.5;        // failure weakens faster than success strengthens
const PRUNING_THRESHOLD = 0.05;    // edges below this are "disconnected"
const HOMEOSTATIC_TARGET = 3.0;    // target sum of incoming weights per node
const MIN_WEIGHT = 0.01;
const MAX_WEIGHT = 1.0;
const LTP_FLOOR_INCREMENT = 0.05;  // minimum weight after LTP consolidation

type ActivationEvent = {
  nodeId: string;
  activation: number; // 0-1
  timestamp: string;
  source: "assessment" | "exercise";
};

type HebbianState = {
  activationHistory: ActivationEvent[];
  ltpCounters: Record<string, number>; // edge key -> consecutive co-activations
  weightFloors: Record<string, number>; // edge key -> minimum weight from LTP
  lastDecayTimestamp: string;
};

function edgeKey(source: string, target: string): string {
  return `${source}→${target}`;
}

/**
 * Initialize Hebbian state from existing memory.
 */
export function initHebbianState(memory: AgentMemory): HebbianState {
  const existing = (memory as unknown as { hebbianState?: HebbianState }).hebbianState;
  if (existing) return existing;

  return {
    activationHistory: [],
    ltpCounters: {},
    weightFloors: {},
    lastDecayTimestamp: new Date().toISOString(),
  };
}

/**
 * Core Hebbian update: process a new activation event.
 * Returns updated graph state and Hebbian state.
 */
export function hebbianUpdate(
  nodes: BrainNode[],
  edges: BrainEdge[],
  state: HebbianState,
  activatedNodeIds: string[],
  activationStrength: number, // 0-1, from assessment/exercise score
  source: "assessment" | "exercise"
): { nodes: BrainNode[]; edges: BrainEdge[]; state: HebbianState } {
  const updatedNodes = nodes.map((n) => ({ ...n }));
  const updatedEdges = edges.map((e) => ({ ...e }));
  const updatedState = {
    ...state,
    activationHistory: [...state.activationHistory],
    ltpCounters: { ...state.ltpCounters },
    weightFloors: { ...state.weightFloors },
  };

  const now = new Date().toISOString();

  // Record activations
  for (const nodeId of activatedNodeIds) {
    updatedState.activationHistory.push({
      nodeId,
      activation: activationStrength,
      timestamp: now,
      source,
    });

    // Update node strength
    const node = updatedNodes.find((n) => n.id === nodeId);
    if (node) {
      // Exponential moving average with new activation
      node.strength = node.strength * 0.6 + activationStrength * 0.4;
    }
  }

  // Hebbian learning: strengthen edges between co-activated nodes
  for (const edge of updatedEdges) {
    const sourceActivated = activatedNodeIds.includes(edge.source);
    const targetActivated = activatedNodeIds.includes(edge.target);

    if (sourceActivated && targetActivated) {
      // Hebb's rule: ΔW = η * pre * post
      const preNode = updatedNodes.find((n) => n.id === edge.source);
      const postNode = updatedNodes.find((n) => n.id === edge.target);
      if (!preNode || !postNode) continue;

      const deltaW = LEARNING_RATE * preNode.strength * postNode.strength;

      if (activationStrength > 0.5) {
        // Positive activation — strengthen
        edge.weight = Math.min(MAX_WEIGHT, edge.weight + deltaW);

        // LTP tracking
        const key = edgeKey(edge.source, edge.target);
        updatedState.ltpCounters[key] = (updatedState.ltpCounters[key] ?? 0) + 1;

        // LTP consolidation
        if (updatedState.ltpCounters[key] >= LTP_THRESHOLD) {
          updatedState.weightFloors[key] =
            Math.min(0.5, (updatedState.weightFloors[key] ?? 0) + LTP_FLOOR_INCREMENT);
          // Ensure weight doesn't drop below floor
          edge.weight = Math.max(edge.weight, updatedState.weightFloors[key]);
        }
      } else {
        // LTD: failure weakens connection
        edge.weight = Math.max(
          MIN_WEIGHT,
          edge.weight - deltaW * LTD_MULTIPLIER
        );
        // Reset LTP counter
        const key = edgeKey(edge.source, edge.target);
        updatedState.ltpCounters[key] = 0;
      }
    }
  }

  // Homeostatic plasticity: normalize incoming weights per node
  for (const node of updatedNodes) {
    const incoming = updatedEdges.filter((e) => e.target === node.id);
    const totalWeight = incoming.reduce((s, e) => s + e.weight, 0);

    if (totalWeight > HOMEOSTATIC_TARGET && incoming.length > 0) {
      const scale = HOMEOSTATIC_TARGET / totalWeight;
      for (const edge of incoming) {
        const floor = updatedState.weightFloors[edgeKey(edge.source, edge.target)] ?? MIN_WEIGHT;
        edge.weight = Math.max(floor, edge.weight * scale);
      }
    }
  }

  // Keep history manageable
  if (updatedState.activationHistory.length > 200) {
    updatedState.activationHistory = updatedState.activationHistory.slice(-100);
  }

  return { nodes: updatedNodes, edges: updatedEdges, state: updatedState };
}

/**
 * Synaptic decay: weaken unused connections over time.
 * Call periodically (e.g., on app load or every hour).
 */
export function applyDecay(
  edges: BrainEdge[],
  state: HebbianState
): { edges: BrainEdge[]; state: HebbianState } {
  const now = new Date();
  const lastDecay = new Date(state.lastDecayTimestamp);
  const hoursSinceDecay = (now.getTime() - lastDecay.getTime()) / 3600000;

  if (hoursSinceDecay < 1) return { edges, state }; // Too soon

  const updatedEdges = edges.map((e) => {
    const floor = state.weightFloors[edgeKey(e.source, e.target)] ?? MIN_WEIGHT;
    const decayed = e.weight * Math.pow(DECAY_RATE, hoursSinceDecay);
    return { ...e, weight: Math.max(floor, decayed) };
  });

  return {
    edges: updatedEdges,
    state: { ...state, lastDecayTimestamp: now.toISOString() },
  };
}

/**
 * Network resilience analysis.
 *
 * Computes graph-theoretic metrics that indicate recovery potential:
 * - Connectivity: ratio of functional edges (above pruning threshold)
 * - Path redundancy: average number of paths between node pairs
 * - Bottleneck identification: nodes whose removal most disconnects the graph
 * - Overall resilience score
 */
export type NetworkAnalysis = {
  resilience: number;        // 0-1 overall score
  connectivity: number;      // ratio of functional edges
  avgPathLength: number;     // average shortest path (lower = better)
  bottlenecks: string[];     // node IDs that are critical
  weakestPaths: { from: string; to: string; weight: number }[];
  strongestPaths: { from: string; to: string; weight: number }[];
  clusters: string[][];      // connected component groups
};

export function analyzeNetwork(
  nodes: BrainNode[],
  edges: BrainEdge[]
): NetworkAnalysis {
  const functional = edges.filter((e) => e.weight >= PRUNING_THRESHOLD);
  const connectivity = edges.length > 0 ? functional.length / edges.length : 0;

  // Build adjacency for shortest paths (Dijkstra-like with inverse weights)
  const adj = new Map<string, { target: string; weight: number }[]>();
  for (const node of nodes) {
    adj.set(node.id, []);
  }
  for (const edge of functional) {
    adj.get(edge.source)?.push({ target: edge.target, weight: edge.weight });
    adj.get(edge.target)?.push({ target: edge.source, weight: edge.weight });
  }

  // Shortest paths using BFS (unweighted for simplicity, weighted by inverse edge weight)
  function shortestPath(start: string, end: string): number {
    const dist = new Map<string, number>();
    const queue: { node: string; cost: number }[] = [{ node: start, cost: 0 }];
    dist.set(start, 0);

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost - b.cost);
      const { node, cost } = queue.shift()!;
      if (node === end) return cost;
      if (cost > (dist.get(node) ?? Infinity)) continue;

      for (const neighbor of adj.get(node) ?? []) {
        const edgeCost = 1 / Math.max(0.01, neighbor.weight); // inverse weight
        const newCost = cost + edgeCost;
        if (newCost < (dist.get(neighbor.target) ?? Infinity)) {
          dist.set(neighbor.target, newCost);
          queue.push({ node: neighbor.target, cost: newCost });
        }
      }
    }
    return Infinity;
  }

  // Average path length
  let totalPath = 0;
  let pathCount = 0;
  const nodeIds = nodes.map((n) => n.id);
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const d = shortestPath(nodeIds[i], nodeIds[j]);
      if (d < Infinity) {
        totalPath += d;
        pathCount++;
      }
    }
  }
  const avgPathLength = pathCount > 0 ? totalPath / pathCount : Infinity;

  // Bottleneck detection: node betweenness (simplified)
  const betweenness = new Map<string, number>();
  for (const id of nodeIds) betweenness.set(id, 0);

  for (let i = 0; i < nodeIds.length; i++) {
    // BFS from each node
    const visited = new Set<string>();
    const queue = [nodeIds[i]];
    const parent = new Map<string, string>();
    visited.add(nodeIds[i]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of adj.get(current) ?? []) {
        if (!visited.has(neighbor.target)) {
          visited.add(neighbor.target);
          parent.set(neighbor.target, current);
          queue.push(neighbor.target);
        }
      }
    }

    // Count how often each node appears on shortest paths
    for (const target of nodeIds) {
      let node = target;
      while (parent.has(node)) {
        node = parent.get(node)!;
        if (node !== nodeIds[i]) {
          betweenness.set(node, (betweenness.get(node) ?? 0) + 1);
        }
      }
    }
  }

  const bottlenecks = [...betweenness.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  // Weakest and strongest edges
  const sortedEdges = [...functional].sort((a, b) => a.weight - b.weight);
  const weakestPaths = sortedEdges.slice(0, 3).map((e) => ({
    from: e.source,
    to: e.target,
    weight: Math.round(e.weight * 100) / 100,
  }));
  const strongestPaths = sortedEdges
    .slice(-3)
    .reverse()
    .map((e) => ({
      from: e.source,
      to: e.target,
      weight: Math.round(e.weight * 100) / 100,
    }));

  // Connected components
  const visited = new Set<string>();
  const clusters: string[][] = [];
  for (const id of nodeIds) {
    if (visited.has(id)) continue;
    const cluster: string[] = [];
    const stack = [id];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (visited.has(node)) continue;
      visited.add(node);
      cluster.push(node);
      for (const neighbor of adj.get(node) ?? []) {
        if (!visited.has(neighbor.target)) stack.push(neighbor.target);
      }
    }
    clusters.push(cluster);
  }

  // Resilience: composite score
  const normalizedPathLength = avgPathLength < Infinity ? Math.max(0, 1 - avgPathLength / 20) : 0;
  const clusterPenalty = clusters.length > 1 ? 0.8 : 1.0;
  const resilience = Math.min(1, connectivity * 0.4 + normalizedPathLength * 0.4 + 0.2) * clusterPenalty;

  return {
    resilience: Math.round(resilience * 100) / 100,
    connectivity: Math.round(connectivity * 100) / 100,
    avgPathLength: Math.round(avgPathLength * 100) / 100,
    bottlenecks,
    weakestPaths,
    strongestPaths,
    clusters,
  };
}

/**
 * Process a new assessment through the Hebbian model.
 * This is the main integration point with the rest of the app.
 */
export function processAssessmentHebbian(
  memory: AgentMemory,
  assessment: AssessmentRecord
): AgentMemory {
  const hebbState = initHebbianState(memory);
  const activatedNodes = ASSESSMENT_NODE_MAP[assessment.type] ?? [];
  const activationStrength = assessment.value / 100;

  // Apply decay first
  const { edges: decayedEdges, state: decayedState } = applyDecay(
    memory.graphState.edges,
    hebbState
  );

  // Hebbian update
  const { nodes, edges, state } = hebbianUpdate(
    memory.graphState.nodes,
    decayedEdges,
    decayedState,
    activatedNodes,
    activationStrength,
    "assessment"
  );

  return {
    ...memory,
    graphState: { nodes, edges },
    // Store Hebbian state in memory for persistence
    ...(({ hebbianState: state }) as unknown as Partial<AgentMemory>),
  };
}
