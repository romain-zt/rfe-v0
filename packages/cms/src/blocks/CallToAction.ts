import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'isExternal',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'appearance',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Outline', value: 'outline' },
            { label: 'Gold', value: 'gold' },
          ],
        },
      ],
    },
    {
      name: 'sectionTone',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Deep', value: 'deep' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Warm', value: 'warm' },
      ],
    },
  ],
}
