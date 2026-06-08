import type { Block } from 'payload'

export const ContactInfo: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlock',
  labels: { singular: 'Contact Info', plural: 'Contact Info' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'showEmail',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showPhone',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showAddress',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSocials',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
