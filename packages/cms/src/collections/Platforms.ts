import type { CollectionConfig } from 'payload'

export const Platforms: CollectionConfig = {
  slug: 'platforms',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    group: 'Content',
    description: 'Broadcast and streaming platforms. Reusable across works.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Short display name — e.g. Lifetime, TF1, Netflix' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: { description: 'Channel / platform logo (transparent PNG preferred)' },
    },
  ],
}
