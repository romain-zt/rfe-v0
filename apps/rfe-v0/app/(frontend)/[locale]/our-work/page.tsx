import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { generatePageMetadata, SITE_CONFIG } from '@/lib/seo'
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import OurWorkContent from './OurWorkContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata('ourWork', locale, '/our-work')
}

export default async function OurWorkPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const isFr = locale === 'fr'
  
  return (
    <>
      <WebPageJsonLd page="ourWork" lang={locale} url={`${base}/our-work`} />
      <BreadcrumbJsonLd
        items={[
          { name: isFr ? 'Accueil' : 'Home', url: base },
          { name: isFr ? 'Nos Travaux' : 'Our Work', url: `${base}/our-work` },
        ]}
      />
      <OurWorkContent />
    </>
  )
}
