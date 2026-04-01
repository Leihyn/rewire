"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentRecord } from "@/types";
import {
  initPoseDetection,
  processFrame,
  computeMetrics,
  destroyPoseDetection,
  type PoseFrame,
  type MovementMetrics,
} from "@/lib/sensors/pose-tracking";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

type Phase = "setup" | "calibrating" | "tracking" | "results" | "saved";

// Landmark connections for drawing skeleton
const CONNECTIONS: [number, number][] = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
  [11, 23], [12, 24], [23, 24], [23, 25], [25, 27],
  [24, 26], [26, 28], [15, 19], [16, 20],
];

export default function PoseAssessment({ onBack }: { onBack: () => void }) {
  const { addAssessment } = useReWire();
  const [phase, setPhase] = useState<Phase>("setup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<MovementMetrics | null>(null);
  const [duration] = useState(30); // seconds
  const [timeLeft, setTimeLeft] = useState(30);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const framesRef = useRef<PoseFrame[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    destroyPoseDetection();
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  async function startCamera() {
    setLoading(true);
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      await initPoseDetection();
      setPhase("calibrating");

      // Brief calibration period
      setTimeout(() => {
        framesRef.current = [];
        startTimeRef.current = performance.now();
        setPhase("tracking");
        startTracking();
      }, 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const userMsg = msg.includes("NotAllowed") || msg.includes("Permission")
        ? "Camera permission denied. Allow camera access in your browser settings."
        : msg.includes("NotFound") || msg.includes("device")
        ? "No camera found. This feature requires a webcam."
        : msg.includes("WASM") || msg.includes("fetch")
        ? "Failed to load AI model. Check your internet connection and try again."
        : `Camera error: ${msg}`;
      setError(userMsg
      );
    } finally {
      setLoading(false);
    }
  }

  function startTracking() {
    const track = () => {
      if (!videoRef.current || phase === "results") return;

      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      setTimeLeft(Math.max(0, Math.ceil(duration - elapsed)));

      if (elapsed >= duration) {
        finishTracking();
        return;
      }

      const result = processFrame(videoRef.current, now);
      if (result && result.landmarks.length > 0) {
        const landmarks = result.landmarks[0];
        const currentMetrics = computeMetrics(landmarks, framesRef.current);

        const frame: PoseFrame = {
          timestamp: now,
          landmarks,
          metrics: currentMetrics,
        };
        framesRef.current.push(frame);
        setMetrics(currentMetrics);

        // Draw skeleton overlay
        drawSkeleton(landmarks);
      }

      rafRef.current = requestAnimationFrame(track);
    };

    rafRef.current = requestAnimationFrame(track);
  }

  function drawSkeleton(landmarks: NormalizedLandmark[]) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 3;
    for (const [i, j] of CONNECTIONS) {
      const a = landmarks[i];
      const b = landmarks[j];
      if (a && b && (a.visibility ?? 0) > 0.5 && (b.visibility ?? 0) > 0.5) {
        ctx.beginPath();
        ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
        ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
        ctx.stroke();
      }
    }

    // Draw joints
    for (const lm of landmarks) {
      if ((lm.visibility ?? 0) > 0.5) {
        ctx.beginPath();
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#15999e";
        ctx.fill();
      }
    }
  }

  function finishTracking() {
    cancelAnimationFrame(rafRef.current);
    const frames = framesRef.current;

    if (frames.length > 0) {
      const finalMetrics = frames[frames.length - 1].metrics;
      setMetrics(finalMetrics);
    }

    setPhase("results");
  }

  function handleSave() {
    if (!metrics) return;

    // Composite score from movement metrics
    const smoothnessScore = metrics.smoothness * 30;
    const symmetryScore = metrics.symmetry * 30;
    const romScore = Math.min(40, Object.values(metrics.rangeOfMotion).reduce(
      (sum, rom) => sum + ((rom.max - rom.min) / 180) * 10, 0
    ));
    const totalScore = Math.round(Math.min(100, smoothnessScore + symmetryScore + romScore));

    const record: AssessmentRecord = {
      id: crypto.randomUUID(),
      type: "rom",
      timestamp: new Date().toISOString(),
      value: totalScore,
      raw: {
        smoothness: Math.round(metrics.smoothness * 100),
        symmetry: Math.round(metrics.symmetry * 100),
        velocity: Math.round(metrics.velocity * 1000),
        framesRecorded: framesRef.current.length,
        ...Object.fromEntries(
          metrics.jointAngles.map((a) => [`angle_${a.name}`, Math.round(a.angle)])
        ),
      },
    };
    addAssessment(record);
    cleanup();
    setPhase("saved");
  }

  if (phase === "saved") {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="mb-4 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="8" r="4" stroke="#D4AF37" strokeWidth="1.5"/>
            <line x1="20" y1="12" x2="20" y2="26" stroke="#D4AF37" strokeWidth="1.5"/>
            <line x1="10" y1="18" x2="30" y2="18" stroke="#D4AF37" strokeWidth="1.5"/>
            <line x1="20" y1="26" x2="12" y2="38" stroke="#D4AF37" strokeWidth="1.5"/>
            <line x1="20" y1="26" x2="28" y2="38" stroke="#D4AF37" strokeWidth="1.5"/>
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Movement Analysis Saved
        </h3>
        <p className="text-sm mb-6" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
          Smoothness: {Math.round((metrics?.smoothness ?? 0) * 100)}% | Symmetry: {Math.round((metrics?.symmetry ?? 0) * 100)}%
        </p>
        <button
          onClick={onBack}
          className="text-sm min-h-[44px]"
          style={{ background: 'none', border: 'none', color: '#D4AF37', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer' }}
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => { cleanup(); onBack(); }}
        className="text-sm mb-4 min-h-[44px] flex items-center"
        style={{ background: 'none', border: 'none', color: '#D4AF37', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'color 150ms ease-out' }}
      >
        &larr; Back
      </button>
      <h2
        className="text-xl font-bold mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
      >
        Movement Tracking
      </h2>
      <p className="text-sm mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        {phase === "setup" && "Camera-based pose estimation for movement analysis"}
        {phase === "calibrating" && "Calibrating... stand in frame"}
        {phase === "tracking" && `Tracking movement (${timeLeft}s remaining)`}
        {phase === "results" && "Analysis complete"}
      </p>

      {error && (
        <div className="p-3 mb-4" style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '2px' }}>
          <p className="text-sm" style={{ color: '#FF6B6B', fontFamily: 'Outfit, sans-serif' }}>{error}</p>
        </div>
      )}

      {phase === "setup" && (
        <>
          <div
            className="p-4 mb-6"
            style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
          >
            <h3
              className="font-medium mb-3 text-sm"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f0e8' }}
            >
              How it works
            </h3>
            <ol className="text-sm space-y-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
              <li>1. Your camera tracks 33 body landmarks using MediaPipe AI</li>
              <li>2. Joint angles, movement smoothness, and bilateral symmetry are computed in real-time</li>
              <li>3. Jerk metric measures movement quality (Hogan & Sternad, 2009)</li>
              <li>4. All processing happens locally -- no video leaves your device</li>
            </ol>
          </div>
          <button
            onClick={startCamera}
            disabled={loading}
            className="w-full py-3 active:scale-[0.98]"
            style={{
              background: loading ? '#1e1e1e' : '#D4AF37',
              color: loading ? '#5a5248' : '#0a0a0a',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              borderRadius: '2px',
              border: 'none',
              transition: 'all 150ms ease-out',
            }}
          >
            {loading ? "Initializing AI model..." : "Start Camera"}
          </button>
        </>
      )}

      {(phase === "calibrating" || phase === "tracking" || phase === "results") && (
        <>
          {/* Video + skeleton overlay */}
          <div
            className="relative overflow-hidden mb-4"
            style={{ background: '#141414', borderRadius: '2px', border: '1px solid rgba(212,175,55,0.12)' }}
          >
            <video
              ref={videoRef}
              className="w-full"
              playsInline
              muted
              style={{ transform: "scaleX(-1)" }}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ transform: "scaleX(-1)" }}
            />

            {phase === "calibrating" && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <div className="text-center">
                  <div
                    className="w-10 h-10 animate-spin mx-auto mb-2"
                    style={{ border: '2px solid #D4AF37', borderTopColor: 'transparent', borderRadius: '50%' }}
                  />
                  <p className="text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#f5f0e8' }}>Calibrating pose model...</p>
                </div>
              </div>
            )}

            {phase === "tracking" && (
              <div
                className="absolute top-3 right-3 px-3 py-1.5"
                style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '2px' }}
              >
                <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#D4AF37' }}>{timeLeft}s</span>
              </div>
            )}
          </div>

          {/* Real-time metrics */}
          {metrics && phase === "tracking" && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div
                className="p-3 text-center"
                style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
              >
                <p
                  className="text-lg font-bold"
                  style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#D4AF37' }}
                >
                  {Math.round(metrics.smoothness * 100)}%
                </p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>Smoothness</p>
              </div>
              <div
                className="p-3 text-center"
                style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
              >
                <p
                  className="text-lg font-bold"
                  style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#15999e' }}
                >
                  {Math.round(metrics.symmetry * 100)}%
                </p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>Symmetry</p>
              </div>
              <div
                className="p-3 text-center"
                style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
              >
                <p
                  className="text-lg font-bold"
                  style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#FF6B6B' }}
                >
                  {Math.round(metrics.velocity * 100)}
                </p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>Velocity</p>
              </div>
            </div>
          )}

          {/* Joint angles */}
          {metrics && metrics.jointAngles.length > 0 && (
            <div
              className="p-4 mb-4"
              style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
            >
              <h3
                className="text-sm font-medium mb-2"
                style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
              >
                Joint Angles
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {metrics.jointAngles
                  .filter((a) => a.confidence > 0.5)
                  .map((angle) => (
                    <div key={angle.name} className="flex items-center justify-between">
                      <span className="text-xs" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>{angle.name}</span>
                      <span className="text-xs" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}>
                        {Math.round(angle.angle)}&deg;
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ROM tracking */}
          {metrics && Object.keys(metrics.rangeOfMotion).length > 0 && phase !== "calibrating" && (
            <div
              className="p-4 mb-4"
              style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
            >
              <h3
                className="text-sm font-medium mb-2"
                style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
              >
                Range of Motion (session)
              </h3>
              {Object.entries(metrics.rangeOfMotion).map(([name, rom]) => (
                <div key={name} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>{name}</span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
                      {Math.round(rom.min)}&deg; -- {Math.round(rom.max)}&deg; (range: {Math.round(rom.max - rom.min)}&deg;)
                    </span>
                  </div>
                  <div className="w-full h-1.5" style={{ background: '#1e1e1e', borderRadius: '1px' }}>
                    <div
                      className="h-1.5"
                      style={{
                        width: `${Math.min(100, ((rom.max - rom.min) / 180) * 100)}%`,
                        background: '#D4AF37',
                        borderRadius: '1px',
                        transition: 'all 150ms ease-out',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {phase === "results" && (
            <button
              onClick={handleSave}
              className="w-full py-3 active:scale-[0.98]"
              style={{
                background: '#D4AF37',
                color: '#0a0a0a',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                borderRadius: '2px',
                border: 'none',
                transition: 'all 150ms ease-out',
              }}
            >
              Save Movement Analysis
            </button>
          )}
        </>
      )}
    </div>
  );
}
