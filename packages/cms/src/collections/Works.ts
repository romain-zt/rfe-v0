import type { CollectionConfig } from 'payload'

export const Works: CollectionConfig = {
  slug: 'works',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'category', 'tags'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'year', type: 'number', required: true, admin: { position: 'sidebar' } },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Drama', value: 'Drama' },
        { label: 'Thriller', value: 'Thriller' },
        { label: 'True Crime', value: 'True Crime' },
        { label: 'Unscripted', value: 'Unscripted' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'videoUrl', type: 'text', admin: { description: 'YouTube or Vimeo embed URL' } },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Film', value: 'film' },
        { label: 'Series', value: 'series' },
        { label: 'Unscripted', value: 'unscripted' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'subcategory', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'keywords', type: 'text' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower = first' },
      defaultValue: 0,
    },
  ],
}
