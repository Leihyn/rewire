import type { AgentMemory, AssessmentRecord, ExerciseLog } from "@/types";
import { DEFAULT_NODES, DEFAULT_EDGES } from "./brain-regions";

/**
 * Pre-populated demo data showing a realistic 6-week stroke recovery journey.
 * Patient: Alex Chen, left hemisphere ischemic stroke, day 42 of recovery.
 */

function daysAgo(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

const DEMO_ASSESSMENTS: AssessmentRecord[] = [
  // Week 1 — baseline (low scores)
  { id: "a1", type: "grip", timestamp: daysAgo(42), value: 20, raw: { rating: 1 } },
  { id: "a2", type: "pain", timestamp: daysAgo(42), value: 30, raw: { painLevel: 7 } },
  { id: "a3", type: "reaction", timestamp: daysAgo(41), value: 25, raw: { avgMs: 412, trials: 5, bestMs: 380, worstMs: 460 } },
  { id: "a4", type: "memory", timestamp: daysAgo(40), value: 28, raw: { maxSequenceLength: 4, finalLevel: 4 } },
  { id: "a5", type: "tremor", timestamp: daysAgo(40), value: 35, raw: { rms: 2.8, dominantFrequency: 4.8, severity: 65, spectralEntropy: 0.42, sampleRate: 60, sampleCount: 600, classification: 2 } },

  // Week 2 — slight improvement
  { id: "a6", type: "grip", timestamp: daysAgo(35), value: 30, raw: { rating: 2 } },
  { id: "a7", type: "rom", timestamp: daysAgo(34), value: 35, raw: { degrees: 55, joint: 0, maxDeg: 180 }, bodyPart: "shoulder" },
  { id: "a8", type: "pain", timestamp: daysAgo(33), value: 40, raw: { painLevel: 6 } },
  { id: "a9", type: "reaction", timestamp: daysAgo(32), value: 38, raw: { avgMs: 368, trials: 5, bestMs: 320, worstMs: 410 } },

  // Week 3 — noticeable gains
  { id: "a10", type: "grip", timestamp: daysAgo(28), value: 45, raw: { rating: 3 } },
  { id: "a11", type: "memory", timestamp: daysAgo(27), value: 42, raw: { maxSequenceLength: 5, finalLevel: 5 } },
  { id: "a12", type: "tremor", timestamp: daysAgo(26), value: 50, raw: { rms: 1.9, dominantFrequency: 5.1, severity: 50, spectralEntropy: 0.55, sampleRate: 60, sampleCount: 600, classification: 2 } },
  { id: "a13", type: "rom", timestamp: daysAgo(25), value: 48, raw: { degrees: 80, joint: 0, maxDeg: 180 }, bodyPart: "shoulder" },

  // Week 4 — acceleration phase
  { id: "a14", type: "grip", timestamp: daysAgo(21), value: 55, raw: { rating: 3 } },
  { id: "a15", type: "pain", timestamp: daysAgo(20), value: 60, raw: { painLevel: 4 } },
  { id: "a16", type: "reaction", timestamp: daysAgo(19), value: 55, raw: { avgMs: 305, trials: 5, bestMs: 270, worstMs: 340 } },
  { id: "a17", type: "memory", timestamp: daysAgo(18), value: 57, raw: { maxSequenceLength: 6, finalLevel: 6 } },

  // Week 5 — strong progress
  { id: "a18", type: "grip", timestamp: daysAgo(14), value: 65, raw: { rating: 4 } },
  { id: "a19", type: "tremor", timestamp: daysAgo(13), value: 68, raw: { rms: 1.1, dominantFrequency: 5.3, severity: 32, spectralEntropy: 0.68, sampleRate: 60, sampleCount: 600, classification: 1 } },
  { id: "a20", type: "rom", timestamp: daysAgo(12), value: 62, raw: { degrees: 110, joint: 0, maxDeg: 180 }, bodyPart: "shoulder" },
  { id: "a21", type: "pain", timestamp: daysAgo(11), value: 70, raw: { painLevel: 3 } },

  // Week 6 — current (recent assessments judges will see)
  { id: "a22", type: "grip", timestamp: daysAgo(5), value: 72, raw: { rating: 4 } },
  { id: "a23", type: "reaction", timestamp: daysAgo(4), value: 71, raw: { avgMs: 252, trials: 5, bestMs: 220, worstMs: 290 } },
  { id: "a24", type: "memory", timestamp: daysAgo(3), value: 71, raw: { maxSequenceLength: 7, finalLevel: 7 } },
  { id: "a25", type: "tremor", timestamp: daysAgo(2), value: 75, raw: { rms: 0.8, dominantFrequency: 5.5, severity: 25, spectralEntropy: 0.72, sampleRate: 60, sampleCount: 600, classification: 1 } },
  { id: "a26", type: "rom", timestamp: daysAgo(1), value: 70, raw: { degrees: 125, joint: 0, maxDeg: 180 }, bodyPart: "shoulder" },
  { id: "a27", type: "pain", timestamp: daysAgo(1), value: 80, raw: { painLevel: 2 } },
];

const DEMO_EXERCISE_LOGS: ExerciseLog[] = [
  { id: "e1", exerciseId: "finger-tap", timestamp: daysAgo(41), completedReps: 8, difficultyAtTime: 3, painDuring: 5, perceivedEffort: 4 },
  { id: "e2", exerciseId: "grip-squeeze", timestamp: daysAgo(40), completedReps: 10, difficultyAtTime: 2, painDuring: 4, perceivedEffort: 3 },
  { id: "e3", exerciseId: "sequence-recall", timestamp: daysAgo(39), completedReps: 8, difficultyAtTime: 3, painDuring: 0, perceivedEffort: 4 },
  { id: "e4", exerciseId: "wrist-rotation", timestamp: daysAgo(35), completedReps: 12, difficultyAtTime: 2, painDuring: 3, perceivedEffort: 2 },
  { id: "e5", exerciseId: "finger-tap", timestamp: daysAgo(34), completedReps: 10, difficultyAtTime: 4, painDuring: 3, perceivedEffort: 3 },
  { id: "e6", exerciseId: "reach-grasp", timestamp: daysAgo(30), completedReps: 6, difficultyAtTime: 4, painDuring: 3, perceivedEffort: 4 },
  { id: "e7", exerciseId: "bilateral-sync", timestamp: daysAgo(28), completedReps: 8, difficultyAtTime: 5, painDuring: 2, perceivedEffort: 3 },
  { id: "e8", exerciseId: "dual-task", timestamp: daysAgo(25), completedReps: 4, difficultyAtTime: 6, painDuring: 0, perceivedEffort: 4 },
  { id: "e9", exerciseId: "grip-squeeze", timestamp: daysAgo(21), completedReps: 12, difficultyAtTime: 4, painDuring: 2, perceivedEffort: 2 },
  { id: "e10", exerciseId: "finger-tap", timestamp: daysAgo(20), completedReps: 10, difficultyAtTime: 5, painDuring: 2, perceivedEffort: 3 },
  { id: "e11", exerciseId: "pattern-match", timestamp: daysAgo(18), completedReps: 8, difficultyAtTime: 4, painDuring: 0, perceivedEffort: 3 },
  { id: "e12", exerciseId: "texture-id", timestamp: daysAgo(15), completedReps: 5, difficultyAtTime: 3, painDuring: 1, perceivedEffort: 2 },
  { id: "e13", exerciseId: "reach-grasp", timestamp: daysAgo(12), completedReps: 8, difficultyAtTime: 6, painDuring: 1, perceivedEffort: 3 },
  { id: "e14", exerciseId: "bilateral-sync", timestamp: daysAgo(7), completedReps: 10, difficultyAtTime: 6, painDuring: 1, perceivedEffort: 2 },
  { id: "e15", exerciseId: "finger-tap", timestamp: daysAgo(5), completedReps: 10, difficultyAtTime: 6, painDuring: 1, perceivedEffort: 2 },
  { id: "e16", exerciseId: "dual-task", timestamp: daysAgo(3), completedReps: 5, difficultyAtTime: 7, painDuring: 0, perceivedEffort: 3 },
  { id: "e17", exerciseId: "sequence-recall", timestamp: daysAgo(2), completedReps: 10, difficultyAtTime: 5, painDuring: 0, perceivedEffort: 2 },
  { id: "e18", exerciseId: "grip-squeeze", timestamp: daysAgo(1), completedReps: 12, difficultyAtTime: 5, painDuring: 1, perceivedEffort: 2 },
];

function buildDemoGraph() {
  const nodes = DEFAULT_NODES.map((n) => ({ ...n }));
  const edges = DEFAULT_EDGES.map((e) => ({ ...e }));

  // Simulate 6 weeks of Hebbian updates — motor circuit strong, language still weak
  const strengthMap: Record<string, number> = {
    "motor-cortex": 0.78,
    "premotor": 0.72,
    "sma": 0.65,
    "prefrontal": 0.55,
    "somatosensory": 0.60,
    "parietal-assoc": 0.48,
    "cerebellum": 0.70,
    "basal-ganglia": 0.62,
    "thalamus": 0.68,
    "hippocampus": 0.52,
    "broca": 0.30,      // weak — not targeted by exercises yet
    "wernicke": 0.25,    // weak — pruning visible
  };

  for (const node of nodes) {
    node.strength = strengthMap[node.id] ?? 0.3;
  }

  // Edge weights follow node strengths (Hebbian co-activation)
  for (const edge of edges) {
    const src = nodes.find((n) => n.id === edge.source);
    const tgt = nodes.find((n) => n.id === edge.target);
    if (src && tgt) {
      edge.weight = (src.strength + tgt.strength) / 2;
      // LTP-consolidated edges are stronger
      if (src.strength > 0.65 && tgt.strength > 0.65) {
        edge.weight = Math.min(1, edge.weight * 1.2);
      }
      // Pruned edges are weaker
      if (src.strength < 0.35 || tgt.strength < 0.35) {
        edge.weight = Math.max(0.05, edge.weight * 0.5);
      }
    }
  }

  return { nodes, edges };
}

export function createDemoMemory(): AgentMemory {
  return {
    version: 1,
    profile: {
      id: "demo-alex-chen",
      name: "Alex Chen",
      condition: "stroke",
      affectedSide: "right",
      onsetDate: daysAgo(45),
      createdAt: daysAgo(42),
      goals: ["Recover grip strength", "Independent daily tasks", "Return to work"],
    },
    assessments: DEMO_ASSESSMENTS,
    exerciseLogs: DEMO_EXERCISE_LOGS,
    exerciseParams: {
      "finger-tap": { currentDifficulty: 6, lastPerformed: daysAgo(5), streakDays: 8, spacingIntervalHours: 12, successRate: 0.82 },
      "grip-squeeze": { currentDifficulty: 5, lastPerformed: daysAgo(1), streakDays: 6, spacingIntervalHours: 8, successRate: 0.78 },
      "wrist-rotation": { currentDifficulty: 4, lastPerformed: daysAgo(10), streakDays: 3, spacingIntervalHours: 16, successRate: 0.75 },
      "reach-grasp": { currentDifficulty: 6, lastPerformed: daysAgo(12), streakDays: 4, spacingIntervalHours: 24, successRate: 0.70 },
      "bilateral-sync": { currentDifficulty: 6, lastPerformed: daysAgo(7), streakDays: 5, spacingIntervalHours: 18, successRate: 0.76 },
      "sequence-recall": { currentDifficulty: 5, lastPerformed: daysAgo(2), streakDays: 4, spacingIntervalHours: 12, successRate: 0.80 },
      "dual-task": { currentDifficulty: 7, lastPerformed: daysAgo(3), streakDays: 3, spacingIntervalHours: 24, successRate: 0.65 },
      "pattern-match": { currentDifficulty: 4, lastPerformed: daysAgo(18), streakDays: 2, spacingIntervalHours: 24, successRate: 0.72 },
      "texture-id": { currentDifficulty: 3, lastPerformed: daysAgo(15), streakDays: 1, spacingIntervalHours: 48, successRate: 0.68 },
      "proprioception": { currentDifficulty: 4, lastPerformed: null, streakDays: 0, spacingIntervalHours: 4, successRate: 0.5 },
    },
    graphState: buildDemoGraph(),
    preferences: {
      preferredExerciseDuration: 20,
      voiceGuidance: false,
    },
    meta: {
      lastSyncedAt: new Date().toISOString(),
      lastCID: "bafybeif7ztnhq65lumvvtr4ekcwd2ifwgm3awq4zfr3srh462bwyiy3ay",
      deviceId: "demo-device",
    },
  };
}
