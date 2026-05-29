import { SITE_CONFIG } from '../../config'


import { useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../../lib/auth'
import EasterEggPen from '../motifs/EasterEggPen'


function IcSunflower({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {[0,45,90,135,180,225,270,315].map(a => (
        <ellipse key={a} cx="12" cy="6" rx="2.2" ry="3.4"
          transform={`rotate(${a} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.6" fill="currentColor" opacity="0.85" stroke="none" />
    </svg>
  )
}

function IcCamera({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8 H 8 L 9.5 6 H 14.5 L 16 8 H 20 A 1 1 0 0 1 21 9 V 18 A 1 1 0 0 1 20 19 H 4 A 1 1 0 0 1 3 18 V 9 A 1 1 0 0 1 4 8 Z" />
      <circle cx="12" cy="13.5" r="3.2" />
      <circle cx="12" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IcLetter({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3.5 6.5 L 12 13 L 20.5 6.5" />
    </svg>
  )
}

function IcJar({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4 H 16" />
      <path d="M8 4 V 6.5 C 8 7, 7.5 7.3, 7.5 8 V 19 A 2 2 0 0 0 9.5 21 H 14.5 A 2 2 0 0 0 16.5 19 V 8 C 16.5 7.3, 16 7, 16 6.5 V 4" />
      <circle cx="10.5" cy="13" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="15" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="11" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IcDino({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18 C 4 14, 6 12, 9 12 V 9 C 9 6, 11 4.5, 13.5 4.5 C 16.5 4.5, 18.5 6.5, 18.5 9.5 C 18.5 11, 17.8 12, 17 12.5 V 14 H 20 L 18.5 16 L 17 16 L 17 18" />
      <circle cx="15" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M9 18 L 9 20 M 13 16 L 13 20" />
    </svg>
  )
}

function IcMap({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5 L 9 4.5 L 15 6.5 L 21 4.5 V 17.5 L 15 19.5 L 9 17.5 L 3 19.5 Z" />
      <path d="M9 4.5 V 17.5" />
      <path d="M15 6.5 V 19.5" />
    </svg>
  )
}

function IcMusic({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 17 V 5.5 L 19 4 V 15.5" />
      <ellipse cx="7" cy="17.5" rx="2.5" ry="2" />
      <ellipse cx="17" cy="15.5" rx="2.5" ry="2" />
    </svg>
  )
}

function IcPawn({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6.5" r="2.6" />
      <path d="M9.5 9 H 14.5 C 14 11, 15 13, 16 15 H 8 C 9 13, 10 11, 9.5 9 Z" />
      <path d="M7 15 H 17 L 17.6 19 H 6.4 Z" />
    </svg>
  )
}

function IcHeart({ size = 20, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20 C 5 15.5, 3 11.5, 3 8.5 C 3 5.5, 5.5 3.5, 8 3.5 C 10 3.5, 11.3 4.7, 12 6 C 12.7 4.7, 14 3.5, 16 3.5 C 18.5 3.5, 21 5.5, 21 8.5 C 21 11.5, 19 15.5, 12 20 Z" />
    </svg>
  )
}


function IcLock({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="11" rx="2" />
      <path d="M8 11 V7 C8 4.8 16 4.8 16 7 V11" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IcPalette({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 0 20 4 4 0 0 0 0-8 4 4 0 0 1 0-8" />
      <circle cx="8"  cy="9"  r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9"  r="1" fill="currentColor" stroke="none" />
      <circle cx="8"  cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const NAV_ITEMS = [
  { key: 'home',       path: '/',            Icon: IcSunflower, color: '#E2A500', label: 'home' },
  { key: 'gallery',    path: '/gallery',     Icon: IcCamera,    color: '#6A5ACD', label: 'gallery' },
  { key: 'letters',    path: '/letters',     Icon: IcLetter,    color: '#E69CB5', label: 'letters' },
  { key: 'jar',        path: '/jar',         Icon: IcJar,       color: '#7FC8A9', label: 'jar' },
  { key: 'puns',       path: '/puns',        Icon: IcDino,      color: '#9B7FD4', label: 'puns' },
  { key: 'map',        path: '/map',         Icon: IcMap,       color: '#3B82C4', label: 'map' },
  { key: 'playlist',   path: '/playlist',    Icon: IcMusic,     color: '#E2A500', label: 'playlist' },
  { key: 'bucketlist', path: '/bucketlist',  Icon: IcPawn,      color: '#7a5a44', label: 'bucket list' },
  { key: 'secret',     path: '/secret',      Icon: IcLock,      color: '#7a5a44', label: '?' },
  { key: 'styleguide', path: '/styleguide',  Icon: IcPalette,   color: '#9B7FD4', label: 'customise' },
]


export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = NAV_ITEMS.slice().reverse().find(item =>
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  )?.key ?? 'home'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40, width: '100%',
      backdropFilter: 'blur(12px)',
      background: 'rgba(255,253,244,0.88)',
      borderBottom: '1px solid rgba(59,31,14,0.08)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>

        {/* brand */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: '50%',
            background: '#F5C842',
          }}>
            <IcHeart size={18} filled />
          </span>
          <span style={{
            fontFamily: 'Caveat, cursive', color: '#6A5ACD',
            fontSize: 22, lineHeight: 1, transform: 'translateY(1px)',
          }}>
            {SITE_CONFIG.siteName}
          </span>
        </button>

        <div style={{ flex: 1 }} />

        {/* icon row */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: 2, listStyle: 'none', padding: 0, margin: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(item => {
            const isActive = item.key === activeKey
            return (
              <li key={item.key}>
                <button
                  onClick={() => navigate(item.path)}
                  aria-label={item.label}
                  title={item.label}
                  style={{
                    position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 38, height: 38, borderRadius: '50%',
                    border: 'none', cursor: 'pointer',
                    background: isActive ? '#F5C842' : 'transparent',
                    transition: 'background 0.2s',
                    color: isActive ? '#3B1F0E' : item.color,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,200,66,0.2)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  <item.Icon size={22} />
                </button>
              </li>
            )
          })}
        </ul>

        <div style={{ flex: 1 }} />

        {/* right side: pen easter egg + hi label + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <EasterEggPen />
          <button
            onClick={async () => {
              await signOut()
              sessionStorage.removeItem('gate')
              navigate('/gate')
            }}
            style={{
              fontFamily: 'Caveat, cursive', fontSize: 15,
              color: 'rgba(59,31,14,0.4)', background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px 10px', borderRadius: 99,
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#3B1F0E'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,31,14,0.06)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(59,31,14,0.4)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'none'
            }}
          >
            bye 😚
          </button>
        </div>
      </div>
    </nav>
  )
}