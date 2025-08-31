'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
export default function SearchBox() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  useEffect(() => { const t = setTimeout(() => {
    const sp = new URLSearchParams(Array.from(params.entries()))
    if (q) sp.set('q', q); else sp.delete('q')
    router.push(`${pathname}?${sp.toString()}`)
  }, 350); return () => clearTimeout(t) }, [q])
  return (<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Søk i innlegg…" className="w-full" />)
}
