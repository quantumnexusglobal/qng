import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.quantumnexusglobal.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/events',
    '/gallery',
    '/team',
    '/blog',
    '/join',
    '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
