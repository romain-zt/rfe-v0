import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { SITE_CONFIG } from '@/lib/seo'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import PressContent from './PressContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isFr = locale === 'fr'
  return {
    title: isFr ? 'Presse — RFE' : 'Press — RFE',
    description: isFr
      ? 'Couverture presse de Rohm Feifer Entertainment.'
      : 'Press coverage of Rohm Feifer Entertainment.',
  }
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const isFr = locale === 'fr'

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: isFr ? 'Accueil' : 'Home', url: base },
          { name: 'Press', url: `${base}/press` },
        ]}
      />
      <PressContent />
    </>
  )
}
