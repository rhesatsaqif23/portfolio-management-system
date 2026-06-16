import * as React from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from '#/components/ui/sonner';

export type GalleryItem = { url: string; caption: string }

type GalleryUploadProps = {
  items: GalleryItem[]
  onChange: (items: GalleryItem[]) => void
  maxItems?: number
  bucket?: string
  folder?: string
}

export function GalleryUpload({ items, onChange, maxItems = 10, bucket = 'case-study-images', folder }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return

    toast.info('Uploading image...')
    setIsUploading(true)
    try {
      let currentItems = [...items]
      for (const file of files) {
        const path = folder ? `${folder}/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}` : file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        try {
          const { uploadFile } = await import('#/apis')
          const formData = new FormData()
          formData.append('bucket', bucket)
          formData.append('path', path)
          formData.append('file', file)

          const result = await uploadFile({ data: formData })
          currentItems = [...currentItems, { url: result.url, caption: '' }]
        } catch (err) {
          console.error('Upload failed', err)
          toast.error(err instanceof Error ? err.message : String(err))
        }
      }
      onChange(currentItems)
      toast.success('Upload complete')
    } catch (err) {
      console.error('Upload failed', err)
      toast.error(err instanceof Error ? err.message : String(err))
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  function updateCaption(index: number, caption: string) {
    const newItems = [...items]
    newItems[index].caption = caption
    onChange(newItems)
  }

  async function remove(index: number) {
    const item = items[index]
    const pathParts = item.url.split('/')
    const storageIndex = pathParts.indexOf(bucket)
    const relativePath = storageIndex !== -1 ? pathParts.slice(storageIndex + 1).join('/') : item.url.split('/').pop()!
    if (relativePath) {
      try {
        const { deleteFile } = await import('#/apis')
        await deleteFile({ data: { bucket, path: relativePath } })
      } catch (err) {
        console.error('Delete failed', err)
      }
    }
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg border bg-card">
              <div className="aspect-video w-full bg-muted">
                <img src={item.url} alt="Gallery" className="h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <input
                  value={item.caption}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="Add caption..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-2 top-2 rounded-md bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-md transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {items.length < maxItems && (
        <label className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 transition-colors hover:border-primary/50 hover:bg-primary/5 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-6 w-6" />
            <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Add Image'}</span>
          </div>
          <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={isUploading} />
        </label>
      )}
    </div>
  )
}
