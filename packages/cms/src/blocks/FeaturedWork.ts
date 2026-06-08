import type { Block } from 'payload'

export const FeaturedWork: Block = {
  slug: 'featuredWork',
  interfaceName: 'FeaturedWorkBlock',
  labels: { singular: 'Featured Work', plural: 'Featured Works' },
  fields: [
    {
      name: 'work',
      type: 'relationship',
      relationTo: 'works',
      admin: { description: 'Select a work to feature' },
    },
    {
      name: 'overridePoster',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Override the poster image (optional)' },
    },
    {
      name: 'quote',
      type: 'textarea',
      localized: true,
      admin: { description: 'Featured quote or tagline' },
    },
    {
      name: 'attribution',
      type: 'text',
      localized: true,
      admin: { description: 'Quote attribution (e.g. "Deadline Hollywood")' },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: { description: 'Link to external article or trailer' },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'split',
      options: [
        { label: 'Split (poster + text)', value: 'split' },
        { label: 'Overlay (text over poster)', value: 'overlay' },
      ],
    },
    {
      name: 'sectionTone',
      type: 'select',
      defaultValue: 'deep',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Deep', value: 'deep' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Warm', value: 'warm' },
        { label: 'Ember', value: 'ember' },
        { label: 'Dusk', value: 'dusk' },
      ],
    },
  ],
}
