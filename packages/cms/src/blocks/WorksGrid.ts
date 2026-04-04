import type { Block } from 'payload'

export const WorksGrid: Block = {
  slug: 'worksGrid',
  interfaceName: 'WorksGridBlock',
  labels: { singular: 'Works Grid', plural: 'Works Grids' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
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
                description: 'Choose how to populate this grid',
              },
              options: [
                { label: 'All Works (with filters)', value: 'all' },
                { label: 'Pick Works', value: 'pick' },
                { label: 'Use a Group', value: 'group' },
              ],
            },
            {
              name: 'selectedWorks',
              type: 'relationship',
              relationTo: 'works',
              hasMany: true,
              admin: {
                description: 'Pick and reorder individual works for this grid',
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
          ],
        },
        {
          label: 'Display',
          fields: [
            {
              name: 'showFilters',
              type: 'checkbox',
              defaultValue: true,
              admin: { description: 'Show category/tag filter tabs above the grid' },
            },
            {
              name: 'showSubcategoryTabs',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Show subcategory tabs (for development page)' },
            },
            {
              name: 'category',
              type: 'select',
              admin: { description: 'Pre-filter works by category' },
              options: [
                { label: 'Film', value: 'film' },
                { label: 'Series', value: 'series' },
                { label: 'Unscripted', value: 'unscripted' },
              ],
            },
            {
              name: 'limit',
              type: 'number',
              defaultValue: 100,
              admin: { description: 'Maximum number of works to display' },
            },
            {
              name: 'sectionTone',
              type: 'select',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Charcoal', value: 'charcoal' },
                { label: 'Deep', value: 'deep' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
