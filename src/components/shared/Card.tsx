import { cn } from '#/lib/utils'

type CardProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'island-shell rounded-2xl p-5 transition',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  )
}
