/**
 * ============================================
 * RFE — CONTENT FILE
 * ============================================
 * 
 * NON-LOCALIZED DATA ONLY
 * 
 * All localized text (translations, about, team, awards, contact)
 * is now loaded from Google Sheets via lib/i18n/sheets.ts
 * 
 * This file contains only:
 * - Type exports (Language, MediaItem)
 * - Partners list (non-localized)
 * - MEDIA data (posters with both EN/FR versions)
 * ============================================
 */

// Re-export Language type from sheets loader
export type { Language } from '@/lib/i18n/sheets'

// Media item type
export type MediaItem = {
  id: number
  title: string
  year: number
  src: string
  tags: string[]
  description?: string
  videoUrl?: string
  category?: 'film' | 'series' | 'unscripted'
  subcategory?: string
}

// ============================================
// MEDIA CONTENT (Language-aware)
// ============================================

export const MEDIA = {
  posters: {
    en: [
      // — Drama —
      { id: 2, title: 'Out for Love', year: 2026, src: '/assets/works/out-for-love.png', tags: ['Drama'], description: 'What happens when desire refuses to follow the rules.' },
      { id: 3, title: 'Ruby Falls', year: 2026, src: '/assets/works/ruby-falls.png', tags: ['Drama'], description: 'A young actress comes to Los Angeles hoping to uncover the secrets of the father who abandoned her in a cave when she was a child.' },
      { id: 4, title: "Sister's Daughter", year: 2026, src: '/assets/works/sisters-daughter.png', tags: ['Drama'], description: 'Blood ties, buried secrets, and the weight of what was never said.' },
      { id: 6, title: 'Passing Love', year: 2026, src: '/assets/works/passing-love.png', tags: ['Drama'], description: 'When a woman accidentally discovers her mother has kept the truth of her birth a secret, she travels to Paris to search for the woman who abandoned her.' },
      { id: 10, title: 'By Midnight', year: 2025, src: '/assets/works/by-midnight.png', tags: ['Drama'], description: 'After moving to an elite London school, a teenage girl uncovers a string of murders tied to a secret vampire society.' },
      { id: 11, title: 'Weekend Guests', year: 2025, src: '/assets/works/weekend-guests.png', tags: ['Thriller'], description: 'Five old college friends reunite at a secluded Dorset cliffside mansion for a weekend that turns deadly.' },
      { id: 12, title: 'A Love Like the Sun', year: 2026, src: '/assets/works/a-love-like-the-sun.png', tags: ['Drama'], description: 'When a guarded haircare entrepreneur and her longtime best friend fake a relationship to save her struggling business, their lifelong bond is tested.' },
      { id: 13, title: 'Sunshine Sisters', year: 2025, src: '/assets/works/sunshine-sisters.png', tags: ['Drama'], description: 'The story of Ronni Sunshine, an aging film star who receives a devastating medical diagnosis and brings her three daughters back together.' },
      { id: 14, title: 'Trans Electric', year: 2026, src: '/assets/works/trans-electric.png', tags: ['Drama'], description: "From the depths of the '70s rock 'n' roll excesses, Cidny Bullen's compelling journey about finding your authentic voice." },
      { id: 15, title: 'Rescue of Jerusalem', year: 2026, src: '/assets/works/rescue-of-jerusalem.png', tags: ['Drama'], description: 'In 701 BCE, an unlikely alliance between the kingdom of Judah and the Kushite-Egyptian empire mounts a daring resistance against the Assyrian Empire.' },
      { id: 16, title: 'Matador', year: 2025, src: '/assets/works/matador.png', tags: ['Drama'], description: 'A streetwise Brooklyn kid flees to Mexico City and trains under a legendary matador to become the first American bullfighter.' },

      // — Thriller —
      { id: 46, title: 'Husband Father Killer', year: 2024, src: '/assets/works/husband-father-killer.jpg', tags: ['Thriller'], description: 'Based on the horrific true story of Alyssa Pladl, Elisabeth Rohm directed and executive produced the film alongside Kara Feifer. Debuted on Lifetime on October 19, 2024.' },
      { id: 17, title: 'The Dating App Killer', year: 2026, src: '/assets/works/the-dating-app-killer.jpg', tags: ['Thriller'], description: 'Based on the true story of Monica White. Elisabeth Rohm directed and executive produced alongside Kara Feifer.' },
      { id: 18, title: 'Murder Your Darlings', year: 2026, src: '/assets/works/murder-your-darlings.jpg', tags: ['Thriller'], description: 'When a novelist falls for a celebrated author, she becomes entangled in a dangerous web of obsession, stalkers, and possible murder.' },
      { id: 19, title: 'If You Tell', year: 2026, src: '/assets/works/if-you-tell.png', tags: ['Thriller'], description: 'A shocking and empowering true-crime story of three sisters forced to make the most difficult decision of their lives: to turn their murderous mother into the police.' },
      { id: 20, title: 'If Anything Happens to Me', year: 2026, src: '/assets/works/if-anything-happens-to-me.png', tags: ['Thriller'], description: 'A letter left behind. A trail that leads inward.' },
      { id: 21, title: 'Sleeping Angel', year: 2025, src: '/assets/works/sleeping-angel.png', tags: ['Thriller'], description: 'Not every angel is watching over you.' },
      { id: 22, title: 'In Not So Loving Memory', year: 2025, src: '/assets/works/in-not-so-loving-memory.png', tags: ['Thriller'], description: "The dead don't always stay quiet." },
      { id: 24, title: 'Play Dead', year: 2025, src: '/assets/works/play-dead.png', tags: ['Thriller'], description: 'A paranormal thriller set in Savannah, Georgia, where the supernatural and homicide meet when a series of bizarre murders connected to root magic terrorize the city.' },
      { id: 25, title: 'Wife Stalker', year: 2025, src: '/assets/works/wife-stalker.png', tags: ['Thriller'], description: "Based on Lynne and Valerie Constantine's psychological thriller. Elisabeth Rohm directed and executive produced alongside Kara Feifer." },
      { id: 26, title: 'Darkness Falls', year: 2025, src: '/assets/works/darkness-falls.png', tags: ['Thriller'], description: 'When the lights go out, the real story begins.' },
      { id: 27, title: 'Booth P.I.', year: 2025, src: '/assets/works/booth-pi.png', tags: ['Thriller'], description: 'A recovering Southern belle and struggling New York actress returns home to save her family plantation and accidentally becomes a small-town sleuth.' },
      { id: 29, title: 'Iron Man', year: 2025, src: '/assets/works/iron-man.png', tags: ['Drama'], description: 'The true story of the first ever Ironman champion with Down Syndrome and the father who would do anything to give his special-needs son a chance.' },

      // — Development: Films —
      { id: 30, title: 'Our Daughter Has Disappeared', year: 2026, src: '/assets/posters/our-sister-has-disappeared.png', tags: ['True Crime'], category: 'film' as const, description: "When Susan Powell goes missing in December of 2009, the media is swept up into the story. Based on the book \"If I Can't Have You\" by Gregg Olsen and Rebecca Morris." },
      { id: 31, title: 'A Dentist to Die For', year: 2026, src: '/assets/posters/a-dentist-to-die-for.png', tags: ['True Crime'], category: 'film' as const, description: 'Dental surgeon Dr. James Ryan becomes dangerously obsessed with beauty queen Sarah Harris, manipulating her with surgical-grade narcotics.' },
      { id: 1, title: 'Margret & Stevie', year: 2026, src: '/assets/works/margret-stevie.png', tags: ['Drama'], category: 'film' as const, description: "Publishers are circling, eager to rewrite Curious George's co-creator Margret Rey's legacy — but as they close in, so do the memories of the war she survived decades earlier. Starring Shirley MacLaine, directed by Matthew Weiner." },
      { id: 32, title: 'Feather', year: 2026, src: '/assets/posters/feather.png', tags: ['Drama'], category: 'film' as const, description: "The never before told story of Farrah Fawcett's life and legacy. Written by Vernon Scott, co-produced by Latigo Films." },
      { id: 9, title: 'Flower Girl', year: 2025, src: '/assets/works/flower-girl.png', tags: ['Drama'], category: 'film' as const, description: 'The story of Virginia Cherrill, the leading lady of "City Lights" — about the severe consequences she suffered for refusing Chaplin\'s advances.' },
      { id: 33, title: 'Murder-in-Law', year: 2026, src: '/assets/posters/murder-in-law.png', tags: ['True Crime'], category: 'film' as const, subcategory: 'true-crime-movies', description: "A wealthy Miami matriarch. A bitter custody war. A hitman's bullet. What began as the cold-blooded assassination of a Florida law professor spiraled into one of the most shocking family-driven murder plots in America." },
      { id: 34, title: "Girls Can't Play Pool", year: 2026, src: '/assets/posters/girls-cant-play-pool.png', tags: ['Drama'], category: 'film' as const, subcategory: 'dramas-feature', description: 'Heather is a gifted young pool hustler who lives on the edge of chaos. When two women decide to go on the road together, their lucrative partnership leads to a deep bond. Elisabeth Rohm to direct.' },

      // — Development: Series —
      { id: 35, title: 'Undefeated', year: 2026, src: '/assets/posters/undefeated.png', tags: ['Drama'], category: 'series' as const, description: "Inside the Miami Dolphins' 1972 comeback from three straight championship losses to an undefeated season. Based on Mike Freeman's book." },
      { id: 8, title: 'Diamonds and Deadlines', year: 2026, src: '/assets/works/diamonds-and-deadlines.png', tags: ['Drama'], category: 'series' as const, description: 'The true story of Miriam Leslie, who made her way to the top of the publishing world and left her multi-million-dollar estate to the suffragists.' },
      { id: 7, title: "Two's Company", year: 2025, src: '/assets/works/twos-company.png', tags: ['Drama'], category: 'series' as const, description: 'From a shattered childhood to the heights of fame and reinvention, Suzanne Somers fights to own her voice and her legacy.' },
      { id: 36, title: 'Korean Espionage', year: 2026, src: '/assets/posters/korean-espionage.png', tags: ['Thriller'], category: 'series' as const, subcategory: 'true-crime-series', description: 'When Korean Air Flight 858 is exploded by a North Korean agent, a former US soldier learns about his Japanese wife\'s darkest secret: she mentored the attacker.' },
      { id: 5, title: "The Lobotomist's Wife", year: 2026, src: '/assets/works/lobotomist-wife.png', tags: ['Drama'], category: 'series' as const, subcategory: 'true-crime-series', description: 'A devoted mental health advocate falls for a brilliant but radical lobotomy pioneer, only to discover his "miracle cure" is leading to horrific results.' },
      { id: 45, title: "Girls Can't Play Pool", year: 2026, src: '/assets/posters/girls-cant-play-pool.png', tags: ['Drama'], category: 'series' as const, subcategory: 'dramas-feature', description: 'Heather is a gifted young pool hustler who lives on the edge of chaos. When two women decide to go on the road together, their lucrative partnership leads to a deep bond. Elisabeth Rohm to direct.' },
      { id: 37, title: 'Relentless', year: 2026, src: '/assets/posters/relentless.png', tags: ['Thriller'], category: 'series' as const, subcategory: 'dramas-feature', description: '"Fatal Attraction" meets "Cape Fear." A sexy, propulsive thriller where one mistake in Mexico spirals out of control.' },
      { id: 28, title: 'Silent Echo', year: 2025, src: '/assets/works/silent-echo.png', tags: ['Thriller'], category: 'series' as const, subcategory: 'dramas-feature', description: "A year after the death of her four-year-old son, Charlotte Fleming sees something that jolts her awake: Sebastion, alive and well in a stranger's social media post." },
      { id: 38, title: 'Call Me Madam', year: 2026, src: '/assets/posters/call-me-madam.png', tags: ['Drama'], category: 'series' as const, subcategory: 'dramas-series', description: "In 1961 Hot Springs, Arkansas, a savvy madam attempts to pass her high-end brothel to her Black protégé, challenging the town's racial barriers and mob control." },
      { id: 39, title: 'Swap', year: 2026, src: '/assets/posters/swap.png', tags: ['Drama'], category: 'series' as const, subcategory: 'dramas-series', description: 'A show about contemporary marriage — love, sex, commitment, and what happens when three couples who aren\'t quite friends get a little drunk and swap.' },
      { id: 40, title: 'The Reid Brothers', year: 2026, src: '/assets/posters/the-reid-brothers.png', tags: ['Thriller'], category: 'series' as const, subcategory: 'dramas-series', description: 'State Police detective Conor Reid and Coast Guard Commander Tom Reid team up to track down a murderer in the seductive and wealthy enclave of the Hamptons.' },
      { id: 23, title: 'Lie Detector', year: 2025, src: '/assets/works/lie-detector.png', tags: ['Thriller'], category: 'series' as const, subcategory: 'dramas-series', description: 'When the FBI unveils VERA, a cutting-edge lie detector considered to be infallible, Master Interrogator Kara Voss and her team are tasked with proving it.' },
      { id: 41, title: 'Southern Gothic', year: 2026, src: '/assets/posters/southern-gothic.png', tags: ['Thriller'], category: 'series' as const, subcategory: 'dramas-series', description: 'When Atlanta detective Laine Badder returns to her Appalachian hometown to bury her mother, unsettling details make her suspect it wasn\'t natural causes.' },
      { id: 42, title: 'Dispatch', year: 2026, src: '/assets/posters/dispatch.png', tags: ['Thriller'], category: 'series' as const, subcategory: 'dramas-series', description: 'When a late-night call ends in a fiery truck crash, a small-town dispatcher teams up with local police to uncover a deadly cover-up. Co-production with TF1 America.' },

      // — Development: Unscripted —
      { id: 43, title: 'Horseplay', year: 2026, src: '/assets/posters/horseplay.png', tags: ['Unscripted'], category: 'unscripted' as const, subcategory: 'comedy-features', description: 'When a young hobby horse competitor is assaulted, a college athlete goes undercover to solve the mystery in the unique world of competitive hobby horsing.' },
      { id: 44, title: 'Nookietown', year: 2026, src: '/assets/posters/nookietown.png', tags: ['Unscripted'], category: 'unscripted' as const, subcategory: 'comedy-features', description: "When an exhausted housewife asks her divorced best friend to sleep with her husband, what starts as a joke becomes an opportunity. Based on V.C. Chickering's novel." },
    ] as MediaItem[],
  },
}
