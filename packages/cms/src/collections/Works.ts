import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../utilities/revalidateFrontend.ts'

export const Works: CollectionConfig = {
  slug: 'works',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'category', 'tags'],
    group: 'Content',
  },
  hooks: {
    afterChange: [
      () => {
        revalidateFrontend({ collection: 'works' })
        revalidateFrontend({ collection: 'pages' })
      },
    ],
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
      name: 'credits',
      type: 'array',
      admin: {
        description:
          'People and companies attached to this project. Headline credit appears on the work card. All credits appear on the detail page.',
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Director', value: 'director' },
            { label: 'Writer', value: 'writer' },
            { label: 'Executive Producer', value: 'ep' },
            { label: 'Producer', value: 'producer' },
            { label: 'Star', value: 'star' },
            { label: 'Showrunner', value: 'showrunner' },
            { label: 'Co-Producer', value: 'co-producer' },
            { label: 'Creator', value: 'creator' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'imdbUrl',
          type: 'text',
          admin: { description: 'Optional. Must start with https://www.imdb.com/' },
          validate: (val: unknown) => {
            if (!val || typeof val !== 'string' || val.length === 0) return true
            if (!val.startsWith('https://www.imdb.com/'))
              return 'Must start with https://www.imdb.com/'
            return true
          },
        },
        {
          name: 'note',
          type: 'text',
          admin: { description: 'Optional 1-line context (e.g. "creator of Criminal Minds")' },
        },
        {
          name: 'isHeadline',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Show this credit on the work card. If multiple are checked, the first wins.',
          },
        },
      ],
    },
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
    {
      name: 'productionStage',
      type: 'select',
      options: [
        { label: 'Produced', value: 'produced' },
        { label: 'In Production', value: 'in-production' },
        { label: 'Paid Development', value: 'paid-development' },
        { label: 'In Development — Movies', value: 'movies-development' },
        { label: 'In Development — Series', value: 'series-development' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Where this project sits in the production pipeline. Used to group works on the website.',
      },
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
