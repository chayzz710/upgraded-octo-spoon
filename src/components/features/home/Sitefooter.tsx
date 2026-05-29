import { useState } from 'react'
import { useUser } from '../../../lib/auth'
import { DoodleFlower } from '../../motifs/HomeDoodles'

const FROG_MESSAGES = [
  'pst — you found the frog 🐸',
  'i love you (still)',
  'okay okay one more',
  "...alright that's enough frog",
]

interface SiteFooterProps {
  days: number
}

export default function SiteFooter({ days }: SiteFooterProps) {
  const { user } = useUser()
  const [frog, setFrog] = useState(0)

  const userLabel = user?.email?.split('@')[0] ?? 'you'

  return (
    <footer style={{
      borderTop: '1px solid rgba(59,31,14,0.1)',
      marginTop: 40,
      padding: '40px 0',
      background: 'rgba(255,253,244,0.4)',
    }}>
      <div style={{
        maxWidth: 1100, width: '90%', margin: '0 auto', padding: '0 2vw',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
      }}>

        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DoodleFlower size={32} color="#9B7FD4" center="#F5C842" />
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#3B1F0E', lineHeight: 1 }}>
              our little corner
            </div>
            <div style={{ fontFamily: 'Caveat, cursive', color: '#6A5ACD', fontSize: 15 }}>
              made by hand · for two
            </div>
          </div>
        </div>

        {/* meta */}
        <div style={{
          fontFamily: 'Caveat, cursive', color: 'rgba(59,31,14,0.55)',
          fontSize: 15, textAlign: 'center',
        }}>
          <div>last edit: by {userLabel}</div>
          <div style={{ marginTop: 4, opacity: 0.5 }}>© {days} days &amp; counting</div>
        </div>

        {/* frog easter egg */}
        <button
          onClick={() => setFrog(f => Math.min(f + 1, FROG_MESSAGES.length - 1))}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Caveat, cursive', color: '#3f8a6a', textAlign: 'right',
          }}
          aria-label="hidden frog easter egg"
        >
          <span style={{
            fontSize: 24,
            opacity: frog === 0 ? 0.15 : 1,
            transition: 'opacity 0.2s',
            display: 'block',
          }}>
            🐸
          </span>
          <span style={{
            fontSize: 12, color: 'rgba(59,31,14,0.4)',
            maxWidth: 180, display: 'block', lineHeight: 1.3,
          }}>
            {FROG_MESSAGES[frog]}
          </span>
        </button>
      </div>
    </footer>
  )
}