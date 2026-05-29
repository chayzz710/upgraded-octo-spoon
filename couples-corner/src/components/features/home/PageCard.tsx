import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface PageData {
  key: string
  title: string
  sub: string
  icon: string
  color: string
  soft: string
  dark: string
  side: 'left' | 'right'
  meta: string
  snippet: string
  href: string
}

interface PageCardProps {
  page: PageData
  idx: number
}

function WashiTape({ color, width, rot, left, right }: {
  color: string; width: number; rot: number; left?: string; right?: string
}) {
  return (
    <div style={{
      position: 'absolute',
      top: -4,
      ...(left  !== undefined ? { left  } : {}),
      ...(right !== undefined ? { right } : {}),
      width,
      height: 20,
      borderRadius: 0,
      opacity: 0.4,
      transform: `rotate(${rot}deg)`,
      background: `repeating-linear-gradient(
        90deg,
        ${color} 0px, ${color} 6px,
        color-mix(in srgb, ${color} 75%, transparent) 6px,
        color-mix(in srgb, ${color} 75%, transparent) 8px
      )`,
      zIndex: 2,
      pointerEvents: 'none',
    }} />
  )
}

export default function PageCard({ page, idx }: PageCardProps) {
  const [hover, setHover] = useState(false)
  const navigate = useNavigate()
  const isLeft = page.side === 'left'
  const tilt = isLeft ? -1.2 : 1.2

  return (
    <li style={{
      position: 'relative',
      width: 'clamp(280px, 90%, 58%)',
      alignSelf: isLeft ? 'flex-start' : 'flex-end',
      paddingTop: 22,
    }}>
      <a
        href={page.href}
        onClick={(e) => { e.preventDefault(); navigate(page.href) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'block', textDecoration: 'none', position: 'relative',
          transform: `rotate(${hover ? tilt : tilt * 0.4}deg)`,
          transition: 'transform 0.25s ease',
        }}
      >
        <WashiTape
          color={page.dark}
          width={88}
          rot={isLeft ? -8 : 8}
          {...(isLeft ? { left: '10%' } : { right: '10%' })}
        />

        <div style={{
          position: 'relative', zIndex: 1,
          borderRadius: 16,
          boxShadow: hover
            ? '0 8px 32px rgba(59,31,14,0.14)'
            : '0 2px 12px rgba(59,31,14,0.07)',
          background: page.soft,
          border: `1.5px solid ${page.dark}22`,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 20,
          transition: 'box-shadow 0.2s',
        }}>

          {/* stamp icon */}
          <div style={{
            flexShrink: 0, width: 64, height: 64, borderRadius: 16,
            background: page.color + 'cc', // slightly translucent so it reads softer
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
            transform: `rotate(${isLeft ? -6 : 6}deg)`,
            boxShadow: '0 2px 8px rgba(59,31,14,0.1)',
            order: isLeft ? 0 : 2,
          }}>
            {page.icon}
          </div>

          {/* text */}
          <div style={{ flex: 1, textAlign: isLeft ? 'left' : 'right', order: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10,
              justifyContent: isLeft ? 'flex-start' : 'flex-end',
            }}>
              <h3 style={{
                fontFamily: 'Playfair Display, serif', fontSize: 26,
                color: page.dark, margin: 0,
              }}>
                {page.title}
              </h3>
              <span style={{
                fontFamily: 'Caveat, cursive', fontSize: 13,
                color: page.dark + '99',
                fontStyle: page.meta === '…' ? 'italic' : 'normal',
              }}>
                {page.meta}
              </span>
            </div>
            <p style={{
              fontFamily: 'Caveat, cursive', color: 'rgba(59,31,14,0.65)',
              fontSize: 16, margin: 0, marginTop: 2,
            }}>
              {page.sub}
            </p>

            {/* hover snippet — maxHeight large enough for 2 lines */}
            <div style={{
              overflow: 'hidden',
              maxHeight: hover ? 60 : 0,
              opacity: hover ? 1 : 0,
              transition: 'max-height 0.35s ease, opacity 0.3s ease',
            }}>
              <div style={{
                marginTop: 8,
                fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
                fontSize: 13, color: 'rgba(59,31,14,0.7)',
                textAlign: isLeft ? 'left' : 'right',
                lineHeight: 1.5,
              }}>
                ↳ {page.snippet}
              </div>
            </div>
          </div>

          {/* arrow */}
          <div style={{
            flexShrink: 0,
            color: page.dark,
            opacity: 0.7,
            transform: hover
              ? (isLeft ? 'translateX(6px)' : 'translateX(-6px)')
              : 'translateX(0)',
            transition: 'transform 0.2s',
            order: isLeft ? 2 : 0,
          }}>
            <svg viewBox="0 0 22 22" width={24} height={24} fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ transform: isLeft ? 'none' : 'scaleX(-1)', display: 'block' }}>
              <path d="M5 11 H 19" />
              <path d="M14 6 L 19 11 L 14 16" />
            </svg>
          </div>
        </div>

        {/* № sticker */}
        <span style={{
          position: 'absolute', top: -10, left: 12, zIndex: 3,
          fontFamily: 'Caveat, cursive', fontSize: 12, color: page.dark,
          background: '#FFFDF4', border: `1.5px solid ${page.dark}44`,
          padding: '2px 8px', borderRadius: 99,
          boxShadow: '0 1px 4px rgba(59,31,14,0.06)',
        }}>
          № {String(idx + 1).padStart(2, '0')}
        </span>
      </a>
    </li>
  )
}