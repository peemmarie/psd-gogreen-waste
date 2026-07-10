'use client'

import { type ReactNode, useMemo, useState } from 'react'

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

const chartConfig = {
  paramL1: {
    color: '#f97316', // Orange
    label: 'L1',
  },
  paramL2: {
    color: '#3b82f6', // Blue
    label: 'L2',
  },
  paramL3: {
    color: '#10b981', // Emerald / Green
    label: 'L3',
  },
  total: {
    color: '#64748b', // Slate / Neutral
    label: 'Total',
  },
} satisfies ChartConfig

// Voltage reference boundaries from MEA standard drawing no. 008.
const VOLTAGE_NOMINAL = 230
const VOLTAGE_UPPER = 237
const VOLTAGE_LOWER = 214
const VOLTAGE_YAXIS_MARGIN = 20 // extra headroom beyond the boundaries

type ChartEvent = { activeLabel?: number | string }

type HistoricalChartViewProps = Readonly<{
  brushState: { end: number | string; start: number | string } | null
  data: Record<string, unknown>[]
  dataUpdatedAt: number
  isLoading: boolean
  onMouseDown: (e: ChartEvent) => void
  onMouseMove: (e: ChartEvent) => void
  onMouseUp: () => void
}>

export function HistoricalChartView({
  brushState,
  data,
  dataUpdatedAt,
  isLoading,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: HistoricalChartViewProps) {
  const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({})
  const chartData = useMemo(
    () =>
      data.map((row) => ({
        ...row,
        timestamp: row.timestamp ?? row.time,
      })),
    [data]
  )

  function toggleLine(key: string) {
    setHiddenLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const sharedChartProps = {
    data: chartData,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    style: { cursor: 'crosshair', userSelect: 'none' as const },
    syncId: 'history',
  }

  const sharedXAxisProps = {
    allowDuplicatedCategory: false,
    dataKey: 'timestamp',
    minTickGap: 32,
    tickFormatter: formatAxisTime,
    tickLine: false,
    tickMargin: 8,
  }

  const sharedTooltip: ReactNode = (
    <ChartTooltip
      content={
        <ChartTooltipContent
          indicator="dot"
          labelFormatter={(_, payload) =>
            formatAxisTime(payload?.[0]?.payload.timestamp as number | string)
          }
        />
      }
      cursor={{ stroke: 'var(--border)' }}
    />
  )

  const showBrushArea = brushState && brushState.start !== brushState.end
  const brushReferenceArea = showBrushArea ? (
    <ReferenceArea
      fill="var(--primary)"
      fillOpacity={0.15}
      stroke="var(--primary)"
      strokeOpacity={0.4}
      x1={brushState.start}
      x2={brushState.end}
    />
  ) : null

  if (isLoading) return <HistoricalChartSkeleton />

  return (
    <>
      <p className="text-muted-foreground text-xs">
        ใช้เมาส์คลิกค้างแล้วลากบนกราฟเพื่อซูมช่วงเวลา
        และคลิกชื่อเฟสเพื่อเปิด-ปิดเส้นกราฟ
      </p>

      {/* GLOBAL LEGEND */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 pb-2 text-xs">
        {Object.entries(chartConfig).map(([key, config]) => (
          <button
            className={cn(
              'flex cursor-pointer items-center gap-2 transition-opacity',
              hiddenLines[key]
                ? 'text-muted-foreground line-through opacity-50'
                : 'text-foreground hover:opacity-80'
            )}
            key={key}
            onClick={() => toggleLine(key)}
            type="button"
          >
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: config.color }}
            />
            {config.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* CURRENT CHART */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Current (A)</h4>
          <ChartContainer
            className="aspect-auto h-50 w-full"
            config={chartConfig}
          >
            <LineChart key={dataUpdatedAt} {...sharedChartProps}>
              <CartesianGrid vertical={false} />
              <XAxis {...sharedXAxisProps} />
              <YAxis
                axisLine={false}
                domain={[0, 4]}
                tickLine={false}
                width={40}
              />
              {sharedTooltip}
              <Line
                dataKey="phaseA.current"
                dot={false}
                hide={hiddenLines.paramL1}
                name="paramL1"
                stroke="var(--color-paramL1)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="phaseB.current"
                dot={false}
                hide={hiddenLines.paramL2}
                name="paramL2"
                stroke="var(--color-paramL2)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="phaseC.current"
                dot={false}
                hide={hiddenLines.paramL3}
                name="paramL3"
                stroke="var(--color-paramL3)"
                strokeWidth={2}
                type="linear"
              />
              {brushReferenceArea}
            </LineChart>
          </ChartContainer>
        </div>

        {/* VOLTAGE CHART */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold">Voltage (V)</h4>
            <p className="text-muted-foreground text-xs">
              กรอบแรงดันอ้างอิง: MEA Drawing No. 008
            </p>
          </div>
          <ChartContainer
            className="aspect-auto h-50 w-full"
            config={chartConfig}
          >
            <LineChart key={dataUpdatedAt} {...sharedChartProps}>
              <CartesianGrid vertical={false} />
              <XAxis {...sharedXAxisProps} />
              <YAxis
                axisLine={false}
                domain={[
                  (dataMin: number) =>
                    Math.min(dataMin, VOLTAGE_NOMINAL - VOLTAGE_YAXIS_MARGIN),
                  (dataMax: number) =>
                    Math.max(dataMax, VOLTAGE_NOMINAL + VOLTAGE_YAXIS_MARGIN),
                ]}
                tickLine={false}
                width={40}
              />
              {sharedTooltip}
              <ReferenceLine
                label={{
                  fill: '#7cb9e8',
                  fontSize: 10,
                  fontWeight: 600,
                  position: 'insideTopRight',
                  value: `${VOLTAGE_NOMINAL}V`,
                }}
                stroke="#7cb9e8"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                y={VOLTAGE_NOMINAL}
              />
              <ReferenceLine
                label={{
                  fill: 'var(--color-destructive)',
                  fontSize: 10,
                  position: 'insideTopRight',
                  value: `${VOLTAGE_UPPER}V`,
                }}
                stroke="var(--color-destructive)"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                y={VOLTAGE_UPPER}
              />
              <ReferenceLine
                label={{
                  fill: 'var(--color-destructive)',
                  fontSize: 10,
                  position: 'insideBottomRight',
                  value: `${VOLTAGE_LOWER}V`,
                }}
                stroke="var(--color-destructive)"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                y={VOLTAGE_LOWER}
              />
              <Line
                dataKey="phaseA.voltage"
                dot={false}
                hide={hiddenLines.paramL1}
                name="paramL1"
                stroke="var(--color-paramL1)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="phaseB.voltage"
                dot={false}
                hide={hiddenLines.paramL2}
                name="paramL2"
                stroke="var(--color-paramL2)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="phaseC.voltage"
                dot={false}
                hide={hiddenLines.paramL3}
                name="paramL3"
                stroke="var(--color-paramL3)"
                strokeWidth={2}
                type="linear"
              />
              {brushReferenceArea}
            </LineChart>
          </ChartContainer>
        </div>

        {/* ACTIVE POWER CHART */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Active Power (kW)</h4>
          <ChartContainer
            className="aspect-auto h-50 w-full"
            config={chartConfig}
          >
            <LineChart key={dataUpdatedAt} {...sharedChartProps}>
              <CartesianGrid vertical={false} />
              <XAxis {...sharedXAxisProps} />
              <YAxis
                axisLine={false}
                domain={[0, 4]}
                tickLine={false}
                width={40}
              />
              {sharedTooltip}
              <Line
                dataKey="phaseA.power"
                dot={false}
                hide={hiddenLines.paramL1}
                name="paramL1"
                stroke="var(--color-paramL1)"
                strokeWidth={2}
                type="basis"
              />
              <Line
                dataKey="phaseB.power"
                dot={false}
                hide={hiddenLines.paramL2}
                name="paramL2"
                stroke="var(--color-paramL2)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="phaseC.power"
                dot={false}
                hide={hiddenLines.paramL3}
                name="paramL3"
                stroke="var(--color-paramL3)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="totalPower"
                dot={false}
                hide={hiddenLines.total}
                name="total"
                stroke="var(--color-total)"
                strokeDasharray="5 5"
                strokeWidth={3}
                type="linear"
              />
              {brushReferenceArea}
            </LineChart>
          </ChartContainer>
        </div>

        {/* REACTIVE POWER CHART */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Reactive Power (kVAR)</h4>
          <ChartContainer
            className="aspect-auto h-50 w-full"
            config={chartConfig}
          >
            <LineChart key={dataUpdatedAt} {...sharedChartProps}>
              <CartesianGrid vertical={false} />
              <XAxis {...sharedXAxisProps} />
              <YAxis
                axisLine={false}
                domain={[0, 4]}
                tickLine={false}
                width={40}
              />
              {sharedTooltip}
              <Line
                dataKey="phaseA.reactive"
                dot={false}
                hide={hiddenLines.paramL1}
                name="paramL1"
                stroke="var(--color-paramL1)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="phaseB.reactive"
                dot={false}
                hide={hiddenLines.paramL2}
                name="paramL2"
                stroke="var(--color-paramL2)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="phaseC.reactive"
                dot={false}
                hide={hiddenLines.paramL3}
                name="paramL3"
                stroke="var(--color-paramL3)"
                strokeWidth={2}
                type="linear"
              />
              <Line
                dataKey="totalReactive"
                dot={false}
                hide={hiddenLines.total}
                name="total"
                stroke="var(--color-total)"
                strokeDasharray="5 5"
                strokeWidth={3}
                type="linear"
              />
              {brushReferenceArea}
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </>
  )
}

function formatAxisTime(value: number | string) {
  const timestamp = Number(value)

  if (!Number.isFinite(timestamp)) return String(value)

  const date = new Date(timestamp)
  const timeStr = date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  })

  return `${date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Bangkok',
  })} ${timeStr}`
}

function HistoricalChartSkeleton() {
  return (
    <div aria-busy="true" className="space-y-8">
      <Skeleton className="h-4 w-56" />

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 pb-2">
        {Object.keys(chartConfig).map((key) => (
          <div className="flex items-center gap-2" key={key}>
            <Skeleton className="h-2 w-2 rounded-[2px]" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>

      {[
        'Current (A)',
        'Voltage (V)',
        'Active Power (kW)',
        'Reactive Power (kVAR)',
      ].map((label) => (
        <div className="space-y-2" key={label}>
          <Skeleton className="h-4 w-36" />
          <SkeletonLineChart />
        </div>
      ))}
    </div>
  )
}

function SkeletonLineChart() {
  return (
    <div className="border-border/60 relative h-50 overflow-hidden rounded-md border">
      <div className="absolute inset-x-10 inset-y-5 flex flex-col justify-between">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-px w-full rounded-none" key={index} />
        ))}
      </div>

      <svg
        aria-hidden="true"
        className="text-muted-foreground/35 absolute inset-x-10 inset-y-5 h-[calc(100%-2.5rem)] w-[calc(100%-5rem)] animate-pulse"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M0 68 C8 56 14 60 22 45 S36 38 44 50 58 70 66 54 82 28 100 36"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        <path
          d="M0 48 C10 38 18 42 28 52 S46 72 58 58 72 30 84 40 94 55 100 46"
          fill="none"
          opacity="0.65"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M0 56 C12 64 20 54 30 44 S50 30 62 42 74 66 86 58 94 44 100 50"
          fill="none"
          opacity="0.45"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>

      <div className="absolute inset-x-10 bottom-4 flex justify-between">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-2 w-8" key={index} />
        ))}
      </div>
    </div>
  )
}
