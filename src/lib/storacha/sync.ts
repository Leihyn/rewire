import type { AgentMemory } from "@/types";
import { saveMemoryToStoracha } from "./agent-memory";
import { setCachedMemory } from "./agent-memory";

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let isSyncing = false;

type SyncCallback = (status: "syncing" | "synced" | "error", cid?: string) => void;

export function debouncedSync(
  memory: AgentMemory,
  onStatus: SyncCallback,
  delayMs = 2000
) {
  // Always save locally immediately
  setCachedMemory(memory);

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    if (isSyncing) return;
    isSyncing = true;
    onStatus("syncing");

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const cid = await saveMemoryToStoracha(memory);
        onStatus("synced", cid);
        isSyncing = false;
        return;
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1000 * attempts));
        }
      }
    }

    onStatus("error");
    isSyncing = false;
  }, delayMs);
}
