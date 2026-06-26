import type { GlobalConfig } from 'payload'
import { revalidateSiteGlobalAfterChange } from '../utilities/cmsRevalidationHooks.ts'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  hooks: {
    afterChange: [revalidateSiteGlobalAfterChange],
  },
  fields: [
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'isExternal', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        { name: 'legalLabel', type: 'text', defaultValue: 'Legal notice' },
        { name: 'copyrightText', type: 'text', defaultValue: '© 2026 RFE. All rights reserved.' },
      ],
    },
  ],
}
