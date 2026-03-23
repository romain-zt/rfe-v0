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
      aboutUs: 'About Us',
      contact: 'Contact',
      development: 'Development',
      press: 'Press',
    },
    hero: {
      headline: "There's always more to the story.",
      subheadline: 'True Crime / Real Drama',
      paragraph: 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
      tagline: 'True Crime. Real Drama.',
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
      title: 'Our Work',
      subtitle: 'True crime and real drama.',
      all: 'All',
      drama: 'Drama',
      thriller: 'Thriller',
      view: 'View',
      close: 'Close',
    },
    news: {
      title: 'Press',
      subtitle: 'Coverage and recognition.',
    },
    team: {
      title: 'About Us',
      subtitle: 'Elisabeth Rohm & Kara Feifer',
    },
    about: {
      title: 'About Us',
    },
    development: {
      title: 'Development',
      subtitle: 'Films, series, and unscripted in development.',
      films: 'Films',
      series: 'Series',
      unscripted: 'Unscripted',
    },
    press: {
      title: 'Press',
      subtitle: 'The world is starting to listen.',
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
    'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds.',
    'Rohm Feifer Entertainment\'s team has decades of experience creating high-quality, critically-acclaimed, award-winning and globally popular films and series, as well as nonscripted series, documentaries, and podcasts.',
  ],
  teamMembers: [
    {
      id: 1,
      name: 'Elisabeth Rohm',
      role: 'Co-Founder, Director & Producer',
      bio: 'Elisabeth Rohm is an acclaimed actress, director, and producer, best known for her role in LAW & ORDER (Emmy and SAG nominee). Her collaboration with David O. Russell in the Oscar-nominated AMERICAN HUSTLE earned her a SAG Award for Best Ensemble. Beginning with her directorial debut, GIRL IN THE BASEMENT, Rohm gravitates towards thrilling, woman-centered stories.',
    },
    {
      id: 2,
      name: 'Kara Feifer',
      role: 'Co-Founder & Executive Producer',
      bio: 'Kara Feifer, entertainment veteran, is known for starring in the international television series TIME OF YOUR LIFE and for her fruitful network collaborations. She executive produced films including TEMPTING FATE, FAMILY PICTURES, HUSBAND/FATHER/KILLER, WIFE STALKER, and DATING APP KILLER: THE MONICA WHITE STORY. She is also executive producer of "She Wants More," the Webby nominated iHeart podcast.',
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
