import type { OS } from './types';
import { emptySubscribe, useSES } from './compat';
import { getStaticInfo, SERVER_STATIC } from './core/static';

// Module-scope selectors keep identities stable (see useDeviceType.ts for the rationale).
const getOS = (): OS => getStaticInfo().os;
const getServerOS = (): OS => SERVER_STATIC.os;

/**
 * Returns the operating system family only. Static: no media listeners are ever attached. Returns `'unknown'` on the server and during the hydration first paint.
 */
export function useOS(): OS {
  return useSES(emptySubscribe, getOS, getServerOS);
}
