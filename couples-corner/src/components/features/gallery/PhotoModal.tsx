import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { Photo } from '../../../types'

const IcClose = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IcPencil = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
)
const IcTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
)

function UploaderAvatar({ avatarUrl }: { avatarUrl?: string | null }) {
  const isEmoji = avatarUrl && !avatarUrl.startsWith('http')
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: 'rgba(245,200,66,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {avatarUrl && isEmoji
        ? <span style={{ fontSize: 14 }}>{avatarUrl}</span>
        : avatarUrl
        ? <img src={avatarUrl} alt="" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
        : <span style={{ fontSize: 14 }}>🌻</span>
      }
    </div>
  )
}

interface PhotoModalProps {
  photo: Photo
  onClose: () => void
  onUpdate: () => void
}

export default function PhotoModal({ photo, onClose, onUpdate }: PhotoModalProps) {
  const { user } = useUser()
  const [editing, setEditing] = useState(false)
  const [caption, setCaption] = useState(photo.caption ?? '')
  const [chocolateRating, setChocolateRating] = useState<number>(photo.chocolate_rating ?? 0)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOwner = user?.id === photo.uploaded_by
  const profiles = (photo as any).profiles

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.from('photos')
        .update({ caption: caption.trim() || null, chocolate_rating: chocolateRating || null })
        .eq('id', photo.id)
      if (error) throw error
      toast.success('memory saved ✿')
      setEditing(false)
      onUpdate()
    } catch { toast.error('could not save — try again') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await supabase.storage.from('photos').remove([photo.storage_path])
      const { error } = await supabase.from('photos').delete().eq('id', photo.id)
      if (error) throw error
      toast.success('memory deleted')
      onUpdate()
      onClose()
    } catch { toast.error('could not delete — try again') }
    finally { setDeleting(false); setConfirmDelete(false) }
  }

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(59,31,14,0.55)', backdropFilter: 'blur(4px)' }} />

        <motion.div
          className="relative z-10 bg-surface rounded-3xl shadow-polaroid overflow-hidden flex max-w-3xl w-full max-h-[90vh]"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          {/* LEFT — photo */}
          <div className="w-1/2 bg-chocolate/5 flex items-center justify-center flex-shrink-0">
            {photo.url
              ? <img src={photo.url} alt={photo.caption || 'memory'} className="w-full h-full object-contain max-h-[90vh]" />
              : <div className="text-6xl">📷</div>
            }
          </div>

          {/* RIGHT — details */}
          <div className="flex-1 p-6 flex flex-col overflow-y-auto">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-chocolate/10 hover:bg-chocolate/20 flex items-center justify-center transition"
              style={{ color: '#3b1f0e' }}
            >
              <IcClose />
            </button>

            {/* Uploader + date */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <UploaderAvatar avatarUrl={profiles?.avatar_url} />
                <span className="font-hand text-orchid">
                  {profiles?.nickname || profiles?.display_name || 'someone'}
                </span>
              </div>
              {photo.taken_at && (
                <p className="font-hand text-xs" style={{ color: 'rgba(59,31,14,0.4)' }}>
                  {format(parseISO(photo.taken_at), 'MMMM d, yyyy').toLowerCase()}
                </p>
              )}
            </div>

            {/* Caption */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <textarea
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    rows={3}
                    placeholder="what's happening here?"
                    className="font-hand w-full text-lg text-chocolate rounded-xl p-3 outline-none resize-none"
                    style={{
                      background: 'rgba(245,200,66,0.06)',
                      border: '1px solid rgba(245,200,66,0.4)',
                      lineHeight: 1.55,
                    }}
                  />
                  {/* Interactive chocolate rating */}
                  <div>
                    <p className="font-hand text-xs mb-2" style={{ color: 'rgba(59,31,14,0.4)' }}>how good was it?</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setChocolateRating(i + 1 === chocolateRating ? 0 : i + 1)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 20, padding: 2,
                            opacity: i < chocolateRating ? 1 : 0.22,
                            transition: 'opacity 0.1s, transform 0.1s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
                        >🍫</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {photo.caption
                    ? <p className="font-hand text-lg text-chocolate leading-relaxed">{photo.caption}</p>
                    : <p className="font-hand italic" style={{ color: 'rgba(59,31,14,0.28)' }}>no caption yet</p>
                  }
                  {(photo.chocolate_rating ?? 0) > 0 && (
                    <p className="mt-2" style={{ fontSize: 16 }}>{'🍫'.repeat(photo.chocolate_rating ?? 0)}</p>
                  )}
                </div>
              )}
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '1px dashed rgba(155,127,212,0.25)' }}>
                {editing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)} disabled={saving}
                      className="font-hand px-4 py-1.5 rounded-full text-sm"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(59,31,14,0.45)' }}
                    >cancel</button>
                    <button
                      onClick={handleSave} disabled={saving}
                      className="font-hand px-5 py-1.5 rounded-full text-sm"
                      style={{ background: '#F5C842', border: 'none', cursor: 'pointer', color: '#3b1f0e' }}
                    >{saving ? 'saving…' : 'save'}</button>
                  </div>
                ) : confirmDelete ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="font-hand text-sm mb-2" style={{ color: 'rgba(59,31,14,0.65)' }}>
                      delete this memory for good?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDelete(false)} disabled={deleting}
                        className="font-hand text-sm px-4 py-1.5 rounded-full"
                        style={{ border: '1px solid rgba(59,31,14,0.18)', background: 'transparent', cursor: 'pointer', color: 'rgba(59,31,14,0.55)' }}
                      >no, keep it</button>
                      <button
                        onClick={handleDelete} disabled={deleting}
                        className="font-hand text-sm px-4 py-1.5 rounded-full"
                        style={{ background: 'rgba(210,50,50,0.1)', border: 'none', cursor: 'pointer', color: '#c0392b' }}
                      >{deleting ? 'deleting…' : 'yes, delete'}</button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 font-hand text-sm"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6A5ACD', padding: '4px 0' }}
                    ><IcPencil /> edit</button>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-1.5 font-hand text-sm"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(59,31,14,0.32)', padding: '4px 0', transition: 'color 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(59,31,14,0.32)' }}
                    ><IcTrash /> remove</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}