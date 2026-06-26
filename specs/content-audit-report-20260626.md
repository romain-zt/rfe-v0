# Content Audit Report — June 26, 2026

Cross-reference of **Canva deck** (72 pages) vs **production DB dump** (`rfe-production--20260626__3.dump`).

---

## 1. Title Discrepancies (Deck vs Production DB)

| Slug | DB Title | Deck Title | Action Taken |
|---|---|---|---|
| `a-dentist-to-die-for` | A Doctor to Die For | A Dentist to Die For: The Sarah Harris Story | **DOUBT** — DB was manually renamed on Jun 22. Deck says "Dentist." Seed uses "A Dentist to Die For" (deck). Confirm with client. |
| `dont-trust-the-girls-upstairs` | Don't Trust The Girls Upstairs | _(no explicit title; text says "Based on the novel My Sister's Daughter")_ | Kept DB title. The deck doesn't give a standalone title, just the book reference. |
| `by-midnight` → `ravenwood` | By Midnight | Ravenwood | Created as **new** slug `ravenwood`. Old `by-midnight` record stays in DB until manual cleanup. Same project — confirmed by identical description & writer (Kat Rose Martin). |
| `murder-your-darlings` → `rabbit-hole` | Murder Your Darlings | Rabbit Hole | Created as **new** slug `rabbit-hole`. Old `murder-your-darlings` stays in DB. Deck says "Inspired by the novel 'Murder Your Darlings' by Jenna Blum." |
| `passing-love` | Passing Love | Passing Love | OK (old seed had "Passing Falls" — typo). Production DB is correct. |
| `bombsquad` | Bomb Squad | Bomb Squad | OK — slug kept as `bombsquad`. |
| `the-highlife` | High Life | High Life | OK — slug kept as `the-highlife`. |

---

## 2. Works in Deck but NOT in Production DB (New Additions)

| Deck Page | Title | Slug | Category | Notes |
|---|---|---|---|---|
| 11 | Flying Sideways | `flying-sideways` | film / true-stories-features | Frédéric North biopic. Poster: canva deck page-011 image 01. |
| 22 | Blackwater Bayou | `blackwater-bayou` | film / true-crime-movies | Deepwater Horizon story. Poster: canva deck page-022 image 01. |
| 27 | The Correspondent | `the-correspondent` | series / true-crime-series | By Christina Sweeney-Baird & James Mitchell. Poster: canva deck page-027 image 01. |
| 37 | Augusta | `augusta` | film / dramas-feature | Based on Elisabeth Rohm's novel Nerissa. Poster: canva deck page-037 image 01. |
| 44 | Cuesta | `cuesta` | series / dramas-series | Based on John Lantigua books. Poster: canva deck page-044 image 01. |
| 47 | Ravenwood | `ravenwood` | series / dramas-series | Renamed from "By Midnight". New poster from canva deck. |
| 49 | Rabbit Hole | `rabbit-hole` | series / dramas-series | Renamed from "Murder Your Darlings". Reuses murder-your-darlings.jpg poster. |
| 51 | Intent | `intent` | series / dramas-series | Chernuchin & Intrieri. Poster: canva deck page-051 image 01. |
| 52 | American Serial | `american-serial` | series / dramas-series | Ted Bundy story. Poster: canva deck page-052 image 01. |
| 56 | Wife on The Edge | `wife-on-the-edge` | series / franchises | Franchise — wheel of movies. Poster: canva deck page-056 image 01. |
| 57 | ICON | `icon` | series / franchises | Premium anthology franchise. Poster: canva deck page-057 image 01. |
| 59 | A Not So Silent Night | `a-not-so-silent-night` | film / holiday-features | **NO POSTER** — deck page 59 only has RFE logo. |
| 59 | Mistletoe and Holly | `mistletoe-and-holly` | film / holiday-features | **NO POSTER** — same page, no individual image. |
| 59 | 25 to Life | `25-to-life` | film / holiday-features | **NO POSTER** — same page, no individual image. |

---

## 3. Works in Production DB but NOT in Deck

These works exist in the production DB but don't appear in the current Canva deck. They are preserved in the seed as "legacy" items.

| DB ID | Title | Production Stage | Notes |
|---|---|---|---|
| 16 | 1% Better | movies-development | No deck page. Generic description ("Project in active movies development."). |
| 19 | Flower Girl | movies-development | Virginia Cherrill story. Not in deck. |
| 47 | Korean Espionage | series-development | Not in deck. |
| 53 | Southern Gothic | series-development | Not in deck. |
| 50 | Call Me Madam | series-development | Not in deck. |
| 38 | If Anything Happens to Me | _(none)_ | Not in deck. |
| 39 | Sleeping Angel | _(none)_ | Not in deck. |
| 40 | In Not So Loving Memory | _(none)_ | Not in deck. |
| 42 | Darkness Falls | _(none)_ | Not in deck. |

**Recommendation:** Confirm with client whether these should be kept, archived, or removed.

---

## 4. Poster / Image Doubts

| Work | Issue | Resolution |
|---|---|---|
| A Not So Silent Night | No individual poster in the deck. Page 59 only has the RFE logo image. | **No poster in seed.** Client needs to provide one. |
| Mistletoe and Holly | Same as above — no individual poster. | **No poster in seed.** |
| 25 to Life | Same as above — no individual poster. | **No poster in seed.** |
| Ravenwood | Used canva-deck page-047 image 01 (book cover). | OK for now — may want a higher-res poster. |
| Girl in the Bubble | Used canva-deck page-032 image 04 (AI-generated style image). | **DOUBT** — is this the correct poster? Image looks AI-generated. |
| Marrying A Murderer | Used canva-deck page-021 image 01. Production already had poster (media id=80, "Marrying A Murderer.png"). | Seed uses canva image. May want to check production poster is better. |
| Blackwater Bayou | Used canva-deck page-022 image 01. Landscape orientation (960×640). | May want portrait crop for poster grid. |
| The Correspondent | Used canva-deck page-027 image 01. Landscape orientation (967×403). | May want portrait crop for poster grid. |
| Relentless | Used canva-deck page-034 image 01. Landscape orientation (967×405). | May want portrait crop. Existing poster at `/assets/posters/Relentless.png` is also landscape (1010×424). |
| Double Dealer | Canva deck page-026 image 01 (landscape 800×533) vs existing `/assets/works/double-dealer.png` (800×533). | Kept existing poster. |
| Flying Sideways | Used canva-deck page-011 image 01. Landscape (1600×942). | May want portrait crop for poster grid. |

---

## 5. Channel/Platform Logo Doubts

| Platform | In Production DB? | Logo in DB? | Notes |
|---|---|---|---|
| Lifetime | **NO** (not in platforms table) | — | Appears on deck pages 4, 21, 25, 32, 45, 48 as a small logo. Husband/Father/Killer, Wife Stalker, Dating App Killer, Marrying A Murderer are on Lifetime. **Seed has it in PLATFORMS_DATA but production doesn't.** |
| A&E Global Media | Yes (id=1) | Yes (media 76) | Small icon — hard to verify quality. |
| Disney + | Yes (id=2) | Yes (media 77) | OK |
| FOX | Yes (id=3) | Yes (media 74) | OK |
| Law & Crime Network | Yes (id=4) | Yes (media 79) | OK |
| Mattel | Yes (id=5) | Yes (media 75) | Small (150×150). OK for logo. |
| NBC | Yes (id=6) | Yes (media 73) | SVG format. OK. |
| Studio TF1 America | Yes (id=7) | Yes (media 78) | OK |

**Key issue:** `Lifetime` is listed in `seed-platforms.ts` but was **never created in production**. The `works_rels` table in production only has relationships to platforms 1-7 (A&E through TF1). Produced films that aired on Lifetime (`seenOnNames: ['Lifetime']`) won't link correctly until the Lifetime platform is created. The seed should handle this — `seedPlatforms` runs before `seedWorks` and creates all platforms.

---

## 6. Description Updates Made

All works now have full multi-paragraph descriptions from the Canva deck, replacing the shorter summaries that were in the seed. Key improvements:

- **Produced films**: Added specific air dates, full story descriptions, and writer/director credits from deck
- **In-production films**: Added writer/director names from deck (Barbara Marshall, Siobhan Devine, Waneta Storms)
- **Bomb Squad**: Expanded from "Project in paid development" to full description with 3 showrunners (Las Vegas, London, Paris)
- **The Chase**: Expanded from "Project in paid development" to full description
- **Girl in the Bubble**: Added full description (was empty in production)
- **Multiple development works**: Added credits that were missing (writers, directors, producers)

---

## 7. Category/Subcategory Mapping from Deck

The deck organizes works into sections that map to our subcategory field:

| Deck Section Header | subcategory value | category |
|---|---|---|
| Our Films (produced) | _(none)_ | film |
| In Production | _(none)_ | film |
| True Stories — Features | `true-stories-features` | film |
| True Stories — Series | `true-stories-series` | series |
| True Crime — Movies | `true-crime-movies` | film |
| True Crime — Series | `true-crime-series` | series |
| Dramas — Features | `dramas-feature` | film |
| Dramas — Series | `dramas-series` | series |
| Franchises | `franchises` | series |
| Holiday — Features | `holiday-features` | film |
| Comedy — Features | `comedy-features` | unscripted |
| Comedy — Series | `comedy-series` | series |
| Documentary | `documentary` | film |
| Unscripted | `unscripted` | unscripted |

---

## 8. Action Items for Client

1. **Confirm title:** "A Dentist to Die For" vs "A Doctor to Die For" — which is correct?
2. **Provide posters** for: A Not So Silent Night, Mistletoe and Holly, 25 to Life
3. **Confirm removal** of works not in deck: 1% Better, Flower Girl, Korean Espionage, Southern Gothic, Call Me Madam, If Anything Happens to Me, Sleeping Angel, In Not So Loving Memory, Darkness Falls
4. **Confirm renames:** By Midnight → Ravenwood, Murder Your Darlings → Rabbit Hole
5. **Verify poster quality** for: Girl in the Bubble (AI-generated?), landscape posters for Blackwater Bayou, The Correspondent, Flying Sideways
