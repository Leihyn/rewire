"use client";

import { useState, useMemo } from "react";
import { useReWire } from "../ClientApp";
import { getRecommendations, getRecoveryScore } from "@/lib/agent/engine";
import type { AgentInsight } from "@/types";
import HowItWorks from "./HowItWorks";
import BlueprintSharing from "./BlueprintSharing";
import CaregiverView from "./CaregiverView";

const INSIGHT_STYLES: Record<AgentInsight["type"], { bg: string; border: string; accent: string }> = {
  encouragement: { bg: "var(--teal-dim)", border: "rgba(13,115,119,0.25)", accent: "var(--teal-bright)" },
  recommendation: { bg: "var(--gold-dim)", border: "var(--border-strong)", accent: "var(--gold)" },
  milestone: { bg: "var(--coral-dim)", border: "rgba(255,107,107,0.25)", accent: "var(--coral)" },
  warning: { bg: "var(--coral-dim)", border: "rgba(255,107,107,0.25)", accent: "var(--coral)" },
};

type SubView = "main" | "howItWorks" | "blueprints" | "caregiver";

export default function DashboardView() {
  const [subView, setSubView] = useState<SubView>("main");
  const { memory, setCurrentView, syncStatus, lastCID } = useReWire();

  const recommendations = useMemo(
    () => (memory ? getRecommendations(memory) : null),
    [memory]
  );

  const recoveryScore = useMemo(
    () => (memory ? getRecoveryScore(memory) : 0),
    [memory]
  );

  if (!memory) return null;

  if (subView === "howItWorks") return <HowItWorks onBack={() => setSubView("main")} />;
  if (subView === "blueprints") return <BlueprintSharing onBack={() => setSubView("main")} />;
  if (subView === "caregiver") return <CaregiverView onBack={() => setSubView("main")} />;

  const profile = memory.profile;
  const totalAssessments = memory.assessments.length;
  const totalExercises = memory.exerciseLogs.length;
  const recentAssessments = memory.assessments.slice(-5).reverse();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Patient greeting */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Recovery Journal
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', letterSpacing: '-0.5px', marginTop: '4px' }}>
          {profile.name.split(" ")[0]}
        </h2>
      </div>

      {/* Recovery Score */}
      <div className="text-center py-8 relative" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '200px', height: '200px', background: 'radial-gradient(circle, var(--gold-dim) 0%, transparent 70%)' }} />
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '3px', textTransform: 'uppercase', position: 'relative' }}>
          Recovery Score
        </p>
        <div className="relative mt-4 mb-4">
          <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--elevated)" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={recoveryScore >= 70 ? 'var(--gold)' : recoveryScore >= 40 ? 'var(--coral)' : 'var(--text-muted)'}
              strokeWidth="4"
              strokeDasharray={`${(recoveryScore / 100) * 264} 264`}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700 }}>
              {recoveryScore || "\u2014"}
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-8" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <div>
            <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '18px' }}>{totalAssessments}</p>
            <p style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '9px' }}>Assessments</p>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div>
            <p style={{ color: 'var(--coral)', fontWeight: 700, fontSize: '18px' }}>{totalExercises}</p>
            <p style={{ color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '9px' }}>Exercises</p>
          </div>
        </div>
      </div>

      {/* Network Resilience */}
      {recommendations?.networkAnalysis && memory.assessments.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '16px' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Network Resilience
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700,
              color: recommendations.networkAnalysis.resilience >= 0.7 ? 'var(--gold)' : recommendations.networkAnalysis.resilience >= 0.4 ? 'var(--coral)' : 'var(--text-muted)',
            }}>
              {Math.round(recommendations.networkAnalysis.resilience * 100)}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center" style={{ fontFamily: 'var(--font-mono)' }}>
            {[
              { val: `${Math.round(recommendations.networkAnalysis.connectivity * 100)}%`, label: "Connect" },
              { val: recommendations.networkAnalysis.avgPathLength === Infinity ? "\u2014" : recommendations.networkAnalysis.avgPathLength.toFixed(1), label: "Avg Path" },
              { val: String(recommendations.networkAnalysis.clusters.length), label: "Clusters" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</p>
                <p style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Insights */}
      {recommendations && recommendations.insights.length > 0 && (
        <div className="space-y-2">
          {recommendations.insights.map((insight) => {
            const s = INSIGHT_STYLES[insight.type];
            return (
              <div key={insight.id} className="p-3 flex gap-3" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <span style={{ width: '6px', height: '6px', background: s.accent, transform: 'rotate(45deg)', flexShrink: 0, marginTop: '6px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{insight.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCurrentView("assess")}
          className="text-left transition-all duration-150 active:scale-[0.97]"
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)', padding: '16px', cursor: 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--gold)' }}>
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>New Assessment</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Track your progress</p>
        </button>
        <button
          onClick={() => setCurrentView("exercises")}
          className="text-left transition-all duration-150 active:scale-[0.97]"
          style={{ background: 'var(--teal-dim)', border: '1px solid rgba(13,115,119,0.2)', padding: '16px', cursor: 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--teal-bright)' }}>
            <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>Begin Exercise</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Adapted for you</p>
        </button>
      </div>

      {/* Feature Links */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "How It Works", view: "howItWorks" as SubView, color: "var(--gold)" },
          { label: "Blueprints", view: "blueprints" as SubView, color: "var(--teal-bright)" },
          { label: "Caregiver", view: "caregiver" as SubView, color: "var(--coral)" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setSubView(item.view)}
            className="py-3 transition-all duration-150 active:scale-[0.97]"
            style={{
              background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer",
              fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "1px",
              textTransform: "uppercase" as const, color: item.color,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Recent Assessments */}
      {recentAssessments.length > 0 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Recent Activity
          </h3>
          <div className="space-y-1">
            {recentAssessments.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>{a.type}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {new Date(a.timestamp).toLocaleString()}
                  </p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700,
                  color: a.value >= 70 ? 'var(--gold)' : a.value >= 40 ? 'var(--coral)' : 'var(--text-muted)',
                }}>
                  {a.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storacha Status */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>Data Sovereignty</p>
          <p style={{ fontSize: '13px', marginTop: '2px' }}>
            {syncStatus === "synced" ? "Synced to Storacha" : syncStatus === "syncing" ? "Syncing..." : syncStatus === "error" ? "Sync error" : "Local only"}
          </p>
        </div>
        {lastCID && (
          <div className="text-right">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)' }} className="max-w-[120px] truncate">
              {lastCID}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
