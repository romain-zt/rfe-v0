import type { Payload } from 'payload'

const PRESS_DATA = [
  {
    title: "Elisabeth Röhm on Twisty New Lifetime Movie & 'Iconic' 'Law & Order' Exit",
    source: 'TV Insider',
    date: '2026-06-01',
    url: 'https://www.tvinsider.com/1270680/elisabeth-rohm-on-twisty-new-lifetime-movie-iconic-law-order-exit/',
    description:
      'Elisabeth Röhm discusses her twisty new Lifetime movie and reflects on her iconic Law & Order exit.',
  },
  {
    title: "Shirley MacLaine To Star In Matthew Weiner's 'Margret and Stevie'",
    source: 'Deadline',
    date: '2026-02-01',
    url: 'https://deadline.com/2026/02/shirley-maclaine-margret-and-stevie-matthew-weiner-1236729698/',
    description:
      'Shirley MacLaine has been set to star in Margret and Stevie, directed by Matthew Weiner. The film follows two women whose sharp-edged friendship becomes a lifeline, reigniting resolve in each other.',
  },
  {
    title: 'Lifetime Sets New Movie Slate Featuring Tami Roman, Abigail Breslin',
    source: 'Deadline',
    date: '2026-01-30',
    url: 'https://deadline.com/2026/01/lifetime-movie-slate-tami-roman-abigail-breslin-1236703969/',
    description:
      'Lifetime announces seven new thrillers including The Dating App Killer directed by Elisabeth Rohm, premiering Valentine\'s Day 2026.',
  },
  {
    title: "Rohm Feifer Entertainment To Produce Adaptation Of Jenna Blum's Thriller 'Murder Your Darlings'",
    source: 'Deadline',
    date: '2026-01-20',
    url: 'https://deadline.com/2026/01/murder-your-darlings-adaptation-rohm-feifer-entertainment-1236685535/',
    description:
      'Rohm Feifer Entertainment to produce a film adaptation of Jenna Blum\'s suspense novel Murder Your Darlings, with screenplay by Barbara Nance.',
  },
  {
    title: 'Lifetime Sets Keshia Knight Pulliam, D.B. Woodside & Claire Qute To Lead New Movies',
    source: 'Deadline',
    date: '2025-02-20',
    url: 'https://deadline.com/2025/02/lifetime-keshia-knight-pulliam-d-b-woodside-movies-first-look-photos-1236295406/',
    description:
      'Lifetime announces Wife Stalker starring Keshia Knight Pulliam, directed and executive produced by Elisabeth Rohm and produced by Rohm Feifer Entertainment.',
  },
  {
    title: 'Catching Up With Director, Executive Producer, and Actress Elisabeth Rohm',
    source: 'NBC Los Angeles',
    date: '2024-02-01',
    url: 'https://www.nbclosangeles.com/video/california-live/catching-up-with-director-executive-producer-and-actress-elisabeth-rohm/3665271/',
    description:
      'California Live sits down with Elisabeth Rohm to discuss her work as a director, executive producer, and actress.',
  },
  {
    title: 'Elisabeth Rohm & Kara Feifer Launch Rohm Feifer Entertainment',
    source: 'Deadline',
    date: '2023-11-30',
    url: 'https://deadline.com/2023/11/rohm-feifer-entertainment-elisabeth-rohm-kara-feifer-1235646344/',
    description:
      'Elisabeth Rohm and Kara Feifer partner to launch Rohm Feifer Entertainment, a production company focused on female-forward, true crime and true narrative storytelling.',
  },
  {
    title: "Elisabeth Rohm Wanted to 'Get Deeper' Into the Sarah Lawrence Cult Story as a Mother and Alum",
    source: 'People',
    date: '2023-01-30',
    url: 'https://people.com/elisabeth-roehm-wanted-to-get-deeper-into-sarah-lawrence-cult-story-as-mother-and-alum-exclusive-8667708',
    description:
      'Elisabeth Rohm discusses hosting the Devil in the Dorm podcast about the Sarah Lawrence sex cult, drawing on her personal connection as a mother and fellow alum.',
  },
  {
    title: 'Former Law & Order Star Elisabeth Röhm Returns as Director',
    source: 'The Wrap',
    date: '2022-10-10',
    url: 'https://www.thewrap.com/law-order-star-elisabeth-rohm-returns-to-direct/',
    description:
      "Elisabeth Rohm returns to Law & Order after 17 years to direct a Season 22 episode through NBC's Female Forward program.",
  },
  {
    title: "Anne Heche Was a 'Hero' for Victims of Violence, Says Girl in Room 13 Director Elisabeth Röhm",
    source: 'People',
    date: '2022-09-17',
    url: 'https://people.com/tv/anne-heche-remembered-by-girl-in-room-13-director-elisabeth-rohm/',
    description:
      'Director Elisabeth Rohm remembers Anne Heche and her final performance in the Lifetime film Girl in Room 13 about human trafficking.',
  },
  {
    title: 'Elisabeth Röhm on Her Harrowing New Lifetime Movie Girl in Room 13',
    source: 'The List',
    date: '2022-09-17',
    url: 'https://www.thelist.com/979756/elisabeth-rohm-on-her-harrowing-new-lifetime-movie-girl-in-room-13-exclusive-interview/',
    description:
      'Elisabeth Rohm discusses directing Girl in Room 13 for Lifetime, her transition from acting to directing, and the importance of telling stories about human trafficking.',
  },
  {
    title: "Going Into the Minds of Serial Killers With 'Killer's Vault' Podcast",
    source: 'ET Online',
    date: '2021-06-29',
    url: 'https://www.etonline.com/going-into-the-minds-of-serial-killers-with-killers-vault-podcast-168066',
    description:
      "Elisabeth Rohm discusses hosting the true-crime podcast Killer's Vault, which explores the minds of notorious serial killers through personal letters and recordings.",
  },
  {
    title: 'Couple Seduced Serial Killers Ramirez, Dahmer, Gacy by Mail',
    source: 'NY Post',
    date: '2021-06-05',
    url: 'https://nypost.com/2021/06/05/couple-seduced-serial-killers-ramirez-dahmer-gacy-by-mail/',
    description:
      "A married couple corresponded with over 100 serial killers for decades, building an archive featured in Elisabeth Rohm's Killer's Vault podcast.",
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
