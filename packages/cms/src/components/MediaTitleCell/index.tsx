'use client'

import React from 'react'
import { Link, Thumbnail, useConfig } from '@payloadcms/ui'
import { formatAdminURL, getBestFitFromSizes, isImage } from 'payload/shared'
import type { SanitizedCollectionConfig } from 'payload'

type Props = {
  cellData?: unknown
  collectionSlug?: string
  rowData?: Record<string, unknown>
  collectionConfig?: SanitizedCollectionConfig
  /** When true, this is the linked column — wrap content in the edit URL. */
  link?: boolean
  linkURL?: string
  viewType?: 'default' | 'trash' | string
}

/**
 * List cell: thumbnail + Name (title), mirroring Payload's filename FileCell
 * so the media list can lead with the human-readable name instead of the storage filename.
 *
 * Custom Cells replace DefaultCell entirely, so they must render the edit link themselves.
 */
export const MediaTitleCell: React.FC<Props> = ({
  cellData,
  collectionConfig,
  collectionSlug,
  link,
  linkURL,
  rowData = {},
  viewType,
}) => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const filename = typeof rowData.filename === 'string' ? rowData.filename : null
  const id = rowData.id != null ? String(rowData.id) : ''
  const label =
    (typeof cellData === 'string' && cellData.trim()) || filename || 'Untitled'

  const mimeType = typeof rowData.mimeType === 'string' ? rowData.mimeType : ''
  const thumbnailURL = typeof rowData.thumbnailURL === 'string' ? rowData.thumbnailURL : undefined
  const url = typeof rowData.url === 'string' ? rowData.url : undefined
  const width = typeof rowData.width === 'number' ? rowData.width : undefined
  const updatedAt = typeof rowData.updatedAt === 'string' ? rowData.updatedAt : undefined

  const previewAllowed = collectionConfig?.upload?.displayPreview ?? true
  const isFileImage = isImage(mimeType)
  let fileSrc = isFileImage ? thumbnailURL || url : thumbnailURL

  if (previewAllowed && isFileImage) {
    fileSrc = getBestFitFromSizes({
      sizes: rowData.sizes as Parameters<typeof getBestFitFromSizes>[0]['sizes'],
      thumbnailURL,
      url: url ?? '',
      width,
    })
  }

  const content = previewAllowed ? (
    <div className="file">
      <Thumbnail
        className="file__thumbnail"
        collectionSlug={collectionConfig?.slug || collectionSlug}
        doc={{
          ...rowData,
          filename,
        }}
        fileSrc={fileSrc}
        imageCacheTag={collectionConfig?.upload?.cacheTags && updatedAt ? updatedAt : undefined}
        size="small"
        uploadConfig={collectionConfig?.upload}
      />
      <span className="file__filename">{String(label)}</span>
    </div>
  ) : (
    <>{String(label)}</>
  )

  if (!link) {
    return content
  }

  const href =
    linkURL ||
    (collectionSlug && id
      ? formatAdminURL({
          adminRoute,
          path: `/collections/${collectionSlug}${viewType === 'trash' ? '/trash' : ''}/${encodeURIComponent(id)}`,
        })
      : '')

  if (!href) {
    return content
  }

  return (
    <Link href={href} prefetch={false}>
      {content}
    </Link>
  )
}
