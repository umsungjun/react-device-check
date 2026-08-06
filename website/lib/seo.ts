import type { Metadata } from 'next';
import type { Locale } from '@/content/types';

// Single source of truth for the deployed origin — change here if a custom domain is added
export const SITE_URL = 'https://react-device-check-site.vercel.app';
export const GITHUB_URL = 'https://github.com/umsungjun/react-device-check';
export const NPM_URL = 'https://www.npmjs.com/package/react-device-check';

const TITLES: Record<Locale, string> = {
  en: 'react-device-check — React device detection hooks for CSR & SSR',
  ko: 'react-device-check — CSR·SSR 모두를 위한 React 기기 판별 훅',
};

const DESCRIPTIONS: Record<Locale, string> = {
  en: 'Detect mobile, tablet, or desktop and the OS in any React app with zero dependencies, ~1.5 kB, and no hydration errors in Next.js. iPad-as-Mac unmasking, Client Hints first, React 17–19.',
  ko: '의존성 0개, ~1.5 kB, Next.js hydration 에러 없이 어떤 React 앱에서든 모바일·태블릿·데스크톱과 OS를 판별하세요. iPad 위장 해제, Client Hints 우선, React 17–19 지원.',
};

const PATHS: Record<Locale, string> = { en: '/', ko: '/ko' };

// One builder for both routes so canonical/hreflang shapes can never drift
export const buildMetadata = (locale: Locale): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: TITLES[locale],
  description: DESCRIPTIONS[locale],
  keywords: [
    'react',
    'react-hook',
    'device-detection',
    'mobile-detect',
    'is-mobile',
    'is-tablet',
    'user-agent',
    'client-hints',
    'ssr',
    'nextjs',
    'hydration',
    'typescript',
  ],
  alternates: {
    canonical: PATHS[locale],
    languages: { en: '/', ko: '/ko', 'x-default': '/' },
  },
  openGraph: {
    type: 'website',
    url: PATHS[locale],
    siteName: 'react-device-check',
    title: TITLES[locale],
    description: DESCRIPTIONS[locale],
    locale: locale === 'en' ? 'en_US' : 'ko_KR',
    alternateLocale: locale === 'en' ? 'ko_KR' : 'en_US',
    // Static file in public/ — explicit reference because the opengraph-image
    // file convention doesn't inject meta tags across route-group root layouts
    images: [{ url: '/og.png', width: 1200, height: 630, alt: TITLES[locale] }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLES[locale],
    description: DESCRIPTIONS[locale],
    images: ['/og.png'],
  },
});

// SoftwareApplication rich-result shape: free-price offer is the standard answer for OSS
export const buildJsonLd = (locale: Locale) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'react-device-check',
  description: DESCRIPTIONS[locale],
  url: SITE_URL,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  license: 'https://opensource.org/licenses/MIT',
  inLanguage: locale,
  sameAs: [GITHUB_URL, NPM_URL],
});
