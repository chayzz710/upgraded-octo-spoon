import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { toast } from 'sonner'
import { seededTilt } from '../../../lib/utils'
import type { Pun } from '../../../types'
import GroanMeter from '../../ui/GroanMeter'

interface PunCardProps {
  pun: Pun
  currentUserId: string
  onRate: () => void
  onDelete: () => void
  index: number
}

// Deterministic palette keyed by pHash(id) % 5
// clip = saturated accent used as the paperclip stroke colour
const NOTE_PALETTE = [
  { bg: '#FBE9A4', edge: 'rgba(245,200,66,0.22)',   clip: '#E2A500' }, // sunflower-soft
  { bg: '#E5DAF7', edge: 'rgba(155,127,212,0.20)',  clip: '#6A5ACD' }, // orchid-soft
  { bg: '#FCE0E8', edge: 'rgba(230,156,181,0.22)',  clip: '#C4728A' }, // rose-soft
  { bg: '#CFE2F6', edge: 'rgba(59,130,196,0.20)',   clip: '#2563A8' }, // riptide-soft
  { bg: '#D7EEDF', edge: 'rgba(80,180,120,0.20)',   clip: '#2E8B57' }, // mint-soft
]

function pHash(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0
  }
  return h
}

function pOff(id: string, salt: string, min: number, max: number): number {
  const h = pHash(id + salt)
  return min + (h % (max - min + 1))
}

// ─── Paperclip ────────────────────────────────────────────────────────────────
// Classic two-loop outline drawn as a single open path.
// Sits at -top-4, horizontally in one of three slots (left / center / right),
// lower half of the clip sweeps down over the card's top edge like a real clamp.
function Paperclip({ clipColor, slot, rotation }: {
  clipColor: string
  slot: 0 | 1 | 2   // 0 = left, 1 = center, 2 = right
  rotation: number
}) {
  // Horizontal anchor per slot
  const slotStyle: React.CSSProperties =
    slot === 0 ? { left: '14%' }
    : slot === 1 ? { left: '50%', transform: `translateX(-50%) rotate(${rotation}deg)` }
    : { right: '14%' }

  // For left/right slots, rotation is applied here
  const wrapStyle: React.CSSProperties = {
    position: 'absolute',
    top: -16,
    zIndex: 10,
    pointerEvents: 'none',
    lineHeight: 0,
    ...(slot !== 1 ? { transform: `rotate(${rotation}deg)` } : {}),
    ...slotStyle,
  }

  // The two-loop paperclip path (viewBox 0 0 32 80, rendered ~36px tall)
  // Outer loop goes all the way down; inner loop starts lower and ends higher.
  const outerPath = 'M16 6 C8 6,4 12,4 20 L4 62 C4 72,10 78,16 78 C22 78,28 72,28 62 L28 20 C28 12,24 6,16 6 Z'
  const innerPath = 'M16 18 C12 18,10 21,10 25 L10 60 C10 66,13 70,16 70 C19 70,22 66,22 60 L22 25 C22 21,20 18,16 18 Z'

  return (
    <div style={wrapStyle}>
      <svg width="20" height="48" viewBox="0 0 32 80" fill="none">
        {/* Shadow layer — offset slightly, wide stroke, very faint */}
        <g transform="translate(1.2 1.2)">
          <path d={outerPath} stroke="rgba(59,31,14,0.13)" strokeWidth="3.6"
            strokeLinecap="round" strokeLinejoin="round" />
          <path d={innerPath} stroke="rgba(59,31,14,0.10)" strokeWidth="3.2"
            strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Clip colour — outer loop */}
        <path d={outerPath} stroke={clipColor} strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round" />
        {/* Clip colour — inner loop (slightly lighter via opacity) */}
        <path d={innerPath} stroke={clipColor} strokeWidth="2.0" opacity="0.75"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// Paper grain overlay
const GRAIN_STYLE: React.CSSProperties = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'repeat',
}

export default function PunCard({ pun, currentUserId, onRate, onDelete, index }: PunCardProps) {
  const [localRating, setLocalRating] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canRate = pun.author_id !== currentUserId
  const isOwner = pun.author_id === currentUserId
  if (!pun?.id) return null
  const tilt = seededTilt(pun.id) * 0.5          // ±2.5°
  const palette = NOTE_PALETTE[pHash(pun.id) % NOTE_PALETTE.length]
  const clipSlot = (pHash(pun.id + 'cs') % 3) as 0 | 1 | 2
  const clipRotation = pOff(pun.id, 'cr', -8, 8)
  const displayRating = localRating ?? pun.rating

  const RATING_LABELS = ['', 'terrible', 'meh', 'okay', 'good', 'got me']

  const handleRate = async (value: number) => {
    if (!canRate) return
    const prev = localRating
    setLocalRating(value)
    try {
      const { error } = await supabase
        .from('puns')
        .update({ rating: value, rated_by: currentUserId })
        .eq('id', pun.id)
      if (error) throw error
      onRate()
    } catch {
      toast.error('could not save — try again')
      setLocalRating(prev)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('puns').delete().eq('id', pun.id)
      if (error) throw error
      toast.success('pun removed')
      onDelete()
    } catch {
      toast.error('could not delete')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const cssVar = { '--rot': `${tilt}deg` } as React.CSSProperties

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.86, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.86 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      className="group break-inside-avoid mb-8"
      style={{
        ...cssVar,
        transform: `rotate(var(--rot, 0deg))`,
        position: 'relative',
        paddingTop: 20,   // breathing room so paperclip doesn't overlap card content
      }}
      whileHover={{
        rotate: 0,
        y: -4,
        transition: { duration: 0.18 },
      }}
    >
      {/* Paperclip — clamped over the card's top edge */}
      <Paperclip
        clipColor={palette.clip}
        slot={clipSlot}
        rotation={clipRotation}
      />

      {/* Card */}
      <div
        style={{
          backgroundColor: palette.bg,
          border: `1px solid ${palette.edge}`,
          borderRadius: 4,
          padding: '28px 20px 14px',
          boxShadow: '0 2px 8px rgba(59,31,14,0.10), inset 0 1px 0 rgba(255,255,255,0.55)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          transition: 'box-shadow 0.18s ease',
          ...GRAIN_STYLE,
        }}
        className="group-hover:[box-shadow:0_18px_36px_-12px_rgba(59,31,14,0.32)]"
      >
        {/* Delete button — owner only, fades in on hover */}
        {isOwner && !confirmDelete && (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'rgba(59,31,14,0.22)',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.15s, color 0.15s',
            }}
            className="group-hover:!opacity-100 hover:!text-[#b46d83]"
            title="delete"
          >
            ✕
          </button>
        )}

        {/* Pun body */}
        <p style={{
          fontFamily: 'Caveat, cursive',
          fontSize: 22,
          lineHeight: 1.35,
          color: '#3B1F0E',
          margin: '0 0 14px 0',
        }}>
          {pun.body}
        </p>

        {/* Dashed divider */}
        <div style={{ borderTop: '1px dashed rgba(59,31,14,0.18)', marginBottom: 10 }} />

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>

          {/* Rating / verdict block */}
          <div>
            {canRate ? (
              <div>
                <p style={{ fontFamily: 'Caveat, cursive', fontSize: 11, color: 'rgba(59,31,14,0.45)', marginBottom: 4 }}>
                  {displayRating ? 'rated' : 'how bad was it?'}
                </p>
                <GroanMeter value={displayRating ?? null} onChange={handleRate} interactive size={16} />
              </div>
            ) : displayRating ? (
              <div>
                <p style={{ fontFamily: 'Caveat, cursive', fontSize: 11, color: 'rgba(59,31,14,0.45)', marginBottom: 4 }}>
                  {RATING_LABELS[displayRating]}
                </p>
                <GroanMeter value={displayRating} interactive={false} size={15} />
              </div>
            ) : (
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.35)', fontStyle: 'italic' }}>
                awaiting verdict…
              </p>
            )}
          </div>

          {/* Date */}
          <p style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.35)', whiteSpace: 'nowrap' }}>
            {format(parseISO(pun.created_at), 'MMM d').toLowerCase()}
          </p>
        </div>

        {/* Inline delete confirm */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                borderTop: '1px dashed rgba(230,156,181,0.55)',
                marginTop: 10,
                paddingTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <p style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#b46d83', flex: 1 }}>
                  delete this pun?
                </p>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: 'rgba(59,31,14,0.45)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  keep it
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#b46d83', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {deleting ? 'removing…' : 'yes, remove'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover author hint */}
      {pun.profiles?.nickname != null && (
        <p
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 13,
            color: '#9B7FD4',
            position: 'absolute',
            bottom: -22,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: 0,
            transition: 'opacity 0.15s',
            pointerEvents: 'none',
          }}
          className="group-hover:!opacity-100"
        >
          — {pun.profiles.nickname}
        </p>
      )}
    </motion.div>
  )
}