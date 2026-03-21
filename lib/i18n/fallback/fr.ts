import type { SiteContent } from '../types'
import { MEDIA } from '../../../app/[locale]/content'

export const fallbackFr: SiteContent = {
  lang: 'fr',
  t: {
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
      paragraph: "Composite Films restaure et colorise les archives du cinéma, créant un pont entre la mémoire de l'histoire et le regard d'aujourd'hui — grâce à dix ans de savoir-faire et des technologies de pointe.",
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
      rights: '© 2024 Composite Films. Tous droits réservés.',
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
  aboutContent: [
    "Composite Films a été fondée à Paris en 1998 avec une mission singulière : préserver et restaurer les images animées qui définissent notre mémoire culturelle commune. Ce qui a commencé comme un petit laboratoire dédié au cinéma muet français est devenu un studio mondialement reconnu, auquel font confiance les archives, les studios et les institutions culturelles du monde entier.",
    "Notre approche combine un profond respect de l'intention artistique originale avec les technologies de restauration les plus avancées disponibles. Chaque rayure effacée, chaque image stabilisée, chaque couleur calibrée est guidée par une recherche historique rigoureuse et un engagement indéfectible envers l'authenticité. Nous ne nettoyons pas simplement les images—nous les écoutons, comprenons leur contexte, et les restaurons pour qu'elles parlent à nouveau clairement.",
    "Aujourd'hui, notre équipe d'archivistes, de coloristes et d'artistes de la restauration poursuit ce travail depuis nos studios de Paris et Lyon. Nous restons indépendants, ce qui nous permet de prendre le temps que chaque projet mérite. Pour nous, la restauration n'est pas une industrie—c'est une responsabilité.",
  ],
  teamMembers: [
    {
      id: 1,
      name: 'Marie-Claire Dubois',
      role: 'Fondatrice & Directrice Créative',
      bio: 'Avec plus de 25 ans dans la restauration cinématographique, Marie-Claire a fondé Composite Films avec la vision de préserver les œuvres les plus précieuses du cinéma pour les générations futures.',
    },
    {
      id: 2,
      name: 'Jean-Pierre Martin',
      role: 'Directeur Technique',
      bio: 'Jean-Pierre supervise tous les aspects techniques de notre pipeline de restauration, combinant artisanat traditionnel et technologie numérique de pointe.',
    },
    {
      id: 3,
      name: 'Sophie Laurent',
      role: 'Directrice de la Colorisation',
      bio: 'Sophie dirige notre équipe de colorisation, apportant exactitude historique et sensibilité artistique à chaque projet grâce à une recherche archivistique approfondie.',
    },
    {
      id: 4,
      name: 'Thomas Bergmann',
      role: 'Artiste Restaurateur Senior',
      bio: 'Thomas se spécialise dans la restauration image par image de séquences endommagées, avec une expertise particulière dans la préservation des films nitrate.',
    },
    {
      id: 5,
      name: 'Elena Rossi',
      role: 'Responsable des Partenariats Archives',
      bio: "Elena gère nos relations avec les archives cinématographiques et les institutions culturelles du monde entier, assurant l'accès aux matériaux rares.",
    },
    {
      id: 6,
      name: 'Alexandre Chen',
      role: 'Responsable R&D',
      bio: "Alexandre dirige nos efforts de recherche et développement, pionnier de nouvelles techniques de restauration assistée par IA tout en maintenant l'intégrité artistique.",
    },
  ],
  awardsNews: [
    {
      id: 1,
      date: '2024-11-15',
      source: 'Académie des César',
      title: 'César de la Meilleure Restauration',
      content: 'Composite Films reçoit le prestigieux César pour notre travail sur la restauration des "Enfants du Paradis", reconnaissant un dévouement exceptionnel à la préservation du patrimoine cinématographique français.',
    },
    {
      id: 2,
      date: '2024-09-20',
      source: 'Venice Film Festival',
      title: 'Mention Spéciale au Festival de Venise',
      content: 'Notre restauration de "Metropolis" reçoit une mention spéciale dans la section Classiques du Festival de Venise pour son processus de restauration image par image méticuleux.',
    },
    {
      id: 3,
      date: '2024-07-12',
      source: 'Press Release',
      title: 'Partenariat avec le Smithsonian Annoncé',
      content: "Composite Films annonce un partenariat pluriannuel avec l'Institution Smithsonian pour restaurer et préserver de rares images documentaires américaines du début du 20e siècle.",
    },
    {
      id: 4,
      date: '2024-05-08',
      source: 'Festival de Cannes',
      title: 'Sélection Cannes Classics',
      content: 'Trois de nos restaurations ont été sélectionnées pour le programme Cannes Classics, dont la première mondiale de notre restauration de "Napoléon".',
    },
    {
      id: 5,
      date: '2024-03-22',
      source: 'Le Monde',
      title: 'Nouvelle Technologie de Colorisation Dévoilée',
      content: "Composite Films dévoile une technologie de colorisation propriétaire assistée par IA qui maintient l'exactitude historique tout en apportant une vivacité sans précédent aux images d'archives.",
    },
    {
      id: 6,
      date: '2024-01-10',
      source: 'BAFTA',
      title: 'Reconnaissance BAFTA pour la Préservation du Patrimoine',
      content: "L'Académie britannique honore Composite Films d'un prix spécial pour sa contribution exceptionnelle à la préservation et à la restauration du patrimoine cinématographique.",
    },
  ],
  contactInfo: {
    email: 'hello@compositefilms.fr',
    phone: '+33 1 72 38 20 47',
    address: '12 Rue du Cinéma, 75011 Paris, France',
    social: {
      instagram: 'https://www.instagram.com/composite_films/',
      linkedin: 'https://www.linkedin.com/company/compositefilms',
      vimeo: 'https://vimeo.com/compositefilms',
      tiktok: 'https://www.tiktok.com/@compositefilms',
      imdb: 'https://www.imdb.com/name/nm7512845/',
    },
  },
  ourWork: MEDIA.posters.fr,
}
