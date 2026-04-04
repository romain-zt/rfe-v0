import type { Block } from 'payload'

export const ContactForm: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: { singular: 'Contact Form', plural: 'Contact Forms' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'recipientEmail',
      type: 'email',
      admin: {
        description: 'Email address for mailto form. Defaults to site contact email if empty.',
      },
    },
    {
      name: 'nameLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Name',
    },
    {
      name: 'emailLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Email',
    },
    {
      name: 'messageLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Message',
    },
    {
      name: 'submitLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Send',
    },
  ],
}
