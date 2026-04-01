"use client";

import { useState, useRef, useCallback } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentRecord } from "@/types";

type Phase = "ready" | "waiting" | "go" | "done" | "saved";

export default function ReactionTest({ onBack }: { onBack: () => void }) {
  const { addAssessment } = useReWire();
  const [phase, setPhase] = useState<Phase>("ready");
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const startRound = useCallback(() => {
    setPhase("waiting");
    const delay = 2000 + Math.random() * 3000; // 2-5s random delay
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, delay);
  }, []);

  function handleTap() {
    if (phase === "ready") {
      startRound();
      return;
    }
    if (phase === "waiting") {
      // Tapped too early
      clearTimeout(timerRef.current);
      setPhase("ready");
      return;
    }
    if (phase === "go") {
      const elapsed = Math.round(performance.now() - startRef.current);
      setCurrentTime(elapsed);
      const newTimes = [...times, elapsed];
      setTimes(newTimes);

      if (newTimes.length >= 5) {
        setPhase("done");
      } else {
        // Brief pause then next round
        setTimeout(() => startRound(), 1000);
        setPhase("ready");
      }
    }
  }

  function handleSave() {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    // Normalize: 150ms = 100 (excellent), 500ms = 0 (poor)
    const score = Math.max(0, Math.min(100, Math.round(((500 - avg) / 350) * 100)));

    const record: AssessmentRecord = {
      id: crypto.randomUUID(),
      type: "reaction",
      timestamp: new Date().toISOString(),
      value: score,
      raw: { avgMs: avg, trials: times.length, bestMs: Math.min(...times), worstMs: Math.max(...times) },
    };
    addAssessment(record);
    setPhase("saved");
  }

  if (phase === "saved") {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="mb-4 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <polygon points="20,4 24,16 36,16 26,24 30,36 20,28 10,36 14,24 4,16 16,16" stroke="#D4AF37" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Reaction Time Recorded
        </h3>
        <p className="text-sm mb-6" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
          Average: {avg}ms
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

  if (phase === "done") {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
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
          className="text-xl font-bold mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Results
        </h2>
        <div
          className="p-6 mb-6 text-center"
          style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
        >
          <p
            className="text-4xl font-bold mb-1"
            style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}
          >
            {avg}ms
          </p>
          <p className="text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>Average reaction time</p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div>
              <p className="font-bold" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#D4AF37' }}>
                {Math.min(...times)}ms
              </p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>Best</p>
            </div>
            <div>
              <p className="font-bold" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#FF6B6B' }}>
                {Math.max(...times)}ms
              </p>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>Worst</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          {times.map((t, i) => (
            <div
              key={i}
              className="flex-1 p-2 text-center"
              style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
            >
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}>#{i + 1}</p>
              <p className="text-sm" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}>{t}ms</p>
            </div>
          ))}
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
          Save Assessment
        </button>
      </div>
    );
  }

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
        Reaction Time
      </h2>
      <p className="text-sm mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        Tap as fast as you can when the screen turns green ({times.length}/5)
      </p>

      <button
        onClick={handleTap}
        className="w-full aspect-square flex items-center justify-center text-xl font-bold"
        style={{
          background: phase === "ready" ? '#1e1e1e' : phase === "waiting" ? 'rgba(255,107,107,0.15)' : '#D4AF37',
          color: phase === "ready" ? '#a09888' : phase === "waiting" ? '#FF6B6B' : '#0a0a0a',
          borderRadius: '2px',
          border: phase === "ready" ? '1px solid rgba(212,175,55,0.12)' : phase === "waiting" ? '1px solid rgba(255,107,107,0.3)' : '1px solid #D4AF37',
          fontFamily: 'Space Grotesk, sans-serif',
          transition: 'all 150ms ease-out',
          transform: phase === "go" ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        {phase === "ready" && (times.length === 0 ? "Tap to Start" : `${currentTime}ms -- Tap for Next`)}
        {phase === "waiting" && "Wait..."}
        {phase === "go" && "TAP NOW!"}
      </button>

      {phase === "waiting" && (
        <p className="text-xs text-center mt-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#FF6B6B' }}>
          Tapping now counts as too early
        </p>
      )}
    </div>
  );
}
