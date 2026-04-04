import type { CollectionConfig } from 'payload'

export const WorksGroups: CollectionConfig = {
  slug: 'works-groups',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
    group: 'Content',
    description: 'Curated lists of works for use in page blocks (grids, scroll strips, etc.)',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Internal label (e.g. "Home Featured", "Development Projects")' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'works',
      hasMany: true,
      required: true,
      admin: {
        description: 'Pick and reorder works. Drag to set display order.',
      },
    },
  ],
}
