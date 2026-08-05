# react-device-check

[![npm version](https://badge.fury.io/js/react-device-check.svg)](https://badge.fury.io/js/react-device-check)
[![npm downloads](https://img.shields.io/npm/dm/react-device-check.svg)](https://www.npmjs.com/package/react-device-check)

[English](README.md) | [한국어](README.ko.md)

**Lightweight, accurate, SSR-safe React hooks for device detection.** Know whether your user is on a phone, tablet, or desktop — and which OS — with zero dependencies, ~1.5 kB (min+brotli) for everything, and no hydration errors in Next.js.

Detecting devices in 2026 is harder than it looks: iPads masquerade as Macs, Chrome froze its User-Agent string (every Android model reports `K`), Samsung DeX sends a desktop Linux UA from a phone, and iOS 26 froze its OS version token forever. `react-device-check` fuses the signals that still work — User-Agent Client Hints, the UA string, and `maxTouchPoints` cross-checks — into a small deterministic decision tree instead of a regex database.

## Why react-device-check?

- **Accurate where others fail** — correctly reports iPads as tablets even though iPadOS 13+ sends a macOS desktop UA (`MacIntel` + multitouch unmasking); classifies Android tablets via the official `Mobile`-token rule; handles Samsung DeX, WebViews (KakaoTalk, Instagram, …), and legacy UAs.
- **Client Hints first** — trusts `navigator.userAgentData` on Chromium (immune to UA freezing), falls back to UA parsing everywhere else. No library with meaningful adoption does both.
- **SSR-safe by construction** — the server render and hydration first paint always agree, so React never logs a hydration mismatch on React 18/19 (React 17 + SSR is a documented exception — see known limitations). The hook corrects itself in one post-hydration render.
- **Tiny and tree-shakeable** — zero runtime dependencies, `sideEffects: false`, dual ESM/CJS. Importing only `useIsMobile` ships ~1.1 kB and drops the reactive store entirely. Budgets are enforced in CI with size-limit.
- **Hybrid reactivity** — `type`/`os` are stable for the session (UA facts can't change without a reload), while `isTouchPrimary` and `orientation` update live via `matchMedia` listeners — covering foldables, DeX docking, and iPad Stage Manager.
- **Proven in real browsers** — beyond 76 unit tests, a Playwright E2E matrix (iPhone 15, iPad Pro, Galaxy S24, Galaxy Tab S9, desktop Chrome/Safari) verifies detection and zero hydration errors against real Chromium and WebKit engines.

### What about react-device-detect?

[react-device-detect](https://www.npmjs.com/package/react-device-detect) computes import-time constants from the UA, which crashes or mismatches under SSR, misreports iPads as desktops, never updates, and ships ~13 kB gzip that cannot be tree-shaken. It has been unmaintained since 2023, and its parser dependency (ua-parser-js v2) moved to AGPL — blocking modernization. `react-device-check` is a maintained MIT replacement designed around today's platform realities.

## Features

- ✅ `useDevice()` — full device snapshot with live reactive fields
- ✅ `useDeviceType()` / `useIsMobile()` / `useIsTablet()` / `useIsDesktop()` — static, listener-free, maximally tree-shakeable
- ✅ `useOS()` — `'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'`
- ✅ `detectDevice()` — the pure engine, usable without React (servers, vanilla JS)
- ✅ iPad-as-Mac unmasking, Android tablet rule, Samsung DeX, UA-reduction era support
- ✅ SSR-safe: works in Next.js App Router/Pages Router, Remix, anywhere
- ✅ React 17, 18, and 19 support
- ✅ TypeScript-first, zero dependencies, MIT

## Installation

```bash
npm install react-device-check
```

```bash
yarn add react-device-check
```

```bash
pnpm add react-device-check
```

## Quick Start

```tsx
import { useDevice } from 'react-device-check';

function App() {
  const device = useDevice();

  // iPhone      → { type: 'mobile',  os: 'ios',     isMobile: true,  ... }
  // Galaxy S24  → { type: 'mobile',  os: 'android', isMobile: true,  ... }
  // iPad        → { type: 'tablet',  os: 'ios',     isTablet: true,  ... }  ← unmasked!
  // Windows PC  → { type: 'desktop', os: 'windows', isDesktop: true, ... }

  if (device.isMobile) {
    return <MobileOnboarding />;
  }
  return <DesktopOnboarding />;
}
```

Need just one value? Import just that hook — the rest of the library tree-shakes away:

```tsx
import { useIsMobile, useOS } from 'react-device-check';

function DownloadButton() {
  const isMobile = useIsMobile(); // boolean, ~1.1 kB total
  const os = useOS(); // 'ios' | 'android' | ...

  if (isMobile && os === 'ios') return <AppStoreButton />;
  if (isMobile && os === 'android') return <PlayStoreButton />;
  return <DesktopDownloadButton />;
}
```

## API Reference

### `useDevice(): DeviceInfo`

Returns the full device snapshot and subscribes to reactive changes.

| Field            | Type                                    | Lifetime | Description                                                              |
| ---------------- | --------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `type`           | `'mobile' \| 'tablet' \| 'desktop'`     | static   | Device class                                                             |
| `os`             | `'ios' \| 'android' \| 'windows' \| 'macos' \| 'linux' \| 'unknown'` | static | OS family                        |
| `isMobile`       | `boolean`                               | static   | Sugar for `type === 'mobile'`                                            |
| `isTablet`       | `boolean`                               | static   | Sugar for `type === 'tablet'`                                            |
| `isDesktop`      | `boolean`                               | static   | Sugar for `type === 'desktop'`                                           |
| `isTouchPrimary` | `boolean`                               | reactive | `(pointer: coarse)` — flips live when a mouse is attached (DeX, iPad)    |
| `orientation`    | `'portrait' \| 'landscape'`             | reactive | Viewport orientation, updates on rotation                                |
| `isHydrated`     | `boolean`                               | —        | `false` on the server and hydration first paint, `true` right after      |

> **Note:** `type` and `os` are intentionally static per session. User-agent facts cannot change without a page load, and keeping them stable prevents UI flapping. Use the reactive fields (or CSS) for anything viewport-dependent.

### Static hooks

```ts
useDeviceType(): 'mobile' | 'tablet' | 'desktop'
useOS(): 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
useIsMobile(): boolean
useIsTablet(): boolean
useIsDesktop(): boolean
```

These never attach media listeners. Importing only these drops the whole reactive store from your bundle (enforced by a size-limit CI check).

### `detectDevice(input?, options?)` — no React required

The pure engine behind the hooks. All signals are injectable, which also makes it usable on servers:

```ts
import { detectDevice } from 'react-device-check';

// On a server (Express, Next.js middleware, etc.): pass the request UA.
const { type, os } = detectDevice({ ua: req.headers['user-agent'] });

// With a custom fallback for signal-less environments:
detectDevice(undefined, { fallback: { type: 'mobile' } });
```

| `DetectionInput` field | Read from (client)          |
| ---------------------- | --------------------------- |
| `ua`                   | `navigator.userAgent`       |
| `uaData`               | `navigator.userAgentData`   |
| `maxTouchPoints`       | `navigator.maxTouchPoints`  |
| `platform`             | `navigator.platform`        |
| `screen`               | `screen.width` / `height`   |

### `getNavigatorInput(): DetectionInput | undefined`

Reads all of the above signals from the browser globals — the same reader the hooks use internally. Returns `undefined` outside a `window` environment: that includes web workers and Node 21+, which ships a global `navigator` whose `platform` reflects the **server machine** and must not be trusted for device detection. Useful for composing with `detectDevice` when you want to tweak one signal:

```ts
import { detectDevice, getNavigatorInput } from 'react-device-check';

const result = detectDevice({ ...getNavigatorInput(), screen: undefined });
```

## SSR behavior (Next.js)

The server cannot know the device, so the contract is:

```
① Server render     → frozen default: { type: 'desktop', os: 'unknown', isHydrated: false }
② Hydration paint   → same default    → server and client HTML always match → no hydration error
③ Right after       → one correction render with the real values, isHydrated: true
```

- Pure CSR apps (Vite, CRA) skip ①② — values are correct from the very first render.
- Use `isHydrated` to render neutral placeholders when the first paint must not guess.
- **Layout should come from CSS media queries; use this hook for behavior** (which SDK to load, which flow to start, where to redirect). That keeps CLS at zero regardless of the correction render.
- The bundle ships a `'use client'` banner, so importing it from a React Server Component fails with a clear boundary error instead of a cryptic hooks error.

## How detection works

Signals are fused in priority order:

1. **User-Agent Client Hints** (`navigator.userAgentData`, Chromium only) — authoritative when present; immune to UA freezing. Android tablets are split from phones via the official `Mobile`-token rule.
2. **UA string** (Safari, Firefox, WebViews) — `iPhone`/`iPad` tokens, the Android `Mobi` rule, `Windows`/`Mac`/`Linux` families.
3. **`maxTouchPoints` cross-check** — a "Mac" with more than one touch point is an Apple touch device masquerading via a desktop UA (iPadOS 13+ default). The screen's shortest side separates desktop-mode iPhones from iPads.

## Known limitations

Honest detection means documenting what cannot be detected:

- **SSR cannot see desktop-mode iPads** — a desktop-mode iPad request is byte-identical to a Mac. The server renders the fallback; the client corrects it right after hydration.
- **iPhone "Request Desktop Website"** is unmasked via screen size; if screen dimensions are unavailable it reports `tablet`/`ios`.
- **Samsung DeX reports `desktop`** (Samsung's own guidance) with `os: 'android'` when the `SamsungBrowser` token is visible.
- **Chrome Android "Request desktop site"** reports `desktop`/`linux` — that is the feature working as designed; it is indistinguishable from a real Linux desktop.
- **Foldables** (Galaxy Fold/Flip) report `mobile` on both screens — no UA signal exists. Use viewport-based layout for fold-aware UI.
- **Windows touch laptops and Surface report `desktop`** — touch capability is not device identity (matching Google's and Microsoft's guidance).
- **ChromeOS reports `os: 'linux'`**; visionOS Safari reports `tablet`/`ios`.
- **TVs report `desktop`** — Android TV / Fire TV / BRAVIA / Chromecast UAs are detected via best-effort TV markers and mapped to `desktop`, the closest fit in a three-way taxonomy for a 10-foot no-touch UI.
- **HarmonyOS NEXT reports `os: 'unknown'`** — ArkWeb's `Phone`/`Tablet` tokens drive the correct `type`, but the v1 OS union has no HarmonyOS value.
- **Bots** classify as whatever device they emulate (Googlebot smartphone → `mobile`/`android`).
- **UA spoofing wins** — client-side detection can only be deterministic, not adversarial.
- **React 17 + SSR may log a hydration warning** — React 17 has no `useSyncExternalStore`, and the internal fallback (like the official shim) renders the client snapshot on the hydration first paint. React 18/19 are mismatch-free by construction; React 17 CSR is unaffected.

## Roadmap

- In-app browser detection (KakaoTalk, Naver, Instagram, Line, WeChat, generic WebView) with external-browser escape helpers
- `<DeviceProvider ssrDevice={...}>` — feed a server-parsed UA for a correct first paint
- `react-device-check/core` subpath for framework-free usage
- Async `getHighEntropyValues`/`formFactors` refinement (Chromebook tablets)
- Browser name detection

## Local development

```bash
pnpm install
pnpm test           # unit tests (vitest + jsdom)
pnpm build          # build dist/ (ESM + CJS + types)
pnpm size           # verify bundle-size budgets
pnpm example        # run the CSR example (Vite, :3001)
pnpm example:next   # run the SSR example (Next.js, :3002)
pnpm e2e            # Playwright device-matrix E2E against both examples
```

## Testing

- **85 unit tests** including a 48-fixture matrix of real-world UA strings (frozen Chrome UAs, iOS 26, iPad desktop mode, DeX, Firefox tablets, KakaoTalk WebView, Fire TV, Opera Mini, HarmonyOS NEXT, …)
- **Playwright E2E** on real Chromium/WebKit across six device profiles, asserting detection results, raw server HTML, and zero hydration errors
- CI runs React 17/18/19 compatibility legs, `@arethetypeswrong/cli`, and size-limit budgets

## Contributing

Issues and pull requests are welcome! Please run `pnpm lint && pnpm typecheck && pnpm test` before submitting.

## License

[MIT](LICENSE) © [umsungjun](https://github.com/umsungjun)

---

**Keywords:** react device detection hook, react-device-detect alternative, detect mobile tablet desktop react, iPad detection react, useIsMobile hook, SSR-safe device detection, Next.js device detection, user agent client hints react, react device type hook, zero dependency device detect
