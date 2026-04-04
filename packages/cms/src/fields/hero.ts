import type { Field } from 'payload'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'page',
      options: [
        { label: 'Cinematic (full-bleed)', value: 'cinematic' },
        { label: 'Page (image + headline)', value: 'page' },
        { label: 'Minimal (text only)', value: 'minimal' },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'label',
      type: 'text',
      localized: true,
      admin: {
        description: 'Small uppercase label above the headline (e.g. "OUR WORK", "ABOUT US")',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
    {
      name: 'imagePosition',
      type: 'text',
      defaultValue: 'center center',
      admin: {
        description: 'CSS object-position value (e.g. "center top", "50% 30%")',
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
  ],
}
