import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../utilities/revalidateFrontend.ts'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Admin',
  },
  hooks: {
    afterChange: [() => { void revalidateFrontend({ collection: 'media' }) }],
    afterDelete: [() => { void revalidateFrontend({ scope: 'site' }) }],
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
      name: 'alt',
      type: 'text',
      localized: true,
    },
  ],
}
