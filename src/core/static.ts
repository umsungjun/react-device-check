import type { StaticDeviceInfo } from '../types';
import { detectDevice } from './detect';
import { getNavigatorInput, isServer } from './env';

/**
 * The value rendered on the server and during the hydration first paint. Frozen module constant: `getServerSnapshot` must return a stable reference on every call or React would loop.
 * `desktop`/`unknown` matches the ua-parser-js convention (undefined device type = desktop) and is the safest guess when no request signal exists.
 */
export const SERVER_STATIC: StaticDeviceInfo = Object.freeze({
  type: 'desktop',
  os: 'unknown',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

let cache: StaticDeviceInfo | null = null;

/**
 * Session-cached static device info. UA-derived values cannot change without a page load, so the object is computed once and its reference stays stable (required by useSyncExternalStore).
 */
export function getStaticInfo(): StaticDeviceInfo {
  if (cache) return cache;
  if (isServer) return SERVER_STATIC;
  const { type, os } = detectDevice(getNavigatorInput());
  cache = {
    type,
    os,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
  };
  return cache;
}

/** Test-only: clears the session cache so stubbed navigators take effect. Not re-exported from the package entry. */
export function resetStaticInfoForTesting(): void {
  cache = null;
}
