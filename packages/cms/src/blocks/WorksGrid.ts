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
      name: 'category',
      type: 'select',
      admin: { description: 'Filter works by category. Leave empty to show all.' },
      options: [
        { label: 'Film', value: 'film' },
        { label: 'Series', value: 'series' },
        { label: 'Unscripted', value: 'unscripted' },
      ],
    },
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
}
