import type { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props): string | null => {
  const { locale } = req

  if (slug === undefined || slug === null) {
    return null
  }

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

  return `/next/preview?${params.toString()}`
}
