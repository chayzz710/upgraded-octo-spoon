import { useState, useRef, useMemo } from 'react'
import AvatarCard, { type Profile } from './AvatarCard'
import DaysCard from './DaysCard'
import DistanceTracker from './DistanceTracker'
import { DoodleFlower, DoodleHeart, DoodleSquiggle, DoodleStar } from '../../motifs/HomeDoodles'

function sinceDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase()
}

function SquiggleUnderline({ color = '#F5C842', width = 180 }: { color?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 180 12"
      width={width}
      height={12}
      style={{ display: 'block', marginTop: -6, marginLeft: 'auto', marginRight: 'auto' }}
      fill="none"
    >
      <path
        d="M2 8 C 15 2, 28 11, 42 7 S 68 2, 82 7 S 108 12, 122 7 S 148 2, 162 7 S 172 10, 178 8"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface HeroSectionProps {
  user1: Profile | null
  user2: Profile | null
  days: number
}

export default function HeroSection({ user1, user2, days }: HeroSectionProps) {
  const [hearts, setHearts] = useState<Array<{
    id: number; dx: number; r: number; delay: number; color: string; size: number
  }>>([])
  const [pulses, setPulses] = useState(0)
  const heartIdRef = useRef(0)
  const since = useMemo(() => sinceDate(days), [days])

  const popHearts = () => {
    const colors = ['#E69CB5', '#9B7FD4', '#F5C842', '#3B82C4', '#6A5ACD']
    const n = 8 + Math.floor(Math.random() * 4)
    const batch = Array.from({ length: n }, () => ({
      id: ++heartIdRef.current,
      dx: (Math.random() - 0.5) * 220,
      r: (Math.random() - 0.5) * 60,
      delay: Math.random() * 200,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 16 + Math.random() * 18,
    }))
    setHearts(h => [...h, ...batch])
    setPulses(p => p + 1)
    setTimeout(() => setHearts(h => h.filter(x => !batch.find(b => b.id === x.id))), 1700)
  }

  return (
    <section style={{ position: 'relative', paddingTop: 'clamp(16px, 3vw, 40px)', paddingBottom: 24 }}>
      {/* background blobs — fixed so they bleed across full viewport, no clipping */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 800, height: 800, top: -300, left: -250,
          background: 'radial-gradient(circle at center, rgba(245,200,66,0.14) 0%, rgba(245,200,66,0.04) 50%, transparent 72%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', width: 700, height: 700, top: -150, right: -250,
          background: 'radial-gradient(circle at center, rgba(155,127,212,0.12) 0%, rgba(155,127,212,0.03) 50%, transparent 72%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, bottom: '10%', left: '35%',
          background: 'radial-gradient(circle at center, rgba(59,130,196,0.08) 0%, rgba(59,130,196,0.02) 50%, transparent 72%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 1100, width: '90%', margin: '0 auto', padding: '0 2vw' }}>

        {/* date chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'Caveat, cursive', fontSize: 15, color: '#7a5a44',
            background: 'rgba(251,233,164,0.6)', border: '1.5px solid rgba(226,165,0,0.4)',
            padding: '4px 14px', borderRadius: 99,
          }}>
            <DoodleStar size={13} color="#E2A500" /> since {since}
          </span>
          <DoodleSquiggle width={50} color="#9B7FD4" />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'Caveat, cursive', fontSize: 15, color: '#7a5a44',
            background: 'rgba(251,233,164,0.5)', border: '1.5px solid rgba(226,165,0,0.4)',
            padding: '4px 14px', borderRadius: 99,
          }}>
            <DoodleHeart size={13} color="#E69CB5" /> two hearts, one corner
          </span>
        </div>

        {/* title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 4 }}>
          <DoodleFlower size={52} />
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(36px, 7vw, 72px)',
              color: '#3B1F0E',
              lineHeight: 1, margin: 0,
            }}>
              our little <span style={{ fontStyle: 'italic' }}>corner</span>
            </h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SquiggleUnderline color="#F5C842" width={200} />
            </div>
          </div>
        </div>

        <p style={{
          textAlign: 'center', fontFamily: 'Caveat, cursive', color: '#6A5ACD',
          fontSize: 'clamp(16px, 3vw, 22px)', marginBottom: 'clamp(24px, 4vw, 48px)', marginTop: 8,
        }}>
          a soft place for two — built out of polaroids, pages and puns
        </p>

        {/* Hero layout:
             ≥ 680px → three columns: [avatar] [days+heart] [avatar]
             < 680px → avatars side-by-side on top row, days card full-width below */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 'clamp(16px, 5vw, 80px)', flexWrap: 'wrap' }}>

          <div className="hero-avatar-left" style={{ display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
            <AvatarCard
              profile={user1}
              ring="#F5C842" bg="#FFF2C9" tilt={-4}
              note="rests her head"
              sticker="✿" stickerColor="#E69CB5"
            />
          </div>

          {/* Days card — always centered between avatars on medium, below on mobile */}
          <div className="hero-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: '0 0 auto' }}>
            {/* floating hearts */}
            <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: 1, zIndex: 30, pointerEvents: 'none' }}>
              {hearts.map(h => (
                <div key={h.id} style={{
                  position: 'absolute', left: 0, top: 0,
                  color: h.color,
                  animation: 'heartPop 1.5s ease-out forwards',
                  animationDelay: h.delay + 'ms',
                  ...({ '--dx': h.dx + 'px', '--r': h.r + 'deg' } as React.CSSProperties),
                }}>
                  <svg viewBox="0 0 24 24" width={h.size} height={h.size} fill="currentColor">
                    <path d="M12 21 C 4 16, 2 12, 2 8.2 C 2 5.3, 4.3 3, 7 3 C 9 3, 10.6 4.2, 12 6 C 13.4 4.2, 15 3, 17 3 C 19.7 3, 22 5.3, 22 8.2 C 22 12, 20 16, 12 21 Z" />
                  </svg>
                </div>
              ))}
            </div>

            <DaysCard days={days} pulses={pulses} />

            <button
              onClick={popHearts}
              aria-label="send love"
              style={{ marginTop: 20, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #E69CB5, #6A5ACD)',
                boxShadow: '0 4px 16px rgba(155,127,212,0.4)',
                transition: 'transform 0.15s',
              }}>
                <DoodleHeart size={26} color="#fff" />
              </span>
            </button>
            <span style={{ marginTop: 8, fontFamily: 'Caveat, cursive', color: 'rgba(59,31,14,0.55)', fontSize: 15 }}>
              tap to send love
            </span>

            <div style={{ marginTop: 20, width: '100%' }}>
              <DistanceTracker />
            </div>
          </div>

          {/* user2 avatar */}
          <div className="hero-avatar-right" style={{ display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
            <AvatarCard
              profile={user2}
              ring="#9B7FD4" bg="#EBE0FA" tilt={4}
              note="provides the snoring"
              sticker="★" stickerColor="#F5C842"
            />
          </div>
        </div>
      </div>

    </section>
  )
}