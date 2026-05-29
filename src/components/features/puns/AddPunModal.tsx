import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'

interface AddPunModalProps {
  onClose: () => void
  onSuccess: () => void
}

// Scribble underline SVG path
function ScribbleUnderline({ color = '#9B7FD4' }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 80 10"
      style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 10, overflow: 'visible' }}
      preserveAspectRatio="none"
    >
      <path
        d="M0 5 C10 2, 20 8, 30 5 S50 2, 60 5 S75 8, 80 5"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function AddPunModal({ onClose, onSuccess }: AddPunModalProps) {
  const { user } = useUser()
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = async () => {
    if (!body.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('puns').insert({
        author_id: user.id,
        body: body.trim(),
      })
      if (error) throw error
      toast.success('pun deployed ✿')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  const isEmpty = !body.trim()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(59,31,14,0.60)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          zIndex: 9999,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FFFDF4',
            borderRadius: 16,
            border: '2px solid rgba(226,165,0,0.22)',
            padding: '28px 28px 24px',
            maxWidth: 480,
            width: '100%',
            position: 'relative',
            boxShadow: '0 24px 48px rgba(59,31,14,0.22)',
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
          }}
        >

          {/* Drifting doodle stars */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              opacity: 0.55,
              transform: 'rotate(12deg)',
              pointerEvents: 'none',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="#F5C842">
              <polygon points="14,2 17,10 26,10 19,16 22,24 14,19 6,24 9,16 2,10 11,10" />
            </svg>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: -18,
              left: -18,
              opacity: 0.45,
              transform: 'rotate(-8deg)',
              pointerEvents: 'none',
            }}
          >
            <svg width="24" height="22" viewBox="0 0 24 22" fill="#E69CB5">
              <path d="M12 20C12 20 2 14 2 7a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13z" />
            </svg>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid rgba(59,31,14,0.12)',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: '#3B1F0E',
              zIndex: 10,
            }}
          >
            ✕
          </button>

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 13,
              color: '#9B7FD4',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              margin: '12px 0 6px',
            }}
          >
            a fresh offense
          </p>

          {/* Title */}
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 30,
              color: '#3B1F0E',
              margin: '0 0 4px',
              lineHeight: 1.15,
            }}
          >
            drop a{' '}
            <span style={{ fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
              pun
              <ScribbleUnderline color="#9B7FD4" />
            </span>
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 17,
              color: '#6A5ACD',
              margin: '0 0 16px',
            }}
          >
            brace yourself — they're rating it.
          </p>

          {/* Divider */}
          <div
            style={{
              borderTop: '1px dashed rgba(106,90,205,0.30)',
              margin: '16px 0',
            }}
          />

          {/* Textarea label */}
          <label
            htmlFor="pun-body"
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 15,
              color: '#3B1F0E',
              display: 'block',
              marginBottom: 6,
            }}
          >
            your pun
          </label>

          {/* Textarea — lined paper style */}
          <textarea
            id="pun-body"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="WE ARE CHARLIE KIRKKKKK"
            style={{
              width: '100%',
              fontFamily: 'Caveat, cursive',
              fontSize: 20,
              color: '#3B1F0E',
              background: 'rgba(255,255,255,0.7)',
              border: '2px solid rgba(59,31,14,0.10)',
              borderRadius: 12,
              padding: '12px 14px',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.7',
boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(155,127,212,0.5)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(59,31,14,0.10)')}
          />

          {/* Hint under textarea */}
          <p
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 12,
              color: 'rgba(59,31,14,0.40)',
              margin: '6px 0 0',
            }}
          >
            tip — the more groans, the better.
          </p>

          {/* Footer */}
          <div
            style={{
              borderTop: '2px dashed rgba(106,90,205,0.22)',
              marginTop: 20,
              paddingTop: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 12,
            }}
          >
            <button
              onClick={onClose}
              disabled={saving}
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 16,
                color: 'rgba(59,31,14,0.55)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              keep for later
            </button>
            <button
              onClick={handleSave}
              disabled={isEmpty || saving}
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 17,
                fontWeight: 600,
                color: isEmpty ? 'rgba(59,31,14,0.30)' : '#3B1F0E',
                background: isEmpty ? '#FFFDF4' : '#F5C842',
                border: `2px solid ${isEmpty ? 'rgba(59,31,14,0.10)' : 'rgba(226,165,0,0.30)'}`,
                borderRadius: 999,
                padding: '8px 20px',
                cursor: isEmpty ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: isEmpty ? 'none' : '0 2px 8px rgba(59,31,14,0.08)',
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
              {saving ? 'unleashing…' : 'unleash it'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}