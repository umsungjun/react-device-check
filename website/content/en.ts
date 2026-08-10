import type { LandingStrings } from './types';

export const en: LandingStrings = {
  header: {
    langLabel: '한국어',
    langHref: '/ko',
  },
  hero: {
    badges: ['~1.5 kB min+brotli', 'Zero dependencies', 'React 17–19', 'MIT'],
    titlePre: "Device detection that's right ",
    titleAccent: 'in CSR and SSR',
    titlePost: '',
    tagline:
      "Know whether your user is on a phone, tablet, or desktop, and which OS they run. It catches the iPad that writes \"Mac\" into its own user agent, and it does not break in Next.js or anywhere else that builds HTML on the server first. No dependencies.",
    ctaDemo: 'See it live',
    ctaGithub: 'GitHub',
  },
  showcase: {
    overline: 'At a glance',
    title: "Devices lie. The answers don't.",
    intro:
      'These are the devices where trusting the User-Agent string gets you the wrong answer.',
    claimLabel: 'What it claims',
    verdictLabel: 'What the hook returns',
    devices: [
      {
        name: 'iPhone 15',
        caption:
          'With Safari\'s "Request Desktop Website" even an iPhone claims to be a Mac. Multitouch plus the screen-size cross-check still says mobile.',
      },
      {
        name: 'Galaxy S24',
        caption:
          'Chrome stripped the model name out of the UA, so every Android just reports "K". Client Hints, which browsers send separately, still answer it.',
      },
      {
        name: 'iPad Pro',
        caption:
          'Has claimed to be a Mac since iPadOS 13. Five touch points give it away as a tablet anyway.',
      },
      {
        name: 'iMac',
        caption:
          'A real Mac sending the exact same UA as the iPad above. One fact separates them: maxTouchPoints is 0.',
      },
      {
        name: 'Windows touch laptop',
        caption:
          'A touchscreen does not change the answer. maxTouchPoints is only consulted to catch devices claiming to be Macs, so this stays desktop.',
      },
      {
        name: 'Android TV',
        caption:
          'An Android UA without the Mobile token would normally land in the tablet bucket, but TV markers are checked first. Desktop is the closest fit for a screen you drive with a remote from across the room.',
      },
    ],
  },
  demo: {
    overline: 'Live demo',
    title: 'What actually happens during SSR',
    intro:
      'This page is HTML that Next.js built on the server. The left panel is exactly what the server sent. The right panel is what the hook knows right now.',
    serverPanel: 'First paint (what the server rendered)',
    serverNote:
      'Always desktop / unknown, whatever device you arrive on. Server and browser start from the same value, so they cannot disagree.',
    livePanel: 'Live values',
    liveNote:
      'The moment the browser takes over the page, one render fills in the real values. Touch and orientation keep following after that.',
    waitingBadge: 'server default',
    hydratedBadge: 'hydrated',
    hint: 'Open this page on a phone, or reload with DevTools device emulation. The left panel stays desktop while the right one tells the truth, and the console logs zero hydration errors.',
  },
  install: {
    copyHint: 'Click to copy',
    copied: 'Copied!',
  },
  usage: {
    overline: 'Usage',
    title: 'Three ways to use it',
    body: 'From a single boolean to running without React at all. You ship only what you import.',
    examples: [
      {
        title: 'Read the full snapshot',
        body: 'One call gives you the device class, the OS, convenience booleans, and the values that change live. Server and browser always agree on the first paint, so you never write typeof window guards. Check isHydrated only when you want to hide the flash as the real values land.',
      },
      {
        title: 'Import only what you ship',
        body: 'Whatever you do not import is dropped at build time. Take only useIsMobile and useOS and the live-watching code disappears entirely, leaving ~1.1 kB. Perfect for OS-specific store buttons.',
      },
      {
        title: 'Use the engine anywhere',
        body: 'The function that does the actual detecting is exported on its own. No React, no browser globals. Hand it a UA string and you get the same answer in middleware, on a server, or in a test.',
      },
    ],
  },
  features: {
    overline: 'Why',
    title: 'Built for how devices lie in 2026',
    items: [
      {
        title: 'Accurate where others fail',
        body: 'An iPad writing "Mac" into its user agent is still caught as a tablet, because maxTouchPoints is read alongside it. Android tablets follow the rule Google documents, and Samsung DeX and in-app webviews are handled too.',
      },
      {
        title: 'Client Hints first',
        body: 'On Chromium it reads Client Hints instead of the UA. Stripping the model name does not affect them. Only browsers without Client Hints fall back to parsing the UA string.',
      },
      {
        title: 'SSR-safe by construction',
        body: 'Server and browser use the same value on the first paint, so the two cannot disagree. That is why React 18/19 never log a hydration error here. The real values arrive one render later.',
      },
      {
        title: 'Tiny and tree-shakeable',
        body: 'No dependencies at all. Importing only useIsMobile ships ~1.1 kB, and the live-watching code never enters the bundle. CI checks these numbers.',
      },
      {
        title: 'Hybrid reactivity',
        body: 'Device class and OS stay pinned until the page reloads. Touch and orientation update live, so unfolding a foldable or attaching a keyboard to an iPad still gives the right answer.',
      },
      {
        title: 'Proven in real browsers',
        body: 'Beyond 85 unit tests, iPhone 15, iPad Pro, Galaxy S24, Galaxy Tab S9, and desktop Chrome and Safari are driven in real browsers to confirm the verdicts and zero errors.',
      },
    ],
  },
  compare: {
    overline: 'Comparison',
    title: 'What about react-device-detect?',
    body: "react-device-detect computes its values the moment you import it and freezes them. That breaks under server rendering. It calls iPads desktops, never updates, and because unused parts cannot be dropped it always ships ~13 kB. It has been unmaintained since 2023, and its parser dependency moved to AGPL. react-device-check is a maintained MIT replacement designed around how platforms behave today.",
  },
  api: {
    overline: 'API',
    title: 'Small surface, full coverage',
    rows: [
      {
        name: 'useDevice()',
        desc: 'Device class, OS, convenience booleans, and the live touch and orientation values in one call.',
      },
      {
        name: 'useDeviceType()',
        desc: "'mobile' | 'tablet' | 'desktop'. Static per session, listener-free.",
      },
      {
        name: 'useIsMobile() · useIsTablet() · useIsDesktop()',
        desc: 'When one boolean is all you need. Importing only these drops the live-watching code from the bundle.',
      },
      {
        name: 'useOS()',
        desc: "'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'.",
      },
      {
        name: 'detectDevice(input?, options?)',
        desc: 'The detection function without React. Pass the values in yourself, which suits servers and tests.',
      },
    ],
    docsLead: 'Full API reference and known limitations live in the',
    docsLinkText: 'GitHub README',
  },
  footer: {
    tagline: 'MIT licensed · built by umsungjun',
  },
};
