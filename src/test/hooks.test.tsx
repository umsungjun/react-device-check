import { act, render } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSyncExternalStoreFallback } from '../compat';
import {
  useDevice,
  useDevicePixelRatio,
  useDeviceType,
  useIsDesktop,
  useIsMobile,
  useIsTablet,
  useOS,
} from '../index';
import { getServerSnapshot, getSnapshot, subscribe } from '../core/store';
import { installMatchMedia } from './matchMediaMock';
import {
  dprQuery,
  stubDevicePixelRatio,
  stubNavigatorFromFixture,
} from './helpers';

const TOUCH_QUERY = '(pointer: coarse)';
const PORTRAIT_QUERY = '(orientation: portrait)';

const IPHONE = {
  ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  maxTouchPoints: 5,
  platform: 'iPhone',
};

const CHROME_ANDROID_PHONE = {
  ua: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36',
  uaData: { mobile: true, platform: 'Android' },
  maxTouchPoints: 5,
};

// Probe components instead of renderHook: @testing-library/react 12 (the React 17 CI leg) has no renderHook, and probes exercise the exact consumer path on every React major.
function DeviceProbe() {
  const device = useDevice();
  return <div data-testid="device">{JSON.stringify(device)}</div>;
}

function DprProbe() {
  return <div data-testid="dpr">{useDevicePixelRatio()}</div>;
}

function StaticProbe() {
  const type = useDeviceType();
  const os = useOS();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  return (
    <div data-testid="static">
      {JSON.stringify({ type, os, isMobile, isTablet, isDesktop })}
    </div>
  );
}

const readJSON = (el: HTMLElement) => JSON.parse(el.textContent ?? 'null');

describe('hooks', () => {
  beforeEach(() => {
    installMatchMedia({ [TOUCH_QUERY]: true, [PORTRAIT_QUERY]: true });
  });

  describe('useDevice', () => {
    it('should return the full pipeline result for an iPhone navigator', () => {
      stubNavigatorFromFixture(IPHONE);
      const { getByTestId } = render(<DeviceProbe />);
      expect(readJSON(getByTestId('device'))).toEqual({
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

    it('should return the full pipeline result for a Chromium Android navigator', () => {
      stubNavigatorFromFixture(CHROME_ANDROID_PHONE);
      const { getByTestId } = render(<DeviceProbe />);
      const device = readJSON(getByTestId('device'));
      expect(device.type).toBe('mobile');
      expect(device.os).toBe('android');
    });

    it('should update reactive fields on media changes while type/os stay static', () => {
      stubNavigatorFromFixture(IPHONE);
      const media = installMatchMedia({
        [TOUCH_QUERY]: true,
        [PORTRAIT_QUERY]: true,
      });
      const { getByTestId } = render(<DeviceProbe />);
      expect(readJSON(getByTestId('device')).orientation).toBe('portrait');

      act(() => {
        media.set(PORTRAIT_QUERY, false);
      });
      const rotated = readJSON(getByTestId('device'));
      expect(rotated.orientation).toBe('landscape');
      expect(rotated.type).toBe('mobile');
      expect(rotated.os).toBe('ios');

      act(() => {
        media.set(TOUCH_QUERY, false);
      });
      const mouseAttached = readJSON(getByTestId('device'));
      expect(mouseAttached.isTouchPrimary).toBe(false);
      expect(mouseAttached.type).toBe('mobile');
    });

    it('should not re-render in a loop (bounded render count)', () => {
      stubNavigatorFromFixture(IPHONE);
      let renders = 0;
      function CountingProbe() {
        renders += 1;
        useDevice();
        return null;
      }
      render(<CountingProbe />);
      expect(renders).toBeLessThanOrEqual(2);
    });
  });

  describe('static hooks', () => {
    it('should agree with useDevice for every derived value', () => {
      stubNavigatorFromFixture(IPHONE);
      const { getByTestId } = render(
        <>
          <DeviceProbe />
          <StaticProbe />
        </>
      );
      const device = readJSON(getByTestId('device'));
      const statics = readJSON(getByTestId('static'));
      expect(statics).toEqual({
        type: device.type,
        os: device.os,
        isMobile: device.isMobile,
        isTablet: device.isTablet,
        isDesktop: device.isDesktop,
      });
    });

    it('should work without matchMedia ever being touched', () => {
      // Static hooks must not depend on the reactive store: a broken/missing matchMedia should not matter.
      vi.stubGlobal('matchMedia', undefined);
      stubNavigatorFromFixture(IPHONE);
      const { getByTestId } = render(<StaticProbe />);
      expect(readJSON(getByTestId('static')).type).toBe('mobile');
    });
  });

  describe('useDevicePixelRatio', () => {
    it('should return the current ratio', () => {
      stubDevicePixelRatio(3);
      const { getByTestId } = render(<DprProbe />);
      expect(getByTestId('dpr').textContent).toBe('3');
    });

    it('should re-render with the new ratio when the display density changes', () => {
      stubDevicePixelRatio(2);
      const media = installMatchMedia();
      const { getByTestId } = render(<DprProbe />);
      expect(getByTestId('dpr').textContent).toBe('2');

      // A window dragged onto a 1x monitor: stub the new ratio, then fire the query that described the old one.
      stubDevicePixelRatio(1);
      act(() => {
        media.set(dprQuery(2), false);
      });
      expect(getByTestId('dpr').textContent).toBe('1');
    });

    it('should not affect the device snapshot', () => {
      stubDevicePixelRatio(3);
      stubNavigatorFromFixture(IPHONE);
      const { getByTestId } = render(
        <>
          <DeviceProbe />
          <DprProbe />
        </>
      );
      expect(getByTestId('dpr').textContent).toBe('3');
      expect(readJSON(getByTestId('device'))).not.toHaveProperty('dpr');
    });

    it('should not re-render in a loop (bounded render count)', () => {
      stubDevicePixelRatio(2);
      let renders = 0;
      function CountingProbe() {
        renders += 1;
        useDevicePixelRatio();
        return null;
      }
      render(<CountingProbe />);
      expect(renders).toBeLessThanOrEqual(2);
    });
  });

  describe('React.StrictMode', () => {
    it('should survive double mounting with correct values', () => {
      stubNavigatorFromFixture(IPHONE);
      const { getByTestId } = render(
        <React.StrictMode>
          <DeviceProbe />
        </React.StrictMode>
      );
      expect(readJSON(getByTestId('device')).type).toBe('mobile');
    });
  });

  describe('useSyncExternalStoreFallback (React 17 path)', () => {
    it('should read the snapshot and react to store changes', () => {
      stubNavigatorFromFixture(IPHONE);
      const media = installMatchMedia({ [PORTRAIT_QUERY]: true });
      function FallbackProbe() {
        const device = useSyncExternalStoreFallback(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
        return <div data-testid="fallback">{device.orientation}</div>;
      }
      const { getByTestId } = render(<FallbackProbe />);
      expect(getByTestId('fallback').textContent).toBe('portrait');
      act(() => {
        media.set(PORTRAIT_QUERY, false);
      });
      expect(getByTestId('fallback').textContent).toBe('landscape');
    });
  });

  describe('hydration', () => {
    // react-dom/client does not exist on React 17, so the fallback path there renders the client snapshot directly and is covered by the compat CI leg.
    const hasModernReact = parseInt(React.version, 10) >= 18;

    it.skipIf(!hasModernReact)(
      'should hydrate server HTML without mismatch errors and correct afterwards',
      async () => {
        stubNavigatorFromFixture(IPHONE);
        const { renderToString } = await import('react-dom/server');
        // Vite's import analysis resolves literal dynamic imports at transform time (even with @vite-ignore), which crashes suite loading on React 17 where react-dom/client does not exist. A variable specifier is opaque to the analyzer, deferring resolution to runtime, after skipIf has excluded this test on React 17.
        const clientSpecifier = 'react-dom/client';
        const { hydrateRoot } = (await import(
          /* @vite-ignore */ clientSpecifier
        )) as typeof import('react-dom/client');

        // The server render uses getServerSnapshot: desktop/unknown defaults. renderToString HTML-escapes quotes, hence the decode.
        const html = renderToString(<DeviceProbe />);
        const decoded = html.replace(/&quot;/g, '"');
        expect(decoded).toContain('"type":"desktop"');
        expect(decoded).toContain('"isHydrated":false');

        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        const errorSpy = vi.spyOn(console, 'error');
        let root: ReturnType<typeof hydrateRoot>;
        await act(async () => {
          root = hydrateRoot(container, <DeviceProbe />);
        });

        const hydrated = JSON.parse(
          container.querySelector('[data-testid="device"]')?.textContent ??
            'null'
        );
        expect(hydrated.type).toBe('mobile');
        expect(hydrated.os).toBe('ios');
        expect(hydrated.isHydrated).toBe(true);

        const hydrationErrors = errorSpy.mock.calls.filter((args) =>
          String(args[0]).toLowerCase().includes('hydrat')
        );
        expect(hydrationErrors).toEqual([]);

        await act(async () => {
          root.unmount();
        });
        container.remove();
        errorSpy.mockRestore();
      }
    );
  });
});
