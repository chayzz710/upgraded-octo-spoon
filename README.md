# Couples corner

A private, password-gated anniversary site built for two. Every page is a little love letter — photos, handwritten notes, a shared map, letters to open later, and a playlist that means something.

Built with Vite, React, TypeScript, and Supabase. Deployed on Vercel.

---

## Features

**home** — a day counter, both profiles side by side, a pun of the day, and a heart button that pops floating hearts. On your anniversary day each month, a banner surfaces an old memory.

**gallery** — polaroid-style photo wall with seeded random tilts. Toggle between the messy view and a clean timeline grouped by month. Upload with client-side compression, add a caption and a chocolate rating.

**letters** — write letters to each other. Regular ones open instantly; "open when" letters are sealed with a lock and can only be opened once — with a confirm dialog to make sure the moment is right.

**memory jar** — a Kinder Joy egg full of notes. Shake it for a random memory. Each note has a chocolate rating and unfolds in a modal.

**pun wall** — a corkboard of sticky note puns. The other person rates yours (1–5, from a groan to losing it). Sortable by newest, best, or worst.

**map** — drop pins on places that mean something. First dates, favourites, adventures, wishlists. Each pin has a story, a date, and a two-panel popup that slides open on click.

**playlist** — add songs by pasting a Spotify link. Mark one as your anthem and it lives at the top. Everyone else goes on Side B.

**bucket list** — two columns: coming up and done. Check something off and it slides across with a strikethrough animation. Chess piece watermark in the background.

**profile page** — reachable from the navbar easter egg. Shows both profiles with stats pulled live from the database.

**secret page** — wired up and waiting. Build whatever you want in `src/pages/SecretPage.tsx`.

**easter eggs** — a frog hidden in a different corner on every page. A dinosaur that roams one random page per session and shares a fact when you find it. A pen in the navbar that turns into a sword. Type a secret word anywhere and a slash cuts across the screen.

---

## Setup

**1.** `npm install`

**2.** Create a project at [supabase.com](https://supabase.com), run `supabase-schema.sql` in the SQL editor, and create three storage buckets: `photos` (private), `avatars` (public), `map-photos` (private).

**3.** Enable Google OAuth under Supabase → Auth → Providers. You'll need a Google Cloud OAuth client — set the redirect URI to `https://your-project-id.supabase.co/auth/v1/callback`.

**4.** Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key.

**5.** `npm run dev` — default password is `ourlittlecorner`.

**Deploying:** push to GitHub, import on [Vercel](https://vercel.com), add the two env vars, and add your Vercel domain to Supabase → Auth → URL Configuration.

---

## Making it yours

Open the app and go to `/styleguide` (palette icon in the navbar) to see every configurable value and where to find it. The short version:

**Identity and settings — `src/config.ts`**

Site name, gate password, relationship start date, anniversary day, and the easter egg trigger word are all in one place. After both users log in for the first time, paste their UUIDs from Supabase → Auth → Users into `owners.user1` and `owners.user2`, then run the RLS lockdown query at the bottom of `supabase-schema.sql`.

**Colours — `src/config.ts` + `tailwind.config.js`**

Edit the `colors` object in `config.ts` and mirror the same values in `tailwind.config.js`. Restart the dev server after changing.

**Fonts — `tailwind.config.js` + `index.html`**

Update `theme.extend.fontFamily` in `tailwind.config.js` and swap the Google Fonts link in `index.html` to match.

**Easter eggs**

Swap the 🐸 in `FrogEasterEgg.tsx` and the 🦖 in `DinoEasterEgg.tsx` for whatever suits you. The dino facts live in `src/data/dinoFacts.ts`. The pen-to-sword easter egg in `EasterEggPen.tsx` is designed to be rethemed to your own inside joke — change the emoji and the "psst" message. The trigger word for the sword slash is `config.ts → easterEggWord`.

**Content**

- `src/data/puns.ts` — the pun of the day pool
- `src/data/loadingMessages.ts` — loading screen lines
- `src/data/dinoFacts.ts` — dino easter egg facts
- `src/pages/SecretPage.tsx` — completely blank, build whatever

**Homepage copy**

The tagline (`"two hearts, one corner"`), the flip card reasons, and the "our little pages" explore section footer are all in `src/components/features/home/`. Worth making personal.

**Map starting location**

`src/pages/MapPage.tsx` — find `center={[17.3850, 78.4867]}` and change to your coordinates.

---

## Stack

- Vite 
- React 18 
- TypeScript 
- Tailwind CSS 
- Framer Motion 
- Supabase 
- react-leaflet 
- Vercel