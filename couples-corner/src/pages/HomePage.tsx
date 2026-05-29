import { useState, useEffect } from 'react'
import { differenceInDays } from 'date-fns'
import { supabase } from '../lib/supabase'
import { RELATIONSHIP_START, OWNERS } from '../types'
import PageWrapper from '../components/layout/PageWrapper'
import HeroSection from '../components/features/home/HeroSection'
import TodaysLittleThing from '../components/features/home/Todayslittlething'
import SiteFooter from '../components/features/home/Sitefooter'
import type { Profile } from '../components/features/home/AvatarCard'
import ExploreSection from '../components/features/home/ExploreSection'

export default function HomePage() {
  const days = differenceInDays(new Date(), RELATIONSHIP_START)
  const [user1Profile, setUser1Profile] = useState<Profile | null>(null)
  const [user2Profile, setUser2Profile]   = useState<Profile | null>(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      if (OWNERS.user1 !== "TBD" && OWNERS.user2 !== "TBD") {
        const { data } = await supabase
          .from('profiles')
          .select('id, display_name, nickname, avatar_url')
          .in('id', [OWNERS.user1, OWNERS.user2])
        if (data) {
          setUser1Profile(data.find(p => p.id === OWNERS.user1) ?? null)
          setUser2Profile(data.find(p => p.id === OWNERS.user2) ?? null)
        }
        return
      }
      // fallback while OWNERS are still TBD — grab first two profiles
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, nickname, avatar_url')
        .limit(2)
      if (data) {
        setUser1Profile(data[0] ?? null)
        setUser2Profile(data[1] ?? null)
      }
    }
    fetchProfiles()
  }, [])

  return (
    // PageWrapper provides the Navbar + FrogEasterEgg + page fade-in
    <PageWrapper pageKey="home">
      <HeroSection user1={user1Profile} user2={user2Profile} days={days} />
      <TodaysLittleThing days={days} />
      <ExploreSection />
      <SiteFooter days={days} />
    </PageWrapper>
  )
}