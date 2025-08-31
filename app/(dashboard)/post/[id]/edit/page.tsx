'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import CountrySelect from '@/components/CountrySelect'
import RatingStars from '@/components/RatingStars'
export default function EditPostPage(){
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createBrowserClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(''); const [body, setBody] = useState('')
  const [rating, setRating] = useState(4); const [country, setCountry] = useState('')
  useEffect(()=>{ (async ()=>{ const { data: { user } } = await supabase.auth.getUser(); if(!user){ setError('Du må være innlogget'); setLoading(false); return } const { data: post, error } = await supabase.from('posts').select('user_id, title, body, rating, country_code').eq('id', id).single(); if(error || !post){ setError('Fant ikke innlegget'); setLoading(false); return } setTitle(post.title||''); setBody(post.body||''); setRating(post.rating||0); setCountry(post.country_code||''); setLoading(false) })() },[id])
  const save = async (e: React.FormEvent) => { e.preventDefault(); setError(null); setLoading(true); const { error } = await supabase.from('posts').update({ title: title || null, body: body || null, rating, country_code: country || null }).eq('id', id); setLoading(false); if (error) setError(error.message); else router.push(`/post/${id}`) }
  return (<div className="card p-6"><h1 className="text-2xl font-bold mb-2">Rediger innlegg</h1>{loading && <div>Laster…</div>}{!loading && <form onSubmit={save} className="space-y-4"><div><label>Land</label><CountrySelect value={country} onChange={setCountry} /></div><div><label>Overskrift</label><input value={title} onChange={e=>setTitle(e.target.value)} /></div><div><label>Tekst</label><textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} /></div><div><label>Rating</label><RatingStars value={rating} onChange={setRating} /></div>{error && <p className="text-red-600 text-sm">{error}</p>}<div className="flex items-center gap-2"><button className="btn btn-primary">Lagre</button><a href={`/post/${id}`} className="btn">Avbryt</a></div></form>}</div>)
}
