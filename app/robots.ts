import { getSiteUrl } from '@/lib/siteUrl';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin', '/api'],
    },
    // robots.txtのSitemap行は仕様上絶対URLである必要がある
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
