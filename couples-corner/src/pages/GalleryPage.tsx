// src/pages/GalleryPage.tsx
// Redesigned gallery page matching the scrapbook design system.

import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import MessyView from '../components/features/gallery/MessyView'
import TimeView from '../components/features/gallery/TimeView'
import UploadModal from '../components/features/gallery/UploadModal'
import PhotoModal from '../components/features/gallery/PhotoModal'
import { usePhotos } from '../hooks/usePhotos'
import type { Photo } from '../types'

type ViewMode = 'messy' | 'time'

// ── Inline icons ────────────────────────────────────────────────────────────
const IcGrid = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="6" height="6" rx="1.5" transform="rotate(-8 4 4)" />
    <rect x="10" y="2" width="6" height="6" rx="1.5" transform="rotate(5 13 5)" />
    <rect x="2" y="10" width="6" height="6" rx="1.5" transform="rotate(4 5 13)" />
    <rect x="11" y="9" width="6" height="6" rx="1.5" transform="rotate(-6 14 12)" />
  </svg>
)
const IcTime = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <circle cx="8" cy="15" r="0.8" fill="currentColor" />
    <circle cx="12" cy="15" r="0.8" fill="currentColor" />
    <circle cx="16" cy="15" r="0.8" fill="currentColor" />
  </svg>
)
const IcCamera = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E2A500" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <circle cx="12" cy="12.5" r="3" />
    <path d="M9 6V5h6v1" />
  </svg>
)
const IcPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IcSparkle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B7FD4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 L13.5 9 L20 10.5 L13.5 12 L12 18 L10.5 12 L4 10.5 L10.5 9 Z" />
    <path d="M19 2 L19.7 4.3 L22 5 L19.7 5.7 L19 8 L18.3 5.7 L16 5 L18.3 4.3 Z" />
  </svg>
)

// ── Doodle star ─────────────────────────────────────────────────────────────
function DoodleStar({ size = 14, color = '#F5C842' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1 L9.2 6.1 L14.3 5 L10.7 8.7 L13.5 13.2 L8 11.2 L2.5 13.2 L5.3 8.7 L1.7 5 L6.8 6.1 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  )
}

// ── Squiggle ─────────────────────────────────────────────────────────────────
function DoodleSquiggle() {
  return (
    <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
      <path
        d="M2 6 Q5 2 8 5 Q11 8 14 5 Q17 2 20 5 Q23 8 26 5"
        stroke="#9B7FD4"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Sunbeam blobs ────────────────────────────────────────────────────────────
function SunbeamBlobs() {
  return (
    <>
      <div style={{
        position: 'fixed', top: '5%', left: '-8%', width: 520, height: 520,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle at center, rgba(245,200,66,0.18) 0%, transparent 72%)',
      }} />
      <div style={{
        position: 'fixed', top: '20%', right: '-5%', width: 400, height: 400,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle at center, rgba(155,127,212,0.12) 0%, transparent 72%)',
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', left: '30%', width: 360, height: 360,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle at center, rgba(230,156,181,0.10) 0%, transparent 72%)',
      }} />
    </>
  )
}

// ── Loading ──────────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: 120, paddingBottom: 120, gap: 12,
    }}>
      <div style={{ animation: 'spin 2s linear infinite' }}>
        <IcSparkle />
      </div>
      <p className="font-hand" style={{ fontSize: 20, color: '#9B7FD4' }}>
        polishing the polaroids…
      </p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      margin: '40px auto', maxWidth: 420, textAlign: 'center',
      padding: 48, borderRadius: 20,
      border: '1.5px dashed rgba(155,127,212,0.28)',
      background: 'rgba(245,200,66,0.04)',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='0.7' fill='rgba(59,31,14,0.06)'/%3E%3C/svg%3E")`,
    }}>
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none" style={{ opacity: 0.35, margin: '0 auto 16px' }}>
        <circle cx="35" cy="35" r="32" stroke="#9B7FD4" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M22 44 L28 36 L34 41 L40 33 L48 44Z" stroke="#9B7FD4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="27" cy="30" r="3" stroke="#9B7FD4" strokeWidth="1.5" />
      </svg>
      <p className="font-display" style={{ fontSize: 22, color: 'rgba(59,31,14,0.55)', fontStyle: 'italic', marginBottom: 8 }}>
        the album is empty
      </p>
      <p className="font-hand" style={{ fontSize: 16, color: 'rgba(59,31,14,0.4)', marginBottom: 24 }}>
        what's the first one going in?
      </p>
      <button
        onClick={onAdd}
        style={{
          padding: '8px 22px', borderRadius: 24,
          border: '1.5px dashed rgba(155,127,212,0.5)',
          background: 'transparent', cursor: 'pointer',
          color: '#6A5ACD',
        }}
      >
        <span className="font-hand" style={{ fontSize: 15 }}>+ add the first photo</span>
      </button>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('messy')
  const [showUpload, setShowUpload] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const { photos, loading, refetch } = usePhotos()

  const count = photos.length

  return (
    <PageWrapper pageKey="gallery">
      <SunbeamBlobs />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Header row ─────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
        }}>
          {/* Left — title block */}
          <div>
            {/* eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <DoodleSquiggle />
              <span className="font-hand" style={{
                fontSize: 12, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#9B7FD4',
              }}>
                the scrapbook
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display" style={{ fontSize: 52, color: '#3b1f0e', lineHeight: 1, margin: 0 }}>
              our{' '}
              <span style={{ fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
                gallery
                {/* scribble underline */}
                <svg
                  style={{
                    position: 'absolute', bottom: -4, left: 0,
                    width: '100%', height: 8, overflow: 'visible', pointerEvents: 'none',
                  }}
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q20 1 40 4.5 Q60 8 80 4 Q90 2 100 5"
                    stroke="#F5C842"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-hand" style={{
              fontSize: 18, color: '#9B7FD4', marginTop: 10,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {count} {count === 1 ? 'memory' : 'memories'} &amp; counting
              <IcCamera />
            </p>
          </div>

          {/* Right — controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {/* View toggle */}
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'white', borderRadius: 24, padding: 4,
              boxShadow: '0 2px 8px rgba(59,31,14,0.08)',
              border: '2px solid rgba(226,165,0,0.2)',
            }}>
              {(['messy', 'time'] as ViewMode[]).map((mode) => {
                const active = viewMode === mode
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 14px', borderRadius: 20, border: 'none',
                      cursor: 'pointer', transition: 'all 0.18s ease',
                      background: active ? '#F5C842' : 'transparent',
                      color: active ? '#3b1f0e' : 'rgba(59,31,14,0.5)',
                      boxShadow: active ? '0 1px 4px rgba(59,31,14,0.12)' : 'none',
                    }}
                  >
                    {mode === 'messy' ? <IcGrid /> : <IcTime />}
                    <span className="font-hand" style={{ fontSize: 15 }}>{mode === 'messy' ? 'messy' : 'by time'}</span>
                  </button>
                )
              })}
            </div>

            {/* Add photo CTA */}
            <button
              onClick={() => setShowUpload(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 20px', borderRadius: 24,
                background: '#F5C842',
                border: '2px solid rgba(226,165,0,0.3)',
                cursor: 'pointer', color: '#3b1f0e',
                boxShadow: '0 2px 8px rgba(59,31,14,0.1)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.transform = 'translateY(-2px)'
                b.style.boxShadow = '0 6px 18px rgba(59,31,14,0.15)'
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.transform = ''
                b.style.boxShadow = '0 2px 8px rgba(59,31,14,0.1)'
              }}
            >
              <IcPlus />
              <span className="font-hand" style={{ fontSize: 15 }}>+ add photo</span>
            </button>
          </div>
        </div>

        {/* ── Dashed-star divider ──────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36,
        }}>
          <div style={{ flex: 1, borderTop: '1.5px dashed rgba(245,200,66,0.45)' }} />
          <DoodleStar size={14} color="#F5C842" />
          <div style={{ flex: 1, borderTop: '1.5px dashed rgba(245,200,66,0.45)' }} />
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        {loading ? (
          <LoadingState />
        ) : photos.length === 0 ? (
          <EmptyState onAdd={() => setShowUpload(true)} />
        ) : viewMode === 'messy' ? (
          <MessyView photos={photos} onPhotoClick={setSelectedPhoto} />
        ) : (
          <TimeView photos={photos} onPhotoClick={setSelectedPhoto} />
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { setShowUpload(false); refetch() }}
        />
      )}

      {/* Photo detail modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onUpdate={() => { setSelectedPhoto(null); refetch() }}
        />
      )}
    </PageWrapper>
  )
}