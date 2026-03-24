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
}

// ============================================
// MEDIA CONTENT (Language-aware)
// ============================================

export const MEDIA = {
  posters: {
    en: [
      // — Drama —
      { id: 1, title: 'Margret & Stevie', year: 2026, src: '/assets/works/margret-stevie.png', tags: ['Drama'], category: 'film' as const, description: 'Publishers are circling, eager to rewrite Curious George\'s co-creator Margret Rey\'s legacy — but as they close in, so do the memories of the war she survived decades earlier. Starring Shirley MacLaine, directed by Matthew Weiner.' },
      { id: 2, title: 'Out for Love', year: 2026, src: '/assets/works/out-for-love.png', tags: ['Drama'], description: 'What happens when desire refuses to follow the rules.' },
      { id: 3, title: 'Ruby Falls', year: 2026, src: '/assets/works/ruby-falls.png', tags: ['Drama'], description: 'A young actress comes to Los Angeles hoping to uncover the secrets of the father who abandoned her in a cave when she was a child.' },
      { id: 4, title: 'Sister\'s Daughter', year: 2026, src: '/assets/works/sisters-daughter.png', tags: ['Drama'], description: 'Blood ties, buried secrets, and the weight of what was never said.' },
      { id: 5, title: 'The Lobotomist\'s Wife', year: 2026, src: '/assets/works/lobotomist-wife.png', tags: ['Drama'], category: 'series' as const, description: 'A devoted mental health advocate falls for a brilliant but radical lobotomy pioneer, only to discover his "miracle cure" is leading to horrific results.' },
      { id: 6, title: 'Passing Love', year: 2026, src: '/assets/works/passing-love.png', tags: ['Drama'], description: 'When a woman accidentally discovers her mother has kept the truth of her birth a secret, she travels to Paris to search for the woman who abandoned her.' },
      { id: 7, title: 'Two\'s Company', year: 2025, src: '/assets/works/twos-company.png', tags: ['Drama'], category: 'series' as const, description: 'From a shattered childhood to the heights of fame and reinvention, Suzanne Somers fights to own her voice and her legacy.' },
      { id: 8, title: 'Diamonds and Deadlines', year: 2026, src: '/assets/works/diamonds-and-deadlines.png', tags: ['Drama'], category: 'series' as const, description: 'The true story of Miriam Leslie, who made her way to the top of the publishing world and left her multi-million-dollar estate to the suffragists.' },
      { id: 9, title: 'Flower Girl', year: 2025, src: '/assets/works/flower-girl.png', tags: ['Drama'], category: 'film' as const, description: 'The story of Virginia Cherrill, the leading lady of "City Lights" — about the severe consequences she suffered for refusing Chaplin\'s advances.' },
      { id: 10, title: 'By Midnight', year: 2025, src: '/assets/works/by-midnight.png', tags: ['Drama'], description: 'After moving to an elite London school, a teenage girl uncovers a string of murders tied to a secret vampire society.' },
      { id: 11, title: 'Weekend Guests', year: 2025, src: '/assets/works/weekend-guests.png', tags: ['Thriller'], description: 'Five old college friends reunite at a secluded Dorset cliffside mansion for a weekend that turns deadly.' },
      { id: 12, title: 'A Love Like the Sun', year: 2026, src: '/assets/works/a-love-like-the-sun.png', tags: ['Drama'], description: 'When a guarded haircare entrepreneur and her longtime best friend fake a relationship to save her struggling business, their lifelong bond is tested.' },
      { id: 13, title: 'Sunshine Sisters', year: 2025, src: '/assets/works/sunshine-sisters.png', tags: ['Drama'], description: 'The story of Ronni Sunshine, an aging film star who receives a devastating medical diagnosis and brings her three daughters back together.' },
      { id: 14, title: 'Trans Electric', year: 2026, src: '/assets/works/trans-electric.png', tags: ['Drama'], description: 'From the depths of the \'70s rock \'n\' roll excesses, Cidny Bullen\'s compelling journey about finding your authentic voice.' },
      { id: 15, title: 'Rescue of Jerusalem', year: 2026, src: '/assets/works/rescue-of-jerusalem.png', tags: ['Drama'], description: 'In 701 BCE, an unlikely alliance between the kingdom of Judah and the Kushite-Egyptian empire mounts a daring resistance against the Assyrian Empire.' },
      { id: 16, title: 'Matador', year: 2025, src: '/assets/works/matador.png', tags: ['Drama'], description: 'A streetwise Brooklyn kid flees to Mexico City and trains under a legendary matador to become the first American bullfighter.' },

      // — Thriller —
      { id: 17, title: 'The Dating App Killer', year: 2025, src: '/assets/works/the-dating-app-killer.jpg', tags: ['Thriller'], description: 'Based on the true story of Monica White. Elisabeth Rohm directed and executive produced alongside Kara Feifer.' },
      { id: 18, title: 'Murder Your Darlings', year: 2026, src: '/assets/works/murder-your-darlings.jpg', tags: ['Thriller'], description: 'When a novelist falls for a celebrated author, she becomes entangled in a dangerous web of obsession, stalkers, and possible murder.' },
      { id: 19, title: 'If You Tell', year: 2026, src: '/assets/works/if-you-tell.png', tags: ['Thriller'], description: 'A shocking and empowering true-crime story of three sisters forced to make the most difficult decision of their lives: to turn their murderous mother into the police.' },
      { id: 20, title: 'If Anything Happens to Me', year: 2026, src: '/assets/works/if-anything-happens-to-me.png', tags: ['Thriller'], description: 'A letter left behind. A trail that leads inward.' },
      { id: 21, title: 'Sleeping Angel', year: 2025, src: '/assets/works/sleeping-angel.png', tags: ['Thriller'], description: 'Not every angel is watching over you.' },
      { id: 22, title: 'In Not So Loving Memory', year: 2025, src: '/assets/works/in-not-so-loving-memory.png', tags: ['Thriller'], description: 'The dead don\'t always stay quiet.' },
      { id: 23, title: 'Lie Detector', year: 2025, src: '/assets/works/lie-detector.png', tags: ['Thriller'], category: 'series' as const, description: 'When the FBI unveils VERA, a cutting-edge lie detector considered to be infallible, Master Interrogator Kara Voss and her team are tasked with proving it.' },
      { id: 24, title: 'Play Dead', year: 2025, src: '/assets/works/play-dead.png', tags: ['Thriller'], description: 'A paranormal thriller set in Savannah, Georgia, where the supernatural and homicide meet when a series of bizarre murders connected to root magic terrorize the city.' },
      { id: 25, title: 'Wife Stalker', year: 2025, src: '/assets/works/wife-stalker.png', tags: ['Thriller'], description: 'Based on Lynne and Valerie Constantine\'s psychological thriller. Elisabeth Rohm directed and executive produced alongside Kara Feifer.' },
      { id: 26, title: 'Darkness Falls', year: 2025, src: '/assets/works/darkness-falls.png', tags: ['Thriller'], description: 'When the lights go out, the real story begins.' },
      { id: 27, title: 'Booth P.I.', year: 2025, src: '/assets/works/booth-pi.png', tags: ['Thriller'], description: 'A recovering Southern belle and struggling New York actress returns home to save her family plantation and accidentally becomes a small-town sleuth.' },
      { id: 28, title: 'Silent Echo', year: 2025, src: '/assets/works/silent-echo.png', tags: ['Thriller'], category: 'series' as const, description: 'A year after the death of her four-year-old son, Charlotte Fleming sees something that jolts her awake: Sebastion, alive and well in a stranger\'s social media post.' },
      { id: 29, title: 'Iron Man', year: 2025, src: '/assets/works/iron-man.png', tags: ['Drama'], description: 'The true story of the first ever Ironman champion with Down Syndrome and the father who would do anything to give his special-needs son a chance.' },

      // — Development: Films (new) —
      { id: 30, title: 'Our Daughter Has Disappeared', year: 2026, src: '/placeholder.svg', tags: ['True Crime'], category: 'film' as const, description: 'When Susan Powell goes missing in December of 2009, the media is swept up into the story. Based on the book "If I Can\'t Have You" by Gregg Olsen and Rebecca Morris.' },
      { id: 31, title: 'A Dentist to Die For', year: 2026, src: '/placeholder.svg', tags: ['True Crime'], category: 'film' as const, description: 'Dental surgeon Dr. James Ryan becomes dangerously obsessed with beauty queen Sarah Harris, manipulating her with surgical-grade narcotics.' },
      { id: 32, title: 'Feather', year: 2026, src: '/placeholder.svg', tags: ['Drama'], category: 'film' as const, description: 'The never before told story of Farrah Fawcett\'s life and legacy. Written by Vernon Scott, co-produced by Latigo Films.' },
      { id: 33, title: 'Murder-in-Law', year: 2026, src: '/placeholder.svg', tags: ['True Crime'], category: 'film' as const, description: 'A wealthy Miami matriarch. A bitter custody war. A hitman\'s bullet. What began as the cold-blooded assassination of a Florida law professor spiraled into one of the most shocking family-driven murder plots in America.' },
      { id: 34, title: 'Girls Can\'t Play Pool', year: 2026, src: '/placeholder.svg', tags: ['Drama'], category: 'film' as const, description: 'Heather is a gifted young pool hustler who lives on the edge of chaos. When two women decide to go on the road together, their lucrative partnership leads to a deep bond. Elisabeth Rohm to direct.' },

      // — Development: Series (new) —
      { id: 35, title: 'Undefeated', year: 2026, src: '/placeholder.svg', tags: ['Drama'], category: 'series' as const, description: 'Inside the Miami Dolphins\' 1972 comeback from three straight championship losses to an undefeated season. Based on Mike Freeman\'s book.' },
      { id: 36, title: 'Korean Espionage', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'When Korean Air Flight 858 is exploded by a North Korean agent, a former US soldier learns about his Japanese wife\'s darkest secret: she mentored the attacker.' },
      { id: 37, title: 'Relentless', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: '"Fatal Attraction" meets "Cape Fear." A sexy, propulsive thriller where one mistake in Mexico spirals out of control.' },
      { id: 38, title: 'Call Me Madam', year: 2026, src: '/placeholder.svg', tags: ['Drama'], category: 'series' as const, description: 'In 1961 Hot Springs, Arkansas, a savvy madam attempts to pass her high-end brothel to her Black protégé, challenging the town\'s racial barriers and mob control.' },
      { id: 39, title: 'Swap', year: 2026, src: '/placeholder.svg', tags: ['Drama'], category: 'series' as const, description: 'A show about contemporary marriage — love, sex, commitment, and what happens when three couples who aren\'t quite friends get a little drunk and swap.' },
      { id: 40, title: 'The Reid Brothers', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'State Police detective Conor Reid and Coast Guard Commander Tom Reid team up to track down a murderer in the seductive and wealthy enclave of the Hamptons.' },
      { id: 41, title: 'Southern Gothic', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'When Atlanta detective Laine Badder returns to her Appalachian hometown to bury her mother, unsettling details make her suspect it wasn\'t natural causes.' },
      { id: 42, title: 'Dispatch', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'When a late-night call ends in a fiery truck crash, a small-town dispatcher teams up with local police to uncover a deadly cover-up. Co-production with TF1 America.' },

      // — Development: Unscripted (new) —
      { id: 43, title: 'Horseplay', year: 2026, src: '/placeholder.svg', tags: ['Unscripted'], category: 'unscripted' as const, description: 'When a young hobby horse competitor is assaulted, a college athlete goes undercover to solve the mystery in the unique world of competitive hobby horsing.' },
      { id: 44, title: 'Nookietown', year: 2026, src: '/placeholder.svg', tags: ['Unscripted'], category: 'unscripted' as const, description: 'When an exhausted housewife asks her divorced best friend to sleep with her husband, what starts as a joke becomes an opportunity. Based on V.C. Chickering\'s novel.' },
    ] as MediaItem[],
    fr: [
      // — Drame —
      { id: 1, title: 'Margret & Stevie', year: 2026, src: '/assets/works/margret-stevie.png', tags: ['Drame'], category: 'film' as const, description: 'Les éditeurs se pressent pour réécrire l\'héritage de Margret Rey, co-créatrice de Curious George — mais les souvenirs de la guerre resurgissent. Avec Shirley MacLaine, réalisé par Matthew Weiner.' },
      { id: 2, title: 'Out for Love', year: 2026, src: '/assets/works/out-for-love.png', tags: ['Drame'], description: 'Ce qui se passe quand le désir refuse de suivre les règles.' },
      { id: 3, title: 'Ruby Falls', year: 2026, src: '/assets/works/ruby-falls.png', tags: ['Drame'], description: 'Une jeune actrice arrive à Los Angeles espérant découvrir les secrets du père qui l\'a abandonnée dans une grotte.' },
      { id: 4, title: 'Sister\'s Daughter', year: 2026, src: '/assets/works/sisters-daughter.png', tags: ['Drame'], description: 'Liens de sang, secrets enfouis, le poids de ce qui n\'a jamais été dit.' },
      { id: 5, title: 'The Lobotomist\'s Wife', year: 2026, src: '/assets/works/lobotomist-wife.png', tags: ['Drame'], category: 'series' as const, description: 'Une militante de la santé mentale tombe amoureuse d\'un pionnier radical de la lobotomie, pour découvrir que son "remède miracle" mène à des résultats horrifiants.' },
      { id: 6, title: 'Passing Love', year: 2026, src: '/assets/works/passing-love.png', tags: ['Drame'], description: 'Quand une femme découvre que sa mère a gardé la vérité de sa naissance secrète, elle voyage à Paris à la recherche de celle qui l\'a abandonnée.' },
      { id: 7, title: 'Two\'s Company', year: 2025, src: '/assets/works/twos-company.png', tags: ['Drame'], category: 'series' as const, description: 'D\'une enfance brisée aux sommets de la célébrité, Suzanne Somers se bat pour sa voix et son héritage.' },
      { id: 8, title: 'Diamonds and Deadlines', year: 2026, src: '/assets/works/diamonds-and-deadlines.png', tags: ['Drame'], category: 'series' as const, description: 'L\'histoire vraie de Miriam Leslie, qui a conquis le sommet du monde de l\'édition et légué sa fortune aux suffragettes.' },
      { id: 9, title: 'Flower Girl', year: 2025, src: '/assets/works/flower-girl.png', tags: ['Drame'], category: 'film' as const, description: 'L\'histoire de Virginia Cherrill, l\'actrice principale de "Les Lumières de la ville" — sur les conséquences de son refus des avances de Chaplin.' },
      { id: 10, title: 'By Midnight', year: 2025, src: '/assets/works/by-midnight.png', tags: ['Drame'], description: 'En arrivant dans une école d\'élite londonienne, une adolescente découvre une série de meurtres liés à une société secrète de vampires.' },
      { id: 11, title: 'Weekend Guests', year: 2025, src: '/assets/works/weekend-guests.png', tags: ['Thriller'], description: 'Cinq anciens amis d\'université se retrouvent dans un manoir isolé du Dorset pour un week-end qui tourne au mortel.' },
      { id: 12, title: 'A Love Like the Sun', year: 2026, src: '/assets/works/a-love-like-the-sun.png', tags: ['Drame'], description: 'Quand une entrepreneuse en soins capillaires et son meilleur ami font semblant d\'être en couple pour sauver son entreprise.' },
      { id: 13, title: 'Sunshine Sisters', year: 2025, src: '/assets/works/sunshine-sisters.png', tags: ['Drame'], description: 'L\'histoire de Ronni Sunshine, une star de cinéma vieillissante qui reçoit un diagnostic dévastateur et rassemble ses trois filles.' },
      { id: 14, title: 'Trans Electric', year: 2026, src: '/assets/works/trans-electric.png', tags: ['Drame'], description: 'Des excès du rock \'n\' roll des années 70, le parcours inspirant de Cidny Bullen pour trouver sa voix authentique.' },
      { id: 15, title: 'Rescue of Jerusalem', year: 2026, src: '/assets/works/rescue-of-jerusalem.png', tags: ['Drame'], description: 'En 701 av. J.-C., une alliance improbable entre le royaume de Juda et l\'empire koushite-égyptien monte une résistance audacieuse contre l\'Empire assyrien.' },
      { id: 16, title: 'Matador', year: 2025, src: '/assets/works/matador.png', tags: ['Drame'], description: 'Un gamin de Brooklyn fuit à Mexico et s\'entraîne sous un matador légendaire pour devenir le premier torero américain.' },

      // — Thriller —
      { id: 17, title: 'The Dating App Killer', year: 2025, src: '/assets/works/the-dating-app-killer.jpg', tags: ['Thriller'], description: 'Basé sur l\'histoire vraie de Monica White. Elisabeth Rohm a réalisé et produit aux côtés de Kara Feifer.' },
      { id: 18, title: 'Murder Your Darlings', year: 2026, src: '/assets/works/murder-your-darlings.jpg', tags: ['Thriller'], description: 'Quand une romancière tombe amoureuse d\'un auteur célèbre, elle se retrouve prise dans un réseau dangereux d\'obsession et de meurtre.' },
      { id: 19, title: 'If You Tell', year: 2026, src: '/assets/works/if-you-tell.png', tags: ['Thriller'], description: 'L\'histoire bouleversante de trois sœurs forcées de prendre la décision la plus difficile de leur vie : dénoncer leur mère meurtrière à la police.' },
      { id: 20, title: 'If Anything Happens to Me', year: 2026, src: '/assets/works/if-anything-happens-to-me.png', tags: ['Thriller'], description: 'Une lettre laissée derrière. Une piste qui mène vers l\'intérieur.' },
      { id: 21, title: 'Sleeping Angel', year: 2025, src: '/assets/works/sleeping-angel.png', tags: ['Thriller'], description: 'Tous les anges ne veillent pas sur vous.' },
      { id: 22, title: 'In Not So Loving Memory', year: 2025, src: '/assets/works/in-not-so-loving-memory.png', tags: ['Thriller'], description: 'Les morts ne restent pas toujours silencieux.' },
      { id: 23, title: 'Lie Detector', year: 2025, src: '/assets/works/lie-detector.png', tags: ['Thriller'], category: 'series' as const, description: 'Quand le FBI dévoile VERA, un détecteur de mensonges infaillible, l\'interrogatrice Kara Voss et son équipe doivent le mettre à l\'épreuve.' },
      { id: 24, title: 'Play Dead', year: 2025, src: '/assets/works/play-dead.png', tags: ['Thriller'], description: 'Un thriller paranormal à Savannah, Géorgie, où le surnaturel et l\'homicide se rencontrent autour de meurtres liés à la magie vaudou.' },
      { id: 25, title: 'Wife Stalker', year: 2025, src: '/assets/works/wife-stalker.png', tags: ['Thriller'], description: 'Basé sur le thriller psychologique de Lynne et Valerie Constantine. Réalisé par Elisabeth Rohm.' },
      { id: 26, title: 'Darkness Falls', year: 2025, src: '/assets/works/darkness-falls.png', tags: ['Thriller'], description: 'Quand les lumières s\'éteignent, la vraie histoire commence.' },
      { id: 27, title: 'Booth P.I.', year: 2025, src: '/assets/works/booth-pi.png', tags: ['Thriller'], description: 'Une belle du Sud devenue actrice new-yorkaise retourne sauver la plantation familiale et devient détective par accident.' },
      { id: 28, title: 'Silent Echo', year: 2025, src: '/assets/works/silent-echo.png', tags: ['Thriller'], category: 'series' as const, description: 'Un an après la mort de son fils de quatre ans, Charlotte Fleming voit quelque chose qui la secoue : Sebastion, vivant, dans la publication d\'un inconnu.' },
      { id: 29, title: 'Iron Man', year: 2025, src: '/assets/works/iron-man.png', tags: ['Drame'], description: 'L\'histoire vraie du premier champion Ironman trisomique et du père prêt à tout pour lui donner sa chance.' },

      // — Développement : Films (nouveaux) —
      { id: 30, title: 'Our Daughter Has Disappeared', year: 2026, src: '/placeholder.svg', tags: ['True Crime'], category: 'film' as const, description: 'Quand Susan Powell disparaît en décembre 2009, les médias s\'emparent de l\'affaire. Basé sur le livre de Gregg Olsen et Rebecca Morris.' },
      { id: 31, title: 'A Dentist to Die For', year: 2026, src: '/placeholder.svg', tags: ['True Crime'], category: 'film' as const, description: 'Le chirurgien-dentiste Dr. James Ryan devient dangereusement obsédé par la reine de beauté Sarah Harris.' },
      { id: 32, title: 'Feather', year: 2026, src: '/placeholder.svg', tags: ['Drame'], category: 'film' as const, description: 'L\'histoire jamais racontée de la vie et de l\'héritage de Farrah Fawcett. Écrit par Vernon Scott, coproduit par Latigo Films.' },
      { id: 33, title: 'Murder-in-Law', year: 2026, src: '/placeholder.svg', tags: ['True Crime'], category: 'film' as const, description: 'Une riche matriarche de Miami. Une guerre de garde amère. La balle d\'un tueur à gages. L\'un des complots meurtriers familiaux les plus choquants d\'Amérique.' },
      { id: 34, title: 'Girls Can\'t Play Pool', year: 2026, src: '/placeholder.svg', tags: ['Drame'], category: 'film' as const, description: 'Heather est une jeune arnaqueuse de billard douée qui vit au bord du chaos. Quand deux femmes prennent la route ensemble, leur partenariat mène à un lien profond.' },

      // — Développement : Séries (nouvelles) —
      { id: 35, title: 'Undefeated', year: 2026, src: '/placeholder.svg', tags: ['Drame'], category: 'series' as const, description: 'Le come-back des Miami Dolphins en 1972, de trois défaites consécutives en finale à une saison invaincue. Basé sur le livre de Mike Freeman.' },
      { id: 36, title: 'Korean Espionage', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'Quand le vol Korean Air 858 est détruit par un agent nord-coréen, un ancien soldat américain découvre le plus sombre secret de sa femme japonaise.' },
      { id: 37, title: 'Relentless', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: '"Liaison fatale" rencontre "Les Nerfs à vif." Un thriller sexy et propulsif où une erreur au Mexique dégénère.' },
      { id: 38, title: 'Call Me Madam', year: 2026, src: '/placeholder.svg', tags: ['Drame'], category: 'series' as const, description: 'En 1961 à Hot Springs, Arkansas, une tenancière avisée tente de transmettre son établissement à sa protégée noire, défiant les barrières raciales et la mafia.' },
      { id: 39, title: 'Swap', year: 2026, src: '/placeholder.svg', tags: ['Drame'], category: 'series' as const, description: 'Une série sur le mariage contemporain — l\'amour, le sexe, l\'engagement, et ce qui arrive quand trois couples se retrouvent un peu ivres.' },
      { id: 40, title: 'The Reid Brothers', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'Le détective Conor Reid et le commandant Tom Reid s\'associent pour traquer un meurtrier dans l\'enclave séduisante et fortunée des Hamptons.' },
      { id: 41, title: 'Southern Gothic', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'Quand la détective Laine Badder retourne dans sa ville natale des Appalaches pour enterrer sa mère, des détails troublants éveillent ses soupçons.' },
      { id: 42, title: 'Dispatch', year: 2026, src: '/placeholder.svg', tags: ['Thriller'], category: 'series' as const, description: 'Quand un appel nocturne se termine par un accident de camion, une dispatrice s\'associe à la police locale pour démasquer un complot mortel. Coproduction TF1 America.' },

      // — Développement : Non-scénarisé (nouveau) —
      { id: 43, title: 'Horseplay', year: 2026, src: '/placeholder.svg', tags: ['Non-scénarisé'], category: 'unscripted' as const, description: 'Quand une jeune compétitrice de hobby horse est agressée, une athlète universitaire enquête sous couverture dans le monde unique du hobby horsing compétitif.' },
      { id: 44, title: 'Nookietown', year: 2026, src: '/placeholder.svg', tags: ['Non-scénarisé'], category: 'unscripted' as const, description: 'Quand une mère au foyer épuisée demande à sa meilleure amie divorcée de coucher avec son mari, ce qui commence comme une blague devient une opportunité. Basé sur le roman de V.C. Chickering.' },
    ] as MediaItem[],
  },
}
