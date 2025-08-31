'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import PostCard from '@/components/PostCard'
import CountryFilter from '@/components/CountryFilter'
type Mode = 'explore' | 'following'
export default function FeedPage() {
  const supabase = createBrowserClient()
  const [mode, setMode] = useState<Mode>('explore')
  const [countries, setCountries] = useState<string[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useSearchParams()
  const q = params.get('q') || ''
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null)) }, [])
  const fetchPosts = async () => {
    setLoading(true)
    let query = supabase.from('posts').select('id, created_at, country_code, title, body, rating, user_id, profiles!inner(id, username, avatar_url), post_images(url)').order('created_at', { ascending: false }).limit(40)
    if (countries.length > 0) query = query.in('country_code', countries)
    if (q) query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%`)
    if (mode === 'explore') { if (userId) query = query.neq('user_id', userId) }
    else {
      if (!userId) { setPosts([]); setLoading(false); return }
      const { data: follows } = await supabase.from('follows').select('following_id').eq('follower_id', userId)
      const ids = (follows || []).map(f => f.following_id); if (ids.length === 0) { setPosts([]); setLoading(false); return }
      query = query.in('user_id', ids)
    }
    const { data } = await query; setPosts(data || []); setLoading(false)
  }
  useEffect(() => { fetchPosts() }, [mode, JSON.stringify(countries), userId, q])
  return (<div className="space-y-4"><div className="card p-3 sticky top-2 z-10 flex items-center gap-2"><button onClick={()=>setMode('explore')} className={`btn ${mode==='explore'?'btn-primary':''}`}>Utforsk</button><button onClick={()=>setMode('following')} className={`btn ${mode==='following'?'btn-primary':''}`}>Følger</button><div className="ml-auto" /><CountryFilter value={countries} onChange={setCountries} /></div>{loading && <div className="card p-6">Laster…</div>}{!loading && !posts?.length && (<div className="card p-8 text-center"><h2 className="text-xl font-semibold">Ingen treff</h2><p className="text-slate-500">Prøv andre søkeord eller fjern filtere.</p></div>)}{posts?.map((p)=>(<PostCard key={p.id} post={p as any}/>))}</div>)
}
