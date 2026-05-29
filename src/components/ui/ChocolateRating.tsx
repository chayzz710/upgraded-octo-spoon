// src/components/ui/ChocolateRating.tsx
// Emoji chocolate rating — 🍫 repeated n times.

interface ChocolateRatingProps {
  value: number | null
  onChange?: (v: number) => void
  interactive?: boolean
  size?: number
  showLabel?: boolean
}

export function ChocolateRating({
  value: valueProp,
  onChange,
  interactive = false,
  showLabel = false,
}: ChocolateRatingProps) {
  const value = valueProp ?? 0
  if (!interactive) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        {'🍫'.repeat(value)}
        {showLabel && value > 0 && (
          <span className="font-hand" style={{ fontSize: 11, color: 'rgba(59,31,14,0.45)', marginLeft: 4 }}>
            — {value} of 5
          </span>
        )}
      </span>
    )
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange?.(i + 1 === value ? 0 : i + 1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 18, padding: 2, opacity: i < value ? 1 : 0.25,
            transition: 'opacity 0.12s, transform 0.12s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          🍫
        </button>
      ))}
    </div>
  )
}

export default ChocolateRating