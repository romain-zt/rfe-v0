import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rohmfeiferentertainment.com').replace(/\/$/, '')

const LOCALES = ['en'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const fallbackDate = new Date()

  const fallbackEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: fallbackDate,
    changeFrequency: 'daily',
    priority: 1.0,
  }))

  try {
    const payload = await getPayload({ config })

    const [pagesResult, worksResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        draft: false,
        limit: 1000,
        pagination: false,
        where: { _status: { equals: 'published' } },
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'works',
        draft: false,
        limit: 1000,
        pagination: false,
        select: { slug: true, updatedAt: true },
      }),
    ])

    for (const locale of LOCALES) {
      for (const page of pagesResult.docs) {
        if (!page.slug) continue
        const path = page.slug === 'home' ? '' : `/${page.slug}`
        entries.push({
          url: `${SITE_URL}/${locale}${path}`,
          lastModified: page.updatedAt ? new Date(page.updatedAt) : fallbackDate,
          changeFrequency: page.slug === 'home' ? 'daily' : 'weekly',
          priority: page.slug === 'home' ? 1.0 : 0.8,
        })
      }

      for (const work of worksResult.docs) {
        if (!work.slug) continue
        entries.push({
          url: `${SITE_URL}/${locale}/our-work/${work.slug}`,
          lastModified: work.updatedAt ? new Date(work.updatedAt) : fallbackDate,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    }

    return entries
  } catch {
    return fallbackEntries
  }
}
