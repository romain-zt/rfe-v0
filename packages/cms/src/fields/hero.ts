import type { Field } from 'payload'
import { imageDisplayFields } from './imageDisplay.ts'

const hideForMinimal = (_: Record<string, unknown>, siblingData: Record<string, unknown>) =>
  siblingData?.type !== 'minimal'

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
        description: 'Desktop / tablet image (used at ≥ 640px).',
        condition: hideForMinimal,
      },
    },
    ...imageDisplayFields({ condition: hideForMinimal }),
  ],
}
