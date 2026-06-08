import type { Block } from 'payload'

export const EmbeddedForm: Block = {
  slug: 'embeddedForm',
  interfaceName: 'EmbeddedFormBlock',
  labels: { singular: 'Embedded form', plural: 'Embedded forms' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      maxDepth: 2,
    },
  ],
}
