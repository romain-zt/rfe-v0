# Spec 03: Extract Payload CMS Package

## Context

Payload CMS code (collections, globals, blocks, seeds, config) was embedded
directly in `apps/rfe-v0/`. Extracting it into `@rfe/cms` makes schemas
portable and keeps the app thin.

## Acceptance Criteria

- [x] `packages/cms/` exists with `package.json` name `@rfe/cms`
- [x] Collections (Users, Media) live in `packages/cms/src/collections/`
- [x] Config factory `buildRfeConfig()` lives in `packages/cms/src/config.ts`
- [x] Seed functions live in `packages/cms/src/seed/`
- [x] `apps/rfe-v0/payload.config.ts` is a thin wrapper calling `buildRfeConfig()`
- [x] `apps/rfe-v0/scripts/seed/index.ts` is a thin runner importing `runSeed` from `@rfe/cms/seed`
- [x] Old `collections/`, `scripts/seed/seed-admin.ts` deleted from app
- [x] Debug fetch removed from `app/(payload)/layout.tsx`
- [x] `pnpm build` succeeds
- [x] App still keeps `payload`, `@payloadcms/next`, `@payloadcms/ui`, `@payloadcms/storage-s3` as direct deps (needed by auto-generated importMap and admin routes)

## Verification Checklist

- [x] `pnpm install` succeeds
- [x] `pnpm build` exits 0 (114/114 pages)
- [x] Admin panel routes compile (`/admin/[[...segments]]`)
- [x] No `@payloadcms/db-postgres` or `@payloadcms/richtext-lexical` imports remain in app source
