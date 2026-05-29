import type { Letter } from '../../../types'

interface EnvelopeCardProps {
  letter: Letter
  onClick: () => void
  index?: number
}

const PALETTE = [
  { body: '#FBE9A4', flap: '#E2A500', edge: 'rgba(226,165,0,0.30)',  seal: '#B46D83' }, // sunflower
  { body: '#E5DAF7', flap: '#9B7FD4', edge: 'rgba(155,127,212,0.30)', seal: '#6A5ACD' }, // orchid
  { body: '#FCE0E8', flap: '#E69CB5', edge: 'rgba(230,156,181,0.32)', seal: '#B46D83' }, // rose
  { body: '#CFE2F6', flap: '#3B82C4', edge: 'rgba(59,130,196,0.28)',  seal: '#2563A8' }, // riptide
  { body: '#EDE0F7', flap: '#9B7FD4', edge: 'rgba(155,127,212,0.28)', seal: '#6A5ACD' }, // lavender
]

function lHash(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}
function lTilt(id: string, scale = 4): number {
  const h = lHash(id)
  return ((h % (scale * 2 + 1)) - scale) * 0.5
}

function SealSticker({ color, size = 40 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Dashed circle sticker */}
      <circle cx="20" cy="20" r="15" fill="#FFFDF4"
        stroke={color} strokeWidth="1.4" strokeDasharray="3 2" />
      {/* Small filled heart */}
      <path
        d="M20 27 C20 27, 12 21.5, 12 16.5 A4 4 0 0 1 20 14.5 A4 4 0 0 1 28 16.5 C28 21.5 20 27 20 27Z"
        fill={color}
      />
    </svg>
  )
}

export default function EnvelopeCard({ letter, onClick, index = 0 }: EnvelopeCardProps) {
  const isSealed = !letter.opened_at
  const isOpenWhen = letter.is_open_when
  const palette = PALETTE[lHash(letter.id) % PALETTE.length]
  const tilt = lTilt(letter.id, 4)
  const paperTilt = lTilt(letter.id + 'p', 3)

  const p = letter.profiles as any
  const nickname = p?.nickname || p?.display_name || '—'
  const authorName = letter.profiles?.nickname
  ?? letter.profiles?.display_name
  ?? 'someone ✿'

  const createdDate = new Date(letter.created_at)
  const dateStr = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()

  const GRAIN = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")'

  return (
    <div
      onClick={onClick}
      className="group"
      style={{
        position: 'relative',
        cursor: 'pointer',
        transform: `rotate(${tilt}deg)`,
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        animationName: 'env-pop',
        animationDuration: '0.5s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'both',
        animationDelay: `${index * 0.06}s`,
        '--rot': `${tilt}deg`,
      } as React.CSSProperties}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'rotate(0deg) translateY(-4px)'
        el.style.boxShadow = '0 18px 36px -12px rgba(59,31,14,0.26)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = `rotate(${tilt}deg)`
        el.style.boxShadow = ''
      }}
    >
      {/* State badge — top-left */}
      {(isOpenWhen && isSealed) && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 10,
          background: 'rgba(255,255,255,0.75)', border: `1.5px dashed ${palette.edge}`,
          borderRadius: 999, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {/* Lock icon */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={palette.seal} strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 11, color: palette.seal }}>open-when</span>
        </div>
      )}
      {!isSealed && (
        <div style={{
          position: 'absolute', top: 10, left: 10, zIndex: 10,
          background: 'rgba(255,255,255,0.75)', border: '1.5px dashed rgba(59,31,14,0.18)',
          borderRadius: 999, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {/* Eye icon */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(59,31,14,0.50)" strokeWidth="2" strokeLinecap="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 11, color: 'rgba(59,31,14,0.50)' }}>opened</span>
        </div>
      )}

      {/* Main envelope card */}
      <div style={{
        background: palette.body,
        backgroundImage: GRAIN,
        border: `1px solid ${palette.edge}`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(59,31,14,0.10), inset 0 1px 0 rgba(255,255,255,0.5)',
        position: 'relative',
        minHeight: 150,
      }}>

        {/* Envelope SVG — flap + body lines */}
        <svg
          viewBox="0 0 280 200"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        >
          {isSealed ? (
            <>
              {/* Sealed flap */}
              <polygon
                points="0,0 280,0 140,78"
                fill={palette.flap}
                opacity="0.65"
              />
              {/* Fold lines */}
              <line x1="0" y1="0" x2="140" y2="95" stroke={palette.edge} strokeWidth="1" opacity="0.5" />
              <line x1="280" y1="0" x2="140" y2="95" stroke={palette.edge} strokeWidth="1" opacity="0.5" />
            </>
          ) : (
            <>
              {/* Opened — flat flap sliver */}
              <polygon
                points="0,0 280,0 140,10"
                fill={palette.flap}
                opacity="0.25"
              />
              {/* Mouth inner-shadow band */}
              <rect x="0" y="0" width="280" height="12"
                fill={`url(#mouth-${letter.id.slice(0,6)})`} opacity="0.35" />
              <defs>
                <linearGradient id={`mouth-${letter.id.slice(0,6)}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(59,31,14,0.18)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </>
          )}
          {/* Address lines — bottom right */}
          <line x1="18" y1="168" x2="90" y2="168" stroke={palette.edge} strokeWidth="1" strokeDasharray="4 3" />
          <line x1="18" y1="178" x2="70" y2="178" stroke={palette.edge} strokeWidth="1" strokeDasharray="4 3" />
        </svg>

        {/* Seal sticker — sealed only, centered at flap point */}
        {isSealed && (
          <div style={{
            position: 'absolute',
            top: 50,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            lineHeight: 0,
            filter: 'drop-shadow(0 1px 3px rgba(59,31,14,0.15))',
          }}>
            <SealSticker color={palette.seal} size={42} />
          </div>
        )}

        {/* Letter paper jutting up — opened only */}
        {!isSealed && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            zIndex: 4,
            background: '#FFFEF7',
            backgroundImage: GRAIN,
            border: `1px solid ${palette.edge}`,
            borderRadius: 4,
            padding: '10px 12px 12px',
            boxShadow: '0 2px 8px rgba(59,31,14,0.10)',
            transform: `rotate(${paperTilt}deg)`,
          }}>
            <p style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 10,
              color: '#9B7FD4',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 3,
            }}>A LETTER</p>
            <p style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 17,
              color: '#3B1F0E',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{letter.title}</p>
          </div>
        )}

        {/* Body overlay text — sealed */}
        {isSealed && (
          <div style={{
            position: 'absolute',
            top: 86,
            left: 0, right: 0,
            padding: '0 20px',
            textAlign: 'center',
            zIndex: 3,
          }}>
            {isOpenWhen ? (
              <>
                <p style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: palette.seal,
                  marginBottom: 4,
                }}>OPEN WHEN…</p>
                <p style={{
                  fontFamily: 'Caveat, cursive',
                  fontSize: 20,
                  color: '#3B1F0E',
                  lineHeight: 1.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {letter.unlock_condition || letter.title}
                </p>
              </>
            ) : (
              <p style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 18,
                fontStyle: 'italic',
                color: '#3B1F0E',
                lineHeight: 1.25,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{letter.title}</p>
            )}
          </div>
        )}

        {/* Footer meta */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '6px 12px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.45)' }}>
            — {nickname}
          </span>
          <span style={{ fontFamily: 'Caveat, cursive', fontSize: 12, color: 'rgba(59,31,14,0.40)' }}>
            {dateStr}
          </span>

          <span style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 13,
            color: 'rgba(59,31,14,0.45)',
          }}>
            from {authorName}
          </span>
        </div>

        {/* Spacer so card has height */}
        <div style={{ height: 150 }} />
      </div>
    </div>
  )
}