"use client";

import { useState, useEffect } from "react";
import type { AgentMemory } from "@/types";
import { fetchByCID } from "@/lib/storacha/client";
import { createDemoMemory } from "@/data/demo-data";

type PatientCard = {
  cid: string;
  memory: AgentMemory;
  recoveryScore: number;
  avgStrength: number;
  daysSinceActivity: number;
};

const CAREGIVER_CIDS_KEY = "rewire_caregiver_cids";

function getStoredCids(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CAREGIVER_CIDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setStoredCids(cids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAREGIVER_CIDS_KEY, JSON.stringify(cids));
}

function calcRecoveryScore(m: AgentMemory): number {
  if (m.assessments.length === 0) return 0;
  const recent = m.assessments.slice(-10);
  return Math.round(recent.reduce((s, a) => s + a.value, 0) / recent.length);
}

function calcAvgStrength(m: AgentMemory): number {
  if (m.graphState.nodes.length === 0) return 0;
  return Math.round(
    (m.graphState.nodes.reduce((s, n) => s + n.strength, 0) / m.graphState.nodes.length) * 100
  );
}

function calcDaysSinceActivity(m: AgentMemory): number {
  const all = [...m.assessments, ...m.exerciseLogs];
  if (all.length === 0) return 999;
  const latest = all.reduce((max, item) => {
    const t = new Date("timestamp" in item ? item.timestamp : "").getTime();
    return t > max ? t : max;
  }, 0);
  return Math.floor((Date.now() - latest) / 86400000);
}

export default function CaregiverView({ onBack }: { onBack: () => void }) {
  const [patients, setPatients] = useState<PatientCard[]>([]);
  const [cidInput, setCidInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load stored CIDs on mount
    const cids = getStoredCids();
    if (cids.length > 0) {
      cids.forEach((cid) => loadPatient(cid, true));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPatient(cid: string, silent = false) {
    if (!silent) setLoading(true);
    setError("");
    try {
      const memory = await fetchByCID<AgentMemory>(cid);
      const card: PatientCard = {
        cid,
        memory,
        recoveryScore: calcRecoveryScore(memory),
        avgStrength: calcAvgStrength(memory),
        daysSinceActivity: calcDaysSinceActivity(memory),
      };
      setPatients((prev) => {
        if (prev.some((p) => p.cid === cid)) return prev;
        const updated = [...prev, card];
        setStoredCids(updated.map((p) => p.cid));
        return updated;
      });
    } catch {
      if (!silent) setError("Could not fetch patient data from that CID.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  function addDemoPatient() {
    const demo = createDemoMemory();
    const card: PatientCard = {
      cid: "demo-" + crypto.randomUUID().slice(0, 8),
      memory: demo,
      recoveryScore: calcRecoveryScore(demo),
      avgStrength: calcAvgStrength(demo),
      daysSinceActivity: calcDaysSinceActivity(demo),
    };
    setPatients((prev) => [...prev, card]);
  }

  function removePatient(cid: string) {
    setPatients((prev) => {
      const updated = prev.filter((p) => p.cid !== cid);
      setStoredCids(updated.filter((p) => !p.cid.startsWith("demo-")).map((p) => p.cid));
      return updated;
    });
  }

  function getAttentionColor(p: PatientCard): string {
    if (p.recoveryScore < 40 || p.daysSinceActivity > 7) return "var(--coral)";
    if (p.recoveryScore < 70) return "var(--gold)";
    return "var(--teal-bright)";
  }

  const sorted = [...patients].sort((a, b) => a.recoveryScore - b.recoveryScore);
  const needsAttention = sorted.filter((p) => p.recoveryScore < 50 || p.daysSinceActivity > 5);

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm mb-4 min-h-[44px] flex items-center"
        style={{ background: "none", border: "none", color: "var(--gold)", fontFamily: "var(--font-display)", cursor: "pointer" }}
      >
        &larr; Back
      </button>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase" }}>
        Coordination
      </p>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px", marginTop: "4px", marginBottom: "16px" }}>
        Caregiver Dashboard
      </h2>

      {/* Add patient */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={cidInput}
          onChange={(e) => setCidInput(e.target.value)}
          placeholder="Enter patient CID"
          style={{
            flex: 1, padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "2px", color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: "12px",
          }}
        />
        <button
          onClick={() => { if (cidInput.trim()) { loadPatient(cidInput.trim()); setCidInput(""); } }}
          disabled={loading || !cidInput.trim()}
          style={{
            padding: "10px 16px", background: "var(--gold)", color: "#0a0a0a", border: "none", borderRadius: "2px",
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "13px", cursor: "pointer", opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "..." : "Add"}
        </button>
      </div>

      <button
        onClick={addDemoPatient}
        className="w-full mb-6"
        style={{
          padding: "10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "2px",
          color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "1px",
          textTransform: "uppercase" as const, cursor: "pointer",
        }}
      >
        + Add Demo Patient
      </button>

      {error && (
        <p className="mb-4" style={{ color: "var(--coral)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>{error}</p>
      )}

      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <div className="mb-6">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--coral)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            Needs Attention
          </p>
          {needsAttention.map((p) => (
            <div key={p.cid} className="mb-2 p-3 flex items-center gap-3" style={{ background: "var(--coral-dim)", border: "1px solid rgba(255,107,107,0.25)" }}>
              <span style={{ width: "8px", height: "8px", background: "var(--coral)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 600 }}>{p.memory.profile.name}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)" }}>
                  {p.daysSinceActivity > 5 ? `${p.daysSinceActivity}d inactive` : `Score: ${p.recoveryScore}`}
                </p>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 700, color: "var(--coral)" }}>
                {p.recoveryScore}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* All patients */}
      {patients.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No patients added yet.</p>
          <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>Add a patient by CID or use demo mode.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            All Patients ({patients.length})
          </p>
          {sorted.map((p) => (
            <div key={p.cid} className="p-4" style={{ background: "var(--surface)", border: `1px solid ${getAttentionColor(p) === 'var(--coral)' ? 'rgba(255,107,107,0.25)' : 'var(--border)'}` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600 }}>{p.memory.profile.name}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {p.memory.profile.condition}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700,
                    color: getAttentionColor(p),
                  }}>
                    {p.recoveryScore}
                  </span>
                  <button
                    onClick={() => removePatient(p.cid)}
                    aria-label="Remove patient"
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "16px", padding: "4px" }}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2" style={{ fontFamily: "var(--font-mono)" }}>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{p.memory.assessments.length}</p>
                  <p style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Assess</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{p.memory.exerciseLogs.length}</p>
                  <p style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Exercise</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{p.avgStrength}%</p>
                  <p style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Network</p>
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: p.daysSinceActivity > 5 ? "var(--coral)" : "var(--text-primary)" }}>
                    {p.daysSinceActivity === 999 ? "—" : `${p.daysSinceActivity}d`}
                  </p>
                  <p style={{ fontSize: "8px", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Last Active</p>
                </div>
              </div>
              {/* Mini CID */}
              <p className="mt-3 truncate" style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)" }}>
                {p.cid}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
