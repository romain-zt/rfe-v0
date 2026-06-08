import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { draftMode } from 'next/headers'
import { getPageBySlug, getSiteConfig } from '@/lib/cms'
import { generatePageMeta, generatePageJsonLd } from '@/lib/generate-meta'
import { PageContent } from '@/components/PageContent'

/** Home is not in `[slug]` static params; avoid caching an empty page before seed runs. */
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getPageBySlug('home')
  if (!page) {
    return { title: 'RFE — a cinematic female gaze studio' }
  }
  const siteConfig = await getSiteConfig().catch(() => null)
  return generatePageMeta(page, locale, siteConfig)
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const draft = await draftMode()
  const page = await getPageBySlug('home', draft.isEnabled)
  const siteConfig = await getSiteConfig().catch(() => null)

  if (!page) {
    return (
      <main className="pt-32 pb-24 text-center">
        <h1 className="text-2xl font-light">Content loading...</h1>
        <p className="text-muted-foreground mt-4">Run the seed script to populate pages.</p>
      </main>
    )
  }

  return (
    <main className="relative">
      <PageContent initialData={page} />
      {generatePageJsonLd(page, locale, siteConfig)}
    </main>
  )
}
