import type { Payload } from 'payload'

type ProductionStage =
  | 'produced'
  | 'in-production'
  | 'paid-development'
  | 'movies-development'
  | 'series-development'

type CreditRole =
  | 'director'
  | 'writer'
  | 'ep'
  | 'producer'
  | 'star'
  | 'showrunner'
  | 'co-producer'
  | 'creator'
  | 'other'

type WorkSeedCredit = {
  name: string
  role: CreditRole
  imdbUrl?: string
  note?: string
  isHeadline?: boolean
}

type WorkSeedItem = {
  id: number
  title: string
  year: number
  src: string
  tags: string[]
  description?: string
  videoUrl?: string
  category?: 'film' | 'series' | 'unscripted'
  subcategory?: string
  productionStage?: ProductionStage
  credits?: WorkSeedCredit[]
  seenOnNames?: string[]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Wrap a plain-text string as a minimal Lexical editor state (single paragraph). */
function textToLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              format: 0,
              style: '',
              detail: 0,
              mode: 'normal',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

const WORKS_DATA: WorkSeedItem[] = [
  // === PRODUCED (Michael's "PROJECTS PRODUCED") ===
  { id: 46, title: 'Husband Father Killer', year: 2024, src: '/assets/posters/HusbandFatherKiller.jpeg', tags: ['Thriller'], category: 'film', productionStage: 'produced', description: 'Based on the horrific true story of Alyssa Pladl. Debuted on Lifetime on October 19, 2024.', credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }, { name: 'Kara Feifer', role: 'ep' }], seenOnNames: ['Lifetime'] },
  { id: 17, title: 'The Dating App Killer', year: 2026, src: '/assets/works/the-dating-app-killer.jpg', tags: ['Thriller'], category: 'film', productionStage: 'produced', description: 'Based on the true story of Monica White.', credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }, { name: 'Kara Feifer', role: 'ep' }], seenOnNames: ['Lifetime'] },
  { id: 25, title: 'Wife Stalker', year: 2025, src: '/assets/works/wife-stalker.png', tags: ['Thriller'], category: 'film', productionStage: 'produced', description: "Based on Lynne and Valerie Constantine's psychological thriller.", credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }, { name: 'Kara Feifer', role: 'ep' }], seenOnNames: ['Lifetime'] },
  { id: 4, title: "Sister's Daughter", year: 2026, src: '/assets/works/sisters-daughter.png', tags: ['Drama'], category: 'film', productionStage: 'produced', description: 'Blood ties, buried secrets, and the weight of what was never said.' },

  // === IN PRODUCTION (Michael's "IN PRODUCTION") ===
  { id: 30, title: 'Our Daughter Has Disappeared', year: 2026, src: '/assets/posters/SusanPowell.jpg', tags: ['True Crime'], category: 'film', productionStage: 'in-production', description: "When Susan Powell goes missing in December of 2009, the media is swept up into the story. Based on the book \"If I Can't Have You\" by Gregg Olsen and Rebecca Morris." },
  { id: 31, title: 'A Dentist to Die For', year: 2026, src: '/assets/posters/a-dentist-to-die-for.png', tags: ['True Crime'], category: 'film', productionStage: 'in-production', description: 'Dental surgeon Dr. James Ryan becomes dangerously obsessed with beauty queen Sarah Harris, manipulating her with surgical-grade narcotics.' },

  // === PAID DEVELOPMENT (Michael's "PAID DEVELOPMENT") ===
  // NOTE: Blade, Sick Puppy, Bombsquad, The Chase, Nasty Business not seeded yet — see to-refine.md #5
  { id: 23, title: 'Lie Detector', year: 2025, src: '/assets/works/lie-detector.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-series', productionStage: 'paid-development', description: 'When the FBI unveils VERA, a cutting-edge lie detector considered to be infallible, Master Interrogator Kara Voss and her team are tasked with proving it. A Mattel/Lie Detector project.', credits: [{ name: 'Ed Bernero', role: 'showrunner', note: 'creator of Criminal Minds', isHeadline: true }] },
  { id: 47, title: 'The Highlife', year: 2026, src: '/assets/works/high-life.png', tags: ['Drama'], category: 'series', productionStage: 'paid-development', description: 'A series with TF1 Studios.', credits: [{ name: 'Anne Clements', role: 'producer', note: 'Black Mafia Family', isHeadline: true }, { name: 'Lauralee Bell', role: 'producer', note: 'The Young and the Restless' }], seenOnNames: ['TF1 Studios'] },
  { id: 42, title: 'Dispatch', year: 2026, src: '/assets/posters/dispatch.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-series', productionStage: 'paid-development', description: 'When a late-night call ends in a fiery truck crash, a small-town dispatcher teams up with local police to uncover a deadly cover-up. Co-production with TF1 America.', credits: [{ name: 'Jessica Borsiczky', role: 'producer', isHeadline: true }], seenOnNames: ['TF1'] },
  { id: 49, title: 'Blade', year: 2026, src: '/assets/works/blade.png', tags: ['Drama'], productionStage: 'paid-development', description: 'Project in paid development.' },
  { id: 50, title: 'Sick Puppy', year: 2026, src: '/assets/works/sick-puppy.png', tags: ['Drama'], productionStage: 'paid-development', description: 'Project in paid development.' },
  { id: 51, title: 'Bombsquad', year: 2026, src: '/assets/works/bombsquad.png', tags: ['Drama'], productionStage: 'paid-development', description: 'Project in paid development.' },
  { id: 52, title: 'The Chase: The Josephine Wentzel Story', year: 2026, src: '/assets/works/the-chase-josephine-wentzel-story.png', tags: ['True Crime'], productionStage: 'paid-development', description: 'Project in paid development.' },
  { id: 53, title: 'Nasty Business', year: 2026, src: '/assets/works/nasty-business.png', tags: ['Drama'], productionStage: 'paid-development', description: 'Project in paid development.' },

  // === MOVIES & FEATURES — IN DEVELOPMENT (Michael's "MOVIES & FEATURES") ===
  { id: 32, title: 'Feather', year: 2026, src: '/assets/works/feather.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: "The never before told story of Farrah Fawcett's life and legacy.", credits: [{ name: 'Vernon Scott', role: 'writer', isHeadline: true }, { name: 'Latigo Films', role: 'co-producer' }] },
  { id: 54, title: '1% Better', year: 2026, src: '/assets/works/1-better.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: 'Project in active movies development.' },
  { id: 1, title: 'Margret & Stevie', year: 2026, src: '/assets/works/margret-stevie.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: "Publishers are circling, eager to rewrite Curious George's co-creator Margret Rey's legacy — but as they close in, so do the memories of the war she survived decades earlier.", credits: [{ name: 'Matthew Weiner', role: 'director', isHeadline: true }, { name: 'Shirley MacLaine', role: 'star' }] },
  { id: 33, title: 'Murder-in-Law', year: 2026, src: '/assets/posters/murder-in-law.png', tags: ['True Crime'], category: 'film', subcategory: 'true-crime-movies', productionStage: 'movies-development', description: "Law & Crime: a wealthy Miami matriarch. A bitter custody war. A hitman's bullet. What began as the cold-blooded assassination of a Florida law professor spiraled into one of the most shocking family-driven murder plots in America." },
  { id: 9, title: 'Flower Girl', year: 2025, src: '/assets/works/flower-girl.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: 'With Lockwood Media. The story of Virginia Cherrill, the leading lady of "City Lights" — about the severe consequences she suffered for refusing Chaplin\'s advances.' },
  { id: 14, title: 'Trans Electric', year: 2026, src: '/assets/posters/TransElectric2.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: "From the depths of the '70s rock 'n' roll excesses, Cidny Bullen's compelling journey about finding your authentic voice." },
  { id: 15, title: 'Rescue of Jerusalem', year: 2026, src: '/assets/works/rescue-of-jerusalem.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: 'In 701 BCE, an unlikely alliance between the kingdom of Judah and the Kushite-Egyptian empire mounts a daring resistance against the Assyrian Empire.' },
  { id: 19, title: 'If You Tell', year: 2026, src: '/assets/works/if-you-tell.png', tags: ['Thriller'], category: 'film', productionStage: 'movies-development', description: 'A shocking and empowering true-crime story of three sisters forced to make the most difficult decision of their lives: to turn their murderous mother into the police.' },
  { id: 3, title: 'Ruby Falls', year: 2026, src: '/assets/works/ruby-falls.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: 'A young actress comes to Los Angeles hoping to uncover the secrets of the father who abandoned her in a cave when she was a child.' },
  { id: 18, title: 'Murder Your Darlings', year: 2026, src: '/assets/works/murder-your-darlings.jpg', tags: ['Thriller'], category: 'film', productionStage: 'movies-development', description: 'When a novelist falls for a celebrated author, she becomes entangled in a dangerous web of obsession, stalkers, and possible murder.' },
  { id: 6, title: 'Passing Falls', year: 2026, src: '/assets/works/passing-love.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: 'When a woman accidentally discovers her mother has kept the truth of her birth a secret, she travels to Paris to search for the woman who abandoned her.' },

  // === SERIES — IN DEVELOPMENT (Michael's "SERIES") ===
  { id: 10, title: 'By Midnight', year: 2025, src: '/assets/works/by-midnight.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', description: 'After moving to an elite London school, a teenage girl uncovers a string of murders tied to a secret vampire society.', credits: [{ name: 'Kat Rose Martin', role: 'writer', isHeadline: true }] },
  { id: 55, title: 'Double Dealer', year: 2026, src: '/assets/works/double-dealer.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', description: 'Project in active series development.' },
  { id: 35, title: 'Undefeated', year: 2026, src: '/assets/posters/Undefeated.jpg', tags: ['Drama'], category: 'series', productionStage: 'series-development', description: "Inside the Miami Dolphins' 1972 comeback from three straight championship losses to an undefeated season. Based on Mike Freeman's book." },
  { id: 48, title: 'Icky', year: 2026, src: '/assets/works/icky.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', description: 'A darkly funny, character-driven drama series about a young woman whose relentless need to please everyone — except herself — finally catches up with her.', credits: [{ name: 'Ken Girotti', role: 'director', isHeadline: true }, { name: 'Wendy Coulas', role: 'producer' }] },
  { id: 8, title: 'Diamonds and Deadlines', year: 2026, src: '/assets/works/diamonds-and-deadlines.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', description: 'The true story of Miriam Leslie, who made her way to the top of the publishing world and left her multi-million-dollar estate to the suffragists.' },
  { id: 7, title: "Two's Company", year: 2025, src: '/assets/works/twos-company.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', description: 'From a shattered childhood to the heights of fame and reinvention, Suzanne Somers fights to own her voice and her legacy.' },
  { id: 16, title: 'Matador', year: 2025, src: '/assets/works/matador.png', tags: ['Drama'], productionStage: 'series-development', description: 'A streetwise Brooklyn kid flees to Mexico City and trains under a legendary matador to become the first American bullfighter.' },
  { id: 5, title: "The Lobotomist's Wife", year: 2026, src: '/assets/works/lobotomist-wife.png', tags: ['Drama'], category: 'series', subcategory: 'true-crime-series', productionStage: 'series-development', description: 'A devoted mental health advocate falls for a brilliant but radical lobotomy pioneer, only to discover his "miracle cure" is leading to horrific results.' },

  // === LEGACY — Not in Michael's reorganized list, kept for now (no productionStage). See to-refine.md ===
  { id: 2, title: 'Out for Love', year: 2026, src: '/assets/works/out-for-love.png', tags: ['Unscripted'], category: 'unscripted', description: 'What happens when desire refuses to follow the rules.' },
  { id: 11, title: 'Weekend Guests', year: 2025, src: '/assets/works/weekend-guests.png', tags: ['Unscripted'], category: 'unscripted', description: 'Five old college friends reunite at a secluded Dorset cliffside mansion for a weekend that turns deadly.' },
  { id: 12, title: 'A Love Like the Sun', year: 2026, src: '/assets/works/a-love-like-the-sun.png', tags: ['Unscripted'], category: 'unscripted', description: 'When a guarded haircare entrepreneur and her longtime best friend fake a relationship to save her struggling business, their lifelong bond is tested.' },
  { id: 13, title: 'Sunshine Sisters', year: 2025, src: '/assets/works/sunshine-sisters.png', tags: ['Unscripted'], category: 'unscripted', description: 'The story of Ronni Sunshine, an aging film star who receives a devastating medical diagnosis and brings her three daughters back together.' },
  { id: 20, title: 'If Anything Happens to Me', year: 2026, src: '/assets/works/if-anything-happens-to-me.png', tags: ['Unscripted'], category: 'unscripted', description: 'A letter left behind. A trail that leads inward.' },
  { id: 21, title: 'Sleeping Angel', year: 2025, src: '/assets/works/sleeping-angel.png', tags: ['Unscripted'], category: 'unscripted', description: 'Not every angel is watching over you.' },
  { id: 22, title: 'In Not So Loving Memory', year: 2025, src: '/assets/works/in-not-so-loving-memory.png', tags: ['Unscripted'], category: 'unscripted', description: "The dead don't always stay quiet." },
  { id: 24, title: 'Play Dead', year: 2025, src: '/assets/works/play-dead.png', tags: ['Unscripted'], category: 'unscripted', description: 'A paranormal thriller set in Savannah, Georgia, where the supernatural and homicide meet when a series of bizarre murders connected to root magic terrorize the city.' },
  { id: 26, title: 'Darkness Falls', year: 2025, src: '/assets/works/darkness-falls.png', tags: ['Unscripted'], category: 'unscripted', description: 'When the lights go out, the real story begins.' },
  { id: 27, title: 'Booth P.I.', year: 2025, src: '/assets/works/booth-pi.png', tags: ['Unscripted'], category: 'unscripted', description: 'A recovering Southern belle and struggling New York actress returns home to save her family plantation and accidentally becomes a small-town sleuth.' },
  { id: 29, title: 'Iron Man', year: 2025, src: '/assets/works/iron-man.png', tags: ['Unscripted'], category: 'unscripted', description: 'The true story of the first ever Ironman champion with Down Syndrome and the father who would do anything to give his special-needs son a chance.' },
  { id: 28, title: 'Silent Echo', year: 2025, src: '/assets/works/silent-echo.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-feature', description: "A year after the death of her four-year-old son, Charlotte Fleming sees something that jolts her awake: Sebastion, alive and well in a stranger's social media post." },
  { id: 34, title: "Girls Can't Play Pool", year: 2026, src: '/assets/posters/GirlsCantPlayPool.jpg', tags: ['Drama'], category: 'film', subcategory: 'dramas-feature', description: 'Heather is a gifted young pool hustler who lives on the edge of chaos. When two women decide to go on the road together, their lucrative partnership leads to a deep bond.', credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }] },
  { id: 36, title: 'Korean Espionage', year: 2026, src: '/assets/posters/KoreanEspionage.png', tags: ['Thriller'], category: 'series', subcategory: 'true-crime-series', description: 'When Korean Air Flight 858 is exploded by a North Korean agent, a former US soldier learns about his Japanese wife\'s darkest secret: she mentored the attacker.' },
  { id: 45, title: "Girls Can't Play Pool", year: 2026, src: '/assets/posters/GirlsCantPlayPool.jpg', tags: ['Drama'], category: 'series', subcategory: 'dramas-feature', description: 'Heather is a gifted young pool hustler who lives on the edge of chaos. When two women decide to go on the road together, their lucrative partnership leads to a deep bond.', credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }] },
  { id: 37, title: 'Relentless', year: 2026, src: '/assets/posters/relentless.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-feature', description: '"Fatal Attraction" meets "Cape Fear." A sexy, propulsive thriller where one mistake in Mexico spirals out of control.' },
  { id: 38, title: 'Call Me Madam', year: 2026, src: '/assets/posters/CallMeMadam.png', tags: ['Drama'], category: 'series', subcategory: 'dramas-series', description: "In 1961 Hot Springs, Arkansas, a savvy madam attempts to pass her high-end brothel to her Black protégé, challenging the town's racial barriers and mob control." },
  { id: 39, title: 'Swap', year: 2026, src: '/assets/posters/swap.png', tags: ['Drama'], category: 'series', subcategory: 'dramas-series', description: 'A show about contemporary marriage — love, sex, commitment, and what happens when three couples who aren\'t quite friends get a little drunk and swap.' },
  { id: 40, title: 'The Reid Brothers', year: 2026, src: '/assets/posters/LastDay_ReidBrothers.webp', tags: ['Thriller'], category: 'series', subcategory: 'dramas-series', description: 'State Police detective Conor Reid and Coast Guard Commander Tom Reid team up to track down a murderer in the seductive and wealthy enclave of the Hamptons.' },
  { id: 41, title: 'Southern Gothic', year: 2026, src: '/assets/posters/SouthernGothic.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-series', description: 'When Atlanta detective Laine Badder returns to her Appalachian hometown to bury her mother, unsettling details make her suspect it wasn\'t natural causes.' },
  { id: 43, title: 'Horseplay', year: 2026, src: '/assets/posters/horseplay.png', tags: ['Unscripted'], category: 'unscripted', subcategory: 'comedy-features', description: 'When a young hobby horse competitor is assaulted, a college athlete goes undercover to solve the mystery in the unique world of competitive hobby horsing.' },
  { id: 44, title: 'Nookietown', year: 2026, src: '/assets/posters/Nookietown.jpg', tags: ['Unscripted'], category: 'unscripted', subcategory: 'comedy-features', description: "When an exhausted housewife asks her divorced best friend to sleep with her husband, what starts as a joke becomes an opportunity. Based on V.C. Chickering's novel." },
]

export async function seedWorks(payload: Payload, mediaMap: Map<string, number>, platformMap?: Map<string, number>): Promise<void> {
  console.log('[seed-works] Seeding works...')

  for (let i = 0; i < WORKS_DATA.length; i++) {
    const item = WORKS_DATA[i]!
    const slug =
      item.title === "Girls Can't Play Pool" && item.id === 45
        ? `${generateSlug(item.title)}-series`
        : generateSlug(item.title)
    const posterId = mediaMap.get(item.src)

    const existing = await payload.find({
      collection: 'works',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const seenOn = item.seenOnNames && platformMap
      ? item.seenOnNames.map(name => platformMap.get(name)).filter((id): id is number => id !== undefined)
      : undefined

    const data = {
      title: item.title,
      slug,
      year: item.year,
      tags: item.tags,
      description: item.description ? textToLexical(item.description) : undefined,
      videoUrl: item.videoUrl || '',
      category: item.category || undefined,
      credits: item.credits || undefined,
      productionStage: item.productionStage || undefined,
      subcategory: item.subcategory || '',
      sortOrder: i,
      ...(posterId ? { poster: posterId } : {}),
      ...(seenOn?.length ? { seenOn } : {}),
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'works',
        id: existing.docs[0]!.id,
        data: data as never,
      })
      console.log(`[seed-works] Updated: ${item.title}`)
    } else {
      await payload.create({
        collection: 'works',
        data: data as never,
      })
      console.log(`[seed-works] Created: ${item.title}`)
    }
  }

  console.log(`[seed-works] Done. ${WORKS_DATA.length} works seeded.`)
}
