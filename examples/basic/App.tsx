// Imports the library source directly (like react-head-safe's example) for a fast edit-refresh loop.
import { useDevice } from '../../src';

export default function App() {
  const device = useDevice();

  return (
    <main className="page">
      <h1>react-device-check</h1>
      <p className="subtitle">
        Pure CSR (Vite) — values are correct from the very first render, no
        hydration involved.
      </p>

      <section className="card">
        <h2>useDevice()</h2>
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

      <p className="hint">
        Tip: toggle the device emulation in your browser devtools and reload,
        or rotate a real device — orientation and isTouchPrimary update live.
      </p>
    </main>
  );
}
