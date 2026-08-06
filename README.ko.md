# react-device-check

[![npm version](https://badge.fury.io/js/react-device-check.svg)](https://badge.fury.io/js/react-device-check)
[![npm downloads](https://img.shields.io/npm/dm/react-device-check.svg)](https://www.npmjs.com/package/react-device-check)

[English](README.md) | [한국어](README.ko.md)

**웹사이트 / 라이브 데모**: [react-device-check-site.vercel.app/ko](https://react-device-check-site.vercel.app/ko)

**경량 · 정확 · SSR-safe React 기기 판별 훅.** 사용자가 폰인지 태블릿인지 데스크톱인지, 어떤 OS인지를 의존성 0개, 전체 ~1.5 kB(min+brotli)로 판별합니다. Next.js에서 hydration 에러가 발생하지 않습니다.

2026년의 기기 판별은 보기보다 어렵습니다. iPad는 자신을 Mac이라고 위장하고, Chrome은 User-Agent 문자열을 동결했으며(모든 안드로이드 모델명이 `K`로 보고됨), Samsung DeX는 폰에서 데스크톱 리눅스 UA를 보내고, iOS 26은 OS 버전 토큰을 영구 동결했습니다. `react-device-check`는 여전히 동작하는 신호들 — User-Agent Client Hints, UA 문자열, `maxTouchPoints` 교차검증 — 을 정규식 데이터베이스가 아닌 작고 결정론적인 판별 트리로 융합합니다.

## 왜 react-device-check인가?

- **다른 라이브러리가 틀리는 곳에서 정확** — iPadOS 13+가 macOS 데스크톱 UA를 보내도 iPad를 태블릿으로 정확히 판별(`MacIntel` + 멀티터치 언마스킹). 안드로이드 태블릿은 공식 `Mobile` 토큰 규칙으로 구분. Samsung DeX, 웹뷰(카카오톡, 인스타그램 등), 레거시 UA까지 처리.
- **Client Hints 우선** — Chromium에서는 `navigator.userAgentData`를 신뢰(UA 동결에 면역), 그 외에는 UA 파싱으로 폴백. 이 둘을 모두 하는 라이브러리는 사실상 없습니다.
- **구조적으로 SSR-safe** — 서버 렌더와 hydration 첫 페인트가 항상 일치하므로 React 18/19에서는 hydration mismatch가 기록되지 않습니다 (React 17 + SSR은 문서화된 예외 — 알려진 한계 참조). hydration 직후 1회 렌더로 실제 값으로 교정됩니다.
- **작고 tree-shakeable** — 런타임 의존성 0개, `sideEffects: false`, ESM/CJS 듀얼. `useIsMobile`만 import하면 ~1.1 kB이며 반응형 스토어 전체가 번들에서 제거됩니다. size-limit으로 CI에서 예산을 강제합니다.
- **하이브리드 반응성** — `type`/`os`는 세션 동안 고정(UA 사실은 리로드 없이 변하지 않음), `isTouchPrimary`와 `orientation`은 `matchMedia` 리스너로 실시간 갱신 — 폴더블, DeX 도킹, iPad Stage Manager까지 커버.
- **실브라우저 검증** — 76개 단위 테스트에 더해, Playwright E2E 매트릭스(iPhone 15, iPad Pro, Galaxy S24, Galaxy Tab S9, 데스크톱 Chrome/Safari)가 실제 Chromium/WebKit 엔진에서 판별 결과와 hydration 에러 0건을 검증합니다.

### react-device-detect는요?

[react-device-detect](https://www.npmjs.com/package/react-device-detect)는 import 시점에 UA로 상수를 계산해서 SSR에서 크래시하거나 mismatch가 나고, iPad를 데스크톱으로 오판하며, 값이 갱신되지 않고, tree-shaking이 불가능한 ~13 kB gzip을 항상 배송합니다. 2023년 이후 유지보수가 중단됐고, 파서 의존성(ua-parser-js v2)이 AGPL로 전환되어 현대화가 막혀 있습니다. `react-device-check`는 오늘의 플랫폼 현실에 맞춰 설계된, 유지보수되는 MIT 대안입니다.

## 기능

- ✅ `useDevice()` — 반응형 필드를 포함한 전체 기기 스냅샷
- ✅ `useDeviceType()` / `useIsMobile()` / `useIsTablet()` / `useIsDesktop()` — 정적, 리스너 없음, 최대 tree-shaking
- ✅ `useOS()` — `'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'`
- ✅ `detectDevice()` — React 없이 쓸 수 있는 순수 엔진 (서버, vanilla JS)
- ✅ iPad 위장 해제, 안드로이드 태블릿 규칙, Samsung DeX, UA 축소 시대 대응
- ✅ SSR-safe: Next.js App Router/Pages Router, Remix 등 어디서나
- ✅ React 17, 18, 19 지원
- ✅ TypeScript 우선, 의존성 0개, MIT

## 설치

```bash
npm install react-device-check
```

```bash
yarn add react-device-check
```

```bash
pnpm add react-device-check
```

## 빠른 시작

```tsx
import { useDevice } from 'react-device-check';

function App() {
  const device = useDevice();

  // 아이폰       → { type: 'mobile',  os: 'ios',     isMobile: true,  ... }
  // 갤럭시 S24   → { type: 'mobile',  os: 'android', isMobile: true,  ... }
  // 아이패드     → { type: 'tablet',  os: 'ios',     isTablet: true,  ... }  ← 위장 해제!
  // 윈도우 PC    → { type: 'desktop', os: 'windows', isDesktop: true, ... }

  if (device.isMobile) {
    return <MobileOnboarding />;
  }
  return <DesktopOnboarding />;
}
```

값 하나만 필요하면 그 훅만 import하세요 — 나머지는 tree-shaking으로 제거됩니다:

```tsx
import { useIsMobile, useOS } from 'react-device-check';

function DownloadButton() {
  const isMobile = useIsMobile(); // boolean, 전체 ~1.1 kB
  const os = useOS(); // 'ios' | 'android' | ...

  if (isMobile && os === 'ios') return <AppStoreButton />;
  if (isMobile && os === 'android') return <PlayStoreButton />;
  return <DesktopDownloadButton />;
}
```

## API 레퍼런스

### `useDevice(): DeviceInfo`

전체 기기 스냅샷을 반환하고 반응형 변경을 구독합니다.

| 필드             | 타입                                                                 | 수명   | 설명                                                        |
| ---------------- | -------------------------------------------------------------------- | ------ | ----------------------------------------------------------- |
| `type`           | `'mobile' \| 'tablet' \| 'desktop'`                                  | 정적   | 기기 클래스                                                 |
| `os`             | `'ios' \| 'android' \| 'windows' \| 'macos' \| 'linux' \| 'unknown'` | 정적   | OS 계열                                                     |
| `isMobile`       | `boolean`                                                            | 정적   | `type === 'mobile'` 축약                                    |
| `isTablet`       | `boolean`                                                            | 정적   | `type === 'tablet'` 축약                                    |
| `isDesktop`      | `boolean`                                                            | 정적   | `type === 'desktop'` 축약                                   |
| `isTouchPrimary` | `boolean`                                                            | 반응형 | `(pointer: coarse)` — 마우스 연결 시(DeX, iPad) 실시간 전환 |
| `orientation`    | `'portrait' \| 'landscape'`                                          | 반응형 | 뷰포트 방향, 회전 시 갱신                                   |
| `isHydrated`     | `boolean`                                                            | —      | 서버·hydration 첫 페인트에서 `false`, 직후 `true`           |

> **참고:** `type`과 `os`는 의도적으로 세션당 고정입니다. UA 사실은 페이지 리로드 없이 변하지 않으며, 고정 유지가 UI 흔들림을 방지합니다. 뷰포트 의존적인 것은 반응형 필드(또는 CSS)를 사용하세요.

### 정적 훅

```ts
useDeviceType(): 'mobile' | 'tablet' | 'desktop'
useOS(): 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
useIsMobile(): boolean
useIsTablet(): boolean
useIsDesktop(): boolean
```

미디어 리스너를 전혀 부착하지 않습니다. 이 훅들만 import하면 반응형 스토어 전체가 번들에서 제거됩니다 (size-limit CI 체크로 강제).

### `detectDevice(input?, options?)` — React 불필요

훅 뒤에 있는 순수 엔진입니다. 모든 신호가 주입 가능해서 서버에서도 사용할 수 있습니다:

```ts
import { detectDevice } from 'react-device-check';

// 서버(Express, Next.js middleware 등)에서: 요청 UA를 전달.
const { type, os } = detectDevice({ ua: req.headers['user-agent'] });

// 신호 없는 환경을 위한 커스텀 fallback:
detectDevice(undefined, { fallback: { type: 'mobile' } });
```

| `DetectionInput` 필드 | 클라이언트에서 읽는 곳     |
| --------------------- | -------------------------- |
| `ua`                  | `navigator.userAgent`      |
| `uaData`              | `navigator.userAgentData`  |
| `maxTouchPoints`      | `navigator.maxTouchPoints` |
| `platform`            | `navigator.platform`       |
| `screen`              | `screen.width` / `height`  |

### `getNavigatorInput(): DetectionInput | undefined`

위 신호들을 브라우저 전역에서 읽어오는 함수 — 훅이 내부에서 쓰는 것과 동일한 리더입니다. `window`가 없는 환경에서는 `undefined`를 반환합니다: 웹 워커, 그리고 전역 `navigator`를 탑재한 Node 21+가 여기에 해당합니다 (Node의 `navigator.platform`은 **서버 머신**을 반영하므로 기기 판별에 신뢰하면 안 됩니다). `detectDevice`와 조합해 특정 신호만 바꿔볼 때 유용합니다:

```ts
import { detectDevice, getNavigatorInput } from 'react-device-check';

const result = detectDevice({ ...getNavigatorInput(), screen: undefined });
```

## SSR 동작 (Next.js)

서버는 기기를 알 수 없으므로 계약은 다음과 같습니다:

```
① 서버 렌더        → 동결된 기본값: { type: 'desktop', os: 'unknown', isHydrated: false }
② hydration 페인트 → 동일한 기본값 → 서버·클라이언트 HTML 항상 일치 → hydration 에러 없음
③ 직후             → 실제 값으로 1회 교정 렌더, isHydrated: true
```

- 순수 CSR 앱(Vite, CRA)은 ①②를 건너뜁니다 — 첫 렌더부터 정확한 값.
- 첫 페인트에서 추측하면 안 되는 UI는 `isHydrated`로 중립 플레이스홀더를 렌더하세요.
- **레이아웃은 CSS 미디어 쿼리로, 이 훅은 행동 분기용으로** (어떤 SDK를 로드할지, 어떤 플로우를 시작할지, 어디로 리다이렉트할지). 그러면 교정 렌더와 무관하게 CLS가 0으로 유지됩니다.
- 번들에 `'use client'` 배너가 포함되어 있어, React Server Component에서 import하면 알 수 없는 훅 에러 대신 명확한 경계 에러가 발생합니다.

## 판별 원리

신호를 우선순위로 융합합니다:

1. **User-Agent Client Hints** (`navigator.userAgentData`, Chromium 전용) — 존재하면 권위 신호. UA 동결에 면역. 안드로이드 태블릿은 공식 `Mobile` 토큰 규칙으로 폰과 구분.
2. **UA 문자열** (Safari, Firefox, 웹뷰) — `iPhone`/`iPad` 토큰, 안드로이드 `Mobi` 규칙, `Windows`/`Mac`/`Linux` 계열.
3. **`maxTouchPoints` 교차검증** — 터치포인트가 1보다 큰 "Mac"은 데스크톱 UA로 위장한 Apple 터치 기기(iPadOS 13+ 기본값). 화면 최단변으로 데스크톱 모드 iPhone과 iPad를 구분.

## 알려진 한계

정직한 판별이란 판별할 수 없는 것을 문서화하는 것입니다:

- **SSR은 데스크톱 모드 iPad를 볼 수 없음** — 데스크톱 모드 iPad의 요청은 Mac과 바이트 단위로 동일합니다. 서버는 fallback을 렌더하고, 클라이언트가 hydration 직후 교정합니다.
- **iPhone "데스크톱 웹사이트 요청"**은 화면 크기로 언마스킹하며, 화면 정보가 없으면 `tablet`/`ios`로 보고됩니다.
- **Samsung DeX는 `desktop`으로 보고** (Samsung 공식 가이드), `SamsungBrowser` 토큰이 보이면 `os: 'android'`.
- **Chrome 안드로이드 "데스크톱 사이트 요청"**은 `desktop`/`linux` — 기능이 설계대로 동작하는 것이며, 실제 리눅스 데스크톱과 구분 불가능합니다.
- **폴더블**(갤럭시 폴드/플립)은 양쪽 화면 모두 `mobile` — UA 신호가 존재하지 않습니다. 폴드 대응 UI는 뷰포트 기반 레이아웃을 사용하세요.
- **윈도우 터치 노트북과 Surface는 `desktop`** — 터치 능력은 기기 정체성이 아닙니다 (Google·Microsoft 가이드와 일치).
- **ChromeOS는 `os: 'linux'`**, visionOS Safari는 `tablet`/`ios`로 보고됩니다.
- **TV는 `desktop`으로 보고** — Android TV / Fire TV / BRAVIA / Chromecast UA는 best-effort TV 마커로 감지해 `desktop`으로 매핑합니다. 3분류 택소노미에서 터치 없는 10-foot UI에 가장 가까운 값입니다.
- **HarmonyOS NEXT는 `os: 'unknown'`** — ArkWeb의 `Phone`/`Tablet` 토큰으로 `type`은 정확히 판별하지만, v1 OS 유니언에 HarmonyOS 값이 없습니다.
- **봇**은 에뮬레이션하는 기기대로 분류됩니다 (Googlebot 스마트폰 → `mobile`/`android`).
- **UA 스푸핑에는 무방비** — 클라이언트 사이드 판별은 결정론적일 수는 있어도 적대적 환경을 이길 수는 없습니다.
- **React 17 + SSR은 hydration 경고가 기록될 수 있음** — React 17에는 `useSyncExternalStore`가 없어 내부 폴백(공식 shim과 동일한 한계)이 hydration 첫 페인트에 클라이언트 스냅샷을 렌더합니다. React 18/19는 구조적으로 mismatch가 없고, React 17 CSR은 영향이 없습니다.

## 로드맵

- 인앱 브라우저 판별 (카카오톡, 네이버, 인스타그램, 라인, 위챗, 일반 웹뷰) + 외부 브라우저 탈출 헬퍼
- `<DeviceProvider ssrDevice={...}>` — 서버에서 파싱한 UA를 주입해 첫 페인트부터 정확한 값
- 프레임워크 없이 쓰는 `react-device-check/core` subpath
- 비동기 `getHighEntropyValues`/`formFactors` 정밀화 (크롬북 태블릿)
- 브라우저명 판별

## 로컬 개발

```bash
pnpm install
pnpm test           # 단위 테스트 (vitest + jsdom)
pnpm build          # dist/ 빌드 (ESM + CJS + 타입)
pnpm size           # 번들 사이즈 예산 검증
pnpm example        # CSR 예제 실행 (Vite, :3001)
pnpm example:next   # SSR 예제 실행 (Next.js, :3002)
pnpm e2e            # 두 예제에 대한 Playwright 기기 매트릭스 E2E
```

## 테스트

- **85개 단위 테스트** — 실제 UA 문자열 48개 픽스처 매트릭스 포함 (동결된 Chrome UA, iOS 26, iPad 데스크톱 모드, DeX, Firefox 태블릿, 카카오톡 웹뷰, Fire TV, Opera Mini, HarmonyOS NEXT 등)
- **Playwright E2E** — 6개 기기 프로필에서 실제 Chromium/WebKit로 판별 결과, 서버 원본 HTML, hydration 에러 0건 검증
- CI는 React 17/18/19 호환 레그, `@arethetypeswrong/cli`, size-limit 예산을 실행

## 기여

이슈와 풀 리퀘스트를 환영합니다! 제출 전에 `pnpm lint && pnpm typecheck && pnpm test`를 실행해주세요.

## 라이선스

[MIT](LICENSE) © [umsungjun](https://github.com/umsungjun)

---

**Keywords:** react 기기 판별 훅, react-device-detect 대안, 모바일 태블릿 데스크톱 판별 react, 아이패드 판별 react, useIsMobile 훅, SSR 안전 기기 판별, Next.js 기기 판별, user agent client hints react
