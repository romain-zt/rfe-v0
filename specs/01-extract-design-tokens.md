# Spec 01: Extract Design Tokens Package

## Context

Brand tokens (colors, section tones, easings, fonts, radius) are defined inline in
`apps/rfe-v0/app/(frontend)/[locale]/globals.css`. Extracting them into `@rfe/design-tokens`
makes them importable by any package or future app without coupling to the website CSS.

## Acceptance Criteria

- [ ] `packages/design-tokens/` exists with `package.json` name `@rfe/design-tokens`
- [ ] `src/index.css` contains all `:root` custom property declarations (colors, tones, easings, radius)
- [ ] `src/tokens.ts` exports typed constants mirroring every CSS variable
- [ ] `src/index.ts` re-exports the TS tokens
- [ ] `apps/rfe-v0/globals.css` imports `@rfe/design-tokens/css` instead of declaring tokens inline
- [ ] `apps/rfe-v0` lists `@rfe/design-tokens` as a workspace dependency
- [ ] Visual output is identical before/after extraction (no regressions)
- [ ] `pnpm build` succeeds from root

## API / Interface Contracts

### CSS entry point (`@rfe/design-tokens/css`)

```css
:root {
  --background: #070708;
  --foreground: #F5F0EB;
  --rfe-red: #8B1A1A;
  --rfe-rose: #C4A0A0;
  --rfe-gold: #B5975A;
  --rfe-gold-dim: rgba(181,151,90,0.6);
  --rfe-rose-dim: rgba(196,160,160,0.5);
  --tone-deep: #050506;
  /* ... all tones ... */
  --ease-emerge: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-quiet: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-sharp: cubic-bezier(0.76, 0, 0.24, 1);
  --radius: 0.25rem;
}
```

### TS entry point (`@rfe/design-tokens`)

```typescript
export const colors = {
  background: '#070708',
  foreground: '#F5F0EB',
  rfeRed: '#8B1A1A',
  rfeRose: '#C4A0A0',
  rfeGold: '#B5975A',
  rfeGoldDim: 'rgba(181,151,90,0.6)',
  rfeRoseDim: 'rgba(196,160,160,0.5)',
} as const

export const tones = { deep: '#050506', /* ... */ } as const
export const easings = { emerge: 'cubic-bezier(0.16, 1, 0.3, 1)', /* ... */ } as const
```

### What stays in globals.css

- Tailwind imports
- shadcn/dark theme mappings (`@theme inline`, `.dark`)
- Cinema effect classes (`.cinema-*`, `.bw-media`, reveals, vignette, etc.)
- Sackers Gothic `@font-face` (references `public/fonts/` — app-local)

## File Structure

```
packages/design-tokens/
├── package.json
├── tsconfig.json          # extends @rfe/tsconfig/react-library.json
├── src/
│   ├── index.css          # CSS custom properties
│   ├── tokens.ts          # TS constants
│   └── index.ts           # barrel re-export
└── README.md
```

## Verification Checklist

- [ ] `pnpm build` succeeds
- [ ] App renders with identical colors, tones, easings
- [ ] CSS variables are accessible in browser devtools under `:root`
- [ ] TS types are importable: `import { colors } from '@rfe/design-tokens'`
