import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabaseServer'
import { nameFor } from '@/lib/countries.full'
import PostCard from '@/components/PostCard'
export default async function CountryPage({ params }:{ params:{ code:string } }){
  const code = params.code.toUpperCase()
  const supabase = createServerClient(cookies())
  const { data: posts } = await supabase.from('posts').select('id, created_at, country_code, title, body, rating, user_id, profiles!inner(id, username, avatar_url), post_images(url)').eq('country_code', code).order('created_at', { ascending:false }).limit(50)
  const avg = posts && posts.length ? (posts.reduce((a:number,p:any)=>a+(p.rating||0),0)/posts.length) : 0
  const top = (posts||[]).slice().sort((a:any,b:any)=>b.rating-a.rating).slice(0,3)
  return (<div className="space-y-6"><div className="card p-6"><h1 className="text-2xl font-bold">{nameFor(code,'nb')} <span className="badge ml-2">{code}</span></h1><p className="text-slate-600 mt-1">Snittrating: <span className="font-medium">{avg.toFixed(1)}</span> ({posts?.length||0} innlegg)</p></div>{top.length>0 && (<div className="card p-4"><h2 className="text-lg font-semibold mb-2">Toppinnlegg</h2><div className="grid grid-cols-1 gap-4">{top.map((p:any)=>(<PostCard key={p.id} post={p}/>))}</div></div>)}<div className="grid grid-cols-1 gap-4">{(posts||[]).map(p=>(<PostCard key={p.id} post={p as any}/>))}</div></div>)
}
