import { useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { format, parseISO } from 'date-fns'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/auth'
import { toast } from 'sonner'
import type { MapPin } from '../../../types'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── SVG pin icons (coloured teardrop shape) ────────────────
// Each pin: filled teardrop body + white circle hole + optional inner dot
// Visited: solid colour. Wishlist: muted fill + dashed stroke + star.

function makePinSvg(fillColor: string, strokeColor: string, dotColor: string, opacity = 1, wishlist = false) {
  const star = wishlist
    ? `<text x="16" y="13" text-anchor="middle" font-size="9" fill="white" opacity="0.9">✦</text>`
    : `<circle cx="16" cy="11" r="3.5" fill="${dotColor}" opacity="0.6"/>`

  const strokeAttr = wishlist
    ? `stroke="${strokeColor}" stroke-width="1.5" stroke-dasharray="3 2"`
    : `stroke="${strokeColor}" stroke-width="1"`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" opacity="${opacity}">
    <filter id="s" x="-30%" y="-10%" width="160%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(59,31,14,0.28)"/>
    </filter>
    <path d="M16 2 C8 2 3 8 3 15 C3 24 16 40 16 40 C16 40 29 24 29 15 C29 8 24 2 16 2 Z"
      fill="${fillColor}" ${strokeAttr} filter="url(#s)"/>
    <circle cx="16" cy="15" r="6" fill="white" opacity="0.35"/>
    ${star}
  </svg>`
}

// Visited pin colours
const PIN_COLORS: Record<string, { fill: string; stroke: string; dot: string }> = {
  first_date: { fill: '#E69CB5', stroke: '#c4758e', dot: '#c4758e' },
  favourite:  { fill: '#F5C842', stroke: '#c9a020', dot: '#c9a020' },
  adventure:  { fill: '#7FC8A9', stroke: '#4fa07a', dot: '#4fa07a' },
  default:    { fill: '#9B7FD4', stroke: '#6A5ACD', dot: '#6A5ACD' },
}

function svgIcon(type: string, wishlist = false) {
  const c = PIN_COLORS[type] ?? PIN_COLORS.default
  const opacity = wishlist ? 0.6 : 1
  const svg = makePinSvg(c.fill, c.stroke, c.dot, opacity, wishlist)
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
  })
}

// Pre-build icon cache
const ICON_CACHE: Record<string, L.DivIcon> = {}
function pinIcon(type: string | null, isWishlist: boolean) {
  const t = type ?? 'default'
  const key = `${t}-${isWishlist}`
  if (!ICON_CACHE[key]) ICON_CACHE[key] = svgIcon(t, isWishlist)
  return ICON_CACHE[key]
}

const PIN_LABELS: Record<string, string> = {
  first_date: 'first date',
  favourite:  'favourite',
  adventure:  'adventure',
  default:    'place',
}

// ── Click handler ──────────────────────────────────────────
function ClickHandler({
  enabled,
  onMapClick,
  onClose,
}: {
  enabled: boolean
  onMapClick: (lat: number, lng: number) => void
  onClose: () => void
}) {
  useMapEvents({
    click(e) {
      const target = e.originalEvent.target as HTMLElement
      if (target.closest('.pin-popup')) return
      onClose()
      if (enabled) onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// ── Pin popup ──────────────────────────────────────────────
// NOTE: This renders OUTSIDE the map container in MapView below,
// so it can never be clipped by the map's overflow:hidden.
interface PinPopupProps {
  pin: MapPin
  isWishlist: boolean
  onClose: () => void
  onDelete: () => void
}

function PinPopup({ pin, isWishlist, onClose, onDelete }: PinPopupProps) {
  const { user } = useUser()
  const [expanded, setExpanded]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]           = useState(false)
  const isOwner = user?.id === pin.added_by
  const hasDetails = !!(pin.story || isOwner)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('map_pins').delete().eq('id', pin.id)
      if (error) throw error
      toast.success('pin removed')
      onDelete()
      onClose()
    } catch {
      toast.error('could not delete')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const typeColor = PIN_COLORS[pin.pin_type ?? 'default']?.fill ?? '#9B7FD4'

  return (
    <motion.div
      layout
      className="pin-popup relative flex bg-cream rounded-2xl overflow-visible"
      style={{
        minWidth: 240,
        boxShadow: '0 10px 28px -10px rgba(59,31,14,0.22), 0 3px 8px -3px rgba(59,31,14,0.08)',
        border: '2px solid rgba(226,165,0,0.2)',
        overflow: 'visible',
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      {/* Left panel */}
      <motion.div layout className="flex-shrink-0 w-60 p-5 rounded-2xl bg-cream" style={{ zIndex: 1 }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs transition z-10"
          style={{ background: 'rgba(59,31,14,0.08)', color: 'rgba(59,31,14,0.4)' }}
        >
          ✕
        </button>

        {isWishlist && (
          <span className="inline-flex items-center gap-1 font-hand text-xs px-2 py-0.5 rounded-full mb-2"
            style={{
              background: 'rgba(245,200,66,0.2)',
              border: '1px dashed rgba(226,165,0,0.4)',
              color: '#E2A500',
            }}
          >
            ✦ want to go
          </span>
        )}

        <span className="font-hand text-xs block" style={{ color: typeColor }}>
          {PIN_LABELS[pin.pin_type ?? 'default']}
        </span>

        <h3 className="font-display text-lg text-chocolate mt-1 leading-tight pr-4">
          {pin.title}
        </h3>

        {pin.visited_on && (
          <p className="font-hand text-xs mt-1" style={{ color: 'rgba(59,31,14,0.35)' }}>
            {format(parseISO(pin.visited_on), 'MMMM d, yyyy')}
          </p>
        )}

        {hasDetails && (
          <div
            className="mt-4 flex items-center gap-1 cursor-pointer w-fit"
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => !confirmDelete && setExpanded(false)}
          >
            <span className="font-hand text-sm" style={{ color: '#6A5ACD' }}>
              {expanded ? 'less' : 'see more'}
            </span>
            <motion.span
              animate={{ x: expanded ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-sm"
              style={{ color: '#6A5ACD' }}
            >
              →
            </motion.span>
          </div>
        )}
      </motion.div>

      {/* Right panel — grows the card rightward, never clipped */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="details"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ overflow: 'hidden', flexShrink: 0 }}
            onHoverStart={() => setExpanded(true)}
            onHoverEnd={() => !confirmDelete && setExpanded(false)}
          >
            <div className="w-[200px] h-full flex flex-col justify-between p-5"
              style={{ borderLeft: '1px solid rgba(245,200,66,0.3)' }}
            >
              <div>
                {pin.story ? (
                  <p className="font-hand text-sm text-chocolate leading-relaxed">{pin.story}</p>
                ) : (
                  <p className="font-hand text-sm italic" style={{ color: 'rgba(59,31,14,0.3)' }}>
                    {isWishlist ? 'no note yet' : 'no story yet'}
                  </p>
                )}
                <p className="font-hand text-xs mt-3" style={{ color: 'rgba(59,31,14,0.2)' }}>
                  {pin.lat.toFixed(3)}, {pin.lng.toFixed(3)}
                </p>
              </div>

              {isOwner && (
                <div className="mt-4">
                  <AnimatePresence mode="wait">
                    {!confirmDelete ? (
                      <motion.button
                        key="btn"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setConfirmDelete(true)}
                        className="font-hand text-xs transition"
                        style={{ color: 'rgba(59,31,14,0.3)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,31,14,0.3)')}
                      >
                        remove pin
                      </motion.button>
                    ) : (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="space-y-1"
                      >
                        <p className="font-hand text-xs" style={{ color: '#f87171' }}>remove this pin?</p>
                        <div className="flex gap-3">
                          <button onClick={() => setConfirmDelete(false)} disabled={deleting}
                            className="font-hand text-xs transition" style={{ color: 'rgba(59,31,14,0.4)' }}>
                            keep
                          </button>
                          <button onClick={handleDelete} disabled={deleting}
                            className="font-hand text-xs font-medium transition" style={{ color: '#f87171' }}>
                            {deleting ? '…' : 'yes, remove'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Main MapView ───────────────────────────────────────────
// The map itself renders inside a clipped container.
// Popups are lifted OUT via a portal-style ref callback so they
// render in the page coordinate space and can never be clipped.

interface MapViewProps {
  pins: MapPin[]
  addMode: boolean
  onMapClick: (lat: number, lng: number) => void
  onUpdate: () => void
  loading: boolean
  isWishlist?: boolean
  // The popup is teleported into this element (page-level) to avoid map clip
  popupPortalRef?: React.RefObject<HTMLDivElement>
}

export default function MapView({
  pins, addMode, onMapClick, onUpdate, loading, isWishlist = false, 
}: MapViewProps) {
  const [activePin, setActivePin] = useState<MapPin | null>(null)
  // Store position relative to the MAP container
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null)
  const mapWrapRef = useRef<HTMLDivElement>(null)

  const handleMarkerClick = useCallback((pin: MapPin, e: L.LeafletMouseEvent) => {
    setActivePin(pin)
    // containerPoint = pixel coords within the Leaflet container
    setPopupPos({
      x: e.containerPoint.x,
      y: e.containerPoint.y,
    })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: '#FFFDF4' }}>
        <p className="font-hand text-xl" style={{ color: '#6A5ACD' }}>loading the map…</p>
      </div>
    )
  }

  // Convert map-relative coords to page-relative (for the portal)
  const getPagePos = () => {
    if (!popupPos || !mapWrapRef.current) return null
    const rect = mapWrapRef.current.getBoundingClientRect()
    return {
      x: rect.left + popupPos.x,
      y: rect.top + popupPos.y - 52, // 52px above pin tip
    }
  }

  const pagePos = activePin ? getPagePos() : null

  return (
    <>
      <div ref={mapWrapRef} className="relative w-full h-full">
        <MapContainer
          center={[17.3850, 78.4867]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          className={addMode ? 'cursor-crosshair' : ''}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <ClickHandler
            enabled={addMode}
            onMapClick={onMapClick}
            onClose={() => setActivePin(null)}
          />

          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pinIcon(pin.pin_type, isWishlist)}
              eventHandlers={{
                click: (e) => handleMarkerClick(pin, e as L.LeafletMouseEvent),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Popup rendered OUTSIDE the map div — fixed to page coords, never clipped */}
      <AnimatePresence>
        {activePin && pagePos && (
          <motion.div
            key={activePin.id}
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{
              position: 'fixed',
              left: pagePos.x,
              top: pagePos.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 2000,
              pointerEvents: 'auto',
            }}
          >
            <PinPopup
              pin={activePin}
              isWishlist={isWishlist}
              onClose={() => setActivePin(null)}
              onDelete={() => { setActivePin(null); onUpdate() }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}