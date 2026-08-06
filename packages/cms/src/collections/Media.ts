import type { CollectionConfig } from 'payload'
import {
  revalidateSiteAfterChange,
  revalidateSiteAfterDelete,
} from '../utilities/cmsRevalidationHooks.ts'

function titleFromFilename(filename: unknown): string | undefined {
  if (typeof filename !== 'string' || !filename.trim()) return undefined
  return filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Admin',
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'alt', 'updatedAt'],
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!data) return data
        // Keep an editable display name in sync when empty (create or legacy docs).
        if (!data.title) {
          data.title =
            titleFromFilename(data.filename) ||
            titleFromFilename(originalDoc?.filename) ||
            data.alt ||
            originalDoc?.alt ||
            data.title
        }
        return data
      },
    ],
    afterChange: [revalidateSiteAfterChange],
    afterDelete: [revalidateSiteAfterDelete],
  },
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'poster',
        width: 800,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Name',
      admin: {
        description: 'Display name in the admin panel. Does not change the stored filename.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
}
