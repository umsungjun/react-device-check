import { vi } from 'vitest';
import type { Fixture } from './fixtures';

/**
 * Replaces the global navigator (and screen, when provided) with fixture values. vi.stubGlobal swaps the whole global so vi.unstubAllGlobals() restores everything in one call — cleaner than per-property defineProperty juggling against jsdom's prototype getters.
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
