'use client'
import { useEffect } from 'react'

export default function ThemeLoader(){
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tg_theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = (saved === 'dark' || saved === 'light') ? saved : (prefersDark ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', theme)
    } catch {}
  }, [])
  return null
}
