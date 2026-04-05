import type { Payload } from 'payload'

export async function seedSiteConfig(payload: Payload): Promise<void> {
  console.log('[seed-site-config] Seeding site configuration...')

  await payload.updateGlobal({
    slug: 'site-config',
    data: {
      brand: {
        name: 'RFE',
        tagline: 'True Crime. Real Drama.',
      },
      colors: {
        background: '#070708',
        foreground: '#F5F0EB',
        rfeRed: '#8B1A1A',
        rfeRose: '#C4A0A0',
        rfeGold: '#B5975A',
      },
      sectionTones: {
        deep: '#050506',
        charcoal: '#0a0a0c',
        slate: '#0c0d10',
        warm: '#0b0908',
        cool: '#080a0d',
        ember: '#0d0907',
        dusk: '#090810',
      },
      typography: {
        brandFont: 'Sackers Gothic',
        sansFont: 'Inter',
        serifFont: 'Fraunces',
        radiusBase: '0.25rem',
      },
      easings: {
        emerge: 'cubic-bezier(0.16, 1, 0.3, 1)',
        quiet: 'cubic-bezier(0.87, 0, 0.13, 1)',
        sharp: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      seo: {
        titleTemplate: '%s | RFE',
        defaultTitle: 'RFE — a cinematic female gaze studio',
        defaultDescription: 'stories that refuse to stay quiet.',
        keywords: 'female gaze cinema, feminist film production, independent film studio, female director, women in film, auteur cinema, indie production company, Margret and Stevie, cinematic storytelling, female-led films',
        siteUrl: 'https://www.rohmfeiferentertainment.com',
      },
      contact: {
        email: 'elisabeth@rohmfeiferentertainment.com',
        phone: '',
        address: 'Los Angeles, California',
      },
      social: {
        instagram: 'https://www.instagram.com/elisabethrohm/',
        linkedin: '',
        vimeo: '',
        tiktok: '',
        imdb: 'https://www.imdb.com/name/nm0738400/',
      },
      about: {
        paragraphs: [
          { text: 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds.' },
          { text: "Rohm Feifer Entertainment's team has decades of experience creating high-quality, critically-acclaimed, award-winning and globally popular films and series, as well as nonscripted series, documentaries, and podcasts." },
        ],
        heroHeadline: "There's always more to the story.",
        heroSubheadline: 'True Crime / Real Drama',
        heroParagraph: 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
      },
      ui: {
        workView: 'View',
        developmentFilms: 'Films',
        developmentSeries: 'Series',
        developmentUnscripted: 'Unscripted',
      },
      legal: {
        title: 'Legal notice',
        subtitle: 'Publisher information, hosting, and terms of use.',
        sections: [
          {
            title: 'Publisher',
            paragraphs: [
              { text: 'This website is published by Rohm Feifer Entertainment ("RFE"), a film and television production company.' },
              { text: 'Contact: elisabeth@rohmfeiferentertainment.com' },
              { text: 'Address: Los Angeles, California, United States.' },
            ],
          },
          {
            title: 'Hosting',
            paragraphs: [
              { text: 'This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States (vercel.com).' },
            ],
          },
          {
            title: 'Intellectual property',
            paragraphs: [
              { text: 'Unless otherwise stated, text, images, logos, trailers, and other content on this site are owned by or licensed to RFE and are protected by applicable copyright and trademark laws. You may not copy, reproduce, or distribute site content without prior written permission, except for private viewing or as allowed by law.' },
            ],
          },
          {
            title: 'Disclaimer',
            paragraphs: [
              { text: 'Information on this website is provided for general information only and may change without notice. RFE makes no warranties as to accuracy or completeness and is not liable for any loss arising from use of the site or reliance on its content.' },
              { text: 'Links to third-party sites are provided for convenience; RFE does not control or endorse those sites.' },
            ],
          },
        ],
      },
    },
  })

  console.log('[seed-site-config] Done.')
}
