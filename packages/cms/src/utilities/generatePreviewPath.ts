import type { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string | null | undefined
  req: PayloadRequest
  /** Optional absolute origin. Prefer omitting so the URL stays same-origin with the admin. */
  siteUrl?: string
}

/**
 * Preview / live-preview entry URL.
 *
 * Returns a **relative** `/next/preview?...` path by default. Payload's admin
 * `formatAbsoluteURL` resolves it against `window.location.origin`, which keeps
 * the embedded iframe same-origin with the admin panel. That is required for
 * `postMessage` + `ready` live-preview to work (strict origin checks).
 */
export const generatePreviewPath = ({ collection, slug, req, siteUrl }: Props): string | null => {
  const { locale } = req

  if (slug === undefined || slug === null || slug === '') {
    return null
  }

  const encodedSlug = encodeURIComponent(slug)
  const prefix = collectionPrefixMap[collection] ?? ''
  const pagePath =
    slug === 'home'
      ? `/${locale || 'en'}`
      : `/${locale || 'en'}${prefix ? `/${prefix}` : ''}/${encodedSlug}`

  const params = new URLSearchParams({
    slug: encodedSlug,
    collection,
    locale: locale || 'en',
    path: pagePath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const path = `/next/preview?${params.toString()}`
  if (siteUrl) {
    return `${siteUrl.replace(/\/$/, '')}${path}`
  }
  return path
}
