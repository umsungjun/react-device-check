# react-device-check

[![npm version](https://badge.fury.io/js/react-device-check.svg)](https://badge.fury.io/js/react-device-check)
[![npm downloads](https://img.shields.io/npm/dm/react-device-check.svg)](https://www.npmjs.com/package/react-device-check)
[![codecov](https://codecov.io/gh/umsungjun/react-device-check/branch/main/graph/badge.svg)](https://codecov.io/gh/umsungjun/react-device-check)

[English](README.md) | [한국어](README.ko.md)

**웹사이트 / 라이브 데모**: [react-device-check-site.vercel.app/ko](https://react-device-check-site.vercel.app/ko)

**사용자가 폰인지 태블릿인지 데스크톱인지, 어떤 OS를 쓰는지 알려주는 React 훅입니다.** 의존성이 없고 전부 가져다 써도 ~1.6 kB(min+brotli)입니다. React 17, 18, 19에서 동작하고 타입 정의를 함께 배포하며, Next.js처럼 서버에서 HTML을 미리 만드는 환경에서도 에러가 나지 않습니다.

## 이런 문제를 풀어줍니다

훅 하나를 부르면 기기 종류와 OS가 나옵니다.

```tsx
const { type, os, isMobile, isTablet, isDesktop } = useDevice();

// type → 'mobile' | 'tablet' | 'desktop'
// os   → 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
```

화면 방향처럼 도중에 바뀌는 값도 함께 옵니다. 전체 목록은 [API 레퍼런스](#api-레퍼런스)에 있습니다.

꺼내 쓰는 건 이렇게 간단합니다. 어려운 쪽은 저 값을 정확하게 만드는 일이고, 아래 셋이 대표적인 경우입니다.

**iPad 사용자에게 데스크톱 화면이 나갑니다.**
브라우저는 요청할 때마다 User-Agent(줄여서 UA) 문자열을 함께 보냅니다. iPadOS 13부터 iPad는 이 문자열에 자신을 Mac이라고 적습니다. UA만 읽는 라이브러리는 그대로 속습니다.

→ UA와 함께 `maxTouchPoints`를 봅니다. 진짜 Mac은 0을 보고하고 iPad는 5를 보고하므로, "Mac인데 손가락 다섯 개가 닿는다"면 iPad입니다.

**안드로이드에서 폰과 태블릿이 구분되지 않습니다.**
Chrome이 UA에서 모델명을 지운 뒤로 모든 안드로이드 기기가 `K`라고만 보고합니다. 화면 크기로 짐작하는 방법은 사용자가 창을 줄이는 순간 틀립니다.

→ Chrome 계열 브라우저는 UA 말고도 Client Hints라는 별도 정보를 제공합니다. 이쪽은 모델명 삭제와 무관하게 폰인지 아닌지를 알려줍니다. 이 값이 없는 브라우저에서는 UA에 `Mobile` 표시가 있는지로 갈라내는데, 구글이 안내하는 공식 방법입니다.

**Next.js 콘솔에 hydration 에러가 쌓입니다.**
서버에서 HTML을 미리 만들 때는 접속자가 어떤 기기인지 알 수 없습니다. 브라우저는 압니다. 이 비대칭 때문에 서버가 보낸 HTML과 브라우저가 처음 그린 화면이 어긋나고, React가 이를 에러로 보고합니다. (hydration은 서버가 만들어 둔 HTML을 브라우저에서 React가 이어받는 과정입니다.)

→ 첫 화면에서는 서버와 브라우저가 똑같이 `desktop` / `unknown`을 씁니다. 어긋날 값 자체가 없으니 에러도 없습니다. 진짜 기기 정보는 그 직후 렌더 한 번으로 채워집니다.

근거와 예외는 [판별 원리](#판별-원리)와 [판별하지 못하는 것](#이런-건-판별하지-못합니다)에 자세히 적어 두었습니다.

## react-device-detect와 비교

[react-device-detect](https://www.npmjs.com/package/react-device-detect)는 import 시점에 UA를 읽어 상수를 만듭니다. SSR에서 크래시하거나 mismatch를 내는 이유가 여기 있습니다. iPad는 데스크톱으로 잘못 잡습니다. 한번 계산한 값은 갱신되지 않고, 쓰지 않는 코드를 덜어낼 수 없어 ~13 kB(gzip)을 언제나 통째로 내려보냅니다. 2023년 이후로 유지보수가 멈췄고, 파서 의존성인 ua-parser-js v2가 AGPL로 바뀌면서 현대화 길도 막혔습니다.

Client Hints와 UA 파싱을 모두 갖춘 라이브러리는 사실상 없습니다. `react-device-check`는 지금의 플랫폼 현실에 맞춰 새로 설계한 MIT 대안입니다.

## 설치

```bash
npm install react-device-check
# yarn add react-device-check
# pnpm add react-device-check
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

값 하나만 필요하다면 그 훅만 가져오면 됩니다.

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

쓰지 않는 코드는 빌드할 때 번들에서 빠집니다. `useIsMobile` 하나만 쓰면 ~1.1 kB이고, 화면 회전 같은 실시간 변화를 감시하는 코드는 아예 포함되지 않습니다. 이 크기는 CI에서 size-limit이 확인합니다.

## API 레퍼런스

### `useDevice(): DeviceInfo`

전체 기기 스냅샷을 반환하고 반응형 변경을 구독합니다.

| 필드             | 타입                                                                 | 수명     | 설명                                                          |
| ---------------- | -------------------------------------------------------------------- | -------- | ------------------------------------------------------------- |
| `type`           | `'mobile' \| 'tablet' \| 'desktop'`                                  | 정적     | 기기 클래스                                                   |
| `os`             | `'ios' \| 'android' \| 'windows' \| 'macos' \| 'linux' \| 'unknown'` | 정적     | OS 계열                                                       |
| `isMobile`       | `boolean`                                                            | 정적     | `type === 'mobile'` 축약                                      |
| `isTablet`       | `boolean`                                                            | 정적     | `type === 'tablet'` 축약                                      |
| `isDesktop`      | `boolean`                                                            | 정적     | `type === 'desktop'` 축약                                     |
| `isTouchPrimary` | `boolean`                                                            | 반응형   | `(pointer: coarse)`. 마우스를 연결하면(DeX, iPad) 실시간 전환 |
| `orientation`    | `'portrait' \| 'landscape'`                                          | 반응형   | 뷰포트 방향, 회전하면 갱신                                    |
| `isHydrated`     | `boolean`                                                            | 1회 전환 | 서버와 hydration 첫 페인트에서 `false`, 직후 `true`           |

**정적**은 페이지를 새로 열기 전까지 값이 고정된다는 뜻이고, **반응형**은 상황이 바뀌면 다시 렌더된다는 뜻입니다.

> **참고:** `type`과 `os`를 세션당 고정으로 둔 것은 의도한 설계입니다. UA가 알려주는 사실은 페이지를 새로 열기 전까지 바뀌지 않고, 값을 붙박아 두어야 UI가 흔들리지 않습니다. 뷰포트에 따라 달라져야 하는 것은 반응형 필드나 CSS로 처리하세요.

### 정적 훅

```ts
useDeviceType(): 'mobile' | 'tablet' | 'desktop'
useOS(): 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
useIsMobile(): boolean
useIsTablet(): boolean
useIsDesktop(): boolean
```

미디어 리스너를 하나도 붙이지 않습니다. 이 훅들만 import하면 반응형 스토어 전체가 번들에서 빠집니다.

### `useDevicePixelRatio(): number`

CSS 픽셀 하나에 물리 픽셀이 몇 개 들어가는지 알려줍니다. `@2x`/`@3x` 에셋 선택, canvas 백킹 스토어 스케일, 지도·차트 타일 해상도 요청에 씁니다.

```tsx
import { useDevicePixelRatio } from 'react-device-check';

function Hero() {
  const dpr = useDevicePixelRatio();
  // width/height를 고정해 두면 소스만 바뀌므로 레이아웃이 흔들리지 않습니다.
  return <img src={dpr >= 2 ? hero2x : hero1x} width={800} height={450} alt="" />;
}
```

반응형입니다. 브라우저 줌, 디스플레이 배율 변경, 밀도가 다른 화면으로 창을 옮길 때 값이 따라 움직입니다. 서버 렌더와 hydration 첫 페인트가 둘 다 `1`을 내므로 어긋날 값이 없고, 실제 비율은 그다음 렌더 한 번으로 채워집니다. 스토어가 `useDevice()`와 분리돼 있어서 이 훅만 import하면 0.6 kB이고, 판별 엔진도 기기 리스너도 딸려오지 않습니다.

### `detectDevice(input?, options?)` (React 불필요)

훅 뒤에 있는 순수 엔진입니다. 모든 값을 주입할 수 있어 서버에서도 그대로 씁니다.

```ts
import { detectDevice } from 'react-device-check';

// 서버(Express, Next.js middleware 등)에서: 요청 UA를 전달.
const { type, os } = detectDevice({ ua: req.headers['user-agent'] });

// 읽을 값이 없는 환경을 위한 커스텀 fallback:
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

위 값들을 브라우저 전역에서 읽어 오는 함수이고, 훅이 내부에서 쓰는 리더와 같습니다. `window`가 없는 환경, 그러니까 웹 워커나 전역 `navigator`를 탑재한 Node 21+에서는 `undefined`를 돌려줍니다. Node의 `navigator.platform`은 **서버 머신**을 가리키므로 기기 판별에 쓰면 안 됩니다. `detectDevice`와 조합하면 특정 값만 바꿔 볼 수 있습니다.

```ts
import { detectDevice, getNavigatorInput } from 'react-device-check';

const result = detectDevice({ ...getNavigatorInput(), screen: undefined });
```

## SSR 동작 (Next.js)

서버는 기기를 알 수 없으니 이런 순서로 동작합니다.

```
① 서버 렌더        → 고정된 기본값: { type: 'desktop', os: 'unknown', isHydrated: false }
② hydration 페인트 → 동일한 기본값 → 서버·클라이언트 HTML 항상 일치 → hydration 에러 없음
③ 직후             → 실제 값으로 1회 교정 렌더, isHydrated: true
```

서버와 브라우저가 첫 화면에서 똑같은 값을 쓰기 때문에 둘이 어긋날 일이 없습니다. React 18/19에서 hydration mismatch가 구조적으로 생기지 않는 이유입니다. Next.js App Router와 Pages Router, Remix 어디서나 같습니다. React 17 + SSR만 예외이고, 아래에 적어 두었습니다.

- 순수 CSR 앱(Vite, CRA)은 ①②를 건너뛰고 첫 렌더부터 정확한 값을 받습니다.
- 첫 페인트에서 추측하면 안 되는 UI는 `isHydrated`를 보고 중립 플레이스홀더를 렌더하세요.
- 레이아웃은 CSS 미디어 쿼리로, 이 훅은 행동 분기용으로 쓰는 편이 좋습니다. 어떤 SDK를 로드할지, 어떤 플로우를 시작할지, 어디로 리다이렉트할지 같은 것들입니다. 교정 렌더가 기하를 건드리지 않으니 CLS는 0으로 유지됩니다.
- `useDevicePixelRatio()`도 같은 계약을 따릅니다. 서버와 첫 페인트에서 `1`, 실제 비율은 그다음 렌더 한 번으로 채워집니다.
- 번들에 `'use client'` 배너가 들어 있어서, React Server Component에서 import하면 알 수 없는 훅 에러 대신 명확한 경계 에러가 납니다.

## 판별 원리

기기를 알아낼 수 있는 값 세 가지를 순서대로 확인합니다. 같은 값이 들어오면 언제나 같은 답이 나옵니다.

**1. User-Agent Client Hints** (`navigator.userAgentData`, Chrome 계열만 제공)

UA가 한 덩어리 문자열인 것과 달리, 이쪽은 "모바일인가", "어떤 OS인가"가 항목별로 따로 옵니다. Chrome이 UA에서 모델명을 지운 것과도 무관합니다. 이 값이 있으면 가장 먼저 믿는 이유입니다.

안드로이드에서 폰과 태블릿은 `mobile` 항목으로 갈립니다. 안드로이드인데 `mobile`이 `false`면 태블릿이라는 것이 구글이 안내하는 규칙입니다.

**2. UA 문자열** (Safari, Firefox, 웹뷰)

Client Hints를 주지 않는 브라우저에서만 씁니다. 문자열에 `iPhone`이나 `iPad`가 들어 있는지, 안드로이드라면 `Mobi`라는 표시가 있는지, 그 밖에는 `Windows`·`Mac`·`Linux` 중 무엇인지를 봅니다. `Mobi`가 있으면 폰, 없으면 태블릿입니다.

**3. `maxTouchPoints` 교차검증**

Mac을 자처하는 iPad가 여기서 걸러집니다. 진짜 Mac은 동시에 인식하는 터치 지점이 0개인데 iPad는 5개입니다. "Mac이라는데 터치 지점이 1개보다 많다"면 데스크톱 UA를 쓰는 Apple 터치 기기라는 뜻입니다.

그게 iPad인지 데스크톱 모드를 켠 iPhone인지는 화면의 짧은 쪽 길이로 나눕니다. 가장 큰 iPhone이 440px 언저리, 가장 작은 iPad가 744px이라 두 범위가 겹치지 않습니다.

카카오톡·인스타그램 같은 인앱 웹뷰와 옛날 UA 문자열도 모두 이 순서를 그대로 지납니다.

## 이런 건 판별하지 못합니다

아래는 `react-device-check`가 틀리게 답하거나 아예 알 수 없는 경우입니다. 미리 알고 쓰시라고 모아 두었습니다.

**일부러 이렇게 정한 것**

- Samsung DeX는 `desktop`입니다. 폰이지만 데스크톱처럼 쓰는 모드라서, 삼성 공식 가이드를 따랐습니다. 이때 `SamsungBrowser` 표시가 보이면 `os`는 `android`로 둡니다.
- 윈도우 터치 노트북과 Surface도 `desktop`입니다. 터치가 된다고 노트북이 태블릿이 되지는 않습니다. 구글·마이크로소프트 가이드와 같은 입장입니다.
- TV는 `desktop`입니다. Android TV, Fire TV, BRAVIA, Chromecast를 최대한 알아내서 `desktop`으로 보냅니다. mobile·tablet·desktop 셋 중에서는 리모컨으로 멀리서 쓰는 화면에 desktop이 가장 가깝습니다.
- ChromeOS는 `os: 'linux'`, visionOS Safari는 `tablet`/`ios`로 나옵니다.
- 봇은 자신이 흉내 내는 기기를 그대로 따라갑니다. Googlebot 스마트폰이면 `mobile`/`android`입니다.

**알아낼 방법이 없는 것**

- 서버에서는 데스크톱 모드 iPad를 알아볼 수 없습니다. 요청 내용이 Mac과 한 글자도 다르지 않기 때문입니다. 서버는 일단 기본값을 보내고, 브라우저가 넘겨받은 직후 바로잡습니다.
- iPhone에서 "데스크톱 웹사이트 요청"을 켰는데 화면 크기까지 알 수 없으면 `tablet`/`ios`로 나옵니다. 화면 크기가 있으면 폰으로 제대로 잡습니다.
- Chrome 안드로이드의 "데스크톱 사이트 요청"은 `desktop`/`linux`가 됩니다. 브라우저가 의도적으로 리눅스 데스크톱인 척하는 것이라 진짜와 구분할 방법이 없습니다.
- 폴더블(갤럭시 폴드/플립)은 펼쳐도 접어도 `mobile`입니다. 지금 접혀 있는지 알려주는 값이 아예 없습니다. 펼침 상태에 맞춰야 하는 화면은 CSS 미디어 쿼리로 만드세요.
- UA를 일부러 바꿔서 접속하는 것은 막지 못합니다. 받은 값에 일관된 답을 낼 뿐, 작정하고 속이는 상대를 가려내지는 못합니다.
- 서버는 화면 밀도도 알 수 없습니다. 언제나 `1`을 보내고 브라우저가 넘겨받은 뒤 바로잡습니다. 기기 종류와 달리 대신 읽을 헤더조차 없는데, UA 문자열에 밀도가 담기지 않기 때문입니다. Chromium은 Client Hints로 협상해 받을 수 있지만 opt-in이고 Chromium 전용입니다.
- 브라우저 줌과 진짜 고밀도 화면은 구분되지 않습니다. 둘 다 `devicePixelRatio`를 움직이고, 어느 쪽인지 가려낼 값이 없습니다.

**아직 지원하지 않는 것**

- HarmonyOS NEXT는 `os`가 `'unknown'`으로 나옵니다. `type`은 정확합니다. v1의 `os` 목록에 HarmonyOS를 아직 넣지 않았습니다.
- Safari 16 미만은 `resolution` 미디어 쿼리를 지원하지 않아 초기값은 맞지만 갱신되지 않습니다. iOS에서는 비율이 어차피 움직이지 않으니, 창이 디스플레이를 넘나드는 macOS Safari 15에서만 드러납니다.
- React 17에서 서버 렌더링을 쓰면 hydration 경고가 찍힐 수 있습니다. React 17에는 이 훅이 쓰는 `useSyncExternalStore`가 없어서, 대신 넣어둔 코드가 첫 화면부터 브라우저 값을 그려버립니다. React 공식 대체 구현도 똑같은 한계를 갖고 있습니다. React 18/19에서는 생기지 않고, React 17이어도 서버 렌더링을 쓰지 않으면 문제없습니다.

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

- 단위 테스트 98개. 실제 UA 문자열 48개를 픽스처 매트릭스로 돌립니다(동결된 Chrome UA, iOS 26, iPad 데스크톱 모드, DeX, Firefox 태블릿, 카카오톡 웹뷰, Fire TV, Opera Mini, HarmonyOS NEXT 등).
- Playwright E2E는 기기 프로필 6개를 실제 Chromium/WebKit로 띄워 판별 결과와 서버 원본 HTML, hydration 에러 0건을 확인합니다.
- CI는 React 17/18/19 호환 레그, `@arethetypeswrong/cli`, size-limit 예산을 실행합니다.

## 기여

이슈와 풀 리퀘스트를 환영합니다. 제출 전에 `pnpm lint && pnpm typecheck && pnpm test`를 실행해 주세요.

## 라이선스

[MIT](LICENSE) © [umsungjun](https://github.com/umsungjun)

---

**Keywords:** react 기기 판별 훅, react-device-detect 대안, 모바일 태블릿 데스크톱 판별 react, 아이패드 판별 react, useIsMobile 훅, SSR 안전 기기 판별, Next.js 기기 판별, user agent client hints react, 디바이스 픽셀 비율 훅, 레티나 판별 react
