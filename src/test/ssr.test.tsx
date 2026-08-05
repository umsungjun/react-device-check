// @vitest-environment node
// Runs in a real Node environment (no window, no navigator, no document) so the actual SSR path is exercised instead of a mocked one.
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { detectDevice } from '../core/detect';
import { getNavigatorInput } from '../core/env';
import { useDevice, useDeviceType, useIsMobile, useOS } from '../index';

function DeviceProbe() {
  const device = useDevice();
  return <div>{JSON.stringify(device)}</div>;
}

function StaticProbe() {
  return (
    <div>
      {JSON.stringify({
        type: useDeviceType(),
        os: useOS(),
        isMobile: useIsMobile(),
      })}
    </div>
  );
}

const decode = (html: string) => html.replace(/&quot;/g, '"');

describe('SSR (Node environment)', () => {
  it('should return no navigator input even though Node 21+ ships a global navigator', () => {
    // Node's navigator.platform reflects the server machine (e.g. 'MacIntel'); getNavigatorInput must not trust it.
    expect(typeof window).toBe('undefined');
    expect(getNavigatorInput()).toBeUndefined();
  });

  it('should not throw in detectDevice without any input', () => {
    expect(detectDevice()).toEqual({ type: 'desktop', os: 'unknown' });
    expect(detectDevice(getNavigatorInput())).toEqual({
      type: 'desktop',
      os: 'unknown',
    });
  });

  it('should honor a custom fallback server-side', () => {
    expect(
      detectDevice(undefined, { fallback: { type: 'mobile', os: 'ios' } })
    ).toEqual({ type: 'mobile', os: 'ios' });
  });

  it('should support server-side detection from a request user-agent header', () => {
    // The documented pattern for servers: pass the request's user-agent header directly.
    const result = detectDevice({
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
    });
    expect(result).toEqual({ type: 'mobile', os: 'ios' });
  });

  it('should renderToString useDevice without crashing, with server defaults', () => {
    const html = decode(renderToString(<DeviceProbe />));
    expect(html).toContain('"type":"desktop"');
    expect(html).toContain('"os":"unknown"');
    expect(html).toContain('"isHydrated":false');
    expect(html).toContain('"isTouchPrimary":false');
    expect(html).toContain('"orientation":"landscape"');
  });

  it('should renderToString static hooks without crashing, with server defaults', () => {
    const html = decode(renderToString(<StaticProbe />));
    expect(html).toContain('"type":"desktop"');
    expect(html).toContain('"os":"unknown"');
    expect(html).toContain('"isMobile":false');
  });
});
