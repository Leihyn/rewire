"use client";

import { useState } from "react";
import { useReWire } from "../ClientApp";
import type { AssessmentType } from "@/types";
import { ASSESSMENT_LABELS } from "@/types";
import GripStrength from "./GripStrength";
import PainLevel from "./PainLevel";
import ReactionTest from "./ReactionTest";
import MemoryRecall from "./MemoryRecall";
import TremorDetector from "./TremorDetector";
import RangeOfMotion from "./RangeOfMotion";
import PoseAssessment from "./PoseAssessment";

type AssessmentKey = AssessmentType | "pose";

const ASSESSMENTS: { type: AssessmentKey; icon: React.ReactNode; desc: string; label: string }[] = [
  {
    type: "pose",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="4" r="2.5" stroke="#D4AF37" strokeWidth="1.5"/><line x1="10" y1="6.5" x2="10" y2="13" stroke="#D4AF37" strokeWidth="1.5"/><line x1="5" y1="9" x2="15" y2="9" stroke="#D4AF37" strokeWidth="1.5"/><line x1="10" y1="13" x2="6" y2="19" stroke="#D4AF37" strokeWidth="1.5"/><line x1="10" y1="13" x2="14" y2="19" stroke="#D4AF37" strokeWidth="1.5"/></svg>,
    desc: "Camera-based movement tracking (AI)",
    label: "Movement Tracking",
  },
  {
    type: "grip",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="6" y="3" width="8" height="14" rx="1" stroke="#D4AF37" strokeWidth="1.5"/><line x1="8" y1="7" x2="12" y2="7" stroke="#D4AF37" strokeWidth="1"/><line x1="8" y1="10" x2="12" y2="10" stroke="#D4AF37" strokeWidth="1"/></svg>,
    desc: "Rate your grip strength",
    label: ASSESSMENT_LABELS.grip,
  },
  {
    type: "pain",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#FF6B6B" strokeWidth="1.5"/><path d="M10 3 L10 10" stroke="#FF6B6B" strokeWidth="1.5"/></svg>,
    desc: "Current pain level",
    label: ASSESSMENT_LABELS.pain,
  },
  {
    type: "rom",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10 L17 10" stroke="#15999e" strokeWidth="1.5"/><path d="M14 7 L17 10 L14 13" stroke="#15999e" strokeWidth="1.5"/><path d="M6 7 L3 10 L6 13" stroke="#15999e" strokeWidth="1.5"/></svg>,
    desc: "Joint range of motion",
    label: ASSESSMENT_LABELS.rom,
  },
  {
    type: "reaction",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" stroke="#D4AF37" strokeWidth="1.5" fill="none"/></svg>,
    desc: "Tap reaction speed",
    label: ASSESSMENT_LABELS.reaction,
  },
  {
    type: "memory",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,2 18,10 10,18 2,10" stroke="#D4AF37" strokeWidth="1.5" fill="none"/></svg>,
    desc: "Sequence recall test",
    label: ASSESSMENT_LABELS.memory,
  },
  {
    type: "tremor",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10 Q5 4, 7 10 Q9 16, 11 10 Q13 4, 15 10 Q17 16, 18 10" stroke="#15999e" strokeWidth="1.5" fill="none"/></svg>,
    desc: "FFT tremor frequency analysis",
    label: ASSESSMENT_LABELS.tremor,
  },
];

export default function AssessmentHub() {
  const { memory } = useReWire();
  const [active, setActive] = useState<AssessmentKey | null>(null);

  if (!memory) return null;

  if (active) {
    const back = () => setActive(null);
    switch (active) {
      case "pose": return <PoseAssessment onBack={back} />;
      case "grip": return <GripStrength onBack={back} />;
      case "pain": return <PainLevel onBack={back} />;
      case "rom": return <RangeOfMotion onBack={back} />;
      case "reaction": return <ReactionTest onBack={back} />;
      case "memory": return <MemoryRecall onBack={back} />;
      case "tremor": return <TremorDetector onBack={back} />;
    }
  }

  // Get last assessment of each type
  const lastAssessments = new Map<AssessmentType, { value: number; timestamp: string }>();
  for (const a of memory.assessments) {
    const existing = lastAssessments.get(a.type);
    if (!existing || a.timestamp > existing.timestamp) {
      lastAssessments.set(a.type, { value: a.value, timestamp: a.timestamp });
    }
  }

  return (
    <div className="animate-fade-in">
      <h2
        className="text-xl font-bold mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
      >
        Assessments
      </h2>
      <p className="text-sm mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
        Track your neurological and motor function over time
      </p>

      <div className="space-y-3">
        {ASSESSMENTS.map(({ type, icon, desc, label }) => {
          const last = type !== "pose" ? lastAssessments.get(type as AssessmentType) : undefined;
          return (
            <button
              key={type}
              onClick={() => setActive(type)}
              className="w-full p-4 text-left"
              style={{
                background: type === "pose" ? 'rgba(212,175,55,0.05)' : '#141414',
                border: type === "pose" ? '1px solid rgba(212,175,55,0.2)' : '1px solid rgba(212,175,55,0.12)',
                borderRadius: '2px',
                transition: 'all 150ms ease-out',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-10 flex items-center justify-center">{icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#f5f0e8' }}>
                    {label}
                    {type === "pose" && (
                      <span
                        className="ml-2 px-1.5 py-0.5 inline-block"
                        style={{
                          fontSize: '10px',
                          background: 'rgba(212,175,55,0.15)',
                          color: '#D4AF37',
                          borderRadius: '2px',
                          fontFamily: 'Space Mono, monospace',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        AI
                      </span>
                    )}
                  </h3>
                  <p style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248', fontSize: '12px' }}>{desc}</p>
                </div>
                {last && (
                  <div className="text-right">
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontVariantNumeric: 'tabular-nums',
                        color: last.value >= 70 ? '#D4AF37' : last.value >= 40 ? '#FF6B6B' : '#5a5248',
                      }}
                    >
                      {last.value}
                    </span>
                    <p style={{ fontFamily: 'Space Mono, monospace', color: '#5a5248', fontSize: '10px' }}>
                      {new Date(last.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {!last && type !== "pose" && (
                  <span style={{ fontFamily: 'Space Mono, monospace', color: '#5a5248', fontSize: '12px' }}>Not tested</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
