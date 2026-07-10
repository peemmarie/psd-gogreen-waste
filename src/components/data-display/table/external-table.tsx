import type { SortingState } from '@tanstack/react-table'

import { type ReactNode, useEffect } from 'react'

import type { TableColumnDef } from './table-component'

import { useTableStore } from '~/store/table-store'

import { TableComp } from './table-component'

type ExternalTableProps<T> = {
  className?: string
  columns: TableColumnDef<T>[]
  dataSource: T[]
  emptyState?: ReactNode
  enableMultiSort?: boolean
  headerVariant?: 'muted' | 'primary'
  height?: number
  isFetching?: boolean
  isLoading?: boolean
  isManualPagination?: boolean
  isShowPagination: boolean
  onPaginationChange?: (pagination: { limit: number; page: number }) => void
  onRowClick?: (row: T) => void
  onSortingChange?: (sorting: SortingState) => void
  pageSizeOptions?: number[]
  pagination?: {
    limit?: number
    page?: number
    total: number
    totalUnfiltered?: number
  }
  shouldTranslateHeaders?: boolean
  showRowNumber?: boolean
  sorting?: SortingState
  wrapperClassName?: string
}

export function ExternalTable<TData>({
  className,
  columns,
  dataSource,
  emptyState,
  enableMultiSort,
  headerVariant,
  height,
  isFetching = false,
  isLoading = false,
  isManualPagination = false,
  isShowPagination,
  onPaginationChange,
  onRowClick,
  onSortingChange,
  pageSizeOptions,
  pagination,
  shouldTranslateHeaders,
  showRowNumber,
  sorting,
  wrapperClassName,
}: ExternalTableProps<TData>) {
  const { pagination: storePagination, setPagination } = useTableStore()
  const isPaginationControlled = Boolean(pagination)

  useEffect(() => {
    if (isPaginationControlled) return
    setPagination({ limit: 10, page: 1 })
  }, [dataSource.length, isPaginationControlled, setPagination])

  const paginationProps = {
    limit: pagination?.limit ?? storePagination.limit,
    page: pagination?.page ?? storePagination.page,
    total: pagination?.total ?? dataSource.length,
    totalUnfiltered: pagination?.totalUnfiltered,
  }

  return (
    <TableComp
      className={className}
      columns={columns}
      dataSource={dataSource}
      emptyState={emptyState}
      enableMultiSort={enableMultiSort}
      headerVariant={headerVariant}
      height={height}
      isApi={isManualPagination}
      isFetching={isFetching}
      isLoading={isLoading}
      isShowPagination={isShowPagination}
      onPaginationChange={onPaginationChange}
      onRowClick={onRowClick}
      onSortingChange={onSortingChange}
      pageSizeOptions={pageSizeOptions}
      pagination={paginationProps}
      shouldTranslateHeaders={shouldTranslateHeaders}
      showRowNumber={showRowNumber}
      sorting={sorting}
      wrapperClassName={wrapperClassName}
    />
  )
}
