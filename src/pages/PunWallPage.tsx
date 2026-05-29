import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import PunCard from '../components/features/puns/PunCard'
import AddPunModal from '../components/features/puns/AddPunModal'
import { usePuns } from '../hooks/usePuns'
import { useUser } from '../lib/auth'

type SortMode = 'newest' | 'best' | 'worst'

// Wavy squiggle doodle
function DoodleSquiggle({ color = '#9B7FD4' }: { color?: string }) {
  return (
    <svg width="36" height="14" viewBox="0 0 36 14" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path
        d="M1 7 C4 2, 8 12, 12 7 S20 2, 24 7 S32 12, 36 7"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Dashed line divider with star
function DashedStarDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 28px' }}>
      <div style={{ flex: 1, borderTop: '1px dashed rgba(59,31,14,0.15)' }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="#F5C842">
        <polygon points="7,1 8.5,5 13,5 9.5,7.5 11,12 7,9.5 3,12 4.5,7.5 1,5 5.5,5" />
      </svg>
      <div style={{ flex: 1, borderTop: '1px dashed rgba(59,31,14,0.15)' }} />
    </div>
  )
}

// Scribble underline
function ScribbleUnderline({ color = '#9B7FD4' }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 80 10"
      style={{ position: 'absolute', bottom: -5, left: 0, width: '100%', height: 10, overflow: 'visible', pointerEvents: 'none' }}
      preserveAspectRatio="none"
    >
      <path
        d="M0 5 C10 2, 20 8, 30 5 S50 2, 60 5 S75 8, 80 5"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Sort pill counts
function bestCount(puns: any[]) { return puns.filter(p => (p.rating ?? 0) >= 4).length }
function worstCount(puns: any[]) { return puns.filter(p => p.rating !== null && p.rating <= 2).length }

export default function PunWallPage() {
  const { user } = useUser()
  const { puns, loading, refetch } = usePuns()
  const [showAdd, setShowAdd] = useState(false)
  const [sort, setSort] = useState<SortMode>('newest')

  const sorted = [...puns].sort((a, b) => {
    if (sort === 'best') return (b.rating ?? 0) - (a.rating ?? 0)
    if (sort === 'worst') return (a.rating ?? 5) - (b.rating ?? 5)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const SORT_OPTIONS: { key: SortMode; label: string; icon: string; count: number }[] = [
    { key: 'newest', label: 'newest', icon: '🕐', count: puns.length },
    { key: 'best',   label: 'best',   icon: '♛', count: bestCount(puns) },
    { key: 'worst',  label: 'worst',  icon: '😩', count: worstCount(puns) },
  ]

  return (
    <PageWrapper pageKey="puns">
      {/* Sunbeam background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -120, left: -80, width: 500, height: 500,
          background: 'radial-gradient(circle at 40% 40%, rgba(245,200,66,0.16) 0%, transparent 72%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: -60, width: 420, height: 420,
          background: 'radial-gradient(circle at 60% 60%, rgba(155,127,212,0.14) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '20%', width: 320, height: 320,
          background: 'radial-gradient(circle at 50% 50%, rgba(127,200,169,0.12) 0%, transparent 70%)',
        }} />
      </div>

      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <DoodleSquiggle />
              <span style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 13,
                color: '#9B7FD4',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                crimes against comedy
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 56,
              color: '#3B1F0E',
              margin: '0 0 8px',
              lineHeight: 1.1,
              fontWeight: 400,
            }}>
              the pun{' '}
              <span style={{ fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
                wall
                <ScribbleUnderline color="#9B7FD4" />
              </span>
            </h1>

            {/* Subtitle */}
            {!loading && (
              <p style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 20,
                color: '#9B7FD4',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {puns.length} {puns.length === 1 ? 'offense' : 'offenses'} pinned up
                <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 2 }}>
                  {/* Dino line icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B7FD4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18c0-2 1-3 2-4l1-5c0-2 2-4 4-4h1c2 0 3 1 4 2l3 2c1 1 2 2 2 3v2c0 1-1 2-2 2h-2l-1 2H9l-1-2H5c-1 0-2-1-2-2z"/>
                    <circle cx="10" cy="8" r="1" fill="#9B7FD4" stroke="none"/>
                  </svg>
                </span>
              </p>
            )}
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 18,
              fontWeight: 600,
              color: '#3B1F0E',
              background: '#F5C842',
              border: '2px solid rgba(226,165,0,0.30)',
              borderRadius: 999,
              padding: '10px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(59,31,14,0.08)',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              marginTop: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59,31,14,0.14)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,31,14,0.08)'
            }}
          >
            <span style={{ fontSize: 16 }}>+</span>
            add a pun
          </button>
        </div>

        {/* Divider */}
        <DashedStarDivider />

        {/* Sort row */}
        {!loading && puns.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {SORT_OPTIONS.map(({ key, label, icon, count }) => {
              const active = sort === key
              return (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  style={{
                    fontFamily: 'Caveat, cursive',
                    fontSize: 16,
                    borderRadius: 999,
                    border: `2px solid ${active ? 'rgba(226,165,0,0.40)' : 'rgba(59,31,14,0.12)'}`,
                    borderStyle: active ? 'solid' : 'dashed',
                    background: active ? '#F5C842' : 'rgba(255,255,255,0.80)',
                    color: active ? '#3B1F0E' : 'rgba(59,31,14,0.60)',
                    padding: '6px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 2px 8px rgba(59,31,14,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  {label}
                  <span style={{ fontSize: 12, color: active ? 'rgba(59,31,14,0.45)' : 'rgba(59,31,14,0.30)' }}>
                    {count}
                  </span>
                </button>
              )
            })}
            <p style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 13,
              color: 'rgba(59,31,14,0.40)',
              fontStyle: 'italic',
              marginLeft: 'auto',
            }}>
              tap a face to rate — owners can't rate their own crime
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#9B7FD4', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B7FD4" strokeWidth="1.7" strokeLinecap="round" style={{ animation: 'spin 1.2s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              groaning through the puns…
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && puns.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 32px',
            background: 'rgba(255,255,255,0.6)',
            border: '2px dashed rgba(155,127,212,0.25)',
            borderRadius: 16,
            textAlign: 'center',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
          }}>
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" opacity="0.40">
              <circle cx="35" cy="35" r="33" stroke="#9B7FD4" strokeWidth="2" strokeDasharray="6 4" />
            </svg>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, color: 'rgba(59,31,14,0.60)', fontStyle: 'italic', margin: '12px 0 4px' }}>
              no puns yet
            </p>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'rgba(59,31,14,0.45)', margin: '0 0 20px' }}>
              be the first to make someone groan
            </p>
            <button
              onClick={() => setShowAdd(true)}
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 16,
                color: '#6A5ACD',
                background: 'transparent',
                border: '2px dashed rgba(155,127,212,0.40)',
                borderRadius: 999,
                padding: '8px 20px',
                cursor: 'pointer',
              }}
            >
              + add the first pun
            </button>
          </div>
        )}

        {/* CSS-columns masonry corkboard */}
        {!loading && puns.length > 0 && (
          <div style={{ columns: '280px', gap: 20, paddingTop: 16 }}>
            <AnimatePresence>
              {sorted.filter(Boolean).map((pun, i) => (
                <PunCard
                  key={pun.id}
                  pun={pun}
                  currentUserId={user?.id ?? ''}
                  onRate={refetch}
                  onDelete={refetch}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <AddPunModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}