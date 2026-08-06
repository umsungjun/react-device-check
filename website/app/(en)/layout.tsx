import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { SITE_URL } from '@/lib/seo';
import '../globals.css';

// Fallback for routes without their own metadata (e.g. not-found); pages override via buildMetadata
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

// Route groups give each locale its own root layout so <html lang> is correct per URL
export default function EnLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
