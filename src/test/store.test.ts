import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getServerSnapshot,
  getSnapshot,
  SERVER_SNAPSHOT,
  subscribe,
} from '../core/store';
import { installMatchMedia } from './matchMediaMock';
import { stubNavigatorFromFixture } from './helpers';

const TOUCH_QUERY = '(pointer: coarse)';
const PORTRAIT_QUERY = '(orientation: portrait)';

describe('device store', () => {
  beforeEach(() => {
    stubNavigatorFromFixture({
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
      maxTouchPoints: 5,
      platform: 'iPhone',
    });
  });

  it('should return a referentially stable snapshot across repeated calls', () => {
    installMatchMedia({ [TOUCH_QUERY]: true, [PORTRAIT_QUERY]: true });
    expect(getSnapshot()).toBe(getSnapshot());
  });

  it('should compute static and reactive fields together', () => {
    installMatchMedia({ [TOUCH_QUERY]: true, [PORTRAIT_QUERY]: true });
    expect(getSnapshot()).toEqual({
      type: 'mobile',
      os: 'ios',
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isTouchPrimary: true,
      orientation: 'portrait',
      isHydrated: true,
    });
  });

  it('should swap the snapshot reference only when a reactive field changes', () => {
    const media = installMatchMedia({
      [TOUCH_QUERY]: true,
      [PORTRAIT_QUERY]: true,
    });
    const unsubscribe = subscribe(() => {});
    const first = getSnapshot();

    // Firing a change event without an actual value change keeps the reference.
    media.set(PORTRAIT_QUERY, true);
    expect(getSnapshot()).toBe(first);

    media.set(PORTRAIT_QUERY, false);
    const second = getSnapshot();
    expect(second).not.toBe(first);
    expect(second.orientation).toBe('landscape');
    unsubscribe();
  });

  it('should notify listeners on reactive changes', () => {
    const media = installMatchMedia({ [TOUCH_QUERY]: false });
    // Establish the snapshot first, as React's render does before subscribing.
    getSnapshot();
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    media.set(TOUCH_QUERY, true);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('should attach media listeners on first subscribe and detach on last unsubscribe', () => {
    const media = installMatchMedia();
    expect(media.listenerCount(TOUCH_QUERY)).toBe(0);

    const unsubA = subscribe(() => {});
    const unsubB = subscribe(() => {});
    expect(media.listenerCount(TOUCH_QUERY)).toBe(1);
    expect(media.listenerCount(PORTRAIT_QUERY)).toBe(1);

    unsubA();
    expect(media.listenerCount(TOUCH_QUERY)).toBe(1);
    unsubB();
    expect(media.listenerCount(TOUCH_QUERY)).toBe(0);
    expect(media.listenerCount(PORTRAIT_QUERY)).toBe(0);
  });

  it('should re-sync media state that moved between render and subscription', () => {
    const media = installMatchMedia({ [PORTRAIT_QUERY]: true });
    const stale = getSnapshot();
    expect(stale.orientation).toBe('portrait');

    // The media state flips before any subscriber exists (render → passive effect gap).
    media.set(PORTRAIT_QUERY, false);
    expect(getSnapshot()).toBe(stale); // no listener yet, still stale by design

    const unsubscribe = subscribe(() => {});
    expect(getSnapshot().orientation).toBe('landscape');
    unsubscribe();
  });

  it('should notify the arriving subscriber when the re-sync detects moved state', () => {
    // Regression guard: the React 17 fallback reads the snapshot BEFORE subscribing, so the lazy-attach re-sync must notify the subscriber being registered or it stays stale until the next media change.
    const media = installMatchMedia({ [PORTRAIT_QUERY]: true });
    expect(getSnapshot().orientation).toBe('portrait');
    media.set(PORTRAIT_QUERY, false);

    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('should expose a frozen, stable server snapshot', () => {
    expect(getServerSnapshot()).toBe(SERVER_SNAPSHOT);
    expect(getServerSnapshot()).toBe(getServerSnapshot());
    expect(Object.isFrozen(SERVER_SNAPSHOT)).toBe(true);
    expect(SERVER_SNAPSHOT).toEqual({
      type: 'desktop',
      os: 'unknown',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchPrimary: false,
      orientation: 'landscape',
      isHydrated: false,
    });
  });
});
