# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm build          # Build library to dist/ (CJS + ESM + .d.ts + .d.mts)
pnpm test           # Run unit tests once (vitest + jsdom)
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Generate coverage report
pnpm size           # Verify bundle-size budgets (size-limit; requires a prior build)
pnpm e2e            # Playwright device-matrix E2E (builds + starts both example apps)
pnpm format         # Format with Prettier
pnpm format:check   # Verify formatting without writing (used in CI)
pnpm lint           # ESLint (flat config, includes react-hooks rules)
pnpm typecheck      # tsc --noEmit
pnpm example        # Run the CSR example (Vite, :3001)
pnpm example:next   # Run the SSR example (Next.js, :3002)
pnpm website        # Run the promo website (Next.js, :3003)

# Run a specific test by name pattern
pnpm vitest run -t "test name pattern"
```

## Architecture

**react-device-check** detects the device type (mobile/tablet/desktop) and OS from user-agent signals. It is a hooks library with a pure, framework-free detection engine underneath.

### Core flow

1. `src/types.ts`: all public types (`DeviceType`, `OS`, `DeviceInfo`, `DetectionInput`, …)
2. `src/core/detect.ts`: `detectDevice(input, options)`: the pure decision-tree engine. Tier 1 trusts Chromium Client Hints (`uaData.mobile`/`platform`); Tier 2 parses the UA string cross-checked with `maxTouchPoints` (iPad-as-Mac unmasking). Deterministic: same input → same output; no globals.
3. `src/core/env.ts`: `isServer` + `getNavigatorInput()`: the only place globals are read. Gated on `window` because Node 21+ ships a global `navigator` that would misreport the server's OS.
4. `src/core/static.ts`: session cache of the static info + the frozen `SERVER_STATIC` default (`desktop`/`unknown`).
5. `src/core/media.ts`: the `listen`/`unlisten` matchMedia helpers (Safari < 14 `addListener` fallback) shared by every reactive store.
6. `src/core/store.ts`: the reactive store for `useDevice()`: lazily attaches two `matchMedia` listeners (`(pointer: coarse)`, `(orientation: portrait)`) with the first subscriber, caches the snapshot object so its reference only changes when a reactive field changes (useSyncExternalStore requirement).
7. `src/core/dpr.ts`: the reactive store for `useDevicePixelRatio()`: one `(resolution: Xdppx)` listener whose query always describes the cached ratio, so a change event means the ratio moved. On a real change it re-arms on the new query; when the ratio is unchanged it returns before touching the listener (re-arming mid-dispatch would re-enter the handler).
8. `src/compat.ts`: `useSES`: native `useSyncExternalStore` when available, otherwise a ~20-line React 17 fallback. Uses namespace property access (not a named import) so React 17 doesn't throw.
9. `src/useDevice.ts` / `src/useDeviceType.ts` / `src/useOS.ts` / `src/useDevicePixelRatio.ts`: thin hook wrappers. Static hooks import only `core/static`, so importing them alone tree-shakes the reactive store away; `useDevicePixelRatio` imports only `core/dpr`, so it brings neither the detection engine nor the device listeners (both verified by the size-limit budgets).

### Invariants to preserve

- **No module-top-level access to `window`/`navigator`**: all detection is lazy. This is the SSR-safety foundation.
- **Snapshot references must be stable**: `getServerSnapshot` returns a frozen module constant; the client snapshot is cached and only replaced when a reactive field changes. Fresh objects per call make React loop infinitely.
- **Branch order in `detect.ts` matters**: iPhone before Mac (`like Mac OS X`), Android before Windows/Linux (`Linux; Android`), the generic `/Mobi/` catch-all before Windows/Linux (Windows Phone/Tizen/Sailfish carry desktop OS tokens plus a mobile marker), TV markers before the Android tablet verdict, Tier 1 before Tier 2 (safe because iOS browsers never expose `userAgentData`). Case-sensitive regexes keep jsdom's lowercase `(darwin)` out.
- **`maxTouchPoints` is consulted ONLY in the Apple-masquerade branch**: touch laptops/Surface must stay `desktop`.
- **`type`/`os` are static per session by contract**; within `DeviceInfo` only `isTouchPrimary`/`orientation` are reactive.
- **The device pixel ratio stays out of `DeviceInfo`**: it lives in its own store so `useDevice()` keeps exactly two listeners and its budget stays flat. Adding a field there would charge every `useDevice()` caller for a listener they did not ask for.

### SSR contract

Server render and hydration first paint both return the frozen default (`desktop`/`unknown`, `isHydrated: false`) so server and client HTML always match; the hook corrects itself in one post-hydration render. `useDevicePixelRatio()` follows the same contract with a frozen default of `1`. The dist bundle carries a `'use client'` banner (added in `vite.config.ts`).

### Testing

- `src/test/fixtures.ts`: 48 real-world UA fixtures; `detect.test.ts` runs the matrix via pure injection (no global mocks). Update the fixture counts in both READMEs and this file when adding fixtures, and the unit-test counts in both READMEs plus `website/content/en.ts` and `ko.ts`.
- `src/test/helpers.ts` (`vi.stubGlobal` navigator stub, `stubDevicePixelRatio`, `dprQuery`) + `matchMediaMock.ts` (controllable harness) for store/hook tests; `setup.ts` resets the session caches and unstubs globals after each test.
- `matchMediaMock.ts` keys off the raw query string with no media-query semantics, so DPR tests must drive the exact generated query (`dprQuery(2)`) and re-read `listenerCount` on the new string after a change.
- Hook tests use **probe components, not renderHook**: the React 17 CI leg pins RTL 12 which has no renderHook.
- `ssr.test.tsx` runs with `// @vitest-environment node` to exercise the real no-DOM path.
- `e2e/device-detection.spec.ts`: Playwright matrix (iPhone 15, iPad Pro 11, Galaxy S24, Galaxy Tab S9 with `isMobile: false` to reproduce real tablet Client Hints, desktop Chrome/Safari) against both examples. The SSR test asserts the raw server HTML and zero hydration console errors. The expected pixel ratio is read from the Playwright descriptor's `deviceScaleFactor` rather than duplicated in the spec.

### Adding a detection rule

1. Add the branch to `src/core/detect.ts` (mind the branch-order invariants above)
2. Add fixture(s) to `src/test/fixtures.ts` with real UA strings
3. Update the known-limitations section in `README.md` **and** `README.ko.md` if behavior is a documented trade-off

### Code style

Write all code comments in English. This overrides the global "Korean comments" rule. The library is published to npm for an international audience. User-facing documentation keeps a Korean translation (`README.ko.md`).

Never use an em dash (`—`) anywhere: code, comments, commit messages, READMEs, website copy, or the npm `description`.
Use a comma, a colon, parentheses, or a separate sentence instead.
`grep -rn '—'` outside `node_modules`/`.next`/`dist`/`coverage` must stay empty.
The en dash in a numeric range (`React 17–19`) is not affected.

### Commit messages

Write commit messages in English, subject and body, overriding the global Korean commit-message convention. The repository is public and its history is read by an international audience, same rationale as the code-comment rule above. Keep the rest of the global convention: one sentence per line (no width-driven wrapping), and no `Co-Authored-By` footer.

### Build output

Vite library mode produces `dist/index.js` (CJS), `dist/index.mjs` (ESM), `dist/index.d.ts` (rolled-up declarations), and `dist/index.d.mts` (copied by the build script). Both JS bundles start with a `'use client'` banner. Dual-package resolution is verified with `pnpm dlx @arethetypeswrong/cli --pack .`.

React is the only external (peer dependency). Bundle budgets: everything ≤ 2 kB, `{ useIsMobile }` ≤ 1.15 kB, `{ useDevice }` ≤ 1.5 kB, `{ detectDevice }` ≤ 0.9 kB, `{ useDevicePixelRatio }` ≤ 0.7 kB (min+brotli, enforced by `pnpm size`). If a budget changes, keep the size claims in both READMEs, `website/content/{en,ko}.ts`, `website/content/code.ts`, and `website/lib/seo.ts` in sync.

### Examples

- `examples/basic`: Vite CSR app importing the library source (`../../src`) directly.
- `examples/nextjs`: Next.js 15 App Router app consuming the **built package** via `"react-device-check": "link:../.."`, so run `pnpm build` at the root before starting it.

### Website

`website/` is a standalone Next.js 15 promo/landing site (own lockfile, not a workspace member) consuming the **published npm package**. Unlike both examples, it needs no root build. English at `/`, Korean at `/ko` via two route-group root layouts (each sets its own `<html lang>`); hreflang/canonical/OG metadata come from `website/lib/seo.ts` (`SITE_URL` is the single deploy-URL definition). The OG image is the static `website/public/og.png`, referenced explicitly in `lib/seo.ts` (the `opengraph-image` file convention does not inject meta tags across route-group root layouts). Deployed on Vercel with Root Directory = `website`; excluded from CI, lint, size-limit, and the Playwright E2E matrix. The examples' ports and `data-testid` contracts are untouched by it.

### Package manager

This project uses `pnpm` and Node 20.x (see `.nvmrc`). Use `pnpm` for all install/run commands.
