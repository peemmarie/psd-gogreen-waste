import { useMemo, useState } from 'react'

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { cn } from '~/lib/utils'

const TABLE_PAGE_SIZE = 50

type HistoricalTableViewProps = {
  data: Record<string, unknown>[]
  nominals?: Nominals
}

type Nominals = {
  /** Per-phase rated current (A) */
  current?: number
  /** Per-phase rated active power (kW) */
  power?: number
  /** Per-phase rated reactive power (kVAR) */
  reactive?: number
  /** Total (3-phase) rated active power (kW) */
  totalPower?: number
  /** Total (3-phase) rated reactive power (kVAR) */
  totalReactive?: number
  /** Per-phase nominal voltage (V) */
  voltage?: number
}

export function HistoricalTableView({
  data,
  nominals,
}: HistoricalTableViewProps) {
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(data.length / TABLE_PAGE_SIZE))

  const pagedData = useMemo(
    () => data.slice(page * TABLE_PAGE_SIZE, (page + 1) * TABLE_PAGE_SIZE),
    [data, page]
  )

  return (
    <div className="space-y-3">
      <Table wrapperClassName="max-h-[700px]">
        <TableHeader className="bg-muted sticky top-0 z-[1]">
          <TableRow>
            <TableHead className="border-r align-bottom" rowSpan={2}>
              Time
            </TableHead>
            <TableHead className="border-r text-center" colSpan={3}>
              Current (A)
            </TableHead>
            <TableHead className="border-r text-center" colSpan={3}>
              Voltage (V)
            </TableHead>
            <TableHead className="border-r text-center" colSpan={4}>
              Active Power (kW)
            </TableHead>
            <TableHead className="text-center" colSpan={4}>
              Reactive Power (kVAR)
            </TableHead>
          </TableRow>
          <TableRow>
            {/* Current */}
            <TableHead className="text-center">L1</TableHead>
            <TableHead className="text-center">L2</TableHead>
            <TableHead className="border-r text-center">L3</TableHead>
            {/* Voltage */}
            <TableHead className="text-center">L1</TableHead>
            <TableHead className="text-center">L2</TableHead>
            <TableHead className="border-r text-center">L3</TableHead>
            {/* Active Power */}
            <TableHead className="text-center">L1</TableHead>
            <TableHead className="text-center">L2</TableHead>
            <TableHead className="text-center">L3</TableHead>
            <TableHead className="border-r text-center">Total</TableHead>
            {/* Reactive Power */}
            <TableHead className="text-center">L1</TableHead>
            <TableHead className="text-center">L2</TableHead>
            <TableHead className="text-center">L3</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedData.map((row) => {
            const r = row as Record<string, unknown>
            const pa = r.phaseA as Record<string, number> | undefined
            const pb = r.phaseB as Record<string, number> | undefined
            const pc = r.phaseC as Record<string, number> | undefined
            return (
              <TableRow key={r.time as string}>
                <TableCell className="border-r font-medium tabular-nums">
                  {r.time as string}
                </TableCell>
                {/* Current */}
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pa?.current)}
                </TableCell>
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pb?.current)}
                </TableCell>
                <TableCell className={cn('border-r text-right tabular-nums')}>
                  {fmt(pc?.current)}
                </TableCell>
                {/* Voltage */}
                <TableCell
                  className={cn(
                    'text-right tabular-nums',
                    outOfThreshold(pa?.voltage, nominals?.voltage) && ALERT_CLS
                  )}
                >
                  {fmt(pa?.voltage)}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right tabular-nums',
                    outOfThreshold(pb?.voltage, nominals?.voltage) && ALERT_CLS
                  )}
                >
                  {fmt(pb?.voltage)}
                </TableCell>
                <TableCell
                  className={cn(
                    'border-r text-right tabular-nums',
                    outOfThreshold(pc?.voltage, nominals?.voltage) && ALERT_CLS
                  )}
                >
                  {fmt(pc?.voltage)}
                </TableCell>
                {/* Active Power */}
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pa?.power)}
                </TableCell>
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pb?.power)}
                </TableCell>
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pc?.power)}
                </TableCell>
                <TableCell
                  className={cn(
                    'border-r text-right font-semibold tabular-nums'
                  )}
                >
                  {fmt(r.totalPower as number)}
                </TableCell>
                {/* Reactive Power */}
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pa?.reactive)}
                </TableCell>
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pb?.reactive)}
                </TableCell>
                <TableCell className={cn('text-right tabular-nums')}>
                  {fmt(pc?.reactive)}
                </TableCell>
                <TableCell
                  className={cn('text-right font-semibold tabular-nums')}
                >
                  {fmt(r.totalReactive as number)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Table pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-muted-foreground text-xs tabular-nums">
            Showing {page * TABLE_PAGE_SIZE + 1}–
            {Math.min((page + 1) * TABLE_PAGE_SIZE, data.length)} of{' '}
            {data.length} rows
          </span>
          <div className="flex items-center gap-1">
            <Button
              className="h-7 w-7"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              size="icon"
              variant="outline"
            >
              <IconChevronLeft className="size-3.5" />
            </Button>
            <span className="text-muted-foreground text-xs tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <Button
              className="h-7 w-7"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              size="icon"
              variant="outline"
            >
              <IconChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function fmt(v: number | undefined) {
  return v != null ? v.toFixed(2) : '—'
}

/** Tailwind classes applied to cells that exceed the ±10% threshold. */
const ALERT_CLS = 'text-destructive bg-destructive/10 font-medium'

/**
 * Returns true when `value` deviates more than 10% from `nominal`.
 * Returns false if either argument is null/undefined/zero.
 */
function outOfThreshold(
  value: null | number | undefined,
  nominal: null | number | undefined
): boolean {
  if (value == null || !nominal) return false
  return value < nominal * 0.9 || value > nominal * 1.1
}
