import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  // hreflang alternates in the sitemap mirror the per-page metadata alternates
  const languages = { en: `${SITE_URL}/`, ko: `${SITE_URL}/ko` };

  return [
    { url: `${SITE_URL}/`, alternates: { languages } },
    { url: `${SITE_URL}/ko`, alternates: { languages } },
  ];
}
