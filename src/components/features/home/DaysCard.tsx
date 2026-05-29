import { useState, useEffect, useRef } from 'react'
import { DoodleStar, DoodleHeart } from '../../motifs/HomeDoodles'

function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const [v, setV] = useState(0)
  const fromRef = useRef(0)
  useEffect(() => {
    const from = fromRef.current
    let raf: number
    let start: number
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(step)
      else fromRef.current = to
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{v}</>
}

interface DaysCardProps {
  days: number
  pulses: number
}

export default function DaysCard({ days, pulses }: DaysCardProps) {
  // Same fix as AvatarCard: tape and card are siblings, outer wrapper has NO transform.
  // z-index works cleanly between siblings when no parent has a transform.

  const tapeBase: React.CSSProperties = {
    position: 'absolute',
    height: 20,
    borderRadius: 0,
    opacity: 0.45,
    zIndex: 2,
    pointerEvents: 'none',
  }

  return (
    // NO transform on this wrapper — preserves z-index between tape and card
    <div style={{ position: 'relative', paddingTop: 12 }}>

      {/* tape left — sibling of card, zIndex 2 */}
      <div style={{
        ...tapeBase,
        top: 2, left: '16%', width: 100,
        transform: 'rotate(-7deg)',
        background: 'repeating-linear-gradient(90deg, #9B7FD4 0px, #9B7FD4 6px, rgba(155,127,212,0.7) 6px, rgba(155,127,212,0.7) 8px)',
      }} />

      {/* tape right — sibling of card, zIndex 2 */}
      <div style={{
        ...tapeBase,
        top: 2, right: '12%', width: 70,
        transform: 'rotate(8deg)',
        background: 'repeating-linear-gradient(90deg, #3B82C4 0px, #3B82C4 6px, rgba(59,130,196,0.7) 6px, rgba(59,130,196,0.7) 8px)',
      }} />

      {/* card — sibling of tapes, zIndex 1 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: '#FFF9E0',
        border: '2px solid rgba(226,165,0,0.3)',
        borderRadius: 16,
        padding: '28px 40px',
        boxShadow: '0 6px 28px rgba(59,31,14,0.14), 0 1px 4px rgba(59,31,14,0.08)',
      }}>
        <DoodleStar size={16} color="#E2A500"
          style={{ position: 'absolute', top: -8, right: -8 }} />
        <DoodleHeart size={14} color="#E69CB5"
          style={{ position: 'absolute', bottom: -8, left: -8 }} />

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Caveat, cursive', color: '#E2A500', fontSize: 18,
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4,
          }}>
            day count
          </div>
          <div key={pulses} style={{
            fontFamily: 'Playfair Display, serif', fontSize: 96,
            color: '#3B1F0E', lineHeight: 1,
          }}>
            <CountUp to={days} />
          </div>
          <div style={{ fontFamily: 'Caveat, cursive', color: '#E2A500', fontSize: 22, marginTop: 4 }}>
            days together
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E69CB5', display: 'inline-block' }} />
            <span style={{ fontFamily: 'Caveat, cursive', color: 'rgba(59,31,14,0.6)', fontSize: 14 }}>
              and counting the seconds
            </span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9B7FD4', display: 'inline-block' }} />
          </div>
        </div>
      </div>
    </div>
  )
}