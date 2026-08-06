import type { Metadata } from 'next';
import Landing from '@/components/Landing';
import { ko } from '@/content/ko';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata('ko');

export default function KoHomePage() {
  return <Landing locale="ko" strings={ko} />;
}
