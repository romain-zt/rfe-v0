import type { Block } from 'payload'
import { imageDisplayFields } from '../fields/imageDisplay.ts'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlockType',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Desktop / tablet image (used at ≥ 640px).',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full width', value: 'full' },
        { label: 'Contained', value: 'contained' },
      ],
    },
    ...imageDisplayFields(),
  ],
}
