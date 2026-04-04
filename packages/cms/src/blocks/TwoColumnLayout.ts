import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TwoColumnLayout: Block = {
  slug: 'twoColumnLayout',
  interfaceName: 'TwoColumnLayoutBlock',
  labels: { singular: 'Two Column Layout', plural: 'Two Column Layouts' },
  fields: [
    {
      name: 'leftColumn',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'leftMedia',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image for the left column (optional if using rich text)' },
    },
    {
      name: 'rightColumn',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'rightMedia',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image for the right column (optional if using rich text)' },
    },
    {
      name: 'reverseOnMobile',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'sectionTone',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Deep', value: 'deep' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Slate', value: 'slate' },
        { label: 'Warm', value: 'warm' },
        { label: 'Cool', value: 'cool' },
      ],
    },
  ],
}
