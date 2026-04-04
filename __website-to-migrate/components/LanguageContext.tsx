'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type {
  Language,
  Dictionary,
  TeamMember,
  AwardsNewsItem,
  ContactInfo,
  WorkItem,
} from '@/lib/i18n/types'

export type SiteContentData = {
  aboutContent: string[]
  teamMembers: TeamMember[]
  awardsNews: AwardsNewsItem[]
  contactInfo: ContactInfo
  ourWork: WorkItem[]
}

type LanguageContextType = {
  lang: Language
  t: Dictionary
  content: SiteContentData
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  locale,
  t,
  content,
}: {
  children: ReactNode
  locale: Language
  t: Dictionary
  content: SiteContentData
}) {
  return (
    <LanguageContext.Provider value={{ lang: locale, t, content }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Re-export types for convenience
export type { Language, TeamMember, AwardsNewsItem, ContactInfo, WorkItem }
