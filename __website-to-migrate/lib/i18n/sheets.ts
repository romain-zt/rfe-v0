/**
 * ============================================
 * GOOGLE SHEETS I18N LOADER
 * ============================================
 * Loads site content from public Google Sheets CSV exports.
 * Falls back to local JSON if sheets are unreachable.
 * 
 * SHEET TABS REQUIRED:
 * 1) strings - columns: [key, value] - dot-path keys like "nav.home"
 * 2) about - columns: [order, text] - about page paragraphs
 * 3) team - columns: [id, name, role, bio]
 * 4) awardsNews - columns: [id, date, source, title, content]
 * 5) contact - columns: [key, value] - keys: email, phone, address, instagram, linkedin, vimeo, tiktok, imdb
 * 6) ourWork - columns: [id, slug, title, year, tags, image, videoUrl, description, seoTitle, seoDescription, seoKeywords]
 * ============================================
 */

import { fallbackEn } from './fallback/en'
import { fallbackFr } from './fallback/fr'
import { generateSlug } from '@/lib/works'
import type {
  Language,
  Dictionary,
  TeamMember,
  AwardsNewsItem,
  ContactInfo,
  SiteContent,
  WorkItem,
} from './types'

// Re-export types
export type { Language, Dictionary, TeamMember, AwardsNewsItem, ContactInfo, SiteContent, WorkItem }

// Sheet IDs
const SHEET_ID_EN = '1R9ytGgCmDzcwsTfbbNcx_ZEybSFh9CjNcPcb4wsG5VQ'
const SHEET_ID_FR = '1JTjO89LlNpiW0R0_l362JDmHIbNxjAcPqAQOD43JXj4'

// Tab names
const TABS = ['strings', 'about', 'team', 'awardsNews', 'contact', 'ourWork'] as const
type TabName = (typeof TABS)[number]

/**
 * Build CSV export URL for a Google Sheet tab
 */
function buildCsvUrl(sheetId: string, tab: TabName): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`
}

/**
 * Fetch CSV from URL without caching
 */
async function fetchCsv(url: string): Promise<string> {
  const res = await fetch(url, {
    cache: 'no-store', // No caching - always fetch fresh data
  })
  
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`)
  }
  
  const text = await res.text()
  
  // Validate it looks like CSV, not HTML error page
  if (text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
    throw new Error('Received HTML instead of CSV - sheet may not be public')
  }
  
  return text
}

/**
 * Lightweight CSV parser that handles:
 * - Quoted fields containing commas
 * - Quoted fields containing newlines
 * - Double-quoted escapes within quoted fields
 */
function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false
  
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i]
    const nextChar = csv[i + 1]
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"'
          i++
        } else {
          // End of quoted field
          inQuotes = false
        }
      } else {
        currentField += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        currentRow.push(currentField)
        currentField = ''
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentField)
        currentField = ''
        if (currentRow.some(f => f.trim())) {
          rows.push(currentRow)
        }
        currentRow = []
        if (char === '\r') i++ // Skip \n in \r\n
      } else if (char !== '\r') {
        currentField += char
      }
    }
  }
  
  // Handle last field/row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField)
    if (currentRow.some(f => f.trim())) {
      rows.push(currentRow)
    }
  }
  
  return rows
}

/**
 * Parse CSV to array of objects using first row as headers
 */
function csvToObjects(csv: string): Record<string, string>[] {
  const rows = parseCsv(csv)
  if (rows.length < 2) return []
  
  const headers = rows[0].map(h => h.trim())
  return rows.slice(1).map(row => {
    const obj: Record<string, string> = {}
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? '').trim()
    })
    return obj
  })
}

/**
 * Convert dot-path key/value pairs to nested object
 * e.g., { "nav.home": "Home" } => { nav: { home: "Home" } }
 */
function rowsToNestedDictionary(rows: Array<{ key: string; value: string }>): Dictionary {
  const result: Dictionary = {}
  
  for (const { key, value } of rows) {
    if (!key) continue
    
    const parts = key.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = result
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!(part in current)) {
        current[part] = {}
      }
      current = current[part]
    }
    
    current[parts[parts.length - 1]] = value
  }
  
  return result
}

/**
 * Parse strings tab into nested dictionary
 */
function parseStrings(csv: string): Dictionary {
  const rows = csvToObjects(csv) as Array<{ key: string; value: string }>
  return rowsToNestedDictionary(rows)
}

/**
 * Parse about tab into ordered string array
 */
function parseAbout(csv: string): string[] {
  const rows = csvToObjects(csv) as Array<{ order: string; text: string }>
  return rows
    .sort((a, b) => parseInt(a.order) - parseInt(b.order))
    .map(r => r.text)
    .filter(Boolean)
}

/**
 * Parse team tab into TeamMember array
 */
function parseTeam(csv: string): TeamMember[] {
  const rows = csvToObjects(csv) as Array<{ id: string; name: string; role: string; bio: string }>
  return rows.map(r => ({
    id: parseInt(r.id) || 0,
    name: r.name || '',
    role: r.role || '',
    bio: r.bio || '',
  }))
}

/**
 * Parse awardsNews tab into AwardsNewsItem array
 */
function parseAwardsNews(csv: string): AwardsNewsItem[] {
  const rows = csvToObjects(csv) as Array<{ id: string; date: string; source: string; title: string; content: string }>
  return rows.map(r => ({
    id: parseInt(r.id) || 0,
    date: r.date || '',
    source: r.source || '',
    title: r.title || '',
    content: r.content || '',
  }))
}

/**
 * Parse contact tab into ContactInfo
 */
function parseContact(csv: string): ContactInfo {
  const rows = csvToObjects(csv) as Array<{ key: string; value: string }>
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
  
  return {
    email: map.email || '',
    phone: map.phone || '',
    address: map.address || '',
    social: {
      instagram: map.instagram || '',
      linkedin: map.linkedin || '',
      vimeo: map.vimeo || '',
      tiktok: map.tiktok || '',
      imdb: map.imdb || '',
    },
  }
}

/**
 * Split pipe-separated list into array
 */
function splitPipeList(value: string): string[] {
  return value
    .split('|')
    .map(v => v.trim())
    .filter(Boolean)
}

/**
 * Parse ourWork tab into WorkItem array
 */
function parseOurWork(csv: string): WorkItem[] {
  const rows = csvToObjects(csv) as Array<{
    id: string
    slug?: string
    title: string
    year: string
    tags: string
    image: string
    videoUrl?: string
    description?: string
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
  }>

  return rows
    .map((r, index) => {
      const title = (r.title || '').trim()
      const slug = (r.slug || '').trim() || generateSlug(title)
      const tags = splitPipeList(r.tags || '')
      const seoKeywords = splitPipeList(r.seoKeywords || '')

      return {
        id: parseInt(r.id) || index + 1,
        slug,
        title,
        year: parseInt(r.year) || 0,
        tags,
        src: r.image || '',
        videoUrl: r.videoUrl?.trim() || undefined,
        description: r.description?.trim() || undefined,
        seoTitle: r.seoTitle?.trim() || undefined,
        seoDescription: r.seoDescription?.trim() || undefined,
        seoKeywords: seoKeywords.length ? seoKeywords : undefined,
      }
    })
    .filter(item => item.title && item.src)
}

/**
 * Get fallback content for a locale
 */
function getFallback(locale: Language): SiteContent {
  return locale === 'en' ? fallbackEn : fallbackFr
}

/**
 * Validate that the dictionary has required keys
 */
function isValidDictionary(t: Dictionary): boolean {
  return !!(t && t.nav && t.nav.home && t.hero && t.footer)
}

/**
 * Main loader: fetch all tabs from Google Sheets and parse into SiteContent
 * Falls back to local JSON if fetch fails or data is invalid
 */
export async function getSiteContent(locale: Language): Promise<SiteContent> {
  // Ensure locale is valid
  const validLocale: Language = locale === 'fr' ? 'fr' : 'en'
  const sheetId = validLocale === 'en' ? SHEET_ID_EN : SHEET_ID_FR
  
  try {
    // Fetch all tabs in parallel
    const [stringsCSV, aboutCSV, teamCSV, awardsNewsCSV, contactCSV, ourWorkCSV] = await Promise.all([
      fetchCsv(buildCsvUrl(sheetId, 'strings')),
      fetchCsv(buildCsvUrl(sheetId, 'about')),
      fetchCsv(buildCsvUrl(sheetId, 'team')),
      fetchCsv(buildCsvUrl(sheetId, 'awardsNews')),
      fetchCsv(buildCsvUrl(sheetId, 'contact')),
      fetchCsv(buildCsvUrl(sheetId, 'ourWork')),
    ])
    
    const parsedT = parseStrings(stringsCSV)
    
    // Validate the parsed dictionary has required structure
    if (!isValidDictionary(parsedT)) {
      console.warn(`[i18n] Parsed dictionary for ${validLocale} is invalid, using fallback`)
      return getFallback(validLocale)
    }
    
    return {
      lang: validLocale,
      t: parsedT,
      aboutContent: parseAbout(aboutCSV),
      teamMembers: parseTeam(teamCSV),
      awardsNews: parseAwardsNews(awardsNewsCSV),
      contactInfo: parseContact(contactCSV),
      ourWork: parseOurWork(ourWorkCSV),
    }
  } catch (error) {
    console.error(`[i18n] Failed to load sheets for ${validLocale}, using fallback:`, error)
    return getFallback(validLocale)
  }
}
