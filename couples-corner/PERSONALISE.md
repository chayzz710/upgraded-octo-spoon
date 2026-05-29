# 🎨 personalisation checklist

Everything you need to change to make this site yours. Work through this top to bottom.

---

## Step 1 — config (do this first)

Edit `src/config.ts`:
- [ ] `siteName` — e.g. `"our little world"`, `"char & rag"`, whatever feels right
- [ ] `relationshipStart` — the date your relationship started
- [ ] `anniversaryDay` — the day of the month for the monthly banner
- [ ] `easterEggWord` — the secret word to type for the sword easter egg. Change to your own inside joke.
- [ ] `owners.user1` and `owners.user2` — fill in after both users log in (Supabase → Auth → Users)

---

## Step 2 — puns & facts

- [ ] `src/data/puns.ts` — replace the sample puns with your own. The pun-of-the-day picks from this list.
- [ ] `src/data/dinoFacts.ts` — swap for your own fun facts, or keep the dinosaurs if you're both into them.
- [ ] `src/data/loadingMessages.ts` — optionally personalise the loading messages.

---

## Step 3 — easter eggs & motifs

The site ships with a frog 🐸 and a dino 🦖 as hidden easter eggs (one per page/session). Swap these for your own:
- [ ] `src/components/motifs/FrogEasterEgg.tsx` — change the `🐸` emoji and tooltip text
- [ ] `src/components/motifs/DinoEasterEgg.tsx` — change the `🦖` emoji and tooltip/fact text
- [ ] `src/components/motifs/EasterEggPen.tsx` — the pen → sword in the navbar. Retheme the emoji and "psst" message to match your inside joke.

---

## Step 4 — profile setup text

- [ ] `src/pages/SetupPage.tsx` — the setup form prompt text (`"let's set up your little corner"`) — make it yours
- [ ] `src/pages/GatePage.tsx` — the gate page prompt text

---

## Step 5 — homepage copy

- [ ] `src/components/features/home/HeroSection.tsx` — the tagline chip (`"two hearts, one corner"`) — change to something that's you
- [ ] `src/components/features/home/ExploreSection.tsx` — the footer note (`"more rooms coming when we live them"`) — keep or change
- [ ] `src/components/features/home/Todayslittlething.tsx` — the flip card "reasons" list — personalise these

---

## Step 6 — map default center

- [ ] `src/pages/MapPage.tsx` — find `center={[17.3850, 78.4867]}` (currently Hyderabad) — change to your city

---

## Step 7 — real content

- [ ] Add real photos to the gallery
- [ ] Pin real places on the map
- [ ] Add songs to the playlist and mark your anthem
- [ ] Fill the memory jar
- [ ] Add bucket list items
- [ ] Write some letters (including some "open when" ones)
- [ ] Add puns to the pun wall

---

## Step 8 — pre-launch (before sharing)

- [ ] Fill in `owners` in `src/config.ts` with both UUIDs
- [ ] Tighten RLS policies — see the comments at the bottom of `supabase-schema.sql`
- [ ] Confirm Supabase redirect URLs include your Vercel domain
- [ ] Test while logged in as both users
- [ ] Back up your Supabase DB (Supabase → Database → Backups)
- [ ] Optional: add a custom domain in Vercel

---

## Design tokens (for reference)

| Token | Value | Used for |
|---|---|---|
| `sunflower` | `#F5C842` | Primary accent, buttons, active nav |
| `orchid` | `#9B7FD4` | Secondary accent, user2 colour |
| `cream` | `#FFFDF4` | Page background |
| `chocolate` | `#3B1F0E` | Text |
| `riptide` | `#3B82C4` | Map, tertiary accent |
| Playfair Display | serif | Headings |
| Caveat | cursive | Handwritten labels |
| Inter | sans-serif | Body text |

These are set in `tailwind.config.js`. Change the colour values there to retheme the whole site.
