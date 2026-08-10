import { DeviceDemo } from './DeviceDemo';

// A Server Component wrapping the client demo. The library itself carries the 'use client' banner, so importing it here directly would fail with a clear boundary error (by design).
export default function Page() {
  return (
    <main className="page">
      <h1>react-device-check</h1>
      <p className="subtitle">
        Next.js App Router (SSR): the server renders a safe default, then the
        client corrects it right after hydration with zero hydration errors.
        Open the browser console to verify.
      </p>
      <DeviceDemo />
    </main>
  );
}
