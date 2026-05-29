import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'

function IcPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

function DoodleSquiggle({ color = '#9B7FD4', size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size * 2.2} height={size * 0.6} viewBox="0 0 44 12" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 8 C8 2, 14 11, 22 6 C30 1, 36 11, 42 6" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

interface AddItemModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddItemModal({ onClose, onSuccess }: AddItemModalProps) {
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('bucket_items').insert({
        added_by: user.id,
        title: title.trim(),
        description: description.trim() || null,
      })
      if (error) throw error
      toast.success('added to the list ✿')
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

        {/* Modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.92, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, duration: 0.32 }}
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
              <DoodleSquiggle color="#E2A500" size={14} />
              <span className="font-hand text-sm uppercase tracking-widest" style={{ color: '#E2A500' }}>
                a little plan
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
              }}>thing</span>
            </h2>

            {/* Dashed divider */}
            <div className="my-4 flex items-center gap-3">
              <div style={{
                flex: 1, height: 2,
                backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)',
                backgroundSize: '10px 2px',
              }} />
              <svg width="10" height="10" viewBox="0 0 10 10" fill="#F5C842"><polygon points="5,0 6.5,3.5 10,4 7.5,6.5 8,10 5,8.5 2,10 2.5,6.5 0,4 3.5,3.5"/></svg>
              <div style={{
                flex: 1, height: 2,
                backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)',
                backgroundSize: '10px 2px',
              }} />
            </div>

            {/* Title field */}
            <div className="mb-4">
              <label className="font-hand text-lg block mb-1" style={{ color: 'rgba(59,31,14,0.65)' }}>
                what do you want to do?
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="e.g. watch a meteor shower together"
                className="w-full font-body text-[15px] text-chocolate placeholder-chocolate/30 outline-none bg-transparent"
                style={{
                  border: '2px solid rgba(59,31,14,0.1)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(155,127,212,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(59,31,14,0.1)')}
                autoFocus
              />
            </div>

            {/* Description field */}
            <div className="mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <label className="font-hand text-lg" style={{ color: 'rgba(59,31,14,0.65)' }}>
                  a little note
                </label>
                <span className="font-hand text-sm italic" style={{ color: 'rgba(59,31,14,0.3)' }}>
                  optional
                </span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="anything you want to remember about the why…"
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
              disabled={!title.trim() || saving}
              className="inline-flex items-center gap-2 font-hand text-lg transition-all"
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                background: !title.trim() || saving ? '#FFF6DD' : '#F5C842',
                border: `2px solid ${!title.trim() || saving ? 'rgba(59,31,14,0.1)' : 'rgba(226,165,0,0.3)'}`,
                color: !title.trim() || saving ? 'rgba(59,31,14,0.3)' : '#3B1F0E',
                cursor: !title.trim() || saving ? 'not-allowed' : 'pointer',
                boxShadow: title.trim() && !saving ? '0 4px 14px -4px rgba(59,31,14,0.12)' : 'none',
              }}
            >
              <IcPlus />
              {saving ? 'adding…' : 'add to the list'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}