import type { Payload } from 'payload'

let blockIdCounter = 0
function nextBlockId() {
  return `seed-block-${++blockIdCounter}`
}

type WorkSelectionRef = number | string

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
      imageFit: 'cover',
    },
    layout: [
      contentBlock(
        [
          lexicalBlockNode('worksScroll', {
            title: 'Our Work',
            ctaLabel: 'see all',
            ctaUrl: '/our-work',
            sectionTone: 'warm',
            sourceType: 'pick',
            // "top 5 Movies" + "top 5 Series" (voir Michael's pool)
            selectedWorks: [
              'feather', 
              '1-better', 
              'margret-and-stevie', 
              'murder-in-law', 
              'flower-girl', 
              'by-midnight', 
              'undefeated', 
              'icky', 
              'diamonds-and-deadlines', 
              'twos-company',
            ],
          }),
        ],
        'warm',
      ),
      contentBlock(
        [
          lexicalHeadingNode('Woman-owned. Story-driven. Built for impact.'),
          lexicalParagraphNode(
            'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds.',
          ),
          lexicalParagraphNode(
            'RFE is a production company dedicated to developing bold, elevated content with a focus on empowering voices and complex characters, especially those of women.',
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
        'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds.',
      label: 'About Us',
      imageFit: 'cover',
      imagePosition: 'top',
    },
    layout: [
      contentBlock(
        [
          lexicalHeadingNode('Woman-owned. Story-driven. Built for impact.'),
          lexicalParagraphNode(
            'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds.',
          ),
          lexicalParagraphNode(
            'RFE is a production company dedicated to developing bold, elevated content with a focus on empowering voices and complex characters, especially those of women.',
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
      imageFit: 'cover',
      imagePosition: 'top',
    },
    layout: [
      contentBlock(
        [
          lexicalBlockNode('worksGrid', {
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
      imageFit: 'cover',
      imagePosition: 'top',
    },
    layout: [
      contentBlock(
        [
          lexicalParagraphNode(
            '',
          ),
          lexicalBlockNode('worksGrid', {
            sourceType: 'pick',
            // "top 5" deterministes (Movies + Series) pour l'ecran Development.
            // Paid Development est conserve complet pour ne pas supprimer l'onglet associe.
            selectedWorks: [
              // Paid Development
              'lie-detector', 'the-highlife', 'dispatch', 'blade', 'sick-puppy', 'bombsquad', 'the-chase-the-josephine-wentzel-story', 'nasty-business',
              // Top Movies (Michael list)
              'feather', '1-better', 'margret-and-stevie', 'murder-in-law', 'flower-girl',
              // Top Series (Michael list)
              'by-midnight', 'undefeated', 'icky', 'diamonds-and-deadlines', 'twos-company',
            ],
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
      imageFit: 'cover',
      imagePosition: 'top',
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

export async function seedPages(
  payload: Payload,
  opts?: { contactFormId?: number | null; mediaMap?: Map<string, number> },
): Promise<void> {
  console.log('[seed-pages] Seeding pages...')
  blockIdCounter = 0

  const mediaMap = opts?.mediaMap

  const heroMediaByPageSlug: Record<string, string[]> = {
    home: [
      '/assets/team/kara-lis.jpg',
      '/assets/team/kara-and-elisabeth.webp',
      '/assets/team/kara-and-elisabeth.jpg',
    ],
    // about, our-work, development, press — text-only heroes (no background image)
  }

  /**
   * Portrait-format images for hero at < 640px (mobile).
   * Falls back to the desktop image for any page not listed here.
   * Only true portrait assets (taller than wide) should be added — landscape crops at
   * an awkward ratio on portrait screens.
   *
   * Available portrait assets (confirmed dimensions):
   *   /assets/team/kara.png          — 982×1274  (Kara headshot)
   *   /assets/team/liz-rohm-hero.png — 1179×1383 (Elisabeth hero)
   *   /assets/portfolio-medias/elisabeth-1.png — 1179×1471 (on-set)
   */
  const heroMediaMobileByPageSlug: Record<string, string[]> = {
    home: ['/assets/team/kara.png', '/assets/team/liz-rohm-hero.png'],
  }

  async function resolveHeroMedia(
    hero: Record<string, unknown>,
    pageSlug: string,
  ): Promise<Record<string, unknown>> {
    if (hero.type === 'minimal') return hero
    if (!mediaMap) return hero

    const desktopCandidates = heroMediaByPageSlug[pageSlug] ?? []
    if (desktopCandidates.length === 0) return hero

    let next: Record<string, unknown> = hero
    for (const candidate of desktopCandidates) {
      const id = mediaMap.get(candidate)
      if (id) {
        next = { ...next, media: id }
        break
      }
    }

    const mobileCandidates = heroMediaMobileByPageSlug[pageSlug] ?? []
    for (const candidate of mobileCandidates) {
      const id = mediaMap.get(candidate)
      if (id) {
        next = { ...next, mediaMobile: id }
        break
      }
    }

    return next
  }

  async function resolveFeaturedWorkId(): Promise<number | null> {
    const result = await payload.find({
      collection: 'works',
      where: { slug: { equals: 'margret-and-stevie' } },
      limit: 1,
      depth: 0,
    })
    return result.docs[0] ? (result.docs[0].id as number) : null
  }

  async function resolveWorkSelections(layoutBlocks: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const workIdBySlug = new Map<string, number>()

    async function getWorkIdFromSlug(slug: string): Promise<number | null> {
      const cached = workIdBySlug.get(slug)
      if (cached != null) return cached

      const result = await payload.find({
        collection: 'works',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
      })
      const resolvedId = result.docs[0] ? (result.docs[0].id as number) : null
      if (resolvedId != null) workIdBySlug.set(slug, resolvedId)
      return resolvedId
    }

    async function resolveRefs(refs: WorkSelectionRef[]): Promise<number[]> {
      const resolved: number[] = []
      for (const ref of refs) {
        if (typeof ref === 'number') {
          resolved.push(ref)
          continue
        }
        const id = await getWorkIdFromSlug(ref)
        if (id != null) resolved.push(id)
      }
      return resolved
    }

    const nextLayout: Record<string, unknown>[] = []
    for (const block of layoutBlocks) {
      if (block.blockType !== 'content') {
        nextLayout.push(block)
        continue
      }

      const columns = (block as { columns?: Array<Record<string, unknown>> }).columns
      if (!columns) {
        nextLayout.push(block)
        continue
      }

      const nextColumns: Array<Record<string, unknown>> = []
      for (const col of columns) {
        const rt = col.richText as { root?: { children?: Array<Record<string, unknown>> } } | undefined
        if (!rt?.root?.children) {
          nextColumns.push(col)
          continue
        }

        const nextChildren: Array<Record<string, unknown>> = []
        for (const child of rt.root.children) {
          if (child.type !== 'block') {
            nextChildren.push(child)
            continue
          }

          const fields = child.fields as { selectedWorks?: WorkSelectionRef[]; sourceType?: string } | undefined
          if (!fields?.selectedWorks || fields.sourceType !== 'pick') {
            nextChildren.push(child)
            continue
          }

          const resolvedWorks = await resolveRefs(fields.selectedWorks)
          nextChildren.push({
            ...child,
            fields: {
              ...fields,
              selectedWorks: resolvedWorks,
            },
          })
        }

        nextColumns.push({
          ...col,
          richText: {
            ...rt,
            root: {
              ...rt.root,
              children: nextChildren,
            },
          },
        })
      }

      nextLayout.push({
        ...block,
        columns: nextColumns,
      })
    }

    return nextLayout
  }

  const featuredWorkId = await resolveFeaturedWorkId()

  for (const page of PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })

    let layout = page.layout
    if (page.slug === 'contact' && opts?.contactFormId != null) {
      layout = [
        contentBlock(
          [
            lexicalBlockNode('embeddedForm', {
              title: 'Get in touch',
              subtitle: 'Tell us about your project.',
              form: opts.contactFormId,
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
      ]
    }

    layout = await resolveWorkSelections(layout)

    const heroWithMedia = await resolveHeroMedia(page.hero, page.slug)

    if (featuredWorkId) {
      layout = layout.map((block) => {
        if (block.blockType !== 'content') return block
        const columns = (block as Record<string, unknown>).columns as Array<Record<string, unknown>> | undefined
        if (!columns) return block
        return {
          ...block,
          columns: columns.map((col) => {
            const rt = col.richText as { root?: { children?: Array<Record<string, unknown>> } } | undefined
            if (!rt?.root?.children) return col
            return {
              ...col,
              richText: {
                ...rt,
                root: {
                  ...rt.root,
                  children: rt.root.children.map((child) => {
                    if (child.type !== 'block') return child
                    const fields = child.fields as Record<string, unknown> | undefined
                    if (fields?.blockType === 'featuredWork' && !fields.work) {
                      return { ...child, fields: { ...fields, work: featuredWorkId } }
                    }
                    return child
                  }),
                },
              },
            }
          }),
        }
      })
    }

    const data: Record<string, unknown> = {
      title: page.title,
      slug: page.slug,
      hero: heroWithMedia,
      layout,
      meta: page.meta,
      _status: 'published',
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0]!.id,
        data: data as any,
      })
      console.log(`  Updated page: ${page.title}`)
    } else {
      await payload.create({
        collection: 'pages',
        data: data as any,
      })
      console.log(`  Created page: ${page.title}`)
    }
  }

  console.log('[seed-pages] Done.')
}
