import type { Payload } from 'payload'

type WorkLike = {
  category?: string | null
  productionStage?: string | null
  slug?: string | null
}

type GroupDef = {
  name: string
  slug: string
  filter?: (w: WorkLike) => boolean
  slugs?: string[]
  limit?: number
}

const GROUPS: GroupDef[] = [
  {
    name: 'Our Work',
    slug: 'our-work',
    filter: (w) => w.productionStage === 'produced',
  },
  {
    name: 'Development',
    slug: 'development',
    filter: (w) => !!w.productionStage && w.productionStage !== 'produced',
  },
  {
    name: 'Home Featured',
    slug: 'home-featured',
    filter: (w) => w.productionStage === 'produced',
    limit: 10,
  },
  {
    name: 'Produced',
    slug: 'produced',
    filter: (w) => w.productionStage === 'produced',
  },
  {
    name: 'In Production',
    slug: 'in-production',
    filter: (w) => w.productionStage === 'in-production',
  },
  {
    name: 'Paid Development',
    slug: 'paid-development',
    filter: (w) => w.productionStage === 'paid-development',
  },
  {
    name: 'In Development — Movies',
    slug: 'movies-development',
    filter: (w) => w.productionStage === 'movies-development',
  },
  {
    name: 'In Development — Series',
    slug: 'series-development',
    filter: (w) => w.productionStage === 'series-development',
  },

  // Home page curated strips (matching production)
  {
    name: 'Produced (Home page selection)',
    slug: 'home-produced',
    slugs: [
      'sick-puppy', 'the-chase-the-josephine-wentzel-story',
      'a-dentist-to-die-for', 'husband-father-killer', 'wife-stalker',
      'the-dating-app-killer', 'dont-trust-the-girls-upstairs', 'our-daughter-has-disappeared',
    ],
  },
  {
    name: 'Serials (Home page selection)',
    slug: 'home-serials',
    slugs: [
      'lie-detector', 'dispatch', 'bombsquad', 'blade',
      'sunshine-sisters', 'double-dealer', 'the-highlife',
    ],
  },
  {
    name: 'Films (Home Page selection)',
    slug: 'home-films',
    slugs: [
      'marrying-a-murderer', 'margret-stevie', 'feather', '1-better',
      'rescue-of-jerusalem', 'if-you-tell', 'passing-love', 'horseplay',
    ],
  },
  {
    name: 'Unscripted (Home page selection)',
    slug: 'home-unscripted',
    slugs: [
      'twos-company', 'justice-for-tupac', 'transelectric',
      'butch-cassidys-millions', 'out-for-love', 'nasty-business',
    ],
  },
]

export async function seedWorksGroups(payload: Payload): Promise<void> {
  console.log('[seed-works-groups] Seeding works groups...')

  const allWorks = await payload.find({
    collection: 'works',
    limit: 200,
    sort: 'sortOrder',
  })

  const slugToId = new Map<string, number>()
  for (const w of allWorks.docs) {
    if (w.slug) slugToId.set(w.slug as string, w.id as number)
  }

  for (const group of GROUPS) {
    let matchingIds: number[]

    if (group.slugs) {
      matchingIds = group.slugs
        .map((s) => slugToId.get(s))
        .filter((id): id is number => id !== undefined)
    } else if (group.filter) {
      matchingIds = allWorks.docs
        .filter((w) => group.filter!(w as unknown as WorkLike))
        .map((w) => w.id as number)
    } else {
      matchingIds = []
    }

    if (group.limit) {
      matchingIds = matchingIds.slice(0, group.limit)
    }

    if (matchingIds.length === 0) {
      console.log(`[seed-works-groups] Skipped (no matching works): ${group.name}`)
      continue
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
