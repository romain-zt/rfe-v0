import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'

async function getPayloadClient() {
  return getPayload({ config })
}

export type WorkCreditRole = 'director' | 'writer' | 'ep' | 'producer' | 'star' | 'showrunner' | 'co-producer' | 'creator' | 'other'

export type WorkCredit = {
  id?: string
  name: string
  role: WorkCreditRole
  imdbUrl?: string
  note?: string
  isHeadline?: boolean
}

export type Platform = {
  id: number
  name: string
  logo?: { url: string; updatedAt?: string; sizes?: { thumbnail?: { url: string } } } | number | null
  updatedAt: string
  createdAt: string
}

export type Work = {
  id: number
  title: string
  slug: string
  year: number
  poster?: {
    url: string
    updatedAt?: string
    sizes?: {
      thumbnail?: { url: string }
      poster?: { url: string }
      hero?: { url: string }
    }
  } | number
  tags: string[]
  description: unknown
  videoUrl?: string
  category?: 'film' | 'series' | 'unscripted'
  productionStage?: 'produced' | 'in-production' | 'paid-development' | 'movies-development' | 'series-development'
  subcategory?: string
  credits?: WorkCredit[]
  seenOn?: (Platform | number)[]
  sortOrder: number
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
}

export type TeamMember = {
  id: number
  name: string
  role: string
  bio: string
  photo?: {
    url: string
    sizes?: {
      thumbnail?: { url: string }
      poster?: { url: string }
    }
  } | number
  sortOrder: number
}

export type PressItem = {
  id: number
  title: string
  source: string
  date: string
  url: string
  description?: string
  sortOrder: number
}

export type SiteConfig = {
  brand: { name: string; tagline: string; logo?: { url: string }; favicon?: { url: string } }
  colors: { background: string; foreground: string; rfeRed: string; rfeRose: string; rfeGold: string }
  sectionTones: { deep: string; charcoal: string; slate: string; warm: string; cool: string; ember: string; dusk: string }
  typography: { brandFont: string; sansFont: string; serifFont: string; radiusBase: string }
  easings: { emerge: string; quiet: string; sharp: string }
  seo: { titleTemplate: string; defaultTitle: string; defaultDescription: string; keywords: string; siteUrl: string; ogImage?: { url: string } }
  contact: { email: string; phone?: string; address: string }
  social: { instagram?: string; linkedin?: string; vimeo?: string; tiktok?: string; imdb?: string }
  about: {
    paragraphs: { text: string }[]
    heroHeadline: string
    heroSubheadline: string
    heroParagraph: string
  }
  legal: {
    title: string
    subtitle: string
    sections: { title: string; paragraphs: { text: string }[] }[]
  }
  ui?: {
    workView?: string
    developmentFilms?: string
    developmentSeries?: string
    developmentUnscripted?: string
  }
}

export type NavigationData = {
  header: {
    items: { label: string; href: string; isExternal: boolean }[]
  }
  footer: {
    legalLabel: string
    copyrightText: string
  }
}

export type PageData = {
  id: number
  title: string
  slug: string
  hero: {
    type: 'cinematic' | 'page' | 'minimal'
    headline?: string
    subtitle?: string
    label?: string
    media?: { url?: string; alt?: string; sizes?: Record<string, { url: string }> } | number | null
    imagePosition?: string
  }
  layout: Array<{ blockType: string; [key: string]: unknown }>
  meta?: {
    title?: string
    description?: string
    image?: { url?: string } | number | null
    keywords?: string
    canonicalUrl?: string
    jsonLdType?: string
    jsonLdCustom?: Record<string, unknown>
  }
  publishedAt?: string
  updatedAt?: string
}

export type WorksGroupData = {
  id: number
  name: string
  slug: string
  items: Work[]
}

async function fetchWorks(category?: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'works',
    limit: 100,
    sort: 'sortOrder',
    depth: 2,
    ...(category ? { where: { category: { equals: category } } } : {}),
  })
  return result as unknown as { docs: Work[]; totalDocs: number }
}

async function fetchWorkBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'works',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as Work) ?? null
}

async function fetchTeamMembers() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'team-members',
    sort: 'sortOrder',
    depth: 1,
  })
  return result as unknown as { docs: TeamMember[]; totalDocs: number }
}

async function fetchPressItems() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'press-items',
    sort: '-date',
    depth: 0,
  })
  return result as unknown as { docs: PressItem[]; totalDocs: number }
}

async function fetchSiteConfig() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-config' }) as unknown as SiteConfig
}

async function fetchNavigation() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation' }) as unknown as NavigationData
}

async function fetchPageBySlug(slug: string, draft = false) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
  })
  return (result.docs[0] as unknown as PageData) ?? null
}

async function fetchAllPages() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    limit: 100,
    depth: 0,
  })
  return result as unknown as { docs: PageData[]; totalDocs: number }
}

async function fetchWorksGroup(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'works-groups',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as WorksGroupData) ?? null
}

const cacheOpts = { revalidate: false as const }

/** Skip unstable_cache in dev — it persists across refreshes and blocks CMS edits from showing. */
const useCmsCache = process.env.NODE_ENV === 'production'

export async function getWorks(query?: { category?: string }) {
  const category = query?.category ?? 'all'
  const args = category === 'all' ? undefined : category
  if (!useCmsCache) return fetchWorks(args)
  return unstable_cache(fetchWorks, ['cms-works', category], {
    tags: ['cms', 'cms:works'],
    ...cacheOpts,
  })(args)
}

export async function getWorkBySlug(slug: string) {
  if (!useCmsCache) return fetchWorkBySlug(slug)
  return unstable_cache(fetchWorkBySlug, ['cms-work', slug], {
    tags: ['cms', 'cms:works', `cms:works:${slug}`],
    ...cacheOpts,
  })(slug)
}

export async function getWorksByCategory(category: string) {
  return getWorks({ category })
}

export async function getTeamMembers() {
  if (!useCmsCache) return fetchTeamMembers()
  return unstable_cache(fetchTeamMembers, ['cms-team-members'], {
    tags: ['cms', 'cms:team-members'],
    ...cacheOpts,
  })()
}

export async function getPressItems() {
  if (!useCmsCache) return fetchPressItems()
  return unstable_cache(fetchPressItems, ['cms-press-items'], {
    tags: ['cms', 'cms:press-items'],
    ...cacheOpts,
  })()
}

export async function getSiteConfig() {
  if (!useCmsCache) return fetchSiteConfig()
  return unstable_cache(fetchSiteConfig, ['cms-site-config'], {
    tags: ['cms', 'cms:globals', 'cms:globals:site-config'],
    ...cacheOpts,
  })()
}

export async function getNavigation() {
  if (!useCmsCache) return fetchNavigation()
  return unstable_cache(fetchNavigation, ['cms-navigation'], {
    tags: ['cms', 'cms:globals', 'cms:globals:navigation'],
    ...cacheOpts,
  })()
}

export async function getPageBySlug(slug: string, draft = false) {
  if (draft) return fetchPageBySlug(slug, true)
  if (!useCmsCache) return fetchPageBySlug(slug, false)

  return unstable_cache(fetchPageBySlug, ['cms-page', slug], {
    tags: ['cms', 'cms:pages', `cms:pages:${slug}`],
    ...cacheOpts,
  })(slug, false)
}

export async function getAllPages() {
  if (!useCmsCache) return fetchAllPages()
  return unstable_cache(fetchAllPages, ['cms-all-pages'], {
    tags: ['cms', 'cms:pages'],
    ...cacheOpts,
  })()
}

export async function getWorksGroup(slug: string) {
  if (!useCmsCache) return fetchWorksGroup(slug)
  return unstable_cache(fetchWorksGroup, ['cms-works-group', slug], {
    tags: ['cms', 'cms:works-groups', `cms:works-groups:${slug}`],
    ...cacheOpts,
  })(slug)
}
