import { create } from "@storacha/client";

let clientInstance: Awaited<ReturnType<typeof create>> | null = null;

export async function getStorachaClient() {
  if (clientInstance) return clientInstance;
  clientInstance = await create();
  return clientInstance;
}

/**
 * Login to Storacha. This sends a verification email.
 * The returned promise resolves only AFTER the user clicks
 * the confirmation link in their email.
 */
export async function loginToStoracha(email: string) {
  const client = await getStorachaClient();
  const account = await client.login(email as `${string}@${string}`);
  // Wait for the account to have an active plan (email verified)
  try {
    await account.plan.wait();
  } catch {
    // plan.wait may not exist on all versions, continue
  }
  return account;
}

export async function createSpace(name: string, account: unknown) {
  const client = await getStorachaClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const space = await client.createSpace(name, { account } as any);
  await client.setCurrentSpace(space.did());
  return space;
}

/**
 * Check if client already has spaces (returning user).
 * If so, set the first space as current.
 */
export async function tryRestoreSession(): Promise<boolean> {
  try {
    const client = await getStorachaClient();
    const spaces = client.spaces();
    if (spaces.length > 0) {
      await client.setCurrentSpace(spaces[0].did());
      return true;
    }
  } catch {
    // No existing session
  }
  return false;
}

export async function uploadJSON(data: unknown): Promise<string> {
  const client = await getStorachaClient();
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  const file = new File([blob], "agent-memory.json");
  const cid = await client.uploadFile(file);
  return cid.toString();
}

export async function fetchByCID<T>(cid: string): Promise<T> {
  // Try multiple gateways for reliability
  const gateways = [
    `https://${cid}.ipfs.w3s.link`,
    `https://w3s.link/ipfs/${cid}`,
  ];

  for (const url of gateways) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return res.json();
    } catch {
      continue;
    }
  }

  throw new Error(`Failed to fetch CID: ${cid}`);
}
