import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import NoteModal from '../components/features/memoryjar/NoteModal'
import AddNoteModal from '../components/features/memoryjar/AddNoteModal'
import KinderJarSVG from '../components/features/memoryjar/KinderJarSVG'
import { useMemoryJar } from '../hooks/useMemoryJar'
import { seededTilt, seededOffset } from '../lib/utils'
import type { MemoryJarNote } from '../types'

function IcPlus({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function IcShake({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 5 5 5 9v6a7 7 0 0 0 14 0V9c0-4-3-7-7-7z"/>
      <path d="M9 12h6M9 16h6"/>
    </svg>
  )
}

function DoodleSquiggle() {
  return (
    <svg width={40} height={12} viewBox="0 0 40 12" fill="none">
      <path d="M2 6 C8 2, 14 10, 20 6 S32 2, 38 6" stroke="#9B7FD4" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function DoodleStar({ size = 14, color = '#F5C842' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export default function MemoryJarPage() {
  const { notes, loading, refetch } = useMemoryJar()
  const [selectedNote, setSelectedNote] = useState<MemoryJarNote | null>(null)
  const [showAdd, setShowAdd]           = useState(false)
  const [shaking, setShaking]           = useState(false)

  const shakeJar = () => {
    if (notes.length === 0) return
    setShaking(true)
    setTimeout(() => {
      setShaking(false)
      const random = notes[Math.floor(Math.random() * notes.length)]
      setSelectedNote(random)
    }, 700)
  }

  return (
    <PageWrapper pageKey="jar">

      {/* Background blobs */}
      <div className="absolute inset-x-0 top-0 -z-0 pointer-events-none h-full overflow-hidden">
        <div style={{ position: 'absolute', width: 500, height: 500, top: -100, left: -140,
          background: 'radial-gradient(closest-side, rgba(245,200,66,0.12), rgba(0,0,0,0) 70%)', filter: 'blur(2px)' }}/>
        <div style={{ position: 'absolute', width: 400, height: 400, top: 250, right: -120,
          background: 'radial-gradient(closest-side, rgba(155,127,212,0.13), rgba(0,0,0,0) 70%)', filter: 'blur(2px)' }}/>
        <div style={{ position: 'absolute', width: 320, height: 320, bottom: 0, left: '42%',
          background: 'radial-gradient(closest-side, rgba(127,200,169,0.10), rgba(0,0,0,0) 70%)', filter: 'blur(2px)' }}/>
      </div>

      <div className="relative z-10 px-6 pt-10 pb-14 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DoodleSquiggle/>
              <span className="font-hand text-orchid text-base uppercase tracking-widest">little memories</span>
            </div>
            <h1 className="font-display text-5xl text-chocolate leading-none">
              memory{' '}
              <span style={{
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'><path d='M2 7 C 30 1, 60 11, 100 6 S 180 2, 198 7' fill='none' stroke='%23F5C842' stroke-width='4' stroke-linecap='round'/></svg>\")",
                backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%',
                backgroundSize: '100% 0.45em', paddingBottom: '0.05em', fontStyle: 'italic',
              }}>jar</span>
            </h1>
            <p className="font-hand text-xl mt-2" style={{ color: '#6A5ACD' }}>
              {notes.length} little {notes.length === 1 ? 'note' : 'notes'} inside ♥
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={shakeJar}
              disabled={notes.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-hand text-lg transition-all"
              style={notes.length > 0 ? {
                background: 'rgba(255,255,255,0.7)', border: '1.5px dashed rgba(59,31,14,0.18)',
                color: 'rgba(59,31,14,0.6)',
              } : {
                background: 'rgba(255,255,255,0.4)', border: '1.5px dashed rgba(59,31,14,0.08)',
                color: 'rgba(59,31,14,0.25)', cursor: 'not-allowed',
              }}
            >
              <IcShake size={15} color={notes.length > 0 ? 'rgba(59,31,14,0.5)' : 'rgba(59,31,14,0.2)'}/>
              shake the jar
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-hand text-xl transition-all"
              style={{ background: '#F5C842', border: '2px solid rgba(226,165,0,0.3)', color: '#3B1F0E',
                boxShadow: '0 4px 14px -4px rgba(59,31,14,0.12)' }}
            >
              <IcPlus size={16} color="#3B1F0E"/> add a note
            </button>
          </div>
        </div>

        {/* Doodle divider */}
        <div className="flex items-center gap-3 my-5">
          <div style={{ flex: 1, height: 2,
            backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.3) 50%, transparent 50%)',
            backgroundSize: '10px 2px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center' }}/>
          <DoodleStar size={14} color="#F5C842"/>
          <div style={{ flex: 1, height: 2,
            backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.3) 50%, transparent 50%)',
            backgroundSize: '10px 2px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center' }}/>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="font-hand text-xl" style={{ color: '#6A5ACD' }}>rustling through the jar…</p>
          </div>
        ) : (
          /* Canvas — jar centred, scrolls scattered all around it */
          <div className="relative" style={{ minHeight: 620 }}>

            {/* Jar — dead centre */}
            <div style={{
              position: 'absolute',
              top: '38%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 280,
              zIndex: 20,
            }}>
              <motion.div animate={shaking ? {
                rotate: [0, -10, 10, -7, 7, -4, 4, 0],
                transition: { duration: 0.65 }
              } : {}}>
                <KinderJarSVG noteCount={notes.length} jarImageSrc="/assets/memory-jar.webp" />
              </motion.div>
            </div>

            {/* Empty state */}
            {notes.length === 0 && (
              <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center' }}>
                <p className="font-display text-xl italic" style={{ color: 'rgba(59,31,14,0.35)' }}>an empty jar…</p>
                <p className="font-hand text-lg" style={{ color: '#9B7FD4' }}>drop your first little thought ✿</p>
              </div>
            )}

            {/* Scrolls scattered around the jar */}
            {notes.map((note, i) => {
              const tilt = seededTilt(note.id)
              const offX = seededOffset(note.id + 'ox', -22, 22)
              const offY = seededOffset(note.id + 'oy', -16, 16)

              const total   = notes.length
              const angle   = (i / total) * 360 + seededOffset(note.id + 'a', -25, 25)
              const rad     = (angle * Math.PI) / 180
              const radiusX = 320   // px from centre horizontally
              const radiusY = 210   // px from centre vertically
              const cx = 50 + (Math.cos(rad) * radiusX + offX) / 8    // rough px→% (container ~800px)
              const cy = 38 + (Math.sin(rad) * radiusY + offY) / 6.2  // rough px→% (container ~620px)

              return (
                <motion.div
                  key={note.id}
                  drag
                  dragMomentum={false}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${cx}%`,
                    top:  `${cy}%`,
                    width: 86,
                    touchAction: 'none',
                    zIndex: 10,
                  }}
                  initial={{ opacity: 0, scale: 0.7, rotate: tilt }}
                  animate={{ opacity: 1, scale: 1, rotate: tilt }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 18 }}
                  whileHover={{ scale: 1.14, zIndex: 30 }}
                  whileDrag={{ scale: 1.18, zIndex: 50 }}
                  onPointerUp={(e) => {
                    if (Math.abs(e.movementX) < 4 && Math.abs(e.movementY) < 4) setSelectedNote(note)
                  }}
                >
                  <img
                    src="/assets/scroll-note.png"
                    alt="memory scroll"
                    draggable={false}
                    style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
                  />
                </motion.div>
              )
            })}

          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedNote && (
          <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} onUpdate={refetch}/>
        )}
      </AnimatePresence>

      {showAdd && (
        <AddNoteModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); refetch() }}/>
      )}

    </PageWrapper>
  )
}