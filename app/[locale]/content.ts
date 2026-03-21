/**
 * ============================================
 * COMPOSITE FILMS - CONTENT FILE
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
 * - MEDIA data (posters, frames, beforeAfter with both EN/FR versions)
 * - Legacy works/beforeAfterItems arrays
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

// Partners list (non-localized)
export const partners = [
  'Dior',
  'Arte',
  'BBC',
  'France Télévisions',
  'Disney+',
  'Apple TV+',
  'Netflix',
  'HBO',
  'MK2',
  'Smithsonian Channel',
  'National Geographic',
  'SBS',
  'Showtime',
  'RTBF',
  'Chanel',
  'ZDF',
  'Discovery',
  'NHK',
  'France TV Distribution',
  'KM Production'
]

export const partnersPrimary = [
  'Dior',
  'Arte',
  'BBC',
  'France Télévisions',
  'Disney+',
  'Apple TV',
  'Netflix',
  'HBO',
  'MK2',
  'Smithsonian Channel',
  'National Geographic',
  'SBS',
  'Showtime',
  'RTBF',
  'Chanel',
  'ZDF',
  'Discovery',
  'NHK',
  'Piece of Magic',
  'Entertainment',
  'Paramount+',
  'Pathe Live',
  'INA'
]

export const partnersSecondary = [
  'Live Pixel Technologies',
  'Agat Films & Cie',
  'Arrow Media',
  'Blakeway',
  'CinéTévé',
  'Tangerine Productions',
  'Stranger Than Fiction Films',
  'Groupe Elephant',
  'CPB Films',
  'Ville de Paris',
  'ANR',
  'Rhône-Alpes Cinéma',
  'Haut et Court',
  'Nexus Studios',
  'World Media Rights',
  'ZED',
  'Velvet Film',
  'GTV',
  'CNC',
  // 'Hauteville Productions',
  'Tohubohu',
  'Roche Productions',
  'Nilaya Productions',
  'Siècle Productions',
  'Sophie Dulac Distribution',
  'Chainsaw Europe',
  'Falabracks',
  'Artline Films',
  'Brother Film Co.',
  'Eddy',
  'Kuiv Productions',
  // 'Morgane Production',
  '72 Films',
  'Smuggler Entertainment',
]

// ============================================
// MEDIA CONTENT (Language-aware)
// ============================================

export const MEDIA = {
  posters: {
    en: [
      { id: 1, title: 'Vietnam: The War That Changed America', year: 2025, src: '/assets/works/affiches-restoration/1.VIETNAM APPLETV/vietnam_the_war_that_changed_america-431537327-large.jpg', tags: ['Colorization'], description: 'A comprehensive look at the Vietnam War and its lasting impact on America.', videoUrl: 'https://www.youtube.com/watch?v=SBoNrZ3JXy8' },
      { id: 2, title: '3000 Years of Longing', year: 2022, src: '/assets/works/affiches-restoration/2.GEORGE MILLER 3000 YEARS OF LONGING CINEMA/71-8Bp5EmsL.jpg', tags: ['Colorization'], description: 'George Miller\'s fantasy epic brought to stunning visual life.', videoUrl: 'https://www.youtube.com/watch?v=TWGvntl9itE' },
      { id: 3, title: 'WW2: From the Frontlines', year: 2023, src: '/assets/works/affiches-restoration/3.WW2 FROM THE FRONTLINES NETFLIX/world_war_ii_from_the_frontlines-510911490-large.jpg', tags: ['Colorization'], description: 'Restored and colorized WWII footage bringing history to life.', videoUrl: 'https://www.youtube.com/watch?v=dz1rTZE9xgE' },
      { id: 4, title: 'Maria by Callas', year: 2017, src: '/assets/works/affiches-restoration/4.MARIA BY CALLAS CINEMA/Maria by Callas Poster.jpg', tags: ['Colorization'], description: 'An intimate portrait of the legendary opera singer Maria Callas.', videoUrl: 'https://www.youtube.com/watch?v=3xmsGzhhDGE' },
      { id: 5, title: 'I Am Not Your Negro', year: 2016, src: '/assets/works/affiches-restoration/5.I AM NOT YOUR NEGRO CINEMA/540330.jpg', tags: ['Colorization'], description: 'James Baldwin\'s unfinished manuscript brought to screen by Raoul Peck.', videoUrl: 'https://www.youtube.com/watch?v=rNUYdgIyaPM' },
      { id: 6, title: 'JFK: One Day in America', year: 2023, src: '/assets/works/affiches-restoration/6.JFK ONE DAY IN AMERICA DISNEY/MV5BZDhhYjc4NWQtMWEwNi00MWRjLWJiMjktMjU5MDc3MTJlYmJiXkEyXkFqcGc@._V1_.jpg', tags: ['Colorization'], description: 'The story of JFK\'s assassination told through restored archival footage.', videoUrl: 'https://www.youtube.com/watch?v=0QB9fmz8loc' },
      { id: 7, title: 'The Promise', year: 2025, src: '/assets/works/affiches-restoration/7.THE PROMISE CINEMA/MV5BOWNmMTFlMmEtYzk1OS00YTM5LTk4OWYtNjYxMmU2MWNmNzZlXkEyXkFqcGc@._V1_.jpg', tags: ['Colorization'], description: 'A powerful story set during the Armenian Genocide.', videoUrl: 'https://www.youtube.com/watch?v=HAQnqNF0SJY' },
      { id: 8, title: 'Hiroshima: Race to the Apocalypse', year: 2025, src: '/assets/works/affiches-restoration/8.HIROSHIMA THE RACE TO THE APOCALYPSE TV/Affiche-def-VA-vertical-titre-logo.png', tags: ['Colorization'], description: 'The untold story of the race to develop the atomic bomb.', videoUrl: 'https://www.youtube.com/watch?v=lVstKEqzIgk' },
      { id: 9, title: 'Elton John: Never Too Late', year: 2024, src: '/assets/works/affiches-restoration/10.ELTON DISNEY/eltonntl_27x40_poster_laurels_93_b30505fc.jpeg', tags: ['Colorization'], description: 'An intimate look at the life and career of Elton John.', videoUrl: 'https://www.youtube.com/watch?v=fQGf_nJ1E9w' },
      { id: 10, title: 'The Synanon Fix', year: 2024, src: '/assets/works/affiches-restoration/11.SYNANON FIX HBO/f63b4df9adc8546961bc1e7f2b8b05d0.jpg', tags: ['Colorization'], description: 'The rise and fall of the controversial Synanon organization.', videoUrl: 'https://www.youtube.com/watch?v=Y8Z8xMmly1M' },
      { id: 11, title: 'Eichmann: The Lost Tapes', year: 2023, src: '/assets/works/affiches-restoration/12.EICHMANN THE LOST TAPES TV/MV5BNDc4NTVlNTctM2VlYi00MTQyLTlhNjgtNDA0ODgyNzA2NTVhXkEyXkFqcGc@._V1_.jpg', tags: ['Colorization'], description: 'Newly discovered recordings reveal the mind of a war criminal.', videoUrl: 'https://www.youtube.com/watch?v=wnXSUnWw0EU' },
      { id: 12, title: 'Exterminate All the Brutes', year: 2022, src: '/assets/works/affiches-restoration/13.EXTERMINATE ALL THE BRUTES HBO/MV5BNDY3NjRjM2ItOGNjMS00ZTdjLTliOTktMGQwNDhlODY3NGNmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', tags: ['Colorization'], description: 'Raoul Peck\'s exploration of colonialism and genocide.', videoUrl: 'https://www.youtube.com/watch?v=bO6dQkVBB0c' },
      
      { id: 13, title: 'Callas - Paris, 1958', year: 2023, src: '/assets/works/affiches-documentary/1.CALLAS PARIS 1958/MCallas_Poster_1S_EN_RGB_Excl.jpg', tags: ['Documentary Production'], description: 'A historic opera performance by Maria Callas in Paris, restored and colorized.', videoUrl: 'https://www.youtube.com/watch?v=GzTMIoRpmF8' },
      { id: 14, title: 'Véronique', year: 2026, src: '/assets/works/affiches-documentary/2.VERONIQUE CINEMA/veronique.jpg', tags: ['Documentary Production'], description: 'An intimate documentary portrait.', videoUrl: 'https://www.youtube.com/watch?v=mfoVasExHZY' },
      { id: 15, title: 'If You Are a Man', year: 2022, src: '/assets/works/affiches-documentary/3.IF YOU ARE A MAN CINEMA/si-tu-es-un-homme.jpg', tags: ['Documentary Production'], description: 'A powerful documentary exploring masculinity and identity.', videoUrl: 'https://www.youtube.com/watch?v=erLZ36Y3qBk' },
      { id: 16, title: 'Food Fraud', year: 2022, src: '/assets/works/affiches-documentary/4.FRAUDE ALIMENTAIRE TV/jpg.jpg', tags: ['Documentary Production'], description: 'An investigation into the global food fraud industry.', videoUrl: 'https://www.youtube.com/watch?v=FQPfsz4Vp08' },
      { id: 17, title: 'When the Sea Threatens the Cities', year: 2022, src: '/assets/works/affiches-documentary/5.QUAND LA MER MENACE LES VILLES TV/1718185125895.jpeg', tags: ['Documentary Production'], description: 'A documentary on rising sea levels and coastal cities at risk.', videoUrl: 'https://www.youtube.com/watch?v=CBS57Cv4gvc' },
    ] as MediaItem[],
    fr: [
      { id: 1, title: 'Vietnam: La Guerre qui a Changé l\'Amérique', year: 2025, src: '/assets/works/affiches-restoration/1.VIETNAM APPLETV/vietnam_the_war_that_changed_america-431537327-large.jpg', tags: ['Colorisation'], description: 'Un regard complet sur la guerre du Vietnam et son impact durable sur l\'Amérique.', videoUrl: 'https://www.youtube.com/watch?v=SBoNrZ3JXy8' },
      { id: 2, title: '3000 Ans à T\'Attendre', year: 2022, src: '/assets/works/affiches-restoration/2.GEORGE MILLER 3000 YEARS OF LONGING CINEMA/71-8Bp5EmsL.jpg', tags: ['Colorisation'], description: 'L\'épopée fantastique de George Miller sublimée visuellement.', videoUrl: 'https://www.youtube.com/watch?v=TWGvntl9itE' },
      { id: 3, title: 'Seconde Guerre Mondiale: Depuis les Lignes de Front', year: 2023, src: '/assets/works/affiches-restoration/3.WW2 FROM THE FRONTLINES NETFLIX/world_war_ii_from_the_frontlines-510911490-large.jpg', tags: ['Colorisation'], description: 'Images de la Seconde Guerre mondiale restaurées et colorisées.', videoUrl: 'https://www.youtube.com/watch?v=dz1rTZE9xgE' },
      { id: 4, title: 'Maria by Callas', year: 2017, src: '/assets/works/affiches-restoration/4.MARIA BY CALLAS CINEMA/Maria by Callas Poster.jpg', tags: ['Colorisation'], description: 'Un portrait intime de la légendaire cantatrice Maria Callas.', videoUrl: 'https://www.youtube.com/watch?v=3xmsGzhhDGE' },
      { id: 5, title: 'I Am Not Your Negro', year: 2016, src: '/assets/works/affiches-restoration/5.I AM NOT YOUR NEGRO CINEMA/540330.jpg', tags: ['Colorisation'], description: 'Le manuscrit inachevé de James Baldwin porté à l\'écran par Raoul Peck.', videoUrl: 'https://www.youtube.com/watch?v=rNUYdgIyaPM' },
      { id: 6, title: 'JFK: Un Jour en Amérique', year: 2023, src: '/assets/works/affiches-restoration/6.JFK ONE DAY IN AMERICA DISNEY/MV5BZDhhYjc4NWQtMWEwNi00MWRjLWJiMjktMjU5MDc3MTJlYmJiXkEyXkFqcGc@._V1_.jpg', tags: ['Colorisation'], description: 'L\'histoire de l\'assassinat de JFK racontée à travers des archives restaurées.', videoUrl: 'https://www.youtube.com/watch?v=0QB9fmz8loc' },
      { id: 7, title: 'La Promesse', year: 2025, src: '/assets/works/affiches-restoration/7.THE PROMISE CINEMA/MV5BOWNmMTFlMmEtYzk1OS00YTM5LTk4OWYtNjYxMmU2MWNmNzZlXkEyXkFqcGc@._V1_.jpg', tags: ['Colorisation'], description: 'Une histoire puissante sur le génocide arménien.', videoUrl: 'https://www.youtube.com/watch?v=HAQnqNF0SJY' },
      { id: 8, title: 'Hiroshima: La Course à l\'Apocalypse', year: 2025, src: '/assets/works/affiches-restoration/8.HIROSHIMA THE RACE TO THE APOCALYPSE TV/Affiche-def-VA-vertical-titre-logo.png', tags: ['Colorisation'], description: 'L\'histoire méconnue de la course au développement de la bombe atomique.', videoUrl: 'https://www.youtube.com/watch?v=lVstKEqzIgk' },
      { id: 9, title: 'Elton John: Never Too Late', year: 2024, src: '/assets/works/affiches-restoration/10.ELTON DISNEY/eltonntl_27x40_poster_laurels_93_b30505fc.jpeg', tags: ['Colorisation'], description: 'Un regard intime sur la vie et la carrière d\'Elton John.', videoUrl: 'https://www.youtube.com/watch?v=fQGf_nJ1E9w' },
      { id: 10, title: 'The Synanon Fix', year: 2024, src: '/assets/works/affiches-restoration/11.SYNANON FIX HBO/f63b4df9adc8546961bc1e7f2b8b05d0.jpg', tags: ['Colorisation'], description: 'L\'ascension et la chute de l\'organisation controversée Synanon.', videoUrl: 'https://www.youtube.com/watch?v=Y8Z8xMmly1M' },
      { id: 11, title: 'Eichmann: Les Enregistrements Perdus', year: 2023, src: '/assets/works/affiches-restoration/12.EICHMANN THE LOST TAPES TV/MV5BNDc4NTVlNTctM2VlYi00MTQyLTlhNjgtNDA0ODgyNzA2NTVhXkEyXkFqcGc@._V1_.jpg', tags: ['Colorisation'], description: 'Des enregistrements récemment découverts révèlent l\'esprit d\'un criminel de guerre.', videoUrl: 'https://www.youtube.com/watch?v=wnXSUnWw0EU' },
      { id: 12, title: 'Exterminate All the Brutes', year: 2022, src: '/assets/works/affiches-restoration/13.EXTERMINATE ALL THE BRUTES HBO/MV5BNDY3NjRjM2ItOGNjMS00ZTdjLTliOTktMGQwNDhlODY3NGNmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', tags: ['Colorisation'], description: 'L\'exploration de Raoul Peck sur le colonialisme et le génocide.', videoUrl: 'https://www.youtube.com/watch?v=bO6dQkVBB0c' },
      
      { id: 13, title: 'Callas - Paris, 1958', year: 2023, src: '/assets/works/affiches-documentary/1.CALLAS PARIS 1958/MCallas_Poster_1S_FR_25&26NOV.jpg', tags: ['Production Documentaire'], description: 'Une performance historique de Maria Callas à Paris, restaurée et colorisée.', videoUrl: 'https://www.youtube.com/watch?v=GzTMIoRpmF8' },
      { id: 14, title: 'Véronique', year: 2026, src: '/assets/works/affiches-documentary/2.VERONIQUE CINEMA/veronique.jpg', tags: ['Production Documentaire'], description: 'Un portrait documentaire intime.', videoUrl: 'https://www.youtube.com/watch?v=mfoVasExHZY' },
      { id: 15, title: 'Si Tu Es un Homme', year: 2022, src: '/assets/works/affiches-documentary/3.IF YOU ARE A MAN CINEMA/si-tu-es-un-homme.jpg', tags: ['Production Documentaire'], description: 'Un documentaire puissant explorant la masculinité et l\'identité.', videoUrl: 'https://www.youtube.com/watch?v=erLZ36Y3qBk' },
      { id: 16, title: 'Fraude Alimentaire', year: 2022, src: '/assets/works/affiches-documentary/4.FRAUDE ALIMENTAIRE TV/jpg.jpg', tags: ['Production Documentaire'], description: 'Une enquête sur l\'industrie mondiale de la fraude alimentaire.', videoUrl: 'https://www.youtube.com/watch?v=FQPfsz4Vp08' },
      { id: 17, title: 'Quand la Mer Menace les Villes', year: 2022, src: '/assets/works/affiches-documentary/5.QUAND LA MER MENACE LES VILLES TV/1718185125895.jpeg', tags: ['Production Documentaire'], description: 'Un documentaire sur la montée des eaux et les villes côtières menacées.', videoUrl: 'https://www.youtube.com/watch?v=CBS57Cv4gvc' },
    ] as MediaItem[],
  },
  frames: {
    en: [
      { id: 1, title: 'Le Voyage dans la Lune - Iconic Moon Shot', year: 1902, src: '/placeholder.jpg', tags: ['Frame'] },
      { id: 2, title: 'Metropolis - Maria Robot Reveal', year: 1927, src: '/placeholder.jpg', tags: ['Frame'] },
      { id: 3, title: 'Nosferatu - Shadow Ascent', year: 1922, src: '/placeholder.jpg', tags: ['Frame'] },
      { id: 4, title: 'Paris Streets - Belle Époque', year: 1900, src: '/placeholder.jpg', tags: ['Frame'] },
    ] as MediaItem[],
    fr: [
      { id: 1, title: 'Le Voyage dans la Lune - Plan Lunaire Iconique', year: 1902, src: '/placeholder.jpg', tags: ['Image'] },
      { id: 2, title: 'Metropolis - Révélation du Robot Maria', year: 1927, src: '/placeholder.jpg', tags: ['Image'] },
      { id: 3, title: 'Nosferatu - L\'Ombre qui Monte', year: 1922, src: '/placeholder.jpg', tags: ['Image'] },
      { id: 4, title: 'Rues de Paris - Belle Époque', year: 1900, src: '/placeholder.jpg', tags: ['Image'] },
    ] as MediaItem[],
  },
  beforeAfter: {
    en: [
      { id: 1, title: 'Le Voyage dans la Lune', year: 1902, src: '/placeholder.jpg', tags: ['Colorization', 'Colorization'], description: 'Méliès\' masterpiece brought back to vibrant life.' },
      { id: 2, title: 'Paris 1900', year: 1900, src: '/placeholder.jpg', tags: ['Colorization', 'Colorization'], description: 'Belle Époque Paris in full color.' },
      { id: 3, title: 'They Shall Not Grow Old', year: 1914, src: '/placeholder.jpg', tags: ['Colorization', 'Colorization'], description: 'WWI footage transformed for a new generation.' },
      { id: 4, title: 'The Making of Cinema', year: 2023, src: '/placeholder.jpg', tags: ['Documentary Production'], description: 'An intimate look at the art of film restoration.' },
    ] as MediaItem[],
    fr: [
      { id: 1, title: 'Le Voyage dans la Lune', year: 1902, src: '/placeholder.jpg', tags: ['Colorisation', 'Colorisation'], description: 'Le chef-d\'œuvre de Méliès ramené à la vie.' },
      { id: 2, title: 'Paris 1900', year: 1900, src: '/placeholder.jpg', tags: ['Colorisation', 'Colorisation'], description: 'Le Paris de la Belle Époque en couleurs.' },
      { id: 3, title: 'They Shall Not Grow Old', year: 1914, src: '/placeholder.jpg', tags: ['Colorisation', 'Colorisation'], description: 'Images de la Première Guerre mondiale pour une nouvelle génération.' },
      { id: 4, title: 'L\'Art du Cinéma', year: 2023, src: '/placeholder.jpg', tags: ['Colorisation', 'Colorisation'], description: 'Un regard intime sur l\'art de la restauration cinématographique.' },
    ] as MediaItem[],
  },
}

// Works data (legacy - kept for compatibility)
export const works = [
  {
    id: 1,
    title: 'Le Voyage dans la Lune',
    year: 1902,
    tags: ['Colorization', 'Colorization'],
    description: {
      en: 'Georges Méliès\' iconic silent film restored to its original hand-painted glory.',
      fr: 'Le film muet emblématique de Georges Méliès restauré dans sa splendeur peinte à la main.',
    },
  },
  {
    id: 2,
    title: 'Metropolis',
    year: 1927,
    tags: ['Colorization'],
    description: {
      en: 'Fritz Lang\'s masterpiece with recovered footage from Buenos Aires.',
      fr: 'Le chef-d\'œuvre de Fritz Lang avec des images récupérées de Buenos Aires.',
    },
  },
  {
    id: 3,
    title: 'La Grande Illusion',
    year: 1937,
    tags: ['Colorization'],
    description: {
      en: 'Jean Renoir\'s anti-war classic in stunning 4K restoration.',
      fr: 'Le classique anti-guerre de Jean Renoir en restauration 4K époustouflante.',
    },
  },
  {
    id: 4,
    title: 'Les Enfants du Paradis',
    year: 1945,
    tags: ['Colorization'],
    description: {
      en: 'Marcel Carné\'s poetic realism masterpiece restored frame by frame.',
      fr: 'Le chef-d\'œuvre du réalisme poétique de Marcel Carné restauré image par image.',
    },
  },
  {
    id: 5,
    title: 'They Shall Not Grow Old',
    year: 1914,
    tags: ['Colorization', 'Colorization'],
    description: {
      en: 'WWI archival footage transformed with modern colorization techniques.',
      fr: 'Images d\'archives de la Première Guerre mondiale transformées par des techniques de colorisation modernes.',
    },
  },
  {
    id: 6,
    title: 'Nosferatu',
    year: 1922,
    tags: ['Colorization'],
    description: {
      en: 'F.W. Murnau\'s vampire classic with enhanced tinting restoration.',
      fr: 'Le classique vampirique de F.W. Murnau avec restauration des teintes améliorée.',
    },
  },
  {
    id: 7,
    title: 'The Cabinet of Dr. Caligari',
    year: 1920,
    tags: ['Colorization'],
    description: {
      en: 'German expressionist cinema preserved in its surreal beauty.',
      fr: 'Le cinéma expressionniste allemand préservé dans sa beauté surréaliste.',
    },
  },
  {
    id: 8,
    title: 'Paris 1900',
    year: 1900,
    tags: ['Colorization'],
    description: {
      en: 'Belle Époque Paris brought to life through careful colorization.',
      fr: 'Le Paris de la Belle Époque ramené à la vie par une colorisation minutieuse.',
    },
  },
  {
    id: 9,
    title: 'The Battle of the Somme',
    year: 1916,
    tags: ['Colorization', 'Colorization'],
    description: {
      en: 'Historic WWI documentary with restored and colorized sequences.',
      fr: 'Documentaire historique de la Première Guerre mondiale avec séquences restaurées et colorisées.',
    },
  },
  {
    id: 10,
    title: 'Un Chien Andalou',
    year: 1929,
    tags: ['Colorization'],
    description: {
      en: 'Buñuel and Dalí\'s surrealist short film in pristine condition.',
      fr: 'Le court métrage surréaliste de Buñuel et Dalí en état impeccable.',
    },
  },
  {
    id: 11,
    title: 'L\'Arrivée d\'un train',
    year: 1896,
    tags: ['Colorization'],
    description: {
      en: 'The Lumière Brothers\' legendary film restored to its original clarity.',
      fr: 'Le film légendaire des frères Lumière restauré dans sa clarté originale.',
    },
  },
  {
    id: 12,
    title: 'Napoleon',
    year: 1927,
    tags: ['Colorization'],
    description: {
      en: 'Abel Gance\'s epic with reconstructed triptych sequences.',
      fr: 'L\'épopée d\'Abel Gance avec séquences en triptyque reconstituées.',
    },
  },
]

// Before/After gallery (legacy - kept for compatibility)
export const beforeAfterItems = [
  {
    id: 1,
    title: 'Le Voyage dans la Lune',
    year: 1902,
  },
  {
    id: 2,
    title: 'Paris 1900',
    year: 1900,
  },
  {
    id: 3,
    title: 'They Shall Not Grow Old',
    year: 1914,
  },
  {
    id: 4,
    title: 'The Battle of the Somme',
    year: 1916,
  },
]
