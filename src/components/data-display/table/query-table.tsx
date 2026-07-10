'use client'

import type { SortingState } from '@tanstack/react-table'

import { useEffect } from 'react'

import { isEmpty } from 'lodash'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import type { TableColumnDef } from './table-component'

import { useFetchApiList } from '~/hooks/use-api'
import { useTableStore } from '~/store/table-store'

import { TableComp } from './table-component'

type QueryTableProps<T> = {
  columns: TableColumnDef<T>[]
  height?: number
  initialQuery?: {
    filters?: Record<string, number[] | string | string[]>
    sortings?: SortingState
  }
  onRowClick?: (row: T) => void
  path?: string
  timeMinutes?: number
}

export function QueryTable<TData>({
  columns,
  height,
  initialQuery,
  onRowClick,
  path,
  timeMinutes = 5,
}: QueryTableProps<TData>) {
  if (!path) throw Error('Please provide path')

  const tSystem = useTranslations('common.system')
  const { filters, pagination, sortings } = useTableStore()

  const qsFilters = {
    ...(!isEmpty(initialQuery?.filters) && { ...initialQuery?.filters }),
    ...filters,
  }

  const qsSortings = {
    ...(!isEmpty(initialQuery?.sortings) && { ...initialQuery?.sortings }),
    ...sortings,
  }

  const {
    data: response,
    isError,
    isFetching,
    isLoading,
  } = useFetchApiList<TData>({
    params: {
      ...pagination,
      ...(!isEmpty(qsFilters) && { filters: qsFilters }),
      ...(!isEmpty(qsSortings) && { sortings: qsSortings }),
    },
    path,
    staleTime: timeMinutes,
  })

  const {
    data = [],
    limit = 10,
    page = 1,
    total = 0,
    totalUnfiltered,
  } = response ?? {}

  const paginationProps = {
    limit: Number(pagination.limit ?? limit),
    page: Number(pagination.page ?? page),
    total,
    totalUnfiltered,
  }

  useEffect(() => {
    if (isError) toast.error(tSystem('fetching_error'))
  }, [isError, tSystem])

  return (
    <TableComp
      columns={columns}
      dataSource={data}
      height={height}
      isApi
      isFetching={isFetching}
      isLoading={isLoading}
      isShowPagination
      onRowClick={onRowClick}
      pagination={paginationProps}
    />
  )
}
