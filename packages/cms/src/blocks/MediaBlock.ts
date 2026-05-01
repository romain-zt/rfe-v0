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
      admin: {
        description: 'Desktop / tablet image (used at \u2265 640px).',
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
        { label: 'Full Width', value: 'full' },
        { label: 'Contained', value: 'contained' },
      ],
    },
    {
      name: 'imagePosition',
      type: 'text',
      defaultValue: 'center center',
      admin: {
        description: 'CSS object-position for the desktop image (e.g. "center top", "50% 30%").',
      },
    },
    {
      name: 'imageFit',
      type: 'select',
      defaultValue: 'cover',
      options: [
        { label: 'Cover \u2014 fills the container (may crop)', value: 'cover' },
        { label: 'Contain \u2014 whole image visible (may letterbox)', value: 'contain' },
      ],
      admin: {
        description: 'How the desktop image fits its container.',
      },
    },
    {
      name: 'mediaMobile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional portrait/mobile image (used at < 640px). Falls back to the desktop image if empty.',
      },
    },
    {
      name: 'imagePositionMobile',
      type: 'text',
      admin: {
        description:
          'Optional CSS object-position for mobile (e.g. "center top"). Falls back to the desktop value if empty.',
      },
    },
    {
      name: 'imageFitMobile',
      type: 'select',
      options: [
        { label: 'Cover \u2014 fills the container (may crop)', value: 'cover' },
        { label: 'Contain \u2014 whole image visible (may letterbox)', value: 'contain' },
      ],
      admin: {
        description:
          'Optional override for mobile (< 640px). Leave empty to use the desktop value.',
      },
    },
  ],
}
