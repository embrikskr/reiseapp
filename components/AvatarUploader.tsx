'use client'
import { useState } from 'react'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabaseBrowser'
export default function AvatarUploader({ currentUrl, onUploaded }: { currentUrl?: string | null; onUploaded: (url: string) => void }) {
  const supabase = createBrowserClient()
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [busy, setBusy] = useState(false)
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setPreview(URL.createObjectURL(file))
    setBusy(true)
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return
    const path = `${user.id}/${Date.now()}-${file.name}`
    const up = await supabase.storage.from('avatars').upload(path, file, { upsert: false })
    if (up.error) { alert(up.error.message); setBusy(false); return }
    const pub = supabase.storage.from('avatars').getPublicUrl(up.data.path)
    onUploaded(pub.data.publicUrl); setBusy(false)
  }
  return (<div className="flex items-center gap-3"><div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">{preview && <Image src={preview} alt="avatar" width={64} height={64} className="object-cover w-full h-full" />}</div><label className="btn cursor-pointer">Last opp avatar<input type="file" accept="image/*" className="hidden" onChange={onFile} /></label>{busy && <span className="text-sm text-slate-500">Laster opp…</span>}</div>)
}
