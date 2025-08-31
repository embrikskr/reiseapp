export async function compressImageFile(file: File, maxDim = 1920, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  if (file.size < 300 * 1024) return file
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = dataUrl
  })
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), 'image/jpeg', quality))
  const name = file.name.replace(/\.[^.]+$/, '') + '-compressed.jpg'
  return new File([blob], name, { type: 'image/jpeg' })
}
