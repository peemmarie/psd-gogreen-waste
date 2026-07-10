'use client'

import { useCallback, useState } from 'react'

import {
  IconChartLine,
  IconDownload,
  IconFileSpreadsheet,
  IconMinus,
  IconPlus,
  IconTable,
  IconZoomReset,
} from '@tabler/icons-react'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

import { useChartZoom } from '../hooks/use-chart-zoom'
import { useHistoricalData } from '../hooks/use-historical-data'
import { downloadCsv, downloadXlsx } from '../lib/export-data'
import { HistoricalChartView } from './historical-chart-view'
import { HistoricalTableView } from './historical-table-view'

const TIME_RANGE_LABELS: Record<string, string> = {
  '24h': 'ตั้งแต่ 00:00 เมื่อวาน',
  '7d': '7 วันล่าสุด',
}

type HistoricalMeasurementsProps = Readonly<{
  nominals?: {
    current?: number
    power?: number
    reactive?: number
    totalPower?: number
    totalReactive?: number
    voltage?: number
  }
  transformerId: string
}>

export function HistoricalMeasurements({
  nominals,
  transformerId,
}: HistoricalMeasurementsProps) {
  const [timeRange, setTimeRange] = useState('24h')
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')

  const {
    data = [],
    dataUpdatedAt,
    intervalMs,
    isFetching,
    isLoading,
  } = useHistoricalData(transformerId, timeRange)
  const isRefreshing = isFetching && !isLoading

  const {
    brushState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleReset,
    handleZoomIn,
    handleZoomOut,
    isZoomed,
    totalPoints,
    visibleCount,
    visibleData,
  } = useChartZoom(data)

  const handleDownload = useCallback(
    (format: 'csv' | 'xlsx') => {
      const rangeLabel = isZoomed ? 'zoomed' : timeRange
      const filename = `historical-data_${transformerId}_${rangeLabel}`

      if (format === 'csv') return downloadCsv(visibleData, filename)
      return downloadXlsx(visibleData, filename)
    },
    [visibleData, isZoomed, timeRange, transformerId]
  )

  return (
    <Card className="@container/card relative">
      <CardHeader className="grid gap-4 border-b px-4 sm:px-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="grid gap-1">
          <CardTitle>Historical Measurements</CardTitle>
          <CardDescription className="max-w-2xl">
            แสดงแนวโน้มกระแสไฟฟ้า, แรงดันไฟฟ้า, กำลังไฟฟ้า และ
            กำลังไฟฟ้ารีแอคทีฟ (3 เฟส)
          </CardDescription>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span>รีเฟรชทุก {formatInterval(intervalMs)}</span>
            {dataUpdatedAt > 0 && (
              <span>อัปเดตล่าสุด {formatUpdatedAt(dataUpdatedAt)}</span>
            )}
            {isRefreshing && (
              <span className="text-primary font-medium">กำลังอัปเดต...</span>
            )}
          </div>
        </div>

        {/* View mode + Zoom controls */}
        <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row xl:items-center xl:justify-end">
          <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto xl:flex-nowrap xl:justify-end">
            {/* Chart / Table toggle */}
            <div className="flex items-center rounded-lg border">
              <Button
                className="h-8 w-8 rounded-r-none border-r"
                onClick={() => setViewMode('chart')}
                size="icon"
                title="Chart view"
                variant={viewMode === 'chart' ? 'secondary' : 'ghost'}
              >
                <IconChartLine className="size-3.5" />
              </Button>
              <Button
                className="h-8 w-8 rounded-l-none"
                onClick={() => setViewMode('table')}
                size="icon"
                title="Table view"
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              >
                <IconTable className="size-3.5" />
              </Button>
            </div>
            <div className="flex items-center rounded-lg border">
              <Button
                className="h-8 w-8 rounded-r-none border-r"
                disabled={!isZoomed}
                onClick={handleZoomOut}
                size="icon"
                title="Zoom out"
                variant="ghost"
              >
                <IconMinus className="size-3.5" />
              </Button>
              <Button
                className="h-8 w-8 rounded-none border-r"
                disabled={visibleCount <= 4}
                onClick={handleZoomIn}
                size="icon"
                title="Zoom in"
                variant="ghost"
              >
                <IconPlus className="size-3.5" />
              </Button>
              <Button
                className="h-8 w-8 rounded-l-none"
                disabled={!isZoomed}
                onClick={handleReset}
                size="icon"
                title="Reset zoom"
                variant="ghost"
              >
                <IconZoomReset className="size-3.5" />
              </Button>
            </div>

            {/* Download button */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    className="h-8 w-8"
                    disabled={data.length === 0}
                    size="icon"
                    title="Download data"
                    variant="outline"
                  />
                }
              >
                <IconDownload className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload('csv')}>
                  <IconDownload className="mr-2 size-4" />
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('xlsx')}>
                  <IconFileSpreadsheet className="mr-2 size-4" />
                  Download XLSX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-muted-foreground ml-auto text-xs whitespace-nowrap tabular-nums sm:ml-0">
              {visibleCount} / {totalPoints} pts
            </span>
          </div>

          <Select
            onValueChange={(value) => {
              if (value) {
                setTimeRange(value)
                handleReset()
              }
            }}
            value={timeRange}
          >
            <SelectTrigger
              aria-label="เลือกช่วงเวลา"
              className="w-full rounded-lg sm:w-64 xl:w-54"
            >
              <SelectValue placeholder={TIME_RANGE_LABELS['24h']}>
                {(value) =>
                  TIME_RANGE_LABELS[String(value)] ?? TIME_RANGE_LABELS['24h']
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem className="rounded-lg" value="24h">
                {TIME_RANGE_LABELS['24h']}
              </SelectItem>
              <SelectItem className="rounded-lg" value="7d">
                {TIME_RANGE_LABELS['7d']}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-2 pt-4 sm:px-6 sm:pt-6">
        {viewMode === 'chart' ? (
          <HistoricalChartView
            brushState={brushState}
            data={visibleData}
            dataUpdatedAt={dataUpdatedAt}
            isLoading={isLoading}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        ) : (
          <HistoricalTableView data={visibleData} nominals={nominals} />
        )}
      </CardContent>
    </Card>
  )
}

function formatInterval(intervalMs: number) {
  const minutes = Math.max(1, Math.round(intervalMs / 60_000))

  return minutes === 1 ? '1 นาที' : `${minutes} นาที`
}

function formatUpdatedAt(timestamp: number) {
  return new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(timestamp)
}
