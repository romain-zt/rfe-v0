# Spec 04: Full Content Migration to Payload CMS

## Context

`apps/admin/` is set up (Spec 03) with Payload CMS running on port 3001. It currently has only `Users` + `Media` collections and zero globals. All content in `apps/rfe-v0/` is hardcoded in TypeScript files.

This spec migrates **everything** from hardcoded data to Payload CMS: collections, globals, seeds, media uploads, frontend integration, and cleanup.

### Locale decision

Only **`en`** is active. French locale routing exists but content is a copy of English. Payload is configured with `locales: [{ label: 'English', code: 'en' }]`. No French content migration needed.

### Current content sources

| Source | Path | Data |
|--------|------|------|
| Works catalog | `apps/rfe-v0/app/(frontend)/[locale]/content.ts` | 44 `POSTER_ITEMS` with id, title, year, src, tags, description, videoUrl, category, subcategory |
| EN fallback | `apps/rfe-v0/lib/i18n/fallback/en.ts` | `SiteContent`: nav strings, hero copy, team (2), awards (1), contact info, about paragraphs, legal sections |
| SEO config | `apps/rfe-v0/lib/seo.ts` | Per-page title/description/keywords for en + fr, site config (name, url, social) |
| Press items | `apps/rfe-v0/app/(frontend)/[locale]/press/PressContent.tsx` | 1 press item (Deadline article) hardcoded in component |
| Header nav | `apps/rfe-v0/components/Header.tsx` | 5 nav items hardcoded as English labels |
| Footer | `apps/rfe-v0/components/Footer.tsx` | Email, legal link, logo |
| About page | `apps/rfe-v0/app/(frontend)/[locale]/about/AboutContent.tsx` | Bios, company overview, hardcoded EN copy |
| Home page | `apps/rfe-v0/app/(frontend)/[locale]/HomeContent.tsx` | Featured works, sections, hero copy, all hardcoded EN |
| Design tokens | `apps/rfe-v0/app/(frontend)/[locale]/globals.css` | CSS variables (colors, tones, easings, typography) |
| Types | `apps/rfe-v0/lib/i18n/types.ts` | `WorkItem`, `TeamMember`, `AwardsNewsItem`, `ContactInfo`, `SiteContent` |

### Media assets situation

`public/assets/` in `apps/rfe-v0/` is **empty** (likely gitignored or on another branch). Code references ~50 image paths under `/assets/works/`, `/assets/posters/`, `/assets/team/`, `/assets/portfolio-medias/`, `/assets/logos/`. The seed must handle missing files gracefully (skip upload, use placeholder).

### Existing Payload infrastructure

| Component | Status | Location |
|-----------|--------|----------|
| `Users` collection | Done | `packages/cms/src/collections/Users.ts` |
| `Media` collection | Done | `packages/cms/src/collections/Media.ts` (thumbnail/poster/hero/og sizes) |
| S3 storage plugin | Done | `packages/cms/src/config.ts` |
| Admin user seed | Done | `packages/cms/src/seed/seed-admin.ts` |
| Postgres + MinIO | Done | `docker-compose.yml` |

---

## Acceptance Criteria

### Collections
- [ ] `Works` collection exists with all fields from `MediaItem` + `WorkItem` types
- [ ] `TeamMembers` collection exists with fields from `TeamMember` type + photo upload
- [ ] `PressItems` collection exists with fields matching press data
- [ ] All collections registered in `packages/cms/src/collections/index.ts`

### Globals
- [ ] `SiteConfig` global exists with brand identity, color palette, typography, easings, SEO defaults, contact info, social links
- [ ] `Navigation` global exists with header nav items and footer config
- [ ] All globals registered in `packages/cms/src/globals/index.ts`

### Seeds
- [ ] Media seed uploads available images from `apps/rfe-v0/public/assets/` to S3 (skips missing)
- [ ] Works seed populates all 44 items from `POSTER_ITEMS` with correct media relationships
- [ ] Team seed populates 2 team members with photos
- [ ] Press seed populates 1 press item
- [ ] SiteConfig seed populates from current CSS vars + SEO config + contact info
- [ ] Navigation seed populates from current hardcoded nav items
- [ ] All seeds are idempotent (upsert pattern)
- [ ] `pnpm --filter @rfe/admin seed` runs all seeds

### Frontend
- [ ] All pages fetch data from Payload REST API (via `@rfe/cms` client or direct fetch)
- [ ] Header reads nav items from Navigation global
- [ ] Footer reads contact info from SiteConfig global
- [ ] Home page renders from Payload data
- [ ] Our Work page renders from Works collection
- [ ] Work detail page renders from single Work
- [ ] About page renders from TeamMembers + SiteConfig
- [ ] Development page renders from Works (filtered by category)
- [ ] Press page renders from PressItems collection
- [ ] Contact page renders from SiteConfig contact info
- [ ] Legal page renders from SiteConfig or keeps static (legal text is rarely CMS-managed)
- [ ] Design tokens injected as CSS variables from SiteConfig global

### Cleanup
- [ ] `apps/rfe-v0/app/(frontend)/[locale]/content.ts` removed or emptied
- [ ] `apps/rfe-v0/lib/i18n/` directory removed (sheets, fallbacks, types)
- [ ] `apps/rfe-v0/lib/seo.ts` replaced by Payload SEO data
- [ ] Unused components removed (`AwardsNews`, `BeforeAfter`, `MediaGallery`, `BottomLogoReveal`, local `Modal`, `GrainOverlay` duplicate, `LanguageToggle`, `LanguageContext`)
- [ ] Dead routes removed (`our-team/` redirect, `news/` redirect, `@modal/` parallel route)
- [ ] Build passes for both apps

---

## Plans Overview & Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1 — SCHEMAS (parallel)                 │
│                                                                 │
│  Plan A: Collections (Works, TeamMembers, PressItems)           │
│  Plan B: Globals (SiteConfig, Navigation)                       │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2 — SEEDS (sequential)                 │
│                                                                 │
│  Plan C: Media upload seed (must run before content seeds)      │
│  Plan D: Content seeds (Works, Team, Press, SiteConfig, Nav)    │
│                                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               PHASE 3 — FRONTEND (partially parallel)           │
│                                                                 │
│  Plan E: API client + data fetching layer                       │
│  Plan F: Component refactors (Header, Footer, WorkGrid)         │
│  Plan G: Page migrations (Home, Our Work, About, Dev, etc.)     │
│                                                                 │
│  E runs first, then F+G can partially overlap                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 4 — CLEANUP + VERIFY                     │
│                                                                 │
│  Plan H: Remove old data files, unused components, dead routes  │
│  Plan I: Build verification + visual check                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Plan A — Collections (Works, TeamMembers, PressItems)

**Subagent:** `payload-architect`
**Files to create/modify:** `packages/cms/src/collections/`

### A.1 — Works Collection

**File:** `packages/cms/src/collections/Works.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const Works: CollectionConfig = {
  slug: 'works',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'category', 'tags'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'year', type: 'number', required: true, admin: { position: 'sidebar' } },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      required: false, // some items may not have images uploaded yet
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Drama', value: 'Drama' },
        { label: 'Thriller', value: 'Thriller' },
        { label: 'True Crime', value: 'True Crime' },
        { label: 'Unscripted', value: 'Unscripted' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'videoUrl', type: 'text', admin: { description: 'YouTube or Vimeo embed URL' } },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Film', value: 'film' },
        { label: 'Series', value: 'series' },
        { label: 'Unscripted', value: 'unscripted' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'subcategory', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'keywords', type: 'text' },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: { position: 'sidebar', description: 'Lower = first' },
      defaultValue: 0,
    },
  ],
}
```

**Source data:** 44 items from `POSTER_ITEMS` in `content.ts`. Slug derived via `generateSlug()` from `lib/works.ts` (lowercase, hyphenated title).

### A.2 — TeamMembers Collection

**File:** `packages/cms/src/collections/TeamMembers.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
```

**Source data:** 2 members from `fallbackEn.teamMembers`. Photos: `liz-rohm-hero.png`, `kara.png` (in `public/assets/team/`).

### A.3 — PressItems Collection

**File:** `packages/cms/src/collections/PressItems.ts`

```typescript
import type { CollectionConfig } from 'payload'

export const PressItems: CollectionConfig = {
  slug: 'press-items',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'source', 'date'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'source', type: 'text', required: true },
    { name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'monthOnly' } } },
    { name: 'url', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
```

**Source data:** 1 item from `PressContent.tsx` `pressItems` array.

### A.4 — Register in index

**File:** `packages/cms/src/collections/index.ts`

```typescript
import { Users } from './Users'
import { Media } from './Media'
import { Works } from './Works'
import { TeamMembers } from './TeamMembers'
import { PressItems } from './PressItems'

export { Users, Media, Works, TeamMembers, PressItems }
export const collections = [Users, Media, Works, TeamMembers, PressItems]
```

### Tasks

1. Create `Works.ts`, `TeamMembers.ts`, `PressItems.ts` in `packages/cms/src/collections/`
2. Update `packages/cms/src/collections/index.ts` to export all
3. Run `pnpm --filter @rfe/admin payload generate:types` to verify schemas compile
4. Run `pnpm build` to verify no errors

---

## Plan B — Globals (SiteConfig, Navigation)

**Subagent:** `design-system-modeler` (SiteConfig), `payload-architect` (Navigation)
**Files to create/modify:** `packages/cms/src/globals/`

### B.1 — SiteConfig Global

**File:** `packages/cms/src/globals/SiteConfig.ts`

Maps the current design tokens from `globals.css`, SEO from `lib/seo.ts`, and contact info from `fallbackEn.contactInfo`.

```typescript
import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Configuration',
  fields: [
    // Brand identity
    {
      name: 'brand',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true, defaultValue: 'RFE' },
        { name: 'tagline', type: 'text', defaultValue: 'True Crime. Real Drama.' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'favicon', type: 'upload', relationTo: 'media' },
      ],
    },
    // Color palette
    {
      name: 'colors',
      type: 'group',
      fields: [
        { name: 'background', type: 'text', defaultValue: '#070708' },
        { name: 'foreground', type: 'text', defaultValue: '#F5F0EB' },
        { name: 'rfeRed', type: 'text', defaultValue: '#8B1A1A' },
        { name: 'rfeRose', type: 'text', defaultValue: '#C4A0A0' },
        { name: 'rfeGold', type: 'text', defaultValue: '#B5975A' },
      ],
    },
    // Section tones
    {
      name: 'sectionTones',
      type: 'group',
      fields: [
        { name: 'deep', type: 'text', defaultValue: '#050506' },
        { name: 'charcoal', type: 'text', defaultValue: '#0a0a0c' },
        { name: 'slate', type: 'text', defaultValue: '#0c0d10' },
        { name: 'warm', type: 'text', defaultValue: '#0b0908' },
        { name: 'cool', type: 'text', defaultValue: '#080a0d' },
        { name: 'ember', type: 'text', defaultValue: '#0d0907' },
        { name: 'dusk', type: 'text', defaultValue: '#090810' },
      ],
    },
    // Typography
    {
      name: 'typography',
      type: 'group',
      fields: [
        { name: 'brandFont', type: 'text', defaultValue: 'Sackers Gothic' },
        { name: 'sansFont', type: 'text', defaultValue: 'Inter' },
        { name: 'serifFont', type: 'text', defaultValue: 'Fraunces' },
        { name: 'radiusBase', type: 'text', defaultValue: '0.25rem' },
      ],
    },
    // Easings
    {
      name: 'easings',
      type: 'group',
      fields: [
        { name: 'emerge', type: 'text', defaultValue: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        { name: 'quiet', type: 'text', defaultValue: 'cubic-bezier(0.87, 0, 0.13, 1)' },
        { name: 'sharp', type: 'text', defaultValue: 'cubic-bezier(0.76, 0, 0.24, 1)' },
      ],
    },
    // SEO defaults
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'titleTemplate', type: 'text', defaultValue: '%s | RFE' },
        { name: 'defaultTitle', type: 'text', defaultValue: 'RFE — a cinematic female gaze studio' },
        { name: 'defaultDescription', type: 'textarea', defaultValue: 'stories that refuse to stay quiet.' },
        { name: 'keywords', type: 'text', defaultValue: 'female gaze cinema, feminist film production, independent film studio, female director, women in film' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
        { name: 'siteUrl', type: 'text', defaultValue: 'https://www.rohmfeiferentertainment.com' },
      ],
    },
    // Contact info
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'email', type: 'email', defaultValue: 'elisabeth@rohmfeiferentertainment.com' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'text', defaultValue: 'Los Angeles, California' },
      ],
    },
    // Social links
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/elisabethrohm/' },
        { name: 'linkedin', type: 'text' },
        { name: 'vimeo', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'imdb', type: 'text', defaultValue: 'https://www.imdb.com/name/nm0738400/' },
      ],
    },
    // About content
    {
      name: 'about',
      type: 'group',
      fields: [
        {
          name: 'paragraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'heroHeadline', type: 'text', defaultValue: "There's always more to the story." },
        { name: 'heroSubheadline', type: 'text', defaultValue: 'True Crime / Real Drama' },
        {
          name: 'heroParagraph',
          type: 'textarea',
          defaultValue: 'Launched in 2023, RFE is a woman-owned film and television production company committed to telling inspirational, empowering stories steeped in true crime and true stories.',
        },
      ],
    },
    // Legal page content
    {
      name: 'legal',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Legal notice' },
        { name: 'subtitle', type: 'text', defaultValue: 'Publisher information, hosting, and terms of use.' },
        {
          name: 'sections',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'paragraphs',
              type: 'array',
              fields: [{ name: 'text', type: 'textarea', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
```

### B.2 — Navigation Global

**File:** `packages/cms/src/globals/Navigation.ts`

```typescript
import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  fields: [
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
            { name: 'isExternal', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        { name: 'legalLabel', type: 'text', defaultValue: 'Legal notice' },
        { name: 'copyrightText', type: 'text', defaultValue: '© 2026 RFE. All rights reserved.' },
      ],
    },
  ],
}
```

### B.3 — Register in index

**File:** `packages/cms/src/globals/index.ts`

```typescript
import { SiteConfig } from './SiteConfig'
import { Navigation } from './Navigation'

export { SiteConfig, Navigation }
export const globals = [SiteConfig, Navigation]
```

### Tasks

1. Create `SiteConfig.ts` and `Navigation.ts` in `packages/cms/src/globals/`
2. Update `packages/cms/src/globals/index.ts`
3. Run `pnpm --filter @rfe/admin payload generate:types`
4. Run `pnpm build`

---

## Plan C — Media Upload Seed

**Subagent:** `seed-engineer`
**Depends on:** Plan A + Plan B (schemas must exist)

**File:** `packages/cms/src/seed/seed-media.ts`

The seed scans `apps/rfe-v0/public/assets/` for images referenced by `POSTER_ITEMS`, team photos, and logo files. For each file found, it uploads to Payload Media collection (which stores in S3). Missing files are logged and skipped.

### Image inventory (from code references)

**Works posters** (from `content.ts` `src` field):
```
/assets/works/out-for-love.png
/assets/works/ruby-falls.png
/assets/works/sisters-daughter.png
/assets/works/passing-love.png
/assets/works/by-midnight.png
/assets/works/weekend-guests.png
/assets/works/a-love-like-the-sun.png
/assets/works/sunshine-sisters.png
/assets/posters/TransElectric2.png
/assets/works/rescue-of-jerusalem.png
/assets/works/matador.png
/assets/posters/HusbandFatherKiller.jpeg
/assets/works/the-dating-app-killer.jpg
/assets/works/murder-your-darlings.jpg
/assets/works/if-you-tell.png
/assets/works/if-anything-happens-to-me.png
/assets/works/sleeping-angel.png
/assets/works/in-not-so-loving-memory.png
/assets/works/play-dead.png
/assets/works/wife-stalker.png
/assets/works/darkness-falls.png
/assets/works/booth-pi.png
/assets/works/iron-man.png
/assets/posters/SusanPowell.jpg
/assets/posters/a-dentist-to-die-for.png
/assets/works/margret-stevie.png
/assets/posters/Feather_Farah.png
/assets/works/flower-girl.png
/assets/posters/murder-in-law.png
/assets/posters/GirlsCantPlayPool.jpg
/assets/posters/Undefeated.jpg
/assets/works/diamonds-and-deadlines.png
/assets/works/twos-company.png
/assets/posters/KoreanEspionage.png
/assets/works/lobotomist-wife.png
/assets/posters/relentless.png
/assets/works/silent-echo.png
/assets/posters/CallMeMadam.png
/assets/posters/swap.png
/assets/posters/LastDay_ReidBrothers.webp
/assets/works/lie-detector.png
/assets/posters/SouthernGothic.png
/assets/posters/dispatch.png
/assets/posters/horseplay.png
/assets/posters/Nookietown.jpg
```

**Team photos:**
```
/assets/team/liz-rohm-hero.png
/assets/team/kara.png
```

**Portfolio / About page:**
```
/assets/portfolio-medias/elisabeth-1.png
/assets/portfolio-medias/tournage-1.jpg
/assets/portfolio-medias/tournage-2.jpg
/assets/portfolio-medias/tournage-3.jpg
/assets/portfolio-medias/tournage-4.jpg
```

**Logos:**
```
/logo-rfe.svg (public root)
/favicon.png (public root)
```

### Seed pattern

```typescript
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

const ASSETS_BASE = path.resolve(__dirname, '../../../../apps/rfe-v0/public')

export async function seedMedia(payload: Payload): Promise<Map<string, number>> {
  const mediaMap = new Map<string, number>() // src path → media ID

  const imagePaths = [/* all paths listed above */]

  for (const imgPath of imagePaths) {
    const fullPath = path.join(ASSETS_BASE, imgPath)
    if (!fs.existsSync(fullPath)) {
      console.warn(`[seed-media] Skipping missing file: ${imgPath}`)
      continue
    }

    const filename = path.basename(imgPath)

    // Upsert: check if already uploaded
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      mediaMap.set(imgPath, existing.docs[0].id as number)
      continue
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const doc = await payload.create({
      collection: 'media',
      data: { alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') },
      file: {
        data: fileBuffer,
        name: filename,
        mimetype: `image/${path.extname(filename).slice(1) === 'jpg' ? 'jpeg' : path.extname(filename).slice(1)}`,
        size: fileBuffer.length,
      },
    })

    mediaMap.set(imgPath, doc.id as number)
  }

  return mediaMap
}
```

Returns a `Map<string, number>` mapping original `/assets/...` paths to Payload media IDs, used by content seeds.

### Tasks

1. Create `packages/cms/src/seed/seed-media.ts`
2. Export from `packages/cms/src/seed/index.ts`
3. Test: `pnpm --filter @rfe/admin seed` → images appear in admin Media library

---

## Plan D — Content Seeds

**Subagent:** `seed-engineer`
**Depends on:** Plan A + Plan B (schemas) + Plan C (media IDs)

### D.1 — Seed Works

**File:** `packages/cms/src/seed/seed-works.ts`

Imports `POSTER_ITEMS` data (can copy inline or import from rfe-v0 content.ts). For each item:
- Generate slug from title (lowercase, hyphenated)
- Look up poster media ID from the mediaMap
- Upsert by slug

### D.2 — Seed Team Members

**File:** `packages/cms/src/seed/seed-team.ts`

2 members from `fallbackEn.teamMembers`. Look up photo media IDs.

### D.3 — Seed Press Items

**File:** `packages/cms/src/seed/seed-press.ts`

1 item from `PressContent.tsx` `pressItems` array.

### D.4 — Seed SiteConfig

**File:** `packages/cms/src/seed/seed-site-config.ts`

Populates the SiteConfig global with:
- Brand: name="RFE", tagline="True Crime. Real Drama."
- Colors: from `globals.css` CSS variables
- Typography: Sackers Gothic, Inter, Fraunces
- Easings: from `globals.css`
- SEO: from `lib/seo.ts` `seoContent.en`
- Contact: from `fallbackEn.contactInfo`
- Social: from `fallbackEn.contactInfo.social`
- About: paragraphs from `fallbackEn.aboutContent`
- Legal: sections from `fallbackEn.t.legalPage`

### D.5 — Seed Navigation

**File:** `packages/cms/src/seed/seed-navigation.ts`

```typescript
await payload.updateGlobal({
  slug: 'navigation',
  data: {
    header: {
      items: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Work', href: '/our-work' },
        { label: 'Development', href: '/development' },
        { label: 'Press', href: '/press' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    footer: {
      legalLabel: 'Legal notice',
      copyrightText: '© 2026 RFE. All rights reserved.',
    },
  },
})
```

### D.6 — Update run-seed.ts

**File:** `packages/cms/src/seed/run-seed.ts`

```typescript
import type { Payload } from 'payload'
import { seedAdmin } from './seed-admin'
import { seedMedia } from './seed-media'
import { seedWorks } from './seed-works'
import { seedTeam } from './seed-team'
import { seedPress } from './seed-press'
import { seedSiteConfig } from './seed-site-config'
import { seedNavigation } from './seed-navigation'

export async function runSeed(payload: Payload) {
  console.log('[seed] Starting...')
  await seedAdmin(payload)
  const mediaMap = await seedMedia(payload)
  await seedWorks(payload, mediaMap)
  await seedTeam(payload, mediaMap)
  await seedPress(payload)
  await seedSiteConfig(payload)
  await seedNavigation(payload)
  console.log('[seed] Done.')
}
```

### Tasks

1. Create all seed files in `packages/cms/src/seed/`
2. Update `run-seed.ts` to call them in order
3. Update `packages/cms/src/seed/index.ts` to export all
4. Test: `pnpm --filter @rfe/admin seed` → all content visible in admin panel

---

## Plan E — API Client + Data Fetching Layer

**Subagent:** `generalPurpose`
**Depends on:** Phase 2 (seeds must work so data exists to fetch)

### E.1 — Typed API Client

**File:** `packages/cms/src/client.ts`

Create a typed REST client that `apps/rfe-v0` uses to fetch from admin API:

```typescript
export type PayloadClient = {
  find: <T>(collection: string, query?: Record<string, string>) => Promise<{ docs: T[]; totalDocs: number }>
  findBySlug: <T>(collection: string, slug: string) => Promise<T | null>
  findGlobal: <T>(slug: string) => Promise<T>
}

export function createPayloadClient(baseUrl: string): PayloadClient { ... }
```

### E.2 — Data Access Functions

**File:** `apps/rfe-v0/lib/cms.ts`

Thin wrappers around the client for common queries:

```typescript
import { createPayloadClient } from '@rfe/cms/client'

const cms = createPayloadClient(process.env.CMS_API_URL || 'http://localhost:3001')

export async function getWorks() { return cms.find('works', { sort: 'sortOrder' }) }
export async function getWorkBySlug(slug: string) { return cms.findBySlug('works', slug) }
export async function getTeamMembers() { return cms.find('team-members', { sort: 'sortOrder' }) }
export async function getPressItems() { return cms.find('press-items', { sort: '-date' }) }
export async function getSiteConfig() { return cms.findGlobal('site-config') }
export async function getNavigation() { return cms.findGlobal('navigation') }
```

### E.3 — Environment Variable

Add to `apps/rfe-v0/.env.example` and `.env.local`:
```
CMS_API_URL=http://localhost:3001
```

### Tasks

1. Create `packages/cms/src/client.ts`
2. Add `"./client"` export to `packages/cms/package.json`
3. Add `@rfe/cms` dependency to `apps/rfe-v0/package.json` (if not already)
4. Create `apps/rfe-v0/lib/cms.ts`
5. Add `CMS_API_URL` to env files
6. Verify types compile

---

## Plan F — Component Refactors

**Subagent:** `frontend-guardian`
**Depends on:** Plan E (data access layer exists)

### F.1 — Header.tsx

Replace hardcoded `navItems` array with data from Navigation global.
- Make server component or accept nav items as props from layout
- Props: `navItems: { label: string; href: string }[]`

### F.2 — Footer.tsx

Replace hardcoded email/legal text with data from SiteConfig global.
- Props: `email: string; legalLabel: string; copyrightText: string`

### F.3 — WorkGrid.tsx

Replace `content.ourWork` context dependency with props.
- Props: `works: Work[]` (from Payload Works collection)
- Keep filter logic (drama/thriller)
- Use Payload media URLs instead of `/assets/...` paths

### F.4 — Layout.tsx

The locale layout currently wraps everything in `LanguageProvider`. Refactor to:
- Fetch `SiteConfig` and `Navigation` from Payload in layout (server component)
- Pass nav items to Header via props
- Inject design tokens as CSS variables on `<body>` style attribute
- Remove `LanguageProvider` dependency on Google Sheets/fallback data

### F.5 — Remove unused components

Delete or archive:
- `AwardsNews.tsx` — unused (news page redirects)
- `BeforeAfter.tsx` — references missing `MEDIA.beforeAfter`
- `MediaGallery.tsx` — references missing MEDIA shapes
- `BottomLogoReveal.tsx` — unclear if used
- `GrainOverlay.tsx` — duplicate (layout uses `@rfe/ui` version)
- `LanguageToggle.tsx` — only EN active
- `LanguageContext.tsx` — replaced by direct Payload data fetching
- `Modal.tsx` — unused (different from `@rfe/ui` Modal)
- `theme-provider.tsx` — likely unused (dark mode not active)

### Tasks

1. Refactor Header to accept nav items as props
2. Refactor Footer to accept config as props
3. Refactor WorkGrid to accept works as props
4. Update layout to fetch from Payload and pass data down
5. Delete unused components
6. Verify build passes

---

## Plan G — Page Migrations

**Subagent:** `frontend-guardian`
**Depends on:** Plan E + Plan F

Each page becomes a server component (or has a server component wrapper) that fetches from Payload and passes data to the client component.

### G.1 — Home Page (`page.tsx` + `HomeContent.tsx`)

- Fetch featured works, site config, press items from Payload
- Pass as props to HomeContent
- Replace hardcoded project arrays, hero copy, sections

### G.2 — Our Work Page (`our-work/page.tsx` + `OurWorkContent.tsx`)

- Fetch all works from Payload (where category is null — main catalog)
- Pass to WorkGrid component
- Update SEO metadata from SiteConfig

### G.3 — Work Detail Page (`our-work/[slug]/page.tsx` + `WorkPageContent.tsx`)

- Fetch single work by slug from Payload
- Pass to WorkPageContent
- Update `generateStaticParams` to query Payload
- Update SEO metadata from work data

### G.4 — About Page (`about/page.tsx` + `AboutContent.tsx`)

- Fetch team members + site config (about paragraphs) from Payload
- Pass to AboutContent
- Replace hardcoded bios, company overview

### G.5 — Development Page (`development/page.tsx` + `DevelopmentContent.tsx`)

- Fetch works where category is set (film/series/unscripted) from Payload
- Pass categorized works to DevelopmentContent
- Replace hardcoded tab labels with data from works categories

### G.6 — Press Page (`press/page.tsx` + `PressContent.tsx`)

- Fetch press items from Payload
- Pass to PressContent
- Remove hardcoded `pressItems` array from component

### G.7 — Contact Page (`contact/page.tsx` + `ContactContent.tsx`)

- Fetch site config (contact info) from Payload
- Pass contact info as props
- Replace `useLanguage()` context dependency

### G.8 — Legal Page (`legal/page.tsx` + `LegalContent.tsx`)

- Fetch site config (legal sections) from Payload
- Pass legal content as props
- Replace `useLanguage()` context dependency

### Tasks (per page)

1. Convert page.tsx to fetch data server-side from Payload
2. Update *Content.tsx to receive data as props
3. Remove `useLanguage()` / context dependencies
4. Verify page renders with Payload data
5. Verify mobile + desktop breakpoints

---

## Plan H — Cleanup

**Subagent:** `generalPurpose`
**Depends on:** Phase 3 (all pages migrated)

### Files to delete

```
apps/rfe-v0/app/(frontend)/[locale]/content.ts          ← POSTER_ITEMS, MEDIA
apps/rfe-v0/lib/i18n/                                    ← entire directory
  ├── types.ts
  ├── sheets.ts
  └── fallback/
      ├── en.ts
      └── fr.ts
apps/rfe-v0/lib/seo.ts                                  ← replaced by SiteConfig
apps/rfe-v0/components/AwardsNews.tsx                    ← unused
apps/rfe-v0/components/BeforeAfter.tsx                   ← broken import
apps/rfe-v0/components/MediaGallery.tsx                  ← broken import
apps/rfe-v0/components/BottomLogoReveal.tsx              ← unused
apps/rfe-v0/components/GrainOverlay.tsx                  ← duplicate
apps/rfe-v0/components/LanguageToggle.tsx                ← EN only
apps/rfe-v0/components/LanguageContext.tsx                ← replaced
apps/rfe-v0/components/Modal.tsx                         ← unused
apps/rfe-v0/components/theme-provider.tsx                ← unused
apps/rfe-v0/app/(frontend)/[locale]/our-team/            ← redirect only
apps/rfe-v0/app/(frontend)/[locale]/news/                ← redirect only
apps/rfe-v0/app/(frontend)/[locale]/@modal/              ← dead parallel route
apps/rfe-v0/scripts/export-i18n-to-csv.ts                ← no longer needed
```

### Files to modify

- `apps/rfe-v0/lib/works.ts` — keep `generateSlug`, `getWorkBySlug` utilities but update imports
- `apps/rfe-v0/middleware.ts` — simplify (remove FR locale support if EN-only)
- `apps/rfe-v0/package.json` — remove unused deps (if any)

### Tasks

1. Delete all listed files/directories
2. Update remaining imports
3. Simplify middleware
4. Run `pnpm build` to verify no broken imports
5. Run `pnpm lint` if configured

---

## Plan I — Verification

**Subagent:** `verifier`
**Depends on:** Plan H

### Checklist

```
- [ ] `pnpm build` passes (both apps)
- [ ] `docker compose up -d` starts Postgres + MinIO
- [ ] `pnpm --filter @rfe/admin seed` runs without errors
- [ ] Admin panel (localhost:3001/admin): Works (44), TeamMembers (2), PressItems (1), SiteConfig, Navigation all visible
- [ ] Frontend (localhost:3000): Home page renders
- [ ] Frontend: Our Work page shows 44 works
- [ ] Frontend: Work detail page renders for any slug
- [ ] Frontend: About page shows team bios
- [ ] Frontend: Development page shows categorized works
- [ ] Frontend: Press page shows press items
- [ ] Frontend: Contact page shows contact info
- [ ] Frontend: Legal page shows legal sections
- [ ] Frontend: Mobile (375px) — all pages render correctly
- [ ] Frontend: Desktop (1440px) — all pages render correctly
- [ ] Frontend: Navigation works (all links resolve)
- [ ] No console errors in browser
- [ ] No Payload imports in apps/rfe-v0/ (except @rfe/cms/client)
- [ ] Cinematic effects still work (grain, reveals, cinema-hole)
```

---

## Execution Summary

| Phase | Plans | Parallel? | Subagents | Est. files |
|-------|-------|-----------|-----------|------------|
| 1 | A + B | Yes | payload-architect, design-system-modeler | 7 created, 2 modified |
| 2 | C → D | Sequential (D needs C's mediaMap) | seed-engineer | 8 created, 1 modified |
| 3 | E → F + G | E first, then F+G overlap | generalPurpose, frontend-guardian | 3 created, ~15 modified |
| 4 | H + I | Sequential | generalPurpose, verifier | ~15 deleted, ~3 modified |

## Branch

`migrate/content-to-payload`
