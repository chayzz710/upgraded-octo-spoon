import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { Letter } from '../../../types'

interface LetterModalProps {
  letter: Letter
  onClose: () => void
  onUpdate: () => void
}

type Stage = 'confirm' | 'opening' | 'reading'

const PALETTE = [
  { body: '#FBE9A4', flap: '#E2A500', edge: 'rgba(226,165,0,0.30)',   seal: '#B46D83' },
  { body: '#E5DAF7', flap: '#9B7FD4', edge: 'rgba(155,127,212,0.30)', seal: '#6A5ACD' },
  { body: '#FCE0E8', flap: '#E69CB5', edge: 'rgba(230,156,181,0.32)', seal: '#B46D83' },
  { body: '#CFE2F6', flap: '#3B82C4', edge: 'rgba(59,130,196,0.28)',  seal: '#2563A8' },
  { body: '#EDE0F7', flap: '#9B7FD4', edge: 'rgba(155,127,212,0.28)', seal: '#6A5ACD' },
]

function lHash(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")'

function DoodleStar({ color = '#F5C842', size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill={color}>
      <polygon points="10,1 12,7 18,7 13.5,11 15.5,17 10,13.5 4.5,17 6.5,11 2,7 8,7" />
    </svg>
  )
}
function DoodleHeart({ color = '#E69CB5', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18" fill={color}>
      <path d="M10 16C10 16 2 10.5 2 5.5A4.5 4.5 0 0 1 10 3.5 4.5 4.5 0 0 1 18 5.5C18 10.5 10 16 10 16Z" />
    </svg>
  )
}

function IcLock({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}
function IcMail({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  )
}
function IcTrash({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  )
}
function IcSparkle({ size = 16, color = 'currentColor', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" className={className}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  )
}

export default function LetterModal({ letter, onClose, onUpdate }: LetterModalProps) {
  const { user } = useUser()
  const isSealed = !letter.opened_at
  const needsConfirm = isSealed && letter.is_open_when
  const isOwner = user?.id === letter.author_id
  const palette = PALETTE[lHash(letter.id) % PALETTE.length]

  const [stage, setStage] = useState<Stage>(needsConfirm ? 'confirm' : 'reading')
  const [flapOpen, setFlapOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const _p = letter.profiles as any
  const nickname = _p?.nickname || _p?.display_name || '—'
  const writtenDate = format(parseISO(letter.created_at), 'MMM d, yyyy').toLowerCase()
  const openedDate = letter.opened_at ? format(parseISO(letter.opened_at), 'MMM d, yyyy').toLowerCase() : null

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const openLetter = async () => {
    setStage('opening')
    setTimeout(() => setFlapOpen(true), 200)
    setTimeout(async () => {
      const { error } = await supabase
        .from('letters')
        .update({ opened_at: new Date().toISOString() })
        .eq('id', letter.id)
      if (error) { toast.error('could not open letter'); return }
      onUpdate()
      setStage('reading')
    }, 1100)
  }

  const handleReseal = async () => {
    const { error } = await supabase
      .from('letters')
      .update({ opened_at: null })
      .eq('id', letter.id)
    if (error) { toast.error('could not reseal'); return }
    toast.success('letter resealed')
    onUpdate()
    onClose()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('letters').delete().eq('id', letter.id)
      if (error) throw error
      toast.success('letter removed')
      onUpdate()
      onClose()
    } catch {
      toast.error('could not delete')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
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
      {/* Doodles sit outside the modal box — fixed positions relative to viewport */}
      <div style={{ position: 'fixed', top: 48, right: 48, opacity: 0.85, transform: 'rotate(12deg)', pointerEvents: 'none', zIndex: 10000 }}>
        <DoodleStar color="#F5C842" size={24} />
      </div>
      <div style={{ position: 'fixed', bottom: 60, left: 48, opacity: 0.70, transform: 'rotate(-8deg)', pointerEvents: 'none', zIndex: 10000 }}>
        <DoodleHeart color="#E69CB5" size={22} />
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%', maxWidth: 500,
          background: '#FFFDF4',
          backgroundImage: GRAIN,
          borderRadius: 20,
          border: `2px solid rgba(230,156,181,0.28)`,
          boxShadow: '0 24px 60px rgba(59,31,14,0.22)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 20,
            width: 32, height: 32, borderRadius: '50%',
            background: 'white', border: '1px solid rgba(59,31,14,0.12)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#3B1F0E',
          }}
        >✕</button>

        {/* ── CONFIRM STAGE ── */}
        {stage === 'confirm' && (
          <div style={{ padding: '40px 32px 32px', textAlign: 'center' }}>
            {/* Lock badge */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: palette.body, border: `1.5px dashed ${palette.edge}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <IcLock size={22} color={palette.seal} />
            </div>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#9B7FD4', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
              an open-when letter
            </p>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, color: '#3B1F0E', margin: '0 0 8px', lineHeight: 1.2 }}>
              {letter.title}
            </h2>
            {letter.unlock_condition && (
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: '#6A5ACD', fontStyle: 'italic', margin: '0 0 20px' }}>
                "{letter.unlock_condition}"
              </p>
            )}
            <div style={{ borderTop: '1px dashed rgba(106,90,205,0.28)', margin: '20px 0' }} />
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: 'rgba(59,31,14,0.60)', marginBottom: 4 }}>
              is this the right moment?
            </p>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 15, color: 'rgba(59,31,14,0.40)', marginBottom: 28 }}>
              it can only be opened once.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={onClose}
                style={{ fontFamily: 'Caveat, cursive', fontSize: 17, color: 'rgba(59,31,14,0.55)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                not yet
              </button>
              <button
                onClick={openLetter}
                style={{
                  fontFamily: 'Caveat, cursive', fontSize: 17, fontWeight: 600,
                  color: '#3B1F0E', background: '#F5C842',
                  border: '2px solid rgba(226,165,0,0.30)', borderRadius: 999,
                  padding: '10px 22px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 2px 8px rgba(59,31,14,0.08)',
                }}
              >
                <IcMail size={16} color="#3B1F0E" />
                yes, open it
              </button>
            </div>
          </div>
        )}

        {/* ── OPENING STAGE ── */}
        {stage === 'opening' && (
          <div style={{
            padding: '32px 32px 40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 300,
            background: 'linear-gradient(180deg, rgba(245,200,66,0.07) 0%, transparent 60%)',
          }}>
            {/* Animated envelope */}
            <div style={{ position: 'relative', width: 200, height: 144, marginBottom: 24 }}>
              <svg viewBox="0 0 280 200" style={{ width: 200, height: 144, display: 'block' }}>
                {/* Envelope body */}
                <rect x="2" y="2" width="276" height="196" rx="4"
                  fill={palette.body} stroke={palette.edge} strokeWidth="1.5" />
                {/* Address lines */}
                <line x1="18" y1="168" x2="90" y2="168" stroke={palette.edge} strokeWidth="1" strokeDasharray="4 3" />
                <line x1="18" y1="178" x2="70" y2="178" stroke={palette.edge} strokeWidth="1" strokeDasharray="4 3" />
              </svg>
              {/* Animated flap — separate element on top */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                transformOrigin: 'top center',
                transform: flapOpen ? 'perspective(600px) rotateX(-178deg)' : 'perspective(600px) rotateX(0deg)',
                transition: 'transform 0.85s cubic-bezier(.5,.05,.4,1.1)',
              }}>
                <svg viewBox="0 0 280 100" style={{ width: 200, height: 72, display: 'block' }}>
                  <polygon points="0,0 280,0 140,95" fill={palette.flap} opacity="0.65" />
                </svg>
              </div>
              {/* Seal peeling off */}
              <div style={{
                position: 'absolute', top: 52, left: '50%',
                transform: flapOpen ? 'translateX(-50%) translateY(20px) scale(0)' : 'translateX(-50%) translateY(0) scale(1)',
                transition: 'transform 0.3s ease 0.2s, opacity 0.3s ease 0.2s',
                opacity: flapOpen ? 0 : 1,
                lineHeight: 0,
              }}>
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="15" fill="#FFFDF4"
                    stroke={palette.seal} strokeWidth="1.4" strokeDasharray="3 2" />
                  <path d="M20 27 C20 27, 12 21.5, 12 16.5 A4 4 0 0 1 20 14.5 A4 4 0 0 1 28 16.5 C28 21.5 20 27 20 27Z"
                    fill={palette.seal} />
                </svg>
              </div>
            </div>
            <p style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#6A5ACD', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IcSparkle size={18} color="#6A5ACD" className="animate-spin" />
              opening…
            </p>
          </div>
        )}

        {/* ── READING STAGE ── */}
        {stage === 'reading' && (
          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            {/* Header band */}
            <div style={{
              padding: '28px 28px 16px',
              background: `linear-gradient(180deg, ${palette.flap}44 0%, transparent 100%)`,
            }}>
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: palette.seal, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>
                A LETTER
              </p>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, color: '#3B1F0E', margin: '0 0 4px', lineHeight: 1.2 }}>
                {letter.title}
              </h2>
              {letter.is_open_when && letter.unlock_condition && (
                <p style={{ fontFamily: 'Caveat, cursive', fontSize: 17, color: '#6A5ACD', fontStyle: 'italic', margin: '0 0 4px' }}>
                  "{letter.unlock_condition}"
                </p>
              )}
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.40)', margin: 0 }}>
                written {writtenDate} · from {nickname}
                {openedDate && ` · opened ${openedDate}`}
              </p>
            </div>

            {/* Dashed divider */}
            <div style={{ borderTop: '1px dashed rgba(106,90,205,0.25)', margin: '0 28px' }} />

            {/* Letter body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              background: '#FFFEF7',
              backgroundImage: GRAIN,
              padding: '24px 28px',
              backgroundRepeat: 'repeat',
            }}>
              <p style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 21,
                color: '#3B1F0E',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}>
                {letter.body}
              </p>
              {/* Signature */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20 }}>
                <svg width="14" height="13" viewBox="0 0 20 18" fill="#E69CB5">
                  <path d="M10 16C10 16 2 10.5 2 5.5A4.5 4.5 0 0 1 10 3.5 4.5 4.5 0 0 1 18 5.5C18 10.5 10 16 10 16Z" />
                </svg>
                <span style={{ fontFamily: 'Caveat, cursive', fontSize: 17, color: '#6A5ACD' }}>
                  always, {nickname}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              borderTop: '2px dashed rgba(106,90,205,0.22)',
              padding: '14px 20px',
            }}>
              {!confirmDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={onClose}
                    style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: 'rgba(59,31,14,0.55)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    tuck it away
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {letter.is_open_when && (
                      <button
                        onClick={handleReseal}
                        style={{
                          fontFamily: 'Caveat, cursive', fontSize: 15, color: '#6A5ACD',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5,
                        }}
                      >
                        <IcLock size={13} color="#6A5ACD" />
                        reseal
                      </button>
                    )}
                    {isOwner && (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        style={{
                          fontFamily: 'Caveat, cursive', fontSize: 15, color: 'rgba(59,31,14,0.35)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 5,
                        }}
                      >
                        <IcTrash size={13} color="rgba(59,31,14,0.35)" />
                        remove
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      borderTop: '1px dashed rgba(230,156,181,0.55)',
                      paddingTop: 12,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <p style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: '#B46D83', flex: 1 }}>
                        delete this letter for good?
                      </p>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        disabled={deleting}
                        style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: 'rgba(59,31,14,0.45)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        no, keep it
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: '#B46D83', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {deleting ? 'deleting…' : 'yes, delete'}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes env-pop {
          from { opacity: 0; transform: scale(0.9) translateY(8px) rotate(var(--rot, 0deg)); }
          to   { opacity: 1; transform: scale(1)   translateY(0)   rotate(var(--rot, 0deg)); }
        }
        @keyframes letter-rise {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-spin { animation: spin 1.2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}