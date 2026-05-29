import Polaroid from './Polaroid'
import { seededTilt, seededOffset } from '../../../lib/utils'
import type { Photo } from '../../../types'

// ── Layout constants ─────────────────────────────────────────────────────────
const COLS = 4
const COL_STEP = 260
const ROW_STEP = 280
const BASE_X_OFFSET = 24
const BASE_Y_OFFSET = 16
const SCATTER_X = [-28, 28] as const
const SCATTER_Y = [-18, 22] as const
const TILT_MAX = 8
const WIDTHS = [168, 200, 232] as const
const PORTRAIT_RATIO = 1.18
const LANDSCAPE_RATIO = 0.86

// ── Seeded hash ──────────────────────────────────────────────────────────────
function gHash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

interface MessyViewProps {
  photos: Photo[]
  onPhotoClick: (photo: Photo) => void
}

export default function MessyView({ photos, onPhotoClick }: MessyViewProps) {
  const containerHeight = Math.ceil(photos.length / COLS) * ROW_STEP + 100

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: containerHeight }}>
      {photos.map((photo, i) => {
        const id = photo.id

        // Size bucket
        const width = WIDTHS[gHash(id) % 3]

        // Aspect ratio
        const aspectSeed = gHash(id + 'asp') % 100
        const isPortrait = aspectSeed < 55
        const imageHeight = Math.round(width * (isPortrait ? PORTRAIT_RATIO : LANDSCAPE_RATIO))

        // Base grid position
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const baseX = col * COL_STEP + BASE_X_OFFSET
        const baseY = row * ROW_STEP + BASE_Y_OFFSET

        // Seeded scatter offset
        const ox = seededOffset(id + 'x', SCATTER_X[0], SCATTER_X[1])
        const oy = seededOffset(id + 'y', SCATTER_Y[0], SCATTER_Y[1])
        const left = baseX + ox
        const top = baseY + oy

        // Tilt
        const tilt = seededTilt(id, TILT_MAX)

        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left,
              top,
              zIndex: 10 + (i % 5),
            }}
          >
            <Polaroid
              photo={photo}
              width={width}
              imageHeight={imageHeight}
              onClick={() => onPhotoClick(photo)}
              captionAlign="center"
              showUploader={false}
              animDelay={i * 0.04}
              tiltDeg={tilt}
              context="messy"
            />
          </div>
        )
      })}
    </div>
  )
}