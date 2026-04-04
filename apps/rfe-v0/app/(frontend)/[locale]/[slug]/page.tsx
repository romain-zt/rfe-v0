import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { getPageBySlug, getAllPages, getSiteConfig } from '@/lib/cms'
import { generatePageMeta, generatePageJsonLd } from '@/lib/generate-meta'
import { RenderHero } from '@/components/blocks/RenderHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'

type Props = {
  params: Promise<{ locale: Language; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}

  const siteConfig = await getSiteConfig().catch(() => null)
  return generatePageMeta(page, locale, siteConfig)
}

export async function generateStaticParams() {
  try {
    const pages = await getAllPages()
    return pages.docs
      .filter((p) => p.slug !== 'home')
      .map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const draft = await draftMode()
  const siteConfig = await getSiteConfig().catch(() => null)

  return (
    <main className="relative">
      {draft.isEnabled && <LivePreviewListener />}

      <RenderHero hero={page.hero} />

      <div className="relative z-10" style={{ background: 'var(--background)' }}>
        {page.hero?.type !== 'minimal' && (
          <div
            className="absolute top-0 left-0 right-0 -translate-y-full pointer-events-none"
            style={{
              height: '40vh',
              background: 'linear-gradient(to top, var(--background) 0%, rgba(7, 7, 8, 0.85) 30%, rgba(7, 7, 8, 0.4) 65%, transparent 100%)',
            }}
            aria-hidden="true"
          />
        )}

        <RenderBlocks blocks={page.layout} />
      </div>

      {generatePageJsonLd(page, locale, siteConfig)}
    </main>
  )
}
