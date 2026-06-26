import type { Payload } from 'payload'

type PlatformDef = {
  name: string
  logoPath?: string
}

const PLATFORMS_DATA: PlatformDef[] = [
  { name: 'Lifetime', logoPath: '/assets/logos/channels/lifetime.png' },
  { name: 'Studio TF1 America', logoPath: '/assets/logos/channels/tf1-america.png' },
  { name: 'A&E Global Media', logoPath: '/assets/logos/channels/ae-global-media.png' },
  { name: 'FOX', logoPath: '/assets/logos/channels/fox.png' },
  { name: 'Disney +', logoPath: '/assets/logos/channels/disney-plus.png' },
  { name: 'Law & Crime Network', logoPath: '/assets/logos/channels/law-and-crime.png' },
  { name: 'Mattel', logoPath: '/assets/logos/channels/mattel.png' },
  { name: 'NBC', logoPath: '/assets/logos/channels/nbc.png' },
  { name: 'CNews' },
  { name: 'Netflix' },
  { name: 'Paramount+' },
  { name: 'ABC' },
  { name: 'CBS' },
]

export async function seedPlatforms(
  payload: Payload,
  mediaMap?: Map<string, number>,
): Promise<Map<string, number>> {
  console.log('[seed-platforms] Seeding platforms...')
  const platformMap = new Map<string, number>()

  for (const item of PLATFORMS_DATA) {
    const logoId = item.logoPath && mediaMap ? mediaMap.get(item.logoPath) : undefined

    const existing = await payload.find({
      collection: 'platforms',
      where: { name: { equals: item.name } },
      limit: 1,
    })

    const data: Record<string, unknown> = { name: item.name }
    if (logoId) data.logo = logoId

    let id: number
    if (existing.docs.length > 0) {
      id = existing.docs[0]!.id as number
      await payload.update({
        collection: 'platforms',
        id,
        data: data as never,
      })
      console.log(`[seed-platforms] Updated: ${item.name} (${id})${logoId ? ' +logo' : ''}`)
    } else {
      const created = await payload.create({
        collection: 'platforms',
        data: data as never,
      })
      id = created.id as number
      console.log(`[seed-platforms] Created: ${item.name} (${id})${logoId ? ' +logo' : ''}`)
    }

    platformMap.set(item.name, id)
  }

  console.log(`[seed-platforms] Done. ${PLATFORMS_DATA.length} platforms seeded.`)
  return platformMap
}
