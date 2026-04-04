import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { generatePageMetadata, SITE_CONFIG } from '@/lib/seo'
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import AboutContent from './AboutContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata('about', locale, '/about')
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const isFr = locale === 'fr'
  
  return (
    <>
      <WebPageJsonLd page="about" lang={locale} url={`${base}/about`} />
      <BreadcrumbJsonLd
        items={[
          { name: isFr ? 'Accueil' : 'Home', url: base },
          { name: isFr ? 'À Propos' : 'About', url: `${base}/about` },
        ]}
      />
      <AboutContent />
    </>
  )
}
