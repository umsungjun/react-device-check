import { describe, expect, it, vi } from 'vitest';
import { detectDevice } from '../core/detect';
import { getNavigatorInput } from '../core/env';
import { FIXTURES } from './fixtures';
import { stubNavigatorFromFixture } from './helpers';

describe('detectDevice', () => {
  describe('fixture matrix', () => {
    it.each(FIXTURES)(
      'should classify "$name" as $expected.type / $expected.os',
      ({ ua, uaData, maxTouchPoints, platform, screen, expected }) => {
        const result = detectDevice({
          ua,
          uaData,
          maxTouchPoints,
          platform,
          screen,
        });
        expect(result).toEqual(expected);
      }
    );
  });

  describe('branch ordering invariants', () => {
    it('should classify iPhone before Mac (iPhone UA contains "like Mac OS X")', () => {
      const result = detectDevice({
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
        maxTouchPoints: 5,
      });
      expect(result).toEqual({ type: 'mobile', os: 'ios' });
    });

    it('should classify Android before Linux ("Linux; Android" UA contains "Linux")', () => {
      const result = detectDevice({
        ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36',
      });
      expect(result).toEqual({ type: 'mobile', os: 'android' });
    });

    it('should be case-sensitive (lowercase "(linux)" or "(darwin)" must not match)', () => {
      expect(
        detectDevice({ ua: 'Mozilla/5.0 (linux) some-embedder/1.0' })
      ).toEqual({ type: 'desktop', os: 'unknown' });
      expect(detectDevice({ ua: 'Mozilla/5.0 (darwin) jsdom/27.4.0' })).toEqual(
        { type: 'desktop', os: 'unknown' }
      );
    });

    it('should prefer Client Hints over the UA string when both exist', () => {
      // A lying UA (Windows string) with authoritative uaData (Android mobile).
      const result = detectDevice({
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
        uaData: { mobile: true, platform: 'Android' },
      });
      expect(result).toEqual({ type: 'mobile', os: 'android' });
    });

    it('should ignore uaData without a boolean mobile field', () => {
      const result = detectDevice({
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
        uaData: {},
        maxTouchPoints: 5,
      });
      expect(result).toEqual({ type: 'mobile', os: 'ios' });
    });

    it('should unmask an iPad via navigator.platform even when the UA lacks Mac tokens', () => {
      const result = detectDevice({
        ua: 'SomeExoticShell/1.0',
        platform: 'MacIntel',
        maxTouchPoints: 5,
      });
      expect(result).toEqual({ type: 'tablet', os: 'ios' });
    });
  });

  describe('fallback', () => {
    it('should return desktop/unknown by default with no input', () => {
      expect(detectDevice()).toEqual({ type: 'desktop', os: 'unknown' });
      expect(detectDevice(undefined)).toEqual({
        type: 'desktop',
        os: 'unknown',
      });
    });

    it('should honor a custom fallback', () => {
      expect(detectDevice(undefined, { fallback: { type: 'mobile' } })).toEqual(
        { type: 'mobile', os: 'unknown' }
      );
      expect(
        detectDevice(undefined, { fallback: { type: 'mobile', os: 'ios' } })
      ).toEqual({ type: 'mobile', os: 'ios' });
    });

    it('should ignore the fallback when signals exist', () => {
      const result = detectDevice(
        {
          ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
        },
        { fallback: { type: 'desktop', os: 'windows' } }
      );
      expect(result).toEqual({ type: 'mobile', os: 'ios' });
    });
  });

  describe('determinism', () => {
    it('should return deep-equal results for the same input', () => {
      const input = {
        ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36',
        uaData: { mobile: true, platform: 'Android' },
        maxTouchPoints: 5,
      };
      expect(detectDevice(input)).toEqual(detectDevice(input));
    });

    it('should expose exactly the type and os keys (API surface lock)', () => {
      expect(Object.keys(detectDevice()).sort()).toEqual(['os', 'type']);
    });
  });
});

describe('getNavigatorInput', () => {
  it('should read all signals from the stubbed navigator and screen', () => {
    stubNavigatorFromFixture({
      ua: 'test-ua',
      uaData: { mobile: true, platform: 'Android' },
      maxTouchPoints: 5,
      platform: 'Linux armv81',
      screen: { width: 390, height: 844 },
    });
    expect(getNavigatorInput()).toEqual({
      ua: 'test-ua',
      uaData: { mobile: true, platform: 'Android' },
      maxTouchPoints: 5,
      platform: 'Linux armv81',
      screen: { width: 390, height: 844 },
    });
  });

  it('should omit uaData when userAgentData is absent (Safari/Firefox shape)', () => {
    stubNavigatorFromFixture({ ua: 'test-ua', maxTouchPoints: 0 });
    expect(getNavigatorInput()?.uaData).toBeUndefined();
  });

  it('should not throw on a bare React Native navigator shape', () => {
    vi.stubGlobal('navigator', { product: 'ReactNative' });
    const input = getNavigatorInput();
    expect(input?.ua).toBeUndefined();
    // The engine treats a signal-less input as the fallback case.
    expect(detectDevice(input)).toEqual({ type: 'desktop', os: 'unknown' });
  });
});
