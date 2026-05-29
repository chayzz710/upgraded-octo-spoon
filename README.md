# 💛 couples corner — private site template

A private, password-gated anniversary website for two people. Built with Vite + React + TypeScript + Supabase.

**Features:** photo gallery · letters · memory jar · pun wall · interactive map · playlist · bucket list · easter eggs

---

## Quick setup (5 steps)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd couples-corner
npm install
```

### 2. Create a Supabase project
- Go to [supabase.com](https://supabase.com) → New project (free tier)
- Run the contents of `supabase-schema.sql` in the SQL editor
- Create three storage buckets: `photos` (private), `avatars` (public), `map-photos` (private)
- Enable Google OAuth: Auth → Providers → Google (requires a Google Cloud OAuth client)

### 3. Set environment variables
Copy `.env.example` to `.env.local` and fill in:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SHARED_GATE_PASSWORD=your-shared-password
```

### 4. Configure the site
Open `src/config.ts` and update:
- `siteName` — what shows in the navbar and browser tab
- `relationshipStart` — your anniversary date
- `anniversaryDay` — which day of the month for the monthly banner
- `easterEggWord` — the secret word that triggers the sword easter egg

### 5. Deploy to Vercel
- Push to GitHub, import repo in Vercel, add the three env vars
- Add your Vercel URL to Supabase → Auth → Redirect URLs

### 6. After first logins
Once both users have logged in with Google, go to Supabase → Auth → Users, copy both UUIDs, and paste them into `src/config.ts` under `owners.user1` and `owners.user2`. Then tighten the RLS policies (see `supabase-schema.sql` comments at the bottom).

---

## Personalising

See `PERSONALISE.md` for the full checklist. The short version:
- `src/config.ts` — all settings in one place
- `src/data/puns.ts` — replace sample puns with your own
- `src/data/dinoFacts.ts` — replace with your own fun facts (or keep the dinos)
- Swap the 🐸 and 🦖 emojis in `FrogEasterEgg.tsx` and `DinoEasterEgg.tsx` for your own motifs
- The "pen → sword" easter egg in the navbar (`EasterEggPen.tsx`) — retheme to your own inside joke

---

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + custom theme tokens |
| Animations | Framer Motion |
| Auth + DB + Storage | Supabase |
| Map | react-leaflet + OpenStreetMap |
| Hosting | Vercel |

---

## Dev

```bash
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview production build
```

---

*made with sunflowers, chocolate, and one frog per page 🌻🍫🐸*
