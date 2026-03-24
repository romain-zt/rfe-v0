/**
 * ============================================
 * JSON-LD STRUCTURED DATA COMPONENTS
 * ============================================
 * Provides structured data for SEO.
 * Supports multiple schema types.
 * ============================================
 */

import { SITE_CONFIG, seoContent } from '@/lib/seo'
import type { Language, WorkItem } from '@/lib/i18n/types'
import { extractYouTubeId, generateWorkSeoDescription } from '@/lib/works'

// ===========================================
// TYPES
// ===========================================

interface OrganizationJsonLdProps {
  lang?: Language
}

interface WebPageJsonLdProps {
  lang?: Language
  page?: 'home' | 'ourWork' | 'ourTeam' | 'about' | 'news' | 'contact'
  url?: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

interface ArticleJsonLdProps {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
  url?: string
}

// ===========================================
// ORGANIZATION SCHEMA
// ===========================================

export function OrganizationJsonLd({ lang = 'en' }: OrganizationJsonLdProps) {
  const content = seoContent[lang]?.site
  const isFr = lang === 'fr'

  if (!content) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.url}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_CONFIG.url}/logo.png`,
    description: content.description,
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.contact.email,
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
    ].filter(Boolean),
    knowsAbout: isFr ? [
      'Cinéma au regard féminin',
      'Production cinématographique féministe',
      'Studio indépendant',
      'Films dirigés par des femmes',
      'Narration cinématographique',
    ] : [
      'Female Gaze Cinema',
      'Feminist Film Production',
      'Independent Film Studio',
      'Female-Led Films',
      'Cinematic Storytelling',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// WEBSITE SCHEMA
// ===========================================

export function WebsiteJsonLd({ lang = 'en' }: OrganizationJsonLdProps) {
  const content = seoContent[lang]?.site

  if (!content) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: content.description,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en-US',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// WEBPAGE SCHEMA
// ===========================================

export function WebPageJsonLd({
  lang = 'en',
  page = 'home',
  url = SITE_CONFIG.url,
}: WebPageJsonLdProps) {
  const content = seoContent[lang]?.pages?.[page]

  if (!content) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}/#webpage`,
    url: url,
    name: content.title,
    description: content.description,
    isPartOf: {
      '@id': `${SITE_CONFIG.url}/#website`,
    },
    about: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en-US',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// BREADCRUMB SCHEMA
// ===========================================

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// ARTICLE SCHEMA (for News)
// ===========================================

export function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  author = SITE_CONFIG.name,
  image = `${SITE_CONFIG.url}/logo.png`,
  url = SITE_CONFIG.url,
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// LOCAL BUSINESS SCHEMA
// ===========================================

export function LocalBusinessJsonLd({ lang = 'en' }: OrganizationJsonLdProps) {
  const content = seoContent[lang]?.site

  if (!content) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.name,
    description: content.description,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.contact.email,
    image: `${SITE_CONFIG.url}/logo-rfe.svg`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// WORK PAGE SCHEMA (VideoObject / Movie)
// ===========================================

interface WorkPageJsonLdProps {
  work: WorkItem
  lang: Language
  slug: string
}

export function WorkPageJsonLd({ work, lang, slug }: WorkPageJsonLdProps) {
  const description = generateWorkSeoDescription(work, lang)
  const workUrl = `${SITE_CONFIG.url}/${lang}/our-work/${slug}`
  const youtubeId = work.videoUrl ? extractYouTubeId(work.videoUrl) : null
  const posterUrl = work.src.startsWith('http') ? work.src : `${SITE_CONFIG.url}${work.src}`
  
  // Determine if it's a documentary or restoration work
  const isDocumentary = work.tags.some(tag => 
    ['Documentary Production', 'Production Documentaire', 'Documentary', 'Documentaire'].includes(tag)
  )
  
  // Build dedicated VideoObject schema when there's a YouTube video
  const videoSchema = youtubeId ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${workUrl}#video`,
    name: work.title,
    description: description,
    thumbnailUrl: [posterUrl],
    uploadDate: `${work.year}-01-01`,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    contentUrl: work.videoUrl,
    url: workUrl,
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en-US',
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`,
    },
  } : null
  
  // Build the main schema - use Movie for documentaries
  const mainSchema = {
    '@context': 'https://schema.org',
    '@type': isDocumentary ? 'Movie' : 'CreativeWork',
    '@id': `${workUrl}/#work`,
    name: work.title,
    description: description,
    dateCreated: String(work.year),
    ...(isDocumentary && {
      datePublished: String(work.year),
    }),
    image: {
      '@type': 'ImageObject',
      url: posterUrl,
      caption: work.title,
    },
    thumbnailUrl: posterUrl,
    ...(youtubeId && {
      video: {
        '@id': `${workUrl}#video`,
      },
    }),
    productionCompany: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en-US',
    genre: work.tags,
  }
  
  // ItemPage schema for the webpage itself
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@id': `${workUrl}/#webpage`,
    url: workUrl,
    name: `${work.title} (${work.year}) — ${SITE_CONFIG.name}`,
    description: description,
    isPartOf: {
      '@id': `${SITE_CONFIG.url}/#website`,
    },
    about: {
      '@id': `${workUrl}/#work`,
    },
    mainEntity: {
      '@id': `${workUrl}/#work`,
    },
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en-US',
  }
  
  return (
    <>
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
    </>
  )
}

// ===========================================
// NAVIGATION SCHEMA (for Sitelinks)
// ===========================================

export function NavigationJsonLd({ lang = 'en' }: OrganizationJsonLdProps) {
  const base = `${SITE_CONFIG.url}/${lang}`
  const isFr = lang === 'fr'
  
  const items = [
    { name: isFr ? 'Accueil' : 'Home', url: base },
    { name: isFr ? 'Nos Travaux' : 'Our Work', url: `${base}/our-work` },
    { name: isFr ? 'À Propos' : 'About', url: `${base}/about` },
    { name: 'Contact', url: `${base}/contact` },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${base}#navigation`,
    itemListElement: items.map((item, i) => ({
      '@type': 'SiteNavigationElement',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// COMBINED JSON-LD FOR ROOT LAYOUT
// ===========================================

export function RootJsonLd({ lang = 'en' }: OrganizationJsonLdProps) {
  return (
    <>
      <OrganizationJsonLd lang={lang} />
      <WebsiteJsonLd lang={lang} />
      <LocalBusinessJsonLd lang={lang} />
      <NavigationJsonLd lang={lang} />
    </>
  )
}
