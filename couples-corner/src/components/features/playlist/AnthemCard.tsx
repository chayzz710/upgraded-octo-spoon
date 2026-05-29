import type { Song } from '../../../types'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'

// ── Icons ────────────────────────────────────────────────────────────────────

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

interface AnthemCardProps {
  song: Song
  onUpdate: () => void
  addedByName?: string
}

export default function AnthemCard({ song, onUpdate, addedByName }: AnthemCardProps) {
  const { user } = useUser()

  const handleUnsetAnthem = async () => {
    const { error } = await supabase
      .from('songs')
      .update({ is_anthem: false })
      .eq('id', song.id)
    if (error) { toast.error('could not update — try again'); return }
    toast.success('anthem cleared')
    onUpdate()
  }

  const addedBy = addedByName ?? (user?.id === song.added_by ? 'you' : 'them')
  const addedDate = song.created_at
    ? format(parseISO(song.created_at), 'MMM d').toLowerCase()
    : null

  return (
    <div className="relative" style={{ paddingTop: 14 }}>
      {/* Washi tapes */}
      <div style={{
        position: 'absolute', top: 0, left: '12%', width: 110, height: 20,
        background: '#F5C842', opacity: 0.8, borderRadius: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)',
        transform: 'rotate(-6deg)', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', top: 0, right: '14%', width: 90, height: 20,
        background: '#9B7FD4', opacity: 0.7, borderRadius: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)',
        transform: 'rotate(7deg)', zIndex: 2,
      }} />

      {/* Drifting star doodle */}
      <div style={{
        position: 'absolute', top: -4, left: -4, zIndex: 3,
        animation: 'drift 5s ease-in-out infinite', '--rot': '-2deg',
        color: '#E2A500',
      } as React.CSSProperties}>
        <IcStar filled size={20} />
      </div>

      {/* Card */}
      <div
        className="relative rounded-2xl"
        style={{
          background: '#FFFDF4',
          border: '1px solid rgba(226,165,0,0.28)',
          borderTop: '3px solid rgba(226,165,0,0.5)',
          boxShadow: '0 10px 28px -10px rgba(59,31,14,0.22), 0 3px 8px -3px rgba(59,31,14,0.08)',
          padding: '24px 24px 28px',
          // paper grain
          backgroundImage: `
            radial-gradient(rgba(59,31,14,0.035) 1px, transparent 1px),
            radial-gradient(rgba(59,31,14,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '22px 22px, 11px 11px',
          backgroundPosition: '0 0, 11px 11px',
          backgroundColor: '#FFFDF4',
        }}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-2" style={{ color: '#E2A500' }}>
          <IcStar filled size={13} />
          <span className="font-hand text-sm uppercase tracking-widest" style={{ color: '#E2A500' }}>
            our song
          </span>
          <span className="font-hand text-base" style={{ color: 'rgba(59,31,14,0.3)' }}>
            — side a
          </span>
        </div>

        {/* Title */}
        <p className="font-display text-3xl italic text-chocolate mb-4" style={{ lineHeight: 1.2 }}>
          "our song"
        </p>

        {/* Spotify embed in cream-warm mat */}
        <div style={{
          padding: 10,
          borderRadius: 14,
          background: '#FFF6DD',
          border: '1.5px dashed rgba(226,165,0,0.4)',
          marginBottom: 16,
        }}>
          <iframe
            src={`https://open.spotify.com/embed/track/${song.spotify_track_id}?utm_source=generator`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: 10, display: 'block' }}
          />
        </div>

        {/* Note with curly quotes */}
        {song.note && (
          <div className="flex items-start gap-1 mb-4 px-1">
            <span className="font-display italic text-2xl leading-none" style={{ color: '#9B7FD4', marginTop: -2 }}>"</span>
            <p className="font-hand text-xl flex-1" style={{ color: '#7a5a44', lineHeight: 1.4 }}>
              {song.note}
            </p>
            <span className="font-display italic text-2xl leading-none self-end" style={{ color: '#9B7FD4', marginBottom: -4 }}>"</span>
          </div>
        )}

        {/* Footer row */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1.5px dashed rgba(155,127,212,0.25)' }}
        >
          <span className="font-hand text-sm" style={{ color: 'rgba(59,31,14,0.4)' }}>
            added by {addedBy}{addedDate ? ` · ${addedDate}` : ''}
          </span>
          <button
            onClick={handleUnsetAnthem}
            className="inline-flex items-center gap-1.5 font-hand text-sm transition-opacity hover:opacity-70"
            style={{ color: '#E2A500' }}
            title="unset as anthem"
          >
            <IcStar filled size={12} />
            the one
          </button>
        </div>
      </div>
    </div>
  )
}