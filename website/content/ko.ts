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
      '사용자가 폰인지 태블릿인지 데스크톱인지, 어떤 OS를 쓰는지 알려줍니다. 자신을 Mac이라고 적어 보내는 iPad도 잡아내고, 서버에서 HTML을 미리 만드는 Next.js에서도 에러가 나지 않습니다. 의존성은 없습니다.',
    ctaDemo: '라이브로 보기',
    ctaGithub: 'GitHub',
  },
  showcase: {
    overline: 'At a glance',
    title: '기기는 속여도, 답은 정직합니다',
    intro:
      '브라우저가 보내는 User-Agent 문자열만 믿으면 틀리는 기기들을 모았습니다.',
    claimLabel: '기기의 주장',
    verdictLabel: '훅의 판별',
    devices: [
      {
        name: 'iPhone 15',
        caption:
          'Safari의 “데스크톱 웹사이트 요청”을 켜면 iPhone조차 자신을 Mac이라고 주장합니다. 멀티터치와 화면 크기를 교차검증하면 그래도 mobile이 드러납니다.',
      },
      {
        name: 'Galaxy S24',
        caption:
          'Chrome이 UA에서 모델명을 지운 뒤로 모든 안드로이드가 “K”라고만 보고합니다. 대신 브라우저가 따로 제공하는 Client Hints를 읽어 판별합니다.',
      },
      {
        name: 'iPad Pro',
        caption:
          'iPadOS 13부터 자신을 Mac이라고 적어 보냅니다. 그래도 터치 지점이 5개라 태블릿인 게 드러납니다.',
      },
      {
        name: 'iMac',
        caption:
          '위의 iPad와 완전히 같은 UA를 보내는 진짜 Mac입니다. maxTouchPoints가 0이라는 사실 하나가 둘을 갈라놓습니다.',
      },
      {
        name: 'Windows 터치 노트북',
        caption:
          '터치스크린이 달렸어도 desktop입니다. maxTouchPoints는 Mac을 자처하는 기기를 가려낼 때만 보기 때문입니다.',
      },
      {
        name: 'Android TV',
        caption:
          'Mobile 토큰이 없는 Android UA라 원래는 태블릿으로 갈 조건이지만, TV 마커를 먼저 확인합니다. 리모컨으로 멀리서 보는 화면이라 desktop이 가장 가깝습니다.',
      },
    ],
  },
  demo: {
    overline: 'Live demo',
    title: '서버 렌더링에서 실제로 일어나는 일',
    intro:
      '이 페이지는 Next.js가 서버에서 미리 만들어 보낸 HTML입니다. 왼쪽은 서버가 보낸 그대로의 값이고, 오른쪽은 훅이 지금 알고 있는 값입니다.',
    serverPanel: '첫 페인트 (서버가 렌더한 값)',
    serverNote:
      '어떤 기기로 접속하든 언제나 desktop / unknown입니다. 서버와 브라우저가 같은 값으로 시작하니 어긋날 일이 없습니다.',
    livePanel: '라이브 값',
    liveNote:
      '브라우저가 화면을 이어받은 직후, 렌더 한 번으로 실제 값이 채워집니다. 터치 여부와 화면 방향은 그 뒤로도 계속 따라갑니다.',
    waitingBadge: 'server default',
    hydratedBadge: 'hydrated',
    hint: '이 페이지를 폰에서 열거나 DevTools 기기 에뮬레이션으로 새로고침해 보세요. 왼쪽 패널은 desktop에 머물고 오른쪽이 진실을 말합니다. 콘솔의 hydration 에러는 0건입니다.',
  },
  install: {
    copyHint: '클릭해서 복사',
    copied: '복사됨!',
  },
  usage: {
    overline: 'Usage',
    title: '세 가지 사용 방법',
    body: '불리언 하나만 쓰는 경우부터 React 없이 쓰는 경우까지. 가져다 쓴 만큼만 번들에 담깁니다.',
    examples: [
      {
        title: '전체 스냅샷 읽기',
        body: 'useDevice() 하나로 기기 종류, OS, 편의용 불리언, 실시간으로 바뀌는 값까지 모두 받습니다. 서버와 브라우저의 첫 화면이 언제나 같아서 typeof window 같은 방어 코드를 쓸 일이 없습니다. 값이 채워지는 순간의 깜빡임을 감추고 싶을 때만 isHydrated를 보면 됩니다.',
      },
      {
        title: '쓰는 것만 import',
        body: '쓰지 않는 코드는 빌드할 때 번들에서 빠집니다. useIsMobile과 useOS만 가져오면 실시간 감시 코드가 통째로 빠져 ~1.1 kB만 나갑니다. OS별 앱스토어 버튼 같은 곳에 딱 맞습니다.',
      },
      {
        title: 'React 밖에서도 사용',
        body: '훅 안에서 실제 판별을 담당하는 함수를 그대로 꺼내 쓸 수 있습니다. React도, 브라우저 전역 객체도 필요 없습니다. UA 문자열만 넘기면 미들웨어와 서버, 테스트 어디서든 같은 답이 나옵니다.',
      },
    ],
  },
  features: {
    overline: 'Why',
    title: '2026년, 기기가 거짓말하는 방식에 맞춘 설계',
    items: [
      {
        title: '다른 라이브러리가 틀리는 곳에서 정확',
        body: 'iPad가 자신을 Mac이라고 적어 보내도, maxTouchPoints를 함께 보고 태블릿으로 잡아냅니다. 안드로이드 태블릿은 구글 공식 규칙으로 폰과 갈라내고, Samsung DeX와 카카오톡 같은 인앱 웹뷰도 처리합니다.',
      },
      {
        title: 'Client Hints 우선',
        body: 'Chrome 계열에서는 UA 대신 Client Hints를 먼저 읽습니다. 모델명이 지워져도 영향을 받지 않는 값입니다. 이걸 지원하지 않는 브라우저에서만 UA 문자열을 해석합니다.',
      },
      {
        title: '구조적으로 SSR-safe',
        body: '서버와 브라우저가 첫 화면에서 똑같은 값을 쓰기 때문에 둘이 어긋날 수가 없습니다. React 18/19에서 hydration 에러가 구조적으로 생기지 않는 이유입니다. 실제 값은 그 직후 렌더 한 번으로 채워집니다.',
      },
      {
        title: '쓴 만큼만 번들에',
        body: '의존성이 하나도 없습니다. useIsMobile만 가져오면 ~1.1 kB이고, 실시간 감시 코드는 번들에 아예 들어가지 않습니다. 이 크기는 CI에서 확인합니다.',
      },
      {
        title: '하이브리드 반응성',
        body: '기기 종류와 OS는 페이지를 새로 열기 전까지 고정입니다. 반면 터치 여부와 화면 방향은 실시간으로 따라가서, 폴더블을 펼치거나 iPad에 키보드를 붙여도 값이 맞습니다.',
      },
      {
        title: '실브라우저 검증',
        body: '단위 테스트 85개에 더해, iPhone 15와 iPad Pro, Galaxy S24, Galaxy Tab S9, 데스크톱 Chrome/Safari를 실제 브라우저로 띄워 판별 결과와 에러 0건을 확인합니다.',
      },
    ],
  },
  compare: {
    overline: 'Comparison',
    title: 'react-device-detect는요?',
    body: 'react-device-detect는 import하는 순간 값을 계산해 고정합니다. 그래서 서버 렌더링 환경에서 깨집니다. iPad는 데스크톱으로 잘못 잡고, 한번 정해진 값은 바뀌지 않습니다. 쓰지 않는 부분을 덜어낼 수 없어 ~13 kB를 언제나 통째로 내려보냅니다. 2023년 이후 유지보수가 멈췄고 파서 의존성은 AGPL로 바뀌었습니다. react-device-check는 지금의 플랫폼 현실에 맞춰 새로 설계한 MIT 대안입니다.',
  },
  api: {
    overline: 'API',
    title: '작은 표면적, 빠짐없는 커버리지',
    rows: [
      {
        name: 'useDevice()',
        desc: '기기 종류, OS, 편의용 불리언, 실시간으로 바뀌는 터치·화면 방향까지 한 번에.',
      },
      {
        name: 'useDeviceType()',
        desc: "'mobile' | 'tablet' | 'desktop'. 세션 동안 정적이고 리스너가 없습니다.",
      },
      {
        name: 'useIsMobile() · useIsTablet() · useIsDesktop()',
        desc: '불리언 하나만 필요할 때. 이것만 가져오면 실시간 감시 코드가 번들에서 빠집니다.',
      },
      {
        name: 'useOS()',
        desc: "'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'.",
      },
      {
        name: 'detectDevice(input?, options?)',
        desc: 'React 없이 쓰는 판별 함수. 값을 직접 넘길 수 있어 서버와 테스트에 적합합니다.',
      },
    ],
    docsLead: '전체 API 레퍼런스와 알려진 한계는 여기에 있습니다:',
    docsLinkText: 'GitHub README (한국어)',
  },
  footer: {
    tagline: 'MIT 라이선스 · made by umsungjun',
  },
};
