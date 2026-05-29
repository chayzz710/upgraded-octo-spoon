import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import MapView from '../components/features/map/MapView'
import AddPinModal from '../components/features/map/AddPinModal'
import { useMapPins } from '../hooks/useMapPins'

// ── SVG Icons ──────────────────────────────────────────────
function IcMap({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  )
}

function IcHeart({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function IcStar({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function IcPlus({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function IcFlower({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
      <path d="M12 22a3 3 0 0 1-3-3v-2a3 3 0 0 1 6 0v2a3 3 0 0 1-3 3z"/>
      <path d="M2 12a3 3 0 0 1 3-3h2a3 3 0 0 1 0 6H5a3 3 0 0 1-3-3z"/>
      <path d="M22 12a3 3 0 0 1-3 3h-2a3 3 0 0 1 0-6h2a3 3 0 0 1 3 3z"/>
    </svg>
  )
}

function IcFrog({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 18c-4 0-7-2.5-7-6 0-2 .8-3.8 2.1-5C6 5.5 5 4 5 4s2.5.5 4 2a8 8 0 0 1 6 0c1.5-1.5 4-2 4-2s-1 1.5-2.1 3c1.3 1.2 2.1 3 2.1 5 0 3.5-3 6-7 6z"/>
      <circle cx="9" cy="13" r="1" fill={color}/>
      <circle cx="15" cy="13" r="1" fill={color}/>
    </svg>
  )
}

// ── Types ──────────────────────────────────────────────────
type FilterType = 'all' | 'first_date' | 'favourite' | 'adventure'
type TabType = 'visited' | 'wishlist'

const VISITED_FILTERS: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: 'all',        label: 'all',        icon: <IcMap size={13} /> },
  { value: 'first_date', label: 'first date', icon: <IcHeart size={13} color="#E69CB5" /> },
  { value: 'favourite',  label: 'favourites', icon: <IcFlower size={13} color="#E2A500" /> },
  { value: 'adventure',  label: 'adventures', icon: <IcFrog size={13} color="#7FC8A9" /> },
]

const WISHLIST_FILTERS: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: 'all',        label: 'all',        icon: <IcMap size={13} /> },
  { value: 'first_date', label: 'first date', icon: <IcHeart size={13} color="#E69CB5" /> },
  { value: 'favourite',  label: 'favourite',  icon: <IcFlower size={13} color="#E2A500" /> },
  { value: 'adventure',  label: 'adventure',  icon: <IcFrog size={13} color="#7FC8A9" /> },
]

// ── Doodle ─────────────────────────────────────────────────
function DoodleSquiggle({ color = '#9B7FD4', size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size * 2} height={size * 0.6} viewBox="0 0 40 12" fill="none">
      <path d="M2 6 C8 2, 14 10, 20 6 S32 2, 38 6" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export default function MapPage() {
  const { pins, loading, refetch } = useMapPins()
  const [addMode, setAddMode] = useState(false)
  const [pendingLatLng, setPendingLatLng] = useState<{ lat: number; lng: number } | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [tab, setTab] = useState<TabType>('visited')

  // Split by visited_on presence
  const visitedPins = pins.filter(p => p.visited_on !== null && p.visited_on !== undefined)
  const wishlistPins = pins.filter(p => !p.visited_on)

  const activePins = tab === 'visited' ? visitedPins : wishlistPins
  const filters = tab === 'visited' ? VISITED_FILTERS : WISHLIST_FILTERS

  const filteredPins = filter === 'all'
    ? activePins
    : activePins.filter(p => p.pin_type === filter)

  const countFor = (f: FilterType) =>
    f === 'all' ? activePins.length : activePins.filter(p => p.pin_type === f).length

  const handleMapClick = (lat: number, lng: number) => {
    if (!addMode || pendingLatLng) return
    setPendingLatLng({ lat, lng })
  }

  return (
    <PageWrapper pageKey="map">
      {/* Background blobs */}
      <div className="absolute inset-x-0 top-0 -z-0 pointer-events-none h-full overflow-hidden">
        <div style={{
          position: 'absolute', width: 460, height: 460, top: -80, left: -120,
          background: 'radial-gradient(closest-side, rgba(245,200,66,0.14), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', width: 380, height: 380, top: 200, right: -120,
          background: 'radial-gradient(closest-side, rgba(155,127,212,0.12), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
        <div style={{
          position: 'absolute', width: 300, height: 300, bottom: 60, left: '40%',
          background: 'radial-gradient(closest-side, rgba(127,200,169,0.10), rgba(0,0,0,0) 70%)',
          filter: 'blur(2px)',
        }} />
      </div>

      <div className="relative z-10 px-6 pt-10 pb-14 max-w-5xl mx-auto">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DoodleSquiggle />
              <span className="font-hand text-orchid text-base uppercase tracking-widest whitespace-nowrap">
                a corner of the world
              </span>
            </div>
            <h1 className="font-display text-5xl text-chocolate leading-none">
              our{' '}
              <span style={{
                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'><path d='M2 7 C 30 1, 60 11, 100 6 S 180 2, 198 7' fill='none' stroke='%23F5C842' stroke-width='4' stroke-linecap='round'/></svg>\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0 100%',
                backgroundSize: '100% 0.45em',
                paddingBottom: '0.05em',
                fontStyle: 'italic',
              }}>
                map
              </span>
            </h1>
            <p className="font-hand text-orchid-deep text-xl mt-2">
              {visitedPins.length} visited · {wishlistPins.length} to go
              {' '}<span style={{ color: '#E69CB5' }}>♥</span>
            </p>
          </div>

          <button
            onClick={() => { setAddMode(!addMode); setPendingLatLng(null) }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-hand text-xl whitespace-nowrap shrink-0 transition-all"
            style={addMode ? {
              background: 'rgba(230,156,181,0.15)',
              border: '2px solid rgba(230,156,181,0.4)',
              color: '#9B7FD4',
              boxShadow: '0 2px 8px rgba(59,31,14,0.08)',
            } : {
              background: '#F5C842',
              border: '2px solid rgba(226,165,0,0.3)',
              color: '#3B1F0E',
              boxShadow: '0 4px 14px -4px rgba(59,31,14,0.12)',
            }}
          >
            {addMode
              ? <><span style={{ fontSize: 16 }}>✕</span> cancel</>
              : <><IcPlus size={16} /> add a place</>
            }
          </button>
        </div>

        {/* ── Doodle divider ──────────────────────────────── */}
        <div className="flex items-center gap-3 my-5">
          <div style={{
            flex: 1, height: 2,
            backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)',
            backgroundSize: '10px 2px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center',
          }} />
          <IcStar size={14} color="#F5C842" />
          <div style={{
            flex: 1, height: 2,
            backgroundImage: 'linear-gradient(90deg, rgba(106,90,205,0.35) 50%, transparent 50%)',
            backgroundSize: '10px 2px', backgroundRepeat: 'repeat-x', backgroundPosition: 'center',
          }} />
        </div>

        {/* ── Visited / Wishlist tabs ──────────────────────── */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-hand text-chocolate/50 text-base">show:</span>
          <button
            onClick={() => { setTab('visited'); setFilter('all') }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-hand text-lg transition-all whitespace-nowrap shrink-0"
            style={tab === 'visited' ? {
              background: '#F5C842',
              border: '2px solid rgba(226,165,0,0.4)',
              color: '#3B1F0E',
              boxShadow: '0 4px 14px -4px rgba(59,31,14,0.12)',
            } : {
              background: 'rgba(255,255,255,0.8)',
              border: '1.5px dashed rgba(59,31,14,0.15)',
              color: 'rgba(59,31,14,0.55)',
            }}
          >
            <IcMap size={13} color={tab === 'visited' ? '#3B1F0E' : 'rgba(59,31,14,0.4)'} />
            been here
            <span style={{ fontSize: 12, color: tab === 'visited' ? 'rgba(59,31,14,0.5)' : 'rgba(59,31,14,0.3)' }}>
              {visitedPins.length}
            </span>
          </button>

          <button
            onClick={() => { setTab('wishlist'); setFilter('all') }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-hand text-lg transition-all whitespace-nowrap shrink-0"
            style={tab === 'wishlist' ? {
              background: '#F5C842',
              border: '2px solid rgba(226,165,0,0.4)',
              color: '#3B1F0E',
              boxShadow: '0 4px 14px -4px rgba(59,31,14,0.12)',
            } : {
              background: 'rgba(255,255,255,0.8)',
              border: '1.5px dashed rgba(59,31,14,0.15)',
              color: 'rgba(59,31,14,0.55)',
            }}
          >
            <IcStar size={13} color={tab === 'wishlist' ? '#3B1F0E' : 'rgba(59,31,14,0.4)'} />
            want to go
            <span style={{ fontSize: 12, color: tab === 'wishlist' ? 'rgba(59,31,14,0.5)' : 'rgba(59,31,14,0.3)' }}>
              {wishlistPins.length}
            </span>
          </button>

          {/* sub-filter chips */}
          <div className="h-5 w-px bg-chocolate/10 mx-1" />

          {filters.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-hand text-base transition-all whitespace-nowrap shrink-0"
              style={filter === value ? {
                background: 'rgba(245,200,66,0.25)',
                border: '2px solid rgba(226,165,0,0.4)',
                color: '#3B1F0E',
              } : {
                background: 'rgba(255,255,255,0.8)',
                border: '1.5px dashed rgba(59,31,14,0.12)',
                color: 'rgba(59,31,14,0.5)',
              }}
            >
              {icon}
              {label}
              <span style={{ fontSize: 11, color: 'rgba(59,31,14,0.35)' }}>
                {countFor(value)}
              </span>
            </button>
          ))}
        </div>

        {/* ── Add mode hint ───────────────────────────────── */}
        {addMode && (
          <div className="mb-3 px-4 py-2 rounded-xl font-hand text-orchid-deep text-base"
            style={{
              background: 'rgba(229,218,247,0.5)',
              border: '1.5px dashed rgba(106,90,205,0.3)',
            }}
          >
            click anywhere on the map to drop a pin ✦
          </div>
        )}

        {/* ── Map card ────────────────────────────────────── */}
        {/* Outer wrapper: cream bg + border. Washi tapes sit on this. */}
        {/* Inner map sits inset so tapes are never covered by the map. */}
        <div className="relative">
          {/* Washi tape strips — sit on the cream border, above the map */}
          <div style={{
            position: 'absolute', height: 22, width: 90, top: -10, left: '6%',
            opacity: 0.9, zIndex: 10, borderRadius: 0,
            background: '#F5C842',
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)',
            transform: 'rotate(-5deg)',
          }} />
          <div style={{
            position: 'absolute', height: 22, width: 80, top: -10, right: '8%',
            opacity: 0.9, zIndex: 10, borderRadius: 0,
            background: '#E69CB5',
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 6px, transparent 6px 12px)',
            transform: 'rotate(7deg)',
          }} />

          {/* Cream border frame — the map sits inside with padding */}
          <div
            className="rounded-2xl bg-cream"
            style={{
              padding: '18px 16px 14px',
              boxShadow: '0 2px 0 rgba(59,31,14,0.05), 0 8px 18px -8px rgba(59,31,14,0.18)',
              border: '2px solid rgba(226,165,0,0.25)',
            }}
          >
            {/* Actual map — clipped cleanly inside the frame */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                height: '60vh',
                minHeight: 380,
                boxShadow: '0 1px 4px rgba(59,31,14,0.10) inset',
              }}
            >
              <MapView
                pins={filteredPins}
                addMode={addMode && !pendingLatLng}
                onMapClick={handleMapClick}
                onUpdate={refetch}
                loading={loading}
                isWishlist={tab === 'wishlist'}
              />
            </div>
          </div>

          {/* Map caption strip */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="font-hand text-chocolate/40 text-sm">
              hyderabad & us — {filteredPins.length} {tab === 'wishlist' ? 'dream' : 'memor'}{filteredPins.length === 1 ? (tab === 'wishlist' ? '' : 'y') : (tab === 'wishlist' ? 's' : 'ies')} pinned
            </span>
            <span className="font-hand text-chocolate/30 text-sm">
              ✦ tap a pin to read the story
            </span>
          </div>
        </div>

        {/* ── Footer note ─────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <IcHeart size={12} color="#E69CB5" />
          <span className="font-hand text-chocolate/40 text-base">
            places we've been, places we want to go
          </span>
          <IcHeart size={12} color="#E69CB5" />
        </div>
      </div>

      {/* ── Add pin modal ────────────────────────────────── */}
      {pendingLatLng && (
        <AddPinModal
          lat={pendingLatLng.lat}
          lng={pendingLatLng.lng}
          defaultWishlist={tab === 'wishlist'}
          onClose={() => { setPendingLatLng(null); setAddMode(false) }}
          onSuccess={() => { setPendingLatLng(null); setAddMode(false); refetch() }}
        />
      )}
    </PageWrapper>
  )
}