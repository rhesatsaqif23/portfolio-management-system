import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

type TextFieldProps = {
  name: string
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
  type?: string
}

export default function TextField({ name, label, value, onChange, error, placeholder, type }: TextFieldProps) {
  return (
    <div className="space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
