'use client'

import type { Transformer } from '~/types/transformer'

import { Table } from '~/components/data-display/table'
import { cn } from '~/lib/utils'

import {
  getTransformerTableColumns,
  PAGE_SIZE_OPTIONS,
} from './transformer-table.config'

type TransformerTableProps = Readonly<{
  isLoading?: boolean
  tableWrapperClassName?: string
  total: number
  totalUnfiltered?: number
  transformers: Transformer[]
}>

export function TransformerTable({
  isLoading = false,
  tableWrapperClassName,
  total,
  totalUnfiltered,
  transformers,
}: TransformerTableProps) {
  const columns = getTransformerTableColumns()

  return (
    <Table
      className="min-w-300 table-fixed"
      columns={columns}
      dataSource={transformers}
      emptyState={
        <span className="text-muted-foreground text-sm">
          ไม่พบข้อมูลหม้อแปลง
        </span>
      }
      headerVariant="muted"
      height={550}
      isLoading={isLoading}
      isManualPagination
      isShowPagination
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      pagination={{ total, totalUnfiltered }}
      searchParams={{
        defaultLimit: PAGE_SIZE_OPTIONS[0],
        defaultSortBy: 'installation_date',
        defaultSortOrder: 'desc',
      }}
      shouldTranslateHeaders={false}
      showRowNumber
      wrapperClassName={cn('rounded-md', tableWrapperClassName)}
    />
  )
}
