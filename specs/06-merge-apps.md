# Spec 06: Merge Frontend into Admin (Single Integrated App)

## Context

The monorepo currently has two separate Next.js apps:

- `apps/admin` — Payload CMS admin panel (port 3001)
- `apps/rfe-v0` — Frontend website (port 3000)

The frontend fetches data from the admin via a REST client (`@rfe/cms/client.ts`), proxied through rewrites. This requires two Vercel projects, CORS configuration, and adds network latency on every data fetch.

The architecture rules (`.cursor/rules/10-architecture-boundaries.mdc`) specify an **integrated** architecture with `(frontend)/` and `(payload)/` route groups in the same app. The split was a migration stepping stone. Now that both apps work, we merge them into one for simpler deployment, better performance (Local API), and reduced infrastructure.

## Acceptance Criteria

- [x] Single app at `apps/rfe-v0` contains both `(frontend)/` and `(payload)/` route groups
- [x] `payload.config.ts` lives in `apps/rfe-v0/`
- [x] `next.config.mjs` uses `withPayload()` wrapper
- [x] Frontend data fetching uses Payload Local API (`getPayload()` + `payload.find()`) instead of REST client
- [ ] Seed script works from the merged app (`pnpm seed`)
- [x] `middleware.ts` skips `/admin` and `/api` routes (already does)
- [ ] All existing pages render correctly
- [ ] Live preview still works (same-origin now)
- [x] `apps/admin/` directory is deleted
- [x] `@rfe/cms/client.ts` (REST client) is no longer used by the app
- [x] Single set of env vars (DATABASE_URL, PAYLOAD_SECRET, S3_*, etc.)
- [x] `pnpm build` succeeds
- [x] Root `package.json` scripts updated (no more `dev:admin` / `dev:web` split)

## API / Interface Contracts

### Data access — before vs after

**Before (REST client):**
```typescript
import { createPayloadClient } from '@rfe/cms/client'
const cms = createPayloadClient(process.env.CMS_API_URL || 'http://localhost:3001')
const { docs } = await cms.find<Work>('works', { limit: '100' })
```

**After (Local API):**
```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'works', limit: 100, depth: 1 })
```

### Env vars (merged)

```env
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=...
S3_BUCKET=rfe-media
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_REGION=us-east-1
S3_ENDPOINT=                    # empty for production S3/R2, set for MinIO
NEXT_PUBLIC_SITE_URL=...        # for SEO, preview, CORS
PREVIEW_SECRET=...
REVALIDATION_SECRET=...
GOOGLE_SHEET_ID_EN=...          # existing i18n
GOOGLE_SHEET_ID_FR=...
PAYLOAD_ADMIN_EMAIL=...         # dev seed only
PAYLOAD_ADMIN_PASSWORD=...      # dev seed only
```

No more `CMS_API_URL` or `NEXT_PUBLIC_CMS_URL`.

## File Structure (after merge)

```
apps/rfe-v0/
├── app/
│   ├── (frontend)/             ← existing frontend routes (unchanged)
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   ├── our-work/[slug]/
│   │   │   ├── globals.css
│   │   │   └── content.ts
│   │   └── next/               ← preview/revalidate routes
│   ├── (payload)/              ← from apps/admin
│   │   ├── layout.tsx
│   │   ├── custom.scss
│   │   ├── admin/
│   │   │   ├── [[...segments]]/page.tsx
│   │   │   └── importMap.js
│   │   └── api/
│   │       └── [...slug]/route.ts
│   ├── favicon.ico
│   ├── robots.ts
│   └── sitemap.ts
├── components/                 ← existing
├── hooks/                      ← existing
├── lib/
│   ├── cms.ts                  ← rewritten to use Local API
│   └── ...
├── scripts/
│   └── seed/
│       └── index.ts            ← from apps/admin
├── payload.config.ts           ← from apps/admin
├── payload-types.ts            ← generated
├── next.config.mjs             ← merged (withPayload + frontend config)
├── middleware.ts               ← existing (already skips /admin, /api)
├── postcss.config.mjs          ← existing
├── tsconfig.json               ← existing (add .next/dev/types)
├── public/                     ← existing
└── package.json                ← merged dependencies
```

## Migration Steps

### Phase 1: Copy Payload files into rfe-v0
1. Copy `apps/admin/app/(payload)/` → `apps/rfe-v0/app/(payload)/`
2. Copy `apps/admin/payload.config.ts` → `apps/rfe-v0/payload.config.ts`
3. Copy `apps/admin/payload-types.ts` → `apps/rfe-v0/payload-types.ts`
4. Copy `apps/admin/scripts/seed/` → `apps/rfe-v0/scripts/seed/`

### Phase 2: Merge config
5. Update `apps/rfe-v0/next.config.mjs`: add `withPayload()`, remove media rewrite
6. Merge Payload dependencies from `apps/admin/package.json` into `apps/rfe-v0/package.json`
7. Update `apps/rfe-v0/tsconfig.json` to include Payload generated types
8. Update `apps/rfe-v0/.env.local` with full env set (add DATABASE_URL, PAYLOAD_SECRET, S3_*)

### Phase 3: Rewrite data access
9. Rewrite `lib/cms.ts` to use Payload Local API
10. Update `lib/generate-meta.ts` if it references CMS client
11. Update `components/PageContent.tsx` live preview (same-origin serverURL)
12. Update `components/LivePreviewListener.tsx` if applicable

### Phase 4: Clean up
13. Remove `CMS_API_URL` / `NEXT_PUBLIC_CMS_URL` references
14. Update root `package.json` scripts
15. Update `.env.example` files
16. Delete `apps/admin/`
17. Run `pnpm install` to update lockfile

### Phase 5: Verify
18. `pnpm build` succeeds
19. Dev server starts, admin panel accessible at `/admin`
20. Frontend pages render with CMS data
21. Seed script works

## Verification Checklist

- [x] `pnpm build` passes
- [ ] Dev server: frontend at `localhost:3000/en` renders
- [ ] Dev server: admin at `localhost:3000/admin` renders
- [ ] Seed script runs successfully (`pnpm seed`)
- [ ] Works page loads with CMS data
- [ ] Home page loads with CMS data
- [ ] Live preview works from admin
- [x] No `CMS_API_URL` or `NEXT_PUBLIC_CMS_URL` references remain (only in .next cache)
- [x] `apps/admin/` directory is gone
- [ ] Single Vercel project can deploy this
