import { cn } from '#/lib/utils'

type TextFieldProps = {
  name: string
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
}

export default function TextField({ name, label, value, onChange, error, placeholder }: TextFieldProps) {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={name} className="text-sm font-medium text-[var(--sea-ink)]">{label}</label>}
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--sea-ink)]',
          'placeholder:text-[var(--muted-foreground)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          error && 'border-red-500',
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
