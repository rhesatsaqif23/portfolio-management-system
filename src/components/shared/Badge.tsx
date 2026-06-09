import { cn } from '#/lib/utils'

type BadgeProps = {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variant === 'default' && 'bg-[var(--sea-ink)] text-white',
        variant === 'secondary' && 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
        variant === 'outline' && 'border border-[var(--line)] text-[var(--sea-ink-soft)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
