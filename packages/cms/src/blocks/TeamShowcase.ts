import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TeamShowcase: Block = {
  slug: 'teamShowcase',
  interfaceName: 'TeamShowcaseBlock',
  labels: { singular: 'Team Showcase', plural: 'Team Showcases' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'introText',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'showBios',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showPhotos',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sectionTone',
      type: 'select',
      defaultValue: 'charcoal',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Deep', value: 'deep' },
        { label: 'Warm', value: 'warm' },
      ],
    },
  ],
}
