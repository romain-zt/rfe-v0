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
        description: 'Desktop / tablet image (used at \u2265 640px).',
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
    {
      name: 'imagePosition',
      type: 'text',
      defaultValue: 'center center',
      admin: {
        description: 'CSS object-position for the desktop image (e.g. "center top", "50% 30%").',
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
    {
      name: 'imageFit',
      type: 'select',
      defaultValue: 'cover',
      options: [
        { label: 'Cover \u2014 fills the viewport (may crop)', value: 'cover' },
        { label: 'Contain \u2014 whole image visible (may letterbox)', value: 'contain' },
      ],
      admin: {
        description: 'How the desktop image fits the viewport.',
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
    {
      name: 'mediaMobile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional portrait/mobile image (used at < 640px). Falls back to the desktop image if empty.',
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
    {
      name: 'imagePositionMobile',
      type: 'text',
      admin: {
        description:
          'Optional CSS object-position for mobile (e.g. "center top"). Falls back to the desktop value if empty.',
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
    {
      name: 'imageFitMobile',
      type: 'select',
      options: [
        { label: 'Cover \u2014 fills the viewport (may crop)', value: 'cover' },
        { label: 'Contain \u2014 whole image visible (may letterbox)', value: 'contain' },
      ],
      admin: {
        description:
          'Optional override for mobile (< 640px). Leave empty to use the desktop value.',
        condition: (_, siblingData) => siblingData?.type !== 'minimal',
      },
    },
  ],
}
