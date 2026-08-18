import { isServer } from './env';
import { listen, unlisten } from './media';

/**
 * The ratio reported on the server and during the hydration first paint. 1 is the CSS pixel baseline: the only value that cannot disagree between server and client HTML.
 */
export const SERVER_DPR = 1;

export const getServerDpr = (): number => SERVER_DPR;

let snapshot: number | null = null;
const listeners = new Set<() => void>();
let mql: MediaQueryList | null = null;

// A few embedders report 0 or leave devicePixelRatio undefined; 1 is the CSS pixel baseline.
const read = (): number => window.devicePixelRatio || 1;

/**
 * Session-cached ratio. A number snapshot is referentially stable by nature, so unlike the device store this needs no cached-object guard against the useSyncExternalStore loop.
 */
export function getDpr(): number {
  if (snapshot === null) snapshot = read();
  return snapshot;
}

// A resolution query matches one exact ratio, so the query always describes the cached snapshot. That is what makes a change event mean "the ratio moved".
function attach(): void {
  mql = window.matchMedia(`(resolution: ${getDpr()}dppx)`);
  listen(mql, onChange);
}

function detach(): void {
  if (!mql) return;
  unlisten(mql, onChange);
  mql = null;
}

function onChange(): void {
  const next = read();
  // Bail before touching the listener when the ratio did not actually move: the current query still describes it, and re-arming mid-dispatch would re-enter this handler.
  if (next === snapshot) return;
  snapshot = next;
  // The old query can never match again, so the listener moves onto the new ratio.
  detach();
  attach();
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  const isFirst = listeners.size === 0;
  // Registered before the re-sync below so a ratio that moved between render and subscription notifies the arriving subscriber too (the React 17 fallback reads the snapshot before subscribing).
  listeners.add(listener);
  if (!isServer && isFirst) {
    // The listener attaches lazily with the first subscriber and detaches with the last one, so apps that never call the hook pay nothing.
    getDpr();
    attach();
    // Re-sync: the ratio may have moved between the first read (render) and subscription (passive effect).
    onChange();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) detach();
  };
}

/** Test-only: clears the cached ratio and detaches any leaked listener. Not re-exported from the package entry. */
export function resetDprForTesting(): void {
  snapshot = null;
  listeners.clear();
  detach();
}
