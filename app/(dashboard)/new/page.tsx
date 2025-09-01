'use client'
import { useMemo, useState } from 'react'
import { createBrowserClient } from '@/lib/supabaseBrowser'
import RatingStars from '@/components/RatingStars'
import CountrySelect from '@/components/CountrySelect'
import { compressImageFile } from '@/lib/imageCompress'

export default function NewPostPage() {
  const supabase = createBrowserClient()
  const [country, setCountry] = useState('')
  const [title, setTitle] = useState(''); const [body, setBody] = useState('')
  const [rating, setRating] = useState(4)
  const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('')
  const [files, setFiles] = useState<File[]>([])   // array, ikke FileList
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null)

  const previews = useMemo(()=> files.map(f => URL.createObjectURL(f)), [files])

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files || [])
    const next = [...files, ...chosen].slice(0, 5) // maks 5 totalt
    if (files.length + chosen.length > 5) setError('Maks 5 bilder per innlegg')
    setFiles(next)
    e.currentTarget.value = '' // reset så man kan velge samme fil igjen hvis man fjernet den
  }

  const removeAt = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i))
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

    if (files.length > 0) {
      const toUpload = files.slice(0, 5) // sikkerhet
      const uploadedUrls: string[] = []
      for (const raw of toUpload) {
        const file = await compressImageFile(raw, 1920, 0.82)
        const path = `${user.id}/${post.id}/${Date.now()}-${file.name}`
        const up = await supabase.storage.from('post-images').upload(path, file, { cacheControl: '3600', upsert: false })
        if (!up.error && up.data) {
          const pub = supabase.storage.from('post-images').getPublicUrl(up.data.path)
          uploadedUrls.push(pub.data.publicUrl)
        }
      }
      if (uploadedUrls.length) {
        const rows = uploadedUrls.map((url, idx) => ({ post_id: post.id, url, order_index: idx }))
        await supabase.from('post_images').insert(rows)
      }
    }

    window.location.href = `/post/${post.id}`
  }

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold mb-1">Nytt Trip Recap</h1>
      <p className="text-slate-500 mb-4">Oppsummer reisen med rating, tekst og opptil 5 bilder.</p>

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
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt={"preview "+(i+1)} className="w-full h-24 object-cover rounded-xl border" />
                  <button type="button" onClick={()=>removeAt(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs">x</button>
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
