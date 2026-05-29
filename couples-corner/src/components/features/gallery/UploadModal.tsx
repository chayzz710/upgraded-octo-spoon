import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import imageCompression from 'browser-image-compression'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { ChocolateRating } from '../../ui/ChocolateRating'
import { toast } from 'sonner'

// ── Icons ──────────────────────────────────────────────────────────────────
const IcCamera = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(155,127,212,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <circle cx="12" cy="12.5" r="3" />
    <path d="M9 6V5h6v1" />
  </svg>
)
const IcPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IcClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

interface UploadModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const { user } = useUser()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [takenAt, setTakenAt] = useState('')
  const [chocolateRating, setChocolateRating] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('please select an image file')
      return
    }
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFile(dropped)
    },
    [handleFile]
  )

  const handleUpload = async () => {
    if (!file || !user) return
    setUploading(true)
    setProgress(10)
    try {
      toast.info('compressing image…')
      const compressed = await imageCompression(file, {
        maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true,
      })
      setProgress(35)

      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: storageError } = await supabase.storage
        .from('photos')
        .upload(path, compressed, { contentType: compressed.type })
      if (storageError) throw storageError
      setProgress(70)

      const { error: dbError } = await supabase.from('photos').insert({
        uploaded_by: user.id,
        storage_path: path,
        caption: caption.trim() || null,
        taken_at: takenAt || null,
        chocolate_rating: chocolateRating || null,
      })
      if (dbError) throw dbError
      setProgress(100)

      toast.success('memory saved ✿')
      onSuccess()
    } catch (err) {
      toast.error('could not save — try again')
      console.error(err)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(59,31,14,0.55)', backdropFilter: 'blur(4px)' }} />

        <motion.div
          style={{
            position: 'relative', zIndex: 10, borderRadius: 24,
            background: '#FFFDF4', maxWidth: 480, width: '100%',
            boxShadow: '0 16px 48px rgba(59,31,14,0.28)',
            overflow: 'hidden',
          }}
          initial={{ scale: 0.9, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
        >

          <div style={{ padding: '32px 28px 0' }}>
            {/* Header */}
            <p className="font-hand" style={{
              fontSize: 11, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#9B7FD4', marginBottom: 4,
            }}>
              a new memory
            </p>
            <h2 className="font-display" style={{ fontSize: 26, color: '#3b1f0e', marginBottom: 4 }}>
              add a{' '}
              <span style={{
                fontStyle: 'italic', position: 'relative',
                display: 'inline-block',
              }}>
                photo
                <svg style={{ position: 'absolute', bottom: -3, left: 0, width: '100%', height: 6, overflow: 'visible', pointerEvents: 'none' }} viewBox="0 0 100 6" preserveAspectRatio="none">
                  <path d="M0 4 Q25 1 50 3.5 Q75 6 100 3" stroke="#9B7FD4" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
                </svg>
              </span>
            </h2>

            {/* Dashed divider */}
            <div style={{ borderTop: '1.5px dashed rgba(245,200,66,0.45)', margin: '16px 0 20px' }} />

            {/* Drop zone or preview */}
            {!preview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? '#9B7FD4' : 'rgba(155,127,212,0.4)'}`,
                  borderRadius: 16,
                  padding: '32px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragging ? 'rgba(155,127,212,0.06)' : 'rgba(245,200,66,0.04)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <IcCamera />
                <p className="font-hand" style={{ fontSize: 17, color: '#9B7FD4', margin: 0 }}>
                  drag a photo here, or click to pick one
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
                />
              </div>
            ) : (
              /* Polaroid preview */
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    background: 'white', padding: '8px 8px 28px',
                    borderRadius: 4, boxShadow: '0 4px 16px rgba(59,31,14,0.2)',
                    transform: 'rotate(-1.5deg)',
                  }}>
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        width: 200, height: 160, objectFit: 'cover',
                        borderRadius: 2, display: 'block',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => { setFile(null); setPreview(null) }}
                    style={{
                      position: 'absolute', top: -10, right: -10,
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'white', border: '1px solid rgba(59,31,14,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#3b1f0e', boxShadow: '0 2px 6px rgba(59,31,14,0.12)',
                    }}
                  >
                    <IcClose />
                  </button>
                </div>
              </div>
            )}

            {/* Caption */}
            <div style={{ marginTop: 20 }}>
              <label className="font-hand" style={{ fontSize: 13, color: 'rgba(59,31,14,0.45)', display: 'block', marginBottom: 6 }}>
                what's happening here?
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="write something…"
                rows={3}
                className="font-hand"
                style={{
                  width: '100%', fontSize: 16, color: '#3b1f0e',
                  background: 'transparent',
                  backgroundImage: `repeating-linear-gradient(
                    transparent, transparent 27px,
                    rgba(155,127,212,0.15) 27px, rgba(155,127,212,0.15) 28px
                  )`,
                  border: 'none', outline: 'none',
                  resize: 'none', lineHeight: '28px',
                  padding: '0', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Date */}
            <div style={{ marginTop: 16 }}>
              <label className="font-hand" style={{ fontSize: 13, color: 'rgba(59,31,14,0.45)', display: 'block', marginBottom: 6 }}>
                when was this?
              </label>
              <input
                type="date"
                value={takenAt}
                onChange={(e) => setTakenAt(e.target.value)}
                style={{
                  fontSize: 14, color: '#3b1f0e',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px dashed rgba(155,127,212,0.35)',
                  outline: 'none', padding: '2px 0', width: '100%',
                }}
              />
            </div>

            {/* Chocolate rating */}
            <div style={{ marginTop: 16, marginBottom: 4 }}>
              <label className="font-hand" style={{ fontSize: 13, color: 'rgba(59,31,14,0.45)', display: 'block', marginBottom: 8 }}>
                how good was it?
              </label>
              <ChocolateRating value={chocolateRating} onChange={setChocolateRating} size={22} interactive />
            </div>

            {/* Progress bar */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginTop: 12 }}
                >
                  <div style={{
                    width: '100%', height: 4, background: 'rgba(245,200,66,0.2)',
                    borderRadius: 4, overflow: 'hidden',
                  }}>
                    <motion.div
                      style={{ height: '100%', background: '#F5C842', borderRadius: 4 }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: 'easeOut' }}
                    />
                  </div>
                  <p className="font-hand" style={{
                    fontSize: 12, color: '#9B7FD4', textAlign: 'center', marginTop: 4,
                  }}>
                    {progress < 40 ? 'shrinking the photo…' : progress < 75 ? 'uploading…' : 'almost there…'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 28px 24px',
            borderTop: '1px dashed rgba(155,127,212,0.25)',
            marginTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={onClose}
              disabled={uploading}
              className="font-hand"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, color: 'rgba(59,31,14,0.4)',
                padding: '6px 0',
              }}
            >
              keep for later
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 22px', borderRadius: 24,
                background: (!file || uploading) ? 'rgba(245,200,66,0.35)' : '#F5C842',
                border: '2px solid rgba(226,165,0,0.3)',
                cursor: (!file || uploading) ? 'not-allowed' : 'pointer',
                color: '#3b1f0e',
                boxShadow: (!file || uploading) ? 'none' : '0 2px 8px rgba(59,31,14,0.1)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (file && !uploading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(59,31,14,0.16)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = file && !uploading ? '0 2px 8px rgba(59,31,14,0.1)' : 'none'
              }}
            >
              <IcPlus />
              <span className="font-hand" style={{ fontSize: 15 }}>
                {uploading ? 'uploading…' : 'add to the album'}
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}