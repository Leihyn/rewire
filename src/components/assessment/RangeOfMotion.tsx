"use client";

import { useState } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentRecord } from "@/types";

const JOINTS = [
  { id: "shoulder", label: "Shoulder", maxDeg: 180 },
  { id: "elbow", label: "Elbow", maxDeg: 150 },
  { id: "wrist", label: "Wrist", maxDeg: 80 },
  { id: "hip", label: "Hip", maxDeg: 120 },
  { id: "knee", label: "Knee", maxDeg: 135 },
  { id: "ankle", label: "Ankle", maxDeg: 50 },
];

export default function RangeOfMotion({ onBack }: { onBack: () => void }) {
  const { addAssessment } = useReWire();
  const [selectedJoint, setSelectedJoint] = useState(JOINTS[0]);
  const [degrees, setDegrees] = useState(45);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const pct = Math.round((degrees / selectedJoint.maxDeg) * 100);
    const record: AssessmentRecord = {
      id: crypto.randomUUID(),
      type: "rom",
      timestamp: new Date().toISOString(),
      value: Math.min(pct, 100),
      raw: { degrees, joint: JOINTS.indexOf(selectedJoint), maxDeg: selectedJoint.maxDeg },
      bodyPart: selectedJoint.id,
    };
    addAssessment(record);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="animate-fade-in text-center py-12">
        <div className="mb-4 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M6 20 L34 20" stroke="#15999e" strokeWidth="2"/>
            <path d="M28 14 L34 20 L28 26" stroke="#15999e" strokeWidth="2"/>
            <path d="M12 14 L6 20 L12 26" stroke="#15999e" strokeWidth="2"/>
          </svg>
        </div>
        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
        >
          Range of Motion Recorded
        </h3>
        <p className="text-sm mb-1" style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#a09888' }}>
          {selectedJoint.label}: {degrees}&deg; / {selectedJoint.maxDeg}&deg;
        </p>
        <p className="text-xs mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>
          {Math.round((degrees / selectedJoint.maxDeg) * 100)}% of normal range
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
        Range of Motion
      </h2>
      <p className="text-sm mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        Select joint and estimate your maximum comfortable range
      </p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {JOINTS.map((j) => (
          <button
            key={j.id}
            onClick={() => { setSelectedJoint(j); setDegrees(Math.min(degrees, j.maxDeg)); }}
            className="py-2.5 text-sm font-medium"
            style={{
              background: selectedJoint.id === j.id ? '#D4AF37' : '#141414',
              color: selectedJoint.id === j.id ? '#0a0a0a' : '#a09888',
              border: selectedJoint.id === j.id ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.12)',
              borderRadius: '2px',
              fontFamily: 'Space Grotesk, sans-serif',
              transition: 'all 150ms ease-out',
            }}
          >
            {j.label}
          </button>
        ))}
      </div>

      <div className="p-6 mb-6" style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}>
        <div className="text-center mb-4">
          <span
            className="text-5xl font-bold"
            style={{ fontFamily: 'Space Mono, monospace', fontVariantNumeric: 'tabular-nums', color: '#f5f0e8' }}
          >
            {degrees}&deg;
          </span>
          <p className="text-sm mt-1" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>
            of {selectedJoint.maxDeg}&deg; normal range
          </p>
        </div>
        <input
          type="range"
          min={0}
          max={selectedJoint.maxDeg}
          value={degrees}
          onChange={(e) => setDegrees(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: '#D4AF37' }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ fontFamily: 'Space Mono, monospace', color: '#5a5248' }}>
          <span>0&deg;</span>
          <span>{selectedJoint.maxDeg}&deg;</span>
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
        Save Assessment
      </button>
    </div>
  );
}
