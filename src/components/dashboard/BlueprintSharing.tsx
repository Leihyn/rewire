"use client";

import { useState, useCallback } from "react";
import { useReWire } from "../ClientApp";
import { uploadJSON, fetchByCID } from "@/lib/storacha/client";
import type {
  AgentMemory,
  BrainNode,
  BrainEdge,
  ExerciseParams,
  AssessmentRecord,
} from "@/types";

// === Blueprint Type ===

type RecoveryBlueprint = {
  version: 1;
  condition: string;
  goals: string[];
  exerciseParams: Record<string, ExerciseParams>;
  graphSnapshot: { nodes: BrainNode[]; edges: BrainEdge[] };
  assessmentSummary: { type: string; avgScore: number; count: number }[];
  createdAt: string;
  totalDays: number;
};

// === Design Tokens (inline) ===

const T = {
  bg: "#0a0a0a",
  surface: "#141414",
  elevated: "#1e1e1e",
  gold: "#D4AF37",
  coral: "#FF6B6B",
  teal: "#15999e",
  text: "#f5f0e8",
  secondary: "#a09888",
  muted: "#5a5248",
  border: "rgba(212,175,55,0.12)",
  radius: 2,
  fontHeading: "'Space Grotesk', sans-serif",
  fontBody: "'Outfit', sans-serif",
  fontMono: "'Space Mono', monospace",
} as const;

// === State Machine ===

type ExportState =
  | { phase: "idle" }
  | { phase: "exporting" }
  | { phase: "exported"; cid: string }
  | { phase: "error"; message: string };

type ImportState =
  | { phase: "idle" }
  | { phase: "importing" }
  | { phase: "preview"; blueprint: RecoveryBlueprint; cid: string }
  | { phase: "applied" }
  | { phase: "error"; message: string };

// === Helpers ===

function buildBlueprint(memory: AgentMemory): RecoveryBlueprint {
  const assessmentMap = new Map<string, { total: number; count: number }>();
  for (const a of memory.assessments) {
    const existing = assessmentMap.get(a.type);
    if (existing) {
      existing.total += a.value;
      existing.count += 1;
    } else {
      assessmentMap.set(a.type, { total: a.value, count: 1 });
    }
  }

  const assessmentSummary = Array.from(assessmentMap.entries()).map(
    ([type, { total, count }]) => ({
      type,
      avgScore: Math.round((total / count) * 10) / 10,
      count,
    })
  );

  const onsetDate = new Date(memory.profile.onsetDate);
  const totalDays = Math.max(
    1,
    Math.round((Date.now() - onsetDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    version: 1,
    condition: memory.profile.condition,
    goals: [...memory.profile.goals],
    exerciseParams: { ...memory.exerciseParams },
    graphSnapshot: {
      nodes: memory.graphState.nodes.map((n) => ({ ...n })),
      edges: memory.graphState.edges.map((e) => ({ ...e })),
    },
    assessmentSummary,
    createdAt: new Date().toISOString(),
    totalDays,
  };
}

function validateBlueprint(data: unknown): data is RecoveryBlueprint {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === 1 &&
    typeof d.condition === "string" &&
    Array.isArray(d.goals) &&
    typeof d.exerciseParams === "object" &&
    d.exerciseParams !== null &&
    typeof d.graphSnapshot === "object" &&
    d.graphSnapshot !== null &&
    Array.isArray(d.assessmentSummary) &&
    typeof d.createdAt === "string" &&
    typeof d.totalDays === "number"
  );
}

function applyBlueprint(
  memory: AgentMemory,
  blueprint: RecoveryBlueprint
): AgentMemory {
  // Merge exercise params (blueprint values as starting template, don't overwrite existing)
  const mergedParams = { ...blueprint.exerciseParams };
  for (const [key, value] of Object.entries(memory.exerciseParams)) {
    mergedParams[key] = value; // keep patient's own progress
  }

  // Merge goals: union of existing + blueprint goals
  const goalSet = new Set([...memory.profile.goals, ...blueprint.goals]);

  return {
    ...memory,
    profile: {
      ...memory.profile,
      goals: Array.from(goalSet),
    },
    exerciseParams: mergedParams,
    graphState: {
      nodes: blueprint.graphSnapshot.nodes,
      edges: blueprint.graphSnapshot.edges,
    },
  };
}

// === Styles ===

const sectionLabel: React.CSSProperties = {
  fontFamily: T.fontMono,
  fontSize: 9,
  textTransform: "uppercase",
  letterSpacing: 2,
  color: T.muted,
  marginBottom: 12,
};

const card: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  padding: 20,
};

const primaryBtn: React.CSSProperties = {
  background: T.gold,
  color: T.bg,
  border: "none",
  borderRadius: T.radius,
  padding: "10px 20px",
  fontFamily: T.fontBody,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: 0.5,
};

const secondaryBtn: React.CSSProperties = {
  background: "transparent",
  color: T.secondary,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  padding: "10px 20px",
  fontFamily: T.fontBody,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};

const disabledBtn: React.CSSProperties = {
  ...primaryBtn,
  opacity: 0.4,
  cursor: "not-allowed",
};

const inputStyle: React.CSSProperties = {
  background: T.elevated,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  color: T.text,
  fontFamily: T.fontMono,
  fontSize: 12,
  padding: "10px 14px",
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

const cidDisplay: React.CSSProperties = {
  background: T.elevated,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  padding: "10px 14px",
  fontFamily: T.fontMono,
  fontSize: 11,
  color: T.gold,
  wordBreak: "break-all",
  userSelect: "all",
};

const tagStyle: React.CSSProperties = {
  display: "inline-block",
  background: T.elevated,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  padding: "3px 8px",
  fontFamily: T.fontMono,
  fontSize: 10,
  color: T.secondary,
  marginRight: 6,
  marginBottom: 4,
};

const statRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
  borderBottom: `1px solid ${T.border}`,
};

const statLabel: React.CSSProperties = {
  fontFamily: T.fontMono,
  fontSize: 10,
  color: T.muted,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const statValue: React.CSSProperties = {
  fontFamily: T.fontBody,
  fontSize: 13,
  color: T.text,
};

// === Component ===

export default function BlueprintSharing({ onBack }: { onBack?: () => void }) {
  const { memory, updateMemory, storachaConnected } = useReWire();

  const [exportState, setExportState] = useState<ExportState>({ phase: "idle" });
  const [importState, setImportState] = useState<ImportState>({ phase: "idle" });
  const [cidInput, setCidInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleExport = useCallback(async () => {
    if (!memory) return;
    setExportState({ phase: "exporting" });
    try {
      const blueprint = buildBlueprint(memory);
      const cid = await uploadJSON(blueprint);
      setExportState({ phase: "exported", cid });
    } catch (err) {
      setExportState({
        phase: "error",
        message: err instanceof Error ? err.message : "Export failed",
      });
    }
  }, [memory]);

  const handleCopyCid = useCallback(async () => {
    if (exportState.phase !== "exported") return;
    try {
      await navigator.clipboard.writeText(exportState.cid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: selection is already enabled via userSelect: all
    }
  }, [exportState]);

  const handleImport = useCallback(async () => {
    const trimmed = cidInput.trim();
    if (!trimmed) return;
    setImportState({ phase: "importing" });
    try {
      const data = await fetchByCID<unknown>(trimmed);
      if (!validateBlueprint(data)) {
        setImportState({ phase: "error", message: "Invalid blueprint format" });
        return;
      }
      setImportState({ phase: "preview", blueprint: data, cid: trimmed });
    } catch (err) {
      setImportState({
        phase: "error",
        message: err instanceof Error ? err.message : "Import failed",
      });
    }
  }, [cidInput]);

  const handleApply = useCallback(() => {
    if (importState.phase !== "preview" || !memory) return;
    const updated = applyBlueprint(memory, importState.blueprint);
    updateMemory(updated);
    setImportState({ phase: "applied" });
  }, [importState, memory, updateMemory]);

  const handleResetExport = useCallback(() => {
    setExportState({ phase: "idle" });
    setCopied(false);
  }, []);

  const handleResetImport = useCallback(() => {
    setImportState({ phase: "idle" });
    setCidInput("");
  }, []);

  if (!memory) return null;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Back + Header */}
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm mb-4 min-h-[44px] flex items-center"
            style={{ background: "none", border: "none", color: "var(--gold)", fontFamily: "var(--font-display)", cursor: "pointer" }}
          >
            &larr; Back
          </button>
        )}
      </div>
      <div>
        <h2
          style={{
            fontFamily: T.fontHeading,
            fontSize: 18,
            fontWeight: 600,
            color: T.text,
            margin: 0,
            marginBottom: 6,
          }}
        >
          Blueprint Sharing
        </h2>
        <p
          style={{
            fontFamily: T.fontBody,
            fontSize: 13,
            color: T.secondary,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Export your recovery journey as a shareable blueprint, or import one
          from another patient as a starting template.
        </p>
      </div>

      {/* Export Section */}
      <div style={card}>
        <div style={sectionLabel}>Export Blueprint</div>

        {!storachaConnected && (
          <p
            style={{
              fontFamily: T.fontBody,
              fontSize: 12,
              color: T.coral,
              margin: "0 0 12px 0",
            }}
          >
            Storacha connection required to export. Connect in settings first.
          </p>
        )}

        {exportState.phase === "idle" && (
          <div>
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.secondary,
                margin: "0 0 14px 0",
                lineHeight: 1.5,
              }}
            >
              Creates a shareable snapshot of your exercise parameters,
              difficulty progression, brain graph, and goals. Personal
              information (name, ID) is never included.
            </p>
            <button
              style={storachaConnected ? primaryBtn : disabledBtn}
              disabled={!storachaConnected}
              onClick={handleExport}
            >
              Export Blueprint
            </button>
          </div>
        )}

        {exportState.phase === "exporting" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                border: `2px solid ${T.gold}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.secondary,
              }}
            >
              Uploading blueprint to Storacha...
            </span>
          </div>
        )}

        {exportState.phase === "exported" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.teal,
                margin: 0,
              }}
            >
              Blueprint exported successfully. Share this CID:
            </p>
            <div style={cidDisplay}>{exportState.cid}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={primaryBtn} onClick={handleCopyCid}>
                {copied ? "Copied" : "Copy CID"}
              </button>
              <button style={secondaryBtn} onClick={handleResetExport}>
                Done
              </button>
            </div>
          </div>
        )}

        {exportState.phase === "error" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.coral,
                margin: 0,
              }}
            >
              {exportState.message}
            </p>
            <button style={secondaryBtn} onClick={handleResetExport}>
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Import Section */}
      <div style={card}>
        <div style={sectionLabel}>Import Blueprint</div>

        {importState.phase === "idle" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.secondary,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Enter a CID shared by another patient to preview and apply their
              recovery blueprint as a starting template. Your personal profile
              will not be overwritten.
            </p>
            <input
              style={inputStyle}
              placeholder="Enter CID..."
              value={cidInput}
              onChange={(e) => setCidInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleImport();
              }}
            />
            <div>
              <button
                style={cidInput.trim() ? primaryBtn : disabledBtn}
                disabled={!cidInput.trim()}
                onClick={handleImport}
              >
                Fetch Blueprint
              </button>
            </div>
          </div>
        )}

        {importState.phase === "importing" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                border: `2px solid ${T.teal}`,
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.secondary,
              }}
            >
              Fetching blueprint from IPFS...
            </span>
          </div>
        )}

        {importState.phase === "preview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p
              style={{
                fontFamily: T.fontMono,
                fontSize: 10,
                color: T.teal,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Blueprint Preview
            </p>

            {/* Stats */}
            <div>
              <div style={statRow}>
                <span style={statLabel}>Condition</span>
                <span style={statValue}>{importState.blueprint.condition}</span>
              </div>
              <div style={statRow}>
                <span style={statLabel}>Journey Duration</span>
                <span style={statValue}>
                  {importState.blueprint.totalDays} days
                </span>
              </div>
              <div style={statRow}>
                <span style={statLabel}>Exercises</span>
                <span style={statValue}>
                  {Object.keys(importState.blueprint.exerciseParams).length}{" "}
                  configured
                </span>
              </div>
              <div style={statRow}>
                <span style={statLabel}>Brain Nodes</span>
                <span style={statValue}>
                  {importState.blueprint.graphSnapshot.nodes.length}
                </span>
              </div>
              <div style={statRow}>
                <span style={statLabel}>Assessments</span>
                <span style={statValue}>
                  {importState.blueprint.assessmentSummary.length} types tracked
                </span>
              </div>
            </div>

            {/* Goals */}
            {importState.blueprint.goals.length > 0 && (
              <div>
                <div style={{ ...sectionLabel, marginBottom: 8 }}>Goals</div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {importState.blueprint.goals.map((g, i) => (
                    <span key={i} style={tagStyle}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assessment Summary */}
            {importState.blueprint.assessmentSummary.length > 0 && (
              <div>
                <div style={{ ...sectionLabel, marginBottom: 8 }}>
                  Assessment Averages
                </div>
                {importState.blueprint.assessmentSummary.map((a, i) => (
                  <div key={i} style={statRow}>
                    <span style={statLabel}>{a.type}</span>
                    <span style={statValue}>
                      {a.avgScore} avg ({a.count} recorded)
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* CID reference */}
            <div
              style={{
                fontFamily: T.fontMono,
                fontSize: 10,
                color: T.muted,
                wordBreak: "break-all",
              }}
            >
              CID: {importState.cid}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button style={primaryBtn} onClick={handleApply}>
                Apply Blueprint
              </button>
              <button style={secondaryBtn} onClick={handleResetImport}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {importState.phase === "applied" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.teal,
                margin: 0,
              }}
            >
              Blueprint applied successfully. Exercise parameters and goals have
              been merged into your profile. Your personal information was not
              changed.
            </p>
            <button style={secondaryBtn} onClick={handleResetImport}>
              Done
            </button>
          </div>
        )}

        {importState.phase === "error" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p
              style={{
                fontFamily: T.fontBody,
                fontSize: 12,
                color: T.coral,
                margin: 0,
              }}
            >
              {importState.message}
            </p>
            <button style={secondaryBtn} onClick={handleResetImport}>
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Spinner keyframes — injected once */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
