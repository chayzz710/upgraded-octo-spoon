import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { OWNERS } from '../../../types'
import type { Profile } from '../../../types'

function Avatar({ profile, accent }: { profile: Profile | null; accent: 'sunflower' | 'orchid' }) {
  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'
  const isEmoji = profile?.avatar_url && !profile.avatar_url.startsWith('http')

  const borderColor = accent === 'sunflower' ? 'border-sunflower' : 'border-orchid'
  const bgColor     = accent === 'sunflower' ? 'bg-sunflower/20' : 'bg-orchid/20'

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`w-24 h-24 rounded-full border-4 ${borderColor} ${bgColor} shadow-polaroid flex items-center justify-center overflow-hidden`}>
        {isEmoji ? (
          <span className="text-4xl">{profile!.avatar_url}</span>
        ) : profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.display_name ?? 'User'} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-2xl text-chocolate">{initials}</span>
        )}
      </div>
      <div className="text-center">
        <p className="font-display text-lg text-chocolate leading-tight">
          {profile?.display_name ?? '…'}
        </p>
        {profile?.nickname && (
          <p className={`font-hand text-base leading-tight ${accent === 'sunflower' ? 'text-sunflower-dark' : 'text-orchid-deep'}`}>
            {profile.nickname}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function ProfilePair() {
  const [user1, setUser1] = useState<Profile | null>(null)
  const [user2, setUser2]   = useState<Profile | null>(null)

  useEffect(() => {
    async function load() {
      const ids = [OWNERS.user1, OWNERS.user2].filter((id) => id !== 'TBD')
      if (ids.length === 0) return
      const { data } = await supabase.from('profiles').select('*').in('id', ids)
      if (!data) return
      data.forEach((p: Profile) => {
        if (p.id === OWNERS.user1) setUser1(p)
        if (p.id === OWNERS.user2) setUser2(p)
      })
    }
    load()
  }, [])

  return (
    <div className="flex items-center justify-center gap-10">
      <Avatar profile={user1} accent="sunflower" />
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-4xl select-none"
        aria-hidden
      >
        💛
      </motion.div>
      <Avatar profile={user2} accent="orchid" />
    </div>
  )
}