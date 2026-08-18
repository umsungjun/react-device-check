# react-device-check

[![npm version](https://badge.fury.io/js/react-device-check.svg)](https://badge.fury.io/js/react-device-check)
[![npm downloads](https://img.shields.io/npm/dm/react-device-check.svg)](https://www.npmjs.com/package/react-device-check)
[![codecov](https://codecov.io/gh/umsungjun/react-device-check/branch/main/graph/badge.svg)](https://codecov.io/gh/umsungjun/react-device-check)

[English](README.md) | [한국어](README.ko.md)

**Website / live demo**: [react-device-check-site.vercel.app](https://react-device-check-site.vercel.app)

**A React hook that tells you whether your user is on a phone, tablet, or desktop, and which OS they run.** No dependencies, and ~1.6 kB (min+brotli) even if you use all of it. It works on React 17, 18, and 19, ships its own type definitions, and does not break in Next.js or anywhere else that builds HTML on the server first.

## What this solves

One hook call gives you the device class and the OS.

```tsx
const { type, os, isMobile, isTablet, isDesktop } = useDevice();

// type → 'mobile' | 'tablet' | 'desktop'
// os   → 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
```

Values that change while the page is open, such as orientation, come along too. The full list is in the [API reference](#api-reference).

Reading them is that simple. The hard part is making them correct, and these three cases are why.

**Your iPad users get the desktop layout.**
Browsers send a User-Agent (UA) string with every request. Since iPadOS 13, an iPad writes "Mac" into that string. Any library that only reads the UA believes it.

→ Read `maxTouchPoints` alongside the UA. A real Mac reports 0 and an iPad reports 5, so a "Mac" that five fingers can touch is an iPad.

**Android phones and tablets look identical.**
Chrome stripped the model name out of the UA, so every Android device now reports `K`. Guessing from screen size breaks the moment someone resizes the window.

→ Chromium browsers also expose Client Hints, a separate set of fields that still answers "is this a phone" no matter what the UA hides. Where those are missing, the UA's `Mobile` marker splits phones from tablets, which is the method Google documents.

**Your Next.js console fills up with hydration errors.**
When HTML is built on the server, there is no way to know what device is asking for it. The browser, of course, knows. So the server's HTML and the browser's first paint disagree, and React reports it as an error. (Hydration is the step where React takes over the HTML the server already produced.)

→ On that first paint, server and browser both use `desktop` / `unknown`. There is nothing that can disagree, so there is no error. The real values land one render later.

The reasoning and the exceptions are spelled out in [how detection works](#how-detection-works) and [known limitations](#known-limitations).

## Compared with react-device-detect

[react-device-detect](https://www.npmjs.com/package/react-device-detect) computes constants from the UA at import time. That crashes or mismatches under SSR. It also calls iPads desktops. Values never refresh, and because unused parts cannot be dropped it always ships ~13 kB gzip. Maintenance stopped in 2023, and its parser dependency (ua-parser-js v2) moved to AGPL, which blocks modernization.

Almost no library does both Client Hints and UA parsing. `react-device-check` is a maintained MIT alternative designed for how platforms actually behave today.

## Installation

```bash
npm install react-device-check
# yarn add react-device-check
# pnpm add react-device-check
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

Need just one value? Import just that hook.

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

Whatever you do not import is dropped at build time. `useIsMobile` on its own costs ~1.1 kB, and the code that watches for live changes such as rotation is never included at all. size-limit checks these numbers in CI.

## API Reference

### `useDevice(): DeviceInfo`

Returns the full device snapshot and subscribes to reactive changes.

| Field            | Type                                                                 | Lifetime | Notes                                                                |
| ---------------- | -------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `type`           | `'mobile' \| 'tablet' \| 'desktop'`                                  | static   | Device class                                                         |
| `os`             | `'ios' \| 'android' \| 'windows' \| 'macos' \| 'linux' \| 'unknown'` | static   | OS family                                                            |
| `isMobile`       | `boolean`                                                            | static   | Shorthand for `type === 'mobile'`                                    |
| `isTablet`       | `boolean`                                                            | static   | Shorthand for `type === 'tablet'`                                    |
| `isDesktop`      | `boolean`                                                            | static   | Shorthand for `type === 'desktop'`                                   |
| `isTouchPrimary` | `boolean`                                                            | reactive | `(pointer: coarse)`. Flips live when a mouse is attached (DeX, iPad) |
| `orientation`    | `'portrait' \| 'landscape'`                                          | reactive | Viewport orientation, updates on rotation                            |
| `isHydrated`     | `boolean`                                                            | one-shot | `false` on the server and hydration first paint, `true` right after  |

**Static** means the value is pinned until the page reloads. **Reactive** means a change re-renders your component.

> **Note:** `type` and `os` are deliberately fixed per session. What the UA tells you does not change until the page reloads, and pinning the values keeps the UI from jumping. Use the reactive fields (or CSS) for anything that depends on the viewport.

### Static hooks

```ts
useDeviceType(): 'mobile' | 'tablet' | 'desktop'
useOS(): 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
useIsMobile(): boolean
useIsTablet(): boolean
useIsDesktop(): boolean
```

These attach no media listeners at all. Import only these and the whole reactive store leaves the bundle.

### `useDevicePixelRatio(): number`

The number of physical pixels per CSS pixel: pick a `@2x`/`@3x` asset, scale a canvas backing store, or request map and chart tiles at the right resolution.

```tsx
import { useDevicePixelRatio } from 'react-device-check';

function Hero() {
  const dpr = useDevicePixelRatio();
  // Fixed width/height, so swapping the source costs no layout shift.
  return <img src={dpr >= 2 ? hero2x : hero1x} width={800} height={450} alt="" />;
}
```

Reactive: the ratio moves on browser zoom, on a display scale change, and when the window is dragged between screens of different densities. Server render and hydration first paint both report `1`, so there is nothing to mismatch, and the real ratio arrives one render later. The store is separate from `useDevice()`, so importing this hook alone costs 0.6 kB and brings neither the detection engine nor the device listeners.

### `detectDevice(input?, options?)` (no React required)

The pure engine behind the hooks. Every signal is injectable, so it runs on the server unchanged.

```ts
import { detectDevice } from 'react-device-check';

// On a server (Express, Next.js middleware, ...): pass the request UA.
const { type, os } = detectDevice({ ua: req.headers['user-agent'] });

// Custom fallback for environments with no signals:
detectDevice(undefined, { fallback: { type: 'mobile' } });
```

| `DetectionInput` field | Read from, on the client   |
| ---------------------- | -------------------------- |
| `ua`                   | `navigator.userAgent`      |
| `uaData`               | `navigator.userAgentData`  |
| `maxTouchPoints`       | `navigator.maxTouchPoints` |
| `platform`             | `navigator.platform`       |
| `screen`               | `screen.width` / `height`  |

### `getNavigatorInput(): DetectionInput | undefined`

Reads all of the above from the browser globals, using the same reader the hooks use internally. It returns `undefined` wherever there is no `window`, which means web workers and Node 21+ with its global `navigator`. Node's `navigator.platform` describes the **server machine**, so it must never be trusted for device detection. Pair this with `detectDevice` when you want to override one signal.

```ts
import { detectDevice, getNavigatorInput } from 'react-device-check';

const result = detectDevice({ ...getNavigatorInput(), screen: undefined });
```

## SSR behavior (Next.js)

The server cannot know the device, so the sequence goes like this.

```
① server render     → frozen default: { type: 'desktop', os: 'unknown', isHydrated: false }
② hydration paint   → same default → server and client HTML always match → no hydration error
③ right after       → one correcting render with the real values, isHydrated: true
```

Because the server and the browser use the same value for that first paint, the two can never disagree. That is why a hydration mismatch cannot happen on React 18/19. The same holds in Next.js App Router and Pages Router, Remix, and anywhere else. React 17 + SSR is the one exception, written up under known limitations.

- Pure CSR apps (Vite, CRA) skip ①② and get correct values from the very first render.
- For UI that must not guess on the first paint, check `isHydrated` and render a neutral placeholder.
- **Use CSS media queries for layout and this hook for behavior**, meaning which SDK to load, which flow to start, where to redirect. Do that and CLS stays at zero no matter what the correcting render does.
- `useDevicePixelRatio()` follows the same contract: `1` on the server and the first paint, the real ratio one render later.
- The bundle carries a `'use client'` banner, so importing it from a React Server Component raises a clear boundary error instead of a cryptic invalid-hook error.

## How detection works

Three values can identify a device, and they are checked in order. The same input always produces the same answer.

**1. User-Agent Client Hints** (`navigator.userAgentData`, Chromium only)

Where the UA is one long string, these arrive as separate fields: is this mobile, which OS. Chrome stripping the model name does not touch them. So whenever they exist, they are believed first.

On Android, phones and tablets split on the `mobile` field. An Android device reporting `mobile: false` is a tablet, which is the rule Google documents.

**2. UA string** (Safari, Firefox, webviews)

Used only in browsers that do not offer Client Hints. Does the string contain `iPhone` or `iPad`; on Android, is the `Mobi` marker there; otherwise is it `Windows`, `Mac`, or `Linux`. With `Mobi` it is a phone, without it a tablet.

**3. `maxTouchPoints` cross-check**

This is where an iPad claiming to be a Mac gets caught. A real Mac registers 0 simultaneous touch points; an iPad registers 5. So a "Mac" reporting more than one touch point is an Apple touch device wearing a desktop UA.

Whether that is an iPad or an iPhone in desktop mode comes down to the screen's shorter edge. The largest iPhone sits around 440px and the smallest iPad at 744px, so the two ranges never overlap.

In-app webviews such as KakaoTalk and Instagram, and older UA strings, all run through this same order.

## Known limitations

These are the cases where `react-device-check` answers wrongly or cannot know at all. They are collected here so you meet them on purpose rather than in production.

**Decided this way on purpose**

- Samsung DeX reports `desktop`. It is a phone being used like a desktop, and Samsung's own guidance says to treat it as one. When the `SamsungBrowser` marker is present, `os` stays `android`.
- Windows touch laptops and Surface are `desktop` too. Accepting touch does not turn a laptop into a tablet, which is Google's and Microsoft's position as well.
- TVs report `desktop`. Android TV, Fire TV, BRAVIA, and Chromecast are identified as best we can and mapped to `desktop`. Of mobile, tablet, and desktop, a screen you drive with a remote from across the room is closest to desktop.
- ChromeOS reports `os: 'linux'`, and visionOS Safari reports `tablet`/`ios`.
- Bots follow whatever device they imitate. Googlebot Smartphone comes back as `mobile`/`android`.

**No way to know**

- A server cannot recognise a desktop-mode iPad. The request is not one byte different from a Mac's. The server sends the default and the browser corrects it the moment it takes over.
- An iPhone with "Request Desktop Website" turned on comes back as `tablet`/`ios` when screen size is also unavailable. Given the screen size, it is correctly caught as a phone.
- Chrome on Android with "Request desktop site" reports `desktop`/`linux`. The browser is deliberately pretending to be a Linux desktop, so there is nothing left to tell them apart by.
- Foldables (Galaxy Fold/Flip) are `mobile` whether open or closed. Nothing reports the current fold state. Build screens that must react to unfolding with CSS media queries.
- Deliberately altered UA strings win. Detection gives a consistent answer for the values it receives, but it cannot catch someone who is lying on purpose.
- The server cannot know the pixel ratio either, so it always sends `1` and the browser corrects it after hydration. Unlike the device type there is no header to fall back on, because the UA string carries no display density. Chromium can negotiate one through Client Hints, but that is opt-in and Chromium only.
- Browser zoom is indistinguishable from a genuinely denser screen. Both move `devicePixelRatio` and nothing separates them.

**Not supported yet**

- HarmonyOS NEXT reports `os: 'unknown'`. The `type` is correct. HarmonyOS is simply not in the v1 `os` list yet.
- Safari before 16 has no `resolution` media query support, so the initial ratio is read correctly but never updates there. Ratios do not move on iOS anyway, so this only shows up on macOS Safari 15 when a window crosses displays.
- React 17 with server rendering may log a hydration warning. React 17 lacks `useSyncExternalStore`, so the fallback in its place paints the browser's value from the very first render. React's own official replacement has the same limitation. React 18/19 are unaffected, and React 17 without server rendering is fine too.

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

- 98 unit tests, including a fixture matrix of 48 real UA strings (frozen Chrome UA, iOS 26, iPad desktop mode, DeX, Firefox tablet, KakaoTalk webview, Fire TV, Opera Mini, HarmonyOS NEXT, and more).
- Playwright E2E drives 6 device profiles on real Chromium and WebKit, checking the verdicts, the raw server HTML, and zero hydration errors.
- CI runs React 17/18/19 compatibility legs, `@arethetypeswrong/cli`, and the size-limit budgets.

## Contributing

Issues and pull requests are welcome. Please run `pnpm lint && pnpm typecheck && pnpm test` before submitting.

## License

[MIT](LICENSE) © [umsungjun](https://github.com/umsungjun)

---

**Keywords:** react device detection hook, react-device-detect alternative, detect mobile tablet desktop react, ipad detection react, useIsMobile hook, SSR safe device detection, Next.js device detection, user agent client hints react, react device type hook, zero dependency device detect, device pixel ratio hook, retina detection react
