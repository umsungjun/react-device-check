import type { DetectionInput, UADataLike } from '../types';

/** True outside a browser-like environment (Node SSR, workers without navigator). */
export const isServer =
  typeof window === 'undefined' || typeof navigator === 'undefined';

/**
 * Reads detection signals from globals. Returns `undefined` outside a browser environment. Never accessed at module top level — all detection is lazy so importing the library is always SSR-safe.
 * Gated on `window` (not just `navigator`) because Node 21+ ships a global `navigator` whose `platform` reflects the server machine — trusting it would misreport the server's OS as the device. Non-window environments (workers, servers) should pass explicit input to `detectDevice` instead.
 */
export function getNavigatorInput(): DetectionInput | undefined {
  if (isServer) return undefined;
  const nav = navigator as Navigator & { userAgentData?: UADataLike };
  return {
    ua: nav.userAgent,
    uaData: nav.userAgentData,
    maxTouchPoints: nav.maxTouchPoints,
    platform: nav.platform,
    screen:
      typeof screen !== 'undefined' && screen
        ? { width: screen.width, height: screen.height }
        : undefined,
  };
}
