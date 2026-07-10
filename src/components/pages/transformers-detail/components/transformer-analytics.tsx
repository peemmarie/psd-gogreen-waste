'use client'

import { useMemo, useState } from 'react'

import {
  IconAlertTriangle,
  IconChartHistogram,
  IconChartLine,
  IconClockHour4,
} from '@tabler/icons-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'
import { Progress } from '~/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

import { useHistoricalData } from '../hooks/use-historical-data'
import { HistoricalMeasurements } from './historical-meaurement'

const RANGE_LABELS: Record<string, string> = {
  '30d': '30 วันล่าสุด',
  '7d': '7 วันล่าสุด',
}

const chartConfig = {
  utilization: {
    color: 'var(--chart-4)',
    label: 'Utilization',
  },
} satisfies ChartConfig

type HistoryPhase = {
  current: number
  power: number
  reactive: number
  voltage: number
}

type LoadBucket = {
  hours: number
  label: string
  percentage: number
  tone: 'critical' | 'normal' | 'warning'
}

type NormalizedHistoryRow = {
  phaseA: HistoryPhase
  phaseB: HistoryPhase
  phaseC: HistoryPhase
  timestamp: number
  totalPower: number
  totalReactive: number
}

type SummaryMetric = {
  detail: string
  label: string
  tone?: 'critical' | 'normal' | 'warning'
  unit?: string
  value: string
}

type TransformerAnalyticsProps = Readonly<{
  capacity: number
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

export function TransformerAnalytics({
  capacity,
  nominals,
  transformerId,
}: TransformerAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d')
  const {
    data = [],
    intervalMs,
    isLoading,
  } = useHistoricalData(transformerId, timeRange)
  const analytics = useMemo(
    () => buildAnalytics(data, capacity, intervalMs),
    [capacity, data, intervalMs]
  )

  return (
    <Tabs className="gap-4" defaultValue="summary">
      <div className="flex flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-base font-semibold">Analytics</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            วิเคราะห์ภาระการใช้งาน ความเสี่ยง และแนวโน้มย้อนหลังของหม้อแปลง
          </p>
        </div>
        <TabsList aria-label="มุมมอง Analytics" variant="line">
          <TabsTrigger value="summary">
            <IconChartHistogram aria-hidden="true" />
            ข้อมูลสถิติ
          </TabsTrigger>
          <TabsTrigger value="history">
            <IconChartLine aria-hidden="true" />
            การวิเคราะห์และประวัติ
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="summary">
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Select
              onValueChange={(value) => value && setTimeRange(value)}
              value={timeRange}
            >
              <SelectTrigger
                aria-label="เลือกช่วงเวลาวิเคราะห์"
                className="w-44"
              >
                <SelectValue>
                  {(value) =>
                    RANGE_LABELS[String(value)] ?? RANGE_LABELS['30d']
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="7d">{RANGE_LABELS['7d']}</SelectItem>
                  <SelectItem value="30d">{RANGE_LABELS['30d']}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <AnalyticsSkeleton />
          ) : analytics.validPoints === 0 ? (
            <Empty className="min-h-80 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconClockHour4 aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>ไม่มีข้อมูลในช่วงเวลาที่เลือก</EmptyTitle>
                <EmptyDescription>
                  ลองเปลี่ยนช่วงเวลา หรือตรวจสอบสถานะการส่งข้อมูลของอุปกรณ์ TLM
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <AnalyticsSummary
                analytics={analytics}
                rangeLabel={RANGE_LABELS[timeRange]}
              />

              {analytics.maxUtilization >= 80 ? (
                <Alert
                  className={
                    analytics.maxUtilization > 100
                      ? undefined
                      : 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100'
                  }
                  variant={
                    analytics.maxUtilization > 100 ? 'destructive' : 'default'
                  }
                >
                  <IconAlertTriangle aria-hidden="true" />
                  <AlertTitle>
                    {analytics.maxUtilization > 100
                      ? 'ตรวจพบภาระเกินพิกัด'
                      : 'ภาระสูงใกล้พิกัด'}
                  </AlertTitle>
                  <AlertDescription>
                    UF สูงสุด {formatNumber(analytics.maxUtilization, 1)}%
                    และเกิดเหตุการณ์เกิน 100%{' '}
                    {formatNumber(analytics.overloadEpisodes)}{' '}
                    ครั้งในช่วงที่เลือก
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
                <LoadDistribution buckets={analytics.loadBuckets} />
                <UtilizationTrend data={analytics.trend} />
              </div>
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="history">
        <HistoricalMeasurements
          nominals={nominals}
          transformerId={transformerId}
        />
      </TabsContent>
    </Tabs>
  )
}

function AnalyticsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="กำลังโหลดข้อมูล Analytics"
      className="flex flex-col gap-4"
    >
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}

function AnalyticsSummary({
  analytics,
  rangeLabel,
}: Readonly<{
  analytics: ReturnType<typeof buildAnalytics>
  rangeLabel: string
}>) {
  const metrics: SummaryMetric[] = [
    {
      detail: `${formatNumber(analytics.validPoints)} / ${formatNumber(analytics.totalPoints)} จุดข้อมูล`,
      label: 'Data completeness',
      unit: '%',
      value: formatNumber(analytics.completeness, 1),
    },
    {
      detail: `เฉลี่ย ${formatNumber(analytics.averageUtilization, 1)}%`,
      label: 'UF สูงสุด',
      tone:
        analytics.maxUtilization > 100
          ? 'critical'
          : analytics.maxUtilization >= 80
            ? 'warning'
            : 'normal',
      unit: '%',
      value: formatNumber(analytics.maxUtilization, 1),
    },
    {
      detail: 'ค่าสูงสุดของทุกเฟส',
      label: 'Peak current',
      unit: 'A',
      value: formatNumber(analytics.peakCurrent, 1),
    },
    {
      detail:
        analytics.averagePowerFactor >= 0.9 ? 'อยู่ในเกณฑ์' : 'ควรตรวจสอบ',
      label: 'Power factor เฉลี่ย',
      tone: analytics.averagePowerFactor >= 0.9 ? 'normal' : 'warning',
      value: formatNumber(analytics.averagePowerFactor, 3),
    },
    {
      detail: `พลังงานผ่านหม้อแปลง · ${rangeLabel}`,
      label: 'Energy throughput',
      unit: 'MWh',
      value: formatNumber(analytics.energyMwh, 2),
    },
    {
      detail: 'ค่าสูงสุดระหว่าง L1–L3',
      label: 'Phase imbalance',
      tone:
        analytics.maxPhaseImbalance > 20
          ? 'critical'
          : analytics.maxPhaseImbalance > 10
            ? 'warning'
            : 'normal',
      unit: '%',
      value: formatNumber(analytics.maxPhaseImbalance, 1),
    },
  ]

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>ภาพรวมการใช้งาน</CardTitle>
        <CardDescription>
          คำนวณจากข้อมูลตรวจวัดจริงในช่วง {rangeLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <div
              className="border-b p-4 xl:[&:nth-child(3n+1)]:border-r xl:[&:nth-child(3n+2)]:border-r sm:[&:nth-child(odd)]:border-r xl:[&:nth-child(odd)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 xl:[&:nth-last-child(-n+3)]:border-b-0"
              key={metric.label}
            >
              <p className="text-muted-foreground text-xs">{metric.label}</p>
              <p
                className={
                  metric.tone === 'critical'
                    ? 'text-destructive mt-2 font-mono text-2xl font-semibold tabular-nums'
                    : metric.tone === 'warning'
                      ? 'mt-2 font-mono text-2xl font-semibold text-amber-700 tabular-nums dark:text-amber-400'
                      : 'mt-2 font-mono text-2xl font-semibold tabular-nums'
                }
              >
                {metric.value}
                {metric.unit ? (
                  <span className="text-muted-foreground ml-1.5 font-sans text-xs font-normal">
                    {metric.unit}
                  </span>
                ) : null}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function averageOf(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function buildAnalytics(
  data: Record<string, unknown>[],
  capacity: number,
  intervalMs: number
) {
  const rows = data.map(normalizeHistoryRow)
  const validRows = rows.filter(hasMeasurement)
  const utilizationValues = validRows.map((row) =>
    capacity > 0
      ? (Math.hypot(row.totalPower, row.totalReactive) / capacity) * 100
      : 0
  )
  const phaseCurrents = validRows.flatMap((row) => [
    row.phaseA.current,
    row.phaseB.current,
    row.phaseC.current,
  ])
  const powerFactors = validRows
    .map((row) => {
      const apparentPower = Math.hypot(row.totalPower, row.totalReactive)
      return apparentPower > 0 ? Math.abs(row.totalPower) / apparentPower : 0
    })
    .filter((value) => value > 0)
  const imbalanceValues = validRows.map((row) => {
    const currents = [
      row.phaseA.current,
      row.phaseB.current,
      row.phaseC.current,
    ]
    const average = averageOf(currents)
    return average > 0
      ? (Math.max(...currents.map((current) => Math.abs(current - average))) /
          average) *
          100
      : 0
  })
  const hoursPerPoint = intervalMs / 3_600_000
  const energyMwh =
    validRows.reduce(
      (sum, row) => sum + Math.abs(row.totalPower) * hoursPerPoint,
      0
    ) / 1000
  const trendStep = Math.max(1, Math.ceil(validRows.length / 48))
  const trend = validRows
    .filter(
      (_, index) => index % trendStep === 0 || index === validRows.length - 1
    )
    .map((row) => ({
      label: formatChartTime(row.timestamp),
      utilization:
        capacity > 0
          ? Number(
              (
                (Math.hypot(row.totalPower, row.totalReactive) / capacity) *
                100
              ).toFixed(2)
            )
          : 0,
    }))

  return {
    averagePowerFactor: averageOf(powerFactors),
    averageUtilization: averageOf(utilizationValues),
    completeness: rows.length > 0 ? (validRows.length / rows.length) * 100 : 0,
    energyMwh,
    loadBuckets: buildLoadBuckets(utilizationValues, hoursPerPoint),
    maxPhaseImbalance: maxOf(imbalanceValues),
    maxUtilization: maxOf(utilizationValues),
    overloadEpisodes: countThresholdEpisodes(utilizationValues, 100),
    peakCurrent: maxOf(phaseCurrents),
    totalPoints: rows.length,
    trend,
    validPoints: validRows.length,
  }
}

function buildLoadBuckets(
  values: number[],
  hoursPerPoint: number
): LoadBucket[] {
  const definitions: Array<{
    label: string
    max: number
    min: number
    tone: LoadBucket['tone']
  }> = [
    { label: '0–20%', max: 20, min: 0, tone: 'normal' },
    { label: '20–40%', max: 40, min: 20, tone: 'normal' },
    { label: '40–60%', max: 60, min: 40, tone: 'normal' },
    { label: '60–80%', max: 80, min: 60, tone: 'warning' },
    { label: '80–100%', max: 100, min: 80, tone: 'warning' },
    {
      label: '>100%',
      max: Number.POSITIVE_INFINITY,
      min: 100,
      tone: 'critical',
    },
  ]

  return definitions.map((definition) => {
    const count = values.filter(
      (value) => value >= definition.min && value < definition.max
    ).length

    return {
      hours: count * hoursPerPoint,
      label: definition.label,
      percentage: values.length > 0 ? (count / values.length) * 100 : 0,
      tone: definition.tone,
    }
  })
}

function countThresholdEpisodes(values: number[], threshold: number) {
  let episodes = 0
  let wasAbove = false

  for (const value of values) {
    const isAbove = value > threshold
    if (isAbove && !wasAbove) episodes += 1
    wasAbove = isAbove
  }

  return episodes
}

function formatChartTime(timestamp: number) {
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone: 'Asia/Bangkok',
  }).format(timestamp)
}

function formatDuration(hours: number) {
  if (hours < 1) return `${Math.round(hours * 60)} นาที`
  return `${formatNumber(hours, hours < 10 ? 1 : 0)} ชม.`
}

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString('th-TH', { maximumFractionDigits })
}

function hasMeasurement(row: NormalizedHistoryRow) {
  return [
    row.totalPower,
    row.totalReactive,
    row.phaseA.current,
    row.phaseB.current,
    row.phaseC.current,
    row.phaseA.voltage,
    row.phaseB.voltage,
    row.phaseC.voltage,
  ].some((value) => value !== 0)
}

function LoadDistribution({ buckets }: Readonly<{ buckets: LoadBucket[] }>) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>การกระจาย Load Profile</CardTitle>
        <CardDescription>
          สัดส่วนเวลาที่หม้อแปลงทำงานในแต่ละช่วงของพิกัด
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {buckets.map((bucket) => (
          <div
            className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-3"
            key={bucket.label}
          >
            <span className="text-muted-foreground text-xs tabular-nums">
              {bucket.label}
            </span>
            <Progress
              aria-label={`${bucket.label} ${bucket.percentage.toFixed(1)} เปอร์เซ็นต์`}
              indicatorClassName={
                bucket.tone === 'critical'
                  ? 'bg-destructive'
                  : bucket.tone === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
              }
              value={bucket.percentage}
            />
            <span className="text-right font-mono text-xs font-medium tabular-nums">
              {formatDuration(bucket.hours)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function maxOf(values: number[]) {
  return values.length > 0 ? Math.max(...values) : 0
}

function normalizeHistoryRow(
  row: Record<string, unknown>
): NormalizedHistoryRow {
  return {
    phaseA: normalizePhase(row.phaseA),
    phaseB: normalizePhase(row.phaseB),
    phaseC: normalizePhase(row.phaseC),
    timestamp: toNumber(row.timestamp),
    totalPower: toNumber(row.totalPower),
    totalReactive: toNumber(row.totalReactive),
  }
}

function normalizePhase(value: unknown): HistoryPhase {
  const phase =
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {}

  return {
    current: toNumber(phase.current),
    power: toNumber(phase.power),
    reactive: toNumber(phase.reactive),
    voltage: toNumber(phase.voltage),
  }
}

function toNumber(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function UtilizationTrend({
  data,
}: Readonly<{ data: { label: string; utilization: number }[] }>) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Utilization trend</CardTitle>
        <CardDescription>
          UF ตามเวลา พร้อมเส้นเฝ้าระวังที่ 80% ของพิกัด
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-72 w-full"
          config={chartConfig}
        >
          <AreaChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="utilization-fill" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-utilization)"
                  stopOpacity={0.24}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-utilization)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              minTickGap={40}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              domain={[
                0,
                (max: number) => Math.max(100, Math.ceil(max / 20) * 20),
              ]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              width={42}
            />
            <ReferenceLine
              label={{
                fill: 'var(--muted-foreground)',
                fontSize: 10,
                position: 'insideTopRight',
                value: 'เฝ้าระวัง 80%',
              }}
              stroke="var(--destructive)"
              strokeDasharray="4 4"
              y={80}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex min-w-32 items-center justify-between gap-4">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-mono font-medium tabular-nums">
                        {Number(value).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  hideLabel={false}
                />
              }
            />
            <Area
              dataKey="utilization"
              fill="url(#utilization-fill)"
              stroke="var(--color-utilization)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
