/**
 * Targeted update — Michael's description & credit changes (Jun 26 2026)
 *
 * Safe to run against the production database:
 *  - Only touches the 10 specified works (by slug)
 *  - Idempotent: re-running produces the same result
 *  - Does NOT reset posters, sortOrder, or any other field
 *  - Platforms (seenOn) are found-or-created before linking
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

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

type UpdateCredit = {
  name: string
  role: CreditRole
  imdbUrl?: string
  note?: string
  isHeadline?: boolean
}

type WorkUpdate = {
  slug: string
  title?: string
  description: string[]
  credits?: UpdateCredit[]
  productionStage?: string
  category?: string
  seenOnNames?: string[]
}

/** Build a Lexical editor state from an array of paragraph strings. */
function paragraphsToLexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: text.trim()
          ? [
              {
                type: 'text',
                format: 0,
                style: '',
                detail: 0,
                mode: 'normal',
                text: text.trim(),
                version: 1,
              },
            ]
          : [],
      })),
    },
  }
}

/**
 * Find a platform by exact name. Returns the ID or null if not found.
 * Never creates new platforms — must exist in the database already.
 */
async function findPlatform(payload: Awaited<ReturnType<typeof import('payload')['getPayload']>>, name: string): Promise<number | null> {
  const existing = await payload.find({
    collection: 'platforms',
    where: { name: { equals: name } },
    limit: 1,
  })
  if (existing.docs.length > 0) return existing.docs[0]!.id as number
  console.warn(`[update] Platform not found (skipping): "${name}"`)
  return null
}

const UPDATES: WorkUpdate[] = [
  // ─── MOVIES IN DEVELOPMENT ───────────────────────────────────────────────

  {
    slug: 'margret-stevie',
    description: [
      "Publishers are circling, eager to rewrite Curious George's co-creator Margret Rey's legacy—but as they close in, so do the memories of the war she survived decades earlier. In her chain-smoking, foul mouthed dog walker Stevie, Margret finds an unlikely friend—and a spark of renewed hope to fight back.",
      'Matthew Weiner, creator of Mad Men, set to direct. Stephenie Gillis to pen the script. Shirley MacLaine attached to star.',
    ],
    credits: [
      { name: 'Matthew Weiner', role: 'director', note: 'creator of Mad Men', isHeadline: true },
      { name: 'Stephenie Gillis', role: 'writer' },
      { name: 'Shirley MacLaine', role: 'star' },
    ],
  },

  {
    slug: 'feather',
    description: [
      "This never before told story takes you into the dynamic drama of Farrah Fawcett's life and legacy.",
      'Written by Vernon Scott and co-produced by Latigo Films.',
    ],
    credits: [
      { name: 'Vernon Scott', role: 'writer', isHeadline: true },
      { name: 'Latigo Films', role: 'co-producer' },
    ],
  },

  {
    slug: 'iron-man',
    description: [
      'AN IRON MAN is the true story of the first ever Ironman champion with Down Syndrome and the father who would do anything to give his special-needs son a chance to achieve his dreams against all odds.',
      "Based on Chris and Nik Nikic's memoir. Bobby Hanaford to pen the script. Josh Bachove, producer of Minari, attached to co-produce.",
    ],
    credits: [
      { name: 'Bobby Hanaford', role: 'writer', isHeadline: true },
      { name: 'Josh Bachove', role: 'co-producer', note: 'producer of Minari' },
    ],
    productionStage: 'movies-development',
    category: 'film',
  },

  // ─── SERIES IN DEVELOPMENT ───────────────────────────────────────────────

  {
    slug: 'diamonds-and-deadlines',
    description: [
      'This is the true story of Miriam Leslie. The product of her father and one of his slaves. A true renaissance woman, Miriam made her way to the top of the publishing world, a male-dominated industry, becoming one of the wealthiest women in the United States in the late 1800s.',
      'Upon her death she left her multi-million-dollar estate (roughly 50 million dollars today) to the suffragists — a contribution that would ensure the passage of the Nineteenth Amendment.',
      'Nicole Ari Parker attached to star, Susan Fales-Hill attached to showrun.',
    ],
    credits: [
      { name: 'Nicole Ari Parker', role: 'star', isHeadline: true },
      { name: 'Susan Fales-Hill', role: 'showrunner' },
    ],
  },

  {
    slug: 'icky',
    description: [
      'I Could Kill You ("ICKY") is a dark comedy about a suburban mom, Helena Lepinski, who navigates a police investigation, invasive siblings, and her own escalating paranoia as she tries to determine whether she was justified in killing her abusive, narcissistic father — or if she\'s a psychopath like him. ICKY poses the question: are all parents worthy of love and compassion?',
    ],
    credits: [
      { name: 'Ken Girotti', role: 'writer', isHeadline: true },
      { name: 'Wendy Coulas', role: 'writer' },
    ],
  },

  // ─── PAID DEVELOPMENT ────────────────────────────────────────────────────

  {
    slug: 'nasty-business',
    description: [
      'A documentary that depicts the horrifying true story currently making its way through the Canadian legal system.',
      "NASTY BUSINESS tells the story of how Robert G. Miller, a reclusive Montréal billionaire, allegedly paid more than 50 young girls for sexual favors from 1996 to 2006. Canada's answer to Jeffery Epstein.",
    ],
    // "Lionsgate Television" does not exist in production — only Disney + is linked
    seenOnNames: ['Disney +'],
  },

  {
    slug: 'the-chase-josephine-wentzel-story',
    description: [
      "THE CHASE follows one mother's attempt to hunt down her daughter's killer, no matter the cost. When her daughter's murder case starts to cool, Josephine takes it into her own hands partnering with the US Marshalls and the FBI to track down her daughter Krystal's killer. She ultimately succeeds in extraditing him from El Salvador to the United States.",
      'Happening in real time, Josephine awaits the trial.',
      "Based on Josephine Wentzel's harrowing memoir of the same name, Jessica Mecklenberg attached to write.",
    ],
    credits: [{ name: 'Jessica Mecklenberg', role: 'writer', isHeadline: true }],
    seenOnNames: ['FOX', 'A&E Global Media'],
  },

  {
    slug: 'the-highlife',
    description: [
      "At the world's most exclusive ski resorts, Whistler, the elite descend for indulgence and excess, leaving local ski instructors and staff to clean up the mess – both on and off the slopes. But as tensions build between wealth and those who serve it, not everyone will make it to the season's final run.",
      'Created by Lauralee Bell, TF1 to co-produce, Ken Girotti and Wendy Coulas set to showrun.',
    ],
    credits: [
      { name: 'Lauralee Bell', role: 'creator', isHeadline: true },
      { name: 'Ken Girotti', role: 'showrunner' },
      { name: 'Wendy Coulas', role: 'showrunner' },
    ],
    seenOnNames: ['Studio TF1 America', 'A&E Global Media'],
  },

  {
    slug: 'blade',
    title: 'The Palace',
    description: [
      "When a hardened New York defense attorney returns to her former elite skating academy to defend a teenage prodigy accused of murder, she's forced to confront the abusive system and buried crimes that shaped her past before it destroys another girl.",
      'Ben York Jones set to showrun, based on the novel Blade by Wendy Walker.',
    ],
    credits: [{ name: 'Ben York Jones', role: 'showrunner', isHeadline: true }],
    seenOnNames: ['A&E Global Media'],
  },

  {
    slug: 'sick-puppy',
    description: [
      'A brilliant but sociopathic psychologist joins an FBI task force to track and dismantle criminalized brainwashing systems, using her unsettling insights to outwit fellow manipulators as she grapples with her own strange and devious impulses.',
      'Ben York Jones is set as showrunner.',
    ],
    credits: [{ name: 'Ben York Jones', role: 'showrunner', isHeadline: true }],
  },
]

async function run() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@/payload.config')
  const payload = await getPayload({ config })

  let updated = 0
  let notFound = 0

  for (const update of UPDATES) {
    const result = await payload.find({
      collection: 'works',
      where: { slug: { equals: update.slug } },
      limit: 1,
    })

    if (result.docs.length === 0) {
      console.warn(`[update] NOT FOUND: slug="${update.slug}" — skipping`)
      notFound++
      continue
    }

    const work = result.docs[0]!
    const patchData: Record<string, unknown> = {
      description: paragraphsToLexical(update.description),
    }

    if (update.title) patchData.title = update.title
    if (update.credits) patchData.credits = update.credits
    if (update.productionStage) patchData.productionStage = update.productionStage
    if (update.category) patchData.category = update.category

    if (update.seenOnNames && update.seenOnNames.length > 0) {
      const platformIds: number[] = []
      for (const name of update.seenOnNames) {
        const id = await findPlatform(payload, name)
        if (id !== null) platformIds.push(id)
      }
      patchData.seenOn = platformIds
    }

    await payload.update({
      collection: 'works',
      id: work.id,
      data: patchData as never,
    })

    const label = update.title ? `${update.title} (was: ${work.title})` : work.title
    console.log(`[update] ✓ ${label}`)
    updated++
  }

  console.log(`\nDone — ${updated} updated, ${notFound} not found.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('[update] Failed:', err)
  process.exit(1)
})
