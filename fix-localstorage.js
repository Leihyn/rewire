// Node 25+ has a broken localStorage global that crashes Next.js SSR.
// This preload script patches it with an in-memory implementation.
if (typeof globalThis.localStorage !== 'undefined' && typeof document === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem(key) { return store.get(key) ?? null; },
    setItem(key, value) { store.set(key, String(value)); },
    removeItem(key) { store.delete(key); },
    clear() { store.clear(); },
    get length() { return store.size; },
    key(index) { return [...store.keys()][index] ?? null; },
  };
}
