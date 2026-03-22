/**
 * ============================================
 * EXPORT I18N TO CSV - Migration Helper
 * ============================================
 * 
 * Run: npx ts-node scripts/export-i18n-to-csv.ts
 * Or:  npx tsx scripts/export-i18n-to-csv.ts
 * 
 * This script exports current content.ts data to CSV files
 * that can be imported into Google Sheets.
 * 
 * Output files (in scripts/output/):
 * - strings_en.csv, strings_fr.csv
 * - about_en.csv, about_fr.csv  
 * - team_en.csv, team_fr.csv
 * - awardsNews_en.csv, awardsNews_fr.csv
 * - contact_en.csv, contact_fr.csv
 * - ourWork_en.csv, ourWork_fr.csv
 * ============================================
 */

import * as fs from 'fs'
import * as path from 'path'

// ============================================
// DATA (copied from content.ts for standalone execution)
// ============================================

const dictionary = {
  en: {
    nav: {
      home: 'Home',
      news: 'News',
      ourWork: 'Our Work',
      ourTeam: 'Our Team',
      aboutUs: 'About Us',
      contact: 'Contact',
    },
    hero: {
      headline: 'Bringing the past back into the present.',
      subheadline: 'Film Restoration & Preservation',
      paragraph: 'RFE restores and colorizes archival cinema, building a bridge between historical memory and contemporary audiences — through a decade of craft and cutting-edge technology.',
      tagline: "The world's leading production studio dedicated to the archival preservation and remasterization of cinema, live performance, and cultural heritage.",
      cta: 'Our Work',
    },
    gesture: {
      title: 'The Gesture',
      text: 'Every frame carries memory. Our craft lies in the delicate balance between preservation and revelation—honoring the original intent while breathing new life into works that shaped our collective imagination. We approach each project as custodians of time, understanding that these images belong not only to their creators but to generations yet to come.',
    },
    beforeAfter: {
      title: 'Restoration',
      before: 'Before',
      after: 'After',
      restorationTitle: 'Restoration & Colorization',
      documentaryTitle: 'Documentary Production',
    },
    partners: {
      title: 'Partners & Clients',
    },
    awardsNews: {
      title: 'Awards & News',
      readMore: 'Read more',
    },
    footer: {
      contact: 'Contact',
      followUs: 'Follow Us',
      rights: '© 2024 RFE. All rights reserved.',
    },
    work: {
      title: 'Our Work',
      subtitle: 'A selection of our restoration and documentary production projects.',
      all: 'All',
      restoration: 'Restoration & Colorization',
      documentaryProduction: 'Documentary Production',
      view: 'View',
      close: 'Close',
    },
    news: {
      title: 'News',
      subtitle: 'Latest updates from our studio.',
    },
    team: {
      title: 'Our Team',
      subtitle: 'The artisans behind the craft.',
    },
    about: {
      title: 'About Us',
    },
    contactPage: {
      title: 'Contact',
      subtitle: 'We would love to hear from you.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      address: 'Address',
      phone: 'Phone',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      news: 'Actualités',
      ourWork: 'Nos Travaux',
      ourTeam: 'Notre Équipe',
      aboutUs: 'À Propos',
      contact: 'Contact',
    },
    hero: {
      headline: 'Rendre le passé à nouveau visible.',
      subheadline: 'Restauration & Préservation Cinématographique',
      paragraph: "RFE restaure et colorise les archives du cinéma, créant un pont entre la mémoire de l'histoire et le regard d'aujourd'hui — grâce à dix ans de savoir-faire et des technologies de pointe.",
      tagline: 'Le studio de production mondial leader dédié à la préservation archivistique et à la remastérisation du cinéma, des spectacles vivants et du patrimoine culturel.',
      cta: 'Nos Travaux',
    },
    gesture: {
      title: 'Le Geste',
      text: "Chaque image porte une mémoire. Notre métier réside dans l'équilibre délicat entre préservation et révélation—honorer l'intention originale tout en insufflant une nouvelle vie aux œuvres qui ont façonné notre imaginaire collectif. Nous abordons chaque projet en gardiens du temps, conscients que ces images n'appartiennent pas seulement à leurs créateurs mais aux générations à venir.",
    },
    beforeAfter: {
      title: 'Restauration',
      before: 'Avant',
      after: 'Après',
      restorationTitle: 'Restauration & Colorisation',
      documentaryTitle: 'Production Documentaire',
    },
    partners: {
      title: 'Partenaires & Clients',
    },
    awardsNews: {
      title: 'Prix & Actualités',
      readMore: 'Lire la suite',
    },
    footer: {
      contact: 'Contact',
      followUs: 'Suivez-nous',
      rights: '© 2024 RFE. Tous droits réservés.',
    },
    work: {
      title: 'Nos Travaux',
      subtitle: 'Une sélection de nos projets de restauration et production documentaire.',
      all: 'Tous',
      restoration: 'Restauration & Colorisation',
      documentaryProduction: 'Production Documentaire',
      view: 'Voir',
      close: 'Fermer',
    },
    news: {
      title: 'Actualités',
      subtitle: 'Les dernières nouvelles de notre studio.',
    },
    team: {
      title: 'Notre Équipe',
      subtitle: 'Les artisans derrière le métier.',
    },
    about: {
      title: 'À Propos',
    },
    contactPage: {
      title: 'Contact',
      subtitle: 'Nous serions ravis de vous entendre.',
      name: 'Nom',
      email: 'Email',
      message: 'Message',
      send: 'Envoyer',
      address: 'Adresse',
      phone: 'Téléphone',
    },
  },
}

const aboutContent = {
  en: [
    "RFE was founded in Paris in 1998 with a singular mission: to preserve and restore the moving images that define our shared cultural memory. What began as a small laboratory dedicated to French silent cinema has grown into a globally recognized studio, trusted by archives, studios, and cultural institutions worldwide.",
    "Our approach combines deep respect for original artistic intent with the most advanced restoration technologies available. Every scratch removed, every frame stabilized, every color calibrated is guided by rigorous historical research and an unwavering commitment to authenticity. We do not simply clean images—we listen to them, understand their context, and restore them to speak clearly once more.",
    "Today, our team of archivists, colorists, and restoration artists continues this work from our studios in Paris and Lyon. We remain independent, allowing us to take the time each project deserves. For us, restoration is not an industry—it is a responsibility.",
  ],
  fr: [
    "RFE a été fondée à Paris en 1998 avec une mission singulière : préserver et restaurer les images animées qui définissent notre mémoire culturelle commune. Ce qui a commencé comme un petit laboratoire dédié au cinéma muet français est devenu un studio mondialement reconnu, auquel font confiance les archives, les studios et les institutions culturelles du monde entier.",
    "Notre approche combine un profond respect de l'intention artistique originale avec les technologies de restauration les plus avancées disponibles. Chaque rayure effacée, chaque image stabilisée, chaque couleur calibrée est guidée par une recherche historique rigoureuse et un engagement indéfectible envers l'authenticité. Nous ne nettoyons pas simplement les images—nous les écoutons, comprenons leur contexte, et les restaurons pour qu'elles parlent à nouveau clairement.",
    "Aujourd'hui, notre équipe d'archivistes, de coloristes et d'artistes de la restauration poursuit ce travail depuis nos studios de Paris et Lyon. Nous restons indépendants, ce qui nous permet de prendre le temps que chaque projet mérite. Pour nous, la restauration n'est pas une industrie—c'est une responsabilité.",
  ],
}

const teamMembers = [
  {
    id: 1,
    name: 'Marie-Claire Dubois',
    role: {
      en: 'Founder & Creative Director',
      fr: 'Fondatrice & Directrice Créative',
    },
    bio: {
      en: "With over 25 years in film restoration, Marie-Claire founded RFE with a vision to preserve cinema's most precious works for future generations.",
      fr: 'Avec plus de 25 ans dans la restauration cinématographique, Marie-Claire a fondé RFE avec la vision de préserver les œuvres les plus précieuses du cinéma pour les générations futures.',
    },
  },
  {
    id: 2,
    name: 'Jean-Pierre Martin',
    role: {
      en: 'Technical Director',
      fr: 'Directeur Technique',
    },
    bio: {
      en: 'Jean-Pierre oversees all technical aspects of our restoration pipeline, combining traditional craftsmanship with cutting-edge digital technology.',
      fr: 'Jean-Pierre supervise tous les aspects techniques de notre pipeline de restauration, combinant artisanat traditionnel et technologie numérique de pointe.',
    },
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    role: {
      en: 'Head of Colorization',
      fr: 'Directrice de la Colorisation',
    },
    bio: {
      en: 'Sophie leads our colorization team, bringing historical accuracy and artistic sensitivity to every project through extensive archival research.',
      fr: 'Sophie dirige notre équipe de colorisation, apportant exactitude historique et sensibilité artistique à chaque projet grâce à une recherche archivistique approfondie.',
    },
  },
  {
    id: 4,
    name: 'Thomas Bergmann',
    role: {
      en: 'Senior Restoration Artist',
      fr: 'Artiste Restaurateur Senior',
    },
    bio: {
      en: 'Thomas specializes in frame-by-frame restoration of damaged footage, with particular expertise in nitrate film preservation.',
      fr: 'Thomas se spécialise dans la restauration image par image de séquences endommagées, avec une expertise particulière dans la préservation des films nitrate.',
    },
  },
  {
    id: 5,
    name: 'Elena Rossi',
    role: {
      en: 'Archive Partnerships Manager',
      fr: 'Responsable des Partenariats Archives',
    },
    bio: {
      en: 'Elena manages our relationships with film archives and cultural institutions worldwide, ensuring access to rare materials.',
      fr: "Elena gère nos relations avec les archives cinématographiques et les institutions culturelles du monde entier, assurant l'accès aux matériaux rares.",
    },
  },
  {
    id: 6,
    name: 'Alexandre Chen',
    role: {
      en: 'R&D Lead',
      fr: 'Responsable R&D',
    },
    bio: {
      en: 'Alexandre leads our research and development efforts, pioneering new techniques in AI-assisted restoration while maintaining artistic integrity.',
      fr: "Alexandre dirige nos efforts de recherche et développement, pionnier de nouvelles techniques de restauration assistée par IA tout en maintenant l'intégrité artistique.",
    },
  },
]

const awardsNews = [
  {
    id: 1,
    date: '2024-11-15',
    title: {
      en: 'César Award for Best Restoration',
      fr: 'César de la Meilleure Restauration',
    },
    source: 'Académie des César',
    content: {
      en: 'RFE receives the prestigious César Award for our work on "Les Enfants du Paradis" restoration, recognizing exceptional dedication to preserving French cinematic heritage.',
      fr: 'RFE reçoit le prestigieux César pour notre travail sur la restauration des "Enfants du Paradis", reconnaissant un dévouement exceptionnel à la préservation du patrimoine cinématographique français.',
    },
  },
  {
    id: 2,
    date: '2024-09-20',
    title: {
      en: 'Venice Film Festival Special Mention',
      fr: 'Mention Spéciale au Festival de Venise',
    },
    source: 'Venice Film Festival',
    content: {
      en: 'Our restoration of "Metropolis" receives a special mention at the Venice Film Festival Classics section for its meticulous frame-by-frame restoration process.',
      fr: 'Notre restauration de "Metropolis" reçoit une mention spéciale dans la section Classiques du Festival de Venise pour son processus de restauration image par image méticuleux.',
    },
  },
  {
    id: 3,
    date: '2024-07-12',
    title: {
      en: 'Partnership with Smithsonian Announced',
      fr: 'Partenariat avec le Smithsonian Annoncé',
    },
    source: 'Press Release',
    content: {
      en: 'RFE announces a multi-year partnership with the Smithsonian Institution to restore and preserve rare American documentary footage from the early 20th century.',
      fr: "RFE annonce un partenariat pluriannuel avec l'Institution Smithsonian pour restaurer et préserver de rares images documentaires américaines du début du 20e siècle.",
    },
  },
  {
    id: 4,
    date: '2024-05-08',
    title: {
      en: 'Cannes Classics Selection',
      fr: 'Sélection Cannes Classics',
    },
    source: 'Festival de Cannes',
    content: {
      en: 'Three of our restorations have been selected for the Cannes Classics program, including the world premiere of our "Napoleon" restoration.',
      fr: 'Trois de nos restaurations ont été sélectionnées pour le programme Cannes Classics, dont la première mondiale de notre restauration de "Napoléon".',
    },
  },
  {
    id: 5,
    date: '2024-03-22',
    title: {
      en: 'New Colorization Technology Unveiled',
      fr: 'Nouvelle Technologie de Colorisation Dévoilée',
    },
    source: 'Le Monde',
    content: {
      en: 'RFE unveils proprietary AI-assisted colorization technology that maintains historical accuracy while bringing unprecedented vibrancy to archival footage.',
      fr: "RFE dévoile une technologie de colorisation propriétaire assistée par IA qui maintient l'exactitude historique tout en apportant une vivacité sans précédent aux images d'archives.",
    },
  },
  {
    id: 6,
    date: '2024-01-10',
    title: {
      en: 'BAFTA Recognition for Heritage Preservation',
      fr: 'Reconnaissance BAFTA pour la Préservation du Patrimoine',
    },
    source: 'BAFTA',
    content: {
      en: 'The British Academy honors RFE with a special award for outstanding contribution to film heritage preservation and restoration.',
      fr: "L'Académie britannique honore RFE d'un prix spécial pour sa contribution exceptionnelle à la préservation et à la restauration du patrimoine cinématographique.",
    },
  },
]

const contactInfo = {
  email: 'hello@compositefilms.fr',
  phone: '+33 1 72 38 20 47',
  address: {
    en: '13 Rue des Petites écuries, 75010 Paris, France',
    fr: '12 Rue du Cinéma, 75011 Paris, France',
  },
  social: {
    instagram: 'https://www.instagram.com/composite_films/',
    linkedin: 'https://www.linkedin.com/company/compositefilms',
    vimeo: 'https://vimeo.com/compositefilms',
    tiktok: 'https://www.tiktok.com/@compositefilms',
    imdb: 'https://www.imdb.com/name/nm7512845/',
  },
}

// ============================================
// MEDIA DATA (copied from content.ts)
// ============================================

type MediaItem = {
  id: number
  title: string
  year: number
  src: string
  tags: string[]
  description?: string
  videoUrl?: string
}

const MEDIA = {
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
}

// ============================================
// CSV UTILITIES
// ============================================

/**
 * Escape a value for CSV (RFC 4180 compliant)
 */
function escapeCsv(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Convert array of objects to CSV string
 */
function toCsv(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCsv).join(',')
  const dataLines = rows.map(row => row.map(escapeCsv).join(','))
  return [headerLine, ...dataLines].join('\n')
}

/**
 * Flatten nested object to dot-path key/value pairs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenObject(obj: any, prefix = ''): Array<{ key: string; value: string }> {
  const result: Array<{ key: string; value: string }> = []

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result.push(...flattenObject(value, fullKey))
    } else {
      result.push({ key: fullKey, value: String(value) })
    }
  }

  return result
}

// ============================================
// OUR WORK UTILITIES
// ============================================

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateWorkKeywords(
  work: { title: string; tags: string[]; year: number },
  locale: 'en' | 'fr'
): string[] {
  const baseKeywords = locale === 'fr'
    ? ['restauration de film', 'colorisation', 'production documentaire', 'RFE']
    : ['film restoration', 'colorization', 'documentary production', 'RFE']

  const titleKeywords = work.title.split(/\s+/).filter(word => word.length > 2)
  return [...new Set([...baseKeywords, ...titleKeywords, ...work.tags, String(work.year)])]
}

function generateWorkSeoDescription(
  work: { title: string; year: number; tags: string[]; description?: string },
  locale: 'en' | 'fr'
): string {
  if (work.description) return work.description

  const isRestoration = work.tags.some(tag =>
    ['Colorization', 'Colorisation', 'Restoration', 'Restauration'].includes(tag)
  )
  const isDocumentary = work.tags.some(tag =>
    ['Documentary Production', 'Production Documentaire'].includes(tag)
  )

  if (locale === 'fr') {
    if (isRestoration) return `Découvrez ${work.title} (${work.year}), un projet de colorisation et restauration par RFE.`
    if (isDocumentary) return `Découvrez ${work.title} (${work.year}), une production documentaire par RFE.`
    return `${work.title} (${work.year}) - Un projet par RFE.`
  }

  if (isRestoration) return `Discover ${work.title} (${work.year}), a colorization and restoration project by RFE.`
  if (isDocumentary) return `Discover ${work.title} (${work.year}), a documentary production by RFE.`
  return `${work.title} (${work.year}) - A project by RFE.`
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportStrings(lang: 'en' | 'fr'): string {
  const flatStrings = flattenObject(dictionary[lang])
  return toCsv(
    ['key', 'value'],
    flatStrings.map(({ key, value }) => [key, value])
  )
}

function exportAbout(lang: 'en' | 'fr'): string {
  return toCsv(
    ['order', 'text'],
    aboutContent[lang].map((text, index) => [String(index + 1), text])
  )
}

function exportTeam(lang: 'en' | 'fr'): string {
  return toCsv(
    ['id', 'name', 'role', 'bio'],
    teamMembers.map(m => [
      String(m.id),
      m.name,
      m.role[lang],
      m.bio[lang],
    ])
  )
}

function exportAwardsNews(lang: 'en' | 'fr'): string {
  return toCsv(
    ['id', 'date', 'source', 'title', 'content'],
    awardsNews.map(item => [
      String(item.id),
      item.date,
      item.source,
      item.title[lang],
      item.content[lang],
    ])
  )
}

function exportContact(lang: 'en' | 'fr'): string {
  const rows = [
    ['email', contactInfo.email],
    ['phone', contactInfo.phone],
    ['address', contactInfo.address[lang]],
    ['instagram', contactInfo.social.instagram],
    ['linkedin', contactInfo.social.linkedin],
    ['vimeo', contactInfo.social.vimeo],
    ['tiktok', contactInfo.social.tiktok],
    ['imdb', contactInfo.social.imdb],
  ]
  return toCsv(['key', 'value'], rows)
}

function exportOurWork(lang: 'en' | 'fr'): string {
  const items = MEDIA.posters[lang]
  return toCsv(
    ['id', 'slug', 'title', 'year', 'tags', 'image', 'videoUrl', 'description', 'seoTitle', 'seoDescription', 'seoKeywords'],
    items.map(item => [
      String(item.id),
      generateSlug(item.title),
      item.title,
      String(item.year),
      item.tags.join('|'),
      item.src,
      item.videoUrl ?? '',
      item.description ?? '',
      item.title,
      generateWorkSeoDescription(item, lang),
      generateWorkKeywords(item, lang).join('|'),
    ])
  )
}

// ============================================
// MAIN
// ============================================

const outputDir = path.join(__dirname, 'output')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const files: Array<{ name: string; content: string }> = [
  { name: 'strings_en.csv', content: exportStrings('en') },
  { name: 'strings_fr.csv', content: exportStrings('fr') },
  { name: 'about_en.csv', content: exportAbout('en') },
  { name: 'about_fr.csv', content: exportAbout('fr') },
  { name: 'team_en.csv', content: exportTeam('en') },
  { name: 'team_fr.csv', content: exportTeam('fr') },
  { name: 'awardsNews_en.csv', content: exportAwardsNews('en') },
  { name: 'awardsNews_fr.csv', content: exportAwardsNews('fr') },
  { name: 'contact_en.csv', content: exportContact('en') },
  { name: 'contact_fr.csv', content: exportContact('fr') },
  { name: 'ourWork_en.csv', content: exportOurWork('en') },
  { name: 'ourWork_fr.csv', content: exportOurWork('fr') },
]

for (const file of files) {
  const filePath = path.join(outputDir, file.name)
  fs.writeFileSync(filePath, file.content, 'utf8')
  console.log(`✅ Written: ${file.name}`)
}

console.log(`\n📁 All CSV files exported to: ${outputDir}`)
console.log(`
============================================
GOOGLE SHEETS SETUP INSTRUCTIONS
============================================

1. Open each Google Sheet (EN + FR)

2. Create these tabs in EACH sheet:
   - strings
   - about
   - team
   - awardsNews
   - contact
   - ourWork

3. Import CSV files:
   For each tab:
   a) Go to File > Import
   b) Upload tab: select the corresponding CSV file
   c) Import location: "Replace current sheet"
   d) Separator: Comma
   e) Click "Import data"

4. Make sheets public:
   a) Click "Share" button
   b) Change "General access" to "Anyone with the link"
   c) Role: "Viewer"

Sheet URLs after setup:
- EN: https://docs.google.com/spreadsheets/d/1R9ytGgCmDzcwsTfbbNcx_ZEybSFh9CjNcPcb4wsG5VQ
- FR: https://docs.google.com/spreadsheets/d/1JTjO89LlNpiW0R0_l362JDmHIbNxjAcPqAQOD43JXj4

ourWork columns:
- id: Unique identifier
- slug: URL-friendly slug (auto-generated from title if empty)
- title: Work title (translatable)
- year: Release year
- tags: Pipe-separated tags (e.g. "Colorization|Restoration")
- image: Image path
- videoUrl: YouTube URL
- description: Short description (translatable)
- seoTitle: Custom SEO title (optional, defaults to title)
- seoDescription: Custom SEO description (optional)
- seoKeywords: Pipe-separated keywords (optional)

============================================
`)
