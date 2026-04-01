"use client";

import { useState } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentRecord } from "@/types";

export default function GripStrength({ onBack }: { onBack: () => void }) {
  const { addAssessment } = useReWire();
  const [rating, setRating] = useState(3);
  const [saved, setSaved] = useState(false);

  const labels = [
    "No grip ability",
    "Minimal grip -- can hold light objects briefly",
    "Weak grip -- holds objects but drops under resistance",
    "Moderate grip -- functional for daily tasks",
    "Strong grip -- near-normal strength",
  ];

  function handleSave() {
    const record: AssessmentRecord = {
      id: crypto.randomUUID(),
      type: "grip",
      timestamp: new Date().toISOString(),
      value: rating * 20, // normalize 1-5 to 20-100
      raw: { rating },
    };
    addAssessment(record);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="mb-4 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="12" y="6" width="16" height="28" rx="2" stroke="#D4AF37" strokeWidth="2"/>
            <line x1="16" y1="14" x2="24" y2="14" stroke="#D4AF37" strokeWidth="1.5"/>
            <line x1="16" y1="20" x2="24" y2="20" stroke="#D4AF37" strokeWidth="1.5"/>
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Grip Strength Recorded
        </h3>
        <p className="text-sm mb-1" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
          Score: {rating * 20}/100
        </p>
        <p className="text-xs mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>
          {labels[rating - 1]}
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
        Grip Strength
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        Rate the grip strength in your affected hand
      </p>

      <div className="space-y-3 mb-8">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => setRating(level)}
            className="w-full p-4 text-left"
            style={{
              background: rating === level ? 'rgba(212,175,55,0.15)' : '#141414',
              border: rating === level ? '2px solid #D4AF37' : '2px solid rgba(212,175,55,0.12)',
              borderRadius: '2px',
              transition: 'all 150ms ease-out',
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-lg font-bold w-8 h-8 flex items-center justify-center"
                style={{
                  background: rating === level ? '#D4AF37' : '#1e1e1e',
                  color: rating === level ? '#0a0a0a' : '#a09888',
                  borderRadius: '2px',
                  fontFamily: 'Space Mono, monospace',
                }}
              >
                {level}
              </span>
              <span
                className="text-sm"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  color: rating === level ? '#f5f0e8' : '#a09888',
                }}
              >
                {labels[level - 1]}
              </span>
            </div>
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
