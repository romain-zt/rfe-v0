import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SITE_CONFIG, OG_IMAGES } from '@/lib/seo'
import { fallbackEn } from '@/lib/i18n/fallback/en'
import { fallbackFr } from '@/lib/i18n/fallback/fr'
import {
  getWorkBySlug,
  getWorkSlug,
  generateWorkKeywords,
  generateWorkSeoDescription,
} from '@/lib/works'
import { WorkPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import WorkPageContent from './WorkPageContent'
import type { Language } from '@/lib/i18n/types'

type Props = {
  params: Promise<{ locale: Language; slug: string }>
}

function getSiteContentStatic(locale: Language) {
  return locale === 'fr' ? fallbackFr : fallbackEn
}

export async function generateStaticParams() {
  const locales: Language[] = ['en', 'fr']
  const params: { locale: Language; slug: string }[] = []

  for (const locale of locales) {
    const site = getSiteContentStatic(locale)
    for (const item of site.ourWork) {
      params.push({
        locale,
        slug: getWorkSlug(item),
      })
    }
  }

  return params
}

function getWorkTagLabel(work: { tags: string[] }, locale: Language): string {
  const isDrama = work.tags.some(tag => ['Drama', 'Drame'].includes(tag))
  const isThriller = work.tags.some(tag => ['Thriller'].includes(tag))

  if (locale === 'fr') {
    if (isDrama) return 'Drame'
    if (isThriller) return 'Thriller'
    return 'Film'
  }

  if (isDrama) return 'Drama'
  if (isThriller) return 'Thriller'
  return 'Film'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const site = getSiteContentStatic(locale)
  const work = getWorkBySlug(slug, site.ourWork)

  if (!work) {
    return { title: 'Not Found' }
  }

  const tagLabel = getWorkTagLabel(work, locale)
  const baseTitle = (work.seoTitle || '').trim() || work.title
  const title = `${tagLabel} | ${baseTitle}`
  const description = (work.seoDescription || '').trim() || generateWorkSeoDescription(work, locale)
  const keywords = work.seoKeywords?.length ? work.seoKeywords : generateWorkKeywords(work, locale)
  const pathname = `/our-work/${slug}`

  return {
    title,
    description,
    keywords,
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: `/${locale}${pathname}`,
      languages: {
        en: `/en${pathname}`,
        fr: `/fr${pathname}`,
        'x-default': `/en${pathname}`,
      },
    },
    openGraph: {
      type: 'video.movie',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? 'en_US' : 'fr_FR',
      url: `${SITE_CONFIG.url}/${locale}${pathname}`,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: [
        {
          url: work.src,
          width: OG_IMAGES.width,
          height: OG_IMAGES.height,
          alt: work.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [work.src],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function WorkPage({ params }: Props) {
  const { locale, slug } = await params
  const site = getSiteContentStatic(locale)
  const work = getWorkBySlug(slug, site.ourWork)

  if (!work) {
    notFound()
  }

  const breadcrumbItems = locale === 'fr'
    ? [
        { name: 'Accueil', url: SITE_CONFIG.url },
        { name: 'Nos Travaux', url: `${SITE_CONFIG.url}/fr/our-work` },
        { name: work.title, url: `${SITE_CONFIG.url}/fr/our-work/${slug}` },
      ]
    : [
        { name: 'Home', url: SITE_CONFIG.url },
        { name: 'Our Work', url: `${SITE_CONFIG.url}/en/our-work` },
        { name: work.title, url: `${SITE_CONFIG.url}/en/our-work/${slug}` },
      ]

  return (
    <>
      <WorkPageJsonLd work={work} lang={locale} slug={slug} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <WorkPageContent work={work} />
    </>
  )
}
