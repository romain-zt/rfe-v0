# Spec 02: Extract UI Package

## Context

The app has 16 components in `apps/rfe-v0/components/`. Some are generic utilities
(Modal, GrainOverlay, cn), others are app-specific (CinematicHero, Header, WorkGrid).
Only generic, content-free components belong in a shared `@rfe/ui` package.

## Acceptance Criteria

- [ ] `packages/ui/` exists with `package.json` name `@rfe/ui`
- [ ] `cn()` utility is exported from `@rfe/ui`
- [ ] `GrainOverlay` component is exported from `@rfe/ui`
- [ ] `Modal` component is exported from `@rfe/ui`
- [ ] App imports these from `@rfe/ui` instead of local paths
- [ ] App-specific components remain in `apps/rfe-v0/components/`
- [ ] `pnpm build` succeeds
- [ ] All pages render correctly

## Extraction Criteria

A component moves to `@rfe/ui` only if:
1. It has **no app content/data dependency** (no imports from content.ts, i18n, seo, works)
2. It is **generic** (useful in any Next.js app, not just RFE)
3. It does **not import app-specific CSS** (cinema classes are OK if self-contained)

### Moves to @rfe/ui

| Component | Reason |
|-----------|--------|
| `cn()` from `lib/utils.ts` | Pure utility, no deps |
| `Modal` | Generic dialog, only depends on lucide + react |
| `GrainOverlay` | Self-contained visual effect, no content deps |

### Stays in apps/rfe-v0

| Component | Reason |
|-----------|--------|
| `CinematicHero` | App-specific hero with scroll-driven effects |
| `PageCinematicHero` | App-specific inner-page hero |
| `Header` | Hardcoded nav labels, app layout |
| `Footer` | Uses i18n context, app layout |
| `WorkGrid` | Depends on content.ts, works.ts |
| `MediaGallery` | Depends on MEDIA from content.ts |
| `BeforeAfter` | Depends on MEDIA from content.ts |
| `AwardsNews` | Depends on content data |
| `BottomLogoReveal` | App-specific brand effect |
| `JsonLd` | App SEO, depends on seo.ts/works.ts |
| `LanguageContext` | App i18n state |
| `LanguageToggle` | App i18n UI |
| `theme-provider` | Thin re-export, stays local |

## File Structure

```
packages/ui/
├── package.json           # @rfe/ui, peerDeps: react, react-dom
├── tsconfig.json          # extends @rfe/tsconfig/react-library.json
├── src/
│   ├── utils.ts           # cn() utility
│   ├── components/
│   │   ├── Modal.tsx
│   │   └── GrainOverlay.tsx
│   └── index.ts           # barrel export
└── README.md
```

## Verification Checklist

- [ ] `pnpm build` succeeds
- [ ] `import { cn } from '@rfe/ui'` works in app
- [ ] `import { Modal, GrainOverlay } from '@rfe/ui'` works in app
- [ ] All pages render correctly (no broken imports)
- [ ] Modal opens/closes correctly
- [ ] Grain overlay renders on all pages
