import type { Payload } from 'payload'

export async function seedNavigation(payload: Payload): Promise<void> {
  console.log('[seed-navigation] Seeding navigation...')

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: {
        items: [
          { label: 'About Us', href: '/about', isExternal: false },
          { label: 'Our Work', href: '/our-work', isExternal: false },
          { label: 'Development', href: '/development', isExternal: false },
          { label: 'Press', href: '/press', isExternal: false },
          { label: 'Contact', href: '/contact', isExternal: false },
        ],
      },
      footer: {
        legalLabel: 'Legal notice',
        copyrightText: '© 2026 RFE. All rights reserved.',
      },
    },
  })

  console.log('[seed-navigation] Done.')
}
