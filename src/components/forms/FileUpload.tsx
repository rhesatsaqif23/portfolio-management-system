import { useState, useRef, useEffect } from 'react'
import { Button } from '#/components/ui/button'
import { Upload, FileText, X, Loader2, Image } from 'lucide-react'

type FileUploadProps = {
  accept?: string
  value: string
  onChange: (url: string) => void
  label: string
  maxSizeMB?: number
  bucket?: string
  getPath?: (file: File) => string
  deferUpload?: boolean
  pendingFile?: File | null
  onPendingFile?: (file: File | null) => void
}

const DEFAULT_CV_BUCKET = 'cv'
const DEFAULT_CV_PATH = 'CV_Rhesa_Tsaqif_Adyatma.pdf'

export function FileUpload({
  accept = '.pdf',
  value,
  onChange,
  label,
  maxSizeMB = 10,
  bucket = DEFAULT_CV_BUCKET,
  getPath,
  deferUpload = false,
  pendingFile,
  onPendingFile,
}: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (pendingFile) {
      const url = URL.createObjectURL(pendingFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [pendingFile])

  const displayUrl = previewUrl || value
  const isImage = displayUrl ? /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(displayUrl) : false

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB limit`)
      return
    }

    if (deferUpload) {
      onPendingFile?.(file)
      if (ref.current) ref.current.value = ''
      return
    }

    setUploading(true)
    try {
      const buffer = await file.arrayBuffer()
      const bytes = Array.from(new Uint8Array(buffer))
      const path = getPath ? getPath(file) : DEFAULT_CV_PATH
      const { replaceFile: upload } = await import('#/apis')
      const result = await upload({
        data: {
          bucket,
          path,
          oldPath: value ? value.split('/').pop() : undefined,
          file: bytes,
        },
      })
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
    onPendingFile?.(null)
  }

  const fileName = value ? value.split('/').pop() : (pendingFile ? pendingFile.name : null)

  return (
    <div className="w-full min-w-0 space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {(displayUrl && !pendingFile) || previewUrl ? (
        <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md border bg-muted/30 px-3 py-2 text-sm">
          {isImage ? (
            <Image className="size-4 shrink-0 text-primary" />
          ) : (
            <FileText className="size-4 shrink-0 text-primary" />
          )}
          <span className="flex-1 truncate min-w-0">{fileName}</span>
          {!previewUrl && value && (
            <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary underline underline-offset-2 shrink-0">View</a>
          )}
          {previewUrl && <span className="text-xs text-muted-foreground shrink-0">(pending)</span>}
          <button type="button" onClick={remove} className="shrink-0 text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
        </div>
      ) : (
        <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden">
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => ref.current?.click()}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? 'Uploading...' : `Choose ${accept === 'image/*' || accept.startsWith('image/') ? 'Image' : 'File'}`}
          </Button>
        </div>
      )}
      <input ref={ref} type="file" accept={accept} onChange={handleFile} className="hidden" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
