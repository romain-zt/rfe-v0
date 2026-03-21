import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { generatePageMetadata, SITE_CONFIG } from '@/lib/seo'
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import OurTeamContent from './OurTeamContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata('ourTeam', locale, '/our-team')
}

export default async function OurTeamPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const isFr = locale === 'fr'

  return (
    <>
      <WebPageJsonLd page="ourTeam" lang={locale} url={`${base}/our-team`} />
      <BreadcrumbJsonLd
        items={[
          { name: isFr ? 'Accueil' : 'Home', url: base },
          { name: isFr ? 'Notre Équipe' : 'Our Team', url: `${base}/our-team` },
        ]}
      />
      <OurTeamContent />
    </>
  )
}
