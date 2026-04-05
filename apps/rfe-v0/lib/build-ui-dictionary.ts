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
  }
}
