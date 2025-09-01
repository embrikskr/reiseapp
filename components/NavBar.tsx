'use client'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import NotificationsBell from '@/components/NotificationsBell'
import SearchBox from '@/components/SearchBox'

export default function NavBar() {
  const supabase = createBrowserClient()
  const [user, setUser] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user; setUser(u?.id || null)
      if (u) {
        const { data: prof } = await supabase.from('profiles').select('username').eq('id', u.id).single()
        setUsername(prof?.username || null)
      }
    })
  }, [])

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/' }

  return (
    <header className="navbar">
      <div className="container h-14 md:h-16 flex items-center gap-3">
        <Link href="/" className="font-bold tracking-tight text-slate-900">Travelgram</Link>
        <div className="hidden md:block flex-1">
          <Suspense fallback={null}><SearchBox /></Suspense>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/passport" className="btn btn-ghost">Pass</Link>
          <Link href="/new" className="btn btn-primary">New</Link>
          {user ? (
            <>
              <NotificationsBell />
              <Link href={`/profile/${username || 'meg'}`} className="btn btn-ghost">Profile</Link>
              <Link href="/settings" className="btn btn-ghost">Settings</Link>
              <button onClick={logout} className="btn btn-ghost">Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary">Logg inn</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
