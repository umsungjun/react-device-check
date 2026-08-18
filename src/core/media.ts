/**
 * matchMedia listener helpers shared by every reactive store. Kept in one place so each store does not repeat the legacy branch.
 */

// addListener is the Safari < 14 path: MediaQueryList did not implement EventTarget there.
export function listen(mql: MediaQueryList, cb: () => void): void {
  if (mql.addEventListener) mql.addEventListener('change', cb);
  else mql.addListener(cb);
}

export function unlisten(mql: MediaQueryList, cb: () => void): void {
  if (mql.removeEventListener) mql.removeEventListener('change', cb);
  else mql.removeListener(cb);
}
