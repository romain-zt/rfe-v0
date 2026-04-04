import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { draftMode } from 'next/headers'
import { getPageBySlug, getSiteConfig } from '@/lib/cms'
import { generatePageMeta, generatePageJsonLd } from '@/lib/generate-meta'
import { RenderHero } from '@/components/blocks/RenderHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'

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
  const page = await getPageBySlug('home')
  const draft = await draftMode()
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
      {draft.isEnabled && <LivePreviewListener />}

      <RenderHero hero={page.hero} />

      <div className="relative z-10" style={{ background: 'var(--background)' }}>
        <div
          className="absolute top-0 left-0 right-0 -translate-y-full pointer-events-none"
          style={{
            height: '40vh',
            background: 'linear-gradient(to top, var(--background) 0%, rgba(7, 7, 8, 0.85) 30%, rgba(7, 7, 8, 0.4) 65%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <RenderBlocks blocks={page.layout} />
      </div>

      {generatePageJsonLd(page, locale, siteConfig)}
    </main>
  )
}
