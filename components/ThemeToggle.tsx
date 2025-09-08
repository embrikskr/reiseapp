'use client'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle(){
  const [theme, setTheme] = useState<'light'|'dark'>(() => 'light')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tg_theme') as 'light'|'dark'|null
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const t = saved || (prefersDark ? 'dark' : 'light')
      setTheme(t as any)
      document.documentElement.setAttribute('data-theme', t)
    } catch {}
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem('tg_theme', next) } catch {}
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <button onClick={toggle} className="btn btn-ghost" aria-label="Bytt tema">
      {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
    </button>
  )
}
