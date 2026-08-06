// Locale-independent code snippets — code and comments stay English for both locales

// One entry per package manager, rendered as click-to-copy tabs in the hero
export const INSTALL_COMMANDS = [
  { pm: 'npm', command: 'npm install react-device-check' },
  { pm: 'yarn', command: 'yarn add react-device-check' },
  { pm: 'pnpm', command: 'pnpm add react-device-check' },
];

// Paired with strings.usage.examples by index
export const USAGE_EXAMPLES = [
  {
    filename: 'app/page.tsx',
    code: `import { useDevice } from 'react-device-check';

export default function Page() {
  const { type, os, isMobile, isHydrated } = useDevice();

  // Server render & hydration first paint: type = 'desktop', isHydrated = false.
  // One render later the real device shows up — no hydration mismatch, ever.
  if (!isHydrated) return <Skeleton />;

  if (isMobile && os === 'ios') return <AppStoreBanner />;
  return <p>You are on a {type} running {os}.</p>;
}`,
  },
  {
    filename: 'components/DownloadButton.tsx',
    code: `import { useIsMobile, useOS } from 'react-device-check';

export default function DownloadButton() {
  const isMobile = useIsMobile(); // boolean only — ~1.1 kB total
  const os = useOS(); // 'ios' | 'android' | ...

  if (isMobile && os === 'ios') return <AppStoreButton />;
  if (isMobile && os === 'android') return <PlayStoreButton />;
  return <DesktopDownloadButton />;
}`,
  },
  {
    filename: 'middleware.ts',
    code: `import { detectDevice } from 'react-device-check';

export function middleware(request: Request) {
  // No React, no globals — inject any signals you have
  const { type } = detectDevice({
    ua: request.headers.get('user-agent') ?? '',
  });

  if (type === 'mobile') {
    // e.g. rewrite to the lightweight variant
  }
}`,
  },
];
