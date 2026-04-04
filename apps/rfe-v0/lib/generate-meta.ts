import type { Metadata } from 'next'
import type { PageData, SiteConfig } from './cms'
import type { Language } from './i18n/types'
import React from 'react'

const FALLBACK_SITE_URL = 'https://www.rohmfeiferentertainment.com'
const FALLBACK_SITE_NAME = 'RFE'

function getSiteUrl(siteConfig: SiteConfig | null): string {
  return siteConfig?.seo?.siteUrl || FALLBACK_SITE_URL
}

function getSiteName(siteConfig: SiteConfig | null): string {
  return siteConfig?.brand?.name || FALLBACK_SITE_NAME
}

export function generatePageMeta(
  page: PageData,
  locale: Language,
  siteConfig: SiteConfig | null,
): Metadata {
  const siteUrl = getSiteUrl(siteConfig)
  const siteName = getSiteName(siteConfig)
  const title = page.meta?.title || `${page.title} — ${siteName}`
  const description = page.meta?.description || siteConfig?.seo?.defaultDescription || ''
  const keywords = page.meta?.keywords || siteConfig?.seo?.keywords || ''
  const pathSlug = page.slug === 'home' ? '' : `/${page.slug}`
  const canonical = page.meta?.canonicalUrl || `${siteUrl}/${locale}${pathSlug}`

  const ogImageUrl = (() => {
    if (page.meta?.image && typeof page.meta.image === 'object' && page.meta.image.url) {
      return page.meta.image.url
    }
    if (siteConfig?.seo?.ogImage && typeof siteConfig.seo.ogImage === 'object') {
      return (siteConfig.seo.ogImage as any).url
    }
    return `${siteUrl}/logo-rfe.svg`
  })()

  return {
    title,
    description,
    keywords: keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en${pathSlug}`,
        'x-default': `${siteUrl}/en${pathSlug}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      url: canonical,
      siteName,
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  }
}

export function generatePageJsonLd(
  page: PageData,
  locale: Language,
  siteConfig: SiteConfig | null,
): React.ReactNode {
  const siteUrl = getSiteUrl(siteConfig)
  const siteName = getSiteName(siteConfig)
  const pathSlug = page.slug === 'home' ? '' : `/${page.slug}`
  const pageUrl = `${siteUrl}/${locale}${pathSlug}`
  const jsonLdType = page.meta?.jsonLdType || 'WebPage'

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': jsonLdType,
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: page.meta?.title || page.title,
    description: page.meta?.description || '',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
    datePublished: page.publishedAt,
    dateModified: page.updatedAt,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${locale}` },
      ...(page.slug !== 'home'
        ? [{ '@type': 'ListItem', position: 2, name: page.title, item: pageUrl }]
        : []),
    ],
  }

  const schemas: object[] = [pageSchema, breadcrumbSchema]

  if (page.meta?.jsonLdCustom) {
    schemas.push({
      '@context': 'https://schema.org',
      ...page.meta.jsonLdCustom,
    })
  }

  return React.createElement(React.Fragment, null,
    ...schemas.map((schema, i) =>
      React.createElement('script', {
        key: `jsonld-${i}`,
        type: 'application/ld+json',
        dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
      })
    )
  )
}

export function generateSiteJsonLd(
  siteConfig: SiteConfig | null,
  navigationItems: { label: string; href: string }[],
  locale: Language,
): React.ReactNode {
  const siteUrl = getSiteUrl(siteConfig)
  const siteName = getSiteName(siteConfig)

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png`, width: 512, height: 512 },
    description: siteConfig?.seo?.defaultDescription || '',
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig?.contact?.email || '',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    sameAs: [
      siteConfig?.social?.instagram,
      siteConfig?.social?.imdb,
      siteConfig?.social?.linkedin,
      siteConfig?.social?.vimeo,
    ].filter(Boolean),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description: siteConfig?.seo?.defaultDescription || '',
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
  }

  const navSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteUrl}/${locale}#navigation`,
    itemListElement: navigationItems.map((item, i) => ({
      '@type': 'SiteNavigationElement',
      position: i + 1,
      name: item.label,
      url: `${siteUrl}/${locale}${item.href}`,
    })),
  }

  const schemas = [orgSchema, websiteSchema, navSchema]

  return React.createElement(React.Fragment, null,
    ...schemas.map((schema, i) =>
      React.createElement('script', {
        key: `site-jsonld-${i}`,
        type: 'application/ld+json',
        dangerouslySetInnerHTML: { __html: JSON.stringify(schema) },
      })
    )
  )
}
