'use client'
import { getCountries } from '@/lib/countries.full'
export default function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = getCountries('nb')
  return (<select value={value} onChange={e=>onChange(e.target.value)}><option value="">Velg land…</option>{options.map(c => (<option key={c.code} value={c.code}>{c.flag} {c.name}</option>))}</select>)
}
