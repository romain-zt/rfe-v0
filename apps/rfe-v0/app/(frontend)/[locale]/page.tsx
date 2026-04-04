import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { generatePageMetadata, SITE_CONFIG } from '@/lib/seo'
import { WebPageJsonLd } from '@/components/JsonLd'
import HomeContent from './HomeContent'

// Preload YouTube thumbnail for LCP optimization
const SHOWREEL_VIDEO_ID = 'VqnXSyivuB4'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata('home', locale, '/')
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  
  return (
    <>
      {/* Preload LCP image */}
      <link
        rel="preload"
        as="image"
        href={`https://img.youtube.com/vi/${SHOWREEL_VIDEO_ID}/maxresdefault.jpg`}
        fetchPriority="high"
      />
      <WebPageJsonLd page="home" lang={locale} url={base} />
      <HomeContent />
    </>
  )
}
