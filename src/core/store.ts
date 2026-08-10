import type { DeviceInfo } from '../types';
import { isServer } from './env';
import { getStaticInfo, SERVER_STATIC } from './static';

/**
 * Snapshot for the server render and the hydration first paint. Frozen module constant, because getServerSnapshot runs on every SSR/hydration render and a fresh object would make React loop.
 */
export const SERVER_SNAPSHOT: DeviceInfo = Object.freeze({
  ...SERVER_STATIC,
  isTouchPrimary: false,
  // Consistent with the desktop-first server default.
  orientation: 'landscape',
  isHydrated: false,
});

export const getServerSnapshot = (): DeviceInfo => SERVER_SNAPSHOT;

const TOUCH_QUERY = '(pointer: coarse)';
const PORTRAIT_QUERY = '(orientation: portrait)';

let snapshot: DeviceInfo | null = null;
const listeners = new Set<() => void>();
let mqls: MediaQueryList[] = [];

function compute(): DeviceInfo {
  return {
    ...getStaticInfo(),
    isTouchPrimary: window.matchMedia(TOUCH_QUERY).matches,
    orientation: window.matchMedia(PORTRAIT_QUERY).matches
      ? 'portrait'
      : 'landscape',
    isHydrated: true,
  };
}

/**
 * Cached-object snapshot: the reference is stable until a reactive field actually changes. This is the guard against the useSyncExternalStore fresh-object infinite-loop trap.
 */
export function getSnapshot(): DeviceInfo {
  if (snapshot === null) snapshot = compute();
  return snapshot;
}

function onChange(): void {
  const next = compute();
  if (
    snapshot === null ||
    next.isTouchPrimary !== snapshot.isTouchPrimary ||
    next.orientation !== snapshot.orientation
  ) {
    snapshot = next;
    listeners.forEach((l) => l());
  }
}

// addListener is the Safari < 14 path.
function listen(mql: MediaQueryList, cb: () => void): void {
  if (mql.addEventListener) mql.addEventListener('change', cb);
  else mql.addListener(cb);
}

function unlisten(mql: MediaQueryList, cb: () => void): void {
  if (mql.removeEventListener) mql.removeEventListener('change', cb);
  else mql.removeListener(cb);
}

export function subscribe(listener: () => void): () => void {
  const isFirst = listeners.size === 0;
  // The listener is registered BEFORE the lazy-attach re-sync below, so a re-sync that detects moved media state notifies the arriving subscriber too (the React 17 fallback reads the snapshot before subscribing and would otherwise stay stale until the next media change).
  listeners.add(listener);
  if (!isServer && isFirst) {
    // Media listeners attach lazily with the first subscriber and detach with the last one, so apps that never call useDevice() pay nothing.
    mqls = [window.matchMedia(TOUCH_QUERY), window.matchMedia(PORTRAIT_QUERY)];
    mqls.forEach((m) => listen(m, onChange));
    // Re-sync: media state may have moved between the first getSnapshot() (render) and subscription (passive effect).
    onChange();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      mqls.forEach((m) => unlisten(m, onChange));
      mqls = [];
    }
  };
}

/** Test-only: clears the cached snapshot and detaches any leaked listeners. Not re-exported from the package entry. */
export function resetStoreForTesting(): void {
  snapshot = null;
  listeners.clear();
  mqls.forEach((m) => unlisten(m, onChange));
  mqls = [];
}
