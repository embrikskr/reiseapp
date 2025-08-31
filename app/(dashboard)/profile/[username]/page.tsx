import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabaseServer'
import Image from 'next/image'
import FollowButton from '@/components/FollowButton'
import { nameFor, WORLD_COUNTRY_COUNT, CONTINENT_LABELS, continentOf } from '@/lib/countries.full'
import ProgressBar from '@/components/ProgressBar'
import Link from 'next/link'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = createServerClient(cookies())
  const { data: { user: me } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('id, username, full_name, avatar_url, is_public').eq('username', params.username).single()
  if (!profile) return <div className="card p-6">Fant ikke profil.</div>
  const { data: posts } = await supabase.from('posts').select('id, created_at, country_code, title, body, rating, user_id, post_images(url)').eq('user_id', profile.id).order('created_at', { ascending: false })

  const visitedSet = new Set<string>((posts||[]).map(p => p.country_code))
  const visited = Array.from(visitedSet)
  const percentWorld = visited.length / WORLD_COUNTRY_COUNT * 100
  const byCont: Record<string, number> = {}
  visited.forEach(code => { const c = continentOf(code); byCont[c] = (byCont[c]||0) + 1 })

  let isFollowing = false
  if (me && me.id !== profile.id) { const { data: f } = await supabase.from('follows').select('follower_id').eq('follower_id', me.id).eq('following_id', profile.id).maybeSingle(); isFollowing = !!f }

  return (
    <div className="space-y-6">
      <div className="card p-6 flex items-center gap-4">
        {profile.avatar_url ? <Image src={profile.avatar_url} alt="avatar" width={64} height={64} className="rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-slate-200" />}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-slate-500">{profile.full_name || '—'}</p>
        </div>
        {me && me.id !== profile.id && <FollowButton targetId={profile.id} initialFollowing={isFollowing} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi"><div><div className="text-slate-500 text-sm">Land besøkt</div><div className="text-2xl font-bold">{visited.length}</div></div><div className="text-right"><div className="text-slate-500 text-sm">% av verden</div><div className="text-2xl font-bold">{percentWorld.toFixed(1)}%</div></div></div>
        <div className="kpi"><div><div className="text-slate-500 text-sm">Innlegg</div><div className="text-2xl font-bold">{posts?.length || 0}</div></div></div>
        <div className="kpi"><div className="w-full"><div className="text-slate-500 text-sm mb-1">Verdensprogresjon</div><ProgressBar value={percentWorld} /></div></div>
      </div>

      <div className="card p-6">
        <h2 className="section-title mb-3">Verdensdeler</h2>
        <div className="space-y-3">
          {Object.entries(CONTINENT_LABELS).map(([key, label]) => {
            const count = byCont[key] || 0
            const pct = WORLD_COUNTRY_COUNT ? (count / WORLD_COUNTRY_COUNT * 100) : 0
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className="text-slate-500">{count} land</span>
                </div>
                <ProgressBar value={pct} />
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="section-title mb-3">Land besøkt</h2>
        <div className="flex flex-wrap gap-2">
          {visited.map(code => (
            <Link key={code} href={`/country/${code}`} className="chip">{code} <span className="text-slate-600">{nameFor(code, 'nb')}</span></Link>
          ))}
          {visited.length === 0 && <div className="text-sm text-slate-500">Ingen land registrert enda.</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(posts || []).map((p)=>(
          <div key={p.id} className="card p-4">
            <div className="text-sm text-slate-500">{new Date(p.created_at).toLocaleDateString('no-NO')}</div>
            <h3 className="text-lg font-semibold mt-1">{p.title || p.country_code}</h3>
            <div className="mt-2 text-sm">{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
