import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

let _queryClient: QueryClient | null = null

function getQueryClient() {
  if (!_queryClient) {
    _queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    })
  }
  return _queryClient
}

export function getContext() {
  return { queryClient: getQueryClient() }
}

export default function TanstackQueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>
}
