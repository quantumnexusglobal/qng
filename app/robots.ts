import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.quantumnexusglobal.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/api/', '/team-portal'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
