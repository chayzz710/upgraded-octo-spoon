import { SITE_CONFIG } from '../config'

// ── Owners ────────────────────────────────────────────────
// Keyed by user1 / user2 — fill in SITE_CONFIG.owners after first logins
export interface OwnerMap {
  user1: string
  user2: string
}

export const OWNERS: OwnerMap = SITE_CONFIG.owners

export const RELATIONSHIP_START = SITE_CONFIG.relationshipStart

// ── DB row types (mirrors Supabase schema) ────────────────
export interface Profile {
  id: string
  display_name: string | null
  nickname: string | null
  bio: string | null
  avatar_url: string | null
  love_language: string | null
  fav_things: string[] | null
  created_at: string
  current_location?: string | null
  current_location_lat?: number | null
  current_location_lng?: number | null
}

export interface Photo {
  id: string
  uploaded_by: string
  storage_path: string
  caption: string | null
  taken_at: string | null
  chocolate_rating: number | null
  created_at: string
  url: string | null
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface Letter {
  id: string
  author_id: string
  title: string
  body: string
  is_open_when: boolean
  unlock_condition: string | null
  opened_at: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface MemoryJarNote {
  id: string
  author_id: string
  body: string
  chocolate_rating: number | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface Pun {
  id: string
  author_id: string
  body: string
  rating: number | null
  rated_by: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface MapPin {
  id: string
  added_by: string
  lat: number
  lng: number
  title: string
  story: string | null
  pin_type: 'first_date' | 'favourite' | 'adventure' | 'home' | 'other' | null
  photo_url: string | null
  visited_on: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface Song {
  id: string
  added_by: string
  spotify_track_id: string
  note: string | null
  is_anthem: boolean
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}

export interface BucketItem {
  id: string
  added_by: string
  title: string
  description: string | null
  is_done: boolean
  done_at: string | null
  created_at: string
  profiles?: Pick<Profile, 'display_name' | 'nickname' | 'avatar_url'>
}
