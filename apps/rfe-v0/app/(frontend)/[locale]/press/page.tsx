import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { SITE_CONFIG } from '@/lib/seo'
import { getPressItems } from '@/lib/cms'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import PressContent from './PressContent'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params
  return {
    title: 'Press — RFE',
    description: 'Press coverage of Rohm Feifer Entertainment.',
  }
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params
  const base = `${SITE_CONFIG.url}/${locale}`
  const pressRes = await getPressItems().catch(() => ({ docs: [] }))

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: base },
          { name: 'Press', url: `${base}/press` },
        ]}
      />
      <PressContent items={pressRes.docs} />
    </>
  )
}
