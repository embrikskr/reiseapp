'use client'
import { useMemo, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import RatingStars from '@/components/RatingStars'
import CountrySelect from '@/components/CountrySelect'
import { compressImageFile } from '@/lib/imageCompress'

type ImgItem = { file: File, alt: string }

export default function NewPostPage() {
  const supabase = createBrowserClient()
  const [country, setCountry] = useState('')
  const [title, setTitle] = useState(''); const [body, setBody] = useState('')
  const [rating, setRating] = useState(4)
  const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('')
  const [items, setItems] = useState<ImgItem[]>([])   // opptil 5
  const [coverIdx, setCoverIdx] = useState(0)
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null)

  const previews = useMemo(()=> items.map(i => URL.createObjectURL(i.file)), [items])

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files || []).map(f => ({ file: f, alt: '' }))
    const next = [...items, ...chosen].slice(0, 5)
    if (items.length + chosen.length > 5) setError('Maks 5 bilder per innlegg')
    setItems(next)
    e.currentTarget.value = ''
  }

  const removeAt = (i: number) => {
    const next = items.filter((_, idx) => idx !== i)
    setItems(next)
    if (coverIdx === i) setCoverIdx(0)
    else if (coverIdx > i) setCoverIdx(coverIdx - 1)
  }

  const move = (i: number, dir: -1|1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const copy = items.slice()
    const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp
    setItems(copy)
    if (coverIdx === i) setCoverIdx(j)
    else if (coverIdx === j) setCoverIdx(i)
  }

  const setAlt = (i:number, val:string) => {
    setItems(prev => prev.map((it, idx) => idx===i ? ({...it, alt: val}) : it))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); if (!country) return setError('Velg et land'); setLoading(true)
    const { data: { user } } = await supabase.auth.getUser(); if (!user) { setLoading(false); return setError('Du må være innlogget') }

    const { data: post, error: postErr } = await supabase
      .from('posts')
      .insert({ user_id: user.id, country_code: country, title: title || null, body: body || null, rating, trip_start_date: startDate || null, trip_end_date: endDate || null })
      .select()
      .single()

    if (postErr || !post) { setLoading(false); return setError(postErr?.message || 'Kunne ikke opprette innlegg') }

    if (items.length > 0) {
      const uploaded = []
      for (let idx = 0; idx < items.length; idx++) {
        const raw = items[idx].file
        const alt = items[idx].alt || null
        const file = await compressImageFile(raw, 1920, 0.82)
        const path = `${user.id}/${post.id}/${Date.now()}-${idx}-${file.name}`
        const up = await supabase.storage.from('post-images').upload(path, file, { cacheControl: '3600', upsert: false })
        if (!up.error && up.data) {
          const pub = supabase.storage.from('post-images').getPublicUrl(up.data.path)
          uploaded.push({ url: pub.data.publicUrl, order_index: idx, alt, is_cover: idx === coverIdx })
        }
      }
      if (uploaded.length) {
        await supabase.from('post_images').insert(uploaded)
      }
    }

    window.location.href = `/post/${post.id}`
  }

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold mb-1">Nytt Trip Recap</h1>
      <p className="text-slate-500 mb-4">Oppsummer reisen med rating, tekst og opptil 5 bilder. Velg et cover-bilde, endre rekkefølge og legg inn alt-tekst.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label>Land</label>
          <CountrySelect value={country} onChange={setCountry} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Startdato (valgfritt)</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
          </div>
          <div>
            <label>Sluttdato (valgfritt)</label>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
        </div>

        <div>
          <label>Overskrift (valgfritt)</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="F.eks. Første gang i Japan" />
        </div>

        <div>
          <label>Tekst (valgfritt)</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} placeholder="Hvordan var turen? Mat, folk, vibe…" />
        </div>

        <div>
          <label>Bilder (opptil 5)</label>
          <input type="file" multiple accept="image/*" onChange={onPick} />
          <p className="text-xs text-slate-500 mt-1">Store bilder komprimeres automatisk før opplasting.</p>

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {previews.map((src, i) => (
                <div key={i} className={"relative rounded-xl border p-2 " + (i===coverIdx ? "ring-2 ring-blue-400" : "")}>
                  <img src={src} alt={"preview "+(i+1)} className="w-full h-24 object-cover rounded-md" />
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <button type="button" className="btn" onClick={()=>setCoverIdx(i)}>{i===coverIdx ? "Cover ✓" : "Gjør til cover"}</button>
                    <div className="flex gap-1">
                      <button type="button" className="btn" onClick={()=>move(i,-1)}>←</button>
                      <button type="button" className="btn" onClick={()=>move(i,1)}>→</button>
                    </div>
                    <button type="button" className="btn" onClick={()=>removeAt(i)}>Slett</button>
                  </div>
                  <input className="mt-1" placeholder="Alt-tekst (valgfritt)" value={items[i].alt} onChange={e=>setAlt(i, e.target.value)} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label>Rating</label>
          <RatingStars value={rating} onChange={setRating} />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="btn btn-primary">{loading ? 'Publiserer…' : 'Publiser'}</button>
      </form>
    </div>
  )
}
