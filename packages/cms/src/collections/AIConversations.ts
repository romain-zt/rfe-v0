import type { CollectionConfig } from 'payload'

export const AIConversations: CollectionConfig = {
  slug: 'ai-conversations',
  labels: { singular: 'AI Conversation', plural: 'AI Conversations' },
  admin: {
    hidden: true,
    defaultColumns: ['title', 'user', 'updatedAt'],
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }) => (user ? { user: { equals: user.id } } : false),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => (user ? { user: { equals: user.id } } : false),
    delete: ({ req: { user } }) => (user ? { user: { equals: user.id } } : false),
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.user = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'messages',
      type: 'json',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { readOnly: true },
    },
  ],
}
