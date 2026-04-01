"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { AgentMemory, AppView, SyncStatus, AssessmentRecord, ExerciseLog } from "@/types";
import {
  loadLatestMemory,
  setCachedMemory,
} from "@/lib/storacha/agent-memory";
import { debouncedSync } from "@/lib/storacha/sync";
import { isOnboardingComplete } from "@/lib/storage";
import { processAssessmentHebbian } from "@/lib/agent/hebbian";
import { tryRestoreSession } from "@/lib/storacha/client";
import AppShell from "./layout/AppShell";
import OnboardingFlow from "./onboarding/OnboardingFlow";

type ReWireContextType = {
  memory: AgentMemory | null;
  setMemory: (memory: AgentMemory) => void;
  updateMemory: (partial: Partial<AgentMemory>) => void;
  addAssessment: (record: AssessmentRecord) => void;
  addExerciseLog: (log: ExerciseLog) => void;
  syncStatus: SyncStatus;
  lastCID: string | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  storachaConnected: boolean;
  setStorachaConnected: (v: boolean) => void;
};

const ReWireContext = createContext<ReWireContextType | null>(null);

export function useReWire() {
  const ctx = useContext(ReWireContext);
  if (!ctx) throw new Error("useReWire must be used within ClientApp");
  return ctx;
}

export default function ClientApp() {
  const [memory, setMemoryState] = useState<AgentMemory | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastCID, setLastCID] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [loading, setLoading] = useState(true);
  const [storachaConnected, setStorachaConnected] = useState(false);
  const memoryRef = useRef<AgentMemory | null>(null);

  useEffect(() => {
    async function init() {
      const existing = await loadLatestMemory();
      if (existing) {
        setMemoryState(existing);
        memoryRef.current = existing;
        setLastCID(existing.meta.lastCID);
      }
      // Try to restore Storacha session (returning user with existing spaces)
      try {
        const restored = await tryRestoreSession();
        if (restored) setStorachaConnected(true);
      } catch {
        // No session to restore, that's fine
      }
      setLoading(false);
    }
    init();
  }, []);

  const syncToStoracha = useCallback(
    (mem: AgentMemory) => {
      if (!storachaConnected) {
        setCachedMemory(mem);
        return;
      }
      debouncedSync(mem, (status, cid) => {
        setSyncStatus(status);
        if (cid) setLastCID(cid);
      });
    },
    [storachaConnected]
  );

  const setMemory = useCallback(
    (mem: AgentMemory) => {
      setMemoryState(mem);
      memoryRef.current = mem;
      syncToStoracha(mem);
    },
    [syncToStoracha]
  );

  const updateMemory = useCallback(
    (partial: Partial<AgentMemory>) => {
      const current = memoryRef.current;
      if (!current) return;
      const updated = { ...current, ...partial };
      setMemory(updated);
    },
    [setMemory]
  );

  const addAssessment = useCallback(
    (record: AssessmentRecord) => {
      const current = memoryRef.current;
      if (!current) return;
      // Add assessment then run through Hebbian model to update brain graph
      const withAssessment = {
        ...current,
        assessments: [...current.assessments, record],
      };
      const updated = processAssessmentHebbian(withAssessment, record);
      setMemory(updated);
    },
    [setMemory]
  );

  const addExerciseLog = useCallback(
    (log: ExerciseLog) => {
      const current = memoryRef.current;
      if (!current) return;
      const updated = {
        ...current,
        exerciseLogs: [...current.exerciseLogs, log],
      };
      setMemory(updated);
    },
    [setMemory]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading ReWire...</p>
        </div>
      </div>
    );
  }

  const needsOnboarding = !isOnboardingComplete() || !memory;

  return (
    <ReWireContext.Provider
      value={{
        memory,
        setMemory,
        updateMemory,
        addAssessment,
        addExerciseLog,
        syncStatus,
        lastCID,
        currentView,
        setCurrentView,
        storachaConnected,
        setStorachaConnected,
      }}
    >
      {needsOnboarding ? <OnboardingFlow /> : <AppShell />}
    </ReWireContext.Provider>
  );
}
