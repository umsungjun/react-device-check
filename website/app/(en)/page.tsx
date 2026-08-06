import type { Metadata } from 'next';
import Landing from '@/components/Landing';
import { en } from '@/content/en';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('en');

export default function HomePage() {
  return <Landing locale="en" strings={en} />;
}
