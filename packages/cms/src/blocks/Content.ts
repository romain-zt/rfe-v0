import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'full',
          options: [
            { label: 'Full Width', value: 'full' },
            { label: 'Half', value: 'half' },
            { label: 'One Third', value: 'oneThird' },
            { label: 'Two Thirds', value: 'twoThirds' },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor(),
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'sectionTone',
      type: 'select',
      admin: { description: 'Background tone for this section' },
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Deep', value: 'deep' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Slate', value: 'slate' },
        { label: 'Warm', value: 'warm' },
        { label: 'Cool', value: 'cool' },
        { label: 'Ember', value: 'ember' },
        { label: 'Dusk', value: 'dusk' },
      ],
    },
  ],
}
