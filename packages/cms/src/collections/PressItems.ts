import type { CollectionConfig } from 'payload'

export const PressItems: CollectionConfig = {
  slug: 'press-items',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'source', 'date'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'source', type: 'text', required: true },
    { name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'monthOnly' } } },
    { name: 'url', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
