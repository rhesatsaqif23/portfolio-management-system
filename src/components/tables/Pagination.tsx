import { Button } from '#/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-[var(--line)] px-4 py-3">
      <p className="text-sm text-[var(--muted-foreground)]">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <Button
          size="xs"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            size="xs"
            variant={p === page ? 'default' : 'outline'}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          size="xs"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
