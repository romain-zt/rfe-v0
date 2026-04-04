import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://www.rohmfeiferentertainment.com/sitemap.xml',
      'https://www.rohmfeiferentertainment.com/video-sitemap.xml',
    ],
  };
}
