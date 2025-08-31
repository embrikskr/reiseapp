'use client'
import { getCountries } from '@/lib/countries.full'
export default function CountryFilter({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const options = getCountries('nb')
  const toggle = (code: string) => { if (value.includes(code)) onChange(value.filter(v => v !== code)); else onChange([...value, code]) }
  return (<div className="relative"><details className="group"><summary className="list-none btn cursor-pointer">Filtrer land ({value.length})</summary><div className="absolute right-0 mt-2 w-80 max-h-80 overflow-auto bg-white border rounded-2xl shadow-soft p-2 z-20"><div className="grid grid-cols-1 gap-1">{options.map(c => (<label key={c.code} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50"><input type="checkbox" checked={value.includes(c.code)} onChange={()=>toggle(c.code)} /><span className="text-sm">{c.flag} {c.name}</span></label>))}</div>{value.length>0 && <button onClick={()=>onChange([])} className="mt-2 text-sm underline">Nullstill</button>}</div></details></div>)
}
