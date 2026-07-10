'use client'

import type { Table } from '@tanstack/react-table'

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'

type PageIndicatorProps = Readonly<{
  currentPage: number
  ofLabel: string
  pageCount: number
  pageLabel: string
}>

type PaginationProps<T> = Readonly<{
  className?: string
  pageSizeOptions?: number[]
  table: Table<T>
  total: number
  totalUnfiltered?: number
}>

type RowsPerPageControlProps = Readonly<{
  onPageSizeChange: (pageSize: number) => void
  pageSize: number
  pageSizeOptions: number[]
  rowsPerPageLabel: string
}>

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50]

export function Pagination<T>({
  className,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  table,
  total,
  totalUnfiltered,
}: PaginationProps<T>) {
  const t = useTranslations('common.table.pagination')
  const pagination = table.getState().pagination
  const currentPage = pagination.pageIndex + 1
  const pageCount = table.getPageCount()

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8',
        className
      )}
    >
      <PaginationSummary
        itemsLabel={t('items')}
        total={total}
        totalUnfiltered={totalUnfiltered}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-8">
        <RowsPerPageControl
          onPageSizeChange={table.setPageSize}
          pageSize={pagination.pageSize}
          pageSizeOptions={pageSizeOptions}
          rowsPerPageLabel={t('rows_per_page')}
        />

        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <PageIndicator
            currentPage={currentPage}
            ofLabel={t('of')}
            pageCount={pageCount}
            pageLabel={t('page')}
          />
          <PaginationButtons table={table} />
        </div>
      </div>
    </div>
  )
}

function PageIndicator({
  currentPage,
  ofLabel,
  pageCount,
  pageLabel,
}: PageIndicatorProps) {
  return (
    <div className="text-muted-foreground flex w-fit items-center justify-center text-sm font-medium whitespace-nowrap tabular-nums">
      <span className="mr-1">{pageLabel}</span>
      <span className="text-foreground font-semibold">{currentPage}</span>
      <span className="mx-1">{ofLabel}</span>
      <span className="text-foreground font-semibold">{pageCount}</span>
    </div>
  )
}

function PaginationButtons<T>({ table }: Readonly<{ table: Table<T> }>) {
  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label="Go to first page"
        className="hidden size-8 p-0 lg:flex"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.setPageIndex(0)}
        variant="outline"
      >
        <span className="sr-only">Go to first page</span>
        <IconChevronsLeft className="size-4" />
      </Button>
      <Button
        aria-label="Go to previous page"
        className="size-8"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        size="icon"
        variant="outline"
      >
        <span className="sr-only">Go to previous page</span>
        <IconChevronLeft className="size-4" />
      </Button>
      <Button
        aria-label="Go to next page"
        className="size-8"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        size="icon"
        variant="outline"
      >
        <span className="sr-only">Go to next page</span>
        <IconChevronRight className="size-4" />
      </Button>
      <Button
        aria-label="Go to last page"
        className="hidden size-8 lg:flex"
        disabled={!table.getCanNextPage()}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        size="icon"
        variant="outline"
      >
        <span className="sr-only">Go to last page</span>
        <IconChevronsRight className="size-4" />
      </Button>
    </div>
  )
}

function PaginationSummary({
  itemsLabel,
  total,
  totalUnfiltered,
}: Readonly<{
  itemsLabel: string
  total: number
  totalUnfiltered?: number
}>) {
  return (
    <div className="text-muted-foreground text-sm whitespace-nowrap">
      <span className="text-foreground font-medium tabular-nums">
        {`${total.toLocaleString()} / ${(totalUnfiltered ?? total).toLocaleString()} ${itemsLabel}`}
      </span>
    </div>
  )
}

function RowsPerPageControl({
  onPageSizeChange,
  pageSize,
  pageSizeOptions,
  rowsPerPageLabel,
}: RowsPerPageControlProps) {
  return (
    <div className="flex items-center justify-between gap-3 sm:justify-start">
      <Label
        className="text-muted-foreground text-sm font-medium whitespace-nowrap"
        htmlFor="rows-per-page"
      >
        {rowsPerPageLabel}
      </Label>
      <Select
        onValueChange={(value) => onPageSizeChange(Number(value))}
        value={`${pageSize}`}
      >
        <SelectTrigger
          className="h-8 w-20 text-sm tabular-nums"
          id="rows-per-page"
        >
          <SelectValue placeholder={pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {pageSizeOptions.map((option) => (
            <SelectItem key={option} value={`${option}`}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
