import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { SITE_URL } from '@/lib/seo';
import '../globals.css';

// Fallback for routes without their own metadata; pages override via buildMetadata
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

// Second root layout for the /ko subtree — navigation across locales is a full page load by design
export default function KoLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
