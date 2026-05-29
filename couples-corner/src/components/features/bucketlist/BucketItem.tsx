import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { BucketItem as BucketItemType } from '../../../types'


function IcCheck({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7.5l3.5 3.5 6.5-7" />
    </svg>
  )
}

function IcClose({ className }: { className?: string }) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 1l8 8M9 1L1 9" />
    </svg>
  )
}

function IcCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="2.5" width="10" height="9" rx="1.5" />
      <path d="M1 5.5h10M4 1v3M8 1v3" />
    </svg>
  )
}


function DoneStamp() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1.5px dashed #7FC8A9',
        borderRadius: 999,
        padding: '2px 10px',
        fontFamily: 'Caveat, cursive',
        fontSize: 15,
        color: '#3f8a6a',
        letterSpacing: '0.02em',
        animation: 'drift 5s ease-in-out infinite',
        '--rot': '1deg',
        flexShrink: 0,
      } as React.CSSProperties as React.CSSProperties}
    >
      done ✿
    </span>
  )
}


function WashiTape({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        height: 18,
        width: 64,
        opacity: 0.75,
        borderRadius: 0,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)`,
        backgroundColor: color,
        ...style,
      }}
    />
  )
}


function seededTilt(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff
  }
  const norm = (hash & 0xff) / 255
  return (norm * 4 - 2) // ±2 degrees
}


interface BucketItemProps {
  item: BucketItemType
  onUpdate: () => void
  addedByName?: string
}

export default function BucketItem({ item, onUpdate, addedByName }: BucketItemProps) {
  const { user } = useUser()
  const [checking, setChecking] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [hovered, setHovered] = useState(false)

  const tilt = seededTilt(item.id)
  const isDone = item.is_done

  const handleToggle = async () => {
    setChecking(true)
    try {
      const { error } = await supabase
        .from('bucket_items')
        .update({
          is_done: !isDone,
          done_at: !isDone ? new Date().toISOString() : null,
        })
        .eq('id', item.id)
      if (error) throw error
      toast.success(isDone ? 'moved back to coming up' : 'marked as done ✿')
      onUpdate()
    } catch {
      toast.error('could not update — try again')
    } finally {
      setChecking(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('bucket_items')
        .delete()
        .eq('id', item.id)
      if (error) throw error
      toast.success('removed from the list')
      onUpdate()
    } catch {
      toast.error('could not delete — check Supabase policies')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const washiColor = isDone ? '#7FC8A9' : '#F5C842'
  const borderTopColor = isDone ? 'rgba(127,200,169,0.55)' : 'rgba(226,165,0,0.45)'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group relative"
      style={{
        paddingTop: 14,
        rotate: hovered ? 0 : tilt,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Washi tape */}
      <WashiTape
        color={washiColor}
        style={{
          top: 0,
          left: '18%',
          transform: `rotate(${tilt > 0 ? -6 : 7}deg)`,
          zIndex: 2,
        }}
      />

      {/* Card */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: isDone ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.95)',
          borderTop: `3px solid ${borderTopColor}`,
          border: `1px solid rgba(59,31,14,0.06)`,
          borderTopWidth: 3,
          borderTopColor,
          boxShadow: hovered
            ? '0 10px 28px -10px rgba(59,31,14,0.22), 0 3px 8px -3px rgba(59,31,14,0.08)'
            : '0 2px 0 rgba(59,31,14,0.05), 0 8px 18px -8px rgba(59,31,14,0.18)',
        }}
      >
        {/* Paper grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `
              radial-gradient(rgba(59,31,14,0.04) 1px, transparent 1px),
              radial-gradient(rgba(59,31,14,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '22px 22px, 11px 11px',
            backgroundPosition: '0 0, 11px 11px',
          }}
        />

        <div className="relative flex items-start gap-3 p-4">
          {/* Checkbox */}
          <motion.button
            onClick={handleToggle}
            disabled={checking}
            whileTap={{ scale: 0.85 }}
            className="flex-shrink-0 mt-0.5 transition-all"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDone
                ? '2px solid #7FC8A9'
                : '2px dashed rgba(226,165,0,0.45)',
              background: isDone
                ? '#7FC8A9'
                : hovered
                  ? 'rgba(245,200,66,0.15)'
                  : 'white',
              boxShadow: isDone ? '0 2px 8px rgba(59,31,14,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            {isDone && <IcCheck className="text-white" />}
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className="font-body font-medium text-[17px] leading-snug"
              style={{
                color: isDone ? 'rgba(59,31,14,0.4)' : '#3B1F0E',
                textDecoration: isDone ? 'line-through' : 'none',
              }}
            >
              {item.title}
            </p>

            {item.description && (
              <p
                className="font-hand text-lg mt-0.5 leading-snug"
                style={{ color: isDone ? 'rgba(59,31,14,0.3)' : '#7a5a44' }}
              >
                {item.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-1.5">
              {isDone && item.done_at ? (
                <span
                  className="font-hand text-sm flex items-center gap-1"
                  style={{ color: '#3f8a6a' }}
                >
                  <IcCalendar />
                  {format(parseISO(item.done_at), 'MMM d, yyyy').toLowerCase()}
                </span>
              ) : (
                <span
                  className="font-hand text-sm"
                  style={{ color: 'rgba(59,31,14,0.35)' }}
                >
                  — added by {addedByName ?? (user?.id === item.added_by ? 'you' : 'them')}
                </span>
              )}
            </div>
          </div>

          {/* Done stamp */}
          {isDone && (
            <div className="flex-shrink-0 self-center ml-1">
              <DoneStamp />
            </div>
          )}

          {/* Delete button — owner only */}
          {user?.id === item.added_by && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              style={{
                background: 'rgba(59,31,14,0.04)',
                color: 'rgba(59,31,14,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e45858')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,31,14,0.3)')}
            >
              <IcClose />
            </button>
          )}
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
                  take this one off the list?
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
      </motion.div>
    </motion.div>
  )
}