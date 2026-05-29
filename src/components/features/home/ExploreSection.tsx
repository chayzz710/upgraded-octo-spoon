import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import PageCard, { type PageData } from './PageCard'
import { DoodleFlower, DoodleHeart } from '../../motifs/HomeDoodles'

interface Counts {
  photos: number
  letters_sealed: number
  letters_open_when: number
  jar: number
  puns: number
  map_visited: number
  map_dreamed: number
  playlist: number
  bucketlist_done: number
  bucketlist_total: number
}

async function fetchCounts(): Promise<Counts> {
  const [
    photos,
    letterSealed,
    letterOpenWhen,
    jar,
    puns,
    mapAll,
    playlist,
    bucketAll,
  ] = await Promise.all([
    supabase.from('photos').select('id', { count: 'exact', head: true }),
    supabase.from('letters').select('id', { count: 'exact', head: true }).eq('is_open_when', false),
    supabase.from('letters').select('id', { count: 'exact', head: true }).eq('is_open_when', true),
    supabase.from('memory_jar_notes').select('id', { count: 'exact', head: true }),
    supabase.from('puns').select('id', { count: 'exact', head: true }),
    supabase.from('map_pins').select('id, visited_on', { count: 'exact' }),
    supabase.from('songs').select('id', { count: 'exact', head: true }),
    supabase.from('bucket_items').select('id, is_done', { count: 'exact' }),
  ])

  const mapPins = mapAll.data ?? []
  const bucketItems = bucketAll.data ?? []

  return {
    photos:              photos.count ?? 0,
    letters_sealed:      letterSealed.count ?? 0,
    letters_open_when:   letterOpenWhen.count ?? 0,
    jar:                 jar.count ?? 0,
    puns:                puns.count ?? 0,
    map_visited:         mapPins.filter(p => p.visited_on).length,
    map_dreamed:         mapPins.filter(p => !p.visited_on).length,
    playlist:            playlist.count ?? 0,
    bucketlist_done:     bucketItems.filter(b => b.is_done).length,
    bucketlist_total:    bucketItems.length,
  }
}

function buildPages(c: Counts | null): PageData[] {
  return [
    {
      key: 'gallery',
      title: 'gallery',
      sub: 'every photo, every memory, every terrible angle',
      icon: '📷',
      color: '#F5C842', soft: '#FFFAED', dark: '#E2A500',
      side: 'left',
      meta: c ? `${c.photos} photo${c.photos !== 1 ? 's' : ''}` : '…',
      snippet: 'last added: that sunset on the 3rd',
      href: '/gallery',
    },
    {
      key: 'letters',
      title: 'letters',
      sub: 'sealed envelopes, open hearts, open-when notes',
      icon: '✉️',
      color: '#E69CB5', soft: '#FEF0F4', dark: '#b46d83',
      side: 'right',
      meta: c ? `${c.letters_sealed} letters · ${c.letters_open_when} open-when` : '…',
      snippet: 'open when you miss me ✉',
      href: '/letters',
    },
    {
      key: 'jar',
      title: 'memory jar',
      sub: 'little notes, big feelings, shake for a surprise',
      icon: '🫙',
      color: '#7FC8A9', soft: '#EDF8F2', dark: '#3f8a6a',
      side: 'left',
      meta: c ? `${c.jar} note${c.jar !== 1 ? 's' : ''} inside` : '…',
      snippet: '"you laughed so hard you snorted"',
      href: '/jar',
    },
    {
      key: 'puns',
      title: 'pun wall',
      sub: 'terrible. absolutely terrible. we love them.',
      icon: '🦖',
      color: '#9B7FD4', soft: '#F2EEF9', dark: '#6A5ACD',
      side: 'right',
      meta: c ? `${c.puns} pun${c.puns !== 1 ? 's' : ''} · 0 apologies` : '…',
      snippet: '"what do you call a snoring dragon?" 🐉',
      href: '/puns',
    },
    {
      key: 'map',
      title: 'our map',
      sub: 'places we have been, places we want to go',
      icon: '🗺️',
      color: '#3B82C4', soft: '#E8F2FB', dark: '#2c6aa2',
      side: 'left',
      meta: c ? `${c.map_visited} visited · ${c.map_dreamed} dreamed` : '…',
      snippet: 'next stop: that coffee shop on the corner',
      href: '/map',
    },
    {
      key: 'playlist',
      title: 'playlist',
      sub: 'the songs that were playing when things happened',
      icon: '🎵',
      color: '#E2A500', soft: '#FFF6D6', dark: '#8a6500',
      side: 'right',
      meta: c ? `${c.playlist} track${c.playlist !== 1 ? 's' : ''}` : '…',
      snippet: 'now playing: the one from the kitchen dance',
      href: '/playlist',
    },
    {
      key: 'bucketlist',
      title: 'bucket list',
      sub: 'things to do, places to go, life to live together',
      icon: '♟️',
      color: '#7a5a44', soft: '#F5EDE4', dark: '#4a3020',
      side: 'left',
      meta: c ? `${c.bucketlist_done} done · ${c.bucketlist_total - c.bucketlist_done} to go` : '…',
      snippet: "next up: that thing we keep saying we'll do",
      href: '/bucketlist',
    },
  ]
}

export default function ExploreSection() {
  const [counts, setCounts] = useState<Counts | null>(null)

  useEffect(() => {
    fetchCounts().then(setCounts).catch(() => {/* silently show '…' if fetch fails */})
  }, [])

  const PAGES = buildPages(counts)

  return (
    <section style={{ position: 'relative', paddingTop: 80, paddingBottom: 80, overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, width: '90%', margin: '0 auto', padding: '0 2vw', position: 'relative' }}>

        {/* section header */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', marginBottom: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ height: 1, width: 48, background: 'rgba(59,31,14,0.2)', display: 'inline-block' }} />
            <DoodleFlower size={28} />
            <span style={{ height: 1, width: 48, background: 'rgba(59,31,14,0.2)', display: 'inline-block' }} />
          </div>
          <p style={{ fontFamily: 'Caveat, cursive', color: '#6A5ACD', fontSize: 22, margin: 0 }}>
            flip through
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontSize: 52, color: '#3B1F0E',
            margin: 0, marginTop: 4,
          }}>
            our little{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(0deg, rgba(245,200,66,0.45) 30%, transparent 30%)',
            }}>
              pages
            </span>
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif', color: 'rgba(59,31,14,0.55)',
            marginTop: 12, maxWidth: 400, lineHeight: 1.6, fontSize: 15,
          }}>
            six rooms in our corner — pinned, taped and stacked.<br />
            hover to peek inside.
          </p>
        </div>

        {/* zigzag list */}
        <div style={{ position: 'relative' }}>
          {/* dashed center thread */}
          <div style={{
            position: 'absolute', top: 8, bottom: 8, left: '50%', display: 'var(--thread-display, block)',
            transform: 'translateX(-50%)',
            width: 0, borderLeft: '2px dashed rgba(106,90,205,0.35)',
          }} />

          {/* thumbtacks */}
          <div style={{
            position: 'absolute', inset: 0, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-around', alignItems: 'center',
            pointerEvents: 'none',
          }}>
            {PAGES.map((_, i) => (
              <span key={i} style={{
                width: 12, height: 12, borderRadius: '50%',
                background: '#9B7FD4', border: '2px solid #FFFDF4',
                boxShadow: '0 1px 4px rgba(59,31,14,0.2)',
                display: 'block',
              }} />
            ))}
          </div>

          <ul style={{
            display: 'flex', flexDirection: 'column', gap: 24,
            listStyle: 'none', padding: 0, margin: 0,
          }}>
            {PAGES.map((p, i) => <PageCard key={p.key} page={p} idx={i} />)}
          </ul>
        </div>

        {/* footer line */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 56 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: 'Caveat, cursive', color: 'rgba(59,31,14,0.5)', fontSize: 18,
          }}>
            <DoodleHeart size={14} color="#E69CB5" />
            more rooms coming when we live them
            <DoodleHeart size={14} color="#9B7FD4" />
          </div>
        </div>
      </div>
    </section>
  )
}