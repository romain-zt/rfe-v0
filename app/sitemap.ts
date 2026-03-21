import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo'
import { fallbackEn } from '@/lib/i18n/fallback/en'
import { fallbackFr } from '@/lib/i18n/fallback/fr'
import { getWorkSlug } from '@/lib/works'
import type { Language } from '@/lib/i18n/types'

const locales = ['en', 'fr'] as const
const pages = ['', 'about', 'contact', 'our-work'] as const

function isoDateOnly(d: Date) {
  // Google-friendly: YYYY-MM-DD
  return d.toISOString().split('T')[0]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, '') // no trailing slash
  const lastModified = isoDateOnly(new Date())

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add main pages
  for (const locale of locales) {
    for (const page of pages) {
      const path = page === '' ? '' : `/${page}`
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      })
    }
  }

  // Add work pages for SEO
  for (const locale of locales) {
    const site = locale === 'fr' ? fallbackFr : fallbackEn
    for (const work of site.ourWork) {
      const slug = getWorkSlug(work)
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/our-work/${slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return sitemapEntries
}
