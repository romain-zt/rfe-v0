import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'

const LOCALES = ['en'] as const

/** Next.js 16: second arg required; expire immediately so CMS edits show on next request. */
const REVALIDATE_NOW = { expire: 0 } as const

/** Invalidate all CMS data cache tags. */
export function revalidateCmsDataTags() {
  revalidateTag('cms', REVALIDATE_NOW)
}

export function revalidatePageData(slug: string) {
  revalidateCmsDataTags()
  revalidateTag(`cms:pages:${slug}`, REVALIDATE_NOW)
  for (const locale of LOCALES) {
    const path = slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
    revalidatePath(path, 'page')
  }
}

export function revalidateWorkData(slug: string) {
  revalidateTag(`cms:works:${slug}`, REVALIDATE_NOW)
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/our-work/${slug}`, 'page')
  }
}

/**
 * Purges static routes and data caches after CMS edits that can affect multiple pages
 * (works, work groups, media, team, press, etc.).
 */
export async function revalidateSitePaths() {
  revalidateCmsDataTags()

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`, 'layout')
  }

  const payload = await getPayload({ config })

  const [pages, works] = await Promise.all([
    payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false }),
    payload.find({ collection: 'works', limit: 200, depth: 0, pagination: false }),
  ])

  for (const locale of LOCALES) {
    for (const page of pages.docs) {
      const slug = typeof page.slug === 'string' ? page.slug : ''
      if (!slug) continue
      const path = slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
      revalidatePath(path, 'page')
      revalidateTag(`cms:pages:${slug}`, REVALIDATE_NOW)
    }

    revalidatePath(`/${locale}/our-work`, 'page')

    for (const work of works.docs) {
      const slug = typeof work.slug === 'string' ? work.slug : ''
      if (!slug) continue
      revalidatePath(`/${locale}/our-work/${slug}`, 'page')
      revalidateTag(`cms:works:${slug}`, REVALIDATE_NOW)
    }
  }
}
