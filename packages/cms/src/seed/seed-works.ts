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
  title: string
  slug: string
  year: number
  src: string
  tags: string[]
  description: string[]
  videoUrl?: string
  category?: 'film' | 'series' | 'unscripted'
  subcategory?: string
  productionStage?: ProductionStage
  credits?: WorkSeedCredit[]
  seenOnNames?: string[]
}

function generateWorkSeo(item: WorkSeedItem): { title: string; description: string; keywords: string } {
  const categoryLabel = item.category === 'series' ? 'Series' : item.category === 'unscripted' ? 'Unscripted' : 'Film'
  const tagLabel = item.tags[0] || categoryLabel
  const title = `${item.title} (${item.year}) — ${tagLabel} | RFE`

  const firstParagraph = item.description[0] || `${item.title} — a production by RFE.`
  let description: string
  if (firstParagraph.length <= 160) {
    description = firstParagraph
  } else {
    const truncated = firstParagraph.slice(0, 157)
    const lastSpace = truncated.lastIndexOf(' ')
    description = truncated.slice(0, lastSpace) + '...'
  }

  const creditNames = (item.credits || []).slice(0, 3).map(c => c.name)
  const seenOnLabels = (item.seenOnNames || []).slice(0, 2)
  const parts: string[] = [
    item.title,
    ...item.tags,
    categoryLabel.toLowerCase(),
    String(item.year),
    ...creditNames,
    ...seenOnLabels,
    'RFE',
    'film production',
    'female-led production',
  ].filter(Boolean)
  const keywords = [...new Set(parts)].join(', ')

  return { title, description, keywords }
}

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
          ? [{ type: 'text', format: 0, style: '', detail: 0, mode: 'normal', text: text.trim(), version: 1 }]
          : [],
      })),
    },
  }
}

const WORKS_DATA: WorkSeedItem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCED
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Husband Father Killer', slug: 'husband-father-killer', year: 2024,
    src: '/assets/posters/HusbandFatherKiller.jpeg', tags: ['Thriller'], category: 'film', productionStage: 'produced',
    seenOnNames: ['Lifetime'],
    description: [
      'Based on the horrific true story of Alyssa Pladl, Elisabeth Rohm directed and executive produced the film alongside Kara Feifer.',
      'HUSBAND/FATHER/KILLER debuted on Lifetime on October 19, 2024.',
    ],
    credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }, { name: 'Kara Feifer', role: 'ep' }],
  },
  {
    title: 'Wife Stalker', slug: 'wife-stalker', year: 2025,
    src: '/assets/works/wife-stalker.png', tags: ['Thriller'], category: 'film', productionStage: 'produced',
    seenOnNames: ['Lifetime'],
    description: [
      "Based on Lynne and Valerie Constantine's electric psychological thriller, Elisabeth Rohm directed and executive produced alongside Kara Feifer.",
      'WIFE STALKER debuted on Lifetime on March 29, 2025.',
    ],
    credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }, { name: 'Kara Feifer', role: 'ep' }],
  },
  {
    title: 'The Dating App Killer', slug: 'the-dating-app-killer', year: 2026,
    src: '/assets/works/the-dating-app-killer.jpg', tags: ['Thriller'], category: 'film', productionStage: 'produced',
    seenOnNames: ['Lifetime'],
    description: [
      'Based on the true story of Monica White, Elisabeth Rohm directed and executive produced the film alongside Kara Feifer.',
      'THE DATING APP KILLER debuted on Lifetime on February 14, 2026.',
    ],
    credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }, { name: 'Kara Feifer', role: 'ep' }],
  },
  {
    title: "Don't Trust The Girls Upstairs", slug: 'dont-trust-the-girls-upstairs', year: 2026,
    src: '/assets/works/sisters-daughter.png', tags: ['Drama'], category: 'film', productionStage: 'produced',
    description: [
      "Based on the novel My Sister's Daughter by Liv Constantine.",
      'David Weaver directed, and Kara Feifer and Elisabeth Rohm executive produced. Released on June 20, 2026.',
    ],
    credits: [{ name: 'David Weaver', role: 'director', isHeadline: true }, { name: 'Kara Feifer', role: 'ep' }, { name: 'Elisabeth Rohm', role: 'ep' }],
  },
  {
    title: 'Marrying A Murderer', slug: 'marrying-a-murderer', year: 2026,
    src: '/assets/works/marrying-a-murderer.jpg', tags: ['Thriller'], category: 'film', productionStage: 'produced',
    seenOnNames: ['Lifetime'],
    description: [
      "A few months after a devastating break up, Dana has finally met the perfect man. Their whirlwind romance offers the promise of a fresh start, but beneath his charming exterior lies a dark secret: years ago, he killed someone and escaped justice. As Dana pieces together the truth, she must decide whether to expose the man she loves, or become his next victim.",
    ],
  },
  {
    title: "Butch Cassidy's Millions", slug: 'butch-cassidys-millions', year: 2026,
    src: '/assets/works/butch-cassidys-millions.png', tags: ['Unscripted'], category: 'unscripted', productionStage: 'produced',
    description: [
      "A one-part survival and one-part true crime investigation, following a team of treasure hunters on a mission to uncover Butch Cassidy's long buried loot. Using cutting-edge technology and old-fashioned detective work, their team braves the 1,500 miles of the Outlaw Trail to retrace Cassidy's movements 150 years later and find the approximate $100,000,000 of loot.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IN PRODUCTION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'A Dentist to Die For', slug: 'a-dentist-to-die-for', year: 2026,
    src: '/assets/posters/a-dentist-to-die-for.png', tags: ['True Crime'], category: 'film', productionStage: 'in-production',
    seenOnNames: ['A&E Global Media'],
    description: [
      'Dental surgeon Dr. James Ryan (50s), a respected figure in his Maryland community, becomes dangerously obsessed with beauty queen Sarah Harris (25) after she visits his office, manipulating her with surgical-grade narcotics to gain control over her. When Sarah is found dead and the police rule it a suicide, her grieving mother Tina—convinced Ryan is responsible—teams up with daughter Rachel to uncover the truth, ultimately unearthing damning evidence that leads to explosive criminal charges.',
      'Written by Barbara Marshall.',
      'Directed by Siobhan Devine.',
    ],
    credits: [{ name: 'Siobhan Devine', role: 'director', isHeadline: true }, { name: 'Barbara Marshall', role: 'writer' }],
  },
  {
    title: 'Our Daughter Has Disappeared', slug: 'our-daughter-has-disappeared', year: 2026,
    src: '/assets/posters/SusanPowell.jpg', tags: ['True Crime'], category: 'film', productionStage: 'in-production',
    description: [
      "When Susan Powell goes missing in December of 2009, the media is swept up into the story. Her husband Josh claims he has no idea what happened to his young wife, yet over the next three years, the evidence will reveal that he committed the ultimate horrific crime when he blew up him and his children in their home. Susan's body was never found.",
      'Written by Waneta Storms.',
      'Directed by Elisabeth Rohm.',
    ],
    credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }, { name: 'Waneta Storms', role: 'writer' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PAID DEVELOPMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Lie Detector', slug: 'lie-detector', year: 2025,
    src: '/assets/works/lie-detector.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-series', productionStage: 'paid-development',
    seenOnNames: ['Mattel'],
    description: [
      'When the FBI unveils VERA, a cutting-edge lie detector considered to be infallible, Master Interrogator, Kara Voss and her team are tasked with proving it. But as they probe deeper, they discover that truth is not always black and white—and some truths are more dangerous than any lie.',
      'A character driven procedural series conceived of by the creator of Criminal Minds, Ed Bernero.',
    ],
    credits: [{ name: 'Ed Bernero', role: 'creator', note: 'creator of Criminal Minds', isHeadline: true }],
  },
  {
    title: 'High Life', slug: 'the-highlife', year: 2026,
    src: '/assets/works/high-life.png', tags: ['Drama'], category: 'series', productionStage: 'paid-development',
    seenOnNames: ['Studio TF1 America', 'A&E Global Media'],
    description: [
      "At the world's most exclusive ski resorts, Whistler, the elite descend for indulgence and excess, leaving local ski instructors and staff to clean up the mess – both on and off the slopes. But as tensions build between wealth and those who serve it, not everyone will make it to the season's final run.",
      'Created by Lauralee Bell, TF1 to co-produce, Ken Girotti and Wendy Coulas set to showrun.',
    ],
    credits: [{ name: 'Lauralee Bell', role: 'creator', isHeadline: true }, { name: 'Ken Girotti', role: 'showrunner' }, { name: 'Wendy Coulas', role: 'showrunner' }],
  },
  {
    title: 'Dispatch', slug: 'dispatch', year: 2026,
    src: '/assets/posters/dispatch.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-series', productionStage: 'paid-development',
    seenOnNames: ['Studio TF1 America'],
    description: [
      'When a late-night call ends in a fiery truck crash, a small-town dispatcher teams up with local police to uncover a deadly cover-up that hits disturbingly close to home — starting with her own family.',
      'Pilot written by David Barett. Co-production with TF1 America. Jessika Borsiczky is showrunning.',
    ],
    credits: [{ name: 'Jessika Borsiczky', role: 'showrunner', isHeadline: true }, { name: 'David Barett', role: 'writer' }],
  },
  {
    title: 'The Palace', slug: 'blade', year: 2026,
    src: '/assets/works/blade.png', tags: ['Drama'], category: 'series', productionStage: 'paid-development',
    seenOnNames: ['A&E Global Media'],
    description: [
      "When a hardened New York defense attorney returns to her former elite skating academy to defend a teenage prodigy accused of murder, she's forced to confront the abusive system and buried crimes that shaped her past before it destroys another girl.",
      'Ben York Jones set to showrun, based on the novel by Wendy Walker.',
    ],
    credits: [{ name: 'Ben York Jones', role: 'showrunner', isHeadline: true }],
  },
  {
    title: 'Sick Puppy', slug: 'sick-puppy', year: 2026,
    src: '/assets/works/sick-puppy.png', tags: ['Drama'], category: 'series', productionStage: 'paid-development',
    seenOnNames: ['NBC'],
    description: [
      'A brilliant but sociopathic psychologist joins an FBI task force to track and dismantle criminalized brainwashing systems, using her unsettling insights to outwit fellow manipulators as she grapples with her own strange and devious impulses.',
      'Ben York Jones is set as showrunner.',
    ],
    credits: [{ name: 'Ben York Jones', role: 'showrunner', isHeadline: true }],
  },
  {
    title: 'Bomb Squad', slug: 'bombsquad', year: 2026,
    src: '/assets/works/bombsquad.png', tags: ['Drama'], category: 'series', productionStage: 'paid-development',
    description: [
      'Based on the true-life story of Jackie Hickey, BOMB SQUAD is a one-hour dramatic series following the elite unit of EOD technicians.',
      'Beneath the neon lights of Las Vegas, an elite bomb squad team confronts deadly bombs, hidden conspiracies, and the personal demons that threaten to detonate their lives.',
      'Onalee Hunter Hughes set to showrun Bombsquad: Las Vegas. Julian Simpson set to showrun Bombsquad: London. Andrew Bampfield and Louis Coquette set to showrun Bombsquad: Paris.',
    ],
    credits: [{ name: 'Onalee Hunter Hughes', role: 'showrunner', isHeadline: true }, { name: 'Julian Simpson', role: 'showrunner' }, { name: 'Andrew Bampfield', role: 'showrunner' }, { name: 'Louis Coquette', role: 'showrunner' }],
  },
  {
    title: 'The Chase: The Josephine Wentzel Story', slug: 'the-chase-the-josephine-wentzel-story', year: 2026,
    src: '/assets/works/the-chase-josephine-wentzel-story.png', tags: ['True Crime'], category: 'series', productionStage: 'paid-development',
    seenOnNames: ['FOX', 'A&E Global Media'],
    description: [
      "THE CHASE follows one mother's attempt to hunt down her daughter's killer, no matter the cost. When her daughter's murder case starts to cool, Josephine takes it into her own hands partnering with the US Marshalls and the FBI to track down her daughter Krystal's killer. She ultimately succeeds in extraditing him from El Salvador to the United States.",
      'Happening in real time, Josephine awaits the trial.',
      "Based on Josephine Wentzel's harrowing memoir of the same name, Jessica Mecklenberg attached to write.",
    ],
    credits: [{ name: 'Jessica Mecklenberg', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Nasty Business', slug: 'nasty-business', year: 2026,
    src: '/assets/works/nasty-business.png', tags: ['Drama'], category: 'film', productionStage: 'paid-development',
    seenOnNames: ['Disney +'],
    description: [
      'A documentary that depicts the horrifying true story currently making its way through the Canadian legal system.',
      "NASTY BUSINESS tells the story of how Robert G. Miller, a reclusive Montréal billionaire, allegedly paid more than 50 young girls for sexual favors from 1996 to 2006. Canada's answer to Jeffery Epstein.",
    ],
  },
  {
    title: 'Girl in the Bubble', slug: 'girl-in-the-bubble', year: 2026,
    src: '/assets/works/girl-in-the-bubble.png', tags: ['Thriller'], category: 'film', productionStage: 'paid-development',
    seenOnNames: ['A&E Global Media'],
    description: [
      "Grief-stricken after her first child dies of a rare immune disorder, Chloe becomes obsessed with protecting her second child, Lily, from the same fate, to the point of sealing her away in a glass chamber. Her father Dan has found a way to make the ongoing streaming story of Lily's life within the bubble lucrative, and when tests reveal that Lily does not in fact have the syndrome that took her brother, Dan buries the results. When Lily makes contact with Kyle, a boy her age out in the wide world she is forbidden to experience, the walls of her perfect world begin to crack.",
      'Stephen Tolkin to pen the script.',
    ],
    credits: [{ name: 'Stephen Tolkin', role: 'writer', isHeadline: true }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRUE STORIES — FEATURES (movies-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Margret & Stevie', slug: 'margret-stevie', year: 2026,
    src: '/assets/works/margret-stevie.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'true-stories-features',
    description: [
      "Publishers are circling, eager to rewrite Curious George's co-creator Margret Rey's legacy—but as they close in, so do the memories of the war she survived decades earlier. In her chain-smoking, foul mouthed dog walker Stevie, Margret finds an unlikely friend—and a spark of renewed hope to fight back.",
      'Matthew Weiner, creator of Mad Men, set to direct. Stephenie Gillis to pen the script. Shirley MacLaine attached to star.',
    ],
    credits: [{ name: 'Matthew Weiner', role: 'director', note: 'creator of Mad Men', isHeadline: true }, { name: 'Stephenie Gillis', role: 'writer' }, { name: 'Shirley MacLaine', role: 'star' }],
  },
  {
    title: 'Feather', slug: 'feather', year: 2026,
    src: '/assets/works/feather.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'true-stories-features',
    description: [
      "This never before told story takes you into the dynamic drama of Farrah Fawcett's life and legacy.",
      'Written by Vernon Scott and co-produced by Latigo Films, to be directed by Destry Allyn Spielberg.',
    ],
    credits: [{ name: 'Vernon Scott', role: 'writer', isHeadline: true }, { name: 'Latigo Films', role: 'co-producer' }, { name: 'Destry Allyn Spielberg', role: 'director' }],
  },
  {
    title: 'An Iron Man', slug: 'iron-man', year: 2025,
    src: '/assets/works/iron-man.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'true-stories-features',
    description: [
      'AN IRON MAN is the true story of the first ever Ironman champion with Down Syndrome and the father who would do anything to give his special-needs son a chance to achieve his dreams against all odds.',
      "Based on Chris and Nik Nikic's memoir. Bobby Hanaford to pen the script. Josh Bachove, producer of Minari, attached to co-produce.",
    ],
    credits: [{ name: 'Bobby Hanaford', role: 'writer', isHeadline: true }, { name: 'Josh Bachove', role: 'co-producer', note: 'producer of Minari' }],
  },
  {
    title: 'Flying Sideways', slug: 'flying-sideways', year: 2026,
    src: '/assets/works/flying-sideways.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'true-stories-features',
    description: [
      'A visceral, adrenaline-fueled, and intimate feature film. Think Top Gun meets The Motorcycle Diaries, blending high-stakes action with emotional introspection.',
      'Memoir by Frédéric North, with Simon Uttley to pen the script.',
    ],
    credits: [{ name: 'Simon Uttley', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Rescue of Jerusalem', slug: 'rescue-of-jerusalem', year: 2026,
    src: '/assets/works/rescue-of-jerusalem.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'true-stories-features',
    description: [
      "In 701 BCE, as the mighty Assyrian Empire marches toward Jerusalem's destruction, an unlikely alliance between the vulnerable kingdom of Judah and the powerful but overlooked Kushite-Egyptian empire mounts a daring resistance that alters the course of world history and saves the roots of three major religions from extinction. Mad Max meets The Old Testament.",
      'Ben Ross, producer & director Testament of Moses, and Jerome Hairston attached to write with Benjamin Ross directing. Based on the book The Rescue of Jerusalem by Henry T. Aubin.',
    ],
    credits: [{ name: 'Benjamin Ross', role: 'director', isHeadline: true }, { name: 'Jerome Hairston', role: 'writer' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRUE STORIES — SERIES (series-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Undefeated', slug: 'undefeated', year: 2026,
    src: '/assets/posters/Undefeated.jpg', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'true-stories-series',
    description: [
      "UNDEFEATED is a series about the Miami Dolphins' 1972 comeback from three straight championship losses to an undefeated season. It is the story of how Head Coach Don Shula broke through the racial divides of the time and unified not only a divided team but a divided city as players journey towards owning their own power.",
      "Based on Mike Freeman's book. JC Coto to showrun.",
    ],
    credits: [{ name: 'JC Coto', role: 'showrunner', isHeadline: true }],
  },
  {
    title: 'Diamonds and Deadlines', slug: 'diamonds-and-deadlines', year: 2026,
    src: '/assets/works/diamonds-and-deadlines.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'true-stories-series',
    description: [
      'This is the true story of Miriam Leslie. The product of her father and one of his slaves. A true renaissance woman, Miriam made her way to the top of the publishing world, a male-dominated industry, becoming one of the wealthiest women in the United States in the late 1800s.',
      'Upon her death she left her multi-million-dollar estate (roughly 50 million dollars today) to the suffragists — a contribution that would ensure the passage of the Nineteenth Amendment.',
      'Nicole Ari Parker attached to star, Susan Fales-Hill attached to showrun.',
    ],
    credits: [{ name: 'Nicole Ari Parker', role: 'star', isHeadline: true }, { name: 'Susan Fales-Hill', role: 'showrunner' }],
  },
  {
    title: "Two's Company", slug: 'twos-company', year: 2025,
    src: '/assets/works/twos-company.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'true-stories-series',
    description: [
      'From a shattered childhood to the heights of fame and reinvention, Suzanne Somers fights to own her voice and her legacy, guided always by the man who saw her before the world ever did.',
      'Alan Hamel to co-produce.',
    ],
    credits: [{ name: 'Alan Hamel', role: 'co-producer', isHeadline: true }],
  },
  {
    title: 'Matador', slug: 'matador', year: 2025,
    src: '/assets/works/matador.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'true-stories-series',
    description: [
      "A streetwise, closeted Brooklyn kid—the gay son of a Russian Jewish cop—flees to Mexico City and, on a dare, trains under a legendary matador to become the first American bullfighter, taking Spain by storm in 1929 alongside Ernest Hemingway, until a brutal goring threatens to end his meteoric rise and his life.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRUE CRIME — MOVIES (movies-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Murder-in-Law', slug: 'murder-in-law', year: 2026,
    src: '/assets/posters/murder-in-law.png', tags: ['True Crime'], category: 'film', productionStage: 'movies-development', subcategory: 'true-crime-movies',
    seenOnNames: ['Law & Crime Network'],
    description: [
      "A wealthy Miami matriarch. A bitter custody war. A hitman's bullet in a quiet suburban driveway. What began as the cold-blooded assassination of a Florida law professor spiraled into one of the most shocking family-driven murder plots in America — a decade-long saga of deception, privilege, and revenge that shattered lives.",
      'Stephen Tolkin to pen.',
    ],
    credits: [{ name: 'Stephen Tolkin', role: 'writer', isHeadline: true }],
  },
  {
    title: 'If You Tell', slug: 'if-you-tell', year: 2026,
    src: '/assets/works/if-you-tell.png', tags: ['True Crime'], category: 'film', productionStage: 'movies-development', subcategory: 'true-crime-movies',
    description: [
      "A shocking and empowering true-crime story of three sisters who are forced to make the most difficult decision of their lives: to turn their murderous mother into the police. Determined to survive their mother's house of horrors, If You Tell is a survivor's story of absolute evil—and the freedom and justice that Nikki, Sami, and Tori risked their lives to fight for.",
      "Barbara Marshall is set to write the script based on New York Times bestselling author Gregg Olsen's nonfiction book.",
    ],
    credits: [{ name: 'Barbara Marshall', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Blackwater Bayou', slug: 'blackwater-bayou', year: 2026,
    src: '/assets/works/blackwater-bayou.png', tags: ['True Crime'], category: 'film', productionStage: 'movies-development', subcategory: 'true-crime-movies',
    description: [
      "After the Deepwater Horizon catastrophe devastates her coastal community, shrimper turned activist, Kindra Arnesen, battles corporate deceit and government apathy to uncover the truth behind the toxic aftermath, risking everything to protect her family and the future of Louisiana's fisheries.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRUE CRIME — SERIES (series-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "The Lobotomist's Wife", slug: 'the-lobotomists-wife', year: 2026,
    src: '/assets/works/the-lobotomists-wife.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'true-crime-series',
    description: [
      'A devoted mental health advocate, Ruth Emeraldine, falls for brilliant but radical lobotomy pioneer Dr. Robert Apter, only to discover his "miracle cure" is leading to horrific results, forcing her to fight against her husband and the medical establishment to save a vulnerable mother from becoming his next victim.',
    ],
  },
  {
    title: 'Double Dealer', slug: 'double-dealer', year: 2026,
    src: '/assets/works/double-dealer.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'true-crime-series',
    description: [
      'DOUBLE DEALER is a fun, twisted, and twisty two-hander about the dark side of the American dream.',
      'Based on the shocking true story of Rita Crundwell, a small-town Illinois comptroller who created a million-dollar equine empire and stole $54 million in the largest municipal fraud case in US history.',
      'Karen Croner set to write.',
    ],
    credits: [{ name: 'Karen Croner', role: 'writer', isHeadline: true }],
  },
  {
    title: 'The Correspondent', slug: 'the-correspondent', year: 2026,
    src: '/assets/works/the-correspondent.png', tags: ['True Crime'], category: 'series', productionStage: 'series-development', subcategory: 'true-crime-series',
    description: [
      'The Correspondent is a character-led true-crime thriller, told through the perspective of Rianna Croxford — a journalist whose reporting combines forensic tenacity with profound empathy. Each season follows Rianna as she enters a closed world, earns the trust of its most vulnerable people, and exposes the systems that protect the powerful.',
      'By Christina Sweeney-Baird & James Mitchell.',
    ],
    credits: [{ name: 'Christina Sweeney-Baird', role: 'writer', isHeadline: true }, { name: 'James Mitchell', role: 'writer' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DRAMAS — FEATURES (movies-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: "Girls Can't Play Pool", slug: 'girls-cant-play-pool', year: 2026,
    src: '/assets/posters/GirlsCantPlayPool.jpg', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      "Heather is a gifted young pool hustler who lives on the edge of chaos. Sam is a no-nonsense former tournament player who is desperate to regain custody of her son. When the two women decide to go on the road together, their lucrative partnership leads to a deep bond. But personal differences and the dangers of the road threaten to tear them apart.",
      'Elisabeth Rohm to direct.',
    ],
    credits: [{ name: 'Elisabeth Rohm', role: 'director', isHeadline: true }],
  },
  {
    title: 'The Weekend Guests', slug: 'weekend-guests', year: 2025,
    src: '/assets/works/weekend-guests.png', tags: ['Thriller'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      "In Liza North's psychological thriller, five old college friends reunite at a secluded Dorset cliffside mansion for a weekend that turns deadly. After receiving chilling postcards, they must confront a dark, shared crime from their past, leading to betrayal and murder when they realize one of them is blackmailing the rest.",
      'Catherine Hardwicke to direct, Ben Milliken set to write.',
    ],
    credits: [{ name: 'Catherine Hardwicke', role: 'director', isHeadline: true }, { name: 'Ben Milliken', role: 'writer' }],
  },
  {
    title: 'A Love Like the Sun', slug: 'a-love-like-the-sun', year: 2026,
    src: '/assets/works/a-love-like-the-sun.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      "When a guarded haircare entrepreneur and her longtime best friend—a rising actor—fake a relationship to save her struggling business, their lifelong bond is tested as real feelings, hidden health battles, and the fear of loss force them to confront what love truly means.",
      'Based on the book by Riss M. Neilson. Cam Roberts set to write.',
    ],
    credits: [{ name: 'Cam Roberts', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Passing Love', slug: 'passing-love', year: 2026,
    src: '/assets/works/passing-love.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      'When a woman accidentally discovers her mother has kept the truth of her birth a secret, she travels to Paris to search for the woman who abandoned her and finds an unexpected truth.',
      'Based on the book by Jacqueline E. Luckett. Producing partners — Antoine Fuqua and Lela Rochon.',
    ],
    credits: [{ name: 'Antoine Fuqua', role: 'producer', isHeadline: true }, { name: 'Lela Rochon', role: 'producer' }],
  },
  {
    title: 'Relentless', slug: 'relentless', year: 2026,
    src: '/assets/posters/relentless.png', tags: ['Thriller'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      '"Fatal Attraction" meets "Cape Fear." A sexy, propulsive thriller where our hero makes one mistake in Mexico that soon spirals out of control. He returns home, mistakenly thinking he\'s free, but his actions follow him to wreak havoc in his family\'s life.',
      'Written by Eddie Gonzalez and Jeremy Haft.',
    ],
    credits: [{ name: 'Eddie Gonzalez', role: 'writer', isHeadline: true }, { name: 'Jeremy Haft', role: 'writer' }],
  },
  {
    title: 'Silent Echo', slug: 'silent-echo', year: 2025,
    src: '/assets/works/silent-echo.png', tags: ['Thriller'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      "A year after the death of her four-year-old son, Charlotte Fleming is sleepwalking through life. Then she sees something that jolts her awake: Sebastion, alive and well in a stranger's social media post. As Charlotte obsessively searches for further indication that her son's accident was not what it seemed, she begins to suspect not only didn't he die—he was taken.",
      'Based on the novella by Liv Constantine, to be written by Rhonda Baraka.',
    ],
    credits: [{ name: 'Rhonda Baraka', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Ruby Falls', slug: 'ruby-falls', year: 2026,
    src: '/assets/works/ruby-falls.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      'A young actress comes to Los Angeles hoping to uncover the secrets of the father who abandoned her in a cave when she was a child. However, when she locates a half-sister she never knew about, her curiosity turns into an obsession that threatens to shatter her carefully constructed reality.',
      "Deborah Goodrich Royce's novel is being adapted for the screen by Amy Fox.",
    ],
    credits: [{ name: 'Amy Fox', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Augusta', slug: 'augusta', year: 2026,
    src: '/assets/works/augusta.jpg', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'dramas-feature',
    description: [
      "At her wit's end in New York City, struggling artist Augusta Mackay flees home to the crumbling castle in Scotland she had abandoned, only to discover the power to rebuild her family legacy, her own life and art, and her ability to truly love.",
      "Gregory W. Jordan has adapted Elisabeth Rohm's novel, Nerissa, into a feature with Rohm directing.",
    ],
    credits: [{ name: 'Gregory W. Jordan', role: 'writer', isHeadline: true }, { name: 'Elisabeth Rohm', role: 'director' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DRAMAS — SERIES (series-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'The Reid Brothers', slug: 'the-reid-brothers', year: 2026,
    src: '/assets/posters/LastDay_ReidBrothers.webp', tags: ['Thriller'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      'State Police detective Conor Reid and Coast Guard Commander Tom Reid, team up to track down a murderer in the seductive and wealthy enclave of the Hamptons. Dark secrets, broken relationships, and the hidden world of Blue Blood money, challenge two brothers to come together and track down killers in the midst of people with seemingly perfect lives...',
      'Based on the Luanne Rice books, LAST DAY, SHADOW BOX, and LAST NIGHT, Jonathan Feldman is set to write this television series with Brian Burns to showrun.',
    ],
    credits: [{ name: 'Jonathan Feldman', role: 'writer', isHeadline: true }, { name: 'Brian Burns', role: 'showrunner' }],
  },
  {
    title: 'Swap', slug: 'swap', year: 2026,
    src: '/assets/posters/swap.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      "This is a show about contemporary marriage. It's about love and sex and commitment and trying to make that commitment last. It's about three couples who aren't quite friends, aren't terribly adventurous, and what happens when they get a little drunk and swap.",
      'Pilot written by Jeff Greenstein.',
    ],
    credits: [{ name: 'Jeff Greenstein', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Cuesta', slug: 'cuesta', year: 2026,
    src: '/assets/works/cuesta.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      "A Latino ex-cop becomes Miami's go-to private eye for clients who have been denied justice by the current legal system. Also specializing in cases for those who cannot turn to the police, Willie Cuesta is a human lie detector.",
      'Based on the series of books by John Lantigua, co-produced with Addiction House Productions, starring Sebastian and Emiliano Zurita.',
    ],
    credits: [{ name: 'John Lantigua', role: 'writer', isHeadline: true }, { name: 'Sebastian Zurita', role: 'star' }, { name: 'Emiliano Zurita', role: 'star' }],
  },
  {
    title: 'Ravenwood', slug: 'ravenwood', year: 2026,
    src: '/assets/works/ravenwood.png', tags: ['Thriller'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      'After moving to an elite London school, a teenage girl uncovers a string of murders tied to a secret vampire society and discovers she may be the only one who can stop them.',
      'Based on the Ravenwood mystery series by Mia James. Kat Rose Martin attached to write.',
    ],
    credits: [{ name: 'Kat Rose Martin', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Rabbit Hole', slug: 'rabbit-hole', year: 2026,
    src: '/assets/works/murder-your-darlings.jpg', tags: ['Thriller'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      "When a novelist falls for a celebrated author, her life feels newly inspired and full of promise. But as a stalker's threats close in, she becomes entangled in a dangerous web of obsession, stalkers, and possible murder, forcing her to question what's real.",
      'Inspired by the novel "Murder Your Darlings" by Jenna Blum.',
    ],
  },
  {
    title: 'Icky', slug: 'icky', year: 2026,
    src: '/assets/works/icky.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      'I Could Kill You ("ICKY") is a dark comedy about a suburban mom, Helena Lepinski, who navigates a police investigation, invasive siblings, and her own escalating paranoia as she tries to determine whether she was justified in killing her abusive, narcissistic father — or if she\'s a psychopath like him. ICKY poses the question: are all parents worthy of love and compassion?',
      'To be showrun by Ken Girotti & Wendy Coulas.',
    ],
    credits: [{ name: 'Ken Girotti', role: 'showrunner', isHeadline: true }, { name: 'Wendy Coulas', role: 'showrunner' }],
  },
  {
    title: 'Intent', slug: 'intent', year: 2026,
    src: '/assets/works/intent.png', tags: ['Thriller'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      "When a brilliant Boston prosecutor wakes up in Miami beside a dead man and no memory of the night before, she must return home to her high-stakes courtroom life while secretly investigating whether she's the killer.",
      'Michael Chernuchin and Allison Intrieri to showrun.',
    ],
    credits: [{ name: 'Michael Chernuchin', role: 'showrunner', isHeadline: true }, { name: 'Allison Intrieri', role: 'showrunner' }],
  },
  {
    title: 'American Serial', slug: 'american-serial', year: 2026,
    src: '/assets/works/american-serial.png', tags: ['True Crime'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      "A reclusive novelist is tasked with writing the tell-all story about her former best friend – the only problem? Her former best friend is serial killer Ted Bundy.",
      'Created by Cameron Dupuy and Alexander Cadiff.',
    ],
    credits: [{ name: 'Cameron Dupuy', role: 'creator', isHeadline: true }, { name: 'Alexander Cadiff', role: 'creator' }],
  },
  {
    title: 'Play Dead', slug: 'play-dead', year: 2025,
    src: '/assets/works/play-dead.png', tags: ['Thriller'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      'PLAY DEAD is a paranormal thriller set in Savannah, Georgia, where the supernatural and homicide meet when a series of bizarre murders connected to root magic terrorize the city.',
      "Based on Anne Frasier's hit ELISE SANDBURG mystery novels. Adapted by Barbara Marshall.",
    ],
    credits: [{ name: 'Barbara Marshall', role: 'writer', isHeadline: true }],
  },
  {
    title: 'Booth P.I.', slug: 'booth-p-i', year: 2025,
    src: '/assets/works/booth-pi.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'dramas-series',
    description: [
      'A recovering Southern belle and struggling New York actress returns home to save her family plantation from foreclosure and accidentally becomes a small-town sleuth, joined by her over-the-top, wealthy childhood best friend and her new roommate — a flamboyant, opinionated ghost.',
      'Co-Produced with Bobby Salomon, written by Carolyn Haines, Andrew Orenstein to showrun.',
    ],
    credits: [{ name: 'Andrew Orenstein', role: 'showrunner', isHeadline: true }, { name: 'Carolyn Haines', role: 'writer' }, { name: 'Bobby Salomon', role: 'co-producer' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FRANCHISES (series-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Wife on The Edge', slug: 'wife-on-the-edge', year: 2026,
    src: '/assets/works/wife-on-the-edge.jpg', tags: ['Thriller'], category: 'series', productionStage: 'series-development', subcategory: 'franchises',
    description: [
      'Wife on the Edge is a jaw-dropping collection of high-camp, murder-fueled, glam scripted thrillers, each starring iconic women.',
      "It's an ongoing wheel of movies celebrating the moment when she finally loses it. Think: The Real Housewives meets Snapped.",
    ],
  },
  {
    title: 'ICON', slug: 'icon', year: 2026,
    src: '/assets/works/icon.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'franchises',
    description: [
      'ICON is a premium anthology series that explores the lives of the most iconic women in television and pop culture. Each installment centers on a different woman—unpacking the defining moments, untold stories, and cultural impact that made her unforgettable. Bold, cinematic, and deeply character-driven, ICON is designed as an ongoing franchise.',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HOLIDAY — FEATURES (movies-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'A Not So Silent Night', slug: 'a-not-so-silent-night', year: 2026,
    src: '', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'holiday-features',
    description: [
      "Legendary rock singer Roxy Knight is a brash whirlwind of energy who has always put her career first. Unfortunately for her daughter Calista, who always knew that she came second, her resentment towards her mother is palpable as an adult. When Roxy injures herself during a performance, she must convalesce at Calista's home over Christmas.",
      'Screenplay by Penelope Koechl and Juliet Law Packer.',
    ],
    credits: [{ name: 'Penelope Koechl', role: 'writer', isHeadline: true }, { name: 'Juliet Law Packer', role: 'writer' }],
  },
  {
    title: 'Mistletoe and Holly', slug: 'mistletoe-and-holly', year: 2026,
    src: '', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'holiday-features',
    description: [
      "Holly's dream of a picture-perfect Christmas with her new boyfriend Jason turns chaotic when her family's holiday spirit fizzles, but with the help of her overbearing best friend Isaac, she orchestrates a festive celebration that leaves her questioning if she's with the right guy under the mistletoe.",
      'Charlie Shahnaian and Shari Simpson to pen the script.',
    ],
    credits: [{ name: 'Charlie Shahnaian', role: 'writer', isHeadline: true }, { name: 'Shari Simpson', role: 'writer' }],
  },
  {
    title: '25 to Life', slug: '25-to-life', year: 2026,
    src: '', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'holiday-features',
    description: [
      "A love-obsessed New York influencer who's tired of being ghosted agrees to ditch her impossible dating checklist and go on 25 dates in 25 days—only to discover that the connection she's been searching for might have been right in front of her all along.",
      'Screenplay by Ben Milliken.',
    ],
    credits: [{ name: 'Ben Milliken', role: 'writer', isHeadline: true }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMEDY — FEATURES (movies-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Horseplay', slug: 'horseplay', year: 2026,
    src: '/assets/posters/horseplay.png', tags: ['Unscripted'], category: 'unscripted', productionStage: 'movies-development', subcategory: 'comedy-features',
    description: [
      "When a young hobby horse competitor is assaulted, a collegiate athlete hopeful saddles up and goes undercover to solve the case in the comedic and bizarre world of competitive hobby horsing — where the stakes are high, and the horses are, well, not real!",
      'Feature Screenplay by Sarah Adina and Ruby Hanger. Mason Novick to co-produce.',
    ],
    credits: [{ name: 'Sarah Adina', role: 'writer', isHeadline: true }, { name: 'Ruby Hanger', role: 'writer' }, { name: 'Mason Novick', role: 'co-producer' }],
  },
  {
    title: 'Nookietown', slug: 'nookietown', year: 2026,
    src: '/assets/posters/Nookietown.jpg', tags: ['Unscripted'], category: 'unscripted', productionStage: 'movies-development', subcategory: 'comedy-features',
    description: [
      'When an exhausted housewife asks her divorced best friend to sleep with her husband, what starts out as a joke becomes an opportunity. After the success of their experiment they start "The Program" where married women choose single women to sleep with their husbands on their own terms. What could go wrong?',
      "Based on V.C. Chickering's hit novel.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMEDY — SERIES (series-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Sunshine Sisters', slug: 'sunshine-sisters', year: 2025,
    src: '/assets/works/sunshine-sisters.png', tags: ['Drama'], category: 'series', productionStage: 'series-development', subcategory: 'comedy-series',
    description: [
      'SUNSHINE SISTERS tells the story of Ronni Sunshine, an aging film star, who receives a devastating medical diagnosis. Ronni hires a documentarian to chronicle her life, bringing her three daughters back together to confront their collective estrangement.',
      "Based on New York Times bestselling author Jane Greene's novel. Claudia Lonow and Heather Hach Hearn set as showrunners.",
    ],
    credits: [{ name: 'Claudia Lonow', role: 'showrunner', isHeadline: true }, { name: 'Heather Hach Hearn', role: 'showrunner' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENTARY (movies-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Justice For Tupac', slug: 'justice-for-tupac', year: 2026,
    src: '/assets/works/justice-for-tupac.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'documentary',
    description: [
      "Nominated for an Oscar for her film TUPAC RESURRECTION, director Lauren Lazin will document the aftermath of a shocking arrest in the murder of a beloved artist after almost 30 years of silence, with unprecedented access inside the biggest trial in Hip-Hop history – told through the never-before seen POV of Tupac's sister, Sekyiwa.",
    ],
    credits: [{ name: 'Lauren Lazin', role: 'director', isHeadline: true }],
  },
  {
    title: 'TransElectric', slug: 'transelectric', year: 2026,
    src: '/assets/posters/TransElectric2.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', subcategory: 'documentary',
    description: [
      "From the depths of the '70s rock 'n' roll excesses, touring with Elton John and Bonnie Raitt to name a few, Cidny Bullen takes us through his unimaginable personal losses, through his inspiring gender transition at 61-years-old. This is a compelling journey about finding your authentic voice and using it!",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UNSCRIPTED (series-development)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    title: 'Out for Love', slug: 'out-for-love', year: 2026,
    src: '/assets/works/out-for-love.png', tags: ['Unscripted'], category: 'unscripted', productionStage: 'series-development', subcategory: 'unscripted',
    description: [
      'Recently released convicts step back into the real world—and straight into the unpredictable world of dating—in OUT FOR LOVE, a provocative reality series where former inmates search for romance with partners drawn to their raw honesty, complicated pasts, and second chances at love.',
      'Co-production with Hillary Heath and Andrew Adolphus.',
    ],
    credits: [{ name: 'Hillary Heath', role: 'co-producer', isHeadline: true }, { name: 'Andrew Adolphus', role: 'co-producer' }],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEGACY — in production DB but not in current deck
  // ═══════════════════════════════════════════════════════════════════════════
  { title: 'Flower Girl', slug: 'flower-girl', year: 2025, src: '/assets/works/flower-girl.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: ['With Lockwood Media. The story of Virginia Cherrill, the leading lady of "City Lights" — about the severe consequences she suffered for refusing Chaplin\'s advances.'] },
  { title: '1% Better', slug: '1-better', year: 2026, src: '/assets/works/1-better.png', tags: ['Drama'], category: 'film', productionStage: 'movies-development', description: ['Project in active movies development.'] },
  { title: 'Korean Espionage', slug: 'korean-espionage', year: 2026, src: '/assets/posters/KoreanEspionage.png', tags: ['Thriller'], category: 'series', subcategory: 'true-crime-series', productionStage: 'series-development', description: ["When Korean Air Flight 858 is exploded by a North Korean agent, a former US soldier learns about his Japanese wife's darkest secret: she mentored the attacker."] },
  { title: 'Southern Gothic', slug: 'southern-gothic', year: 2026, src: '/assets/posters/SouthernGothic.png', tags: ['Thriller'], category: 'series', subcategory: 'dramas-series', productionStage: 'series-development', description: ["When Atlanta detective Laine Badder returns to her Appalachian hometown to bury her mother, unsettling details make her suspect it wasn't natural causes."] },
  { title: 'Call Me Madam', slug: 'call-me-madam', year: 2026, src: '/assets/posters/CallMeMadam.png', tags: ['Drama'], category: 'series', subcategory: 'dramas-series', productionStage: 'series-development', description: ["In 1961 Hot Springs, Arkansas, a savvy madam attempts to pass her high-end brothel to her Black protégé, challenging the town's racial barriers and mob control."] },
  { title: 'If Anything Happens to Me', slug: 'if-anything-happens-to-me', year: 2026, src: '/assets/works/if-anything-happens-to-me.png', tags: ['Unscripted'], category: 'unscripted', description: ['A letter left behind. A trail that leads inward.'] },
  { title: 'Sleeping Angel', slug: 'sleeping-angel', year: 2025, src: '/assets/works/sleeping-angel.png', tags: ['Unscripted'], category: 'unscripted', description: ['Not every angel is watching over you.'] },
  { title: 'In Not So Loving Memory', slug: 'in-not-so-loving-memory', year: 2025, src: '/assets/works/in-not-so-loving-memory.png', tags: ['Unscripted'], category: 'unscripted', description: ["The dead don't always stay quiet."] },
  { title: 'Darkness Falls', slug: 'darkness-falls', year: 2025, src: '/assets/works/darkness-falls.png', tags: ['Unscripted'], category: 'unscripted', description: ['When the lights go out, the real story begins.'] },
]

export async function seedWorks(payload: Payload, mediaMap: Map<string, number>, platformMap?: Map<string, number>): Promise<void> {
  console.log('[seed-works] Seeding works...')

  for (let i = 0; i < WORKS_DATA.length; i++) {
    const item = WORKS_DATA[i]!
    const posterId = item.src ? mediaMap.get(item.src) : undefined

    const existing = await payload.find({
      collection: 'works',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })

    const seenOn = item.seenOnNames && platformMap
      ? item.seenOnNames.map(name => platformMap.get(name)).filter((id): id is number => id !== undefined)
      : undefined

    const unresolvedPlatforms = item.seenOnNames
      ? item.seenOnNames.filter(name => !platformMap?.get(name))
      : []
    if (unresolvedPlatforms.length > 0) {
      console.warn(`[seed-works] ⚠ ${item.title}: platform(s) not found: ${unresolvedPlatforms.join(', ')}`)
    }

    const data = {
      title: item.title,
      slug: item.slug,
      year: item.year,
      tags: item.tags,
      description: paragraphsToLexical(item.description),
      videoUrl: item.videoUrl || '',
      category: item.category || undefined,
      credits: item.credits || undefined,
      productionStage: item.productionStage || undefined,
      subcategory: item.subcategory || '',
      sortOrder: i,
      seo: generateWorkSeo(item),
      ...(posterId ? { poster: posterId } : {}),
      ...(seenOn?.length ? { seenOn } : {}),
    }

    const channelLabel = seenOn?.length
      ? ` [${item.seenOnNames!.join(' + ')}]`
      : ''

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'works',
        id: existing.docs[0]!.id,
        data: data as never,
      })
      console.log(`[seed-works] Updated: ${item.title}${channelLabel}`)
    } else {
      await payload.create({
        collection: 'works',
        data: data as never,
      })
      console.log(`[seed-works] Created: ${item.title}${channelLabel}`)
    }
  }

  console.log(`[seed-works] Done. ${WORKS_DATA.length} works seeded.`)
}
