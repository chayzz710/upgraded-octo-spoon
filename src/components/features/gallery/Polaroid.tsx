// src/components/features/gallery/Polaroid.tsx

import type { Photo } from '../../../types'

export interface PolaroidProps {
  photo: Photo
  width: number
  imageHeight: number
  onClick: () => void
  showUploader?: boolean
  captionAlign?: 'left' | 'center'
  animDelay?: number
  tiltDeg?: number
  context?: 'messy' | 'time'
}

export default function Polaroid({
  photo,
  width,
  imageHeight,
  onClick,
  showUploader = false,
  captionAlign = 'center',
  animDelay = 0,
  tiltDeg = 0,
  context = 'messy',
}: PolaroidProps) {
  const profiles = (photo as any).profiles
  const captionSize = width <= 170 ? 13 : 15

  return (
    <div
      className="group"
      style={{
        position: 'relative',
        width,
        cursor: 'pointer',
        animation: `gal-pop 0.4s ease-out ${animDelay}s backwards`,
      }}
      onClick={onClick}
    >
      {/* Polaroid card */}
      <div
        style={{
          background: 'white',
          padding: '8px 8px 12px',
          borderRadius: 4,
          boxShadow: '0 4px 12px rgba(59,31,14,0.18)',
          transform: `rotate(${tiltDeg}deg)`,
          transformOrigin: 'center 30%',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
          zIndex: 1,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'rotate(0deg) scale(1.06)'
          el.style.boxShadow = '0 8px 24px rgba(59,31,14,0.22)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = `rotate(${tiltDeg}deg) scale(1)`
          el.style.boxShadow = '0 4px 12px rgba(59,31,14,0.18)'
        }}
      >
        {/* Photo */}
        <div style={{
          width: width - 16, height: imageHeight,
          background: 'rgba(59,31,14,0.08)', overflow: 'hidden', borderRadius: 2,
        }}>
          {photo.url
            ? <img src={photo.url} alt={photo.caption || 'memory'} loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(59,31,14,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M8.5 5.5 L9.5 3.5 L14.5 3.5 L15.5 5.5" />
                </svg>
              </div>
          }
        </div>

        {/* Caption strip */}
        <div style={{ marginTop: 6, paddingLeft: 2, paddingRight: 2 }}>
          {photo.caption && (
            <p className="font-hand" style={{
              fontSize: captionSize, color: 'rgba(59,31,14,0.75)',
              textAlign: captionAlign, overflow: 'hidden',
              display: '-webkit-box', WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical', margin: 0,
            }}>
              {photo.caption}
            </p>
          )}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: showUploader ? 'space-between' : 'center',
            marginTop: photo.caption ? 3 : 4,
          }}>
            {showUploader && (
              <span className="font-hand" style={{ fontSize: 11, color: 'rgba(59,31,14,0.32)' }}>
                {profiles?.nickname || profiles?.display_name || ''}
              </span>
            )}
            {(photo.chocolate_rating ?? 0) > 0 && (
              <span style={{ fontSize: 10 }}>{'🍫'.repeat(photo.chocolate_rating ?? 0)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Messy hover uploader */}
      {!showUploader && context === 'messy' && (
        <div className="font-hand" style={{
          position: 'absolute', bottom: -20, left: 0, right: 0,
          textAlign: 'center', fontSize: 11, color: '#9B7FD4',
          opacity: 0, transition: 'opacity 0.2s ease',
        }} data-uploader>
          — {profiles?.nickname || profiles?.display_name || 'someone'}
        </div>
      )}

      <style>{`
        @keyframes gal-pop {
          from { opacity: 0; transform: scale(0.86) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .group:hover [data-uploader] { opacity: 1 !important; }
      `}</style>
    </div>
  )
}