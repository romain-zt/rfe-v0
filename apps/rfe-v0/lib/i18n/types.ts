/**
 * I18N Types
 */

export type Language = 'en' | 'fr'

export type WorkCategory = 'film' | 'series' | 'unscripted'

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
