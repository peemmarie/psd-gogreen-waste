'use client'

import type {
  ColumnDef,
  CoreHeader,
  PaginationState,
  SortingState,
  Updater,
} from '@tanstack/react-table'

import { type ReactNode, useMemo } from 'react'

import {
  IconChevronDown,
  IconChevronUp,
  IconDatabaseOff,
  IconSelector,
} from '@tabler/icons-react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { Skeleton } from '~/components/ui/skeleton'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableUI,
} from '~/components/ui/table'
import { useTableOpts } from '~/hooks/use-table-opts'
import { cn } from '~/lib/utils'
import { useTableStore } from '~/store/table-store'

import { Pagination } from './pagination'

const ALIGN = {
  center: 'justify-center text-center',
  left: 'justify-start text-start',
  right: 'justify-end text-end',
}

export type TableColumnAlign = keyof typeof ALIGN
export type TableColumnDef<TData> = ColumnDef<TData> &
  Readonly<{
    align?: TableColumnAlign
    sortable?: boolean
    sortKey?: string
    width?: number
  }>

type TableCompProps<TData> = Readonly<{
  className?: string
  columns: TableColumnDef<TData>[]
  dataSource: TData[]
  emptyState?: ReactNode
  enableMultiSort?: boolean
  headerVariant?: 'muted' | 'primary'
  height?: number
  isApi?: boolean
  isFetching?: boolean
  isLoading?: boolean
  isShowPagination?: boolean
  onPaginationChange?: (pagination: { limit: number; page: number }) => void
  onRowClick?: (row: TData) => void
  onSortingChange?: (sorting: SortingState) => void
  pageSizeOptions?: number[]
  pagination: {
    limit: number
    page: number
    total: number
    totalUnfiltered?: number
  }
  shouldTranslateHeaders?: boolean
  showRowNumber?: boolean
  sorting?: SortingState
  wrapperClassName?: string
}>

export function TableComp<TData>({
  className,
  columns,
  dataSource,
  emptyState,
  enableMultiSort = false,
  headerVariant = 'primary',
  height = 635,
  isApi = false,
  isFetching = false,
  isLoading,
  isShowPagination = false,
  onPaginationChange,
  onRowClick,
  onSortingChange,
  pageSizeOptions,
  pagination,
  shouldTranslateHeaders = true,
  showRowNumber = true,
  sorting,
  wrapperClassName,
}: TableCompProps<TData>) {
  const tTable = useTranslations('common.table')
  const t = useTranslations()

  const { sortings } = useTableStore()
  const {
    onPaginationChange: onStorePaginationChange,
    onSortChange: onStoreSortChange,
  } = useTableOpts(isApi)
  const tableSorting = sorting ?? sortings

  function handlePageChange(updater: Updater<PaginationState>) {
    const paginationState = getUpdater(updater, convertedPagination)

    const isChangeLimit =
      paginationState.pageSize !== convertedPagination.pageSize

    const page = isChangeLimit ? 1 : paginationState.pageIndex + 1

    const nextPagination = {
      limit: paginationState.pageSize,
      page,
    }

    if (onPaginationChange) {
      onPaginationChange(nextPagination)
      return
    }

    onStorePaginationChange(nextPagination)
  }

  function handleSortChange(updater: Updater<SortingState>) {
    const sortState = getUpdater(updater, tableSorting)

    if (onSortingChange) {
      onSortingChange(sortState)
      return
    }

    onStoreSortChange(sortState)
  }

  function renderSortingHeader(header: CoreHeader<TData, unknown>) {
    const sortKey = header.column?.getIsSorted()
    const canSort = header.column?.getCanSort()
    const SortIcon =
      sortKey === 'asc'
        ? IconChevronUp
        : sortKey === 'desc'
          ? IconChevronDown
          : IconSelector
    const isSorted = Boolean(sortKey)

    if (!canSort) return <></>

    return (
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
          headerVariant === 'primary'
            ? cn(
                'border-primary-foreground/20 text-primary-foreground/65',
                isSorted &&
                  'border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground'
              )
            : cn(
                'bg-background/70 text-muted-foreground/70 group-hover:border-border group-hover:text-foreground border-transparent',
                isSorted && 'border-primary/25 bg-primary/10 text-primary'
              )
        )}
      >
        <SortIcon className="size-3.5" stroke={1.8} />
      </span>
    )
  }

  function getSortableHeaderButtonClass(
    align: keyof typeof ALIGN,
    isSorted: boolean
  ) {
    return cn(
      'group -mx-1 flex h-8 w-[calc(100%+0.5rem)] cursor-pointer items-center gap-1.5 rounded-md px-2 text-inherit outline-none transition-colors',
      ALIGN[align],
      headerVariant === 'primary'
        ? 'hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground/35 active:bg-primary-foreground/15'
        : cn(
            'hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/35 active:bg-background/80',
            isSorted && 'text-foreground'
          )
    )
  }

  function getUpdater<T>(updater: Updater<T>, state: T) {
    return typeof updater === 'function'
      ? (updater as (old: T) => T)(state)
      : updater
  }

  function convertPagination(pagination: {
    limit: number
    page: number
    total: number
  }) {
    return {
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    }
  }

  const convertedPagination = convertPagination(pagination)
  const fallbackData = useMemo(() => [], [])

  const rowNumberColumn = useMemo(
    (): ColumnDef<TData> => ({
      cell: ({ row }) => {
        const rowNumber = isApi
          ? (pagination.page - 1) * pagination.limit + row.index + 1
          : row.index + 1

        return <span className="font-medium">{rowNumber}</span>
      },
      enableSorting: false,
      header: tTable('number'),
      id: 'rowNumber',
      meta: {
        align: 'right',
      },
      size: 50,
    }),
    [pagination.page, pagination.limit, tTable, isApi]
  )

  const finalColumns = useMemo(() => {
    // Translate column headers
    const translatedColumns: ColumnDef<TData>[] = columns.map((column) => {
      const normalizedColumn = normalizeTableColumn(column)

      if (
        !shouldTranslateHeaders ||
        typeof normalizedColumn.header !== 'string'
      )
        return normalizedColumn

      return {
        ...normalizedColumn,
        header: t(normalizedColumn.header),
      } as ColumnDef<TData>
    })

    if (!showRowNumber) return translatedColumns
    return [rowNumberColumn, ...translatedColumns]
  }, [showRowNumber, rowNumberColumn, columns, t, shouldTranslateHeaders])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<TData>({
    autoResetPageIndex: false,
    columns: finalColumns,
    data: dataSource ?? fallbackData,
    enableMultiSort,
    enableSorting: true,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(enableMultiSort && { isMultiSortEvent: () => true }),
    manualPagination: isApi, // Always use manual pagination to sync with store
    manualSorting: isApi,
    onPaginationChange: handlePageChange,
    onSortingChange: handleSortChange,
    pageCount: pagination.total
      ? Math.ceil(pagination.total / pagination.limit)
      : 1,
    rowCount: pagination.total ?? 0,
    state: {
      pagination: convertedPagination,
      sorting: tableSorting,
    },
  })

  const { getAllColumns, getHeaderGroups, getRowModel, getTotalSize } = table
  const tableMinWidth = getTotalSize()
  const skeletonRowCount = Math.max(1, convertedPagination.pageSize)
  const headerCellClass =
    headerVariant === 'primary'
      ? 'border-primary-foreground/20 bg-primary text-primary-foreground font-bold whitespace-nowrap'
      : 'bg-muted text-muted-foreground font-medium whitespace-nowrap'

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border',
          wrapperClassName
        )}
      >
        {/* Fetching overlay */}
        {isFetching && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="border-primary size-6 animate-spin rounded-full border-b-2"></div>
              <span className="text-muted-foreground text-sm">
                {dataSource?.length > 0
                  ? tTable('updating')
                  : tTable('loading')}
              </span>
            </div>
          </div>
        )}
        <div className="overflow-auto" style={{ height: `${height}px` }}>
          <TableUI
            className={className}
            style={{ minWidth: tableMinWidth }}
            wrapperClassName="overflow-visible"
          >
            <TableHeader className="bg-muted sticky top-0 z-10">
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const align = getColumnAlign(header.column.columnDef)
                    const alignmentClass = ALIGN[align]
                    const canSort = header.column.getCanSort()
                    const isSorted = Boolean(header.column.getIsSorted())
                    const isViewColumn = header.column.id === 'view'
                    const headerContent = flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )

                    return (
                      <TableHead
                        className={cn(
                          headerCellClass,
                          canSort && 'px-1',
                          isViewColumn &&
                            'sticky right-0 z-20 shadow-[-2px_0_4px_rgba(0,0,0,0.1)] backdrop-blur-sm'
                        )}
                        colSpan={header.colSpan}
                        key={header.id}
                        style={{ width: header.getSize() }}
                      >
                        {canSort ? (
                          <button
                            aria-label={header.column.id}
                            className={getSortableHeaderButtonClass(
                              align,
                              isSorted
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span className="leading-tight whitespace-nowrap">
                              {headerContent}
                            </span>
                            {renderSortingHeader(header)}
                          </button>
                        ) : (
                          <div
                            className={cn(
                              'flex w-full items-center justify-between',
                              alignmentClass
                            )}
                          >
                            {headerContent}
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {getRowModel().rows?.length ? (
                getRowModel().rows.map((row) => (
                  <TableRow
                    className={cn(
                      'bg-background even:bg-muted/40 data-[state=selected]:bg-muted-foreground/30 h-12',
                      onRowClick &&
                        'hover:bg-muted/50 cursor-pointer transition-colors'
                    )}
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const align = getColumnAlign(cell.column.columnDef)
                      const alignmentClass = ALIGN[align]
                      const isViewColumn = cell.column.id === 'view'

                      return (
                        <TableCell
                          className={cn(
                            alignmentClass,
                            'whitespace-nowrap',
                            isViewColumn &&
                              `sticky right-0 z-[9] shadow-[-2px_0_4px_rgba(0,0,0,0.1)] backdrop-blur-sm ${
                                row.index % 2 === 0
                                  ? 'bg-background/95'
                                  : 'bg-muted/95'
                              }`
                          )}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : isLoading ? (
                Array.from({ length: skeletonRowCount }).map((_, index) => (
                  <TableRow className="h-12" key={`skeleton-${index}`}>
                    {getAllColumns().map((column) => {
                      const isViewColumn = column.id === 'view'
                      return (
                        <TableCell
                          className={cn(
                            isViewColumn &&
                              'bg-background/95 sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.1)] backdrop-blur-sm'
                          )}
                          key={column.id}
                        >
                          <Skeleton className="h-5" />
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow style={{ height: `${height - 50 - 15}px` }}>
                  <TableCell
                    className="text-center"
                    colSpan={getAllColumns().length}
                  >
                    {emptyState ?? (
                      <div className="flex flex-col items-center justify-center gap-3 py-12">
                        <div className="bg-muted rounded-full p-4">
                          <IconDatabaseOff
                            className="text-muted-foreground"
                            size={48}
                            stroke={1.5}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-foreground text-base font-medium">
                            {tTable('no_data')}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {tTable('no_data_description')}
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableUI>
        </div>
      </div>

      {isShowPagination && (
        <Pagination
          pageSizeOptions={pageSizeOptions}
          table={table}
          total={pagination.total}
          totalUnfiltered={pagination.totalUnfiltered}
        />
      )}
    </div>
  )
}

function getColumnAlign<TData>(column: ColumnDef<TData, unknown>) {
  const tableColumn = column as TableColumnDef<TData>

  return tableColumn.align ?? tableColumn.meta?.align ?? 'left'
}

function normalizeTableColumn<TData>(column: TableColumnDef<TData>) {
  const { align, sortable, sortKey, width, ...columnDef } = column

  return {
    ...columnDef,
    ...(sortKey && { id: sortKey }),
    ...(typeof width === 'number' && { size: width }),
    ...(typeof sortable === 'boolean' && { enableSorting: sortable }),
    meta: {
      ...columnDef.meta,
      ...(align && { align }),
    },
  } as ColumnDef<TData>
}
