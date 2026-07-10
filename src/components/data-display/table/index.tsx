'use client'

import type { SortingState } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import isEmpty from 'lodash/isEmpty'

import type { TableColumnDef } from './table-component'
import type { FilterType, Options } from './type'
import type { TableSearchParamsOptions } from './use-table-search-params'

import { FilterBarComp } from '../filter-bar'
import { ExternalTable } from './external-table'
import { QueryTable } from './query-table'
import { useTableSearchParams } from './use-table-search-params'

export type { TableColumnAlign, TableColumnDef } from './table-component'
export { TableFilter } from './table-filter'
export type {
  TableFilterActiveChip,
  TableFilterField,
  TableFilterInputType,
  TableFilterProps,
} from './table-filter'

export type TableProps<TData> = Readonly<{
  additionalComp?: ReactNode
  className?: string
  columns: TableColumnDef<TData>[]
  dataSource?: TData[]
  emptyState?: ReactNode
  enableMultiSort?: boolean
  filterOptions?: {
    desc?: string
    disabled?: boolean
    icon?: React.ComponentType
    name: string
    options?: Options[]
    placeholder?: string
    shouldTranslate?: boolean
    suffix?: string
    type?: FilterType
    values?: number[]
  }[]
  headerVariant?: 'muted' | 'primary'
  height?: number
  initialQuery?: {
    filters?: Record<string, number[] | string | string[]>
    sortings?: SortingState
  }
  isFetching?: boolean
  isLoading?: boolean
  isManualPagination?: boolean
  isShowPagination?: boolean
  onPaginationChange?: (pagination: { limit: number; page: number }) => void
  onRowClick?: (row: TData) => void
  onSortingChange?: (sorting: SortingState) => void
  pageSizeOptions?: number[]
  pagination?: {
    limit?: number
    page?: number
    total: number
    totalUnfiltered?: number
  }
  path?: string
  searchParams?: TableSearchParamsOptions
  shouldTranslateHeaders?: boolean
  showRowNumber?: boolean
  sorting?: SortingState
  wrapperClassName?: string
}>

export function Table<TData>({
  additionalComp,
  className,
  columns,
  dataSource,
  emptyState,
  enableMultiSort,
  filterOptions,
  headerVariant,
  height,
  initialQuery,
  isFetching = false,
  isLoading = false,
  isManualPagination,
  isShowPagination = false,
  onPaginationChange,
  onRowClick,
  onSortingChange,
  pageSizeOptions,
  pagination,
  path,
  searchParams,
  shouldTranslateHeaders,
  showRowNumber,
  sorting,
  wrapperClassName,
}: TableProps<TData>) {
  const tableSearchParams = useTableSearchParams(searchParams)
  const shouldUseSearchParams = Boolean(searchParams)
  const tablePagination = shouldUseSearchParams
    ? {
        ...tableSearchParams.pagination,
        total: pagination?.total ?? dataSource?.length ?? 0,
        totalUnfiltered: pagination?.totalUnfiltered,
      }
    : pagination
  const tableSorting =
    sorting ?? (shouldUseSearchParams ? tableSearchParams.sorting : undefined)
  const handleTablePaginationChange =
    onPaginationChange ??
    (shouldUseSearchParams ? tableSearchParams.onPaginationChange : undefined)
  const handleTableSortingChange =
    onSortingChange ??
    (shouldUseSearchParams ? tableSearchParams.onSortingChange : undefined)

  if (!dataSource && !path) throw new Error('Please provide data or path')

  return (
    <div className="flex flex-col gap-4">
      {!isEmpty(filterOptions) && (
        <FilterBarComp initialQuery={initialQuery} options={filterOptions} />
      )}

      {!!additionalComp && additionalComp}

      {dataSource ? (
        <ExternalTable
          className={className}
          columns={columns}
          dataSource={dataSource}
          emptyState={emptyState}
          enableMultiSort={enableMultiSort}
          headerVariant={headerVariant}
          height={height}
          isFetching={isFetching}
          isLoading={isLoading}
          isManualPagination={isManualPagination}
          isShowPagination={isShowPagination}
          onPaginationChange={handleTablePaginationChange}
          onRowClick={onRowClick}
          onSortingChange={handleTableSortingChange}
          pageSizeOptions={pageSizeOptions}
          pagination={tablePagination}
          shouldTranslateHeaders={shouldTranslateHeaders}
          showRowNumber={showRowNumber}
          sorting={tableSorting}
          wrapperClassName={wrapperClassName}
        />
      ) : (
        <QueryTable
          columns={columns}
          height={height}
          initialQuery={initialQuery}
          onRowClick={onRowClick}
          path={path}
        />
      )}
    </div>
  )
}
