'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import NotificationsBell from '@/components/NotificationsBell'
import SearchBox from '@/components/SearchBox'
export default function NavBar() {
  const supabase = createBrowserClient()
  const [user, setUser] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  useEffect(() => { supabase.auth.getUser().then(async ({ data }) => { const u = data.user; setUser(u?.id || null); if (u) { const { data: prof } = await supabase.from('profiles').select('username').eq('id', u.id).single(); setUsername(prof?.username || null) } }) }, [])
  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/' }
  return (<header className="nav-glass supports-[backdrop-filter]:backdrop-blur"><div className="container h-16 flex items-center gap-3"><Link href="/" className="font-bold tracking-tight text-brand-800">Travelgram</Link><div className="flex-1"><SearchBox /></div><nav className="flex items-center gap-2"><Link href="/passport" className="btn">Pass</Link><Link href="/new" className="btn btn-primary">Nytt</Link>{user ? (<><NotificationsBell /><Link href={`/profile/${username || 'meg'}`} className="btn">Profil</Link><Link href="/settings" className="btn">Innstillinger</Link><button onClick={logout} className="btn">Logg ut</button></>) : (<Link href="/login" className="btn">Logg inn</Link>)}</nav></div></header>)
}
