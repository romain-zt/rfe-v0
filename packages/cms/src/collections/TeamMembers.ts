import type { CollectionConfig } from 'payload'
import {
  revalidateSiteAfterChange,
  revalidateSiteAfterDelete,
} from '../utilities/cmsRevalidationHooks.ts'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: {
    read: () => true,
  },
  admin: { useAsTitle: 'name', group: 'Content' },
  hooks: {
    afterChange: [revalidateSiteAfterChange],
    afterDelete: [revalidateSiteAfterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
