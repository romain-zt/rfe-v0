import type { CollectionConfig } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { hero } from '../fields/hero'
import { blocks } from '../blocks'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { revalidateFrontend } from '../utilities/revalidateFrontend'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const locale = req.locale || 'en'
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        return slug === 'home' ? `${base}/${locale}` : `${base}/${locale}/${slug}`
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks,
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
            {
              name: 'keywords',
              type: 'text',
              localized: true,
              admin: {
                description: 'Comma-separated keywords for <meta name="keywords">',
              },
            },
            {
              name: 'canonicalUrl',
              type: 'text',
              admin: {
                description: 'Override canonical URL (leave empty for auto-generated)',
              },
            },
            {
              name: 'jsonLdType',
              type: 'select',
              defaultValue: 'WebPage',
              options: [
                { label: 'WebPage', value: 'WebPage' },
                { label: 'ItemPage', value: 'ItemPage' },
                { label: 'AboutPage', value: 'AboutPage' },
                { label: 'ContactPage', value: 'ContactPage' },
                { label: 'CollectionPage', value: 'CollectionPage' },
              ],
              admin: {
                description: 'JSON-LD @type for structured data',
                condition: () => false,
              },
            },
            {
              name: 'jsonLdCustom',
              type: 'json',
              admin: {
                description: 'Optional custom JSON-LD (injected verbatim). For advanced use only.',
                condition: () => false,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
      index: true,
      defaultValue: '',
      admin: {
        position: 'sidebar',
        description: 'URL slug ("home" is reserved for the homepage)',
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              return 'untitled'
            }
            if (value) {
              return value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .replace(/--+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '')
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && data && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc }) => {
        const wasPublished = doc._status === 'published'
        const slugChanged = doc.slug !== previousDoc?.slug
        if (wasPublished || slugChanged) {
          revalidateFrontend({ collection: 'pages', slug: doc.slug })
          if (slugChanged && previousDoc?.slug) {
            revalidateFrontend({ collection: 'pages', slug: previousDoc.slug })
          }
        }
      },
    ],
  },
}
