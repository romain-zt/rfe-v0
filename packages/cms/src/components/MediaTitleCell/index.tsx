'use client'

import React from 'react'
import { Thumbnail } from '@payloadcms/ui'
import { getBestFitFromSizes, isImage } from 'payload/shared'
import type { SanitizedCollectionConfig } from 'payload'

type Props = {
  cellData?: unknown
  collectionSlug?: string
  rowData?: Record<string, unknown>
  collectionConfig?: SanitizedCollectionConfig
}

/**
 * List cell: thumbnail + Name (title), mirroring Payload's filename FileCell
 * so the media list can lead with the human-readable name instead of the storage filename.
 */
export const MediaTitleCell: React.FC<Props> = ({
  cellData,
  collectionConfig,
  collectionSlug,
  rowData = {},
}) => {
  const filename = typeof rowData.filename === 'string' ? rowData.filename : null
  const label =
    (typeof cellData === 'string' && cellData.trim()) || filename || 'Untitled'

  const previewAllowed = collectionConfig?.upload?.displayPreview ?? true
  if (!previewAllowed) {
    return <>{String(label)}</>
  }

  const mimeType = typeof rowData.mimeType === 'string' ? rowData.mimeType : ''
  const thumbnailURL = typeof rowData.thumbnailURL === 'string' ? rowData.thumbnailURL : undefined
  const url = typeof rowData.url === 'string' ? rowData.url : undefined
  const width = typeof rowData.width === 'number' ? rowData.width : undefined
  const updatedAt = typeof rowData.updatedAt === 'string' ? rowData.updatedAt : undefined

  const isFileImage = isImage(mimeType)
  let fileSrc = isFileImage ? thumbnailURL || url : thumbnailURL

  if (isFileImage) {
    fileSrc = getBestFitFromSizes({
      sizes: rowData.sizes as Parameters<typeof getBestFitFromSizes>[0]['sizes'],
      thumbnailURL,
      url: url ?? '',
      width,
    })
  }

  return (
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
  )
}
