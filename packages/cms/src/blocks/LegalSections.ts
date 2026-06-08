import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const LegalSections: Block = {
  slug: 'legalSections',
  interfaceName: 'LegalSectionsBlock',
  labels: { singular: 'Legal Sections', plural: 'Legal Sections' },
  fields: [
    {
      name: 'sections',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor(),
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
