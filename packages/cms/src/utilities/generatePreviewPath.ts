import type { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  siteUrl?: string
}

export const generatePreviewPath = ({ collection, slug, req, siteUrl }: Props): string | null => {
  const { locale } = req

  if (slug === undefined || slug === null) {
    return null
  }

  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const encodedSlug = encodeURIComponent(slug)
  const prefix = collectionPrefixMap[collection] ?? ''
  const pagePath = slug === 'home'
    ? `/${locale || 'en'}`
    : `/${locale || 'en'}${prefix ? `/${prefix}` : ''}/${encodedSlug}`

  const params = new URLSearchParams({
    slug: encodedSlug,
    collection,
    locale: locale || 'en',
    path: pagePath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  return `${base}/next/preview?${params.toString()}`
}
