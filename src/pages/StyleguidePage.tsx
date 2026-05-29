import PageWrapper from '../components/layout/PageWrapper'
import { SITE_CONFIG } from '../config'
import type { ReactNode } from 'react'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl text-chocolate mb-1">{title}</h2>
      <div className="h-px bg-chocolate/10 mb-5" />
      {children}
    </section>
  )
}

function Row({ label, value, file }: { label: string; value: string; file: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-chocolate/5 last:border-0">
      <span className="font-hand text-lg text-chocolate">{label}</span>
      <div className="text-right">
        <span className="font-mono text-sm text-orchid-deep block">{value}</span>
        <span className="font-mono text-xs text-chocolate/30">{file}</span>
      </div>
    </div>
  )
}

export default function StyleguidePage() {
  const c = SITE_CONFIG.colors

  return (
    <PageWrapper pageKey="styleguide">
      <div className="max-w-2xl mx-auto py-8">

        <h1 className="font-display text-5xl text-chocolate mb-1">customise</h1>
        <p className="font-hand text-orchid-deep text-xl mb-10">
          everything you can change — and where to find it
        </p>

        <Section title="site identity">
          <div className="card">
            <Row label="site name"       value={SITE_CONFIG.siteName}           file="src/config.ts → siteName" />
            <Row label="gate password"   value="••••••••"                        file="src/config.ts → gatePassword" />
            <Row label="start date"      value={SITE_CONFIG.relationshipStart.toDateString()} file="src/config.ts → relationshipStart" />
            <Row label="anniversary day" value={`${SITE_CONFIG.anniversaryDay}th of each month`} file="src/config.ts → anniversaryDay" />
            <Row label="easter egg word" value={SITE_CONFIG.easterEggWord}      file="src/config.ts → easterEggWord" />
          </div>
        </Section>

        <Section title="colours">
          <div className="card">
            <p className="font-mono text-xs text-chocolate/40 mb-4">
              edit in <span className="text-orchid-deep">src/config.ts → colors</span> and <span className="text-orchid-deep">tailwind.config.js</span> — keep both in sync
            </p>
            <div className="flex flex-wrap gap-5">
              {Object.entries(c).map(([key, hex]) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl shadow-soft border border-chocolate/10" style={{ background: hex }} />
                  <span className="font-hand text-sm text-chocolate/70">{key}</span>
                  <span className="font-mono text-xs text-chocolate/40">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="typography">
          <div className="card flex flex-col gap-4">
            <div>
              <p className="font-display text-3xl text-chocolate">Playfair Display</p>
              <span className="font-mono text-xs text-chocolate/30">headings · tailwind.config.js → fontFamily.display · index.html Google Fonts</span>
            </div>
            <div>
              <p className="font-body text-xl text-chocolate">Inter — body text</p>
              <span className="font-mono text-xs text-chocolate/30">body · tailwind.config.js → fontFamily.body</span>
            </div>
            <div>
              <p className="font-hand text-2xl text-orchid-deep">Caveat — handwritten labels 💛</p>
              <span className="font-mono text-xs text-chocolate/30">labels · tailwind.config.js → fontFamily.hand</span>
            </div>
          </div>
        </Section>

        <Section title="easter eggs">
          <div className="card">
            {[
              { emoji: '🐸', name: 'frog',          where: 'every page, different corner each session',              file: 'src/components/motifs/FrogEasterEgg.tsx' },
              { emoji: '🦖', name: 'dino',           where: 'one random page per session',                           file: 'src/components/motifs/DinoEasterEgg.tsx' },
              { emoji: '🖊️', name: 'pen → sword',   where: 'navbar right side',                                     file: 'src/components/motifs/EasterEggPen.tsx' },
              { emoji: '⚔️', name: 'sword slash',    where: `type "${SITE_CONFIG.easterEggWord}" anywhere`,          file: 'src/config.ts → easterEggWord' },
              { emoji: '💛', name: 'monthly banner', where: `${SITE_CONFIG.anniversaryDay}th of each month`,          file: 'src/config.ts → anniversaryDay' },
            ].map(({ emoji, name, where, file }) => (
              <div key={name} className="flex items-start gap-3 py-3 border-b border-chocolate/5 last:border-0">
                <span className="text-xl w-7 shrink-0">{emoji}</span>
                <div>
                  <span className="font-hand text-lg text-chocolate block">{name}</span>
                  <span className="font-hand text-sm text-chocolate/50 block">{where}</span>
                  <span className="font-mono text-xs text-chocolate/30">{file}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="content files">
          <div className="card">
            <Row label="puns"            value="add yours"         file="src/data/puns.ts" />
            <Row label="loading messages" value="edit or add more" file="src/data/loadingMessages.ts" />
            <Row label="dino facts"      value="edit or add more"  file="src/data/dinoFacts.ts" />
            <Row label="secret page"     value="blank — build it"  file="src/pages/SecretPage.tsx" />
          </div>
        </Section>

      </div>
    </PageWrapper>
  )
}