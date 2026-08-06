import type { LandingStrings } from './types';

export const ko: LandingStrings = {
  header: {
    langLabel: 'English',
    langHref: '/',
  },
  hero: {
    badges: ['~1.5 kB min+brotli', '의존성 0개', 'React 17–19', 'MIT'],
    titlePre: 'CSR에서도, SSR에서도 ',
    titleAccent: '정확한 기기 판별',
    titlePost: '',
    tagline:
      'React CSR 앱에서도 Next.js SSR에서도, 사용자가 폰·태블릿·데스크톱 중 무엇으로, 어떤 OS에서 접근했는지 정확하게 알 수 있습니다. 의존성 0개에 iPad 위장 해제와 동결된 User-Agent까지 처리하며, hydration 에러는 단 한 건도 발생하지 않습니다.',
    ctaDemo: '라이브로 보기',
    ctaGithub: 'GitHub',
  },
  showcase: {
    overline: 'At a glance',
    title: '기기는 속여도, 답은 정직합니다',
    intro:
      '각 화면은 그 기기에서 useDevice()가 반환하는 값입니다 — 자신을 속이는 기기까지 포함해서요.',
    claimLabel: '기기의 주장',
    verdictLabel: '훅의 판별',
    devices: [
      {
        name: 'iPhone 15',
        caption:
          'Safari의 “데스크톱 웹사이트 요청”을 켜면 iPhone조차 자신을 Mac이라고 주장합니다. 멀티터치와 화면 크기 교차검증이 그래도 mobile임을 밝혀냅니다.',
      },
      {
        name: 'Galaxy S24',
        caption:
          'Chrome은 UA를 동결해 모든 안드로이드가 모델명 “K”로 보고됩니다. Client Hints가 정확히 판별합니다.',
      },
      {
        name: 'iPad Pro',
        caption:
          'iPadOS 13부터 Mac으로 위장하지만, 멀티터치 언마스킹이 태블릿임을 밝혀냅니다.',
      },
      {
        name: 'iMac',
        caption:
          '위의 iPad와 완전히 같은 UA를 보내는 진짜 Mac입니다. 멀티터치 교차검증(maxTouchPoints: 0)이 둘을 구분합니다.',
      },
      {
        name: 'Windows 터치 노트북',
        caption:
          '터치스크린에 속지 않습니다 — 터치 신호는 Apple 위장 분기에서만 참조됩니다. desktop을 유지합니다.',
      },
      {
        name: 'Android TV',
        caption:
          'Mobile 토큰이 없는 Android UA라 원래는 태블릿으로 분류될 신호지만, TV 마커를 먼저 확인합니다. 10-foot UI에는 desktop이 가장 맞는 답입니다.',
      },
    ],
  },
  demo: {
    overline: 'Live demo',
    title: 'SSR 계약이 동작하는 모습',
    intro:
      '이 페이지는 Next.js로 서버 렌더됩니다. 왼쪽 패널은 hydration 첫 페인트 시점에 동결된 값 — 서버가 보낸 그대로입니다. 오른쪽 패널은 훅이 지금 알고 있는 값입니다.',
    serverPanel: '첫 페인트 (서버가 렌더한 값)',
    serverNote:
      '어떤 기기에서든 항상 desktop / unknown — 그래서 서버 HTML과 클라이언트 HTML이 어긋날 수 없습니다.',
    livePanel: '라이브 값',
    liveNote:
      'hydration 직후 단 한 번의 렌더로 교정됩니다. isTouchPrimary와 orientation은 계속 실시간 갱신됩니다.',
    waitingBadge: 'server default',
    hydratedBadge: 'hydrated',
    hint: '이 페이지를 폰에서 열거나 DevTools 기기 에뮬레이션으로 새로고침해 보세요. 왼쪽 패널은 desktop에 머물고 오른쪽이 진실을 말합니다 — 콘솔의 hydration 에러는 0건입니다.',
  },
  install: {
    copyHint: '클릭해서 복사',
    copied: '복사됨!',
  },
  usage: {
    overline: 'Usage',
    title: '세 가지 사용 방법',
    body: '불리언 한 줄부터 프레임워크 없는 순수 엔진까지 — 각 import는 실제로 필요한 만큼만 번들에 담습니다.',
    examples: [
      {
        title: '전체 스냅샷 읽기',
        body: 'useDevice()는 type, os, 불리언 슈가와 실시간 필드를 반환합니다. 서버 렌더와 hydration 첫 페인트는 구조적으로 항상 일치하므로 typeof window 가드를 쓸 일이 없고, 교정 렌더 한 번을 감추고 싶을 때만 isHydrated로 분기하면 됩니다.',
      },
      {
        title: '쓰는 것만 import',
        body: '정적 훅은 리스너가 없고 최대한으로 tree-shaking됩니다. useIsMobile과 useOS만 import하면 반응형 스토어가 통째로 빠져 ~1.1 kB만 배송됩니다. OS별 앱스토어 버튼 같은 곳에 딱 맞습니다.',
      },
      {
        title: 'React 밖에서도 사용',
        body: 'detectDevice()는 훅 뒤에서 동작하는 순수 판별 트리입니다 — React도 전역 객체도 필요 없습니다. UA 문자열(또는 Client Hints)을 주입하면 미들웨어, 서버, 테스트 어디서든 같은 결정론적 결과를 얻습니다.',
      },
    ],
  },
  features: {
    overline: 'Why',
    title: '2026년, 기기가 거짓말하는 방식에 맞춘 설계',
    items: [
      {
        title: '다른 라이브러리가 틀리는 곳에서 정확',
        body: 'iPadOS 13+가 macOS 데스크톱 UA를 보내도 iPad를 태블릿으로 판별합니다(MacIntel + 멀티터치 언마스킹). 안드로이드 태블릿은 공식 Mobile 토큰 규칙으로 구분하고, Samsung DeX와 인앱 웹뷰도 처리합니다.',
      },
      {
        title: 'Client Hints 우선',
        body: 'Chromium에서는 navigator.userAgentData를 신뢰해 UA 동결에 면역이고, 그 외 환경에서는 UA 파싱으로 폴백합니다.',
      },
      {
        title: '구조적으로 SSR-safe',
        body: '서버 렌더와 hydration 첫 페인트가 항상 일치해 React 18/19에서 hydration mismatch가 기록되지 않습니다. hydration 직후 렌더 한 번으로 실제 값으로 교정됩니다.',
      },
      {
        title: '작고 tree-shakeable',
        body: '런타임 의존성 0개, ESM/CJS 듀얼. useIsMobile만 import하면 ~1.1 kB이고 반응형 스토어 전체가 번들에서 제거됩니다 — 예산은 CI에서 강제됩니다.',
      },
      {
        title: '하이브리드 반응성',
        body: 'type과 os는 세션 동안 고정되고, isTouchPrimary와 orientation은 matchMedia로 실시간 갱신됩니다 — 폴더블, DeX 도킹, iPad Stage Manager까지 커버합니다.',
      },
      {
        title: '실브라우저 검증',
        body: '76개 단위 테스트에 더해 Playwright 매트릭스 — iPhone 15, iPad Pro, Galaxy S24, Galaxy Tab S9, 데스크톱 Chrome/Safari — 가 판별 결과와 hydration 에러 0건을 검증합니다.',
      },
    ],
  },
  compare: {
    overline: 'Comparison',
    title: 'react-device-detect는요?',
    body: 'react-device-detect는 import 시점에 UA로 상수를 계산해 SSR에서 크래시하거나 mismatch가 나고, iPad를 데스크톱으로 오판하며, 값이 갱신되지 않고, tree-shaking이 불가능한 ~13 kB gzip을 항상 배송합니다. 2023년 이후 유지보수가 중단됐고 파서 의존성은 AGPL로 전환됐습니다. react-device-check는 오늘의 플랫폼 현실에 맞춰 설계된, 유지보수되는 MIT 대안입니다.',
  },
  api: {
    overline: 'API',
    title: '작은 표면적, 빠짐없는 커버리지',
    rows: [
      {
        name: 'useDevice()',
        desc: '전체 스냅샷: type, os, 불리언 슈가, 실시간 isTouchPrimary / orientation, isHydrated.',
      },
      {
        name: 'useDeviceType()',
        desc: "'mobile' | 'tablet' | 'desktop' — 세션 동안 정적, 리스너 없음.",
      },
      {
        name: 'useIsMobile() · useIsTablet() · useIsDesktop()',
        desc: '불리언 슈가 — 최대 tree-shaking. 이것만 import하면 반응형 스토어가 번들에서 빠집니다.',
      },
      {
        name: 'useOS()',
        desc: "'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'.",
      },
      {
        name: 'detectDevice(input?, options?)',
        desc: 'React 없이 쓰는 순수 엔진 — 모든 신호를 주입할 수 있어 서버와 테스트에 적합합니다.',
      },
    ],
    docsLead: '전체 API 레퍼런스와 알려진 한계는 여기에 있습니다:',
    docsLinkText: 'GitHub README (한국어)',
  },
  footer: {
    tagline: 'MIT 라이선스 · made by umsungjun',
  },
};
