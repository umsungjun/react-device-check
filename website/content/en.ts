import type { LandingStrings } from './types';

export const en: LandingStrings = {
  header: {
    langLabel: '한국어',
    langHref: '/ko',
  },
  hero: {
    badges: ['~1.5 kB min+brotli', 'Zero dependencies', 'React 17–19', 'MIT'],
    titlePre: 'Device detection that’s right ',
    titleAccent: 'in CSR and SSR',
    titlePost: '',
    tagline:
      'In React CSR apps and Next.js SSR alike, know exactly whether your user is on a phone, tablet, or desktop, and which OS. Zero dependencies, iPads unmask themselves, frozen user agents don’t matter, and there is not a single hydration error.',
    ctaDemo: 'See it live',
    ctaGithub: 'GitHub',
  },
  showcase: {
    overline: 'At a glance',
    title: 'Devices lie. The answers don’t.',
    intro:
      'Each screen shows what useDevice() returns on that device — including the ones that lie about themselves.',
    claimLabel: 'What it claims',
    verdictLabel: 'What the hook returns',
    devices: [
      {
        name: 'iPhone 15',
        caption:
          'With Safari’s “Request Desktop Website” even an iPhone claims to be a Mac. Multitouch plus the screen-size cross-check still says mobile.',
      },
      {
        name: 'Galaxy S24',
        caption:
          'Chrome froze the UA — every Android reports model “K”. Client Hints still nail it.',
      },
      {
        name: 'iPad Pro',
        caption:
          'Masquerades as a Mac since iPadOS 13. Multitouch unmasking says tablet anyway.',
      },
      {
        name: 'iMac',
        caption:
          'A real Mac sending the exact same UA as the iPad above. The multitouch cross-check (maxTouchPoints: 0) is what tells them apart.',
      },
      {
        name: 'Windows touch laptop',
        caption:
          'A touchscreen doesn’t fool it — touch is only consulted for the Apple masquerade. Stays desktop.',
      },
      {
        name: 'Android TV',
        caption:
          'An Android UA without the Mobile token would normally land in the tablet bucket, but TV markers are checked first — desktop is the best fit for a 10-foot UI.',
      },
    ],
  },
  demo: {
    overline: 'Live demo',
    title: 'Watch the SSR contract in action',
    intro:
      'This page is server-rendered by Next.js. The left panel is frozen at the hydration first paint — exactly what the server sent. The right panel is what the hook knows right now.',
    serverPanel: 'First paint (what the server rendered)',
    serverNote:
      'Always desktop / unknown, on every device — that is why server HTML and client HTML can never disagree.',
    livePanel: 'Live values',
    liveNote:
      'Corrected in a single render right after hydration. isTouchPrimary and orientation keep updating live.',
    waitingBadge: 'server default',
    hydratedBadge: 'hydrated',
    hint: 'Open this page on a phone, or reload with DevTools device emulation: the left panel stays desktop while the right one tells the truth — and the console logs zero hydration errors.',
  },
  install: {
    copyHint: 'Click to copy',
    copied: 'Copied!',
  },
  usage: {
    overline: 'Usage',
    title: 'Three ways to use it',
    body: 'From a one-line boolean to the framework-free engine — each import ships only what it actually needs.',
    examples: [
      {
        title: 'Read the full snapshot',
        body: 'useDevice() returns type, os, boolean sugar, and the live fields. The server render and the hydration first paint always agree by construction, so you never write typeof window guards — branch on isHydrated only when you want to hide the one-render correction.',
      },
      {
        title: 'Import only what you ship',
        body: 'The static hooks are listener-free and maximally tree-shakeable: importing only useIsMobile and useOS drops the reactive store entirely and ships ~1.1 kB. Perfect for OS-specific store buttons.',
      },
      {
        title: 'Use the engine anywhere',
        body: 'detectDevice() is the pure decision tree behind the hooks — no React, no globals. Inject a UA string (or Client Hints) and get the same deterministic verdict in middleware, on servers, or in tests.',
      },
    ],
  },
  features: {
    overline: 'Why',
    title: 'Built for how devices lie in 2026',
    items: [
      {
        title: 'Accurate where others fail',
        body: 'iPads report as tablets even behind the macOS desktop UA (MacIntel + multitouch unmasking). Android tablets follow the official Mobile-token rule; Samsung DeX and in-app WebViews are handled.',
      },
      {
        title: 'Client Hints first',
        body: 'Trusts navigator.userAgentData on Chromium — immune to user-agent freezing — and falls back to UA parsing everywhere else.',
      },
      {
        title: 'SSR-safe by construction',
        body: 'Server render and hydration first paint always match, so React 18/19 never log a hydration mismatch. The hook corrects itself in one post-hydration render.',
      },
      {
        title: 'Tiny and tree-shakeable',
        body: 'Zero runtime dependencies, dual ESM/CJS. Importing only useIsMobile ships ~1.1 kB and drops the reactive store entirely — budgets are enforced in CI.',
      },
      {
        title: 'Hybrid reactivity',
        body: 'type and os stay stable for the session, while isTouchPrimary and orientation update live via matchMedia — covering foldables, DeX docking, and iPad Stage Manager.',
      },
      {
        title: 'Proven in real browsers',
        body: 'Beyond 76 unit tests, a Playwright matrix — iPhone 15, iPad Pro, Galaxy S24, Galaxy Tab S9, desktop Chrome and Safari — verifies detection and zero hydration errors.',
      },
    ],
  },
  compare: {
    overline: 'Comparison',
    title: 'What about react-device-detect?',
    body: 'react-device-detect computes import-time constants from the UA, which crashes or mismatches under SSR, misreports iPads as desktops, never updates, and ships ~13 kB gzip that cannot be tree-shaken. It has been unmaintained since 2023, and its parser dependency moved to AGPL. react-device-check is a maintained MIT replacement designed around today’s platform realities.',
  },
  api: {
    overline: 'API',
    title: 'Small surface, full coverage',
    rows: [
      {
        name: 'useDevice()',
        desc: 'Full snapshot: type, os, boolean sugar, live isTouchPrimary / orientation, and isHydrated.',
      },
      {
        name: 'useDeviceType()',
        desc: "'mobile' | 'tablet' | 'desktop' — static per session, listener-free.",
      },
      {
        name: 'useIsMobile() · useIsTablet() · useIsDesktop()',
        desc: 'Boolean sugar — maximally tree-shakeable; importing only these drops the reactive store.',
      },
      {
        name: 'useOS()',
        desc: "'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'.",
      },
      {
        name: 'detectDevice(input?, options?)',
        desc: 'The pure engine — no React required, every signal injectable. Great for servers and tests.',
      },
    ],
    docsLead: 'Full API reference and known limitations live in the',
    docsLinkText: 'GitHub README',
  },
  footer: {
    tagline: 'MIT licensed · built by umsungjun',
  },
};
