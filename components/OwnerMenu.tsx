'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
export default function OwnerMenu({ ownerId, postId }:{ ownerId: string; postId: string }){
  const supabase = createBrowserClient()
  const [isOwner, setIsOwner] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>{ if(data.user?.id === ownerId) setIsOwner(true) }) },[ownerId])
  const onDelete = async () => {
    if (!confirm('Slette innlegget? Dette kan ikke angres.')) return
    setBusy(true)
    const res = await fetch(`/api/posts/${postId}/delete`, { method:'POST' })
    if (res.ok) window.location.href = '/'
    else { const j = await res.json().catch(()=>({})); alert(j.error || 'Kunne ikke slette'); setBusy(false) }
  }
  if (!isOwner) return null
  return (<div className="flex items-center gap-2"><a className="btn" href={`/post/${postId}/edit`}>Rediger</a><button className="btn" onClick={onDelete} disabled={busy}>{busy ? 'Sletter…' : 'Slett'}</button></div>)
}
