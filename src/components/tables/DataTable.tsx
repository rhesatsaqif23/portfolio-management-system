import { cn } from '#/lib/utils'
import { Skeleton } from '#/components/ui/skeleton'
import { Fragment } from 'react'
import Pagination from './Pagination'

type Column<T> = {
  key: keyof T
  header: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

function SkeletonTable({ columns }: { columns: Column<Record<string, unknown>>[] }) {
  return (
    <Fragment>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-[var(--line)]">
          {columns.map((col, j) => (
            <td key={String(col.key)} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Skeleton className={cn("h-5", j === columns.length - 1 ? "w-16" : "w-full max-w-[140px]")} />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </Fragment>
  )
}

export default function DataTable<T extends Record<string, unknown>>({ columns, data, loading, onRowClick, page, totalPages, onPageChange }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--line)] bg-[var(--muted)]">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-semibold text-[var(--sea-ink)]">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonTable columns={columns as Column<Record<string, unknown>>[]} />
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-[var(--line)] transition hover:bg-[var(--link-bg-hover)]',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-[var(--sea-ink-soft)]">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {page !== undefined && totalPages !== undefined && onPageChange && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  )
}

export { SkeletonTable }
