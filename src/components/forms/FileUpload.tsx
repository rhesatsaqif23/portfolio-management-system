import { useState, useRef } from 'react'
import { Button } from '#/components/ui/button'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

type FileUploadProps = {
  accept?: string
  value: string
  onChange: (url: string) => void
  label: string
  maxSizeMB?: number
  bucket?: string
  folder?: string
}

export function FileUpload({ accept = '.pdf', value, onChange, label, maxSizeMB = 10 }: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB limit`)
      return
    }

    setUploading(true)
    try {
      const buffer = await file.arrayBuffer()
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const { uploadFile: upload } = await import('#/apis')
      const result = await upload({ data: { bucket: 'cvs', path: `profiles/${Date.now()}-${safeName}`, file: buffer } })
      onChange(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (ref.current) ref.current.value = ''
    }
  }

  function remove() {
    onChange('')
  }

  const fileName = value ? value.split('/').pop() : null

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {value ? (
        <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <FileText className="size-4 shrink-0 text-primary" />
          <span className="flex-1 truncate">{fileName}</span>
          <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary underline underline-offset-2">View</a>
          <button type="button" onClick={remove} className="shrink-0 text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => ref.current?.click()}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? 'Uploading...' : 'Choose PDF'}
          </Button>
        </div>
      )}
      <input ref={ref} type="file" accept={accept} onChange={handleFile} className="hidden" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}