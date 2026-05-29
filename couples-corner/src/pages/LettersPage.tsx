import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import EnvelopeCard from '../components/features/letters/EnvelopeCard'
import LetterModal from '../components/features/letters/LetterModal'
import WriteLetterModal from '../components/features/letters/WriteLetterModal'
import { useLetters } from '../hooks/useLetters'
import type { Letter } from '../types'

type FilterMode = 'all' | 'open-when' | 'opened'

function DoodleSquiggle({ color = '#B46D83' }: { color?: string }) {
  return (
    <svg width="36" height="14" viewBox="0 0 36 14" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M1 7 C4 2, 8 12, 12 7 S20 2, 24 7 S32 12, 36 7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
function DoodleHeart({ color = '#E69CB5', size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M10 16C10 16 2 10.5 2 5.5A4.5 4.5 0 0 1 10 3.5 4.5 4.5 0 0 1 18 5.5C18 10.5 10 16 10 16Z" />
    </svg>
  )
}
function DoodleStar({ color = '#F5C842', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <polygon points="10,1 12,7 18,7 13.5,11 15.5,17 10,13.5 4.5,17 6.5,11 2,7 8,7" />
    </svg>
  )
}
function ScribbleUnderline({ color = '#F5C842' }: { color?: string }) {
  return (
    <svg viewBox="0 0 80 10" style={{ position: 'absolute', bottom: -5, left: 0, width: '100%', height: 10, overflow: 'visible', pointerEvents: 'none' }} preserveAspectRatio="none">
      <path d="M0 5 C10 2, 20 8, 30 5 S50 2, 60 5 S75 8, 80 5" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
function IcMail({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  )
}
function IcLock({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
function IcEye({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function IcSparkle({ size = 18, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" className={className}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  )
}

export default function LettersPage() {
  const { letters, loading, refetch } = useLetters()
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [showWrite, setShowWrite] = useState(false)
  const [filter, setFilter] = useState<FilterMode>('all')

  const totalCount = letters.length
  const openWhenCount = letters.filter(l => l.is_open_when).length
  const openedCount = letters.filter(l => !!l.opened_at).length
  const sealedCount = totalCount - openedCount

  const filtered = letters.filter(l => {
    if (filter === 'open-when') return l.is_open_when
    if (filter === 'opened') return !!l.opened_at
    return true
  })

  const sealed = filtered.filter(l => !l.opened_at)
  const opened = filtered.filter(l => !!l.opened_at)

  const FILTER_OPTIONS: { key: FilterMode; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'all',       label: 'all letters', icon: <IcMail size={13} />,  count: totalCount },
    { key: 'open-when', label: 'open-when',   icon: <IcLock size={12} />,  count: openWhenCount },
    { key: 'opened',    label: 'opened',       icon: <IcEye size={13} />,   count: openedCount },
  ]

  return (
    <PageWrapper pageKey="letters">
      {/* Sunbeam blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: -80, width: 500, height: 500, background: 'radial-gradient(circle at 40% 40%, rgba(245,200,66,0.16) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '20%', right: -60, width: 420, height: 420, background: 'radial-gradient(circle at 60% 40%, rgba(230,156,181,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 360, height: 360, background: 'radial-gradient(circle at 50% 60%, rgba(155,127,212,0.12) 0%, transparent 70%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <DoodleSquiggle color="#E2A500" />
              <span style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#9B7FD4', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                sealed thoughts
              </span>
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 56, color: '#3B1F0E', margin: '0 0 8px', lineHeight: 1.1, fontWeight: 400 }}>
              our{' '}
              <span style={{ fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
                letters
                <ScribbleUnderline color="#F5C842" />
              </span>
            </h1>
            {!loading && (
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#9B7FD4', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                {totalCount} {totalCount === 1 ? 'letter' : 'letters'}
                <IcMail size={16} color="#B46D83" />
                <span style={{ color: 'rgba(59,31,14,0.45)', fontSize: 17 }}>{openedCount} opened · {sealedCount} sealed</span>
              </p>
            )}
          </div>

          {/* Write button */}
          <button
            onClick={() => setShowWrite(true)}
            style={{
              fontFamily: 'Caveat, cursive', fontSize: 18, fontWeight: 600,
              color: '#3B1F0E', background: '#F5C842',
              border: '2px solid rgba(226,165,0,0.30)', borderRadius: 999,
              padding: '10px 24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 2px 8px rgba(59,31,14,0.08)',
              transition: 'all 0.15s', marginTop: 8, whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(59,31,14,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,31,14,0.08)' }}
          >
            <IcMail size={16} color="#3B1F0E" />
            write a letter
          </button>
        </div>

        {/* Dashed-star divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 28px' }}>
          <div style={{ flex: 1, borderTop: '1px dashed rgba(59,31,14,0.15)' }} />
          <DoodleStar color="#F5C842" size={14} />
          <div style={{ flex: 1, borderTop: '1px dashed rgba(59,31,14,0.15)' }} />
        </div>

        {/* Filter chips */}
        {!loading && letters.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {FILTER_OPTIONS.map(({ key, label, icon, count }) => {
              const active = filter === key
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    fontFamily: 'Caveat, cursive', fontSize: 16,
                    borderRadius: 999,
                    border: `2px solid ${active ? 'rgba(226,165,0,0.40)' : 'rgba(59,31,14,0.12)'}`,
                    borderStyle: active ? 'solid' : 'dashed',
                    background: active ? '#F5C842' : 'rgba(255,255,255,0.80)',
                    color: active ? '#3B1F0E' : 'rgba(59,31,14,0.60)',
                    padding: '6px 16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 2px 8px rgba(59,31,14,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {icon}
                  {label}
                  <span style={{ fontSize: 12, color: active ? 'rgba(59,31,14,0.45)' : 'rgba(59,31,14,0.30)' }}>
                    {count}
                  </span>
                </button>
              )
            })}
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: 'rgba(59,31,14,0.40)', fontStyle: 'italic', marginLeft: 'auto' }}>
              tap an envelope to break the seal
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#9B7FD4', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IcSparkle size={20} color="#9B7FD4" className="animate-spin" />
              unfolding the envelopes…
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && letters.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '64px 32px', background: 'rgba(255,255,255,0.6)',
            border: '2px dashed rgba(180,109,131,0.28)', borderRadius: 16,
            textAlign: 'center',
          }}>
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" opacity="0.50">
              <circle cx="35" cy="35" r="33" stroke="#B46D83" strokeWidth="2" strokeDasharray="6 4" />
            </svg>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: 'rgba(59,31,14,0.60)', fontStyle: 'italic', margin: '12px 0 4px' }}>
              no letters yet
            </p>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'rgba(59,31,14,0.45)', margin: '0 0 20px' }}>
              write the first one — seal it for them
            </p>
            <button
              onClick={() => setShowWrite(true)}
              style={{
                fontFamily: 'Caveat, cursive', fontSize: 16, color: '#B46D83',
                background: 'transparent', border: '2px dashed rgba(180,109,131,0.40)',
                borderRadius: 999, padding: '8px 20px', cursor: 'pointer',
              }}
            >
              + write a letter
            </button>
          </div>
        )}

        {/* No match for filter */}
        {!loading && letters.length > 0 && sealed.length === 0 && opened.length === 0 && (
          <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'rgba(59,31,14,0.50)', textAlign: 'center', padding: '48px 0' }}>
            no letters match — try another filter ✿
          </p>
        )}

        {/* ── Two sections ── */}
        {!loading && (sealed.length > 0 || opened.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

            {/* Section 1 — Waiting to be opened */}
            {sealed.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <DoodleHeart color="#B46D83" size={18} />
                  <span style={{
                    fontFamily: 'Caveat, cursive', fontSize: 22, color: '#3B1F0E',
                    fontStyle: 'italic', textDecoration: 'underline', textUnderlineOffset: 4,
                    textDecorationColor: '#F5C842', textDecorationThickness: 2,
                  }}>waiting to be opened</span>
                  <div style={{ flex: 1, borderTop: '1px dashed rgba(226,165,0,0.45)', marginLeft: 8 }} />
                  <span style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: 'rgba(59,31,14,0.40)' }}>
                    {sealed.length} {sealed.length === 1 ? 'letter' : 'letters'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
                  {sealed.map((letter, i) => (
                    <EnvelopeCard
                      key={letter.id}
                      letter={letter}
                      index={i}
                      onClick={() => setSelectedLetter(letter)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 2 — Already read */}
            {opened.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <DoodleHeart color="#9B7FD4" size={18} />
                  <span style={{
                    fontFamily: 'Caveat, cursive', fontSize: 22, color: '#3B1F0E',
                    fontStyle: 'italic', textDecoration: 'underline', textUnderlineOffset: 4,
                    textDecorationColor: '#9B7FD4', textDecorationThickness: 2,
                  }}>already read</span>
                  <div style={{ flex: 1, borderTop: '1px dashed rgba(155,127,212,0.45)', marginLeft: 8 }} />
                  <span style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: 'rgba(59,31,14,0.40)' }}>
                    {opened.length} {opened.length === 1 ? 'letter' : 'letters'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
                  {opened.map((letter, i) => (
                    <EnvelopeCard
                      key={letter.id}
                      letter={letter}
                      index={i}
                      onClick={() => setSelectedLetter(letter)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Footer */}
        {!loading && letters.length > 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <DoodleHeart color="#E69CB5" size={14} />
            <span style={{ fontFamily: 'Caveat, cursive', fontSize: 15, color: 'rgba(59,31,14,0.40)' }}>sealed with care</span>
            <DoodleHeart color="#E69CB5" size={14} />
          </div>
        )}
      </div>

      {/* Letter modal */}
      <AnimatePresence>
        {selectedLetter && (
          <LetterModal
            letter={selectedLetter}
            onClose={() => setSelectedLetter(null)}
            onUpdate={refetch}
          />
        )}
      </AnimatePresence>

      {/* Write modal */}
      <AnimatePresence>
        {showWrite && (
          <WriteLetterModal
            onClose={() => setShowWrite(false)}
            onSuccess={() => { setShowWrite(false); refetch() }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes env-pop {
          from { opacity: 0; transform: scale(0.9) translateY(8px) rotate(var(--rot, 0deg)); }
          to   { opacity: 1; transform: scale(1)   translateY(0)   rotate(var(--rot, 0deg)); }
        }
        .animate-spin { animation: spin 1.2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </PageWrapper>
  )
}