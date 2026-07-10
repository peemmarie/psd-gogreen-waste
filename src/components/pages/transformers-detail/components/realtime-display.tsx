'use client'

import { useEffect, useState } from 'react'

import {
  IconActivity,
  IconArrowDown,
  IconArrowUp,
  IconBolt,
  IconGauge,
  IconRefresh,
  IconRotateClockwise2,
  IconTimelineEvent,
  IconWifi,
  IconWifiOff,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { PowerQuadrant, TransformerReading } from '~/types/transformer'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { PercentBar } from '~/components/ui/percent-bar'
import { Separator } from '~/components/ui/separator'
import { nextApi } from '~/lib/axios/next-api'

const QUADRANT_STYLES: Record<PowerQuadrant, string> = {
  Q1: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
  Q2: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
  Q3: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  Q4: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
}

const QUADRANT_DESC: Record<PowerQuadrant, string> = {
  Q1: 'Import · Inductive',
  Q2: 'Export · Inductive',
  Q3: 'Export · Capacitive',
  Q4: 'Import · Capacitive',
}

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000
const ONE_MINUTE_MS = 60 * 1000
const REALTIME_REFRESH_DELAY_MS = 5_000
const RELATIVE_TIME_TICK_MS = 30 * 1000

type PfSummaryProps = Readonly<{
  /** Power factor value */
  value: number
}>

type PhaseMetricRowProps = Readonly<{
  activePower: number
  colorClassName: string
  current: number
  label: string
  powerFactor: number
  reactivePower: number
  voltage: number
}>

type PhaseMetricValueProps = Readonly<{
  label: string
  value: number | string
}>

type PowerFlowRowProps = Readonly<{
  /** True when active power is flowing into the load (P ≥ 0) */
  isImport: boolean
  /** True when reactive power is inductive (Q ≥ 0) */
  isInductive: boolean
  /** IEC quadrant label */
  quadrant: PowerQuadrant
}>

type PowerMetricProps = Readonly<{
  /** Metric label */
  label: string
  /** Engineering unit */
  unit: string
  /** Numeric value */
  value: number
}>

type RealtimeDisplayProps = Readonly<{
  /** Transformer rated capacity (kVA) — used for utility factor */
  capacity: number
  /** Transformer device ID */
  transformerId: string
}>

type RealtimeStatusBarProps = Readonly<{
  isConnected: boolean
  isRefreshing: boolean
  lastCheckedAt: number
  latestDataTimestamp: Date | null
  now: number
  refreshIntervalMs: number
}>

export function RealtimeDisplay({
  capacity,
  transformerId,
}: RealtimeDisplayProps) {
  const refreshIntervalMs = getRealtimeIntervalMs(transformerId)
  const [now, setNow] = useState(() => Date.now())

  const {
    data: reading,
    dataUpdatedAt,
    isLoading,
    isRefetching: isRefreshing,
    refetch,
  } = useQuery({
    enabled: Boolean(transformerId),
    queryFn: ({ signal }) => fetchRealtimeData(transformerId, signal),
    queryKey: [
      'transformer-reading',
      'realtime',
      transformerId,
      refreshIntervalMs,
    ],
    refetchInterval: () => getMsUntilNextRealtimeRefresh(refreshIntervalMs),
    refetchIntervalInBackground: true,
    refetchOnMount: 'always',
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    structuralSharing: false,
  })

  const isConnected = reading?.isOnline ?? false
  const latestDataTimestamp = reading?.latestDataTimestamp
    ? new Date(reading.latestDataTimestamp)
    : null

  async function handleRefresh() {
    const result = await refetch()

    if (result.isSuccess) {
      toast.success('ดึงข้อมูลสำเร็จ', {
        description: 'อัปเดตข้อมูลเรียลไทม์ล่าสุดแล้ว',
      })
      return
    }

    toast.error('ไม่สามารถดึงข้อมูลได้', {
      description: 'โปรดลองใหม่อีกครั้ง',
    })
  }

  function formatTime(date: Date) {
    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  useEffect(() => {
    const interval = globalThis.setInterval(
      () => setNow(Date.now()),
      RELATIVE_TIME_TICK_MS
    )

    return () => globalThis.clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-50 items-center justify-center px-4 sm:px-6">
          <span className="text-muted-foreground text-sm">
            กำลังโหลดข้อมูลเรียลไทม์...
          </span>
        </CardContent>
      </Card>
    )
  }

  if (!reading) return null

  const phaseMetrics: PhaseMetricRowProps[] = [
    {
      activePower: reading.phaseA.activePower,
      colorClassName: 'bg-orange-500',
      current: reading.phaseA.current,
      label: 'L1',
      powerFactor: reading.phaseA.powerFactor ?? 0,
      reactivePower: reading.phaseA.reactivePower,
      voltage: reading.phaseA.voltage,
    },
    {
      activePower: reading.phaseB.activePower,
      colorClassName: 'bg-blue-500',
      current: reading.phaseB.current,
      label: 'L2',
      powerFactor: reading.phaseB.powerFactor ?? 0,
      reactivePower: reading.phaseB.reactivePower,
      voltage: reading.phaseB.voltage,
    },
    {
      activePower: reading.phaseC.activePower,
      colorClassName: 'bg-emerald-500',
      current: reading.phaseC.current,
      label: 'L3',
      powerFactor: reading.phaseC.powerFactor ?? 0,
      reactivePower: reading.phaseC.reactivePower,
      voltage: reading.phaseC.voltage,
    },
  ]

  return (
    <Card>
      <CardHeader className="space-y-3 px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <CardTitle className="text-base font-semibold">
              มอนิเตอร์เรียลไทม์
            </CardTitle>
            <Badge
              className={
                isConnected
                  ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                  : ''
              }
              variant={isConnected ? 'default' : 'destructive'}
            >
              {isConnected ? (
                <>
                  <IconWifi aria-hidden="true" className="mr-1 h-3 w-3" />
                  ออนไลน์
                </>
              ) : (
                <>
                  <IconWifiOff aria-hidden="true" className="mr-1 h-3 w-3" />
                  ออฟไลน์
                </>
              )}
            </Badge>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end">
            {latestDataTimestamp && (
              <span className="text-muted-foreground hidden font-mono text-xs md:inline">
                ข้อมูลล่าสุด: {formatTime(latestDataTimestamp)}
              </span>
            )}
            <Button
              aria-label="รีเฟรชข้อมูล"
              className="h-7 w-7"
              disabled={isRefreshing}
              onClick={handleRefresh}
              size="icon"
              variant="ghost"
            >
              <IconRefresh
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>
        <RealtimeStatusBar
          isConnected={isConnected}
          isRefreshing={isRefreshing}
          lastCheckedAt={dataUpdatedAt}
          latestDataTimestamp={latestDataTimestamp}
          now={now}
          refreshIntervalMs={refreshIntervalMs}
        />
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
          <div className="space-y-7">
            {/* Section 1: Power & Load */}
            <section className="space-y-4">
              <div className="text-primary flex items-center gap-2 text-sm font-medium">
                <IconBolt className="h-4 w-4" />
                Power Status
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <PowerMetric
                  label="Active Power (P)"
                  unit="kW"
                  value={reading.activePower}
                />
                <PowerMetric
                  label="Reactive Power (Q)"
                  unit="kVAR"
                  value={reading.reactivePower}
                />
                <PowerMetric
                  label="Apparent Power (S)"
                  unit="kVA"
                  value={reading.apparentPower}
                />
              </div>

              <PowerFlowRow
                isImport={reading.isImport}
                isInductive={reading.isInductive}
                quadrant={reading.quadrant}
              />
            </section>

            {/* Section 2: Phase Monitor */}
            <section className="space-y-4">
              <div className="text-primary flex items-center gap-2 text-sm font-medium">
                <IconActivity className="h-4 w-4" />
                Phase Monitor
              </div>

              <div className="grid gap-3 lg:hidden">
                {phaseMetrics.map((metric) => (
                  <PhaseMetricCard key={metric.label} {...metric} />
                ))}
              </div>

              <div className="hidden lg:block">
                <div className="w-full min-w-0 space-y-2">
                  <div className="text-muted-foreground grid grid-cols-[0.7fr_1fr_1fr_1fr_1.15fr_0.65fr] px-3 text-xs leading-snug font-medium">
                    <div>Phase</div>
                    <div className="text-right">Voltage (V)</div>
                    <div className="text-right">Current (A)</div>
                    <div className="text-right">Power (kW)</div>
                    <div className="text-right">Reactive (kVAR)</div>
                    <div className="text-right">PF</div>
                  </div>

                  {phaseMetrics.map((metric) => (
                    <PhaseMetricRow key={metric.label} {...metric} />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Section 3: Energy & Quality */}
          <section className="space-y-4 xl:border-l xl:pl-6">
            <div className="text-primary flex items-center gap-2 text-sm font-medium">
              <IconGauge className="h-4 w-4" />
              Efficiency Status
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span
                  className="text-muted-foreground text-xs tracking-wider uppercase"
                  title="Utility Factor"
                >
                  Utilization Factor
                </span>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="text-4xl font-bold tracking-tight">
                    {((reading.apparentPower / capacity) * 100).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">
                    %
                  </span>
                </div>
                <PercentBar value={(reading.apparentPower / capacity) * 100} />
              </div>

              <Separator />

              <div className="space-y-3">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Power Factor
                </span>
                <PfSummary value={reading.powerFactor ?? 0} />
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

async function fetchRealtimeData(
  transformerId: string,
  signal?: AbortSignal
): Promise<TransformerReading> {
  const url = `/transformers/${transformerId}/realtime`
  const response = await nextApi.get<TransformerReading>(url, {
    params: { _t: Date.now() },
    signal,
  })
  return response as unknown as TransformerReading
}

function formatCheckedAt(timestamp: number) {
  if (!timestamp) return '-'

  return new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp)
}

function formatDataAge(date: Date, now: number) {
  const seconds = Math.max(0, Math.floor((now - date.getTime()) / 1000))

  if (seconds < 60) return `${seconds} วินาทีที่แล้ว`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`

  const hours = Math.floor(minutes / 60)
  return `${hours} ชม. ${minutes % 60} นาทีที่แล้ว`
}

function formatInterval(intervalMs: number) {
  const minutes = Math.max(1, Math.round(intervalMs / 60_000))

  return minutes === 1 ? '1 นาที' : `${minutes} นาที`
}

function getMsUntilNextRealtimeRefresh(intervalMs: number) {
  const now = Date.now()
  const currentBoundary = Math.floor(now / intervalMs) * intervalMs
  const currentReadyAt = currentBoundary + REALTIME_REFRESH_DELAY_MS

  if (now < currentReadyAt) return Math.max(1_000, currentReadyAt - now)

  return Math.max(
    1_000,
    currentBoundary + intervalMs - now + REALTIME_REFRESH_DELAY_MS
  )
}

function getRealtimeIntervalMs(transformerId: string) {
  return isMinuteBasedTransformer(transformerId)
    ? ONE_MINUTE_MS
    : FIFTEEN_MINUTES_MS
}

function isMinuteBasedTransformer(transformerId: string) {
  return /^(WL|BR|SD)/.test(transformerId)
}

function PfSummary({ value }: PfSummaryProps) {
  return (
    <div className="bg-muted/30 flex items-center justify-between gap-3 rounded-md border px-3 py-2 tabular-nums">
      <div className="min-w-0">
        <div className="text-sm font-medium">Total PF</div>
        <div className="text-muted-foreground text-xs">3-phase aggregate</div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">
          {value.toFixed(2)}
        </span>
      </div>
    </div>
  )
}

function PhaseMetricCard({
  activePower,
  colorClassName,
  current,
  label,
  powerFactor,
  reactivePower,
  voltage,
}: PhaseMetricRowProps) {
  return (
    <div className="bg-muted/30 rounded-md px-3 py-3 tabular-nums">
      <div className="mb-3 flex items-center gap-2">
        <div className={`h-2.5 w-2.5 rounded-full ${colorClassName}`} />
        <span className="font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
        <PhaseMetricValue label="Voltage (V)" value={voltage} />
        <PhaseMetricValue label="Current (A)" value={current} />
        <PhaseMetricValue label="Power (kW)" value={activePower} />
        <PhaseMetricValue label="Reactive (kVAR)" value={reactivePower} />
        <PhaseMetricValue label="PF" value={powerFactor.toFixed(2)} />
      </div>
    </div>
  )
}

function PhaseMetricRow({
  activePower,
  colorClassName,
  current,
  label,
  powerFactor,
  reactivePower,
  voltage,
}: PhaseMetricRowProps) {
  return (
    <div className="bg-muted/30 grid grid-cols-[0.7fr_1fr_1fr_1fr_1.15fr_0.65fr] items-center rounded-md px-3 py-2 text-sm tabular-nums">
      <div className="flex min-w-0 items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${colorClassName}`} />
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-muted-foreground text-right font-mono">
        {voltage}
      </div>
      <div className="text-right font-mono font-medium">{current}</div>
      <div className="text-right font-mono font-medium">{activePower}</div>
      <div className="text-right font-mono font-medium">{reactivePower}</div>
      <div className="text-right font-mono font-medium">
        {powerFactor.toFixed(2)}
      </div>
    </div>
  )
}

function PhaseMetricValue({ label, value }: PhaseMetricValueProps) {
  return (
    <div className="min-w-0">
      <div className="text-muted-foreground text-xs leading-snug font-medium break-words">
        {label}
      </div>
      <div className="text-foreground mt-1 font-mono text-sm font-medium">
        {value}
      </div>
    </div>
  )
}

function PowerFlowRow({ isImport, isInductive, quadrant }: PowerFlowRowProps) {
  const flowLabel = isImport ? 'Import' : 'Export'
  const reactiveLabel = isInductive ? 'Inductive' : 'Capacitive'

  return (
    <div className="bg-muted/30 flex flex-col items-start gap-3 rounded-md border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm font-medium">Power Flow</div>
        <div className="text-muted-foreground text-xs">
          {flowLabel} active power · {reactiveLabel} reactive power
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 sm:justify-end">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            isImport
              ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
              : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
          }`}
        >
          {isImport ? (
            <IconArrowDown aria-hidden="true" className="h-3 w-3" />
          ) : (
            <IconArrowUp aria-hidden="true" className="h-3 w-3" />
          )}
          {flowLabel}
        </span>

        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold ${QUADRANT_STYLES[quadrant]}`}
          title={QUADRANT_DESC[quadrant]}
        >
          {quadrant}
        </span>

        <span className="text-muted-foreground text-xs font-medium">
          {reactiveLabel}
        </span>
      </div>
    </div>
  )
}

function PowerMetric({ label, unit, value }: PowerMetricProps) {
  return (
    <div className="bg-muted/30 flex min-w-0 flex-col justify-between gap-3 rounded-md px-3 py-3 tabular-nums">
      <span className="text-muted-foreground min-h-8 text-xs leading-snug font-medium tracking-wider break-words uppercase">
        {label}
      </span>
      <div className="flex flex-col items-baseline gap-1">
        <span className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-2xl">
          {value.toFixed(2)}
        </span>
        <span className="text-muted-foreground text-xs font-medium">
          {unit}
        </span>
      </div>
    </div>
  )
}

function RealtimeStatusBar({
  isConnected,
  isRefreshing,
  lastCheckedAt,
  latestDataTimestamp,
  now,
  refreshIntervalMs,
}: RealtimeStatusBarProps) {
  return (
    <div className="bg-muted/30 grid gap-2 rounded-md px-3 py-2 text-xs md:grid-cols-3">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={`relative flex size-2.5 shrink-0 rounded-full ${
            isConnected ? 'bg-emerald-500' : 'bg-destructive'
          }`}
        >
          {isConnected && (
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-40" />
          )}
        </span>
        <span className="text-muted-foreground">สถานะมิเตอร์</span>
        <span className="text-foreground font-medium">
          {isConnected ? 'ออนไลน์' : 'ออฟไลน์'}
        </span>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <IconRotateClockwise2
          aria-hidden="true"
          className={`text-muted-foreground size-3.5 shrink-0 ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        />
        <span className="text-muted-foreground">รีเฟรช</span>
        <span
          className="text-foreground font-mono font-medium"
          title={`ตรวจล่าสุด: ${formatCheckedAt(lastCheckedAt)}`}
        >
          {isRefreshing
            ? 'กำลังอัปเดต...'
            : `ทุก ${formatInterval(refreshIntervalMs)}`}
        </span>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <IconTimelineEvent
          aria-hidden="true"
          className="text-muted-foreground size-3.5 shrink-0"
        />
        <span className="text-muted-foreground">อายุข้อมูล</span>
        <span className="text-foreground font-mono font-medium">
          {latestDataTimestamp ? formatDataAge(latestDataTimestamp, now) : '-'}
        </span>
      </div>
    </div>
  )
}
