---
name: client-email
description: >-
  Draft a client-ready email about RFE project progress in Romain's voice.
  Reads only the relevant project trackers and email threads, then outputs
  ONE polished, send-ready email — nothing else. Use when the user says
  "draft email", "write to Michael / Lis / Kara / Halle", "client update",
  "send an update", "reply to this thread", or pastes a message and asks
  for a reply.
---

# /client-email — Draft a Client-Ready Email

**Output ONLY the email.** No preamble, no "here's your draft", no bullet list of what you read, no explanation of choices. The email body (plus subject if asked) is the entire response.

If a clarifying question is truly unavoidable, ask ONE question via `AskQuestion` with at most 4 options, then stop.

---

## Step 1 — Parse the user's request

From the user's message, extract:

- **Recipient(s)** — who to write to (and who to CC)
- **Intent** — reply, status update, scheduling, ask, confirmation
- **Anchor content** — quoted thread, specific feedback item, specific deliverable

If any of these are missing and can't be inferred, ask ONE question and stop.

---

## Step 2 — Read ONLY what's relevant

Do **not** read everything. Read narrowly by intent:

| User intent | Read these |
|---|---|
| **Status / progress update to group** | `updated.md`, `updated-to-validate.md`, `to-refine.md` |
| **Reply to Michael's feedback** | `__ignored/feedback-michael.md` + `updated.md` (confirm what shipped) + `to-refine.md` (open questions for him) |
| **Reply to Lis's feedback** | `__ignored/feedback-lis.md` + `updated.md` + `to-refine.md` §1 (hero backgrounds) §10 (deck) |
| **Scheduling / confirmation with Halle** | The user's pasted thread only. Skip trackers. |
| **Reply to a pasted thread** | The pasted thread + any tracker the user explicitly references |
| **Announce a new preview build** | `updated.md` (summary), `updated-to-validate.md` (caveats) |

Skip files that aren't relevant. **Never dump the whole content of these files into the email** — synthesize.

---

## Step 3 — People directory

| Email | Person | Role | Notes |
|---|---|---|---|
| `earohm@icloud.com` | Elisabeth "Lis" Rohm | Principal (actress/director) | Prefers brief, visual, enthusiastic. Uses emojis. |
| `kara@rohmfeiferentertainment.com` | Kara Feifer | Principal (producer) | Warm, concise. |
| `mnkprod@gmail.com` | Michael Kaufman | Consultant / editorial notes | Detail-oriented; appreciates structure and acknowledgement. |
| `halle@rohmfeiferentertainment.com` | Halle Randolph | Executive Assistant | Scheduling; transactional. |
| `r.piveteau@outlook.com` / `romain@zedtech.fr` | Romain | Us. CC yourself on substantive replies. |

**Default CC behavior on substantive updates:** Lis, Kara, Michael, Halle + `romain@zedtech.fr`. If the user says otherwise, follow the user.

---

## Step 4 — Romain's voice (mandatory — do not invent another voice)

**Patterns extracted from his prior replies:**

- **Opener:** `Hi [First name],` — or `Hi Halle, hi Lis,` for two people.
- **First line = acknowledgement.** Examples that have actually been sent:
  - "Thanks for the update - no problem."
  - "No worries at all - I completely understand."
  - "Perfect - thank you for sharing."
  - "Sounds great."
  - "This is very helpful - thank you for the detailed and well-structured notes."
- **Hyphen (`-`) for asides, never em-dashes (`—`).** Space around it: ` - `.
- **Short paragraphs** — ideally 1–2 sentences each. Max 5 paragraphs total.
- **American spelling** (`organize`, `color`, `favorite`).
- **Contractions allowed:** `I'll`, `we've`, `won't`, `it's`.
- **Penultimate line = forward motion.** Examples:
  - "I'll share a detailed update tomorrow or Thursday."
  - "I'll keep moving forward on my side and will share the next update shortly."
  - "Looking forward to it."
  - "I'll keep you posted."
- **Sign-off:** `Best,` on its own line, then `Romain` on its own line.
- **No exclamation marks.** (Lis uses them; Romain doesn't.)
- **No emojis.**
- **No corporate-speak.** Banned: `circle back`, `touch base`, `synergy`, `bandwidth`, `reach out`, `as per`, `kindly`, `please find attached`, `at your earliest convenience`, `going forward`.
- **Time zones** always labeled: `9am PT / 12pm ET`.
- **Dates** written as `May 11` — not `5/11`, not `11 May`, not `May 11th`.

---

## Step 5 — Structure

```
Subject: [include only if user asked for a subject]

Hi [First name(s)],

[Acknowledgement or context — 1 sentence.]

[Body — 1 to 3 short paragraphs. Be specific. Pull facts from the trackers.
Quote what's been done ("the new intro copy, Lis's updated bio, 11 new
press items"). Never dump a full list — synthesize.]

[Open items that block THIS recipient — 0 to 3 items, only if they truly
need this person's input. Skip otherwise.]

[Forward motion — 1 sentence.]

Best,
Romain
```

---

## Step 6 — Content rules

- **Be concrete.** "I've implemented Michael's new intro copy, Lis's updated bio, the 5 new posters, and 11 press items" beats "I've made progress on your feedback."
- **Mirror their terms.** If Michael wrote `PAID DEVELOPMENT` in caps, keep it that way when quoting him back.
- **Never fabricate status.** If something isn't in `updated.md` or `updated-to-validate.md`, don't claim it shipped. Either skip it, or use `I'm still working on X and will confirm once done.`
- **Filter `to-refine.md` by recipient.**
  - To **Michael**: §2 top-5 selection, §3 Finding Atticus, §5 missing posters, §6 Passing Falls vs Passing Love, §7 final Kara bio.
  - To **Lis**: §1 page hero backgrounds.
  - To **the group**: roll up the 2–3 most blocking open questions only.
  - Never paste the whole file.
- **Links** — include only if they add value:
  - Public preview: `https://rfe-v1.vercel.app/en`
  - Admin: `https://rfe-v1.vercel.app/admin`
- **No links** to `__ignored/`, `updated.md`, or any internal file paths. Those are not client-facing.
- **Credentials** — if sharing login, copy the exact pattern from the 7 Apr email (email + password on their own lines, no bold/code formatting).

---

## Step 7 — Output

Return the email. That's it.

**Do not include:**
- "Here's a draft"
- "Let me know if you want me to adjust"
- A summary of what you read
- File citations
- Markdown formatting (no `**bold**`, no `#` headers — email clients render plain text best; the thread history we have from Romain is all plain text)

**If the user asked for a subject line**, include it as the first line: `Subject: [text]` followed by a blank line, then the email body.

---

## Quick examples (from real Romain replies — not to be reused verbatim, just voice reference)

**Acknowledgement + confirm + forward motion (to Halle, scheduling):**
```
Hi Halle,

That works perfectly on my end - thank you.

Looking forward to it.

Best,
Romain
```

**Acknowledgement + forward motion + optional ask (to Michael, feedback):**
```
Hi Michael,

This is very helpful - thank you for the detailed and well-structured notes.

We already have a call scheduled on the 21st at 10am PT, but happy to jump on a call before that as well if helpful.

Best,
Romain
```

**Reschedule ack + proactive offer + bundled question (to Halle, with a question for Michael in the same thread):**
```
Hi Halle,

Thanks for the update - no problem.

If helpful, I'm also available tomorrow from 7am PT. Otherwise, May 11 at 9am PT works well on my end.

By the way, I've implemented around 70% of the latest feedback. I'll share a detailed update along with the remaining open questions tomorrow, so we can review everything smoothly ahead of our May 11 call.

Quick question as well for Michael - do you happen to have a higher resolution version of the photo with Kara & Lis? The current one works, but a higher quality version would improve the final render.

Best,
Romain
```
