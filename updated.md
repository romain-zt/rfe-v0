# Feedback Update Log — 18 Apr 2026

Tracks what was applied from the two emails received this week, and what we deliberately did **not** apply (those items live in `to-refine.md`).

---

## Source emails

### 1. Michael Kaufman — 15 Apr 2026, 10:32

> Hope all is well. Happy to get on a call with you to talk this through… But here are some brief notes to work on until we can have a group call with Kara and Elisabeth. Please note that Kara's bio was being reworked so don't worry about that for the moment.
>
> Below are my suggestions on a new edit for Intro to RFE and Bios. As well I edited the links and projects to feature for "produced" and in development (paid and not paid) in addition to providing press links.

Full text + structured project lists + 12 press URLs + 5 poster screenshots: see `__ignored/feedback-michael.md`.

### 2. Elisabeth Rohm — 12 Apr 2026, 06:06

> One thing I would say is, I wouldn't put my photograph on all of the pages of the slides of the deck. I think it's nice to have both me and Kara on the front page and then I think we just have to find a different background for the rest of the pages.
>
> When we speak, we can go over the projects that are in development versus have already been produced or are in production.

Full text: see `__ignored/feedback-lis.md`.

---

## What was applied

### ✅ Landing page intro copy — *Michael*

Michael's new 2-paragraph intro replaces the old single-paragraph intro everywhere it appeared.

| File | What changed |
|---|---|
| `packages/cms/src/seed/seed-site-config.ts` | `about.heroParagraph` + `about.paragraphs[0]` updated; `about.paragraphs[1]` replaced with the "bold, elevated content / empowering voices" sentence |
| `packages/cms/src/seed/seed-pages.ts` | Home page contentBlock + About page contentBlock + About hero `subtitle` updated to the new copy |

### ✅ Elisabeth Rohm's bio — *Michael*

Michael's full new bio is now in `packages/cms/src/seed/seed-team.ts` (Elisabeth Rohm entry). Adds American Hustle, Joy, Bombshell, lists 8 directed feature films, and adds episodic credits (Law & Order, Chicago Med).

### ✅ Kara Feifer's bio — *interim, Michael flagged it as being reworked*

We applied Michael's drafted Kara bio in `packages/cms/src/seed/seed-team.ts`. ⚠️ Marked in `to-refine.md #7` to swap with the final reworked version when ready.

### ✅ Landing hero — switch to single composite photo — *Lis*

Per Lis: "it's nice to have both me and Kara on the front page". The cinematic hero on the home page is now a single composite photo (her preferred image) instead of the previous two-photo split-screen.

| Item | Location |
|---|---|
| Image file | `apps/rfe-v0/public/assets/team/kara-and-elisabeth.webp` *(easily updatable — drop a new file at this path)* |
| Hero component | `apps/rfe-v0/components/CinematicHero.tsx` (rewritten to render one full-bleed image; vignette / orb / parallax / TOC / scroll indicator preserved; faces credit "Elisabeth Rohm | Kara Feifer" preserved at the bottom) |
| Seed | image path added to `IMAGE_PATHS` in `packages/cms/src/seed/seed-media.ts` so it uploads to S3 on next seed run |

### ✅ New posters (3 replacements + 2 new works) — *Michael*

| Project | Asset path (drop-in for updates) | Source feedback |
|---|---|---|
| **By Midnight** (replaced) | `apps/rfe-v0/public/assets/works/by-midnight.png` | Michael, SERIES #1 + screenshot |
| **Feather** (replaced) | `apps/rfe-v0/public/assets/works/feather.png` | Michael, MOVIES & FEATURES #1 + screenshot |
| **Lie Detector** (replaced) | `apps/rfe-v0/public/assets/works/lie-detector.png` | Michael, PAID DEV #4 + screenshot |
| **The Highlife** (new work) | `apps/rfe-v0/public/assets/works/high-life.png` | Michael, PAID DEV #5 + screenshot |
| **Icky** (new work) | `apps/rfe-v0/public/assets/works/icky.png` | Michael, SERIES #3 + screenshot |

Seed updated:
- `packages/cms/src/seed/seed-works.ts` — Feather + Lie Detector point at the new file paths; Highlife (id 47) and Icky (id 48) added as new entries.
- `packages/cms/src/seed/seed-media.ts` — new files added to `IMAGE_PATHS` so they upload to S3 on next seed.

### ✅ Works reorganized by production stage — *Michael*

Michael's structure: **Produced / In Production / Paid Development / In Development — Movies / In Development — Series**.

| File | Change |
|---|---|
| `packages/cms/src/collections/Works.ts` | Added `productionStage` select field (sidebar) with the 5 values above |
| `apps/rfe-v0/migrations/20260418_120000_works_production_stage.ts` | DB migration creating the enum + adding the column |
| `apps/rfe-v0/migrations/index.ts` | Migration registered |
| `packages/cms/src/seed/seed-works.ts` | All 23 works mentioned by Michael now have a `productionStage` value matching his structure |
| `packages/cms/src/seed/seed-works-groups.ts` | Added 5 new auto-populated groups (`produced`, `in-production`, `paid-development`, `movies-development`, `series-development`); legacy `our-work` / `development` / `home-featured` groups kept for backward compatibility |

**Mapping applied:**

- **Produced** (4): Husband Father Killer, The Dating App Killer, Wife Stalker, Sister's Daughter
- **In Production** (2): Our Daughter Has Disappeared, A Dentist to Die For
- **Paid Development** (3 of 8): Lie Detector, The Highlife, Dispatch *(Blade, Sick Puppy, Bombsquad, The Chase, Nasty Business deferred — see `to-refine.md #5`)*
- **In Development — Movies** (10 of 11): Feather, Margret & Stevie, Murder-in-Law, Flower Girl, Trans Electric, Rescue of Jerusalem, If You Tell, Ruby Falls, Murder Your Darlings, Passing Love *(1% Better deferred — see `to-refine.md #5`; "Passing Falls" treated as a typo for "Passing Love" — see `to-refine.md #6`)*
- **In Development — Series** (7 of 8): By Midnight, Undefeated, Icky, Diamonds and Deadlines, Two's Company, Matador, The Lobotomist's Wife *(Double Dealer deferred — see `to-refine.md #5`)*

### ✅ Press items — 11 new entries seeded — *Michael*

Michael provided 12 press URLs. 1 was already seeded (Margret & Stevie). The remaining 11 have been added to `packages/cms/src/seed/seed-press.ts` with titles, sources, dates, and descriptions extracted from each article. All 12 items are sorted by date descending.

| # | Date | Source | Title |
|---|---|---|---|
| 1 | 2026-02-01 | Deadline | Shirley MacLaine / Margret and Stevie *(existing)* |
| 2 | 2026-01-30 | Deadline | Lifetime Sets New Movie Slate (Dating App Killer) |
| 3 | 2026-01-20 | Deadline | Murder Your Darlings adaptation |
| 4 | 2025-02-20 | Deadline | Lifetime: Wife Stalker first look |
| 5 | 2024-02-01 | NBC Los Angeles | California Live interview *(date approximate)* |
| 6 | 2023-11-30 | Deadline | RFE company launch |
| 7 | 2023-01-30 | People | Sarah Lawrence cult / Devil in the Dorm |
| 8 | 2022-10-10 | The Wrap | Law & Order S22 directing return |
| 9 | 2022-09-17 | People | Anne Heche remembered / Girl in Room 13 |
| 10 | 2022-09-17 | The List | Girl in Room 13 exclusive interview |
| 11 | 2021-06-29 | ET Online | Killer's Vault podcast |
| 12 | 2021-06-05 | NY Post | Couple seduced serial killers by mail |

`to-refine.md` §7 (press links) removed and remaining items renumbered.

### ✅ Lie Detector & Highlife & Icky — partial credit attribution

Michael wanted **hyperlinked IMDB credits** (Ed Bernero on Lie Detector, Anne Clements + Lauralee Bell on Highlife, Ken Girotti + Wendy Coulas on Icky). Since the Works collection has no structured `credits` field yet, we **inlined the names in the description** as an interim measure. The structured `credits` field is open in `to-refine.md #4`.

---

## What was NOT applied — see `to-refine.md`

| Item | Why deferred | `to-refine.md` § |
|---|---|---|
| Other pages' hero backgrounds (About, Our Work, Development, Press) — Lis "different background" | Ambiguous (Lis was talking about the Canva deck, not necessarily the website) | §1 |
| "Top 5" selection for Movies & Series | Michael's lists have 11 / 8 items with gapped numbering; needs his explicit pick | §2 |
| Finding Atticus as a Work entry | Currently only inside Kara's bio — unclear if it should also be a Work | §3 |
| Structured `credits` field on Works (with IMDB links) | Schema change pending Romain's approval to add a `credits` array | §4 |
| New dev works without provided posters: Blade, Sick Puppy, Bombsquad, The Chase, Nasty Business, 1% Better, Double Dealer | No poster files provided | §5 |
| "Passing Falls" vs "Passing Love" | Suspected typo, not 100% sure | §6 |
| Final Kara bio | Michael flagged hers as "being reworked" | §7 |
| Lis deck redesign | Out of scope (the deck is a separate Canva file) | §8 |

---

## Branch

All changes on a feature branch: `feat/feedback-michael-lis` (suggested name; not yet created — currently on `v2`).

## How to verify locally

```bash
# 1. Run the migration
pnpm --filter @rfe/v0 payload migrate

# 2. Re-seed (idempotent — safe to re-run)
pnpm seed

# 3. Open admin, check:
#    - Works collection: each work has a "Production Stage" sidebar field
#    - Works Groups: 5 new groups exist (produced, in-production, paid-development, movies-development, series-development)
#    - Team Members: Elisabeth + Kara bios are the new versions
#    - Pages: Home & About show the new intro copy

# 4. Open the website home page → hero should be one composite photo of both
```
