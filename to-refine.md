# To Refine — Open Questions

Items raised by Michael's and Lis's feedback (15–18 Apr 2026) that we deliberately did **not** apply yet. Bring these up on the next group call.

> Source emails:
> - `__ignored/feedback-michael.md`
> - `__ignored/feedback-lis.md`

---

## 1. Lis — page hero backgrounds (other than landing)

**Quote (Lis):** *"I think it's nice to have both me and Kara on the front page and then I think we just have to find a different background for the rest of the pages."*

- **Current behavior:** the website's About / Our Work / Development / Press pages all use `/assets/portfolio-medias/elisabeth-1.png` as their hero background (fallback in `seed-pages.ts → resolveHeroMedia()`).
- **Ambiguity:** Lis was talking about the **Canva deck**, but the same complaint applies to the website.
- **Decision needed:** for each page (About, Our Work, Development, Press), what should the hero background be?
  - Project poster collage?
  - Behind-the-scenes still?
  - Abstract texture / cinematic gradient?
  - Different per page?

---

## 2. Michael — "top 5" selection for Movies & Series

**Quote (Michael):** *"My suggestion is to only take the top five to share on the website"* — for both MOVIES & FEATURES and SERIES.

His list under MOVIES & FEATURES has 11 items with gapped numbering (1, 2, 5, 6, 7, 8, 9, 10, 11, 12). His list under SERIES has 8.

**Decision needed:** which 5 movies and which 5 series should be shown on the website?

Movies pool: Feather, 1% Better, Margret & Stevie, Murder-In-Law, Flower Girl, Transelectric, Rescue of Jerusalem, If You Tell, Ruby Falls, Murder Your Darlings, Passing Falls.

Series pool: By Midnight, Undefeated, Icky, Diamonds and Deadlines, Two's Company, Matador, The Lobotomist's Wife, Double Dealer.

---

## 3. Michael — Finding Atticus

**Quote (Michael, in Kara's bio):** *"the Christmas movie Finding Atticus, which she will produce alongside Brad Krevoy, with Lorenzo Nardini exec producing. Boris Kodjoe is attached to direct from a script by Jennifer Maisel, and Nicole Ari Parker is attached to star."*

**Decision needed:** Is "Finding Atticus" also a Work entry (with poster + credits), or is it only mentioned inside Kara's bio? Currently treated as bio-only.

---

## 4. ✅ RESOLVED (22 Apr 2026) — Michael — talent / credits as a structured field

**Status:** Shipped (pending visual validation). See `updated-to-validate.md` → "Structured `credits[]` on Works".

Schema added: `{ name, role (select), imdbUrl?, note?, isHeadline }[]`. Card shows headline credit; detail page shows full role-grouped Credits section. Romain still needs to fill IMDB URLs via admin (validation enforces `https://www.imdb.com/` prefix).

**Original ask (kept for reference):**

Michael wants name credits **hyperlinked to IMDB** on:
- Lie Detector → Ed Bernero (showrunner & creator of Criminal Minds)
- The Highlife → Anne Clements (Black Mafia Family), Lauralee Bell (Young & the Restless)
- Icky → Ken Girotti, Wendy Coulas
- By Midnight → Kat Rose Martin (writer)
- Margret & Stevie → Matthew Weiner (director), Shirley MacLaine (star)
- Feather → Vernon Scott (writer), Latigo Films (co-producer)
- Husband Father Killer → Elisabeth Rohm (director), Kara Feifer (EP)
- Wife Stalker → Elisabeth Rohm (director), Kara Feifer (EP)
- The Dating App Killer → Elisabeth Rohm (director), Kara Feifer (EP)
- Finding Atticus → Brad Krevoy (producer), Lorenzo Nardini (EP), Boris Kodjoe (director), Jennifer Maisel (writer), Nicole Ari Parker (star)

**Current schema:** `Works` collection has no `credits` field — talent is currently only inside the free-text `description`.

**Decision needed:** approve adding a `credits` array field `{ name, role, imdbUrl }` to the `Works` collection? (Requires a DB migration.)

---

## 5. Michael — new dev works without provided posters

The following projects appear in Michael's list but he did **not** provide poster images:

- **PAID DEVELOPMENT:** Blade, Sick Puppy, Bombsquad, The Chase: The Josephine Wentzel Story, Nasty Business
- **MOVIES & FEATURES:** 1% Better
- **SERIES:** Double Dealer

(He linked Canva slides for them but those are screenshots, not poster files.)

**Decision needed:** do you have proper poster files for these somewhere? Otherwise we'll seed them with a placeholder and you can upload via the admin panel.

> **IA sub-question — RESOLVED (22 Apr 2026):** "Should paid development / movies & features / series be separate pages/menu items, or attributes on Works?" → **Attributes.** Implementation: `/our-work` shows produced + in-production with stage badges per card; `/development` shows 3 subcategory tabs (Paid Dev · Movies · Series). Nav stays at 5 items. See `updated-to-validate.md` → "Works productionStage surfaced on frontend". Still pending: the missing poster files above.

---

## 6. Michael — "Passing Falls" or "Passing Love"?

Michael's list item #12 under MOVIES & FEATURES is **"PASSING FALLS"**. The existing seed has **"Passing Love"** (id 6). The descriptions don't obviously match.

**Decision needed:** typo, or two different projects?

---

## 7. Kara's bio — "being reworked"

**Quote (Michael):** *"Please note that Kara's bio was being reworked so don't worry about that for the moment."*

We applied Michael's drafted Kara bio anyway as an interim improvement over the existing one. **Replace it with the final reworked version when it's ready.**

---

## 8. Dead `showFilters` prop on `worksGrid` block — *surfaced 22 Apr 2026 during 404 fix*

`packages/cms/src/seed/seed-pages.ts:228` sets `showFilters: true` on the `/our-work` `worksGrid` block, and the field is defined in `packages/cms/src/blocks/WorksGrid.ts:58–61`. **Neither `WorksGridBlock.tsx` nor `WorkGrid.tsx` reads it** — filter behavior is fully driven by `tabField`/`showSubcategoryTabs` since the `productionStage` refactor.

**Decision needed:** remove the dead prop from the block schema + seed, OR wire it up to actually toggle a tag-based filter row on `/our-work`?

**Recommendation:** remove it. Admins toggling a no-op switch is worse than no switch.

---

## 9. Dedicated pages per work group? — *surfaced 22 Apr 2026 during 404 fix*

Open question: should each filtered work group (Produced, In Production, Paid Dev, Movies, Series) get its own URL?

**Trade-offs:**
- Pro dedicated pages: SEO (canonical URL + h1 + meta per stage), shareable links ("send investors the in-development series"), per-stage intro copy.
- Pro current single-page: simpler IA, only 5–10 items per stage, keeps nav at 5 items, no URL sprawl.

**Wrong primitive:** Next.js parallel routes (`@slot`) — those are for simultaneous panels, not filtered views.

**Three viable options if we change anything:**

1. **Query param** (`/our-work?stage=in-production`) — ~10 LOC, no route changes, shareable URLs. Best if the goal is just "send a filtered link".
2. **Sub-pages via `works-groups`** (`/our-work/produced`, `/our-work/in-production`, etc.) — half-day work, reuses the existing 5 groups already in the collection. Best if the goal is SEO or per-stage intro copy.
3. **Do nothing** — current single-page is correct for the content volume. Best if neither shareability nor SEO is a real need yet.

**Decision needed:** what's the underlying goal — SEO juice per stage, shareable filtered links, or future expansion with stage-specific intros? The answer picks the option.

---

## 10. Lis — deck redesign

**Quote (Lis):** *"I wouldn't put my photograph on all of the pages of the slides of the deck."*

This is about the **Canva deck**, not the website. Out of scope for this project (the deck is a separate Canva file).

---
