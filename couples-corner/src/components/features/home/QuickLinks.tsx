import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const PAGES = [
  {
    to: '/gallery',
    label: 'gallery',
    description: 'every photo, every memory, every terrible angle',
    color: 'bg-sunflower/20 border-sunflower/40',
    accent: 'text-sunflower-dark',
    icon: '📸',
    align: 'left',
  },
  {
    to: '/letters',
    label: 'letters',
    description: 'sealed envelopes, open hearts, open-when notes',
    color: 'bg-orchid/10 border-orchid/30',
    accent: 'text-orchid-deep',
    icon: '💌',
    align: 'right',
  },
  {
    to: '/jar',
    label: 'memory jar',
    description: 'little notes, big feelings, shake for a surprise',
    color: 'bg-riptide/10 border-riptide/30',
    accent: 'text-riptide',
    icon: '🍫',
    align: 'left',
  },
  {
    to: '/puns',
    label: 'pun wall',
    description: 'terrible. absolutely terrible. we love them',
    color: 'bg-sunflower/10 border-sunflower/30',
    accent: 'text-sunflower-dark',
    icon: '🦖',
    align: 'right',
  },
  {
    to: '/map',
    label: 'our map',
    description: 'places we have been, places we want to go',
    color: 'bg-orchid/10 border-orchid/30',
    accent: 'text-orchid-deep',
    icon: '🗺️',
    align: 'left',
  },
  {
    to: '/playlist',
    label: 'playlist',
    description: 'the songs that were playing when things happened',
    color: 'bg-riptide/10 border-riptide/30',
    accent: 'text-riptide',
    icon: '🎵',
    align: 'right',
  },
  {
    to: '/bucketlist',
    label: 'bucket list',
    description: 'everything we are going to do. no excuses',
    color: 'bg-sunflower/20 border-sunflower/40',
    accent: 'text-sunflower-dark',
    icon: '♟️',
    align: 'left',
  },
]

export default function QuickLinks() {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-2xl flex flex-col gap-3">
      <p className="font-hand text-orchid-deep text-sm uppercase tracking-widest text-center mb-2">
        our little pages
      </p>
      {PAGES.map((page, i) => {
        const isRight = page.align === 'right'
        return (
          <motion.button
            key={page.to}
            onClick={() => navigate(page.to)}
            initial={{ opacity: 0, x: isRight ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-4/5 border rounded-2xl px-6 py-4 cursor-pointer transition-all duration-200
              hover:shadow-soft focus:outline-none
              ${page.color}
              ${isRight ? 'self-end text-right' : 'self-start text-left'}
            `}
          >
            <div className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
              <span className="text-2xl shrink-0" aria-hidden>{page.icon}</span>
              <div className="flex-1">
                <p className={`font-display text-lg ${page.accent}`}>{page.label}</p>
                <p className="font-hand text-chocolate/60 text-sm">{page.description}</p>
              </div>
              <span className={`font-hand text-lg ${page.accent} opacity-50 shrink-0`}>
                {isRight ? '←' : '→'}
              </span>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}