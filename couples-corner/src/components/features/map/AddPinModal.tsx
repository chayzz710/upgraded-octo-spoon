import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'

interface AddPinModalProps {
  lat: number
  lng: number
  defaultWishlist?: boolean
  onClose: () => void
  onSuccess: () => void
}

const PIN_TYPES = [
  { value: 'first_date', label: 'first date', color: '#E69CB5' },
  { value: 'favourite',  label: 'favourite',  color: '#F5C842' },
  { value: 'adventure',  label: 'adventure',  color: '#7FC8A9' },
  { value: 'default',    label: 'other',      color: 'rgba(155,127,212,0.5)' },
]

function IcClose({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function IcPin({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function IcStar({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export default function AddPinModal({ lat, lng, defaultWishlist = false, onClose, onSuccess }: AddPinModalProps) {
  const { user } = useUser()
  const [title, setTitle]         = useState('')
  const [story, setStory]         = useState('')
  const [pinType, setPinType]     = useState('default')
  const [visitedOn, setVisitedOn] = useState('')
  const [isWishlist, setIsWishlist] = useState(defaultWishlist)
  const [saving, setSaving]       = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !user) return
    setSaving(true)
    try {
      const { error } = await supabase.from('map_pins').insert({
        added_by:   user.id,
        lat,
        lng,
        title:      title.trim(),
        story:      story.trim() || null,
        pin_type:   pinType,
        visited_on: isWishlist ? null : (visitedOn || null),
      })
      if (error) throw error
      toast.success(isWishlist ? 'added to wishlist ✦' : 'pin dropped ✦')
      onSuccess()
    } catch {
      toast.error('could not save — try again')
    } finally {
      setSaving(false)
    }
  }

  const isValid = title.trim().length > 0

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(59,31,14,0.45)' }}
        onClick={onClose}
      />

      {/* Modal — no max-h, no overflow-y, just natural height */}
      <div
        className="relative z-10 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Card */}
        <div
          className="relative bg-cream rounded-2xl w-full"
          style={{
            boxShadow: '0 10px 28px -10px rgba(59,31,14,0.22), 0 3px 8px -3px rgba(59,31,14,0.08)',
            border: '2px solid rgba(226,165,0,0.2)',
          }}
        >
          {/* Header */}
          <div className="px-7 pt-7 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-hand text-orchid-deep text-base uppercase tracking-widest mb-1">
                  drop a pin
                </p>
                <h2 className="font-display text-2xl text-chocolate leading-tight">
                  {isWishlist
                    ? <>want to <span style={{ fontStyle: 'italic' }}>go?</span></>
                    : <>mark this <span style={{ fontStyle: 'italic' }}>place</span></>
                  }
                </h2>
                <p className="font-hand text-xs mt-0.5" style={{ color: 'rgba(59,31,14,0.3)' }}>
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition mt-1"
                style={{ background: 'rgba(59,31,14,0.07)', color: 'rgba(59,31,14,0.4)' }}
              >
                <IcClose size={14} />
              </button>
            </div>

            {/* Been here / want to go toggle */}
            <div className="flex items-center gap-2 mt-4">
              {[
                { v: false, label: 'been here',   Icon: IcPin  },
                { v: true,  label: 'want to go',  Icon: IcStar },
              ].map(({ v, label, Icon }) => (
                <button
                  key={String(v)}
                  onClick={() => setIsWishlist(v)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-hand text-base transition-all"
                  style={isWishlist === v ? {
                    background: '#F5C842',
                    border: '2px solid rgba(226,165,0,0.4)',
                    color: '#3B1F0E',
                  } : {
                    background: 'rgba(255,255,255,0.6)',
                    border: '1.5px dashed rgba(59,31,14,0.15)',
                    color: 'rgba(59,31,14,0.45)',
                  }}
                >
                  <Icon size={13} color={isWishlist === v ? '#3B1F0E' : 'rgba(59,31,14,0.35)'} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dashed divider */}
          <div style={{
            height: 1, margin: '0 28px',
            backgroundImage: 'linear-gradient(90deg, rgba(155,127,212,0.25) 50%, transparent 50%)',
            backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x',
          }} />

          {/* Form body */}
          <div className="px-7 py-5 space-y-4">
            {/* Title */}
            <div>
              <label className="font-hand text-base block mb-1.5" style={{ color: 'rgba(59,31,14,0.6)' }}>
                what's this place?
              </label>
              <input
                type="text"
                placeholder={isWishlist ? "e.g. that café we always talk about" : "e.g. where we had our first coffee"}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 font-body text-sm text-chocolate placeholder:text-chocolate/30 outline-none transition"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '2px solid rgba(59,31,14,0.08)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(155,127,212,0.5)')}
                onBlur={e =>  (e.target.style.borderColor = 'rgba(59,31,14,0.08)')}
              />
            </div>

            {/* Story — plain textarea, no lined paper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-hand text-base" style={{ color: 'rgba(59,31,14,0.6)' }}>
                  {isWishlist ? 'why do you want to go?' : 'the story'}
                </label>
                <span className="font-hand text-sm italic" style={{ color: 'rgba(59,31,14,0.3)' }}>optional</span>
              </div>
              <textarea
                placeholder={isWishlist ? "what makes this place special…" : "what happened here…"}
                value={story}
                onChange={e => setStory(e.target.value)}
                rows={3}
                className="w-full rounded-xl px-4 py-2.5 font-body text-sm text-chocolate placeholder:text-chocolate/30 outline-none transition resize-none"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  border: '2px solid rgba(59,31,14,0.08)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(155,127,212,0.5)')}
                onBlur={e =>  (e.target.style.borderColor = 'rgba(59,31,14,0.08)')}
              />
            </div>

            {/* Pin type */}
            <div>
              <label className="font-hand text-base block mb-1.5" style={{ color: 'rgba(59,31,14,0.6)' }}>type</label>
              <div className="flex flex-wrap gap-2">
                {PIN_TYPES.map(({ value, label, color }) => (
                  <button
                    key={value}
                    onClick={() => setPinType(value)}
                    className="px-3 py-1.5 rounded-full font-hand text-base transition-all"
                    style={pinType === value ? {
                      background: color,
                      border: `2px solid ${color}`,
                      color: '#3B1F0E',
                    } : {
                      background: 'rgba(255,255,255,0.6)',
                      border: '1.5px dashed rgba(59,31,14,0.15)',
                      color: 'rgba(59,31,14,0.45)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date — visited only */}
            {!isWishlist && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-hand text-base" style={{ color: 'rgba(59,31,14,0.6)' }}>when did you visit?</label>
                  <span className="font-hand text-sm italic" style={{ color: 'rgba(59,31,14,0.3)' }}>optional</span>
                </div>
                <input
                  type="date"
                  value={visitedOn}
                  onChange={e => setVisitedOn(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 font-body text-sm text-chocolate outline-none transition"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '2px solid rgba(59,31,14,0.08)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(155,127,212,0.5)')}
                  onBlur={e =>  (e.target.style.borderColor = 'rgba(59,31,14,0.08)')}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-7 pb-6 pt-0">
            <div style={{
              height: 1, marginBottom: 16,
              backgroundImage: 'linear-gradient(90deg, rgba(59,31,14,0.06) 50%, transparent 50%)',
              backgroundSize: '8px 1px', backgroundRepeat: 'repeat-x',
            }} />
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-full font-hand text-lg transition"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  border: '1.5px dashed rgba(59,31,14,0.15)',
                  color: 'rgba(59,31,14,0.5)',
                }}
              >
                cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || saving}
                className="px-5 py-2 rounded-full font-hand text-lg transition-all"
                style={isValid && !saving ? {
                  background: '#F5C842',
                  border: '2px solid rgba(226,165,0,0.3)',
                  color: '#3B1F0E',
                  boxShadow: '0 4px 14px -4px rgba(59,31,14,0.12)',
                } : {
                  background: '#FFF6DD',
                  border: '2px solid rgba(59,31,14,0.08)',
                  color: 'rgba(59,31,14,0.3)',
                  cursor: 'not-allowed',
                }}
              >
                {saving ? 'saving…' : isWishlist ? 'add to wishlist ✦' : 'drop it ✦'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}