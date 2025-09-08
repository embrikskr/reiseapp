'use client'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import NotificationsBell from '@/components/NotificationsBell'
import SearchBox from '@/components/SearchBox'
import ThemeToggle from '@/components/ThemeToggle'
import { LogIn, LogOut, PlusCircle, Settings, User, Globe2 } from 'lucide-react'

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
        <Link href="/" className="font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Globe2 size={18}/> Travelgram
        </Link>
        <div className="hidden md:block flex-1">
          <Suspense fallback={null}><SearchBox /></Suspense>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/passport" className="btn btn-ghost"><Globe2 size={16}/> Pass</Link>
          <Link href="/new" className="btn btn-primary"><PlusCircle size={16}/> New</Link>
          <ThemeToggle/>
          {user ? (
            <>
              <NotificationsBell />
              <Link href={`/profile/${username || 'meg'}`} className="btn btn-ghost"><User size={16}/> Profile</Link>
              <Link href="/settings" className="btn btn-ghost"><Settings size={16}/> Settings</Link>
              <button onClick={logout} className="btn btn-ghost"><LogOut size={16}/> Logout</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary"><LogIn size={16}/> Logg inn</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
