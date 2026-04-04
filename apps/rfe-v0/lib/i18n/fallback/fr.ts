import type { SiteContent } from '../types'
import { MEDIA } from '../../../app/(frontend)/[locale]/content'

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
      bottomRevealCta: 'Écrivez-nous',
      followUs: 'Suivez-nous',
      rights: '© 2026 RFE. Tous droits réservés.',
      legal: 'Mentions légales',
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
    legalPage: {
      title: 'Mentions légales',
      subtitle: 'Éditeur, hébergement et conditions d’utilisation.',
      sections: [
        {
          title: 'Éditeur du site',
          paragraphs: [
            'Le présent site est édité par Rohm Feifer Entertainment (« RFE »), société de production cinématographique et télévisuelle.',
            'Contact : elisabeth@rohmfeiferentertainment.com',
            'Adresse : Los Angeles, Californie, États-Unis.',
          ],
        },
        {
          title: 'Hébergement',
          paragraphs: [
            'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com).',
          ],
        },
        {
          title: 'Propriété intellectuelle',
          paragraphs: [
            'Sauf mention contraire, les textes, images, logos, bandes-annonces et autres contenus sont la propriété de RFE ou font l’objet d’une licence et sont protégés par le droit d’auteur et les marques. Toute reproduction ou diffusion sans autorisation écrite préalable est interdite, sauf consultation privée ou dans les limites prévues par la loi.',
          ],
        },
        {
          title: 'Limitation de responsabilité',
          paragraphs: [
            'Les informations publiées sur ce site le sont à titre indicatif et peuvent être modifiées sans préavis. RFE ne garantit ni l’exactitude ni l’exhaustivité des contenus et ne saurait être tenue responsable d’un préjudice lié à l’utilisation du site ou à la confiance accordée à ces informations.',
            'Les liens vers des sites tiers sont fournis pour convenance ; RFE ne contrôle pas ces sites et n’en approuve pas le contenu.',
          ],
        },
      ],
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
