import type { Dictionary } from '@/lib/i18n/types'
import type { NavigationData, SiteConfig } from '@/lib/cms'

/** Minimal UI strings for client components; chrome labels from Payload where available. */
export function buildUiDictionary(
  siteConfig: SiteConfig | null,
  navigation: NavigationData | null,
): Dictionary {
  return {
    footer: {
      legal: navigation?.footer?.legalLabel ?? 'Legal notice',
      contact: '',
      bottomRevealCta: '',
      followUs: '',
      rights: navigation?.footer?.copyrightText ?? '',
    },
    work: {
      view: siteConfig?.ui?.workView ?? 'View',
    },
    development: {
      films: siteConfig?.ui?.developmentFilms ?? 'Films',
      series: siteConfig?.ui?.developmentSeries ?? 'Series',
      unscripted: siteConfig?.ui?.developmentUnscripted ?? 'Unscripted',
    },
    credits: {
      sectionTitle: 'Credits',
      byRole: {
        director: 'Directed by',
        writer: 'Written by',
        ep: 'Executive Produced by',
        producer: 'Produced by',
        star: 'Starring',
        showrunner: 'Showrunner',
        'co-producer': 'Co-Produced by',
        creator: 'Created by',
        other: '',
      },
      roleLabel: {
        director: 'Director',
        writer: 'Writer',
        ep: 'Executive Producer',
        producer: 'Producer',
        star: 'Star',
        showrunner: 'Showrunner',
        'co-producer': 'Co-Producer',
        creator: 'Creator',
        other: '',
      },
    },
    productionStage: {
      'produced': 'Produced',
      'in-production': 'In Production',
      'paid-development': 'Paid Development',
      'movies-development': 'In Development — Movies',
      'series-development': 'In Development — Series',
      tabs: {
        'paid-development': 'Paid Development',
        'movies-development': 'Movies',
        'series-development': 'Series',
      },
    },
  }
}
