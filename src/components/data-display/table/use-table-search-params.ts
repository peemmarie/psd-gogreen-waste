'use client'

import type { SortingState } from '@tanstack/react-table'

import { useMemo } from 'react'

import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

export type TableSearchParamsOptions = Readonly<{
  defaultLimit?: number
  defaultPage?: number
  defaultSortBy?: string
  defaultSortOrder?: 'asc' | 'desc'
}>

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT_ORDER = 'desc'

export function useTableSearchParams(options?: TableSearchParamsOptions) {
  const defaultLimit = options?.defaultLimit ?? DEFAULT_LIMIT
  const defaultPage = options?.defaultPage ?? DEFAULT_PAGE
  const defaultSortBy = options?.defaultSortBy ?? ''
  const defaultSortOrder = options?.defaultSortOrder ?? DEFAULT_SORT_ORDER

  const [{ limit, page, sortBy, sortOrder }, setParams] = useQueryStates({
    limit: parseAsInteger.withDefault(defaultLimit),
    page: parseAsInteger.withDefault(defaultPage),
    sortBy: parseAsString.withDefault(defaultSortBy),
    sortOrder: parseAsString.withDefault(defaultSortOrder),
  })

  const sorting = useMemo<SortingState>(
    () => (sortBy ? [{ desc: sortOrder !== 'asc', id: sortBy }] : []),
    [sortBy, sortOrder]
  )

  function handlePaginationChange(nextPagination: {
    limit: number
    page: number
  }) {
    void setParams(nextPagination)
  }

  function handleSortingChange(nextSorting: SortingState) {
    const [nextSort] = nextSorting
    if (!nextSort) return

    void setParams({
      page: DEFAULT_PAGE,
      sortBy: nextSort.id,
      sortOrder: nextSort.desc ? 'desc' : 'asc',
    })
  }

  return {
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    pagination: { limit, page },
    sorting,
  }
}
