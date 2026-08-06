export type Locale = 'en' | 'ko';

interface SectionHeading {
  overline: string;
  title: string;
}

export interface ShowcaseStrings extends SectionHeading {
  intro: string;
  claimLabel: string;
  verdictLabel: string;
  devices: { name: string; caption: string }[];
}

export interface DemoStrings extends SectionHeading {
  intro: string;
  serverPanel: string;
  serverNote: string;
  livePanel: string;
  liveNote: string;
  waitingBadge: string;
  hydratedBadge: string;
  hint: string;
}

// One interface for every visible string — TypeScript keeps en/ko structurally in sync
export interface LandingStrings {
  header: {
    langLabel: string;
    langHref: string;
  };
  hero: {
    badges: string[];
    titlePre: string;
    titleAccent: string;
    titlePost: string;
    tagline: string;
    ctaDemo: string;
    ctaGithub: string;
  };
  showcase: ShowcaseStrings;
  demo: DemoStrings;
  install: {
    copyHint: string;
    copied: string;
  };
  usage: SectionHeading & {
    body: string;
    // Explanations pair with USAGE_EXAMPLES in content/code.ts by index
    examples: { title: string; body: string }[];
  };
  features: SectionHeading & {
    items: { title: string; body: string }[];
  };
  compare: SectionHeading & {
    body: string;
  };
  api: SectionHeading & {
    rows: { name: string; desc: string }[];
    docsLead: string;
    docsLinkText: string;
  };
  footer: {
    tagline: string;
  };
}
