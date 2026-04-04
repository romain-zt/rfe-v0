import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'
import { getPageBySlug, getAllPages, getSiteConfig } from '@/lib/cms'
import { generatePageMeta, generatePageJsonLd } from '@/lib/generate-meta'
import { PageContent } from '@/components/PageContent'

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
  const draft = await draftMode()
  const page = await getPageBySlug(slug, draft.isEnabled)

  if (!page) {
    notFound()
  }

  const siteConfig = await getSiteConfig().catch(() => null)

  return (
    <main className="relative">
      <PageContent initialData={page} />
      {generatePageJsonLd(page, locale, siteConfig)}
    </main>
  )
}
