import type { Payload } from 'payload'

let blockIdCounter = 0
function nextBlockId() {
  return `seed-block-${++blockIdCounter}`
}

function lexicalText(text: string) {
  return { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }
}

function lexicalParagraphNode(text: string) {
  return {
    children: [lexicalText(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

function lexicalHeadingNode(text: string, tag = 'h2') {
  return {
    children: [lexicalText(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'heading',
    version: 1,
    tag,
  }
}

function lexicalBlockNode(blockType: string, fields: Record<string, unknown>) {
  return {
    type: 'block',
    version: 2,
    fields: {
      id: nextBlockId(),
      blockType,
      blockName: '',
      ...fields,
    },
  }
}

function lexicalRoot(children: Record<string, unknown>[]) {
  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

function lexicalParagraph(text: string) {
  return lexicalRoot([lexicalParagraphNode(text)])
}

function lexicalMultiParagraph(texts: string[]) {
  return lexicalRoot(texts.map((t) => lexicalParagraphNode(t)))
}

function contentBlock(
  children: Record<string, unknown>[],
  sectionTone = 'default',
) {
  return {
    blockType: 'content',
    sectionTone,
    columns: [
      {
        size: 'full',
        richText: lexicalRoot(children),
      },
    ],
  }
}

type PageSeed = {
  title: string
  slug: string
  hero: Record<string, unknown>
  layout: Record<string, unknown>[]
  meta: Record<string, unknown>
}

const PAGES: PageSeed[] = [
  {
    title: 'Home',
    slug: 'home',
    hero: {
      type: 'cinematic',
      headline: "There's always more to the story.",
      subtitle: 'True Crime / Real Drama',
    },
    layout: [
      contentBlock(
        [
          lexicalBlockNode('worksScroll', {
            title: 'Our Work',
            ctaLabel: 'see all',
            ctaUrl: '/our-work',
            sectionTone: 'warm',
            items: [],
          }),
        ],
        'warm',
      ),
      contentBlock(
        [
          lexicalHeadingNode('Woman-owned. Story-driven. Built for impact.'),
          lexicalParagraphNode(
            'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
          ),
          lexicalParagraphNode(
            'Elisabeth Rohm & Kara Feifer — two creators who refuse to play it safe.',
          ),
        ],
        'dusk',
      ),
      contentBlock(
        [
          lexicalBlockNode('featuredWork', {
            quote: "Shirley MacLaine To Star In Matthew Weiner's Margret and Stevie",
            attribution: 'Deadline, February 2026',
            externalUrl:
              'https://deadline.com/2026/02/shirley-maclaine-margret-and-stevie-matthew-weiner-1236729698/',
            sectionTone: 'ember',
          }),
        ],
        'ember',
      ),
      contentBlock(
        [
          lexicalBlockNode('pressList', {
            title: 'Press',
            limit: 3,
            showViewAll: true,
            viewAllUrl: '/press',
            sectionTone: 'warm',
          }),
        ],
        'warm',
      ),
      contentBlock(
        [
          lexicalBlockNode('cta', {
            richText: lexicalParagraph('Ready to partner with us?'),
            sectionTone: 'deep',
            links: [
              { label: 'Get in touch', url: '/contact', isExternal: false, appearance: 'gold' },
            ],
          }),
        ],
        'deep',
      ),
    ],
    meta: {
      title: 'RFE — a cinematic female gaze studio',
      description: 'stories that refuse to stay quiet.',
      keywords:
        'female gaze cinema, feminist film production, independent film studio, female director, women in film, auteur cinema, indie production company, Margret and Stevie, cinematic storytelling, female-led films',
      jsonLdType: 'WebPage',
    },
  },

  {
    title: 'About',
    slug: 'about',
    hero: {
      type: 'page',
      headline: "There's always more to the story.",
      subtitle:
        'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
      label: 'About Us',
      imagePosition: 'center top',
    },
    layout: [
      contentBlock(
        [
          lexicalHeadingNode('Woman-owned. Story-driven. Built for impact.'),
          lexicalParagraphNode(
            'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds.',
          ),
          lexicalParagraphNode(
            "Rohm Feifer Entertainment's team has decades of experience creating high-quality, critically-acclaimed, award-winning and globally popular films and series, as well as nonscripted series, documentaries, and podcasts.",
          ),
          lexicalBlockNode('teamShowcase', {
            title: 'The Founders',
            showBios: true,
            showPhotos: true,
            sectionTone: 'warm',
          }),
          lexicalParagraphNode('Stories that refuse to stay quiet. That is the RFE promise.'),
        ],
        'charcoal',
      ),
    ],
    meta: {
      title: 'About — RFE',
      description: 'Why we exist. What we refuse. What we chase.',
      keywords: 'woman-owned production company, film studio, female gaze, Elisabeth Rohm, Kara Feifer',
      jsonLdType: 'AboutPage',
    },
  },

  {
    title: 'Our Work',
    slug: 'our-work',
    hero: {
      type: 'page',
      headline: 'Films that look with women, not at them.',
      label: 'Our Work',
      imagePosition: 'center 20%',
    },
    layout: [
      contentBlock(
        [
          lexicalBlockNode('worksGrid', {
            showFilters: true,
            showSubcategoryTabs: false,
            sectionTone: 'charcoal',
          }),
        ],
        'charcoal',
      ),
    ],
    meta: {
      title: 'Work — RFE',
      description: 'Films that look with women, not at them.',
      keywords: 'film portfolio, true crime films, drama series, independent films, female-led productions',
      jsonLdType: 'CollectionPage',
    },
  },

  {
    title: 'Development',
    slug: 'development',
    hero: {
      type: 'page',
      headline: "What we're building next.",
      label: 'Development',
      imagePosition: 'center 30%',
    },
    layout: [
      contentBlock(
        [
          lexicalParagraphNode(
            'RFE has a growing slate of projects in active development across film, series, and unscripted content.',
          ),
          lexicalBlockNode('worksGrid', {
            showFilters: false,
            showSubcategoryTabs: true,
            sectionTone: 'charcoal',
          }),
        ],
        'charcoal',
      ),
    ],
    meta: {
      title: 'Development — RFE',
      description: 'Projects in active development at Rohm Feifer Entertainment.',
      keywords: 'film development, upcoming projects, new films, series in development',
      jsonLdType: 'CollectionPage',
    },
  },

  {
    title: 'Press',
    slug: 'press',
    hero: {
      type: 'page',
      headline: 'The world is starting to listen.',
      label: 'Press',
      imagePosition: 'center 20%',
    },
    layout: [
      contentBlock(
        [
          lexicalBlockNode('pressList', {
            title: 'Coverage',
            limit: 100,
            showViewAll: false,
            sectionTone: 'charcoal',
          }),
        ],
        'charcoal',
      ),
    ],
    meta: {
      title: 'Press — RFE',
      description: 'The world is starting to listen.',
      keywords: 'press coverage, film news, entertainment press, RFE news',
      jsonLdType: 'CollectionPage',
    },
  },

  {
    title: 'Contact',
    slug: 'contact',
    hero: {
      type: 'minimal',
      headline: 'Contact',
      subtitle: "if it won't leave you alone, write to us.",
    },
    layout: [
      contentBlock(
        [
          lexicalBlockNode('contactForm', {
            title: 'Get in touch',
            subtitle: 'Tell us about your project.',
            nameLabel: 'Name',
            emailLabel: 'Email',
            messageLabel: 'Message',
            submitLabel: 'Send',
          }),
          lexicalBlockNode('contactInfo', {
            title: 'Find us',
            showEmail: true,
            showPhone: true,
            showAddress: true,
            showSocials: true,
          }),
        ],
        'default',
      ),
    ],
    meta: {
      title: 'Contact — RFE',
      description: "if it won't leave you alone, write to us.",
      keywords: 'contact RFE, film production contact, entertainment contact',
      jsonLdType: 'ContactPage',
    },
  },

  {
    title: 'Legal notice',
    slug: 'legal',
    hero: {
      type: 'minimal',
      headline: 'Legal notice',
      subtitle: 'Publisher information, hosting, and terms of use.',
    },
    layout: [
      contentBlock(
        [
          lexicalBlockNode('legalSections', {
            sections: [
              {
                title: 'Publisher',
                content: lexicalMultiParagraph([
                  'This website is published by Rohm Feifer Entertainment ("RFE"), a film and television production company.',
                  'Contact: elisabeth@rohmfeiferentertainment.com',
                  'Address: Los Angeles, California, United States.',
                ]),
              },
              {
                title: 'Hosting',
                content: lexicalParagraph(
                  'This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States (vercel.com).',
                ),
              },
              {
                title: 'Intellectual property',
                content: lexicalParagraph(
                  'Unless otherwise stated, text, images, logos, trailers, and other content on this site are owned by or licensed to RFE and are protected by applicable copyright and trademark laws. You may not copy, reproduce, or distribute site content without prior written permission, except for private viewing or as allowed by law.',
                ),
              },
              {
                title: 'Disclaimer',
                content: lexicalMultiParagraph([
                  'Information on this website is provided for general information only and may change without notice. RFE makes no warranties as to accuracy or completeness and is not liable for any loss arising from use of the site or reliance on its content.',
                  'Links to third-party sites are provided for convenience; RFE does not control or endorse those sites.',
                ]),
              },
            ],
          }),
          lexicalBlockNode('cta', {
            richText: lexicalParagraph('Questions? Get in touch.'),
            links: [{ label: 'Contact', url: '/contact', isExternal: false, appearance: 'default' }],
          }),
        ],
        'default',
      ),
    ],
    meta: {
      title: 'Legal notice — RFE',
      description: 'Publisher, hosting, and terms of use for this website.',
      keywords: 'legal notice, terms of use, privacy, RFE',
      jsonLdType: 'WebPage',
    },
  },
]

export async function seedPages(payload: Payload): Promise<void> {
  console.log('[seed-pages] Seeding pages...')
  blockIdCounter = 0

  for (const page of PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })

    const data = {
      title: page.title,
      slug: page.slug,
      hero: page.hero,
      layout: page.layout,
      meta: page.meta,
      _status: 'published' as const,
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0]!.id,
        data,
      })
      console.log(`  Updated page: ${page.title}`)
    } else {
      await payload.create({
        collection: 'pages',
        data,
      })
      console.log(`  Created page: ${page.title}`)
    }
  }

  console.log('[seed-pages] Done.')
}
