import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">

      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, top: -200, left: -200, background: 'radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: -100, right: -100, background: 'radial-gradient(circle, rgba(155,127,212,0.10) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 max-w-sm">

        {/* Frog */}
        <motion.span
          className="text-8xl block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ duration: 0.5, rotate: { delay: 1, duration: 2, repeat: Infinity, repeatDelay: 3 } }}
        >
          🐸
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Washi tape */}
          <div style={{
            width: 80, height: 14, background: '#F5C842', opacity: 0.7, borderRadius: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 5px, transparent 5px 10px)',
            transform: 'rotate(-2deg)', marginBottom: -6,
          }} />

          {/* Card */}
          <div className="bg-surface rounded-3xl shadow-polaroid px-8 py-6 border border-sunflower/20">
            <h1 className="font-display text-7xl text-chocolate leading-none mb-1">404</h1>
            <p className="font-hand text-2xl text-orchid-deep mb-1">the frog got lost</p>
            <p className="font-hand text-chocolate/50 text-lg">
              this page doesn't exist… or maybe it hopped away 🌿
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="btn-primary mt-2"
          >
            take me home 🌻
          </button>

          <p className="font-hand text-chocolate/25 text-sm mt-4">
            🐸 one frog per page
          </p>
        </motion.div>
      </div>
    </div>
  )
}