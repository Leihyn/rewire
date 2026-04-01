// === PATIENT PROFILE ===
export type PatientProfile = {
  id: string;
  name: string;
  condition: ConditionType;
  affectedSide: "left" | "right" | "bilateral";
  onsetDate: string;
  createdAt: string;
  goals: string[];
};

export type ConditionType =
  | "stroke"
  | "tbi"
  | "parkinsons"
  | "ms"
  | "spinal-cord"
  | "cerebral-palsy"
  | "other";

export const CONDITION_LABELS: Record<ConditionType, string> = {
  stroke: "Stroke",
  tbi: "Traumatic Brain Injury",
  parkinsons: "Parkinson's Disease",
  ms: "Multiple Sclerosis",
  "spinal-cord": "Spinal Cord Injury",
  "cerebral-palsy": "Cerebral Palsy",
  other: "Other",
};

// === ASSESSMENTS ===
export type AssessmentType =
  | "grip"
  | "pain"
  | "rom"
  | "reaction"
  | "memory"
  | "tremor";

export const ASSESSMENT_LABELS: Record<AssessmentType, string> = {
  grip: "Grip Strength",
  pain: "Pain Level",
  rom: "Range of Motion",
  reaction: "Reaction Time",
  memory: "Memory Recall",
  tremor: "Tremor Detection",
};

export const ASSESSMENT_ICONS: Record<AssessmentType, string> = {
  grip: "✊",
  pain: "📊",
  rom: "🔄",
  reaction: "⚡",
  memory: "🧠",
  tremor: "📳",
};

export type AssessmentRecord = {
  id: string;
  type: AssessmentType;
  timestamp: string;
  value: number; // normalized 0-100
  raw: Record<string, number>;
  bodyPart?: string;
};

// === EXERCISES ===
export type ExerciseCategory = "motor" | "cognitive" | "sensory";

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetRegion: string;
  description: string;
  instructions: string[];
  baseDifficulty: number; // 1-10
  durationSeconds: number;
  repetitions: number;
};

export type ExerciseLog = {
  id: string;
  exerciseId: string;
  timestamp: string;
  completedReps: number;
  difficultyAtTime: number;
  painDuring: number;
  perceivedEffort: number; // 1-5 RPE
};

export type ExerciseParams = {
  currentDifficulty: number;
  lastPerformed: string | null;
  streakDays: number;
  spacingIntervalHours: number;
  successRate: number; // rolling average
};

// === NEURAL GRAPH ===
export type BrainNode = {
  id: string;
  label: string;
  region: string;
  x?: number;
  y?: number;
  strength: number; // 0-1
};

export type BrainEdge = {
  source: string;
  target: string;
  weight: number; // 0-1
};

// === AGENT MEMORY ===
export type AgentMemory = {
  version: number;
  profile: PatientProfile;
  assessments: AssessmentRecord[];
  exerciseLogs: ExerciseLog[];
  exerciseParams: Record<string, ExerciseParams>;
  graphState: {
    nodes: BrainNode[];
    edges: BrainEdge[];
  };
  preferences: {
    reminderTime?: string;
    preferredExerciseDuration: number;
    voiceGuidance: boolean;
  };
  meta: {
    lastSyncedAt: string;
    lastCID: string | null;
    deviceId: string;
  };
};

// === APP STATE ===
export type SyncStatus = "idle" | "syncing" | "synced" | "error";

export type AppView =
  | "onboarding"
  | "dashboard"
  | "assess"
  | "exercises"
  | "graph";

export type AgentInsight = {
  id: string;
  text: string;
  type: "encouragement" | "recommendation" | "milestone" | "warning";
  timestamp: string;
};
