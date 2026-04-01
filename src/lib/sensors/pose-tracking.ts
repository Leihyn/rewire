/**
 * MediaPipe Pose Estimation wrapper for neurorehabilitation movement tracking.
 *
 * Tracks joint angles, movement velocity, smoothness (jerk metric),
 * and bilateral symmetry — all clinically relevant rehab metrics.
 */

import {
  PoseLandmarker,
  FilesetResolver,
  type PoseLandmarkerResult,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

export type JointAngle = {
  name: string;
  angle: number; // degrees
  confidence: number;
};

export type MovementMetrics = {
  jointAngles: JointAngle[];
  velocity: number; // average movement speed (normalized units/s)
  smoothness: number; // 0-1, higher = smoother (inverse of normalized jerk)
  symmetry: number; // 0-1, bilateral symmetry score
  rangeOfMotion: Record<string, { min: number; max: number; current: number }>;
};

export type PoseFrame = {
  timestamp: number;
  landmarks: NormalizedLandmark[];
  metrics: MovementMetrics;
};

let poseLandmarker: PoseLandmarker | null = null;
let isInitializing = false;

export async function initPoseDetection(): Promise<PoseLandmarker> {
  if (poseLandmarker) return poseLandmarker;
  if (isInitializing) {
    // Wait for existing initialization
    while (isInitializing) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return poseLandmarker!;
  }

  isInitializing = true;
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });

    return poseLandmarker;
  } finally {
    isInitializing = false;
  }
}

export function processFrame(
  video: HTMLVideoElement,
  timestampMs: number
): PoseLandmarkerResult | null {
  if (!poseLandmarker) return null;
  try {
    return poseLandmarker.detectForVideo(video, timestampMs);
  } catch {
    return null;
  }
}

// Landmark indices (MediaPipe Pose)
const LANDMARK = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
};

function angleBetween(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark
): number {
  const ab = { x: a.x - b.x, y: a.y - b.y, z: (a.z ?? 0) - (b.z ?? 0) };
  const cb = { x: c.x - b.x, y: c.y - b.y, z: (c.z ?? 0) - (b.z ?? 0) };
  const dot = ab.x * cb.x + ab.y * cb.y + ab.z * cb.z;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2 + ab.z ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2 + cb.z ** 2);
  if (magAB === 0 || magCB === 0) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

function distance(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt(
    (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + ((a.z ?? 0) - (b.z ?? 0)) ** 2
  );
}

export function extractJointAngles(landmarks: NormalizedLandmark[]): JointAngle[] {
  const L = landmarks;
  const angles: JointAngle[] = [];

  // Left elbow angle
  if (L[LANDMARK.LEFT_SHOULDER] && L[LANDMARK.LEFT_ELBOW] && L[LANDMARK.LEFT_WRIST]) {
    angles.push({
      name: "Left Elbow",
      angle: angleBetween(
        L[LANDMARK.LEFT_SHOULDER],
        L[LANDMARK.LEFT_ELBOW],
        L[LANDMARK.LEFT_WRIST]
      ),
      confidence: Math.min(
        L[LANDMARK.LEFT_SHOULDER].visibility ?? 0,
        L[LANDMARK.LEFT_ELBOW].visibility ?? 0,
        L[LANDMARK.LEFT_WRIST].visibility ?? 0
      ),
    });
  }

  // Right elbow angle
  if (L[LANDMARK.RIGHT_SHOULDER] && L[LANDMARK.RIGHT_ELBOW] && L[LANDMARK.RIGHT_WRIST]) {
    angles.push({
      name: "Right Elbow",
      angle: angleBetween(
        L[LANDMARK.RIGHT_SHOULDER],
        L[LANDMARK.RIGHT_ELBOW],
        L[LANDMARK.RIGHT_WRIST]
      ),
      confidence: Math.min(
        L[LANDMARK.RIGHT_SHOULDER].visibility ?? 0,
        L[LANDMARK.RIGHT_ELBOW].visibility ?? 0,
        L[LANDMARK.RIGHT_WRIST].visibility ?? 0
      ),
    });
  }

  // Left shoulder angle
  if (L[LANDMARK.LEFT_HIP] && L[LANDMARK.LEFT_SHOULDER] && L[LANDMARK.LEFT_ELBOW]) {
    angles.push({
      name: "Left Shoulder",
      angle: angleBetween(
        L[LANDMARK.LEFT_HIP],
        L[LANDMARK.LEFT_SHOULDER],
        L[LANDMARK.LEFT_ELBOW]
      ),
      confidence: Math.min(
        L[LANDMARK.LEFT_HIP].visibility ?? 0,
        L[LANDMARK.LEFT_SHOULDER].visibility ?? 0,
        L[LANDMARK.LEFT_ELBOW].visibility ?? 0
      ),
    });
  }

  // Right shoulder angle
  if (L[LANDMARK.RIGHT_HIP] && L[LANDMARK.RIGHT_SHOULDER] && L[LANDMARK.RIGHT_ELBOW]) {
    angles.push({
      name: "Right Shoulder",
      angle: angleBetween(
        L[LANDMARK.RIGHT_HIP],
        L[LANDMARK.RIGHT_SHOULDER],
        L[LANDMARK.RIGHT_ELBOW]
      ),
      confidence: Math.min(
        L[LANDMARK.RIGHT_HIP].visibility ?? 0,
        L[LANDMARK.RIGHT_SHOULDER].visibility ?? 0,
        L[LANDMARK.RIGHT_ELBOW].visibility ?? 0
      ),
    });
  }

  // Left knee angle
  if (L[LANDMARK.LEFT_HIP] && L[LANDMARK.LEFT_KNEE] && L[LANDMARK.LEFT_ANKLE]) {
    angles.push({
      name: "Left Knee",
      angle: angleBetween(
        L[LANDMARK.LEFT_HIP],
        L[LANDMARK.LEFT_KNEE],
        L[LANDMARK.LEFT_ANKLE]
      ),
      confidence: Math.min(
        L[LANDMARK.LEFT_HIP].visibility ?? 0,
        L[LANDMARK.LEFT_KNEE].visibility ?? 0,
        L[LANDMARK.LEFT_ANKLE].visibility ?? 0
      ),
    });
  }

  // Right knee angle
  if (L[LANDMARK.RIGHT_HIP] && L[LANDMARK.RIGHT_KNEE] && L[LANDMARK.RIGHT_ANKLE]) {
    angles.push({
      name: "Right Knee",
      angle: angleBetween(
        L[LANDMARK.RIGHT_HIP],
        L[LANDMARK.RIGHT_KNEE],
        L[LANDMARK.RIGHT_ANKLE]
      ),
      confidence: Math.min(
        L[LANDMARK.RIGHT_HIP].visibility ?? 0,
        L[LANDMARK.RIGHT_KNEE].visibility ?? 0,
        L[LANDMARK.RIGHT_ANKLE].visibility ?? 0
      ),
    });
  }

  return angles;
}

/**
 * Calculate movement smoothness using normalized jerk metric.
 * Lower jerk = smoother movement = better motor control.
 * Based on: Hogan & Sternad (2009) — sensitivity of smoothness measures.
 */
export function calculateSmoothness(frames: PoseFrame[]): number {
  if (frames.length < 3) return 0.5;

  // Track wrist position across frames
  const positions = frames
    .map((f) => {
      const wrist = f.landmarks[LANDMARK.RIGHT_WRIST] ?? f.landmarks[LANDMARK.LEFT_WRIST];
      return wrist ? { x: wrist.x, y: wrist.y, t: f.timestamp } : null;
    })
    .filter(Boolean) as { x: number; y: number; t: number }[];

  if (positions.length < 3) return 0.5;

  // Calculate velocities
  const velocities: { vx: number; vy: number; t: number }[] = [];
  for (let i = 1; i < positions.length; i++) {
    const dt = (positions[i].t - positions[i - 1].t) / 1000;
    if (dt <= 0) continue;
    velocities.push({
      vx: (positions[i].x - positions[i - 1].x) / dt,
      vy: (positions[i].y - positions[i - 1].y) / dt,
      t: positions[i].t,
    });
  }

  // Calculate jerk (derivative of acceleration)
  let totalJerk = 0;
  for (let i = 2; i < velocities.length; i++) {
    const dt1 = (velocities[i].t - velocities[i - 1].t) / 1000;
    const dt0 = (velocities[i - 1].t - velocities[i - 2].t) / 1000;
    if (dt1 <= 0 || dt0 <= 0) continue;

    const ax1 = (velocities[i].vx - velocities[i - 1].vx) / dt1;
    const ay1 = (velocities[i].vy - velocities[i - 1].vy) / dt1;
    const ax0 = (velocities[i - 1].vx - velocities[i - 2].vx) / dt0;
    const ay0 = (velocities[i - 1].vy - velocities[i - 2].vy) / dt0;

    const jx = (ax1 - ax0) / ((dt1 + dt0) / 2);
    const jy = (ay1 - ay0) / ((dt1 + dt0) / 2);

    totalJerk += Math.sqrt(jx ** 2 + jy ** 2);
  }

  const avgJerk = totalJerk / Math.max(1, velocities.length - 2);

  // Normalize: jerk < 10 = very smooth (score ~1), jerk > 200 = very jerky (score ~0)
  const smoothness = Math.max(0, Math.min(1, 1 - avgJerk / 200));
  return smoothness;
}

/**
 * Bilateral symmetry: compare left and right side joint angles.
 * Perfect symmetry = 1.0, completely asymmetric = 0.0.
 */
export function calculateSymmetry(angles: JointAngle[]): number {
  const pairs = [
    ["Left Elbow", "Right Elbow"],
    ["Left Shoulder", "Right Shoulder"],
    ["Left Knee", "Right Knee"],
  ];

  let totalDiff = 0;
  let count = 0;

  for (const [left, right] of pairs) {
    const leftAngle = angles.find((a) => a.name === left);
    const rightAngle = angles.find((a) => a.name === right);
    if (leftAngle && rightAngle && leftAngle.confidence > 0.5 && rightAngle.confidence > 0.5) {
      const diff = Math.abs(leftAngle.angle - rightAngle.angle);
      totalDiff += diff;
      count++;
    }
  }

  if (count === 0) return 0.5;

  const avgDiff = totalDiff / count;
  // Normalize: 0° diff = 1.0, 45°+ diff = 0.0
  return Math.max(0, Math.min(1, 1 - avgDiff / 45));
}

/**
 * Calculate average movement velocity from tracked frames.
 */
export function calculateVelocity(frames: PoseFrame[]): number {
  if (frames.length < 2) return 0;

  let totalDist = 0;
  let totalTime = 0;

  for (let i = 1; i < frames.length; i++) {
    const prev = frames[i - 1].landmarks[LANDMARK.RIGHT_WRIST];
    const curr = frames[i].landmarks[LANDMARK.RIGHT_WRIST];
    if (prev && curr) {
      totalDist += distance(prev, curr);
      totalTime += (frames[i].timestamp - frames[i - 1].timestamp) / 1000;
    }
  }

  return totalTime > 0 ? totalDist / totalTime : 0;
}

export function computeMetrics(
  landmarks: NormalizedLandmark[],
  history: PoseFrame[]
): MovementMetrics {
  const jointAngles = extractJointAngles(landmarks);
  const smoothness = calculateSmoothness(history);
  const symmetry = calculateSymmetry(jointAngles);
  const velocity = calculateVelocity(history);

  // Track ROM from history
  const rom: Record<string, { min: number; max: number; current: number }> = {};
  for (const angle of jointAngles) {
    const historyAngles = history
      .flatMap((f) => f.metrics.jointAngles)
      .filter((a) => a.name === angle.name)
      .map((a) => a.angle);
    historyAngles.push(angle.angle);

    rom[angle.name] = {
      min: Math.min(...historyAngles),
      max: Math.max(...historyAngles),
      current: angle.angle,
    };
  }

  return { jointAngles, velocity, smoothness, symmetry, rangeOfMotion: rom };
}

export function destroyPoseDetection() {
  if (poseLandmarker) {
    poseLandmarker.close();
    poseLandmarker = null;
  }
}
