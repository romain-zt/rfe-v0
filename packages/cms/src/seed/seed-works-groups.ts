import type { Payload } from 'payload'

type GroupDef = {
  name: string
  slug: string
  filter: (w: { category?: string | null }) => boolean
  limit?: number
}

const GROUPS: GroupDef[] = [
  {
    name: 'Our Work',
    slug: 'our-work',
    filter: (w) => !w.category,
  },
  {
    name: 'Development',
    slug: 'development',
    filter: (w) => !!w.category,
  },
  {
    name: 'Home Featured',
    slug: 'home-featured',
    filter: (w) => !w.category,
    limit: 10,
  },
]

export async function seedWorksGroups(payload: Payload): Promise<void> {
  console.log('[seed-works-groups] Seeding works groups...')

  const allWorks = await payload.find({
    collection: 'works',
    limit: 200,
    sort: 'sortOrder',
  })

  for (const group of GROUPS) {
    let matchingIds = allWorks.docs.filter(group.filter).map((w) => w.id)
    if (group.limit) {
      matchingIds = matchingIds.slice(0, group.limit)
    }

    const existing = await payload.find({
      collection: 'works-groups',
      where: { slug: { equals: group.slug } },
      limit: 1,
    })

    const data = {
      name: group.name,
      slug: group.slug,
      items: matchingIds,
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'works-groups',
        id: existing.docs[0]!.id,
        data,
      })
      console.log(`[seed-works-groups] Updated: ${group.name} (${matchingIds.length} items)`)
    } else {
      await payload.create({
        collection: 'works-groups',
        data,
      })
      console.log(`[seed-works-groups] Created: ${group.name} (${matchingIds.length} items)`)
    }
  }

  console.log(`[seed-works-groups] Done. ${GROUPS.length} groups seeded.`)
}
