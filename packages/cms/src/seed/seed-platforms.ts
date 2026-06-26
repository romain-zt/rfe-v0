import type { Payload } from 'payload'

const PLATFORMS_DATA = [
  { name: 'Lifetime' },
  { name: 'TF1' },
  { name: 'TF1 Studios' },
  { name: 'CNews' },
  { name: 'Netflix' },
  { name: 'Paramount+' },
  { name: 'ABC' },
  { name: 'CBS' },
]

export async function seedPlatforms(payload: Payload): Promise<Map<string, number>> {
  console.log('[seed-platforms] Seeding platforms...')
  const platformMap = new Map<string, number>()

  for (const item of PLATFORMS_DATA) {
    const existing = await payload.find({
      collection: 'platforms',
      where: { name: { equals: item.name } },
      limit: 1,
    })

    let id: number
    if (existing.docs.length > 0) {
      id = existing.docs[0]!.id as number
      console.log(`[seed-platforms] Exists: ${item.name} (${id})`)
    } else {
      const created = await payload.create({
        collection: 'platforms',
        data: item as never,
      })
      id = created.id as number
      console.log(`[seed-platforms] Created: ${item.name} (${id})`)
    }

    platformMap.set(item.name, id)
  }

  console.log(`[seed-platforms] Done. ${PLATFORMS_DATA.length} platforms seeded.`)
  return platformMap
}
