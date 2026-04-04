import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { generatePageMetadata, SITE_CONFIG } from '@/lib/seo'
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import LegalContent from './LegalContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata('legal', locale, '/legal')
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const isFr = locale === 'fr'

  return (
    <>
      <WebPageJsonLd page="legal" lang={locale} url={`${base}/legal`} />
      <BreadcrumbJsonLd
        items={[
          { name: isFr ? 'Accueil' : 'Home', url: base },
          { name: isFr ? 'Mentions légales' : 'Legal notice', url: `${base}/legal` },
        ]}
      />
      <LegalContent />
    </>
  )
}
