import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabaseServer'
import { nameFor } from '@/lib/countries.full'
import RatingStars from '@/components/RatingStars'
import Link from 'next/link'
export default async function PassportPage(){
  const supabase = createServerClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div className="card p-6">Du må være logget inn.</div>
  const { data: posts } = await supabase.from('posts').select('id, country_code, rating, created_at').eq('user_id', user.id).order('created_at', { ascending:false })
  const map = new Map<string,{count:number; last:string; avg:number; sum:number}>()
  ;(posts||[]).forEach(p=>{ const v = map.get(p.country_code) || {count:0,last:p.created_at,avg:0,sum:0}; const count=v.count+1; const sum=v.sum+(p.rating||0); map.set(p.country_code,{count,last:v.last,sum,avg:sum/count}) })
  const countries = Array.from(map.entries()).map(([code,v])=>({code,...v}))
  const latest = (posts||[]).slice(0,5)
  return (<div className="space-y-6"><div className="card p-6"><h1 className="text-2xl font-bold">Ditt reise-pass</h1><p className="text-slate-600 mt-1">Antall land: <span className="font-semibold">{countries.length}</span></p></div><div className="card p-4"><h2 className="text-lg font-semibold mb-2">Siste ratinger</h2><div className="space-y-2">{latest.map(p=>(<div key={p.id} className="flex items-center justify-between border rounded-xl p-3"><div className="flex items-center gap-2"><span className="badge">{p.country_code}</span><span>{nameFor(p.country_code,'nb')}</span></div><RatingStars value={p.rating||0} readOnly /></div>))}{latest.length===0 && <div className="text-sm text-slate-500">Ingen innlegg enda.</div>}</div></div><div className="card p-4"><h2 className="text-lg font-semibold mb-2">Besøkte land</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{countries.map(c=>(<Link key={c.code} href={`/country/${c.code}`} className="border rounded-xl p-3 hover:bg-slate-50"><div className="font-mono">{c.code}</div><div className="text-sm text-slate-600">{nameFor(c.code,'nb')}</div><div className="mt-2 flex items-center justify-between"><span className="text-xs text-slate-500">{c.count} innlegg</span><span className="text-xs">Snitt: {c.avg.toFixed(1)}</span></div></Link>))}{countries.length===0 && <div className="text-sm text-slate-500">Du har ikke postet noe enda.</div>}</div></div></div>)
}
