import type { ShowcaseStrings } from '@/content/types';

interface DeviceShowcaseProps {
  strings: ShowcaseStrings;
}

type ScreenValue = readonly [key: string, value: string];

type DeviceKind = 'phone' | 'tablet' | 'monitor' | 'laptop' | 'tv';

interface DeviceSpec {
  kind: DeviceKind;
  // The deceptive signal the device sends, shown next to the hook's verdict
  claim: string;
  values: ScreenValue[];
}

// Values/claims are locale-independent code output; names/captions come from the strings dict by index
const DEVICES: DeviceSpec[] = [
  {
    kind: 'phone',
    claim: 'Macintosh; Intel Mac OS X · screen: 393px',
    values: [
      ['type', "'mobile'"],
      ['os', "'ios'"],
      ['isTouchPrimary', 'true'],
      ['orientation', "'portrait'"],
    ],
  },
  {
    kind: 'phone',
    claim: 'Linux; Android 14; K',
    values: [
      ['type', "'mobile'"],
      ['os', "'android'"],
      ['isTouchPrimary', 'true'],
      ['orientation', "'portrait'"],
    ],
  },
  {
    kind: 'tablet',
    claim: 'Macintosh; Intel Mac OS X 10_15_7',
    values: [
      ['type', "'tablet'"],
      ['os', "'ios'"],
      ['isTouchPrimary', 'true'],
      ['orientation', "'landscape'"],
    ],
  },
  {
    kind: 'monitor',
    claim: 'Macintosh; Intel Mac OS X 10_15_7 · maxTouchPoints: 0',
    values: [
      ['type', "'desktop'"],
      ['os', "'macos'"],
      ['isTouchPrimary', 'false'],
      ['orientation', "'landscape'"],
    ],
  },
  {
    kind: 'laptop',
    claim: 'Windows NT 10.0 · maxTouchPoints: 10',
    values: [
      ['type', "'desktop'"],
      ['os', "'windows'"],
      ['isTouchPrimary', 'false'],
      ['orientation', "'landscape'"],
    ],
  },
  {
    kind: 'tv',
    claim: 'Linux; Android 11; SHIELD Android TV',
    values: [
      ['type', "'desktop'"],
      ['os', "'android'"],
      ['isTouchPrimary', 'false'],
      ['orientation', "'landscape'"],
    ],
  },
];

function Screen({ values }: { values: ScreenValue[] }) {
  return (
    <div className="device-screen">
      {values.map(([key, value]) => (
        <div className="screen-line" key={key}>
          <span className="screen-key">{key}:</span>{' '}
          <span className="screen-val">{value}</span>
        </div>
      ))}
    </div>
  );
}

function DeviceFrame({
  kind,
  values,
}: {
  kind: DeviceKind;
  values: ScreenValue[];
}) {
  if (kind === 'laptop') {
    return (
      <div className="device3d tilt-laptop">
        <div className="frame frame-laptop">
          <div className="frame-inner">
            <Screen values={values} />
          </div>
        </div>
        <div className="laptop-hinge" aria-hidden="true" />
        <div className="laptop-deck" aria-hidden="true" />
      </div>
    );
  }
  if (kind === 'monitor' || kind === 'tv') {
    return (
      <div
        className={`device3d ${kind === 'monitor' ? 'tilt-monitor' : 'tilt-tv'}`}
      >
        <div className={`frame frame-${kind}`}>
          <div className="frame-inner">
            <Screen values={values} />
            {kind === 'monitor' && (
              <div className="monitor-chin" aria-hidden="true" />
            )}
          </div>
        </div>
        <div
          className={`stand-neck ${kind === 'tv' ? 'stand-neck-tv' : ''}`}
          aria-hidden="true"
        />
        <div
          className={`stand-base ${kind === 'tv' ? 'stand-base-tv' : ''}`}
          aria-hidden="true"
        />
      </div>
    );
  }
  return (
    <div
      className={`device3d ${kind === 'phone' ? 'tilt-phone' : 'tilt-tablet'}`}
    >
      <div className={`frame frame-${kind}`}>
        <div className="frame-inner">
          {kind === 'phone' && <div className="island" aria-hidden="true" />}
          <Screen values={values} />
        </div>
      </div>
    </div>
  );
}

export default function DeviceShowcase({ strings }: DeviceShowcaseProps) {
  return (
    <div className="showcase-list">
      {DEVICES.map((device, index) => {
        const meta = strings.devices[index];
        const [[, type], [, os]] = device.values;
        return (
          <article className="showcase-item" key={meta.name}>
            <div className="showcase-visual">
              <DeviceFrame kind={device.kind} values={device.values} />
            </div>
            <div className="showcase-copy">
              <h3>{meta.name}</h3>
              <div className="signal-row">
                <span className="signal-label">{strings.claimLabel}</span>
                <code className="signal-claim">{device.claim}</code>
              </div>
              <div className="signal-row">
                <span className="signal-label">{strings.verdictLabel}</span>
                <span className="verdict-chips">
                  <code className="verdict-chip">{type}</code>
                  <code className="verdict-chip">{os}</code>
                </span>
              </div>
              <p className="showcase-caption">{meta.caption}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
