import type { AgentMemory } from "@/types";
import { uploadJSON, fetchByCID } from "./client";

const CID_KEY = "rewire_last_cid";
const MEMORY_KEY = "rewire_agent_memory";

export function getLastCID(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CID_KEY);
}

export function setLastCID(cid: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CID_KEY, cid);
}

export function getCachedMemory(): AgentMemory | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedMemory(memory: AgentMemory) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch {
    // storage full
  }
}

export async function saveMemoryToStoracha(
  memory: AgentMemory
): Promise<string> {
  const updated: AgentMemory = {
    ...memory,
    meta: {
      ...memory.meta,
      lastSyncedAt: new Date().toISOString(),
    },
  };

  const cid = await uploadJSON(updated);

  updated.meta.lastCID = cid;
  setLastCID(cid);
  setCachedMemory(updated);

  return cid;
}

export async function loadMemoryFromStoracha(
  cid: string
): Promise<AgentMemory> {
  const memory = await fetchByCID<AgentMemory>(cid);
  setCachedMemory(memory);
  setLastCID(cid);
  return memory;
}

export async function loadLatestMemory(): Promise<AgentMemory | null> {
  // Try local cache first
  const cached = getCachedMemory();
  if (cached) return cached;

  // Try Storacha via last known CID
  const cid = getLastCID();
  if (cid) {
    try {
      return await loadMemoryFromStoracha(cid);
    } catch {
      return null;
    }
  }

  return null;
}

export function createDefaultMemory(
  profile: AgentMemory["profile"]
): AgentMemory {
  return {
    version: 1,
    profile,
    assessments: [],
    exerciseLogs: [],
    exerciseParams: {},
    graphState: { nodes: [], edges: [] },
    preferences: {
      preferredExerciseDuration: 15,
      voiceGuidance: false,
    },
    meta: {
      lastSyncedAt: new Date().toISOString(),
      lastCID: null,
      deviceId: crypto.randomUUID(),
    },
  };
}
