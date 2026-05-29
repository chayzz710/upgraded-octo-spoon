import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { Button } from '../../ui/Button'
import { toast } from 'sonner'
import type { MemoryJarNote } from '../../../types'

interface NoteModalProps {
  note: MemoryJarNote
  onClose: () => void
  onUpdate: () => void
}

const BORDER_COLOURS = ['#E69CB5', '#9B7FD4', '#F5C842', '#7FC8A9', '#3B82C4']
function noteBorderColour(id: string) {
  const code = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return BORDER_COLOURS[code % BORDER_COLOURS.length]
}

export default function NoteModal({ note, onClose, onUpdate }: NoteModalProps) {
  const { user } = useUser()
  const isOwner = user?.id === note.author_id
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]           = useState(false)
  const colour = noteBorderColour(note.id)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase
        .from('memory_jar_notes')
        .delete()
        .eq('id', note.id)
      if (error) throw error
      toast.success('note removed from the jar')
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
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-chocolate/50 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
        animate={{ scale: 1,   opacity: 1, rotate:  0 }}
        exit={{    scale: 0.5, opacity: 0, rotate:  8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="bg-cream rounded-2xl shadow-polaroid overflow-hidden"
          style={{ borderLeft: `5px solid ${colour}` }}
        >
          <div className="px-7 py-6">

            {/* colour dot + date eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colour, flexShrink: 0 }} />
              <p className="font-hand text-xs text-chocolate/35">
                {format(parseISO(note.created_at), 'MMMM d, yyyy')}
              </p>
            </div>

            {/* note body */}
            <p className="font-hand text-2xl text-chocolate leading-relaxed whitespace-pre-wrap">
              {note.body}
            </p>

            {/* footer */}
            <div className="flex items-center justify-end gap-3 mt-6">
              {isOwner && !confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="font-hand text-sm text-chocolate/20 hover:text-chocolate/50 transition"
                >
                  remove
                </button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                fold it up
              </Button>
            </div>

            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{    opacity: 0, height: 0    }}
                  className="overflow-hidden mt-3"
                >
                  <div
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: `${colour}18`, border: `1px solid ${colour}40` }}
                  >
                    <p className="font-hand text-sm flex-1" style={{ color: colour }}>
                      remove this memory?
                    </p>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={deleting}
                      className="font-hand text-sm text-chocolate/40 hover:text-chocolate transition"
                    >
                      keep it
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="font-hand text-sm font-medium transition"
                      style={{ color: colour }}
                    >
                      {deleting ? 'removing…' : 'yes, remove'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}