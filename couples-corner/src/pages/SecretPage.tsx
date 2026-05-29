// ─────────────────────────────────────────────────────────────────────────────
// SECRET PAGE — build whatever you want here
// ─────────────────────────────────────────────────────────────────────────────
// This page is already:
//   - routed at /secret in App.tsx
//   - protected (requires gate + Google login)
//   - linked from the navbar via the 🔒 icon
//
// Ideas: a hidden letter, a mini game, a chess puzzle, a photo collage,
//        a playlist, a hand-drawn comic, a countdown to something special.
//
// It's yours. Go wild.
// ─────────────────────────────────────────────────────────────────────────────

import PageWrapper from '../components/layout/PageWrapper'

export default function SecretPage() {
  return (
    <PageWrapper pageKey="secret">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="text-7xl">🔐</div>
        <h1 className="font-display text-4xl text-chocolate">something secret</h1>
        <p className="font-hand text-orchid-deep text-xl max-w-sm">
          this page is yours to build — open <code className="font-mono text-sm bg-chocolate/5 px-2 py-0.5 rounded">src/pages/SecretPage.tsx</code> and make it something special
        </p>
      </div>
    </PageWrapper>
  )
}