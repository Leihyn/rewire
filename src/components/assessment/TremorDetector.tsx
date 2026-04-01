"use client";

import { useState, useRef, useEffect } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentRecord } from "@/types";
import {
  analyzeTremor,
  type TremorSample,
  type TremorAnalysis,
} from "@/lib/sensors/tremor-analysis";

type Phase = "ready" | "recording" | "done" | "saved";

const CLASSIFICATION_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  none: { label: "No Tremor", color: "#D4AF37", desc: "Normal physiological baseline" },
  physiological: { label: "Physiological", color: "#D4AF37", desc: "Normal low-amplitude tremor, not pathological" },
  parkinsonian: { label: "Parkinsonian Pattern", color: "#D4AF37", desc: "4-6 Hz resting tremor pattern detected" },
  essential: { label: "Essential Pattern", color: "#FF6B6B", desc: "8-12 Hz action tremor pattern detected" },
  cerebellar: { label: "Cerebellar Pattern", color: "#FF6B6B", desc: "3-5 Hz intention tremor pattern detected" },
  unclassified: { label: "Unclassified", color: "#5a5248", desc: "Tremor detected, pattern unclear" },
};

export default function TremorDetector({ onBack }: { onBack: () => void }) {
  const { addAssessment } = useReWire();
  const [phase, setPhase] = useState<Phase>("ready");
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<TremorAnalysis | null>(null);
  const samplesRef = useRef<TremorSample[]>([]);
  const listenerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);

  const DURATION = 10;

  function startRecording() {
    samplesRef.current = [];
    setPhase("recording");
    setProgress(0);

    const startTime = Date.now();

    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc?.x != null && acc?.y != null && acc?.z != null) {
        samplesRef.current.push({
          x: acc.x,
          y: acc.y,
          z: acc.z,
          t: Date.now(),
        });
      }

      const elapsed = (Date.now() - startTime) / 1000;
      setProgress(Math.min(elapsed / DURATION, 1));

      if (elapsed >= DURATION) {
        window.removeEventListener("devicemotion", handler);
        listenerRef.current = null;
        runAnalysis();
      }
    };

    listenerRef.current = handler;
    window.addEventListener("devicemotion", handler);
  }

  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        window.removeEventListener("devicemotion", listenerRef.current);
      }
    };
  }, []);

  function runAnalysis() {
    const samples = samplesRef.current;
    const result = analyzeTremor(samples);
    setAnalysis(result);
    setPhase("done");
  }

  function handleSave() {
    if (!analysis) return;
    const record: AssessmentRecord = {
      id: crypto.randomUUID(),
      type: "tremor",
      timestamp: new Date().toISOString(),
      value: analysis.score,
      raw: {
        rms: analysis.rms,
        dominantFrequency: analysis.dominantFrequency,
        severity: analysis.severity,
        spectralEntropy: analysis.spectralEntropy,
        sampleRate: analysis.sampleRate,
        sampleCount: samplesRef.current.length,
        classification: ["none", "physiological", "parkinsonian", "essential", "cerebellar", "unclassified"].indexOf(analysis.classification),
      },
    };
    addAssessment(record);
    setPhase("saved");
  }

  async function requestPermission() {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      "requestPermission" in DeviceMotionEvent &&
      typeof (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission === "function"
    ) {
      const perm = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
      if (perm !== "granted") return false;
    }
    return true;
  }

  async function handleStart() {
    const granted = await requestPermission();
    if (!granted) return;
    startRecording();
  }

  if (phase === "saved") {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="mb-4 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M4 20 Q10 8, 14 20 Q18 32, 22 20 Q26 8, 30 20 Q34 32, 36 20" stroke="#15999e" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Tremor Analysis Saved
        </h3>
        <p className="text-sm mb-1" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
          Score: {analysis?.score}/100
        </p>
        <p className="text-xs mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>
          {analysis?.classification && CLASSIFICATION_LABELS[analysis.classification]?.label}
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

  const classInfo = analysis ? CLASSIFICATION_LABELS[analysis.classification] : null;

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm mb-4 min-h-[44px] flex items-center"
        style={{ background: 'none', border: 'none', color: '#D4AF37', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'color 150ms ease-out' }}
      >
        &larr; Back
      </button>
      <h2
        className="text-xl font-bold mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
      >
        Tremor Analysis
      </h2>
      <p className="text-sm mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        FFT-based frequency analysis of hand tremor ({DURATION}s recording)
      </p>

      {phase === "ready" && (
        <>
          <div
            className="p-6 mb-6"
            style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
          >
            <h3
              className="font-medium mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f0e8', fontSize: '14px' }}
            >
              How it works
            </h3>
            <ol className="text-sm space-y-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
              <li>1. Hold your phone in your affected hand, arm extended</li>
              <li>2. Accelerometer samples at ~60Hz for {DURATION} seconds</li>
              <li>3. Cooley-Tukey FFT computes power spectral density</li>
              <li>4. Frequency bands are analyzed for tremor classification:</li>
            </ol>
            <div className="mt-3 space-y-1">
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#5a5248' }}>Parkinsonian: 4-6 Hz (resting tremor)</p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#5a5248' }}>Essential: 8-12 Hz (action tremor)</p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#5a5248' }}>Cerebellar: 3-5 Hz (intention tremor)</p>
            </div>
          </div>
          <button
            onClick={handleStart}
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
            Start Recording
          </button>
          <button
            onClick={() => {
              // Generate synthetic Parkinsonian tremor (4.8Hz, moderate amplitude)
              // Tremor present on all axes so magnitude deviation captures it
              const samples: TremorSample[] = [];
              const sampleRate = 60;
              const duration = 10;
              for (let i = 0; i < sampleRate * duration; i++) {
                const t = i / sampleRate;
                const tremor = 2.5 * Math.sin(2 * Math.PI * 4.8 * t);
                const noise = (Math.random() - 0.5) * 0.3;
                samples.push({
                  x: tremor + noise,
                  y: tremor * 0.5 + noise + 9.8,
                  z: tremor * 0.3 + noise,
                  t: i * (1000 / sampleRate),
                });
              }
              samplesRef.current = samples;
              const result = analyzeTremor(samples);
              setAnalysis(result);
              setPhase("done");
            }}
            className="w-full py-3 mt-3 active:scale-[0.98]"
            style={{
              background: 'transparent',
              color: '#D4AF37',
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              letterSpacing: '1px',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '2px',
              transition: 'all 150ms ease-out',
              cursor: 'pointer',
              textTransform: 'uppercase' as const,
            }}
          >
            Simulate Parkinsonian Tremor (Desktop Demo)
          </button>
        </>
      )}

      {phase === "recording" && (
        <div className="text-center py-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1e1e1e" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45"
                fill="none" stroke="#D4AF37" strokeWidth="6"
                strokeDasharray={`${progress * 283} 283`}
                strokeLinecap="butt"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}
              >
                {Math.ceil(DURATION - progress * DURATION)}s
              </span>
            </div>
          </div>
          <p style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>Hold steady...</p>
          <p className="text-xs mt-2" style={{ fontFamily: 'Space Mono, monospace', color: '#5a5248' }}>
            Samples: {samplesRef.current.length}
          </p>
        </div>
      )}

      {phase === "done" && analysis && (
        <div className="space-y-4">
          {/* Classification */}
          <div
            className="p-6 text-center"
            style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
          >
            <p
              className="text-2xl font-bold"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: classInfo?.color }}
            >
              {classInfo?.label}
            </p>
            <p className="text-xs mt-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>{classInfo?.desc}</p>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-4 text-center"
              style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
            >
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#D4AF37' }}
              >
                {analysis.score}
              </p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>Stability Score</p>
            </div>
            <div
              className="p-4 text-center"
              style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
            >
              <p className="text-3xl font-bold" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}>
                {analysis.dominantFrequency}<span className="text-sm" style={{ color: '#5a5248' }}>Hz</span>
              </p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>Dominant Frequency</p>
            </div>
          </div>

          {/* Frequency bands */}
          <div
            className="p-4"
            style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
          >
            <h3
              className="text-sm font-medium mb-3"
              style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
            >
              Power Spectral Density
            </h3>
            {analysis.bands.map((band) => {
              const maxPower = Math.max(...analysis.bands.map((b) => b.power), 0.001);
              const pct = (band.power / maxPower) * 100;
              return (
                <div key={band.name} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
                      {band.name} ({band.minHz}-{band.maxHz}Hz)
                    </span>
                    <span style={{ fontFamily: 'Space Mono, monospace', color: '#5a5248' }}>
                      {band.peakFrequency > 0 ? `Peak: ${band.peakFrequency.toFixed(1)}Hz` : "--"}
                    </span>
                  </div>
                  <div className="w-full h-2" style={{ background: '#1e1e1e', borderRadius: '1px' }}>
                    <div
                      className="h-2"
                      style={{ width: `${Math.max(2, pct)}%`, background: '#D4AF37', borderRadius: '1px', transition: 'all 150ms ease-out' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical details */}
          <div
            className="p-4"
            style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
          >
            <h3
              className="text-sm font-medium mb-2"
              style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
            >
              Technical
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>RMS Deviation</span>
              <span className="text-right" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}>{analysis.rms} m/s2</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>Spectral Entropy</span>
              <span className="text-right" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}>{analysis.spectralEntropy}</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>Sample Rate</span>
              <span className="text-right" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}>{analysis.sampleRate} Hz</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>Severity</span>
              <span className="text-right" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}>{analysis.severity}/100</span>
            </div>
          </div>

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
            Save Analysis
          </button>
        </div>
      )}
    </div>
  );
}
