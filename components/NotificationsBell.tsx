'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'

type Noti = { id: string; content: string; created_at: string; post_id: string; from_username: string }

export default function NotificationsBell() {
  const supabase = createBrowserClient()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Noti[]>([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Hent dine post-id’er
      const { data: myPosts } = await supabase.from('posts').select('id').eq('user_id', user.id)
      const postIds = (myPosts || []).map(p => p.id)
      if (!postIds.length) return

      // Hent siste kommentarer på dine innlegg
      const { data: rows } = await supabase
        .from('comments')
        .select('id, content, created_at, post_id, profiles!inner(username)')
        .in('post_id', postIds)
        .order('created_at', { ascending: false })
        .limit(10)

      const mapped: Noti[] = ((rows as any) || []).map((r: any) => {
        const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
        return {
          id: r.id,
          content: r.content,
          created_at: r.created_at,
          post_id: r.post_id,
          from_username: prof?.username || 'ukjent',
        }
      })

      setItems(mapped)

      const seen = JSON.parse(localStorage.getItem('tg_seen_comments') || '[]')
      setUnread(mapped.filter(m => !seen.includes(m.id)).length)

      // Realtime: nye kommentarer
      const channel = supabase
        .channel('rt-noti')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, (payload: any) => {
          const c = payload.new
          if (!postIds.includes(c.post_id)) return
          supabase
            .from('profiles')
            .select('username')
            .eq('id', c.user_id)
            .single()
            .then(({ data }) => {
              setItems(prev => [
                { id: c.id, content: c.content, created_at: c.created_at, post_id: c.post_id, from_username: data?.username || 'ukjent' },
                ...prev,
              ].slice(0, 10))
              setUnread(u => u + 1)
            })
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    })()
  }, [])

  const markAllRead = () => {
    const seen = JSON.parse(localStorage.getItem('tg_seen_comments') || '[]')
    const merged = Array.from(new Set([...seen, ...items.map(i => i.id)]))
    localStorage.setItem('tg_seen_comments', JSON.stringify(merged))
    setUnread(0)
  }

  return (
    <div className="relative">
      <button onClick={() => { setOpen(o => !o); if (!open) markAllRead() }} className="btn relative" aria-label="Varsler">
        🔔{unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1.5 py-0.5">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-2xl shadow-soft p-2 z-30">
          <div className="text-sm font-semibold px-2 py-1">Nye kommentarer</div>
          <div className="divide-y">
            {items.length === 0 && <div className="p-3 text-sm text-slate-500">Ingen varsler.</div>}
            {items.map(n => (
              <div key={n.id} className="p-3 text-sm">
                <span className="font-medium">@{n.from_username}</span> kommenterte: <span className="text-slate-700">{n.content}</span>
                <div className="text-[11px] text-slate-400 mt-1">{new Date(n.created_at).toLocaleString('no-NO')}</div>
              </div>
            ))}
          </div>
          <div className="p-2"><button onClick={markAllRead} className="btn w-full">Marker alt som lest</button></div>
        </div>
      )}
    </div>
  )
}
