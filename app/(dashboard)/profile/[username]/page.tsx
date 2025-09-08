'use client'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import PostCard from '@/components/PostCard'
import { nameFor } from '@/lib/countries.full'

type Profile = { id: string; username: string; full_name: string | null; avatar_url: string | null; is_private: boolean | null; bio?: string | null }
type Post = any

export default function ProfilePage(){
  const supabase = createBrowserClient()
  const params = useParams()
  const username = (params?.username as string) || ''

  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from('profiles').select('id, username, full_name, avatar_url, is_private').eq('username', username).single()
      setProfile(p as any)
      if (p) {
        const { data } = await supabase
          .from('posts')
          .select('id, created_at, country_code, title, body, rating, user_id, profiles!inner(id, username, avatar_url), post_images(url, alt, is_cover, order_index)')
          .eq('user_id', p.id)
          .order('created_at', { ascending: false })
          .limit(50)
        setPosts(data || [])
      }
    })()
  }, [username])

  const countries = useMemo(() => Array.from(new Set(posts.map(p => p.country_code))), [posts])
  const avg = useMemo(() => {
    const r = posts.map(p => p.rating).filter(Boolean); if (!r.length) return 0
    return Math.round((r.reduce((a,b)=>a+b,0)/r.length)*10)/10
  }, [posts])

  return (
    <div className="space-y-4">
      <div className="card p-4 md:p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden">
          {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover"/> : null}
        </div>
        <div className="flex-1">
          <div className="text-xl font-bold">@{profile?.username}</div>
          <div className="small">{profile?.full_name || ''}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="chip">Land: {countries.length}</span>
            <span className="chip">Innlegg: {posts.length}</span>
            <span className="chip">Snittrating: {avg.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <a className="btn" href="/settings">Rediger</a>
          <button className="btn btn-primary" onClick={async()=>{
            if (navigator.share) await navigator.share({ title: `@${profile?.username} på Travelgram`, url: window.location.href })
            else { await navigator.clipboard.writeText(window.location.href); alert('Lenke kopiert!') }
          }}>Del profil</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {posts.map(p => <PostCard key={p.id} post={p as any} />)}
      </div>
    </div>
  )
}
