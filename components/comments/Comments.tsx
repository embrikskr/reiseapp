'use client'
import { useEffect, useRef, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
type Comment = { id: string; content: string; created_at: string; profiles: { username: string } }
export default function Comments({ postId }: { postId: string }) {
  const supabase = createBrowserClient()
  const [items, setItems] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const chanRef = useRef<any>(null)
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('comments').select('id, content, created_at, profiles!inner(username)').eq('post_id', postId).order('created_at', { ascending: true })
    setItems((data as any) || []); setLoading(false)
  }
  useEffect(() => {
    load()
    if (chanRef.current) supabase.removeChannel(chanRef.current)
    const channel = supabase.channel(`rt-comments-${postId}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'comments',filter:`post_id=eq.${postId}`},async(payload)=>{
      const c:any = payload.new
      const { data } = await supabase.from('profiles').select('username').eq('id', c.user_id).single()
      setItems(prev=>[...prev,{ id:c.id, content:c.content, created_at:c.created_at, profiles:{ username: data?.username || 'ukjent'} }])
    }).subscribe()
    chanRef.current = channel
    return ()=>{ supabase.removeChannel(channel) }
  }, [postId])
  const add = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Logg inn for å kommentere'); return }
    const body = text.trim(); if (!body) return
    const { error } = await supabase.from('comments').insert({ post_id: postId, user_id: user.id, content: body })
    if (!error) setText('')
  }
  return (<div><h4 className="font-semibold mb-2">Kommentarer</h4><div className="flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Skriv en kommentar…" className="flex-1" /><button onClick={add} className="btn btn-primary">Publiser</button></div><div className="mt-3 space-y-2">{loading && <div className="text-sm text-slate-500">Laster…</div>}{!loading && items.length===0 && <div className="text-sm text-slate-500">Ingen kommentarer enda.</div>}{items.map(c => (<div key={c.id} className="flex items-start gap-2"><span className="text-sm font-medium">@{c.profiles.username}</span><span className="text-sm text-slate-700">{c.content}</span><span className="ml-auto text-[11px] text-slate-400">{new Date(c.created_at).toLocaleDateString('no-NO')}</span></div>))}</div></div>)
}
