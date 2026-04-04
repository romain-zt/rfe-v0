import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SITE_CONFIG, OG_IMAGES } from '@/lib/seo'
import { getWorks, getWorkBySlug as getCmsWorkBySlug } from '@/lib/cms'
import { generateWorkKeywords, generateWorkSeoDescription } from '@/lib/works'
import { WorkPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import WorkPageContent from './WorkPageContent'
import type { Language } from '@/lib/i18n/types'

type Props = {
  params: Promise<{ locale: Language; slug: string }>
}

function getWorkTagLabel(tags: string[]): string {
  if (tags.some(tag => ['Drama', 'Drame'].includes(tag))) return 'Drama'
  if (tags.some(tag => ['Thriller'].includes(tag))) return 'Thriller'
  return 'Film'
}

export async function generateStaticParams() {
  const worksRes = await getWorks().catch(() => ({ docs: [] }))
  return worksRes.docs.map((w) => ({ locale: 'en', slug: w.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const cmsWork = await getCmsWorkBySlug(slug).catch(() => null)

  if (!cmsWork) return { title: 'Not Found' }

  const src = typeof cmsWork.poster === 'object' && cmsWork.poster ? cmsWork.poster.url : ''
  const tagLabel = getWorkTagLabel(cmsWork.tags ?? [])
  const baseTitle = (cmsWork.seo?.title ?? '').trim() || cmsWork.title
  const title = `${tagLabel} | ${baseTitle}`
  const workForSeo = { title: cmsWork.title, year: cmsWork.year, tags: cmsWork.tags ?? [], description: cmsWork.description, src }
  const description = (cmsWork.seo?.description ?? '').trim() || generateWorkSeoDescription(workForSeo, locale)
  const keywords = cmsWork.seo?.keywords
    ? cmsWork.seo.keywords.split(',').map((k) => k.trim())
    : generateWorkKeywords(workForSeo, locale)
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
        'x-default': `/en${pathname}`,
      },
    },
    openGraph: {
      type: 'video.movie',
      locale: 'en_US',
      url: `${SITE_CONFIG.url}/${locale}${pathname}`,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: src ? [{ url: src, width: OG_IMAGES.width, height: OG_IMAGES.height, alt: cmsWork.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: src ? [src] : [],
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
  const cmsWork = await getCmsWorkBySlug(slug).catch(() => null)

  if (!cmsWork) notFound()

  const work = {
    id: cmsWork.id,
    title: cmsWork.title,
    slug: cmsWork.slug,
    year: cmsWork.year,
    src: typeof cmsWork.poster === 'object' && cmsWork.poster ? cmsWork.poster.url : '',
    tags: cmsWork.tags ?? [],
    description: cmsWork.description ?? '',
    videoUrl: cmsWork.videoUrl,
    category: cmsWork.category,
    subcategory: cmsWork.subcategory,
  }

  const breadcrumbItems = [
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
