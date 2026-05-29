import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Letter } from '../types'

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLetters = async () => {
    setLoading(true)
    try {
      // Fetch letters + profiles in parallel
      const [{ data: lettersData }, { data: profilesData }] = await Promise.all([
        supabase.from('letters').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, display_name, nickname, avatar_url'),
      ])

      if (!lettersData) { setLetters([]); return }

      // Build a lookup map: id → profile
      const profileMap = Object.fromEntries(
        (profilesData ?? []).map(p => [p.id, p])
      )

      // Attach profile to each letter
      const enriched = lettersData.map(l => ({
        ...l,
        profiles: profileMap[l.author_id] ?? null,
      }))

      setLetters(enriched)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLetters() }, [])

  return { letters, loading, refetch: fetchLetters }
}