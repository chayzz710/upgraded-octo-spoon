// Shared decorative SVG doodles for the home page

export function DoodleFlower({ size = 28, color = '#9B7FD4', center = '#F5C842', className = '', style = {} }: {
  size?: number; color?: string; center?: string; className?: string; style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} style={style}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="16" cy="9" rx="3.5" ry="5.5" fill={color}
          transform={`rotate(${a} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="3" fill={center} />
    </svg>
  )
}

export function DoodleStar({ size = 18, color = '#F5C842', className = '', style = {} }: {
  size?: number; color?: string; className?: string; style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} fill={color}>
      <path d="M12 2 L 13.2 9 L 20 10.5 L 14.6 14.7 L 16.5 22 L 12 17.8 L 7.5 22 L 9.4 14.7 L 4 10.5 L 10.8 9 Z" />
    </svg>
  )
}

export function DoodleHeart({ size = 18, color = '#E69CB5', className = '', style = {} }: {
  size?: number; color?: string; className?: string; style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} fill={color}>
      <path d="M12 21 C 4 16, 2 12, 2 8.2 C 2 5.3, 4.3 3, 7 3 C 9 3, 10.6 4.2, 12 6 C 13.4 4.2, 15 3, 17 3 C 19.7 3, 22 5.3, 22 8.2 C 22 12, 20 16, 12 21 Z" />
    </svg>
  )
}

export function DoodleSquiggle({ color = '#9B7FD4', width = 80, className = '', style = {} }: {
  color?: string; width?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 80 16" width={width} height={width * 0.2} className={className} style={style} fill="none">
      <path d="M2 8 C 10 2, 18 14, 26 8 S 42 2, 50 8 S 66 14, 78 8"
        stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function DoodleArrowCurly({ color = '#6A5ACD', width = 100, className = '', style = {} }: {
  color?: string; width?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 100 40" width={width} height={width * 0.4} className={className} style={style}
      fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 30 C 20 5, 40 35, 60 15 C 70 5, 80 20, 88 12" />
      <path d="M83 8 L 88 12 L 84 17" />
    </svg>
  )
}

export function DoodleSpiral({ color = '#3B82C4', size = 30, className = '', style = {} }: {
  color?: string; size?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} style={style} fill="none">
      <path
        d="M16 16 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0 M 16 16 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 M 16 16 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 M 16 16 m -10 0 a 10 10 0 1 0 20 0"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}