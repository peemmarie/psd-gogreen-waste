'use client'

import { useState } from 'react'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function TanstackProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            retry: (failureCount, error) => checkError(failureCount, error),
          },
          queries: {
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => checkError(failureCount, error),
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV !== 'production' && (
        <>
          <TanStackDevtools />
          <ReactQueryDevtools />
        </>
      )}
      {children}
    </QueryClientProvider>
  )
}

function checkError(count: number, error: Error) {
  if (error instanceof Error && error.name === 'NetworkError') return count < 1
  return false
}
