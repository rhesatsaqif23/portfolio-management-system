import { cn } from '#/lib/utils'

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
      {label && <label htmlFor={name} className="text-sm font-medium text-[var(--sea-ink)]">{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'flex w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--sea-ink)]',
          'placeholder:text-[var(--muted-foreground)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          'field-sizing-content min-h-16',
          error && 'border-red-500',
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
