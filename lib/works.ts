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

export function getWorkSlug(work: WorkItem): string {
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
    ? ['restauration de film', 'colorisation', 'production documentaire', 'Composite Films']
    : ['film restoration', 'colorization', 'documentary production', 'Composite Films']

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

  const isRestoration = work.tags.some(tag =>
    ['Colorization', 'Colorisation', 'Restoration', 'Restauration'].includes(tag)
  )
  const isDocumentary = work.tags.some(tag =>
    ['Documentary Production', 'Production Documentaire'].includes(tag)
  )

  if (locale === 'fr') {
    if (isRestoration) {
      return `Découvrez ${work.title} (${work.year}), un projet de colorisation et restauration par Composite Films.`
    }
    if (isDocumentary) {
      return `Découvrez ${work.title} (${work.year}), une production documentaire par Composite Films.`
    }
    return `${work.title} (${work.year}) - Un projet par Composite Films.`
  }

  if (isRestoration) {
    return `Discover ${work.title} (${work.year}), a colorization and restoration project by Composite Films.`
  }
  if (isDocumentary) {
    return `Discover ${work.title} (${work.year}), a documentary production by Composite Films.`
  }
  return `${work.title} (${work.year}) - A project by Composite Films.`
}
