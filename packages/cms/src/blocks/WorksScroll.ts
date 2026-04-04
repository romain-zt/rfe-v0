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
      type: 'tabs',
      tabs: [
        {
          label: 'Works Source',
          fields: [
            {
              name: 'sourceType',
              type: 'radio',
              defaultValue: 'all',
              admin: {
                layout: 'horizontal',
                description: 'Choose how to populate this scroll strip',
              },
              options: [
                { label: 'All Works', value: 'all' },
                { label: 'Pick Works', value: 'pick' },
                { label: 'Use a Group', value: 'group' },
                { label: 'Manual Items', value: 'manual' },
              ],
            },
            {
              name: 'selectedWorks',
              type: 'relationship',
              relationTo: 'works',
              hasMany: true,
              admin: {
                description: 'Pick and reorder individual works',
                condition: (_, siblingData) => siblingData?.sourceType === 'pick',
              },
            },
            {
              name: 'worksGroup',
              type: 'relationship',
              relationTo: 'works-groups',
              admin: {
                description: 'Pick a reusable works group',
                condition: (_, siblingData) => siblingData?.sourceType === 'group',
              },
            },
            {
              name: 'items',
              type: 'array',
              minRows: 0,
              admin: {
                description: 'Manual items with per-item size/label control',
                condition: (_, siblingData) => siblingData?.sourceType === 'manual',
              },
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
          ],
        },
        {
          label: 'Display',
          fields: [
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
        },
      ],
    },
  ],
}
