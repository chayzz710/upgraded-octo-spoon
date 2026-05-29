import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useUser } from '../lib/auth'
import type { Profile } from '../types'

const LOVE_LANGUAGE_EMOJI: Record<string, string> = {
  'words of affirmation': '💬',
  'acts of service':      '🛠️',
  'receiving gifts':      '🎁',
  'quality time':         '⏳',
  'physical touch':       '🤝',
}

interface ProfileStats {
  photos: number
  letters: number
  puns: number
  pins: number
  bucketItems: number
}

async function fetchStats(userId: string): Promise<ProfileStats> {
  const [photos, letters, puns, pins, bucket] = await Promise.all([
    supabase.from('photos').select('id', { count: 'exact', head: true }).eq('uploaded_by', userId),
    supabase.from('letters').select('id', { count: 'exact', head: true }).eq('author_id', userId),
    supabase.from('puns').select('id', { count: 'exact', head: true }).eq('author_id', userId),
    supabase.from('map_pins').select('id', { count: 'exact', head: true }).eq('added_by', userId),
    supabase.from('bucket_items').select('id', { count: 'exact', head: true }).eq('added_by', userId),
  ])
  return {
    photos:      photos.count ?? 0,
    letters:     letters.count ?? 0,
    puns:        puns.count ?? 0,
    pins:        pins.count ?? 0,
    bucketItems: bucket.count ?? 0,
  }
}

function AvatarDisplay({ url, name }: { url?: string | null; name?: string | null }) {
  if (!url) return <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center text-4xl flex-shrink-0 shadow-soft">🌻</div>
  const isEmoji = !url.startsWith('http')
  if (isEmoji) return <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center text-4xl flex-shrink-0 shadow-soft">{url}</div>
  return <img src={url} alt={name ?? ''} className="w-20 h-20 rounded-full object-cover shadow-soft flex-shrink-0" />
}

function PersonCard({
  profile, stats, delay, accent, isOwn
}: {
  profile: Profile
  stats: ProfileStats
  delay: number
  accent: 'sunflower' | 'orchid'
  isOwn: boolean
}) {
  const navigate = useNavigate()

  const c = accent === 'sunflower' ? {
    header: 'bg-sunflower/20', badge: 'bg-sunflower/30 text-chocolate',
    pill: 'bg-sunflower/20 text-chocolate', border: 'border-sunflower/30', stat: 'text-sunflower-dark',
  } : {
    header: 'bg-orchid/10', badge: 'bg-orchid/20 text-orchid-deep',
    pill: 'bg-orchid/10 text-orchid-deep', border: 'border-orchid/20', stat: 'text-orchid-deep',
  }

  const loveEmoji = profile.love_language
    ? LOVE_LANGUAGE_EMOJI[profile.love_language.toLowerCase()] ?? '💛'
    : '💛'

  const statsList = [
    { emoji: '📸', label: 'photos',  value: stats.photos },
    { emoji: '✉️', label: 'letters', value: stats.letters },
    { emoji: '😆', label: 'puns',    value: stats.puns },
    { emoji: '📍', label: 'places',  value: stats.pins },
    { emoji: '♟️', label: 'plans',   value: stats.bucketItems },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 24 }}
      className={`bg-surface rounded-3xl shadow-polaroid border ${c.border} overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className={`${c.header} px-6 pt-8 pb-6 flex items-center gap-4`}>
        <AvatarDisplay url={profile.avatar_url} name={profile.display_name} />
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl text-chocolate leading-tight truncate">
            {profile.display_name ?? 'someone lovely'}
          </h2>
          {profile.nickname && (
            <p className="font-hand text-orchid text-lg mt-0.5 truncate">"{profile.nickname}"</p>
          )}
          {profile.love_language && (
            <span className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${c.badge}`}>
              {loveEmoji} {profile.love_language}
            </span>
          )}
        </div>
        {isOwn && (
          <button
            onClick={() => navigate('/setup')}
            className="self-start text-xs font-hand text-chocolate/30 hover:text-chocolate/70 transition px-2 py-1 rounded-full hover:bg-chocolate/5 shrink-0"
          >
            ✏️ edit
          </button>
        )}
      </div>

      <div className="px-6 py-6 flex flex-col gap-5 flex-1">
        {profile.bio && (
          <p className="font-hand text-lg text-chocolate leading-relaxed">{profile.bio}</p>
        )}

        {profile.fav_things && profile.fav_things.length > 0 && (
          <div>
            <p className="text-xs font-medium text-chocolate/40 uppercase tracking-wide mb-2">favourite things</p>
            <div className="flex flex-wrap gap-2">
              {profile.fav_things.map(thing => (
                <span key={thing} className={`font-hand text-sm px-3 py-1 rounded-full ${c.pill}`}>{thing}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-medium text-chocolate/40 uppercase tracking-wide mb-3">contributions</p>
          <div className="grid grid-cols-5 gap-2">
            {statsList.map(({ emoji, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-xl">{emoji}</span>
                <span className={`font-display text-xl font-bold ${c.stat}`}>{value}</span>
                <span className="font-hand text-xs text-chocolate/30">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [statsMap, setStatsMap] = useState<Record<string, ProfileStats>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all profiles (works without knowing UUIDs)
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })
      .then(async ({ data }) => {
        if (!data || data.length === 0) { setLoading(false); return }
        setProfiles(data)
        const entries = await Promise.all(
          data.map(async p => [p.id, await fetchStats(p.id)] as [string, ProfileStats])
        )
        setStatsMap(Object.fromEntries(entries))
        setLoading(false)
      })
  }, [])

  const accents: Array<'sunflower' | 'orchid'> = ['sunflower', 'orchid']

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-10 py-12">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="font-hand text-sm text-chocolate/40 hover:text-chocolate transition mb-8 flex items-center gap-1"
      >
        ← back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-5xl text-chocolate">the two of us</h1>
        <p className="font-hand text-orchid text-xl mt-2">psst — you found the secret page 🌻</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="text-5xl animate-tilt">🌻</div>
          <p className="font-hand text-orchid text-xl">loading your people…</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-32">
          <p className="font-hand text-chocolate/40 text-lg">
            no profiles yet — finish setting up first 🌻
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {profiles.map((profile, i) => (
            statsMap[profile.id] && (
              <PersonCard
                key={profile.id}
                profile={profile}
                stats={statsMap[profile.id]}
                delay={i * 0.1 + 0.1}
                accent={accents[i % 2]}
                isOwn={user?.id === profile.id}
              />
            )
          ))}
        </div>
      )}
    </div>
  )
}