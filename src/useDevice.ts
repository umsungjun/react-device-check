import type { DeviceInfo } from './types';
import { useSES } from './compat';
import { getServerSnapshot, getSnapshot, subscribe } from './core/store';

/**
 * Returns the full device snapshot.
 *
 * `type`/`os` and the derived booleans are static for the session (user agent facts cannot change without a page load). `isTouchPrimary` and `orientation` are reactive: they update live via matchMedia change listeners.
 *
 * SSR contract: the server render and the hydration first paint both return the frozen default (`desktop`/`unknown`, `isHydrated: false`), so server and client HTML always match. Immediately after hydration the hook re-renders once with the real values.
 */
export function useDevice(): DeviceInfo {
  return useSES(subscribe, getSnapshot, getServerSnapshot);
}
