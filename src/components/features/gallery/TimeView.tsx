import { format, parseISO } from 'date-fns'
import Polaroid from './Polaroid'
import type { Photo } from '../../../types'

// ── Month header star colours ─────────────────────────────────────────────
const STAR_COLORS = ['#F5C842', '#9B7FD4', '#7FC8A9', '#E69CB5', '#3B82C4']

// ── DoodleStar ─────────────────────────────────────────────────────────────
function DoodleStar({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M8 1 L9.2 6.1 L14.3 5 L10.7 8.7 L13.5 13.2 L8 11.2 L2.5 13.2 L5.3 8.7 L1.7 5 L6.8 6.1 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  )
}

// ── Group photos by month ──────────────────────────────────────────────────
function groupByMonth(photos: Photo[]): Array<{ month: string; photos: Photo[] }> {
  const map = new Map<string, Photo[]>()
  for (const p of photos) {
    const key = p.taken_at
      ? format(parseISO(p.taken_at), 'MMMM yyyy').toLowerCase()
      : 'unknown date'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  return Array.from(map.entries()).map(([month, photos]) => ({ month, photos }))
}

interface TimeViewProps {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}

// ── Polaroid width in time view ────────────────────────────────────────────
const TIME_PHOTO_WIDTH = 180
const TIME_PHOTO_HEIGHT = 180

export default function TimeView({ photos, onPhotoClick }: TimeViewProps) {
  const grouped = groupByMonth(photos)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {grouped.map(({ month, photos: monthPhotos }, monthIndex) => {
        const starColor = STAR_COLORS[monthIndex % STAR_COLORS.length]

        return (
          <div key={month}>
            {/* Month header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <DoodleStar color={starColor} size={16} />
              {/* Month name with scribble underline */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <span
                  className="font-hand"
                  style={{
                    fontSize: 26,
                    color: '#6A5ACD',
                    lineHeight: 1,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {month}
                </span>
                {/* Hand-drawn underline SVG */}
                <svg
                  style={{
                    position: 'absolute',
                    bottom: -3,
                    left: 0,
                    width: '100%',
                    height: 6,
                    overflow: 'visible',
                    pointerEvents: 'none',
                  }}
                  viewBox="0 0 100 6"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 4 Q25 1 50 3.5 Q75 6 100 3"
                    stroke="#9B7FD4"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </div>

              {/* Dashed line */}
              <div
                style={{
                  flex: 1,
                  height: 0,
                  borderTop: '1.5px dashed rgba(245,200,66,0.5)',
                  marginTop: 2,
                }}
              />

              {/* Count */}
              <span
                className="font-hand"
                style={{ fontSize: 13, color: 'rgba(59,31,14,0.38)', flexShrink: 0 }}
              >
                {monthPhotos.length} {monthPhotos.length === 1 ? 'photo' : 'photos'}
              </span>
            </div>

            {/* Photo grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: '16px 16px',
              }}
            >
              {monthPhotos.map((photo, photoIndex) => {
                const tilt = 0

                return (
                  <div
                    key={photo.id}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Polaroid
                      photo={photo}
                      width={TIME_PHOTO_WIDTH}
                      imageHeight={TIME_PHOTO_HEIGHT}
                      onClick={() => onPhotoClick(photo)}
                      captionAlign="left"
                      showUploader
                      animDelay={monthIndex * 0.05 + photoIndex * 0.04}
                      tiltDeg={tilt}
                      context="time"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}