import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Label } from '#/components/ui/label'

type SelectFieldProps = {
  name: string
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

export default function SelectField({ name, label, value, onChange, error, options, placeholder, required }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      {label && <Label htmlFor={name}>{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>}
      <Select value={value} onValueChange={(v) => onChange?.(v)}>
        <SelectTrigger className="w-full" data-error={error ? 'true' : undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
