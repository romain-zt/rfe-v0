import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://www.rfe.studio/sitemap.xml',
      'https://www.rfe.studio/video-sitemap.xml',
    ],
  };
}
