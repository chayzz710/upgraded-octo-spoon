import { useState } from 'react'

interface GroanMeterProps {
  value: number | null        // 0–5, null = unrated
  onChange?: (v: number) => void
  interactive?: boolean
  size?: number
}

const LABELS = ['', 'terrible', 'meh', 'okay', 'good', 'got me']

function GroanFace({
  filled,
  size,
  hovered,
  interactive,
  onClick,
  onEnter,
  onLeave,
}: {
  filled: boolean
  size: number
  hovered: boolean
  interactive: boolean
  onClick?: () => void
  onEnter?: () => void
  onLeave?: () => void
}) {
  const r = size / 2
  const eyeR = size * 0.07
  const eyeY = r * 0.72
  const eyeX = r * 0.36
  // mouth: slight downward curve = groan
  const mouthY = r * 1.45
  const mouthR = r * 0.36
  const d = `M${r - mouthR} ${mouthY} Q${r} ${mouthY + mouthR * 0.55} ${r + mouthR} ${mouthY}`

  const faceStyle: React.CSSProperties = {
    cursor: interactive ? 'pointer' : 'default',
    transition: 'transform 0.12s ease',
    transform: hovered ? 'scale(1.15)' : 'scale(1)',
    display: 'inline-block',
    lineHeight: 0,
  }

  const face = (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={faceStyle}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Circle */}
      <circle
        cx={r}
        cy={r}
        r={r - 1}
        fill={filled ? '#F5C842' : 'rgba(59,31,14,0.05)'}
        stroke={filled ? '#E2A500' : 'rgba(59,31,14,0.18)'}
        strokeWidth={1}
      />
      {/* Eyes */}
      <circle cx={r - eyeX} cy={eyeY} r={eyeR} fill={filled ? '#3B1F0E' : 'rgba(59,31,14,0.25)'} />
      <circle cx={r + eyeX} cy={eyeY} r={eyeR} fill={filled ? '#3B1F0E' : 'rgba(59,31,14,0.25)'} />
      {/* Groan mouth */}
      <path
        d={d}
        stroke={filled ? '#3B1F0E' : 'rgba(59,31,14,0.22)'}
        strokeWidth={filled ? 1.5 : 1}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )

  return face
}

export default function GroanMeter({ value, onChange, interactive = false, size = 16 }: GroanMeterProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const displayValue = hoverIndex !== null ? hoverIndex + 1 : (value ?? 0)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <GroanFace
          key={i}
          filled={i < displayValue}
          size={size}
          hovered={interactive && hoverIndex === i}
          interactive={interactive}
          onClick={
            interactive && onChange
              ? () => onChange(i + 1 === value ? 0 : i + 1)
              : undefined
          }
          onEnter={interactive ? () => setHoverIndex(i) : undefined}
          onLeave={interactive ? () => setHoverIndex(null) : undefined}
        />
      ))}
      {value !== null && value > 0 && (
        <span
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 12,
            color: 'rgba(59,31,14,0.45)',
            marginLeft: 4,
          }}
        >
          {LABELS[value]}
        </span>
      )}
    </div>
  )
}
