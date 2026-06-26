# Spec 12: Works Rich Description + Reusable Platforms

## Context

Currently the Works collection stores `description` as a plain `textarea` (varchar). This limits editorial control — no bold, links, or multi-paragraph layout.

The `seenOn` array is defined inline per work, duplicating platform data (name + logo) across every work that shares the same broadcaster. There is no shared "channel/platform" record.

The current UI renders `seenOn` as an absolute overlay inside the poster frame, which clutters the visual.

## Acceptance Criteria

- [ ] `Platforms` collection exists with `name` (text, required) + `logo` (upload → media, optional)
- [ ] Works `description` is a `richText` field (Lexical editor) — old varchar column migrated with data preserved as paragraph nodes
- [ ] Works `seenOn` is a `hasMany` relationship to `platforms` (no more inline array)
- [ ] Admin: picking seenOn on a work uses the Platforms selector — reuses existing records
- [ ] Migration is idempotent (UP converts data, DOWN is reversible)
- [ ] Seed covers the known platforms: Lifetime, TF1, TF1 Studios, CNews, Netflix, Paramount+, ABC, CBS
- [ ] `seenOn` displayed **below** the poster in a flex row (max 3 per line), not on the poster
- [ ] Work detail page renders rich text description (bold, italic, paragraphs, links)
- [ ] `lexicalToText()` utility extracts plain text from Lexical JSON for SEO metadata
- [ ] `pnpm build` passes, no TypeScript errors

## API / Interface Contracts

### Platforms collection
```typescript
// slug: 'platforms'
{
  name: string          // required — e.g. "Lifetime", "TF1"
  logo?: Media | null   // upload → media
}
```

### Works schema changes
```typescript
description: richText   // Lexical JSON (was textarea varchar)
seenOn?: Platforms[]    // hasMany relationship (was inline array)
```

### Updated TypeScript types
```typescript
// lib/cms.ts
type Work = {
  description: unknown          // Lexical SerializedEditorState JSON
  seenOn?: (Platform | number)[]
}

type Platform = {
  id: number
  name: string
  logo?: { url: string; sizes?: { thumbnail?: { url: string } } } | number | null
  updatedAt: string
  createdAt: string
}

// lib/i18n/types.ts
type WorkItem = {
  description?: string          // plain text fallback / SEO
  descriptionRich?: unknown     // Lexical JSON for rich rendering
  seenOn?: { name: string; logoUrl?: string }[]
}
```

### Utility
```typescript
// lib/works.ts
export function lexicalToText(content: unknown): string
```

## File Structure

```
packages/cms/src/
  collections/
    Platforms.ts          ← new
    Works.ts              ← updated (description richText, seenOn relationship)
    index.ts              ← register Platforms
  seed/
    seed-platforms.ts     ← new (8 known broadcasters)
    seed-works.ts         ← add seenOn for produced works
    index.ts              ← export seedPlatforms
    run-seed.ts           ← call seedPlatforms before seedWorks

apps/rfe-v0/
  migrations/
    20260626_120000_platforms_and_rich_description.ts  ← new
    index.ts              ← register migration
  lib/
    cms.ts                ← Platform type + updated Work type
    i18n/types.ts         ← WorkItem descriptionRich + seenOn update
    works.ts              ← lexicalToText()
  components/
    RichText.tsx          ← new — client-safe Lexical renderer
  app/(frontend)/[locale]/
    layout.tsx            ← update seenOn mapping (Platform → { name, logoUrl })
    our-work/[slug]/
      page.tsx            ← description plain text for SEO + pass descriptionRich
      WorkPageContent.tsx ← render RichText + seenOn below hero
  components/
    WorkGrid.tsx          ← move seenOn below poster (flex, max 3/row)
```

## Verification Checklist

- [ ] `pnpm build` succeeds in `apps/rfe-v0`
- [ ] Migration runs without error on a fresh DB (already seeded)
- [ ] Migration is idempotent (running twice is safe)
- [ ] Admin panel shows Platforms collection
- [ ] Creating a Platform and assigning it to a Work seenOn works
- [ ] Work card shows seenOn badges below (not on) the poster
- [ ] Work detail page renders rich text description with formatting
- [ ] SEO metadata uses plain text description (not `[object Object]`)
- [ ] Seed creates 8 platforms + links produced works to Lifetime/TF1 appropriately
