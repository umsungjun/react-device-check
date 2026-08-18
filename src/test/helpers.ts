import { vi } from 'vitest';
import type { Fixture } from './fixtures';

/**
 * Replaces the global navigator (and screen, when provided) with fixture values. vi.stubGlobal swaps the whole global so vi.unstubAllGlobals() restores everything in one call, which is cleaner than per-property defineProperty juggling against jsdom's prototype getters.
 */
export function stubNavigatorFromFixture(fx: Partial<Fixture>): void {
  vi.stubGlobal('navigator', {
    userAgent: fx.ua ?? '',
    ...(fx.uaData ? { userAgentData: fx.uaData } : {}),
    maxTouchPoints: fx.maxTouchPoints ?? 0,
    platform: fx.platform ?? '',
  });
  if (fx.screen) vi.stubGlobal('screen', fx.screen);
}

/**
 * Sets window.devicePixelRatio. jsdom declares it [Replaceable], so vi.stubGlobal redefines it cleanly and vi.unstubAllGlobals() restores jsdom's getter.
 * Stubbing alone fires no media change: pair it with the matchMedia controller to drive the DPR store.
 */
export function stubDevicePixelRatio(ratio: number): void {
  vi.stubGlobal('devicePixelRatio', ratio);
}

/** The exact query the DPR store builds for a given ratio. Tests must use it verbatim: the matchMedia mock keys off the raw string. */
export const dprQuery = (ratio: number): string => `(resolution: ${ratio}dppx)`;
