/**
 * ============================================
 * WORK ITEMS UTILITIES
 * ============================================
 * Helpers for work item slugs and data access
 * ============================================
 */

import type { Language, WorkItem } from './i18n/types'

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Remove consecutive dashes
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
}

export function getWorkSlug(work: Pick<WorkItem, 'slug' | 'title'>): string {
  const slug = (work.slug || '').trim()
  return slug ? slug : generateSlug(work.title)
}

export function getWorkBySlug(slug: string, items: WorkItem[]): WorkItem | undefined {
  return items.find(item => getWorkSlug(item) === slug)
}

export function getWorkById(id: number, items: WorkItem[]): WorkItem | undefined {
  return items.find(item => item.id === id)
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Generate SEO keywords from work item
 */
export function generateWorkKeywords(work: WorkItem, locale: Language): string[] {
  const baseKeywords = locale === 'fr'
    ? ['film', 'production cinématographique', 'regard féminin', 'RFE']
    : ['film', 'film production', 'female gaze', 'RFE']

  const titleKeywords = work.title.split(/\s+/).filter(word => word.length > 2)
  const tagKeywords = work.tags || []

  return [...new Set([...baseKeywords, ...titleKeywords, ...tagKeywords, String(work.year)])]
}

/**
 * Generate SEO description for work item
 */
export function generateWorkSeoDescription(work: WorkItem, locale: Language): string {
  if (work.seoDescription) {
    return work.seoDescription
  }

  if (work.description) {
    return work.description
  }

  const isDrama = work.tags.some(tag => ['Drama', 'Drame'].includes(tag))
  const isThriller = work.tags.some(tag => ['Thriller'].includes(tag))

  if (locale === 'fr') {
    if (isDrama) {
      return `Découvrez ${work.title} (${work.year}), un drame produit par RFE.`
    }
    if (isThriller) {
      return `Découvrez ${work.title} (${work.year}), un thriller produit par RFE.`
    }
    return `${work.title} (${work.year}) — Une production RFE.`
  }

  if (isDrama) {
    return `Discover ${work.title} (${work.year}), a drama produced by RFE.`
  }
  if (isThriller) {
    return `Discover ${work.title} (${work.year}), a thriller produced by RFE.`
  }
  return `${work.title} (${work.year}) — An RFE production.`
}
