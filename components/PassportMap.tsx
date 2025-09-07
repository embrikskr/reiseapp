'use client'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const WorldMap = dynamic(() => import('react-svg-worldmap'), { ssr: false }) as any

export default function PassportMap({ iso2Codes }: { iso2Codes: string[] }) {
  const data = useMemo(() => {
    const uniq = Array.from(new Set((iso2Codes || []).map(c => (c||'').toUpperCase())))
    return uniq.map(code => ({ country: code, value: 1 }))
  }, [JSON.stringify(iso2Codes)])

  if (!data.length) return <div className="p-6 text-sm text-slate-500">Ingen land registrert ennå.</div>

  return (
    <div className="card p-3">
      <div className="h2 mb-2">Ditt kart</div>
      <div className="w-full">
        <WorldMap
          size="responsive"
          color="#277dff"
          value-suffix=""
          backgroundColor="transparent"
          frame
          data={data}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">Pinch-zoom på mobil. Dra for å panorere.</p>
    </div>
  )
}