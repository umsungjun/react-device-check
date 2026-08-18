import { useSES } from './compat';
import { getDpr, getServerDpr, subscribe } from './core/dpr';

/**
 * Returns `window.devicePixelRatio`, the number of physical pixels per CSS pixel. Use it to pick a `@2x`/`@3x` asset, scale a canvas backing store, or request map and chart tiles at the right resolution.
 *
 * Reactive: the value updates live when the ratio moves, which happens on browser zoom, on a display scale change, and when the window is dragged between screens of different densities.
 *
 * SSR contract: the server render and the hydration first paint both return `1`, so server and client HTML always match. The real ratio arrives in one post-hydration render.
 */
export function useDevicePixelRatio(): number {
  return useSES(subscribe, getDpr, getServerDpr);
}
