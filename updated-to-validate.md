# Updates To Validate — log

Tracks changes that have been **implemented but not yet validated** (build/seed/visual QA pending, or awaiting Romain/Michael/Lis sign-off). Once validated, items move to `updated.md`. Once rejected or reworked, they get removed and the relevant question moves to `to-refine.md`.

> **Why this file exists:** `updated.md` is the source of truth for what's confirmed shipped. As we iterate quickly we want a staging log so we don't lose track of what still needs eyes on it.

---

## How to use this file

For each unvalidated change, document:

- **What was applied** (1-line summary)
- **Source of the request** (email, call, refinement decision, etc.)
- **Files touched**
- **Branch** (if on a feature branch)
- **Verification checklist** — what needs to be checked before this can be promoted to `updated.md`
- **Open risks / known caveats**

When validated → cut+paste the entry into `updated.md` under "What was applied" and delete it from here.
When rejected → delete it from here and (if still open) add the question to `to-refine.md`.

---

## Pending validation

### ⏳ Structured `credits[]` on Works — *resolves `to-refine.md #4`*

**Date:** 22 Apr 2026
**Source:** Romain's request — credits should not live in free-text description; need IMDB hyperlinks; show one discrete credit per card, full credit list on detail page.

**What was applied:**

- New `credits` array field on the `Works` collection: `{ name, role (select), imdbUrl?, note?, isHeadline }[]`. Roles: director, writer, ep, producer, star, showrunner, co-producer, creator, other.
- DB migration `20260422_*_works_credits` (table + enum + FK + indexes).
- Seed: credits added to 13 works (Husband Father Killer, Dating App Killer, Wife Stalker, Lie Detector, Highlife, Icky, Feather, Margret & Stevie, By Midnight, Dispatch, Girls Can't Play Pool ×2). Descriptions stripped of inlined credits to avoid double-display.
- Card UI (`WorkGrid.tsx`): one uppercase headline credit line below tags, opens IMDB in `_blank` when URL present, ≥44px touch target. Hidden when no credits.
- Detail UI (`WorkPageContent.tsx`): dedicated "Credits" section between description and contact CTA, role-grouped, IMDB links underlined, mobile-stacked / desktop-inline.
- i18n: `t.credits.byRole` (card prefix) + `t.credits.roleLabel` (detail section) + `sectionTitle` in `build-ui-dictionary.ts`.

**Files touched (11):** Works collection + migration + migrations index + seed-works + cms types + i18n types + layout mapper + i18n dictionary + WorkGrid + WorkPageContent + detail page.tsx (credits pass-through).

**Branch:** *(uncommitted on `v2`)*

**Verification checklist:**

- [x] `pnpm --filter @rfe/v0 payload migrate` ran clean
- [x] `pnpm --filter @rfe/v0 build` passes
- [x] `pnpm seed` runs (idempotent)
- [x] No new lint errors
- [ ] `/en/our-work` cards show "DIRECTED BY ELISABETH ROHM" / "SHOWRUNNER ED BERNERO" / etc. on the right cards
- [ ] Cards without credits show nothing extra (no empty space)
- [ ] Click a credit pill on a card → does NOT navigate to the work detail (stopPropagation works); opens IMDB if `imdbUrl` set
- [ ] `/en/our-work/lie-detector` detail page shows "Credits" section: `Showrunner — Ed Bernero — creator of Criminal Minds`
- [ ] Mobile breakpoints OK at 320 / 375 / 768 (role label stacks above name on mobile, inline on sm+)
- [ ] Lie Detector / Highlife / Icky / Feather / Margret & Stevie / By Midnight / Dispatch / HFK / DAK / Wife Stalker descriptions no longer mention the credited names
- [ ] Admin: Works → any work → "Credits" array editor works; can add IMDB URLs via the admin UI (validation requires `https://www.imdb.com/...`)

**Open caveats:**

- **No IMDB URLs in seed** — Romain to fill them in via admin (validation enforces `https://www.imdb.com/` prefix).
- **Icky description rewrite:** original was 100% credits; subagent set it to "A new dramatic series." — Romain may want stronger logline once available.
- **Headline picking** — auto-defaults to first credit if none flagged. Worth scanning admin to confirm the right credit is the headline on each work.

---

### ⏳ Works detail route restored — *fixes 404 on every `/our-work/[slug]` link*

**Date:** 22 Apr 2026
**Source:** Romain reported every detail link 404'd (e.g. `/en/our-work/a-dentist-to-die-for`).
**Root cause:** Commit `a373019` (5 Apr 2026, *"feat(cms): Payload-only layout content..."*) deleted `our-work/[slug]/page.tsx` + `WorkPageContent.tsx` and never restored them. `WorkGrid.tsx` still links to `/${lang}/our-work/${slug}`, so every click hit the catch-all and 404'd.

**What was applied:**

- Recreated `apps/rfe-v0/app/(frontend)/[locale]/our-work/[slug]/page.tsx` (server, metadata + JSON-LD + breadcrumbs).
- Recreated `apps/rfe-v0/app/(frontend)/[locale]/our-work/[slug]/WorkPageContent.tsx` (client; YouTube embed fallback, poster placeholder, tags, description, contact CTA).
- New: `productionStage` badge surfaced on the detail hero (matches `WorkGrid.tsx` badge).
- New: `min-h-[44px]` on back-link and contact CTA (mobile touch-target rule).
- New: graceful charcoal placeholder when `work.src` is empty.
- `t.nav?.contact` uses optional chaining to survive incomplete dictionaries.

**Files touched (2 new):**

| File | What changed |
|---|---|
| `apps/rfe-v0/app/(frontend)/[locale]/our-work/[slug]/page.tsx` | Recreated — server page w/ `generateStaticParams`, `generateMetadata`, JSON-LD |
| `apps/rfe-v0/app/(frontend)/[locale]/our-work/[slug]/WorkPageContent.tsx` | Recreated — client view w/ stage badge, video, tags, contact CTA |

**Branch:** *(not yet created — uncommitted on `v2`)*

**Verification checklist (TODO before promoting to `updated.md`):**

- [x] `pnpm --filter @rfe/v0 build` passes — 48 detail paths generated (subagent run, 22 Apr 2026)
- [x] No new lint errors
- [ ] Click a card on `/en/our-work` → loads detail page with poster, title, year, tags, description, stage badge
- [ ] YouTube embed plays for works that have `videoUrl` (e.g. ones with trailers)
- [ ] Contact CTA at the bottom links to `/en/contact` and is ≥44px tall on mobile
- [ ] Back link returns to `/en/our-work`
- [ ] Mobile breakpoints OK at 320 / 375 / 768
- [ ] OG/Twitter meta + JSON-LD validate (View Source on a few works)

**Open caveats:**

- Detail page CTA copy is the legacy "go to contact" pattern — may want richer credits/links once the structured `credits` field lands (`to-refine.md #4`).

---

### ⏳ Works `productionStage` surfaced on frontend — *resolves IA sub-question of `to-refine.md #5`*

**Date:** 22 Apr 2026
**Source:** Romain's question on the group call refinement — *"for paid development / movies & features / series is that something we should completely change (pages/menu filter) or is it more like attributes?"*
**Decision:** Option A — keep 2 pages, surface stages as badges (`/our-work`) and tabs (`/development`). Nav stays at 5 items (mobile-first rule).

**What was applied:**

- `/our-work` now shows the 6 produced + in-production works in a **single grid** with a **stage badge per card** (PRODUCED / IN PRODUCTION). Sort: in-production first, then produced.
- `/development` now shows **3 subcategory tabs** (Paid Development · Movies · Series), filtered by `productionStage` instead of the legacy `category` field.
- No DB migration (the column already exists).
- No nav change, no new pages, no schema change.

**Files touched (6):**

| File | What changed |
|---|---|
| `apps/rfe-v0/lib/i18n/types.ts` | `ProductionStage` union + `PRODUCTION_STAGE_LABELS` + `PRODUCTION_STAGE_TAB_LABELS` constants; `productionStage?` on `WorkItem` |
| `apps/rfe-v0/lib/cms.ts` | `productionStage?` on `Work` type |
| `apps/rfe-v0/app/(frontend)/[locale]/layout.tsx` | Mapper now includes `productionStage: w.productionStage` |
| `apps/rfe-v0/lib/build-ui-dictionary.ts` | i18n labels for badges + tab labels |
| `apps/rfe-v0/components/WorkGrid.tsx` | New `tabField` prop, productionStage-based tab logic, stage badge in `WorkCard` (top-left pill, `text-[10px] sm:text-xs`, dark semitransparent w/ backdrop-blur) |
| `apps/rfe-v0/components/blocks/WorksGridBlock.tsx` | Switched dev filter from `w.category` → `productionStage`; added stage sort for `/our-work`; passes `tabField` to `WorkGrid` |

**Branch:** `feat/works-production-stage-ui` *(not yet created — currently uncommitted on `v2`)*

**Verification checklist (TODO before promoting to `updated.md`):**

- [ ] `pnpm --filter @rfe/v0 build` completes (subagent reported build stalled at page-data collection due to a pre-existing Payload dev-mode migration prompt, unrelated to this change — needs a clean re-run)
- [ ] `pnpm seed` runs cleanly
- [ ] `/en/our-work` shows exactly 6 cards
- [ ] In-Production cards appear before Produced cards
- [ ] Stage badges visible on every poster, legible on both light and dark posters
- [ ] `/en/development` shows 3 tabs (Paid Development · Movies · Series)
- [ ] Tab switching filters correctly; tab counts match seed (3 paid-dev / 10 movies / 7 series)
- [ ] Mobile breakpoints OK at 320 / 375 / 768
- [ ] Home page `featuredWork` block unaffected
- [ ] Legacy `category` field still works (no other page broken)

**Open caveats / decisions deferred to verification:**

- Inside `/development` tabs: should badges still appear on each card (redundant with active tab) or be hidden? — current implementation shows them; revisit during visual QA.
- Plan doc at `plans/works-production-stage-ui.md` had 3 follow-up questions; none are blocking.

**Plan reference:** `plans/works-production-stage-ui.md`

---

## Conventions

- ⏳ = pending validation
- ✅ = validated → ready to move to `updated.md`
- ❌ = rejected → delete entry; if still open, add a question to `to-refine.md`
- 🔁 = needs rework → keep here, update the entry with what changed
