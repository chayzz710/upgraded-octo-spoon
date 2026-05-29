import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'

interface WriteLetterModalProps {
  onClose: () => void
  onSuccess: () => void
}

const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")'

function IcMail({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  )
}
function IcLock({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function ScribbleUnderline({ color = '#9B7FD4' }: { color?: string }) {
  return (
    <svg viewBox="0 0 80 10" style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 10, overflow: 'visible', pointerEvents: 'none' }} preserveAspectRatio="none">
      <path d="M0 5 C10 2, 20 8, 30 5 S50 2, 60 5 S75 8, 80 5" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function WriteLetterModal({ onClose, onSuccess }: WriteLetterModalProps) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isOpenWhen, setIsOpenWhen] = useState(false)
  const [condition, setCondition] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const canSave = title.trim() && body.trim() && (!isOpenWhen || condition.trim())

  const handleSave = async () => {
    if (!canSave || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('letters').insert({
        author_id: user.id,
        title: title.trim(),
        body: body.trim(),
        is_open_when: isOpenWhen,
        unlock_condition: isOpenWhen ? condition.trim() || null : null,
      })
      if (error) throw error
      toast.success('letter sealed ✿')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'Inter, sans-serif',
    fontSize: 15,
    color: '#3B1F0E',
    background: 'rgba(255,255,255,0.75)',
    border: '2px solid rgba(59,31,14,0.10)',
    borderRadius: 12,
    padding: '10px 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Caveat, cursive',
    fontSize: 15,
    color: '#3B1F0E',
    display: 'block',
    marginBottom: 6,
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        background: 'rgba(59,31,14,0.60)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      {/* Doodles outside the modal — visible against the backdrop */}
      <div style={{ position: 'fixed', top: 48, right: 48, opacity: 0.85, transform: 'rotate(12deg)', pointerEvents: 'none', zIndex: 10000 }}>
        <svg width="24" height="24" viewBox="0 0 20 20" fill="#F5C842">
          <polygon points="10,1 12,7 18,7 13.5,11 15.5,17 10,13.5 4.5,17 6.5,11 2,7 8,7" />
        </svg>
      </div>
      <div style={{ position: 'fixed', bottom: 60, left: 48, opacity: 0.70, transform: 'rotate(-8deg)', pointerEvents: 'none', zIndex: 10000 }}>
        <svg width="22" height="20" viewBox="0 0 20 18" fill="#E69CB5">
          <path d="M10 16C10 16 2 10.5 2 5.5A4.5 4.5 0 0 1 10 3.5 4.5 4.5 0 0 1 18 5.5C18 10.5 10 16 10 16Z" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="letter-modal-scroll"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#FFFDF4',
          backgroundImage: GRAIN,
          borderRadius: 20,
          border: '2px solid rgba(230,156,181,0.28)',
          boxShadow: '0 24px 60px rgba(59,31,14,0.22)',
          padding: '28px 28px 24px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155,127,212,0.35) transparent'
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 20,
            width: 30, height: 30, borderRadius: '50%',
            background: 'white', border: '1px solid rgba(59,31,14,0.12)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#3B1F0E',
          }}
        >✕</button>

        {/* Eyebrow */}
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#B46D83', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 6px' }}>
          a new letter
        </p>

        {/* Title */}
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, color: '#3B1F0E', margin: '0 0 4px', lineHeight: 1.15 }}>
          write a{' '}
          <span style={{ fontStyle: 'italic', position: 'relative', display: 'inline-block' }}>
            letter
            <ScribbleUnderline color="#F5C842" />
          </span>
        </h2>
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: 17, color: '#6A5ACD', margin: '0 0 16px' }}>
          seal it now — open it later.
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px dashed rgba(106,90,205,0.28)', margin: '0 0 20px' }} />

        {/* Title field */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. open when you miss me"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'rgba(106,90,205,0.5)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.10)')}
          />
        </div>

        {/* Body field */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>your letter</label>
          <textarea
            rows={7}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="dear you…"
            style={{
              ...inputStyle,
              fontFamily: 'Caveat, cursive',
              fontSize: 20,
              resize: 'none',
              lineHeight: 1.7,
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(106,90,205,0.5)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.10)')}
          />
        </div>

        {/* Open-when toggle */}
        <div style={{
          borderRadius: 12,
          border: `1.5px dashed ${isOpenWhen ? 'rgba(180,109,131,0.45)' : 'rgba(59,31,14,0.12)'}`,
          background: isOpenWhen ? 'rgba(230,156,181,0.10)' : 'rgba(255,255,255,0.5)',
          padding: '12px 14px',
          marginBottom: 16,
          transition: 'all 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Lock icon */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IcLock size={14} color={isOpenWhen ? '#B46D83' : 'rgba(59,31,14,0.40)'} />
              </div>
              <span style={{ fontFamily: 'Caveat, cursive', fontSize: 17, color: '#3B1F0E' }}>
                make this an <em>open-when</em> letter
              </span>
            </div>
            {/* Custom toggle */}
            <button
              type="button"
              onClick={() => setIsOpenWhen(v => !v)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none',
                background: isOpenWhen ? '#E69CB5' : 'rgba(59,31,14,0.18)',
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3,
                left: isOpenWhen ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                transition: 'left 0.18s ease',
              }} />
            </button>
          </div>

          {/* Condition field — slides in */}
          <AnimatePresence>
            {isOpenWhen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>when should it be opened?</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    placeholder="e.g. you're having a hard day"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'rgba(180,109,131,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.10)')}
                  />
                  <p style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.40)', marginTop: 5 }}>
                    they'll see this on the envelope — write it as a feeling, not a date.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '2px dashed rgba(106,90,205,0.22)',
          paddingTop: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14,
        }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: 'rgba(59,31,14,0.55)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            keep for later
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            style={{
              fontFamily: 'Caveat, cursive', fontSize: 17, fontWeight: 600,
              color: canSave ? '#3B1F0E' : 'rgba(59,31,14,0.30)',
              background: canSave ? '#F5C842' : '#FFFDF4',
              border: `2px solid ${canSave ? 'rgba(226,165,0,0.30)' : 'rgba(59,31,14,0.10)'}`,
              borderRadius: 999,
              padding: '8px 20px', cursor: canSave ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: canSave ? '0 2px 8px rgba(59,31,14,0.08)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <IcMail size={15} color={canSave ? '#3B1F0E' : 'rgba(59,31,14,0.30)'} />
            {saving ? 'sealing…' : 'seal & send'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}