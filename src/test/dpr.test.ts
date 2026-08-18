import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDpr, getServerDpr, SERVER_DPR, subscribe } from '../core/dpr';
import { dprQuery, stubDevicePixelRatio } from './helpers';
import { installMatchMedia } from './matchMediaMock';

describe('device pixel ratio store', () => {
  beforeEach(() => {
    stubDevicePixelRatio(2);
  });

  it('should read the current ratio', () => {
    installMatchMedia();
    expect(getDpr()).toBe(2);
  });

  it('should return a stable value across repeated calls', () => {
    installMatchMedia();
    expect(getDpr()).toBe(getDpr());
  });

  it('should fall back to 1 when the environment reports no usable ratio', () => {
    stubDevicePixelRatio(0);
    installMatchMedia();
    expect(getDpr()).toBe(1);
  });

  it('should attach a resolution listener on first subscribe and detach on last unsubscribe', () => {
    const media = installMatchMedia();
    expect(media.listenerCount(dprQuery(2))).toBe(0);

    const unsubA = subscribe(() => {});
    const unsubB = subscribe(() => {});
    // One store-level listener regardless of how many subscribers there are.
    expect(media.listenerCount(dprQuery(2))).toBe(1);

    unsubA();
    expect(media.listenerCount(dprQuery(2))).toBe(1);
    unsubB();
    expect(media.listenerCount(dprQuery(2))).toBe(0);
  });

  it('should notify listeners and re-arm on the new query when the ratio changes', () => {
    const media = installMatchMedia();
    const listener = vi.fn();
    expect(getDpr()).toBe(2);
    const unsubscribe = subscribe(listener);

    stubDevicePixelRatio(3);
    media.set(dprQuery(2), false);

    expect(getDpr()).toBe(3);
    expect(listener).toHaveBeenCalledTimes(1);
    // The old query can never match again, so the listener has to move to the new one.
    expect(media.listenerCount(dprQuery(2))).toBe(0);
    expect(media.listenerCount(dprQuery(3))).toBe(1);

    unsubscribe();
    expect(media.listenerCount(dprQuery(3))).toBe(0);
  });

  it('should not notify when a change event fires without an actual ratio change', () => {
    const media = installMatchMedia();
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    media.set(dprQuery(2), false);

    expect(getDpr()).toBe(2);
    expect(listener).not.toHaveBeenCalled();
    expect(media.listenerCount(dprQuery(2))).toBe(1);
    unsubscribe();
  });

  it('should notify the arriving subscriber when the ratio moved between render and subscription', () => {
    // Regression guard for the React 17 fallback, which reads the snapshot before it subscribes.
    installMatchMedia();
    expect(getDpr()).toBe(2);

    stubDevicePixelRatio(3);
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(getDpr()).toBe(3);
    unsubscribe();
  });

  it('should expose a stable server ratio of 1', () => {
    expect(SERVER_DPR).toBe(1);
    expect(getServerDpr()).toBe(1);
    expect(getServerDpr()).toBe(getServerDpr());
  });
});
