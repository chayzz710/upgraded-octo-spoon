interface Profile {
  id: string
  display_name: string | null
  nickname: string | null
  avatar_url: string | null
}

function isEmoji(str: string | null | undefined): boolean {
  if (!str) return false
  return !str.startsWith('http')
}

interface AvatarCardProps {
  profile: Profile | null
  ring: string
  bg: string
  tilt: number
  note: string
  sticker: string
  stickerColor: string
}

export default function AvatarCard({ profile, ring, bg, tilt, note, sticker, stickerColor }: AvatarCardProps) {
  const avatar = profile?.avatar_url
  const name = profile?.display_name ?? '...'
  const nickname = profile?.nickname ?? '...'

  // The fix: both the tape AND the polaroid are siblings inside a wrapper that
  // has NO transform on it. The tape uses position:absolute and a higher zIndex.
  // Since neither sibling has a transform, z-index works normally between them.
  // The tape is rotated via its own transform (which doesn't affect stacking
  // between siblings — only a parent transform would).

  const tapeStyle: React.CSSProperties = {
    position: 'absolute',
    top: 2,           // sits at the top edge of the wrapper, peeks above the card
    left: '50%',
    transform: `translateX(-50%) rotate(${tilt > 0 ? 7 : -7}deg)`,
    width: 88,
    height: 20,
    borderRadius: 0,  // sharp edges — not a pill
    opacity: 0.45,
    // subtle repeating stripe = washi fabric texture
    background: `repeating-linear-gradient(
      90deg,
      #F5C842 0px, #F5C842 6px,
      rgba(245,200,66,0.7) 6px, rgba(245,200,66,0.7) 8px
    )`,
    zIndex: 2,        // above the polaroid (zIndex 1)
    pointerEvents: 'none',
  }

  const polaroidStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,        // below the tape
    background: '#fff',
    padding: 12,
    paddingBottom: 48,
    boxShadow: '0 4px 20px rgba(59,31,14,0.18), 0 1px 4px rgba(59,31,14,0.1)',
    transform: `rotate(${tilt}deg)`,
    transition: 'transform 0.2s',
    borderRadius: 4,
    // NO overflow:hidden — that would clip the tape
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      {/*
        Outer wrapper: NO transform here — keeps z-index working between children.
        paddingTop gives room for the tape to sit above the card top edge.
      */}
      <div style={{ position: 'relative', paddingTop: 12, marginBottom: 36 }}>

        {/* tape — sibling of polaroid, zIndex 2, no parent transform to mess things up */}
        <div style={tapeStyle} />

        {/* polaroid — sibling of tape, zIndex 1 */}
        <div style={polaroidStyle}>
          <div style={{
            width: 160, height: 160, borderRadius: 6,
            background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72,
            boxShadow: `inset 0 0 0 3px ${ring}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none',
              background: 'repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,0.4) 14px 15px)',
            }} />
            <span style={{ position: 'relative' }}>
              {isEmoji(avatar)
                ? (avatar ?? '🐱')
                : avatar
                  ? <img src={avatar} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} alt={name} />
                  : '🐱'}
            </span>
            <span style={{
              position: 'absolute', top: 8, right: 8,
              width: 28, height: 28, borderRadius: '50%',
              background: '#FFFDF4',
              border: `1.5px solid ${stickerColor}55`,
              color: stickerColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontFamily: 'Playfair Display, serif',
            }}>
              {sticker}
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 22, color: '#3B1F0E', lineHeight: 1 }}>{name}</div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: 15, color: '#6A5ACD', lineHeight: 1.2, marginTop: 2 }}>{nickname} :D </div>
          </div>
        </div>

        {/* note below */}
        <div style={{
          position: 'absolute', bottom: -4, left: 0, right: 0, textAlign: 'center',
          fontFamily: 'Caveat, cursive', fontSize: 13, color: 'rgba(59,31,14,0.5)',
          fontStyle: 'italic', whiteSpace: 'nowrap',
          transform: `rotate(${tilt}deg)`,
        }}>
          {note}
        </div>
      </div>
    </div>
  )
}

export type { Profile }