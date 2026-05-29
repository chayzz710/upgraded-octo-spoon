import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { STATIC_PUNS } from '../../../data/puns'
import { OWNERS } from '../../../types'


function DoodleArrowCurly({ width = 70, color = '#9B7FD4', style = {} }: { width?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={width} height={width * 0.5} viewBox="0 0 70 35" fill="none" style={style}>
      <path d="M4 28 C14 10, 36 4, 56 14" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M52 8 L58 15 L48 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

function DoodleSpiral({ size = 30, color = '#9B7FD4', style = {} }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={style}>
      <path d="M15 15 C15 12, 18 9, 21 12 C24 15, 21 21, 15 21 C9 21, 6 15, 9 9 C12 3, 21 3, 24 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}


function IcCheck({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <polyline points="1.5,5 4,7.5 8.5,2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IcPencil({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8.5 1.5 L10.5 3.5 L4 10 L1.5 10.5 L2 8 Z" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="7" y1="3" x2="9" y2="5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function IcTrash({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="1.5" y1="3" x2="10.5" y2="3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M4 3 L4 1.5 L8 1.5 L8 3" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 3 L3 10 L9 10 L9.5 3" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="5" y1="5.5" x2="5" y2="8" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="7" y1="5.5" x2="7" y2="8" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}


interface PunRow {
  id: string
  body: string
  author_id: string
  rating: number | null
  rated_by: string | null
}

interface StickyNote {
  id: string
  body: string
  author_id: string
  is_done: boolean
  pos_x: number
  pos_y: number
  created_at: string
}


const USER1_COLOR = { bg: '#FFF9C4', border: '#F5C842', text: '#3B1F0E', accent: '#E2A500' }
const USER2_COLOR  = { bg: '#EDE7F6', border: '#9B7FD4', text: '#3B1F0E', accent: '#6A5ACD' }
const NOTE_WIDTH   = 120

function seededRot(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff
  return ((h % 14) - 7)
}

function randomPos() {
  return {
    pos_x: 5 + Math.random() * 60,
    pos_y: 8 + Math.random() * 55,
  }
}

function getColors(authorId: string) {
  return authorId === OWNERS.user2 ? USER2_COLOR : USER1_COLOR
}


function PunFlipCard({ days }: { days: number }) {
  const { user } = useUser()
  const [flipped, setFlipped] = useState(false)
  const [pun, setPun] = useState<PunRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [localRating, setLocalRating] = useState<number | null>(null)

  useEffect(() => {
    async function fetchPun() {
      setLoading(true)
      const { data, error } = await supabase
        .from('puns')
        .select('id, body, author_id, rating, rated_by')
        .order('created_at', { ascending: true })

      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      )

      if (!error && data && data.length > 0) {
        const idx = dayOfYear % data.length
        setPun(data[idx])
        setLocalRating(data[idx].rating)
      } else {
        const staticPun = STATIC_PUNS[dayOfYear % STATIC_PUNS.length]
        setPun({ id: 'static', body: staticPun, author_id: '', rating: null, rated_by: null })
      }
      setLoading(false)
    }
    fetchPun()
  }, [days])

  const canRate = pun && pun.id !== 'static' && user && pun.author_id !== user.id

  async function handleRate(stars: number) {
    if (!canRate || !pun || submittingRating) return
    setSubmittingRating(true)
    await supabase
      .from('puns')
      .update({ rating: stars, rated_by: user!.id })
      .eq('id', pun.id)
    setLocalRating(stars)
    setSubmittingRating(false)
  }

  const ratingLabels = ['😩 terrible', '😐 meh', '🙂 okay', '😆 good one', '🤣 got me']

  return (
    <div style={{ perspective: '1000px', width: '100%' }}>
      <div style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: 280,
      }}>

        {/* FRONT */}
        <div style={{
          position: flipped ? 'absolute' : 'relative',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: '#FFFDF4',
          borderRadius: 20,
          border: '1.5px solid rgba(155,127,212,0.2)',
          boxShadow: '0 4px 20px rgba(59,31,14,0.08)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <div style={{
            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
            width: 80, height: 16,
            background: 'repeating-linear-gradient(90deg, #9B7FD4 0px, #9B7FD4 6px, rgba(155,127,212,0.6) 6px, rgba(155,127,212,0.6) 8px)',
            opacity: 0.45,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#9B7FD4', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              pun of the day
            </span>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#3B1F0E', margin: 0 }}>
              today's groan-worthy special
            </h3>
          </div>

          <div style={{
            flex: 1,
            background: 'rgba(245,200,66,0.08)',
            borderRadius: 12,
            border: '1px dashed rgba(245,200,66,0.4)',
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 100,
          }}>
            {loading ? (
              <span style={{ fontFamily: 'Caveat, cursive', fontSize: 18, color: '#9B7FD4', opacity: 0.6 }}>
                finding a good one…
              </span>
            ) : (
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#3B1F0E', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                {pun?.body}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: 'rgba(59,31,14,0.4)' }}>
              {canRate ? 'flip to rate it →' : localRating ? `rated ${localRating}/5 🍫` : 'flip to see the rating'}
            </span>
            <button
              onClick={() => setFlipped(true)}
              style={{
                fontFamily: 'Caveat, cursive', fontSize: 15,
                color: '#9B7FD4',
                background: 'rgba(155,127,212,0.1)',
                border: '1.5px solid rgba(155,127,212,0.25)',
                borderRadius: 99, padding: '6px 16px',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(155,127,212,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(155,127,212,0.1)')}
            >
              flip it over →
            </button>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, rgba(155,127,212,0.08) 0%, rgba(245,200,66,0.06) 100%)',
          borderRadius: 20,
          border: '1.5px solid rgba(155,127,212,0.2)',
          boxShadow: '0 4px 20px rgba(59,31,14,0.08)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <div style={{
            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
            width: 80, height: 16,
            background: 'repeating-linear-gradient(90deg, #F5C842 0px, #F5C842 6px, rgba(245,200,66,0.6) 6px, rgba(245,200,66,0.6) 8px)',
            opacity: 0.45,
          }} />

          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: '#9B7FD4', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            the verdict
          </span>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 36, color: '#3B1F0E' }}>
              {localRating ? '🍫'.repeat(localRating) : '—'}
            </div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: 'rgba(59,31,14,0.5)', marginTop: 4 }}>
              {localRating ? ratingLabels[localRating - 1] : 'not rated yet'}
            </div>
          </div>

          {canRate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: 'Caveat, cursive', fontSize: 14, color: 'rgba(59,31,14,0.6)', textAlign: 'center' }}>
                {localRating ? 'change your rating:' : 'rate this pun:'}
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onMouseEnter={() => setHoveredRating(n)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => handleRate(n)}
                    disabled={submittingRating}
                    style={{
                      width: 40, height: 40, borderRadius: 99,
                      border: '1.5px solid',
                      borderColor: (hoveredRating ?? localRating ?? 0) >= n ? '#9B7FD4' : 'rgba(155,127,212,0.2)',
                      background: (hoveredRating ?? localRating ?? 0) >= n ? 'rgba(155,127,212,0.15)' : 'transparent',
                      cursor: submittingRating ? 'wait' : 'pointer',
                      fontSize: 18, transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title={ratingLabels[n - 1]}
                  >
                    🍫
                  </button>
                ))}
              </div>
            </div>
          )}

          {!canRate && pun?.id !== 'static' && pun?.author_id === user?.id && (
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 13, color: 'rgba(59,31,14,0.4)', textAlign: 'center' }}>
              can't rate your own pun 😄
            </div>
          )}

          <button
            onClick={() => setFlipped(false)}
            style={{
              fontFamily: 'Caveat, cursive', fontSize: 15,
              color: 'rgba(59,31,14,0.5)',
              background: 'none',
              border: '1px solid rgba(59,31,14,0.15)',
              borderRadius: 99, padding: '6px 16px',
              cursor: 'pointer', alignSelf: 'center',
              marginTop: 'auto',
            }}
          >
            ← flip back
          </button>
        </div>
      </div>
    </div>
  )
}


function StickyBoard() {
  const { user } = useUser()
  const boardRef = useRef<HTMLDivElement>(null)
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const dragRef = useRef<{
    noteId: string
    startMouseX: number; startMouseY: number
    startPosX: number; startPosY: number
  } | null>(null)

  async function fetchNotes() {
    const { data } = await supabase
      .from('sticky_notes')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setNotes(data)
  }

  useEffect(() => { fetchNotes() }, [])

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current || !boardRef.current) return
      const board = boardRef.current.getBoundingClientRect()
      const dx = ((e.clientX - dragRef.current.startMouseX) / board.width) * 100
      const dy = ((e.clientY - dragRef.current.startMouseY) / board.height) * 100
      const newX = Math.max(0, Math.min(82, dragRef.current.startPosX + dx))
      const newY = Math.max(0, Math.min(78, dragRef.current.startPosY + dy))
      setNotes(prev => prev.map(n =>
        n.id === dragRef.current!.noteId ? { ...n, pos_x: newX, pos_y: newY } : n
      ))
    }

    async function onMouseUp(e: MouseEvent) {
      if (!dragRef.current || !boardRef.current) return
      const board = boardRef.current.getBoundingClientRect()
      const dx = ((e.clientX - dragRef.current.startMouseX) / board.width) * 100
      const dy = ((e.clientY - dragRef.current.startMouseY) / board.height) * 100
      const newX = Math.max(0, Math.min(82, dragRef.current.startPosX + dx))
      const newY = Math.max(0, Math.min(78, dragRef.current.startPosY + dy))
      const noteId = dragRef.current.noteId
      dragRef.current = null
      await supabase.from('sticky_notes').update({ pos_x: newX, pos_y: newY }).eq('id', noteId)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  function startDrag(e: React.MouseEvent, note: StickyNote) {
    if (!user || note.author_id !== user.id) return
    if (editingId === note.id) return
    e.preventDefault()
    dragRef.current = {
      noteId: note.id,
      startMouseX: e.clientX, startMouseY: e.clientY,
      startPosX: note.pos_x, startPosY: note.pos_y,
    }
    setActiveId(note.id)
  }

  async function addNote() {
    if (!newText.trim() || !user) return
    setSaving(true)
    await supabase.from('sticky_notes').insert({
      body: newText.trim(),
      author_id: user.id,
      is_done: false,
      ...randomPos(),
    })
    setNewText('')
    setAdding(false)
    setSaving(false)
    fetchNotes()
  }

  async function toggleDone(note: StickyNote) {
    if (!user || note.author_id !== user.id) return
    await supabase.from('sticky_notes').update({ is_done: !note.is_done }).eq('id', note.id)
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, is_done: !n.is_done } : n))
  }

  async function binNote(id: string) {
    if (!user) return
    await supabase.from('sticky_notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  async function saveEdit(note: StickyNote) {
    if (!editText.trim()) return
    await supabase.from('sticky_notes').update({ body: editText.trim() }).eq('id', note.id)
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, body: editText.trim() } : n))
    setEditingId(null)
  }

  const myColors = user ? getColors(user.id) : USER1_COLOR

  return (
    <div
      ref={boardRef}
      style={{
        position: 'relative',
        height: '100%',
        borderRadius: 16,
        background: 'rgba(59,31,14,0.04)',
        backgroundImage: 'radial-gradient(rgba(59,31,14,0.08) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* board label */}
      <div style={{
        position: 'absolute', top: 12, left: 14, right: 14, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'Caveat, cursive', fontSize: 13,
        color: 'rgba(59,31,14,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em',
        pointerEvents: 'none',
      }}>
        <span>our little board</span>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: USER1_COLOR.border }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: USER2_COLOR.border }} />
        </div>
      </div>

      {/* empty state */}
      {notes.length === 0 && !adding && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Caveat, cursive', fontSize: 16, color: 'rgba(59,31,14,0.3)',
          pointerEvents: 'none',
        }}>
          no notes yet — add one 🌻
        </div>
      )}

      {/* notes */}
      {notes.map(note => {
        const c = getColors(note.author_id)
        const isOwner = user?.id === note.author_id
        const isEditing = editingId === note.id
        const isActive = activeId === note.id
        const rot = seededRot(note.id)
        const isDragging = dragRef.current?.noteId === note.id

        return (
          <div
            key={note.id}
            onMouseDown={e => { setActiveId(note.id); startDrag(e, note) }}
            onMouseEnter={() => !dragRef.current && setActiveId(note.id)}
            onMouseLeave={() => !dragRef.current && setActiveId(null)}
            style={{
              position: 'absolute',
              left: `${note.pos_x}%`,
              top: `${note.pos_y}%`,
              width: NOTE_WIDTH,
              background: c.bg,
              borderRadius: 3,
              padding: '20px 10px 8px',
              boxShadow: isActive
                ? '0 10px 28px rgba(59,31,14,0.22)'
                : '0 2px 8px rgba(59,31,14,0.13)',
              transform: isActive && !isEditing
                ? 'rotate(0deg) scale(1.06)'
                : `rotate(${rot}deg)`,
              transition: isDragging
                ? 'box-shadow 0.15s, transform 0.15s'
                : 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: isOwner && !isEditing ? 'grab' : 'default',
              zIndex: isActive || isEditing ? 10 : 1,
            }}
          >
            {/* tape */}
            <div style={{
              position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
              width: 44, height: 14,
              background: `repeating-linear-gradient(90deg, ${c.border} 0px, ${c.border} 5px, ${c.bg} 5px, ${c.bg} 7px)`,
              opacity: 0.6, pointerEvents: 'none',
            }} />

            {/* body */}
            {isEditing ? (
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                autoFocus
                rows={5}
                onMouseDown={e => e.stopPropagation()}
                style={{
                  width: '100%', border: 'none', background: 'transparent',
                  fontFamily: 'Caveat, cursive', fontSize: 14, color: c.text,
                  resize: 'none', outline: 'none', lineHeight: 1.4,
                  boxSizing: 'border-box', cursor: 'text',
                }}
              />
            ) : (
              <p style={{
                fontFamily: 'Caveat, cursive', fontSize: 14, color: c.text,
                margin: 0, lineHeight: 1.4, minHeight: 48,
                wordBreak: 'break-word',
                textDecoration: note.is_done ? 'line-through' : 'none',
                opacity: note.is_done ? 0.45 : 1,
              }}>
                {note.body}
              </p>
            )}

            {/* actions — owner only, fade in on hover */}
            {isOwner && (
              <div
                onMouseDown={e => e.stopPropagation()}
                style={{
                  display: 'flex', gap: 5, justifyContent: 'flex-end',
                  marginTop: 6,
                  opacity: isActive || isEditing ? 1 : 0,
                  transition: 'opacity 0.15s',
                  minHeight: 18,
                }}
              >
                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(note)} style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: c.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      save
                    </button>
                    <button onClick={() => setEditingId(null)} style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleDone(note)}
                      title={note.is_done ? 'mark undone' : 'mark done'}
                      style={{
                        width: 18, height: 18, borderRadius: 3,
                        border: `1.5px solid ${c.border}`,
                        background: note.is_done ? c.border : 'transparent',
                        cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      {note.is_done && <IcCheck color={c.text} />}
                    </button>
                    <button
                      onClick={() => { setEditingId(note.id); setEditText(note.body) }}
                      title="edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                    >
                      <IcPencil color={c.accent} />
                    </button>
                    <button
                      onClick={() => binNote(note.id)}
                      title="bin"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                    >
                      <IcTrash color="rgba(180,60,40,0.6)" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* new note form */}
      {adding && (
        <div style={{
          position: 'absolute', bottom: 44, left: 16,
          width: NOTE_WIDTH, zIndex: 20,
          background: myColors.bg, borderRadius: 3,
          padding: '20px 10px 10px',
          boxShadow: '0 4px 16px rgba(59,31,14,0.18)',
        }}>
          <div style={{
            position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
            width: 44, height: 14,
            background: `repeating-linear-gradient(90deg, ${myColors.border} 0px, ${myColors.border} 5px, ${myColors.bg} 5px, ${myColors.bg} 7px)`,
            opacity: 0.6,
          }} />
          <textarea
            autoFocus
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="write something…"
            rows={4}
            onMouseDown={e => e.stopPropagation()}
            style={{
              width: '100%', border: 'none', background: 'transparent',
              fontFamily: 'Caveat, cursive', fontSize: 14, color: myColors.text,
              resize: 'none', outline: 'none', lineHeight: 1.4,
              boxSizing: 'border-box',
            }}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addNote() }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={addNote} disabled={saving} style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: myColors.accent, background: 'none', border: 'none', cursor: saving ? 'wait' : 'pointer', padding: 0 }}>
              {saving ? '…' : 'pin it'}
            </button>
            <button onClick={() => { setAdding(false); setNewText('') }} style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              cancel
            </button>
          </div>
        </div>
      )}

      {/* add button */}
      <button
        onClick={() => setAdding(a => !a)}
        style={{
          position: 'absolute', bottom: 12, right: 14,
          fontFamily: 'Caveat, cursive', fontSize: 13, color: myColors.text,
          background: myColors.bg, border: `1.5px solid ${myColors.border}`,
          borderRadius: 99, padding: '4px 14px', cursor: 'pointer',
          boxShadow: '0 1px 6px rgba(59,31,14,0.1)', zIndex: 5,
        }}
      >
        {adding ? '✕ cancel' : '+ new note'}
      </button>

      <DoodleSpiral style={{ position: 'absolute', bottom: 10, left: 14, opacity: 0.3, pointerEvents: 'none' }} color="#9B7FD4" size={28} />
    </div>
  )
}


interface TodaysLittleThingProps {
  days: number
}

export default function TodaysLittleThing({ days }: TodaysLittleThingProps) {
  return (
    <section style={{ position: 'relative', paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1100, width: '90%', margin: '0 auto', padding: '0 2vw' }}>

        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          gap: 16, marginBottom: 40,
        }}>
          <DoodleArrowCurly width={70} color="#9B7FD4" />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Caveat, cursive', color: '#9B7FD4', fontSize: 18,
              textTransform: 'uppercase', letterSpacing: '0.14em',
            }}>
              today's little thing
            </div>
            <h2 style={{
              fontFamily: 'Playfair Display, serif', fontSize: 40, color: '#3B1F0E',
              margin: 0, marginTop: 4,
            }}>
              a pun, picked for today
            </h2>
          </div>
          <DoodleArrowCurly width={70} color="#9B7FD4" style={{ transform: 'scaleX(-1)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'stretch' }}>
          <PunFlipCard days={days} />
          <StickyBoard />
        </div>
      </div>
    </section>
  )
}