'use client';

import { useState } from 'react';
import { useDevice } from 'react-device-check';
import type { DemoStrings } from '@/content/types';

interface LiveDemoProps {
  strings: DemoStrings;
}

type Row = readonly [label: string, value: string];

export default function LiveDemo({ strings }: LiveDemoProps) {
  const device = useDevice();
  // Freeze the hydration-render snapshot — this is exactly what the server sent
  const [firstPaint] = useState(device);

  const toRows = (d: typeof device): Row[] => [
    ['type', d.type],
    ['os', d.os],
    ['isTouchPrimary', String(d.isTouchPrimary)],
    ['orientation', d.orientation],
    ['isHydrated', String(d.isHydrated)],
  ];

  return (
    <div className="demo-grid">
      <article className="panel">
        <header className="panel-head">
          <h3>{strings.serverPanel}</h3>
          <span className="badge">{strings.waitingBadge}</span>
        </header>
        <dl>
          {toRows(firstPaint).map(([label, value]) => (
            <div className="row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="panel-note">{strings.serverNote}</p>
      </article>

      <article className="panel panel-live">
        <header className="panel-head">
          <h3>{strings.livePanel}</h3>
          <span className={device.isHydrated ? 'badge badge-ok' : 'badge'}>
            {device.isHydrated ? strings.hydratedBadge : strings.waitingBadge}
          </span>
        </header>
        <dl>
          {toRows(device).map(([label, value]) => (
            <div className="row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="panel-note">{strings.liveNote}</p>
      </article>
    </div>
  );
}
