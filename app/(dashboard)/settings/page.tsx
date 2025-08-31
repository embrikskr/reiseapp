'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import AvatarUploader from '@/components/AvatarUploader'
export default function SettingsPage(){
  const supabase = createBrowserClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  useEffect(()=>{ supabase.auth.getUser().then(async({data})=>{ const u=data.user; if(!u) return; setUserId(u.id); const { data: p } = await supabase.from('profiles').select('username, full_name, is_public, avatar_url').eq('id', u.id).single(); if(p){ setUsername(p.username||''); setFullName(p.full_name||''); setIsPublic(p.is_public??true); setAvatar(p.avatar_url||null)} }) },[])
  const save = async (e:React.FormEvent)=>{ e.preventDefault(); if(!userId) return; setSaving(true); const { error } = await supabase.from('profiles').update({ username, full_name: fullName||null, is_public: isPublic, avatar_url: avatar }).eq('id', userId); if(error) alert(error.message); else alert('Lagret!'); setSaving(false) }
  return (<div className="card p-6"><h1 className="text-2xl font-bold mb-1">Innstillinger</h1><p className="text-slate-500 mb-4">Oppdater profilinformasjon og synlighet.</p><form onSubmit={save} className="space-y-4"><AvatarUploader currentUrl={avatar} onUploaded={setAvatar} /><div><label>Brukernavn</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="embrik" /></div><div><label>Fullt navn</label><input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Embrik ..." /></div><div className="flex items-center gap-2"><input id="is_public" type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /><label htmlFor="is_public">Offentlig profil</label></div><div className="pt-2"><button disabled={saving} className="btn btn-primary">{saving ? 'Lagrer…' : 'Lagre endringer'}</button></div></form></div>)
}
