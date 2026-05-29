import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import BucketItem from '../components/features/bucketlist/BucketItem'
import AddItemModal from '../components/features/bucketlist/AddItemModal'
import { useBucketList } from '../hooks/useBucketList'

// ── Inline icons ────────────────────────────────────────────────────────────

function IcPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function IcPawn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="4.5" r="2" />
      <path d="M5.5 14h5l-1.2-4.5H6.7L5.5 14z" />
      <path d="M4.5 14h7" />
    </svg>
  )
}

function IcSparkle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M9 2v3M9 13v3M2 9h3M13 9h3M4.1 4.1l2.1 2.1M11.8 11.8l2.1 2.1M4.1 13.9l2.1-2.1M11.8 6.2l2.1-2.1" />
    </svg>
  )
}

// ── Doodle components ────────────────────────────────────────────────────────

function DoodleSquiggle({ color = '#9B7FD4', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size * 2.2} height={size * 0.6} viewBox="0 0 44 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 8 C8 2, 14 11, 22 6 C30 1, 36 11, 42 6" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function DoodleStar({ size = 12, color = '#F5C842' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill={color} style={{ flexShrink: 0 }}>
      <polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 9.5,12 6,9.5 2.5,12 3.5,7.5 0,4.5 4.5,4.5" />
    </svg>
  )
}

function DoodleHeart({ size = 16, color = '#7FC8A9' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} style={{ flexShrink: 0 }}>
      <path d="M8 14s-6-4.5-6-8a4 4 0 0 1 8 0 4 4 0 0 1 6 0c0 3.5-6 8-6 8z" />
    </svg>
  )
}

function DoodleScribbleCircle({ size = 56, color = '#9B7FD4' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M28 8 C44 8, 50 20, 48 30 C46 42, 36 50, 24 48 C12 46, 6 36, 8 24 C10 12, 18 6, 28 8 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M28 12 C40 10, 48 22, 44 32 C40 44, 28 48, 18 44 C10 40, 8 28, 14 18 C18 10, 26 10, 28 12 Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  )
}

// ── Empty states ─────────────────────────────────────────────────────────────

function EmptyUndone({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center p-8 rounded-2xl"
      style={{
        border: '2px dashed rgba(155,127,212,0.2)',
        background: 'rgba(255,253,244,0.6)',
      }}
    >
      <div style={{ opacity: 0.4, marginBottom: 12 }}>
        <DoodleScribbleCircle size={56} color="#9B7FD4" />
      </div>
      <p className="font-display italic text-xl mb-1" style={{ color: 'rgba(59,31,14,0.6)' }}>
        no plans yet
      </p>
      <p className="font-hand text-lg mb-4" style={{ color: 'rgba(59,31,14,0.45)' }}>
        what do you want to do together?
      </p>
      <button
        onClick={onAdd}
        className="font-hand text-base transition-all"
        style={{
          padding: '6px 16px',
          borderRadius: 999,
          border: '1.5px dashed rgba(155,127,212,0.5)',
          color: '#6A5ACD',
          background: 'rgba(229,218,247,0.3)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(229,218,247,0.6)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(229,218,247,0.3)')}
      >
        + add the first thing
      </button>
    </div>
  )
}

function EmptyDone() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center p-8 rounded-2xl"
      style={{
        border: '2px dashed rgba(59,31,14,0.08)',
        background: 'rgba(255,253,244,0.4)',
      }}
    >
      <div style={{ marginBottom: 12, animation: 'drift 5s ease-in-out infinite' }}>
        <DoodleHeart size={36} color="#7FC8A9" />
      </div>
      <p className="font-display italic text-xl mb-1" style={{ color: 'rgba(59,31,14,0.6)' }}>
        nothing checked off yet
      </p>
      <p className="font-hand text-lg" style={{ color: 'rgba(59,31,14,0.45)' }}>
        go do something — come back and tick it ✿
      </p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BucketListPage() {
  const { items, loading, refetch } = useBucketList()
  const [showAdd, setShowAdd] = useState(false)

  const undone = items.filter(i => !i.is_done)
  const done = items.filter(i => i.is_done)

  return (
    <PageWrapper pageKey="bucketlist">
      {/* Sunbeam blobs */}
      <div className="absolute inset-x-0 top-0 -z-0 pointer-events-none h-full overflow-hidden">
        <div style={{
          position: 'absolute', width: 480, height: 480, top: -100, left: -140,
          background: 'radial-gradient(closest-side, rgba(245,200,66,0.16), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', width: 360, height: 360, top: 180, right: -100,
          background: 'radial-gradient(closest-side, rgba(155,127,212,0.13), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, bottom: -60, left: '38%',
          background: 'radial-gradient(closest-side, rgba(127,200,169,0.12), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
      </div>

      <div className="relative z-10 px-6 pt-10 pb-14 max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DoodleSquiggle color="#E2A500" size={14} />
              <span className="font-hand text-sm uppercase tracking-widest whitespace-nowrap" style={{ color: '#9B7FD4' }}>
                things to do — together
              </span>
            </div>
            <h1 className="font-display text-5xl text-chocolate leading-none">
              bucket{' '}
              <span
                className="italic"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'><path d='M2 7 C 30 1, 60 11, 100 6 S 180 2, 198 7' fill='none' stroke='%23F5C842' stroke-width='4' stroke-linecap='round'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 100%',
                  backgroundSize: '100% 0.45em',
                  paddingBottom: '0.05em',
                }}
              >
                list
              </span>
            </h1>
            <p className="font-hand text-orchid-deep text-xl mt-2 flex items-center gap-1.5">
              {undone.length} to dream up · {done.length} happened
              <span style={{ color: '#7a5a44', display: 'inline-flex', alignItems: 'center' }}>
                <IcPawn />
              </span>
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 font-hand text-xl whitespace-nowrap shrink-0 transition-all"
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              background: '#F5C842',
              border: '2px solid rgba(226,165,0,0.3)',
              color: '#3B1F0E',
              boxShadow: '0 4px 14px -4px rgba(59,31,14,0.12), 0 2px 4px -2px rgba(59,31,14,0.06)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 10px 28px -10px rgba(59,31,14,0.22), 0 3px 8px -3px rgba(59,31,14,0.08)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 4px 14px -4px rgba(59,31,14,0.12), 0 2px 4px -2px rgba(59,31,14,0.06)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <IcPlus /> add something
          </button>
        </div>

        {/* Doodle divider */}
        <div className="flex items-center gap-3 my-5">
          <div style={{
            flex: 1, height: 2,
            backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)',
            backgroundSize: '10px 2px',
          }} />
          <DoodleStar size={14} color="#F5C842" />
          <div style={{
            flex: 1, height: 2,
            backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)',
            backgroundSize: '10px 2px',
          }} />
        </div>

        {/* ── Content ────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-hand text-orchid-deep text-xl flex items-center gap-2">
              <span style={{ display: 'inline-flex', animation: 'spin 1.5s linear infinite' }}>
                <IcSparkle />
              </span>
              planning adventures…
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

            {/* ── Coming up ──── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DoodleStar size={14} color="#9B7FD4" />
                <h2 className="font-hand text-2xl" style={{ color: '#9B7FD4' }}>
                  coming up
                </h2>
                <span className="font-hand text-lg" style={{ color: 'rgba(59,31,14,0.35)' }}>
                  — {undone.length}
                </span>
              </div>

              {undone.length === 0 ? (
                <EmptyUndone onAdd={() => setShowAdd(true)} />
              ) : (
                <motion.div className="flex flex-col gap-4" layout>
                  <AnimatePresence mode="popLayout">
                    {undone.map(item => (
                      <BucketItem key={item.id} item={item} onUpdate={refetch} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* ── Done ──────── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DoodleHeart size={14} color="#7FC8A9" />
                <h2 className="font-hand text-2xl" style={{ color: '#3f8a6a' }}>
                  done
                </h2>
                <span className="font-hand text-lg" style={{ color: 'rgba(59,31,14,0.35)' }}>
                  — {done.length}
                </span>
              </div>

              {done.length === 0 ? (
                <EmptyDone />
              ) : (
                <motion.div className="flex flex-col gap-4" layout>
                  <AnimatePresence mode="popLayout">
                    {done.map(item => (
                      <BucketItem key={item.id} item={item} onUpdate={refetch} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <AddItemModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}