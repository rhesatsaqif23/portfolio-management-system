import { useMemo, useState } from 'react'

export function usePagination<T>(data: T[], pageSize: number = 10) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  const safePage = Math.min(page, totalPages)

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, safePage, pageSize])

  return {
    page: safePage,
    setPage: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    totalPages,
    pageSize,
    paginatedData,
  }
}
