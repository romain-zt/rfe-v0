import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { generatePageMetadata, SITE_CONFIG } from '@/lib/seo'
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import ContactContent from './ContactContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata('contact', locale, '/contact')
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const isFr = locale === 'fr'
  
  return (
    <>
      <WebPageJsonLd page="contact" lang={locale} url={`${base}/contact`} />
      <BreadcrumbJsonLd
        items={[
          { name: isFr ? 'Accueil' : 'Home', url: base },
          { name: 'Contact', url: `${base}/contact` },
        ]}
      />
      <ContactContent />
    </>
  )
}
