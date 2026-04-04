import type { Block } from 'payload'

export const WorksScroll: Block = {
  slug: 'worksScroll',
  interfaceName: 'WorksScrollBlock',
  labels: { singular: 'Works Horizontal Scroll', plural: 'Works Horizontal Scrolls' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      defaultValue: 'Our Work',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'work',
          type: 'relationship',
          relationTo: 'works',
          admin: { description: 'Select a work, or use the manual fields below' },
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Override image (or use for non-work items like BTS photos)' },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: 'Override label (e.g. "Lifetime", "On set")' },
        },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'large',
          options: [
            { label: 'Large', value: 'large' },
            { label: 'Medium', value: 'medium' },
            { label: 'Small', value: 'small' },
          ],
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'View All',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/our-work',
    },
    {
      name: 'sectionTone',
      type: 'select',
      defaultValue: 'warm',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Warm', value: 'warm' },
        { label: 'Charcoal', value: 'charcoal' },
      ],
    },
  ],
}
