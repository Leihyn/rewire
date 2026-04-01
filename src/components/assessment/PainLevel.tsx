"use client";

import { useState } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentRecord } from "@/types";

const PAIN_COLORS = [
  "#15999e", "#15999e", "#22a87a", "#78a838",
  "#D4AF37", "#D4AF37", "#d48c37", "#d46d37",
  "#FF6B6B", "#FF6B6B", "#e04545",
];

export default function PainLevel({ onBack }: { onBack: () => void }) {
  const { addAssessment } = useReWire();
  const [level, setLevel] = useState(3);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Pain is inverse: 0 pain = 100 score, 10 pain = 0 score
    const record: AssessmentRecord = {
      id: crypto.randomUUID(),
      type: "pain",
      timestamp: new Date().toISOString(),
      value: 100 - level * 10,
      raw: { painLevel: level },
    };
    addAssessment(record);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="mb-4 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="14" stroke="#FF6B6B" strokeWidth="2"/>
            <path d="M20 6 L20 20" stroke="#FF6B6B" strokeWidth="2"/>
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Pain Level Recorded
        </h3>
        <p className="text-sm mb-6" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
          Level: {level}/10
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
        Pain Level
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        Rate your current pain intensity (0 = no pain, 10 = worst)
      </p>

      <div className="text-center mb-8">
        <span
          className="text-6xl font-bold"
          style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}
        >
          {level}
        </span>
        <p className="text-sm mt-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>
          {level === 0 ? "No pain" : level <= 3 ? "Mild" : level <= 6 ? "Moderate" : "Severe"}
        </p>
      </div>

      <div className="flex gap-1 mb-8">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => setLevel(i)}
            className="flex-1 h-12"
            style={{
              background: PAIN_COLORS[i],
              borderRadius: '2px',
              border: 'none',
              opacity: i === level ? 1 : 0.4,
              transform: i === level ? 'scale(1.1)' : 'scale(1)',
              boxShadow: i === level ? '0 0 0 2px #f5f0e8' : 'none',
              transition: 'all 150ms ease-out',
            }}
          >
            <span className="text-xs font-bold" style={{ fontFamily: 'Space Mono, monospace', color: '#0a0a0a' }}>{i}</span>
          </button>
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
