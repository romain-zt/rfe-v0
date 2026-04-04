# .cursor/ — RFE Payload CMS Migration

## What this is

Cursor config for the **progressive migration** of the RFE (Rohm Feifer Entertainment) website from a hardcoded Next.js site to an integrated **Next.js + Payload CMS** application.

## Repo identity

- **Domain:** Cinema / film & TV production studio website
- **Stack:** Next.js 16, React 19, Tailwind v4, pnpm
- **Target CMS:** Payload CMS (integrated in the same Next.js app)
- **Database:** Postgres
- **Storage:** S3-compatible object storage (MinIO locally, S3/R2 in production)
- **Deployment:** Docker / VPS / self-host (migration away from Vercel)
- **i18n:** en-US from day one, architecture ready for additional locales

## Current state

The site currently has:
- All content hardcoded in TypeScript (`content.ts`, `lib/i18n/fallback/en.ts`, `fr.ts`)
- i18n strings loaded from Google Sheets CSV (with TS fallbacks)
- Design tokens in CSS variables (`globals.css`) — RFE palette, section tones, easings
- ~44 work items with poster images, categories, tags, descriptions
- Team members, awards/news, contact info, about content, legal pages
- Custom cinematic visual effects (grain, cinema depth, lens, leak)
- Brand font: Sackers Gothic
- Rich SEO setup in `lib/seo.ts`

## Migration philosophy

1. **Progressive** — migrate one page/feature at a time, never all-at-once
2. **Seed-first** — every migration step includes runnable seeds; no manual admin setup
3. **Content-preserving** — inspect existing content before modeling; don't invent from scratch
4. **Branch-safe** — never push to `main`/`master`; always work on feature branches
5. **Docker-first** — local dev uses Docker Compose (app + Postgres + MinIO)
6. **i18n-ready** — Payload localization configured from day one
7. **Design-system-in-CMS** — branding/colors/typography become editable in Payload
8. **Clean-while-migrating** — improve structure when adjacent and safe, never big rewrites

## Directory layout

```
.cursor/
├── README.md           ← this file
├── rules/              ← always-on project rules
├── agents/             ← specialized agent personas
├── commands/           ← slash commands
└── skills/             ← step-by-step skill guides
```

## Key rules

| Rule file | Purpose |
|-----------|---------|
| `00-project-context` | What this repo is, stack, conventions |
| `10-architecture-boundaries` | Frontend / Payload / shared boundaries |
| `20-progressive-migration` | How to migrate safely |
| `25-branch-safety` | Never push to main |
| `30-seed-first` | Seeds are mandatory |
| `35-i18n-policy` | Localization from day one |
| `40-media-storage` | Media strategy (S3, locale-aware assets) |
| `45-docker-first` | Docker-first local development |
| `50-design-system-in-cms` | Branding config in Payload |
| `55-clean-while-migrating` | Improve adjacent code safely |
| `60-testing-verification` | Build/lint/type-check gates |
| `70-definition-of-done` | What "done" means for a migration step |
