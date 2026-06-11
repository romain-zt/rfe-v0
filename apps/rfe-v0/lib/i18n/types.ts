/**
 * I18N Types
 */

export type Language = 'en' | 'fr'

export type WorkCategory = 'film' | 'series' | 'unscripted'

export type ProductionStage =
  | 'produced'
  | 'in-production'
  | 'paid-development'
  | 'movies-development'
  | 'series-development'

export const PRODUCTION_STAGE_LABELS: Record<ProductionStage, string> = {
  'produced': 'Produced',
  'in-production': 'In Production',
  'paid-development': 'Paid Development',
  'movies-development': 'In Development — Movies',
  'series-development': 'In Development — Series',
}

export const PRODUCTION_STAGE_TAB_LABELS: Record<string, string> = {
  'paid-development': 'Paid Development',
  'movies-development': 'Movies',
  'series-development': 'Series',
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

export type WorkItem = {
  id: number
  slug?: string
  title: string
  year: number
  src: string
  tags: string[]
  description?: string
  videoUrl?: string
  category?: WorkCategory
  subcategory?: string
  productionStage?: ProductionStage
  credits?: WorkCredit[]
  seenOn?: { logoUrl?: string; name: string }[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export type TeamMember = {
  id: number
  name: string
  role: string
  bio: string
  photo?: string
}

export type AwardsNewsItem = {
  id: number
  date: string
  source: string
  title: string
  content: string
}

export type ContactInfo = {
  email: string
  phone: string
  address: string
  social: {
    instagram: string
    linkedin: string
    vimeo: string
    tiktok: string
    imdb: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Record<string, any>

export type SiteContent = {
  lang: Language
  t: Dictionary
  aboutContent: string[]
  teamMembers: TeamMember[]
  awardsNews: AwardsNewsItem[]
  contactInfo: ContactInfo
  ourWork: WorkItem[]
}
