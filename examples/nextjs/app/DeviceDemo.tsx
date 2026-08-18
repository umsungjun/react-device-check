'use client';

import { useState } from 'react';
import { useDevice, useDevicePixelRatio } from 'react-device-check';

export function DeviceDemo() {
  const device = useDevice();
  const dpr = useDevicePixelRatio();
  // Captured once during the hydration render, i.e. exactly what the server sent: the frozen desktop/unknown snapshot with isHydrated: false.
  const [firstPaint] = useState(device);
  // Same capture for the ratio, which the server always reports as 1.
  const [firstDpr] = useState(dpr);

  return (
    <>
      <section className="card">
        <h2>Live values from useDevice()</h2>
        <dl>
          <div className="row">
            <dt>type</dt>
            <dd data-testid="type" className={`badge type-${device.type}`}>
              {device.type}
            </dd>
          </div>
          <div className="row">
            <dt>os</dt>
            <dd data-testid="os" className="badge">
              {device.os}
            </dd>
          </div>
          <div className="row">
            <dt>isTouchPrimary</dt>
            <dd data-testid="isTouchPrimary">
              {String(device.isTouchPrimary)}
            </dd>
          </div>
          <div className="row">
            <dt>orientation</dt>
            <dd data-testid="orientation">{device.orientation}</dd>
          </div>
          <div className="row">
            <dt>isHydrated</dt>
            <dd
              data-testid="isHydrated"
              className={device.isHydrated ? 'ok' : 'pending'}
            >
              {String(device.isHydrated)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h2>Live value from useDevicePixelRatio()</h2>
        <dl>
          <div className="row">
            <dt>dpr</dt>
            <dd data-testid="dpr">{dpr}</dd>
          </div>
        </dl>
      </section>

      <section className="card muted">
        <h2>First paint (what the server rendered)</h2>
        <dl>
          <div className="row">
            <dt>type</dt>
            <dd data-testid="first-type">{firstPaint.type}</dd>
          </div>
          <div className="row">
            <dt>os</dt>
            <dd data-testid="first-os">{firstPaint.os}</dd>
          </div>
          <div className="row">
            <dt>dpr</dt>
            <dd data-testid="first-dpr">{firstDpr}</dd>
          </div>
          <div className="row">
            <dt>isHydrated</dt>
            <dd data-testid="first-isHydrated">
              {String(firstPaint.isHydrated)}
            </dd>
          </div>
        </dl>
        <p className="hint">
          The server cannot know your device, so it renders the safe default
          (desktop / unknown, and a ratio of 1). Because the hydration first
          paint uses the same default, server and client HTML always match, and
          then the hook corrects itself in one post-hydration render. No
          hydration error is ever logged.
        </p>
      </section>
    </>
  );
}
