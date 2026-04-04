import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { SITE_CONFIG } from '@/lib/seo'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import DevelopmentContent from './DevelopmentContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isFr = locale === 'fr'
  return {
    title: isFr ? 'Développement — RFE' : 'Development — RFE',
    description: isFr
      ? 'Films, séries et non-scripted en développement chez Rohm Feifer Entertainment.'
      : 'Films, series and unscripted in development at Rohm Feifer Entertainment.',
  }
}

export default async function DevelopmentPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const isFr = locale === 'fr'

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: isFr ? 'Accueil' : 'Home', url: base },
          { name: isFr ? 'Développement' : 'Development', url: `${base}/development` },
        ]}
      />
      <DevelopmentContent />
    </>
  )
}
