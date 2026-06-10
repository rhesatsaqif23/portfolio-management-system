import { Textarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'

type TextAreaFieldProps = {
  name: string
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
  rows?: number
}

export default function TextAreaField({ name, label, value, onChange, error, placeholder, rows = 4 }: TextAreaFieldProps) {
  return (
    <div className="space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
