# PLAN: Surface `productionStage` on `/our-work` and `/development`

> **Status:** Draft — to review/adapt after the agent finishes the related credits + detail-view work.
> **Branch:** `feat/works-production-stage-ui`
> **Estimated time:** ~2h
> **No DB migration** — `productionStage` already exists as a column on `works`.

---

## Decision: single grid vs tabs

**Locked-in recommendation:**

- **`/our-work`** → **single grid with a stage badge per card** (no tabs).
  - Counts are tiny (4 produced + 2 in production), tabs would feel sparse.
  - A single grid tells a stronger "track record + momentum" story.
- **`/development`** → **keep tabs** (3 categories × ~7–10 items each justifies them).
- **Admin UX is identical either way** — Romain just sets `productionStage` on each work in the sidebar.

---

## Tasks (in dependency order)

### 1. ⏳ Wire `productionStage` end-to-end (type + mapper) — no DB change

- `apps/rfe-v0/lib/i18n/types.ts` → add `productionStage?: ProductionStage` to `WorkItem` + export the union type:
  ```ts
  export type ProductionStage =
    | 'produced'
    | 'in-production'
    | 'paid-development'
    | 'movies-development'
    | 'series-development'
  ```
- `apps/rfe-v0/app/(frontend)/[locale]/layout.tsx` (lines 89–100) → include `productionStage: w.productionStage` in the works mapper.
- Also add `productionStage` to the `Work` type in `apps/rfe-v0/lib/cms.ts`.

### 2. ⏳ `WorkGrid` — render stage badge on poster (depends on 1)

- `apps/rfe-v0/components/WorkGrid.tsx` → render a small badge (top-left of poster) when `productionStage` is set:
  - **PRODUCED** / **IN PRODUCTION** / **PAID DEVELOPMENT** / **IN DEVELOPMENT — MOVIES** / **IN DEVELOPMENT — SERIES**
- **Mobile-first:** `text-[10px] sm:text-xs`, 44px hit-area unchanged, semi-transparent dark pill on light posters.
- Add a `productionStageLabels` map (centralized so it's reusable in tabs).

### 3. ⏳ `WorkGrid` — sort produced / in-production grid by stage (depends on 2)

- When the grid is the "produced" view (no subcategory tabs, no curated source), order:
  1. `in-production` first
  2. then `produced`
  3. then everything else
  4. secondary sort by `sortOrder`

### 4. ⏳ `WorksGridBlock` — switch dev tabs to use `productionStage` (depends on 1)

- `apps/rfe-v0/components/blocks/WorksGridBlock.tsx` (lines 64–67) currently filters dev by `w.category` (legacy).
- Switch to: when `showSubcategoryTabs: true`, filter by `productionStage ∈ {paid-development, movies-development, series-development}`.
- Render 3 tabs (**Paid Development** · **Movies** · **Series**) — wire to `WorkGrid` via a new `tabs` prop OR move tab logic into `WorkGrid`. Pick whichever is cleaner after reading the file.

### 5. ⏳ `/our-work` page seed — switch source to production-stage groups (depends on 1)

- `packages/cms/src/seed/seed-pages.ts` (lines 215–242) → `worksGrid` block sources from `produced` + `in-production`. Three options:
  1. `sourceType: 'group'` × 2 grids
  2. Extend the block to accept multiple groups
  3. **Simplest:** keep `sourceType: 'all'` and let the new client-side filter (Task 3) include both stages
- **Recommend option 3.** Verify Home page's `featuredWork` block is unaffected.

### 6. ⏳ `/development` page seed — already `showSubcategoryTabs: true`, just confirm (depends on 4)

- `packages/cms/src/seed/seed-pages.ts` (lines 244–274) — no change needed beyond Task 4.

### 7. ⏳ i18n labels (depends on 2)

- Add `productionStage` labels to `lib/i18n/fallback/en.ts` (and `fr.ts` if it exists) so badges are translatable.

### 8. ⏳ Verify

- `pnpm --filter @rfe/v0 build` (no migration needed — schema already has the field).
- `pnpm seed`.
- Check `/en/our-work`: 6 cards, badges visible, **In Production first**.
- Check `/en/development`: 3 tabs, switching filters correctly, badges hidden inside dev tabs (or shown — TBD with the implementer).
- Mobile breakpoints: **320, 375, 768**.

---

## Dependencies

- **No DB migration** — `productionStage` already exists on the column.
- **No new Payload collection** — uses existing `works` + `works-groups`.
- **No nav change** — keeps 5 menu items.

---

## Open questions for review

- Inside the `/development` tabs, should badges still appear on each card (redundant with the active tab) or be hidden?
- If we ever want a "Produced" sub-section heading on `/our-work`, do we render two visually-grouped sub-grids or stick with the single sorted grid?
- Should `productionStage` be added to the curated `WorksGroup` items as a fallback display rule when the group mixes stages?
