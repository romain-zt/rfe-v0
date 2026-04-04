import type { Payload } from 'payload'

const PRESS_DATA = [
  {
    title: "Shirley MacLaine To Star In Matthew Weiner's 'Margret and Stevie'",
    source: 'Deadline',
    date: '2026-02-01',
    url: 'https://deadline.com/2026/02/shirley-maclaine-margret-and-stevie-matthew-weiner-1236729698/',
    description: 'Shirley MacLaine has been set to star in Margret and Stevie, directed by Matthew Weiner. The film follows two women whose sharp-edged friendship becomes a lifeline, reigniting resolve in each other.',
  },
]

export async function seedPress(payload: Payload): Promise<void> {
  console.log('[seed-press] Seeding press items...')

  for (let i = 0; i < PRESS_DATA.length; i++) {
    const item = PRESS_DATA[i]!

    const existing = await payload.find({
      collection: 'press-items',
      where: { url: { equals: item.url } },
      limit: 1,
    })

    const data = {
      title: item.title,
      source: item.source,
      date: item.date,
      url: item.url,
      description: item.description,
      sortOrder: i,
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'press-items',
        id: existing.docs[0]!.id,
        data,
      })
    } else {
      await payload.create({
        collection: 'press-items',
        data,
      })
    }
  }

  console.log('[seed-press] Done.')
}
