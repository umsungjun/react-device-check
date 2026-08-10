import type { DeviceType } from './types';
import { emptySubscribe, useSES } from './compat';
import { getStaticInfo, SERVER_STATIC } from './core/static';

// Module-scope selectors keep identities stable. Inline arrows would re-run the React 17 fallback's effect on every render because they sit in its dependency array.
const getType = (): DeviceType => getStaticInfo().type;
const getServerType = (): DeviceType => SERVER_STATIC.type;

/**
 * Returns the device type only. Static: no media listeners are ever attached, and importing only this hook tree-shakes the whole reactive store away.
 */
export function useDeviceType(): DeviceType {
  return useSES(emptySubscribe, getType, getServerType);
}

/** `true` on phones. Sugar over {@link useDeviceType}. */
export function useIsMobile(): boolean {
  return useDeviceType() === 'mobile';
}

/** `true` on tablets (including iPads masquerading as Macs). Sugar over {@link useDeviceType}. */
export function useIsTablet(): boolean {
  return useDeviceType() === 'tablet';
}

/** `true` on desktops (the SSR default). Sugar over {@link useDeviceType}. */
export function useIsDesktop(): boolean {
  return useDeviceType() === 'desktop';
}
