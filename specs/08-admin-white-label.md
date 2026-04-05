# Spec 08: White-Label Payload Admin Panel

## Context

The Payload CMS admin panel currently uses default Payload branding. The admin panel should reflect the RFE brand identity — dark cinematic tones, gold accents, and Sackers Gothic typography — to provide a cohesive experience for content editors.

## Acceptance Criteria

- [ ] Sidebar nav shows the RFE "R" monogram icon (gold on dark)
- [ ] Login page shows the full "RFE" wordmark logo (gold, letter-spaced)
- [ ] Login page includes the tagline "True Crime. Real Drama." below the logo
- [ ] Browser tab shows the RFE favicon (`/icon.svg`)
- [ ] Browser tab title uses "— RFE" suffix (already configured)
- [ ] Admin panel color theme uses RFE brand colors (dark bg, warm foreground, gold accents)
- [ ] Admin panel uses Inter as its body font (matching brand sans fallback)
- [ ] Build passes (`pnpm build`)

## API / Interface Contracts

### New components in `@rfe/cms`

| Component | Export path | Type |
|-----------|-----------|------|
| `Icon` | `@rfe/cms/components/Icon` | RSC |
| `Logo` | `@rfe/cms/components/Logo` | RSC |
| `BeforeLogin` | `@rfe/cms/components/BeforeLogin` | RSC |

### Custom CSS

- `packages/cms/src/styles/admin.css` — overrides Payload CSS variables

### Config changes

- `admin.meta.favicon` → `/icon.svg`
- `admin.components.graphics.Icon` → Icon component path
- `admin.components.graphics.Logo` → Logo component path
- `admin.components.beforeLogin` → BeforeLogin component path

## File Structure

```
packages/cms/src/
├── components/
│   ├── Icon/index.tsx          ← NEW: sidebar nav icon
│   ├── Logo/index.tsx          ← NEW: login page logo
│   ├── BeforeLogin/index.tsx   ← NEW: tagline under logo
│   └── ResetContentButton/index.tsx  (existing)
├── styles/
│   └── admin.css               ← NEW: brand CSS overrides
└── config.ts                   ← MODIFIED: wire components + CSS
```

## Verification Checklist

- [ ] `pnpm build` succeeds
- [ ] Admin panel at `/admin` shows RFE icon in sidebar
- [ ] Login page shows RFE logo and tagline
- [ ] Admin theme uses dark bg with gold accent colors
- [ ] Favicon shows RFE "R" in browser tab
