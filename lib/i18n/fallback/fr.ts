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
      headline: 'pas ici pour obéir.',
      subheadline: 'un studio de regard féminin cinématographique',
      paragraph: 'Là où l\'émotion féminine devient puissance cinématographique.',
      tagline: 'Des histoires qui refusent de se taire.',
      cta: 'Nos Travaux',
    },
    gesture: {
      title: 'Le Geste',
      text: 'Chaque image porte une mémoire. Notre métier réside dans l\'équilibre délicat entre intimité et rébellion — honorer la vérité émotionnelle tout en insufflant une nouvelle voix aux histoires qui refusent de se taire.',
    },
    beforeAfter: {
      title: 'Nos Travaux',
      before: 'Avant',
      after: 'Après',
      restorationTitle: 'Drame',
      documentaryTitle: 'Thriller',
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
      rights: '© 2026 RFE. Tous droits réservés.',
    },
    work: {
      title: 'Nos Travaux',
      subtitle: 'Des histoires qui refusent de se taire.',
      all: 'Tous',
      drama: 'Drame',
      thriller: 'Thriller',
      view: 'Voir',
      close: 'Fermer',
    },
    news: {
      title: 'Actualités',
      subtitle: 'Les dernières nouvelles de notre studio.',
    },
    team: {
      title: 'Notre Équipe',
      subtitle: 'Les voix derrière le regard.',
    },
    about: {
      title: 'À Propos',
    },
    contactPage: {
      title: 'Contact',
      subtitle: 'si ça ne vous lâche pas, écrivez-nous.',
      name: 'Nom',
      email: 'Email',
      message: 'Message',
      send: 'Envoyer',
      address: 'Adresse',
      phone: 'Téléphone',
    },
  },
  aboutContent: [
    'RFE n\'est pas une société de production. C\'est un regard. Une voix. Un refus de détourner les yeux.',
    'Nous existons parce que les histoires de femmes ont toujours été là — sans cesse coupées, adoucies, expliquées, racontées à travers les yeux de quelqu\'un d\'autre. Nous existons pour les laisser respirer — brutes, incomplètes, refusant toute résolution.',
    'Notre travail vit à l\'intersection de l\'intimité et de la rébellion. Nous poursuivons le moment avant le cri, le silence qui contient tout, un regard qui ne se détourne pas.',
  ],
  teamMembers: [
    {
      id: 1,
      name: 'Elisabeth Röhm',
      role: 'Fondatrice & Directrice Créative',
      bio: 'Actrice, scénariste, productrice. Elisabeth a fondé RFE pour créer un espace où l\'émotion féminine devient puissance cinématographique — des histoires racontées non pas à travers les yeux de quelqu\'un d\'autre, mais à travers les nôtres.',
    },
    {
      id: 2,
      name: 'Kara',
      role: 'Directrice du Développement',
      bio: 'Kara façonne la direction créative de chaque projet, veillant à ce que chaque histoire porte la vérité émotionnelle et l\'authenticité radicale qui définissent RFE.',
    },
  ],
  awardsNews: [
    {
      id: 1,
      date: '2026-02',
      source: 'Deadline',
      title: 'Shirley MacLaine en vedette dans \'Margret and Stevie\' de Matthew Weiner',
      content: 'Shirley MacLaine a été choisie pour le rôle principal de Margret and Stevie, réalisé par Matthew Weiner. Le film suit deux femmes dont l\'amitié tranchante devient une bouée de sauvetage.',
    },
  ],
  contactInfo: {
    email: 'elisabeth@rohmfeiferentertainment.com',
    phone: '',
    address: 'Los Angeles, California',
    social: {
      instagram: 'https://www.instagram.com/elisabethrohm/',
      linkedin: '',
      vimeo: '',
      tiktok: '',
      imdb: 'https://www.imdb.com/name/nm0738400/',
    },
  },
  ourWork: MEDIA.posters.fr,
}
