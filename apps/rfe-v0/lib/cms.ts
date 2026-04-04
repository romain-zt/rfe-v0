import { createPayloadClient } from '@rfe/cms/client'

const cms = createPayloadClient(process.env.CMS_API_URL || 'http://localhost:3001')

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

export async function getWorks(query?: Record<string, string>) {
  return cms.find<Work>('works', { limit: '100', sort: 'sortOrder', depth: '1', ...query })
}

export async function getWorkBySlug(slug: string) {
  return cms.findBySlug<Work>('works', slug)
}

export async function getWorksByCategory(category: string) {
  return cms.find<Work>('works', {
    'where[category][equals]': category,
    limit: '100',
    sort: 'sortOrder',
    depth: '1',
  })
}

export async function getTeamMembers() {
  return cms.find<TeamMember>('team-members', { sort: 'sortOrder', depth: '1' })
}

export async function getPressItems() {
  return cms.find<PressItem>('press-items', { sort: '-date', depth: '0' })
}

export async function getSiteConfig() {
  return cms.findGlobal<SiteConfig>('site-config')
}

export async function getNavigation() {
  return cms.findGlobal<NavigationData>('navigation')
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

export async function getPageBySlug(slug: string) {
  const params = new URLSearchParams({
    'where[slug][equals]': slug,
    limit: '1',
    depth: '2',
  })
  const apiUrl = process.env.CMS_API_URL || 'http://localhost:3001'
  const res = await fetch(`${apiUrl}/api/pages?${params}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return (data.docs?.[0] as PageData) ?? null
}

export async function getAllPages() {
  return cms.find<PageData>('pages', { limit: '100', depth: '0' })
}

export type WorksGroupData = {
  id: number
  name: string
  slug: string
  items: Work[]
}

export async function getWorksGroup(slug: string) {
  return cms.findBySlug<WorksGroupData>('works-groups', slug)
}
