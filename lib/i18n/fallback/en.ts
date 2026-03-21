import type { SiteContent } from '../types'
import { MEDIA } from '../../../app/[locale]/content'

export const fallbackEn: SiteContent = {
  lang: 'en',
  t: {
    nav: {
      home: 'Home',
      news: 'News',
      ourWork: 'Our Work',
      ourTeam: 'Our Team',
      aboutUs: 'About',
      contact: 'Contact',
    },
    hero: {
      headline: 'not here to behave.',
      subheadline: 'a cinematic female gaze studio',
      paragraph: 'Where feminine emotion becomes cinematic power.',
      tagline: 'Stories that refuse to stay quiet.',
      cta: 'Our Work',
    },
    gesture: {
      title: 'The Gesture',
      text: 'Every frame carries memory. Our craft lies in the delicate balance between preservation and revelation—honoring the original intent while breathing new life into works that shaped our collective imagination.',
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
      title: 'Recognition',
      readMore: 'Read more',
    },
    footer: {
      contact: 'Contact',
      followUs: 'Follow Us',
      rights: '© 2026 RFE. All rights reserved.',
    },
    work: {
      title: 'our work',
      subtitle: 'stories that refuse to stay quiet.',
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
      title: 'our team',
      subtitle: 'the voices behind the gaze.',
    },
    about: {
      title: 'about',
    },
    contactPage: {
      title: 'Contact',
      subtitle: 'if it won\'t leave you alone, write to us.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send',
      address: 'Address',
      phone: 'Phone',
    },
  },
  aboutContent: [
    'RFE is not a production company. It is a gaze. A voice. A refusal to look away.',
    'We exist because women\'s stories have always been there — kept getting cut, softened, explained away, told through someone else\'s eyes. We exist to let them breathe — raw, incomplete, refusing resolution.',
    'Our work lives at the intersection of intimacy and rebellion. We chase the moment before the scream, the silence that holds everything, a gaze that doesn\'t look away.',
  ],
  teamMembers: [
    {
      id: 1,
      name: 'Elisabeth Röhm',
      role: 'Founder & Creative Director',
      bio: 'Actress, writer, producer. Elisabeth founded RFE to create a space where feminine emotion becomes cinematic power — stories told not through someone else\'s eyes, but through our own.',
    },
    {
      id: 2,
      name: 'Kara',
      role: 'Head of Development',
      bio: 'Kara shapes the creative direction of every project, ensuring each story carries the emotional truth and radical authenticity that defines RFE.',
    },
  ],
  awardsNews: [
    {
      id: 1,
      date: '2026-02',
      source: 'Deadline',
      title: 'Shirley MacLaine To Star In Matthew Weiner\'s \'Margret and Stevie\'',
      content: 'Shirley MacLaine has been set to star in Margret and Stevie, directed by Matthew Weiner. The film follows two women whose sharp-edged friendship becomes a lifeline.',
    },
  ],
  contactInfo: {
    email: 'contact@rfe.studio',
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
  ourWork: MEDIA.posters.en,
}
