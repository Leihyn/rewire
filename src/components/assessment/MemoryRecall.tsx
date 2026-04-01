"use client";

import { useState, useEffect, useCallback } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentRecord } from "@/types";

const COLORS = [
  { name: "Red", bg: "#e04545", active: "#FF6B6B" },
  { name: "Blue", bg: "#2563eb", active: "#60a5fa" },
  { name: "Green", bg: "#15999e", active: "#22c4ca" },
  { name: "Yellow", bg: "#D4AF37", active: "#e0c35a" },
];

type Phase = "start" | "showing" | "input" | "feedback" | "done" | "saved";

export default function MemoryRecall({ onBack }: { onBack: () => void }) {
  const { addAssessment } = useReWire();
  const [phase, setPhase] = useState<Phase>("start");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [showingIdx, setShowingIdx] = useState(-1);
  const [level, setLevel] = useState(3);
  const [maxLevel, setMaxLevel] = useState(0);
  const [correct, setCorrect] = useState(true);

  const generateSequence = useCallback((len: number) => {
    return Array.from({ length: len }, () => Math.floor(Math.random() * 4));
  }, []);

  const startRound = useCallback(() => {
    const seq = generateSequence(level);
    setSequence(seq);
    setPlayerInput([]);
    setPhase("showing");
    setShowingIdx(-1);

    // Show sequence one by one
    seq.forEach((_, i) => {
      setTimeout(() => setShowingIdx(i), (i + 1) * 600);
    });
    setTimeout(() => {
      setShowingIdx(-1);
      setPhase("input");
    }, (seq.length + 1) * 600);
  }, [level, generateSequence]);

  useEffect(() => {
    if (phase === "start") return;
  }, [phase]);

  function handleColorTap(colorIdx: number) {
    if (phase !== "input") return;
    const newInput = [...playerInput, colorIdx];
    setPlayerInput(newInput);

    const pos = newInput.length - 1;
    if (newInput[pos] !== sequence[pos]) {
      // Wrong
      setCorrect(false);
      setPhase("feedback");
      return;
    }
    if (newInput.length === sequence.length) {
      // Completed correctly
      setCorrect(true);
      setMaxLevel(Math.max(maxLevel, level));
      setPhase("feedback");
    }
  }

  function handleNext() {
    if (correct) {
      setLevel(level + 1);
    }
    if (!correct || level >= 9) {
      setPhase("done");
    } else {
      startRound();
    }
  }

  function handleSave() {
    // Normalize: 3 = baseline (0), 9 = max (100)
    const score = Math.round(((maxLevel - 2) / 7) * 100);
    const record: AssessmentRecord = {
      id: crypto.randomUUID(),
      type: "memory",
      timestamp: new Date().toISOString(),
      value: Math.max(0, Math.min(100, score)),
      raw: { maxSequenceLength: maxLevel, finalLevel: level },
    };
    addAssessment(record);
    setPhase("saved");
  }

  if (phase === "saved") {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="mb-4 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <polygon points="20,4 36,20 20,36 4,20" stroke="#D4AF37" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Memory Recall Recorded
        </h3>
        <p className="text-sm mb-6" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
          Max sequence: {maxLevel}
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
    return (
      <div className="animate-fade-in">
        <button
          onClick={onBack}
          className="text-sm mb-4 min-h-[44px] flex items-center"
          style={{ background: 'none', border: 'none', color: '#D4AF37', fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', transition: 'color 150ms ease-out' }}
        >
          &larr; Back
        </button>
        <div className="text-center py-8">
          <h2
            className="text-xl font-bold mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
          >
            Memory Test Complete
          </h2>
          <div
            className="p-6 mb-6"
            style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
          >
            <p
              className="text-5xl font-bold mb-2"
              style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#D4AF37' }}
            >
              {maxLevel}
            </p>
            <p className="text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
              Maximum sequence length recalled
            </p>
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
        Memory Recall
      </h2>
      <p className="text-sm mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        {phase === "start" && "Remember and repeat the color sequence"}
        {phase === "showing" && `Watch the sequence (${level} colors)...`}
        {phase === "input" && `Repeat the sequence (${playerInput.length}/${sequence.length})`}
        {phase === "feedback" && (correct ? "Correct! Increasing difficulty..." : `Sequence ended at level ${level}`)}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => handleColorTap(i)}
            disabled={phase !== "input"}
            className="aspect-square"
            style={{
              background: showingIdx >= 0 && sequence[showingIdx] === i
                ? color.active
                : color.bg,
              opacity: showingIdx >= 0 && sequence[showingIdx] === i
                ? 1
                : phase === "input"
                ? 0.7
                : 0.3,
              borderRadius: '2px',
              border: 'none',
              transform: showingIdx >= 0 && sequence[showingIdx] === i ? 'scale(1.05)' : 'scale(1)',
              boxShadow: showingIdx >= 0 && sequence[showingIdx] === i ? '0 0 0 4px rgba(255,255,255,0.2)' : 'none',
              transition: 'all 150ms ease-out',
            }}
          />
        ))}
      </div>

      {phase === "start" && (
        <button
          onClick={() => startRound()}
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
          Start Test
        </button>
      )}

      {phase === "feedback" && (
        <button
          onClick={handleNext}
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
          {correct ? "Next Level" : "See Results"}
        </button>
      )}
    </div>
  );
}
