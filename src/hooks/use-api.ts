'use client'

import type { AxiosError } from 'axios'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { authClient } from '~/lib/auth/client'
import { clientFetch } from '~/lib/axios/client'

type ApiListResponse<T> = {
  data: T[]
  limit: number
  page: number
  total: number
  totalUnfiltered?: number
}

type UseFetchApiProps = {
  enabled?: boolean
  isKeepPreviousData?: boolean
  params?: Record<string, unknown>
  path: string
  staleTime?: number
}

const MINUTE = 60 * 1000 // 60,000 ms

export function useFetchApi<T>({
  enabled = true,
  params,
  path,
  staleTime = 0,
}: UseFetchApiProps) {
  const { status, token } = useToken()
  const isEnabled = enabled && status !== 'loading'

  return useQuery<unknown, AxiosError, T>({
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    queryFn: () => clientFetch(path, token, params),
    queryKey: ['fetch-api', path, params, token],
    staleTime: staleTime * MINUTE,
  })
}

export function useFetchApiList<T>({
  enabled = true,
  isKeepPreviousData = true,
  params,
  path,
  staleTime = 0,
}: UseFetchApiProps) {
  const { status, token } = useToken()
  const isEnabled = enabled && status !== 'loading'

  return useQuery<unknown, AxiosError, ApiListResponse<T>>({
    enabled: isEnabled,
    placeholderData: isKeepPreviousData ? keepPreviousData : undefined,
    queryFn: () => clientFetch(path, token, params),
    queryKey: ['fetch-api-list', path, params, token],
    staleTime: staleTime * MINUTE,
  })
}

function useToken() {
  const { data: session, isPending } = authClient.useSession()

  return {
    status: isPending
      ? 'loading'
      : session
        ? 'authenticated'
        : 'unauthenticated',
    token: session?.session?.token ?? '',
  }
}
