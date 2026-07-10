'use client'

import { useQuery } from '@tanstack/react-query'

import { nextApi } from '~/lib/axios/next-api'

export function useHistoricalData(transformerId: string, timeRange: string) {
  const intervalMs = getHistoricalIntervalMs(transformerId, timeRange)

  const query = useQuery<Record<string, unknown>[]>({
    enabled: Boolean(transformerId),
    queryFn: ({ signal }) =>
      fetchHistoricalMeasurements(transformerId, timeRange, signal),
    queryKey: ['transformer-demand-history', transformerId, timeRange],
    refetchInterval: () => getMsUntilNextRefresh(intervalMs),
    refetchIntervalInBackground: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    structuralSharing: false,
  })

  return {
    data: query.data,
    dataUpdatedAt: query.dataUpdatedAt,
    intervalMs,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  }
}

async function fetchHistoricalMeasurements(
  transformerId: string,
  timeRange: string,
  signal?: AbortSignal
) {
  const url = `/transformers/${transformerId}/history`

  const intervalMs = getHistoricalIntervalMs(transformerId, timeRange)

  const _endDate = getCompletedBucketDate(Date.now(), intervalMs)

  const _startDate = new Date(_endDate)
  if (timeRange === '7d') _startDate.setDate(_startDate.getDate() - 7)
  else if (timeRange === '30d') _startDate.setDate(_startDate.getDate() - 30)
  else _startDate.setDate(_startDate.getDate() - 1)

  _startDate.setHours(0, 0, 0, 0)

  const points =
    Math.floor((_endDate.getTime() - _startDate.getTime()) / intervalMs) + 1

  return nextApi.post(
    url,
    {
      endDate: _endDate.getTime(),
      intervalMs,
      maxItems: points,
      startDate: _startDate.getTime(),
      timeRange,
    },
    {
      params: { _t: Date.now() },
      signal,
    }
  ) as unknown as Promise<Record<string, unknown>[]>
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function getCompletedBucketDate(now: number, intervalMs: number) {
  const date = new Date(now - intervalMs)
  const intervalMinutes = intervalMs / (60 * 1000)
  const minutes = date.getMinutes()

  date.setMinutes(minutes - (minutes % intervalMinutes), 0, 0)

  return date
}

function getHistoricalIntervalMs(transformerId: string, timeRange: string) {
  const FIFTEEN_MINUTES = 15 * 60 * 1000

  if (!isMinuteBasedTransformer(transformerId)) return FIFTEEN_MINUTES
  if (timeRange === '24h') return 60 * 1000

  return FIFTEEN_MINUTES
}

function getMsUntilNextRefresh(intervalMs: number) {
  const REFRESH_DELAY_MS = 5_000
  const now = Date.now()
  const nextBoundary = Math.ceil(now / intervalMs) * intervalMs

  return Math.max(1_000, nextBoundary - now + REFRESH_DELAY_MS)
}

function isMinuteBasedTransformer(id: string): boolean {
  return /^(WL|BR|SD)/.test(id)
}
