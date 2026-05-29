import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { Song } from '../../../types'


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

function IcClose({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 1l8 8M9 1L1 9" />
    </svg>
  )
}


function seededTilt(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff
  }
  return ((hash & 0xff) / 255) * 4 - 2 // ±2°
}


interface SongRowProps {
  song: Song
  index: number
  onUpdate: () => void
  addedByName?: string
}

export default function SongRow({ song, index, onUpdate, addedByName }: SongRowProps) {
  const { user } = useUser()
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [starHovered, setStarHovered] = useState(false)

  const isOwner = user?.id === song.added_by
  const tilt = seededTilt(song.id)
  const addedBy = addedByName ?? (isOwner ? 'you' : 'them')
  const addedDate = song.created_at
    ? format(parseISO(song.created_at), 'MMM d').toLowerCase()
    : null

  const handleSetAnthem = async () => {
    await supabase
      .from('songs')
      .update({ is_anthem: false })
      .eq('is_anthem', true)
    const { error } = await supabase
      .from('songs')
      .update({ is_anthem: true })
      .eq('id', song.id)
    if (error) { toast.error('could not update — try again'); return }
    toast.success('marked as our song ✿')
    onUpdate()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('songs').delete().eq('id', song.id)
      if (error) throw error
      toast.success('removed from the list')
      onUpdate()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
      style={{ paddingTop: 12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Orchid washi tape */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', width: 56, height: 16,
        background: '#9B7FD4', opacity: 0.7, borderRadius: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)',
        transform: 'rotate(-8deg)', zIndex: 2,
      }} />

      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid rgba(59,31,14,0.06)',
          borderTop: '3px solid rgba(155,127,212,0.4)',
          boxShadow: hovered
            ? '0 10px 28px -10px rgba(59,31,14,0.22), 0 3px 8px -3px rgba(59,31,14,0.08)'
            : '0 2px 0 rgba(59,31,14,0.05), 0 8px 18px -8px rgba(59,31,14,0.18)',
          transform: hovered ? 'rotate(0deg) translateY(-2px)' : `rotate(${tilt}deg)`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          backgroundImage: `
            radial-gradient(rgba(59,31,14,0.03) 1px, transparent 1px),
            radial-gradient(rgba(59,31,14,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px, 11px 11px',
          backgroundPosition: '0 0, 11px 11px',
          backgroundColor: 'white',
        }}
      >
        <div className="flex items-start gap-4 p-4">
          {/* Left: embed + note + meta */}
          <div className="flex-1 min-w-0">
            {/* Spotify embed in cream-warm mat */}
            <div style={{
              padding: 8,
              borderRadius: 12,
              background: '#FFF6DD',
              border: '1.5px dashed rgba(226,165,0,0.35)',
              marginBottom: song.note ? 10 : 0,
            }}>
              <iframe
                src={`https://open.spotify.com/embed/track/${song.spotify_track_id}?utm_source=generator`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ borderRadius: 8, display: 'block' }}
              />
            </div>

            {/* Note with italic quotes */}
            {song.note && (
              <div className="flex items-start gap-1 px-1 mb-2">
                <span className="font-hand text-lg leading-tight" style={{ color: '#9B7FD4', fontStyle: 'italic' }}>"</span>
                <p className="font-hand text-lg flex-1" style={{ color: '#7a5a44', lineHeight: 1.4 }}>
                  {song.note}
                </p>
                <span className="font-hand text-lg leading-tight self-end" style={{ color: '#9B7FD4', fontStyle: 'italic' }}>"</span>
              </div>
            )}

            {/* Meta */}
            <p className="font-hand text-sm px-1" style={{ color: 'rgba(59,31,14,0.35)' }}>
              — added by {addedBy}{addedDate ? ` · ${addedDate}` : ''}
            </p>
          </div>

          {/* Right: actions */}
          <div className="flex flex-col gap-2 flex-shrink-0 mt-1">
            {/* Anthem star */}
            <button
              onClick={handleSetAnthem}
              onMouseEnter={() => setStarHovered(true)}
              onMouseLeave={() => setStarHovered(false)}
              title="set as our song"
              style={{
                width: 36, height: 36, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: starHovered ? '1.5px solid #E2A500' : '1.5px dashed rgba(226,165,0,0.3)',
                background: starHovered ? 'rgba(251,233,164,0.4)' : 'white',
                color: starHovered ? '#E2A500' : 'rgba(226,165,0,0.4)',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <IcStar filled={starHovered} size={15} />
            </button>

            {/* Delete — owner only, hover-revealed */}
            {isOwner && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                title="remove"
                className="opacity-0 group-hover:opacity-100 transition-all"
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(59,31,14,0.04)',
                  color: 'rgba(59,31,14,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e45858')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,31,14,0.3)')}
              >
                <IcClose size={10} />
              </button>
            )}
          </div>
        </div>

        {/* Inline delete confirm strip */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="px-4 pb-3 pt-1 flex items-center gap-3"
                style={{ borderTop: '1px dashed rgba(228,88,88,0.2)', background: 'rgba(228,88,88,0.03)' }}
              >
                <p className="font-hand text-base flex-1" style={{ color: '#e45858' }}>
                  take this one off the tape?
                </p>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="font-hand text-base transition"
                  style={{ color: 'rgba(59,31,14,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#3B1F0E')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,31,14,0.4)')}
                >
                  keep it
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="font-hand text-base font-semibold transition"
                  style={{ color: '#e45858' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#e45858')}
                >
                  {deleting ? 'removing…' : 'yes, remove'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}