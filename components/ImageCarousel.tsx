'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const touch = useRef<{x:number,y:number}|null>(null)

  const go = (i:number) => {
    const n = images.length
    if (n === 0) return
    const next = (i + n) % n
    setIdx(next)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(idx-1)
    if (e.key === 'ArrowRight') go(idx+1)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    if (Math.abs(dx) > 40) {
      if (dx < 0) go(idx+1); else go(idx-1)
    }
    touch.current = null
  }

  useEffect(() => {
    // reset to 0 if images change
    setIdx(0)
  }, [JSON.stringify(images)])

  if (!images?.length) return null

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] bg-slate-100 overflow-hidden rounded-2xl" tabIndex={0} onKeyDown={onKey} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Track */}
      <div ref={trackRef} className="absolute inset-0 flex transition-transform duration-300" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {images.map((src, i) => (
          <div key={i} className="relative flex-shrink-0 w-full h-full">
            <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 1000px" style={{objectFit:'cover'}} />
          </div>
        ))}
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button onClick={() => go(idx-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full px-2 py-1 text-sm">‹</button>
          <button onClick={() => go(idx+1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full px-2 py-1 text-sm">›</button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <span key={i} className={"h-1.5 w-4 rounded-full " + (i===idx ? "bg-white" : "bg-white/50")} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
