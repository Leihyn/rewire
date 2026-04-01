import type { BrainNode, BrainEdge } from "@/types";

export const DEFAULT_NODES: BrainNode[] = [
  { id: "motor-cortex", label: "Primary Motor Cortex", region: "frontal", strength: 0.3 },
  { id: "premotor", label: "Premotor Cortex", region: "frontal", strength: 0.3 },
  { id: "sma", label: "Supplementary Motor Area", region: "frontal", strength: 0.3 },
  { id: "prefrontal", label: "Prefrontal Cortex", region: "frontal", strength: 0.3 },
  { id: "somatosensory", label: "Somatosensory Cortex", region: "parietal", strength: 0.3 },
  { id: "parietal-assoc", label: "Parietal Association", region: "parietal", strength: 0.3 },
  { id: "cerebellum", label: "Cerebellum", region: "hindbrain", strength: 0.3 },
  { id: "basal-ganglia", label: "Basal Ganglia", region: "subcortical", strength: 0.3 },
  { id: "thalamus", label: "Thalamus", region: "subcortical", strength: 0.3 },
  { id: "hippocampus", label: "Hippocampus", region: "temporal", strength: 0.3 },
  { id: "broca", label: "Broca's Area", region: "frontal", strength: 0.3 },
  { id: "wernicke", label: "Wernicke's Area", region: "temporal", strength: 0.3 },
];

export const DEFAULT_EDGES: BrainEdge[] = [
  // Motor circuit
  { source: "motor-cortex", target: "premotor", weight: 0.3 },
  { source: "motor-cortex", target: "sma", weight: 0.3 },
  { source: "motor-cortex", target: "cerebellum", weight: 0.2 },
  { source: "motor-cortex", target: "basal-ganglia", weight: 0.2 },
  { source: "motor-cortex", target: "somatosensory", weight: 0.3 },
  { source: "premotor", target: "sma", weight: 0.3 },
  { source: "premotor", target: "prefrontal", weight: 0.2 },
  // Sensory-motor integration
  { source: "somatosensory", target: "parietal-assoc", weight: 0.3 },
  { source: "parietal-assoc", target: "premotor", weight: 0.2 },
  // Subcortical loops
  { source: "basal-ganglia", target: "thalamus", weight: 0.3 },
  { source: "thalamus", target: "motor-cortex", weight: 0.3 },
  { source: "thalamus", target: "prefrontal", weight: 0.2 },
  { source: "cerebellum", target: "thalamus", weight: 0.3 },
  // Cognitive
  { source: "prefrontal", target: "hippocampus", weight: 0.2 },
  { source: "hippocampus", target: "parietal-assoc", weight: 0.2 },
  // Language
  { source: "broca", target: "wernicke", weight: 0.3 },
  { source: "broca", target: "motor-cortex", weight: 0.2 },
  { source: "wernicke", target: "parietal-assoc", weight: 0.2 },
];

// Maps assessment types to which brain nodes they affect
export const ASSESSMENT_NODE_MAP: Record<string, string[]> = {
  grip: ["motor-cortex", "premotor", "cerebellum", "basal-ganglia"],
  pain: ["somatosensory", "thalamus", "parietal-assoc"],
  rom: ["motor-cortex", "premotor", "sma", "cerebellum"],
  reaction: ["prefrontal", "premotor", "basal-ganglia", "thalamus"],
  memory: ["hippocampus", "prefrontal", "parietal-assoc"],
  tremor: ["basal-ganglia", "cerebellum", "thalamus", "motor-cortex"],
};

export function getDefaultGraphState() {
  return {
    nodes: DEFAULT_NODES.map((n) => ({ ...n })),
    edges: DEFAULT_EDGES.map((e) => ({ ...e })),
  };
}
