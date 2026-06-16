import { Upload, X } from 'lucide-react'

export type GalleryItem = { url: string; caption: string }

type GalleryUploadProps = {
  items: GalleryItem[]
  onChange: (items: GalleryItem[]) => void
  maxItems?: number
  bucket?: string
  folder?: string
}

export function GalleryUpload({ items, onChange, maxItems = 10, bucket = 'case-study-images', folder }: GalleryUploadProps) {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return

    try {
      for (const file of files) {
        const buffer = await file.arrayBuffer()
        const bytes = Array.from(new Uint8Array(buffer))
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const path = folder ? `${folder}/${fileName}` : fileName
        const { uploadFile } = await import('#/apis')
        const result = await uploadFile({ data: { bucket, path, file: bytes } })
        onChange([...items, { url: result.url, caption: '' }])
      }
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      if (e.target) e.target.value = ''
    }
  }

  async function removeItem(index: number) {
    const item = items[index]
    const pathParts = item.url.split('/')
    const storageIndex = pathParts.indexOf(bucket)
    const relativePath = storageIndex !== -1 ? pathParts.slice(storageIndex + 1).join('/') : item.url.split('/').pop()!
    if (relativePath) {
      try {
        const { deleteFile } = await import('#/apis')
        await deleteFile({ data: { bucket, path: relativePath } })
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
            <div className="flex items-center gap-2 p-2">
              <input
                value={item.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                placeholder="Caption..."
                className="flex h-8 w-full min-w-0 rounded border border-input bg-background px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <button type="button" onClick={() => removeItem(i)} className="shrink-0 text-muted-foreground hover:text-destructive" title="Remove">
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length < maxItems && (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
          <Upload className="size-4" />
          Add Image ({maxItems - items.length} left)
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      )}
    </div>
  )
}
