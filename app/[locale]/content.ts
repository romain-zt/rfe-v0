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
}

// ============================================
// MEDIA CONTENT (Language-aware)
// ============================================

export const MEDIA = {
  posters: {
    en: [
      // — Drama —
      { id: 1, title: 'Margret & Stevie', year: 2026, src: '/assets/works/margret-stevie.png', tags: ['Drama'], description: 'A sharp-edged friendship that becomes a lifeline. Starring Shirley MacLaine, directed by Matthew Weiner.' },
      { id: 2, title: 'Out for Love', year: 2026, src: '/assets/works/out-for-love.png', tags: ['Drama'], description: 'What happens when desire refuses to follow the rules.' },
      { id: 3, title: 'Ruby Falls', year: 2026, src: '/assets/works/ruby-falls.png', tags: ['Drama'], description: 'A woman returns to the place that shaped her — and finds it changed.' },
      { id: 4, title: 'Sister\'s Daughter', year: 2026, src: '/assets/works/sisters-daughter.png', tags: ['Drama'], description: 'Blood ties, buried secrets, and the weight of what was never said.' },
      { id: 5, title: 'The Lobotomist\'s Wife', year: 2026, src: '/assets/works/lobotomist-wife.png', tags: ['Drama'], description: 'The woman behind the man who silenced thousands.' },
      { id: 6, title: 'Passing Love', year: 2026, src: '/assets/works/passing-love.png', tags: ['Drama'], description: 'Two timelines, one city, the same ache.' },
      { id: 7, title: 'Two\'s Company', year: 2025, src: '/assets/works/twos-company.png', tags: ['Drama'], description: 'When the performance ends, who are you really?' },
      { id: 8, title: 'Diamonds and Deadlines', year: 2026, src: '/assets/works/diamonds-and-deadlines.png', tags: ['Drama'], description: 'Glamour, ambition, and the cost of being unforgettable.' },
      { id: 9, title: 'Flower Girl', year: 2025, src: '/assets/works/flower-girl.png', tags: ['Drama'], description: 'Innocence isn\'t lost. It\'s taken.' },
      { id: 10, title: 'By Midnight', year: 2025, src: '/assets/works/by-midnight.png', tags: ['Drama'], description: 'One night to make a choice that changes everything.' },
      { id: 11, title: 'Weekend Guests', year: 2025, src: '/assets/works/weekend-guests.png', tags: ['Drama'], description: 'Behind the perfect hosting, something is unraveling.' },
      { id: 12, title: 'A Love Like the Sun', year: 2026, src: '/assets/works/a-love-like-the-sun.png', tags: ['Drama'], description: 'A love that burns bright enough to blind.' },
      { id: 13, title: 'Sunshine Sisters', year: 2025, src: '/assets/works/sunshine-sisters.png', tags: ['Drama'], description: 'Three sisters, one summer, and the truth they\'ve been circling.' },
      { id: 14, title: 'Trans Electric', year: 2026, src: '/assets/works/trans-electric.png', tags: ['Drama'], description: 'Identity, voltage, transformation.' },
      { id: 15, title: 'Rescue of Jerusalem', year: 2026, src: '/assets/works/rescue-of-jerusalem.png', tags: ['Drama'], description: 'A story that spans centuries and refuses to be forgotten.' },
      { id: 16, title: 'Matador', year: 2025, src: '/assets/works/matador.png', tags: ['Drama'], description: 'Grace under pressure. Blood in the sand.' },

      // — Thriller —
      { id: 17, title: 'The Dating App Killer', year: 2025, src: '/assets/works/the-dating-app-killer.jpg', tags: ['Thriller'], description: 'She swiped right. He had other plans.' },
      { id: 18, title: 'Murder Your Darlings', year: 2026, src: '/assets/works/murder-your-darlings.jpg', tags: ['Thriller'], description: 'A writer discovers her fiction is becoming someone else\'s reality.' },
      { id: 19, title: 'If You Tell', year: 2026, src: '/assets/works/if-you-tell.png', tags: ['Thriller'], description: 'Silence kept them safe. Until it didn\'t.' },
      { id: 20, title: 'If Anything Happens to Me', year: 2026, src: '/assets/works/if-anything-happens-to-me.png', tags: ['Thriller'], description: 'A letter left behind. A trail that leads inward.' },
      { id: 21, title: 'Sleeping Angel', year: 2025, src: '/assets/works/sleeping-angel.png', tags: ['Thriller'], description: 'Not every angel is watching over you.' },
      { id: 22, title: 'In Not So Loving Memory', year: 2025, src: '/assets/works/in-not-so-loving-memory.png', tags: ['Thriller'], description: 'The dead don\'t always stay quiet.' },
      { id: 23, title: 'Lie Detector', year: 2025, src: '/assets/works/lie-detector.png', tags: ['Thriller'], description: 'The machine never lies. But the people operating it do.' },
      { id: 24, title: 'Play Dead', year: 2025, src: '/assets/works/play-dead.png', tags: ['Thriller'], description: 'She played dead to survive. Now she has to stay that way.' },
      { id: 25, title: 'Wife Stalker', year: 2025, src: '/assets/works/wife-stalker.png', tags: ['Thriller'], description: 'She wanted the perfect life. She decided to take hers.' },
      { id: 26, title: 'Darkness Falls', year: 2025, src: '/assets/works/darkness-falls.png', tags: ['Thriller'], description: 'When the lights go out, the real story begins.' },
      { id: 27, title: 'Booth P.I.', year: 2025, src: '/assets/works/booth-pi.png', tags: ['Thriller'], description: 'A private eye who works from a phone booth. Old school. Deadly serious.' },
      { id: 28, title: 'Silent Echo', year: 2025, src: '/assets/works/silent-echo.png', tags: ['Thriller'], description: 'Some voices carry further after they stop.' },
      { id: 29, title: 'Iron Man', year: 2025, src: '/assets/works/iron-man.png', tags: ['Thriller'], description: 'Not the one you\'re thinking of.' },
    ] as MediaItem[],
    fr: [
      // — Drame —
      { id: 1, title: 'Margret & Stevie', year: 2026, src: '/assets/works/margret-stevie.png', tags: ['Drame'], description: 'Une amitié tranchante qui devient une bouée de sauvetage. Avec Shirley MacLaine, réalisé par Matthew Weiner.' },
      { id: 2, title: 'Out for Love', year: 2026, src: '/assets/works/out-for-love.png', tags: ['Drame'], description: 'Ce qui se passe quand le désir refuse de suivre les règles.' },
      { id: 3, title: 'Ruby Falls', year: 2026, src: '/assets/works/ruby-falls.png', tags: ['Drame'], description: 'Une femme revient là où tout a commencé — et rien n\'est pareil.' },
      { id: 4, title: 'Sister\'s Daughter', year: 2026, src: '/assets/works/sisters-daughter.png', tags: ['Drame'], description: 'Liens de sang, secrets enfouis, le poids de ce qui n\'a jamais été dit.' },
      { id: 5, title: 'The Lobotomist\'s Wife', year: 2026, src: '/assets/works/lobotomist-wife.png', tags: ['Drame'], description: 'La femme derrière l\'homme qui a réduit des milliers au silence.' },
      { id: 6, title: 'Passing Love', year: 2026, src: '/assets/works/passing-love.png', tags: ['Drame'], description: 'Deux époques, une ville, la même douleur.' },
      { id: 7, title: 'Two\'s Company', year: 2025, src: '/assets/works/twos-company.png', tags: ['Drame'], description: 'Quand le spectacle s\'arrête, qui êtes-vous vraiment ?' },
      { id: 8, title: 'Diamonds and Deadlines', year: 2026, src: '/assets/works/diamonds-and-deadlines.png', tags: ['Drame'], description: 'Glamour, ambition, et le prix de l\'inoubliable.' },
      { id: 9, title: 'Flower Girl', year: 2025, src: '/assets/works/flower-girl.png', tags: ['Drame'], description: 'L\'innocence n\'est pas perdue. Elle est prise.' },
      { id: 10, title: 'By Midnight', year: 2025, src: '/assets/works/by-midnight.png', tags: ['Drame'], description: 'Une nuit pour faire un choix qui change tout.' },
      { id: 11, title: 'Weekend Guests', year: 2025, src: '/assets/works/weekend-guests.png', tags: ['Drame'], description: 'Derrière l\'hospitalité parfaite, quelque chose se défait.' },
      { id: 12, title: 'A Love Like the Sun', year: 2026, src: '/assets/works/a-love-like-the-sun.png', tags: ['Drame'], description: 'Un amour assez lumineux pour aveugler.' },
      { id: 13, title: 'Sunshine Sisters', year: 2025, src: '/assets/works/sunshine-sisters.png', tags: ['Drame'], description: 'Trois sœurs, un été, et la vérité qu\'elles contournent.' },
      { id: 14, title: 'Trans Electric', year: 2026, src: '/assets/works/trans-electric.png', tags: ['Drame'], description: 'Identité, voltage, transformation.' },
      { id: 15, title: 'Rescue of Jerusalem', year: 2026, src: '/assets/works/rescue-of-jerusalem.png', tags: ['Drame'], description: 'Une histoire qui traverse les siècles et refuse d\'être oubliée.' },
      { id: 16, title: 'Matador', year: 2025, src: '/assets/works/matador.png', tags: ['Drame'], description: 'La grâce sous la pression. Le sang dans le sable.' },

      // — Thriller —
      { id: 17, title: 'The Dating App Killer', year: 2025, src: '/assets/works/the-dating-app-killer.jpg', tags: ['Thriller'], description: 'Elle a swipé à droite. Il avait d\'autres plans.' },
      { id: 18, title: 'Murder Your Darlings', year: 2026, src: '/assets/works/murder-your-darlings.jpg', tags: ['Thriller'], description: 'Une écrivaine découvre que sa fiction devient la réalité de quelqu\'un d\'autre.' },
      { id: 19, title: 'If You Tell', year: 2026, src: '/assets/works/if-you-tell.png', tags: ['Thriller'], description: 'Le silence les protégeait. Jusqu\'à ce que ce ne soit plus le cas.' },
      { id: 20, title: 'If Anything Happens to Me', year: 2026, src: '/assets/works/if-anything-happens-to-me.png', tags: ['Thriller'], description: 'Une lettre laissée derrière. Une piste qui mène vers l\'intérieur.' },
      { id: 21, title: 'Sleeping Angel', year: 2025, src: '/assets/works/sleeping-angel.png', tags: ['Thriller'], description: 'Tous les anges ne veillent pas sur vous.' },
      { id: 22, title: 'In Not So Loving Memory', year: 2025, src: '/assets/works/in-not-so-loving-memory.png', tags: ['Thriller'], description: 'Les morts ne restent pas toujours silencieux.' },
      { id: 23, title: 'Lie Detector', year: 2025, src: '/assets/works/lie-detector.png', tags: ['Thriller'], description: 'La machine ne ment jamais. Mais ceux qui l\'opèrent, si.' },
      { id: 24, title: 'Play Dead', year: 2025, src: '/assets/works/play-dead.png', tags: ['Thriller'], description: 'Elle a fait la morte pour survivre. Maintenant elle doit le rester.' },
      { id: 25, title: 'Wife Stalker', year: 2025, src: '/assets/works/wife-stalker.png', tags: ['Thriller'], description: 'Elle voulait la vie parfaite. Elle a décidé de prendre la sienne.' },
      { id: 26, title: 'Darkness Falls', year: 2025, src: '/assets/works/darkness-falls.png', tags: ['Thriller'], description: 'Quand les lumières s\'éteignent, la vraie histoire commence.' },
      { id: 27, title: 'Booth P.I.', year: 2025, src: '/assets/works/booth-pi.png', tags: ['Thriller'], description: 'Un détective privé qui travaille depuis une cabine téléphonique. Vieille école. Mortellement sérieux.' },
      { id: 28, title: 'Silent Echo', year: 2025, src: '/assets/works/silent-echo.png', tags: ['Thriller'], description: 'Certaines voix portent plus loin après s\'être tues.' },
      { id: 29, title: 'Iron Man', year: 2025, src: '/assets/works/iron-man.png', tags: ['Thriller'], description: 'Pas celui auquel vous pensez.' },
    ] as MediaItem[],
  },
}
