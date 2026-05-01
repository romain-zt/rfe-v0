import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlockType',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
        { label: 'Full Width', value: 'full' },
        { label: 'Contained', value: 'contained' },
      ],
    },
    {
      name: 'imagePosition',
      type: 'text',
      defaultValue: 'center center',
      admin: {
        description:
          'CSS object-position value (e.g. "center top", "50% 30%"). Applies at all breakpoints.',
      },
    },
  ],
}
