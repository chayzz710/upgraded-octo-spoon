import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { OWNERS } from '../../../types'
import { toast } from 'sonner'

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

async function geocodeCity(city: string): Promise<{ lat: number; lng: number; name: string } | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    )
    const data = await res.json()
    const r = data.results?.[0]
    if (!r) return null
    return { lat: r.latitude, lng: r.longitude, name: r.name }
  } catch {
    return null
  }
}

interface LocationData {
  location: string | null
  lat: number | null
  lng: number | null
}

export default function DistanceTracker() {
  const { user } = useUser()
  const [user1Loc, setUser1Loc] = useState<LocationData>({ location: null, lat: null, lng: null })
  const [user2Loc, setUser2Loc]   = useState<LocationData>({ location: null, lat: null, lng: null })
  const [editing, setEditing] = useState(false)
  const [input, setInput]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)

  const isUser1 = user?.id === OWNERS.user1
  const isUser2 = user?.id === OWNERS.user2
  const myLoc  = isUser1 ? user1Loc : user2Loc

  useEffect(() => {
    if (OWNERS.user1 === 'TBD' || OWNERS.user2 === 'TBD') { setLoading(false); return }

    Promise.all([
      supabase.from('profiles').select('current_location, current_location_lat, current_location_lng').eq('id', OWNERS.user1).single(),
      supabase.from('profiles').select('current_location, current_location_lat, current_location_lng').eq('id', OWNERS.user2).single(),
    ]).then(([{ data: cd }, { data: rd }]) => {
      if (cd) setUser1Loc({ location: cd.current_location, lat: cd.current_location_lat, lng: cd.current_location_lng })
      if (rd) setUser2Loc({ location: rd.current_location, lat: rd.current_location_lat, lng: rd.current_location_lng })
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!input.trim() || !user) return
    setSaving(true)

    const geo = await geocodeCity(input.trim())
    if (!geo) {
      toast.error("couldn't find that city — try being more specific")
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        current_location: geo.name,
        current_location_lat: geo.lat,
        current_location_lng: geo.lng,
      })
      .eq('id', user.id)

    if (error) {
      toast.error('could not save location')
      setSaving(false)
      return
    }

    const updated = { location: geo.name, lat: geo.lat, lng: geo.lng }
    if (isUser1) setUser1Loc(updated)
    if (isUser2)  setUser2Loc(updated)
    setEditing(false)
    setInput('')
    toast('location updated 📍')
    setSaving(false)
  }

  if (loading || OWNERS.user1 === 'TBD') return null

  const distance =
    user1Loc.lat && user1Loc.lng && user2Loc.lat && user2Loc.lng
      ? haversineKm(user1Loc.lat, user1Loc.lng, user2Loc.lat, user2Loc.lng)
      : null

  const bothSet  = user1Loc.location && user2Loc.location
  const sameCity = distance !== null && distance < 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}
    >
      {/* city display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'Caveat, cursive', fontSize: 20, color: '#3B1F0E' }}>
        <span style={{ color: user1Loc.location ? '#3B1F0E' : 'rgba(59,31,14,0.3)', fontStyle: user1Loc.location ? 'normal' : 'italic' }}>
          {user1Loc.location ?? 'somewhere…'}
        </span>
        <span style={{ color: 'rgba(59,31,14,0.3)', fontSize: 16 }}>↔</span>
        <span style={{ color: user2Loc.location ? '#3B1F0E' : 'rgba(59,31,14,0.3)', fontStyle: user2Loc.location ? 'normal' : 'italic' }}>
          {user2Loc.location ?? 'somewhere…'}
        </span>
      </div>

      {/* distance pill */}
      {bothSet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '6px 16px', borderRadius: 99,
            fontFamily: 'Caveat, cursive', fontSize: 14,
            background: sameCity ? 'rgba(245,200,66,0.3)' : 'rgba(155,127,212,0.12)',
            color: sameCity ? '#3B1F0E' : '#6A5ACD',
          }}
        >
          {sameCity ? 'together 💛' : `${distance?.toLocaleString()} km apart`}
        </motion.div>
      )}

      {/* edit toggle */}
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}
          >
            <input
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') setEditing(false)
              }}
              placeholder="type a city…"
              className="input-base text-sm"
              style={{ width: 160, fontSize: 14 }}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              {saving ? '…' : 'set'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="btn-ghost"
              style={{ fontSize: 12, padding: '6px 12px' }}
            >
              cancel
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setEditing(true); setInput(myLoc.location ?? '') }}
            style={{
              fontFamily: 'Caveat, cursive', fontSize: 13,
              color: 'rgba(59,31,14,0.35)', background: 'none', border: 'none',
              cursor: 'pointer', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(59,31,14,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,31,14,0.35)')}
          >
            📍 {myLoc.location ? 'update my location' : 'set my location'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}