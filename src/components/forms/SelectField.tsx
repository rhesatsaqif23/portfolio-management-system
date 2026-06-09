import { cn } from '#/lib/utils'

type SelectFieldProps = {
  name: string
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export default function SelectField({ name, label, value, onChange, error, options, placeholder }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={name} className="text-sm font-medium text-[var(--sea-ink)]">{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--sea-ink)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          error && 'border-red-500',
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
