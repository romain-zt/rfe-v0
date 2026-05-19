# Spec 11: Uniform Poster Previews

## Context

Work list previews use mixed aspect ratios (16/9, 2/3, 3/4, 1/1) in `WorkGrid` and `WorksScrollBlock`, which makes the site feel inconsistent. Production-stage badges ("In Production", etc.) duplicate information already shown in filter tabs.

## Acceptance Criteria

- [ ] All list/grid preview image frames use a single portrait ratio (ISO A4: `210/297`)
- [ ] No `productionStage` overlay badges on `WorkGrid` cards
- [ ] `WorksScrollBlock` scroll items use the same ratio (PR-2)
- [ ] Filter tabs and genre tags under titles remain unchanged
- [ ] Work detail hero (`aspect-video`) unchanged

## API / Interface Contracts

```ts
// @rfe/design-tokens
export const posterPreviewAspect = '210/297' as const
export const posterPreviewWidth = 'clamp(168px, 18vw, 252px)' as const
```

## File Structure

```
packages/design-tokens/src/tokens.ts
apps/rfe-v0/components/WorkGrid.tsx
apps/rfe-v0/components/blocks/WorksScrollBlock.tsx  (PR-2)
```

## Verification Checklist

- [ ] `pnpm build` passes
- [ ] Our Work + Development grids: uniform portrait frames, no stage pills
- [ ] Horizontal works scroll: uniform portrait frames
- [ ] Mobile (375px) and desktop (1440px) checked
