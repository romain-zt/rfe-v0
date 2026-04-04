import { getPayload } from 'payload'
import config from '@/payload.config'

async function getPayloadClient() {
  return getPayload({ config })
}

export type Work = {
  id: number
  title: string
  slug: string
  year: number
  poster?: {
    url: string
    sizes?: {
      thumbnail?: { url: string }
      poster?: { url: string }
      hero?: { url: string }
    }
  } | number
  tags: string[]
  description: string
  videoUrl?: string
  category?: 'film' | 'series' | 'unscripted'
  subcategory?: string
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

export async function getWorks(query?: { category?: string }) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'works',
    limit: 100,
    sort: 'sortOrder',
    depth: 1,
    ...(query?.category ? { where: { category: { equals: query.category } } } : {}),
  })
  return result as unknown as { docs: Work[]; totalDocs: number }
}

export async function getWorkBySlug(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'works',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return (result.docs[0] as unknown as Work) ?? null
}

export async function getWorksByCategory(category: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'works',
    where: { category: { equals: category } },
    limit: 100,
    sort: 'sortOrder',
    depth: 1,
  })
  return result as unknown as { docs: Work[]; totalDocs: number }
}

export async function getTeamMembers() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'team-members',
    sort: 'sortOrder',
    depth: 1,
  })
  return result as unknown as { docs: TeamMember[]; totalDocs: number }
}

export async function getPressItems() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'press-items',
    sort: '-date',
    depth: 0,
  })
  return result as unknown as { docs: PressItem[]; totalDocs: number }
}

export async function getSiteConfig() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-config' }) as unknown as SiteConfig
}

export async function getNavigation() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation' }) as unknown as NavigationData
}

export async function getPageBySlug(slug: string, draft = false) {
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

export async function getAllPages() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    limit: 100,
    depth: 0,
  })
  return result as unknown as { docs: PageData[]; totalDocs: number }
}

export async function getWorksGroup(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'works-groups',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return (result.docs[0] as unknown as WorksGroupData) ?? null
}
