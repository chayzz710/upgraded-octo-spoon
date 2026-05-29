import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { parseSpotifyTrackId } from '../../../lib/utils'
import { toast } from 'sonner'


function IcPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function IcLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 8.5a3.5 3.5 0 0 0 5 0l1.5-1.5a3.5 3.5 0 0 0-5-5L6 3" />
      <path d="M8.5 5.5a3.5 3.5 0 0 0-5 0L2 7a3.5 3.5 0 0 0 5 5l1-1" />
    </svg>
  )
}


function DoodleSquiggle({ color = '#E2A500', size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size * 2.2} height={size * 0.6} viewBox="0 0 44 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 8 C8 2, 14 11, 22 6 C30 1, 36 11, 42 6" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

function DoodleStar({ size = 10, color = '#F5C842', style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill={color} style={style}>
      <polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 9.5,12 6,9.5 2.5,12 3.5,7.5 0,4.5 4.5,4.5" />
    </svg>
  )
}

function DoodleHeart({ size = 14, color = '#9B7FD4', style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color} style={style}>
      <path d="M8 14s-6-4.5-6-8a4 4 0 0 1 8 0 4 4 0 0 1 6 0c0 3.5-6 8-6 8z" />
    </svg>
  )
}


interface AddSongModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddSongModal({ onClose, onSuccess }: AddSongModalProps) {
  const { user } = useUser()
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const trackId = parseSpotifyTrackId(url)
  const isValid = !!trackId
  const showError = url.trim().length > 0 && !isValid

  const handleSave = async () => {
    if (!trackId || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('songs').insert({
        added_by: user.id,
        spotify_track_id: trackId,
        note: note.trim() || null,
      })
      if (error) throw error
      toast.success('added to the tape ✿')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: 'rgba(59,31,14,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.92, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="relative z-10 w-full max-w-md"
          style={{
            background: '#FFFDF4',
            borderRadius: 20,
            border: '2px solid rgba(226,165,0,0.2)',
            boxShadow: '0 10px 28px -10px rgba(59,31,14,0.22), 0 3px 8px -3px rgba(59,31,14,0.08)',
            paddingTop: 18,
            overflow: 'visible',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Washi tapes */}
          <div style={{
            position: 'absolute', top: -10, left: '14%', width: 80, height: 18,
            background: '#F5C842', borderRadius: 0, opacity: 0.8,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)',
            transform: 'rotate(-6deg)', zIndex: 3,
          }} />
          <div style={{
            position: 'absolute', top: -10, right: '14%', width: 68, height: 18,
            background: '#9B7FD4', borderRadius: 0, opacity: 0.7,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)',
            transform: 'rotate(8deg)', zIndex: 3,
          }} />

          {/* Doodle decorations */}
          <DoodleStar size={14} color="#F5C842" style={{
            position: 'absolute', top: 16, right: 20, zIndex: 4,
            animation: 'drift 5s ease-in-out infinite', opacity: 0.7,
          }} />
          <DoodleHeart size={12} color="#9B7FD4" style={{
            position: 'absolute', bottom: 16, left: 16, zIndex: 4,
            animation: 'drift 6s ease-in-out infinite', opacity: 0.5,
          }} />

          {/* Paper grain */}
          <div className="absolute inset-0 rounded-[18px] pointer-events-none" style={{
            backgroundImage: `
              radial-gradient(rgba(59,31,14,0.03) 1px, transparent 1px),
              radial-gradient(rgba(59,31,14,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '22px 22px, 11px 11px',
            backgroundPosition: '0 0, 11px 11px',
          }} />

          <div className="relative px-7 pb-0 pt-3">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-1">
              <DoodleSquiggle />
              <span className="font-hand text-sm uppercase tracking-widest" style={{ color: '#E2A500' }}>
                a new track
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl text-chocolate leading-tight mb-1">
              add a{' '}
              <span className="italic" style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'><path d='M2 7 C 30 1, 60 11, 100 6 S 180 2, 198 7' fill='none' stroke='%23F5C842' stroke-width='4' stroke-linecap='round'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0 100%',
                backgroundSize: '100% 0.45em',
                paddingBottom: '0.05em',
              }}>song</span>
            </h2>

            {/* Dashed divider */}
            <div className="my-4 flex items-center gap-3">
              <div style={{ flex: 1, height: 2, backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)', backgroundSize: '10px 2px' }} />
              <DoodleStar size={10} color="#F5C842" />
              <div style={{ flex: 1, height: 2, backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)', backgroundSize: '10px 2px' }} />
            </div>

            {/* Spotify link field */}
            <div className="mb-4">
              <label className="font-hand text-lg flex items-center gap-1.5 mb-1" style={{ color: 'rgba(59,31,14,0.65)' }}>
                <IcLink />
                spotify link
              </label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/…"
                className="w-full font-body text-sm text-chocolate placeholder-chocolate/30 outline-none bg-transparent"
                style={{
                  border: `2px solid ${showError ? 'rgba(228,88,88,0.45)' : 'rgba(59,31,14,0.1)'}`,
                  borderRadius: 12,
                  padding: '10px 14px',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { if (!showError) e.target.style.borderColor = 'rgba(155,127,212,0.5)' }}
                onBlur={e => { if (!showError) e.target.style.borderColor = 'rgba(59,31,14,0.1)' }}
                autoFocus
              />
              {showError && (
                <p className="font-hand text-sm mt-1.5 ml-1" style={{ color: '#e45858' }}>
                  hmm — that doesn't look like a track link
                </p>
              )}
            </div>

            {/* Preview embed */}
            {isValid && (
              <div className="mb-4" style={{
                padding: 8, borderRadius: 12,
                background: '#FFF6DD',
                border: '1.5px dashed rgba(226,165,0,0.35)',
              }}>
                <iframe
                  src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: 8, display: 'block' }}
                />
              </div>
            )}

            {/* Note field */}
            <div className="mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <label className="font-hand text-lg" style={{ color: 'rgba(59,31,14,0.65)' }}>
                  why does this one matter?
                </label>
                <span className="font-hand text-sm italic" style={{ color: 'rgba(59,31,14,0.3)' }}>
                  optional
                </span>
              </div>
              <textarea
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="this played when we…"
                className="w-full font-hand text-lg text-chocolate placeholder-chocolate/30 outline-none resize-none"
                style={{
                  border: '2px solid rgba(59,31,14,0.1)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  background: 'transparent',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(155,127,212,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.1)')}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-7 py-4"
            style={{ borderTop: '1px dashed rgba(59,31,14,0.1)' }}
          >
            <button
              onClick={onClose}
              disabled={saving}
              className="font-hand text-lg transition"
              style={{ color: 'rgba(59,31,14,0.45)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#3B1F0E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,31,14,0.45)')}
            >
              keep for later
            </button>

            <button
              onClick={handleSave}
              disabled={!isValid || saving}
              className="inline-flex items-center gap-2 font-hand text-lg transition-all"
              style={{
                padding: '8px 20px', borderRadius: 999,
                background: isValid && !saving ? '#F5C842' : '#FFF6DD',
                border: `2px solid ${isValid && !saving ? 'rgba(226,165,0,0.3)' : 'rgba(59,31,14,0.1)'}`,
                color: isValid && !saving ? '#3B1F0E' : 'rgba(59,31,14,0.3)',
                cursor: isValid && !saving ? 'pointer' : 'not-allowed',
                boxShadow: isValid && !saving ? '0 4px 14px -4px rgba(59,31,14,0.12)' : 'none',
              }}
            >
              <IcPlus />
              {saving ? 'adding…' : 'add to the tape'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}