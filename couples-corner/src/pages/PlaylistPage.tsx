import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import AnthemCard from '../components/features/playlist/AnthemCard'
import SongRow from '../components/features/playlist/SongRow'
import AddSongModal from '../components/features/playlist/AddSongModal'
import { useSongs } from '../hooks/useSongs'

// ── Icons ────────────────────────────────────────────────────────────────────

function IcPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function IcMusic() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 11V3l8-2v8" />
      <circle cx="3.5" cy="11" r="1.5" />
      <circle cx="11.5" cy="9" r="1.5" />
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

function IcStar({ filled = false, size = 14 }: { filled?: boolean; size?: number }) {
  return filled ? (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor">
      <polygon points="7,1 8.8,5.2 13.5,5.5 10,8.5 11,13 7,10.5 3,13 4,8.5 0.5,5.5 5.2,5.2" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="7,1 8.8,5.2 13.5,5.5 10,8.5 11,13 7,10.5 3,13 4,8.5 0.5,5.5 5.2,5.2" />
    </svg>
  )
}

// ── Doodles ───────────────────────────────────────────────────────────────────

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

function DoodleHeart({ size = 14, color = '#E2A500' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} style={{ flexShrink: 0 }}>
      <path d="M8 14s-6-4.5-6-8a4 4 0 0 1 8 0 4 4 0 0 1 6 0c0 3.5-6 8-6 8z" />
    </svg>
  )
}

function DoodleScribbleCircle({ size = 62, color = '#9B7FD4' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path d="M28 8 C44 8, 50 20, 48 30 C46 42, 36 50, 24 48 C12 46, 6 36, 8 24 C10 12, 18 6, 28 8 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M28 12 C40 10, 48 22, 44 32 C40 44, 28 48, 18 44 C10 40, 8 28, 14 18 C18 10, 26 10, 28 12 Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PlaylistPage() {
  const { songs, loading, refetch } = useSongs()
  const [showAdd, setShowAdd] = useState(false)

  const anthem = songs.find(s => s.is_anthem)
  const rest = songs.filter(s => !s.is_anthem)

  return (
    <PageWrapper pageKey="playlist">
      {/* Sunbeam blobs */}
      <div className="absolute inset-x-0 top-0 -z-0 pointer-events-none h-full overflow-hidden">
        <div style={{
          position: 'absolute', width: 500, height: 500, top: -120, left: -150,
          background: 'radial-gradient(closest-side, rgba(245,200,66,0.16), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', width: 380, height: 380, top: 200, right: -100,
          background: 'radial-gradient(closest-side, rgba(155,127,212,0.13), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', width: 320, height: 320, bottom: -60, left: '40%',
          background: 'radial-gradient(closest-side, rgba(59,130,196,0.10), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
      </div>

      <div className="relative z-10 px-6 pt-7 pb-14 max-w-5xl mx-auto">

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <DoodleSquiggle color="#E2A500" size={13} />
              <span className="font-hand text-xs uppercase tracking-widest" style={{ color: '#9B7FD4' }}>
                our mixtape
              </span>
            </div>
            <h1 className="font-display text-4xl text-chocolate leading-none">
              our{' '}
              <span className="italic" style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'><path d='M2 7 C 30 1, 60 11, 100 6 S 180 2, 198 7' fill='none' stroke='%23F5C842' stroke-width='4' stroke-linecap='round'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0 100%',
                backgroundSize: '100% 0.45em',
                paddingBottom: '0.05em',
              }}>playlist</span>
            </h1>
            <p className="font-hand text-orchid-deep text-lg mt-1 flex items-center gap-1.5">
              songs that mean something · {songs.length} so far
              <span style={{ color: '#E2A500', display: 'inline-flex' }}>
                <IcMusic />
              </span>
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 font-hand text-xl whitespace-nowrap shrink-0 transition-all"
            style={{
              padding: '10px 22px', borderRadius: 999,
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
            <IcPlus /> add a song
          </button>
        </div>

        {/* Doodle divider */}
        <div className="flex items-center gap-3 my-3">
          <div style={{ flex: 1, height: 2, backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)', backgroundSize: '10px 2px' }} />
          <DoodleStar size={14} color="#F5C842" />
          <div style={{ flex: 1, height: 2, backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)', backgroundSize: '10px 2px' }} />
        </div>

        {/* ── Loading ─────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-hand text-orchid-deep text-xl flex items-center gap-2">
              <span style={{ display: 'inline-flex', animation: 'spin 1.5s linear infinite' }}>
                <IcSparkle />
              </span>
              tuning in…
            </p>
          </div>
        ) : (
          <>
            {/* ── Anthem ────────────────────────────────── */}
            {anthem ? (
              <div className="mb-8">
                <AnthemCard song={anthem} onUpdate={refetch} />
              </div>
            ) : songs.length > 0 && (
              <div
                className="mb-8 p-5 rounded-2xl"
                style={{
                  background: '#FFF6DD',
                  border: '1.5px dashed rgba(226,165,0,0.4)',
                }}
              >
                <p className="font-hand text-lg" style={{ color: 'rgba(59,31,14,0.5)' }}>
                  no anthem picked yet — tap the{' '}
                  <span style={{ display: 'inline-flex', verticalAlign: 'middle', color: 'rgba(226,165,0,0.6)' }}>
                    <IcStar size={14} />
                  </span>
                  {' '}on a song to make it ours
                </p>
              </div>
            )}

            {/* ── Side B divider ────────────────────────── */}
            {(anthem || rest.length > 0) && (
              <div className="flex items-center gap-3 my-7">
                <div style={{
                  flex: 1, height: 2,
                  backgroundImage: 'linear-gradient(90deg, rgba(226,165,0,0.45) 50%, transparent 50%)',
                  backgroundSize: '10px 2px',
                }} />
                <div className="flex items-center gap-2">
                  <DoodleHeart size={13} color="#E2A500" />
                  <span className="font-hand text-sm uppercase tracking-widest" style={{ color: '#E2A500' }}>
                    side b — everything else
                  </span>
                  <DoodleHeart size={13} color="#E2A500" />
                </div>
                <div style={{
                  flex: 1, height: 2,
                  backgroundImage: 'linear-gradient(90deg, rgba(226,165,0,0.45) 50%, transparent 50%)',
                  backgroundSize: '10px 2px',
                }} />
              </div>
            )}

            {/* ── Song list ──────────────────────────────── */}
            {rest.length === 0 ? (
              <div
                className="p-10 rounded-2xl text-center"
                style={{
                  border: '2px dashed rgba(155,127,212,0.25)',
                  background: '#FFF6DD',
                  backgroundImage: `
                    radial-gradient(rgba(59,31,14,0.03) 1px, transparent 1px),
                    radial-gradient(rgba(59,31,14,0.02) 1px, transparent 1px)
                  `,
                  backgroundSize: '22px 22px, 11px 11px',
                  backgroundPosition: '0 0, 11px 11px',
                  backgroundColor: '#FFF6DD',
                }}
              >
                <div style={{ opacity: 0.4, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                  <DoodleScribbleCircle size={62} color="#9B7FD4" />
                </div>
                <p className="font-display italic text-2xl mb-1" style={{ color: 'rgba(59,31,14,0.6)' }}>
                  {anthem ? 'just the one song so far' : 'the tape is empty'}
                </p>
                <p className="font-hand text-lg mb-5" style={{ color: 'rgba(59,31,14,0.45)' }}>
                  what's been stuck in your head?
                </p>
                <button
                  onClick={() => setShowAdd(true)}
                  className="font-hand text-base transition-all"
                  style={{
                    padding: '6px 18px', borderRadius: 999,
                    border: '1.5px dashed rgba(155,127,212,0.5)',
                    color: '#6A5ACD',
                    background: 'rgba(229,218,247,0.3)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(229,218,247,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(229,218,247,0.3)')}
                >
                  + add the first track
                </button>
              </div>
            ) : (
              <motion.div className="flex flex-col gap-5" layout>
                <AnimatePresence mode="popLayout">
                  {rest.map((song, i) => (
                    <SongRow key={song.id} song={song} index={i} onUpdate={refetch} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Footer */}
            {songs.length > 0 && (
              <div
                className="flex items-center justify-center gap-3 mt-14"
                style={{ color: 'rgba(59,31,14,0.35)' }}
              >
                <DoodleHeart size={12} color="#E69CB5" />
                <span className="font-hand text-base">our soundtrack, song by song</span>
                <DoodleHeart size={12} color="#E69CB5" />
              </div>
            )}
          </>
        )}
      </div>

      {showAdd && (
        <AddSongModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => { setShowAdd(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}