import { vi } from 'vitest';

type MediaListener = (e: { matches: boolean; media: string }) => void;

export interface MatchMediaController {
  /** Updates the state of a query and fires its change listeners. */
  set(query: string, matches: boolean): void;
  /** Number of active change listeners for a query (for lifecycle assertions). */
  listenerCount(query: string): number;
}

/**
 * Installs a controllable matchMedia mock (jsdom does not implement it). Returns a controller that can flip query states and fire change events.
 */
export function installMatchMedia(
  initial: Record<string, boolean> = {}
): MatchMediaController {
  const state = new Map(Object.entries(initial));
  const listeners = new Map<string, Set<MediaListener>>();

  const listenersFor = (query: string): Set<MediaListener> => {
    let set = listeners.get(query);
    if (!set) {
      set = new Set();
      listeners.set(query, set);
    }
    return set;
  };

  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return state.get(query) ?? false;
    },
    media: query,
    onchange: null,
    addEventListener: (_type: 'change', cb: MediaListener) => {
      listenersFor(query).add(cb);
    },
    removeEventListener: (_type: 'change', cb: MediaListener) => {
      listenersFor(query).delete(cb);
    },
    // Legacy aliases (Safari < 14 path in the store).
    addListener: (cb: MediaListener) => {
      listenersFor(query).add(cb);
    },
    removeListener: (cb: MediaListener) => {
      listenersFor(query).delete(cb);
    },
    dispatchEvent: () => true,
  }));

  return {
    set(query, matches) {
      state.set(query, matches);
      listenersFor(query).forEach((cb) => cb({ matches, media: query }));
    },
    listenerCount(query) {
      return listeners.get(query)?.size ?? 0;
    },
  };
}
