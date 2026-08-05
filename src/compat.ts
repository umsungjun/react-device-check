import * as React from 'react';
import { isServer } from './core/env';

type Subscribe = (onStoreChange: () => void) => () => void;
type UseSES = <T>(
  subscribe: Subscribe,
  getSnapshot: () => T,
  getServerSnapshot?: () => T
) => T;

// Namespace property access instead of a static named import: under React 17 a named ESM import of a missing CJS export throws in Node ESM and warns in bundlers, while property access just yields undefined.
const nativeUseSyncExternalStore = (
  React as unknown as { useSyncExternalStore?: UseSES }
).useSyncExternalStore;

/**
 * Minimal useSyncExternalStore fallback for React 17. Tearing safety is irrelevant before concurrent rendering.
 * Known caveat (shared with the official use-sync-external-store shim, which is why the extra dependency buys nothing): during hydration it renders the client snapshot immediately, so React 17 + SSR may log a mismatch warning. React 18/19 always take the native branch.
 */
export function useSyncExternalStoreFallback<T>(
  subscribe: Subscribe,
  getSnapshot: () => T,
  getServerSnapshot?: () => T
): T {
  const [state, setState] = React.useState<T>(() =>
    isServer && getServerSnapshot ? getServerSnapshot() : getSnapshot()
  );
  React.useEffect(() => {
    const update = () => setState(getSnapshot());
    // Pick up changes that happened between render and subscription.
    update();
    return subscribe(update);
  }, [subscribe, getSnapshot]);
  return state;
}

export const useSES: UseSES =
  nativeUseSyncExternalStore ?? useSyncExternalStoreFallback;

/** Stable no-op subscribe for static (never-changing) values. */
export const emptySubscribe: Subscribe = () => () => {};
