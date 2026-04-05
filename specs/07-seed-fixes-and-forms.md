# Spec 07: Seed Fixes, Media Sizes, Root Page, and Contact Form

## Context

The CMS migration is functional (specs 03–06 done): seed runs, admin panel works, pages render from Payload. Four issues remain:

1. **Sparse seed logs** — the seed endpoint returns only `{ success: true }`. No per-step progress. The `ResetContentButton` shows a spinner with no detail.
2. **Media sizes not generated** — the `Media` collection defines `imageSizes` (thumbnail 400px, poster 800px, hero 1920px, og 1200×630) but uploaded images don't get resized. The sizes object on media docs is empty or missing.
3. **Root URL broken** — visiting `/` (which redirects to `/en` → `page.tsx`) shows "Content loading… Run the seed script" even after a successful seed. But `/home` (which goes to `[slug]/page.tsx`) renders correctly.
4. **No contact form** — the `ContactForm` block only stores labels. There's no actual form collection, no submissions, no `@payloadcms/plugin-form-builder`.

## Acceptance Criteria

### Task A — Seed logs
- [ ] Seed endpoint streams or collects per-step logs (e.g. `[seed-admin] Done`, `[seed-media] Uploaded: file.png`, etc.)
- [ ] `ResetContentButton` displays a real-time or post-completion log panel in the admin UI
- [ ] Logs are persisted in `sessionStorage` so they survive a page navigation (key: `rfe-seed-logs`)
- [ ] Each seed function logs start/end with item counts

### Task B — Media image sizes
- [ ] After seeding, media documents have populated `sizes.thumbnail`, `sizes.poster`, `sizes.hero`, `sizes.og`
- [ ] Image resizing uses `sharp` (already in config)
- [ ] Verify in admin: open a media item → sizes tab shows generated variants
- [ ] Verify on frontend: `<Image>` components can use `poster.sizes.poster.url`

### Task C — Root URL fix
- [ ] `/` → `/en` → home page content renders correctly (not "content loading")
- [ ] `/en` renders the same content as `/en/home`
- [ ] Fix is either: add `dynamic = 'force-dynamic'` to root page, or fix the `_status` query, or fix revalidation after seed
- [ ] Build still passes

### Task D — Contact form (form-builder plugin)
- [ ] `@payloadcms/plugin-form-builder` installed and configured in `packages/cms/src/config.ts`
- [ ] Plugin fields enabled: `text`, `textarea`, `email`, `checkbox`, `message`
- [ ] `forms` and `form-submissions` collections appear in admin
- [ ] Contact form seeded with name, email, message fields
- [ ] `FormBlock` references a form from the `forms` collection (replaces or extends current `ContactForm` block)
- [ ] Frontend renders the form and submits to `/api/form-submissions`
- [ ] Submissions visible in admin panel under Form Submissions
- [ ] Contact page still renders correctly

## Root Cause Analysis

### B — Media sizes
The `seedMedia` function passes a raw `Buffer` via `file.data`. Payload v3 with `@payloadcms/storage-s3` needs to process the image through `sharp` to generate sizes. Possible causes:
- S3 adapter may set `disableLocalStorage: true` by default, preventing temp file writes needed for sharp processing
- The `file` object format may need adjustment
- `sharp` may not have write access to a temp directory

Investigation needed: check if the S3 adapter config needs `disableLocalStorage: false` or if a temp directory must be configured.

### C — Root URL
`app/(frontend)/[locale]/page.tsx` calls `getPageBySlug('home')`. The `Pages` collection has `versions.drafts` enabled, which means Payload auto-filters to `_status: 'published'` when `draft: false`. The seed sets `_status: 'published'`, so the query should return data.

The likely cause is **Next.js static generation caching**: the root page is rendered at build time (or first request) before the seed runs, and the result is cached. The `[slug]/page.tsx` route for 'home' isn't in `generateStaticParams` (explicitly filtered out), so it's always dynamically rendered.

Fix: add `export const dynamic = 'force-dynamic'` to the root page, or ensure the seed triggers revalidation via the existing `revalidateFrontend` utility.

## API / Interface Contracts

### Seed endpoint (enhanced)
```typescript
// POST /api/seed/reset
// Response: { success: boolean; logs: string[]; error?: string }
```

### Form builder plugin config
```typescript
formBuilderPlugin({
  fields: {
    text: true,
    textarea: true,
    email: true,
    checkbox: true,
    message: true,
    select: false,
    radio: false,
    state: false,
    country: false,
    number: false,
    date: false,
    payment: false,
  },
  redirectRelationships: ['pages'],
  formOverrides: {
    admin: { group: 'Forms' },
  },
  formSubmissionOverrides: {
    admin: { group: 'Forms' },
  },
})
```

### FormBlock (new or updated)
```typescript
// blocks/FormBlock.ts — references a form from the forms collection
{
  slug: 'formBlock',
  fields: [
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'title', type: 'text', localized: true },
    { name: 'subtitle', type: 'text', localized: true },
  ],
}
```

### Seed — contact form
```typescript
// seed-forms.ts — seeds the contact form
await payload.create({
  collection: 'forms',
  data: {
    title: 'Contact',
    fields: [
      { blockType: 'text', name: 'name', label: 'Name', required: true, width: '100' },
      { blockType: 'email', name: 'email', label: 'Email', required: true, width: '100' },
      { blockType: 'textarea', name: 'message', label: 'Message', required: true, width: '100' },
    ],
    confirmationType: 'message',
    confirmationMessage: { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Thank you for reaching out. We will get back to you shortly.' }] }], type: 'root', version: 1 } },
  },
})
```

## File Structure (changes)

```
packages/cms/src/
├── config.ts                        # + formBuilderPlugin
├── blocks/
│   ├── FormBlock.ts                 # NEW — relationship to forms collection
│   └── ContactForm.ts              # REMOVE or keep as legacy
├── seed/
│   ├── run-seed.ts                  # + log collection, + seedForms call
│   ├── seed-media.ts                # fix image processing
│   └── seed-forms.ts               # NEW — seed contact form
├── endpoints/
│   └── seed-reset.ts               # + return logs array
├── components/
│   └── ResetContentButton/
│       └── index.tsx               # + log display + sessionStorage
apps/rfe-v0/
├── app/(frontend)/[locale]/
│   └── page.tsx                    # + force-dynamic or revalidation fix
├── components/
│   └── blocks/
│       └── FormBlock/              # NEW — renders form from forms collection
│           └── index.tsx
```

## Verification Checklist

- [ ] `pnpm build` passes
- [ ] Seed runs without errors, logs are visible in admin UI
- [ ] Media items have populated sizes (thumbnail, poster, hero, og)
- [ ] `/` shows the home page correctly (not "content loading")
- [ ] `/en` and `/en/home` show identical content
- [ ] Contact form renders on `/contact`
- [ ] Submitting the contact form creates a submission in admin
- [ ] `forms` and `form-submissions` collections visible in admin
- [ ] Log persistence works across page navigation in admin

## Tasks (dependency order)

1. ⏳ **Task C** — Fix root URL (smallest, no deps) — `force-dynamic` + investigate caching
2. ⏳ **Task B** — Fix media image sizes (investigate S3 adapter + sharp pipeline)
3. ⏳ **Task A** — Enhance seed logs + ResetContentButton UI + sessionStorage
4. ⏳ **Task D** — Install form-builder plugin, create FormBlock, seed contact form, build frontend component

Dependencies: A,B,C are independent. D depends on nothing but is the largest task.

## Branch

`fix/seed-media-forms`
