'use client'
import { useEffect, useMemo, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import PassportMap from '@/components/PassportMap'
import { nameFor } from '@/lib/countries.full'

type Row = { country_code: string, rating?: number, created_at?: string }

const TOTAL_COUNTRIES = 197

export default function PassportPage (){
  const supabase = createBrowserClient()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); setError('Du må være innlogget.'); return }
      const { data, error } = await supabase.from('posts').select('country_code, rating, created_at').eq('user_id', user.id).order('created_at', { ascending: false })
      if (error) setError(error.message)
      setRows(data || [])
      setLoading(false)
    })()
  }, [])

  const visited = useMemo(() => Array.from(new Set(rows.map(r => (r.country_code||'').toUpperCase()))), [JSON.stringify(rows)])
  const percent = useMemo(() => Math.round((visited.length / TOTAL_COUNTRIES) * 100), [visited.length])

  const lastRatings = useMemo(() => rows.slice(0, 5).map(r => ({
    cc: r.country_code,
    name: nameFor(r.country_code, 'nb'),
    rating: r.rating || 0,
    date: r.created_at ? new Date(r.created_at).toLocaleDateString('no-NO') : '',
  })), [JSON.stringify(rows)])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="small">Land besøkt</div>
          <div className="text-2xl font-bold">{visited.length}</div>
          <div className="progress mt-2"><span style={{ width: `${percent}%` }} /></div>
          <div className="small mt-1">{percent}% av verden</div>
        </div>
        <div className="card p-4">
          <div className="small">Innlegg</div>
          <div className="text-2xl font-bold">{rows.length}</div>
          <div className="small mt-1">Siste 5 under</div>
        </div>
        <div className="card p-4">
          <div className="small">Streak</div>
          <div className="text-2xl font-bold">{new Date().getFullYear() - (rows.at(-1)?.created_at ? new Date(rows.at(-1)!.created_at!).getFullYear() : new Date().getFullYear()) + 1} år</div>
          <div className="small mt-1">År med reiser</div>
        </div>
        <div className="card p-4">
          <div className="small">Del</div>
          <button className="btn btn-primary mt-2" onClick={async ()=>{
            if (navigator.share) {
              await navigator.share({ title: 'Mitt reise-kart', url: window.location.href })
            } else {
              await navigator.clipboard.writeText(window.location.href)
              alert('Lenke kopiert!')
            }
          }}>Del kart</button>
        </div>
      </div>

      <PassportMap iso2Codes={visited} />

      <div className="card p-4">
        <div className="h2 mb-2">Siste ratinger</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lastRatings.map((r, i) => (
            <div key={i} className="flex items-center justify-between border rounded-2xl p-3">
              <div>
                <div className="font-semibold">{r.name}</div>
                <div className="small">{r.date}</div>
              </div>
              <div className="chip">★ {r.rating.toFixed(1)}</div>
            </div>
          ))}
          {lastRatings.length === 0 && <div className="text-slate-500 text-sm">Ingen ratinger ennå.</div>}
        </div>
      </div>
    </div>
  )
}
