import { useState, useRef } from 'react'
import { Button } from '#/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'

export type GalleryItem = { url: string; caption: string }

type GalleryUploadProps = {
  items: GalleryItem[]
  onChange: (items: GalleryItem[]) => void
  maxItems?: number
  bucket?: string
}

export function GalleryUpload({ items, onChange, maxItems = 10, bucket = 'case-study-images' }: GalleryUploadProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      const newItems = [...items]
      for (const file of files) {
        if (newItems.length >= maxItems) break
        const buffer = await file.arrayBuffer()
        const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const { uploadFile } = await import('#/apis')
        const result = await uploadFile({ data: { bucket, path, file: buffer } })
        newItems.push({ url: result.url, caption: '' })
      }
      onChange(newItems)
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  async function removeItem(index: number) {
    const item = items[index]
    const path = item.url.split('/').pop()
    if (path) {
      try {
        const { deleteFile } = await import('#/apis')
        await deleteFile({ data: { bucket, path } })
      } catch {}
    }
    onChange(items.filter((_, i) => i !== index))
  }

  function updateCaption(index: number, caption: string) {
    const next = items.map((item, i) => (i === index ? { ...item, caption } : item))
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Screenshots ({items.length}/{maxItems})</label>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="group relative rounded-lg border bg-card overflow-hidden">
            <div className="flex items-center justify-center overflow-hidden bg-muted">
              <img src={item.url} alt={`Screenshot ${i + 1}`} className="h-auto w-full object-cover" />
            </div>
            <div className="flex gap-2 p-2">
              <input
                value={item.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                placeholder="Caption..."
                className="flex h-8 w-full rounded border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <button type="button" onClick={() => removeItem(i)} className="shrink-0 text-muted-foreground hover:text-destructive" title="Remove">
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length < maxItems && (
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => ref.current?.click()}>
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? 'Uploading...' : `Add Image${items.length === 0 ? '' : ` (${maxItems - items.length} left)`}`}
        </Button>
      )}

      <input ref={ref} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
    </div>
  )
}
