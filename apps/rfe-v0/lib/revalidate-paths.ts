import { revalidatePath, revalidateTag } from 'next/cache'
import { getPayload } from 'payload'

const LOCALES = ['en'] as const

/** Next.js 16: second arg required; expire immediately so CMS edits show on next request. */
const REVALIDATE_NOW = { expire: 0 } as const

const STATIC_CMS_TAGS = [
  'cms',
  'cms:works',
  'cms:team-members',
  'cms:press-items',
  'cms:pages',
  'cms:works-groups',
  'cms:platforms',
  'cms:globals',
  'cms:globals:site-config',
  'cms:globals:navigation',
] as const

/** Invalidate all CMS data cache tags used by lib/cms.ts. */
export function revalidateCmsDataTags() {
  for (const tag of STATIC_CMS_TAGS) {
    revalidateTag(tag, REVALIDATE_NOW)
  }
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
  revalidateTag('cms:works', REVALIDATE_NOW)
  revalidateTag(`cms:works:${slug}`, REVALIDATE_NOW)
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/our-work/${slug}`, 'page')
    revalidatePath(`/${locale}/our-work`, 'page')
    revalidatePath(`/${locale}/development`, 'page')
  }
}

/**
 * Purges static routes and data caches after CMS edits.
 * Revalidates every page path, all unstable_cache tags, and locale layouts.
 */
export async function revalidateSitePaths() {
  revalidateCmsDataTags()

  revalidatePath('/', 'layout')

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`, 'layout')
    revalidatePath(`/${locale}/our-work`, 'page')
  }

  const config = (await import('@/payload.config')).default
  const payload = await getPayload({ config })

  const [pages, works, worksGroups] = await Promise.all([
    payload.find({ collection: 'pages', limit: 100, depth: 0, pagination: false }),
    payload.find({ collection: 'works', limit: 200, depth: 0, pagination: false }),
    payload.find({ collection: 'works-groups', limit: 100, depth: 0, pagination: false }),
  ])

  for (const locale of LOCALES) {
    for (const page of pages.docs) {
      const slug = typeof page.slug === 'string' ? page.slug : ''
      if (!slug) continue
      const path = slug === 'home' ? `/${locale}` : `/${locale}/${slug}`
      revalidatePath(path, 'page')
      revalidateTag(`cms:pages:${slug}`, REVALIDATE_NOW)
    }

    for (const work of works.docs) {
      const slug = typeof work.slug === 'string' ? work.slug : ''
      if (!slug) continue
      revalidatePath(`/${locale}/our-work/${slug}`, 'page')
      revalidateTag(`cms:works:${slug}`, REVALIDATE_NOW)
    }

    for (const group of worksGroups.docs) {
      const slug = typeof group.slug === 'string' ? group.slug : ''
      if (!slug) continue
      revalidateTag(`cms:works-groups:${slug}`, REVALIDATE_NOW)
    }
  }
}
