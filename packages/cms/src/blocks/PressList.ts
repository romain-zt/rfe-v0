import type { Block } from 'payload'

export const PressList: Block = {
  slug: 'pressList',
  interfaceName: 'PressListBlock',
  labels: { singular: 'Press List', plural: 'Press Lists' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 100,
      admin: { description: 'Maximum number of press items. Use a small number for teasers.' },
    },
    {
      name: 'showViewAll',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show a "View All" link to the press page' },
    },
    {
      name: 'viewAllUrl',
      type: 'text',
      defaultValue: '/press',
      admin: {
        condition: (_, siblingData) => siblingData?.showViewAll,
      },
    },
    {
      name: 'sectionTone',
      type: 'select',
      defaultValue: 'charcoal',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Deep', value: 'deep' },
        { label: 'Slate', value: 'slate' },
        { label: 'Warm', value: 'warm' },
      ],
    },
  ],
}
