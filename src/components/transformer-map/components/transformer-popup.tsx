import { Popup } from 'react-map-gl/maplibre'

import {
  IconBolt,
  IconChartLine,
  IconCurrentLocation,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { cn, ibmSans } from '~/lib'
import { nextApi } from '~/lib/axios/next-api'
import { type Transformer } from '~/types/transformer'

type TransformerPopupProps = {
  onClose: () => void
  transformer: Transformer
}

type TrendRow = { time: string; totalPower: number }

export function TransformerPopup({
  onClose,
  transformer,
}: TransformerPopupProps) {
  const isOnline = transformer.status === 'online'

  // Fetch realtime data to get an up-to-date load percentage
  const { data: realtimeData } = useQuery<{
    loadPercentage: null | number
  }>({
    queryFn: () =>
      nextApi.get(
        `/transformers/${transformer.stationId}/realtime`
      ) as unknown as Promise<{ loadPercentage: null | number }>,
    queryKey: ['transformer-realtime-load', transformer.stationId],
    staleTime: 5 * 60 * 1000,
  })

  const loadPercentage = realtimeData?.loadPercentage ?? null

  return (
    <Popup
      anchor="bottom"
      className="[&_.maplibregl-popup-content]:overflow-hidden [&_.maplibregl-popup-content]:rounded-xl! [&_.maplibregl-popup-content]:p-0! [&_.maplibregl-popup-content]:shadow-2xl"
      closeButton={false}
      closeOnClick={false}
      latitude={transformer.coordinates.lat}
      longitude={transformer.coordinates.lng}
      maxWidth="380px"
      offset={[0, -10]}
      onClose={onClose}
    >
      <Card
        className={`w-[340px] rounded-xl border-0 shadow-xl ${ibmSans.className} gap-1`}
      >
        <CardHeader className="space-y-2 pb-3">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base leading-none font-semibold">
                {transformer.stationId}
              </h3>
              <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
                <IconCurrentLocation className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {transformer.feeder}
                  {transformer.district ? ` • ${transformer.district}` : ''}
                </span>
              </div>
            </div>
            <Badge
              className={
                isOnline
                  ? 'shrink-0 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 shadow-sm'
                  : 'shrink-0 border-red-500/20 bg-red-500/10 text-red-500 shadow-sm'
              }
              variant="outline"
            >
              <span
                className={cn(
                  'mr-1.5 h-1.5 w-1.5 rounded-full',
                  isOnline && 'bg-emerald-500',
                  !isOnline && 'bg-red-500'
                )}
              />
              {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
            </Badge>
          </div>
        </CardHeader>

        <Separator className="opacity-60" />

        <CardContent className="space-y-4 pt-4">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/20 rounded-lg border p-2.5">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                Capacity
              </span>
              <div className="mt-0.5 flex items-end gap-0.5">
                <span className="text-base leading-none font-bold">
                  {transformer.capacity}
                </span>
                <span className="text-muted-foreground mb-0.5 text-[10px]">
                  kVA
                </span>
              </div>
            </div>
            <div className="bg-muted/20 rounded-lg border p-2.5">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                Voltage
              </span>
              <div className="mt-0.5 flex items-end gap-0.5">
                <span className="text-base leading-none font-bold">
                  {transformer.secondaryVoltage}
                </span>
                <span className="text-muted-foreground mb-0.5 text-[10px]">
                  V
                </span>
              </div>
            </div>
            <div className="bg-muted/20 rounded-lg border p-2.5">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                Load
              </span>
              <div className="mt-0.5 flex items-end gap-0.5">
                <span className="text-base leading-none font-bold">
                  {loadPercentage ?? '—'}
                </span>
                {loadPercentage != null && (
                  <span className="text-muted-foreground mb-0.5 text-[10px]">
                    %
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detail rows */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <IconBolt className="h-3.5 w-3.5" /> CT Ratio
              </span>
              <span className="font-medium">{transformer.ctRatio}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <IconBolt className="h-3.5 w-3.5" /> Primary Voltage
              </span>
              <span className="font-medium">
                {transformer.primaryVoltage} kV
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <IconBolt className="h-3.5 w-3.5" /> Type
              </span>
              <span className="font-medium">
                {transformer.brand} {transformer.installationType}
              </span>
            </div>
          </div>

          {/* Trend sparkline — previous day (00:15 → end of yesterday) */}
          <TrendSparkline stationId={transformer.stationId} />

          <Button
            className="w-full shadow-sm"
            nativeButton={false}
            render={<Link href={`/transformers/${transformer.stationId}`} />}
            size="sm"
          >
            ดูรายละเอียดเพิ่มเติม
          </Button>
        </CardContent>
      </Card>
    </Popup>
  )
}

function TrendSparkline({ stationId }: { stationId: string }) {
  const { data = [], isLoading } = useQuery<TrendRow[]>({
    queryFn: () =>
      nextApi.get(`/transformers/${stationId}/trend`) as unknown as Promise<
        TrendRow[]
      >,
    queryKey: ['transformer-trend', stationId],
    staleTime: 30 * 60 * 1000,
  })

  if (isLoading) {
    return <div className="bg-muted/20 h-14 animate-pulse rounded-lg border" />
  }

  if (data.length === 0) {
    return (
      <div className="bg-muted/20 text-muted-foreground flex h-14 items-center justify-center rounded-lg border border-dashed text-xs">
        <IconChartLine className="mr-1.5 h-3.5 w-3.5" />
        ไม่มีข้อมูล
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
        Active Power — เมื่อวาน
      </p>
      <div className="bg-muted/10 h-14 rounded-lg border px-1">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart
            data={data}
            margin={{ bottom: 0, left: 0, right: 0, top: 4 }}
          >
            <defs>
              <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const row = payload[0].payload as TrendRow
                return (
                  <div className="bg-background rounded border px-2 py-1 text-[10px] shadow">
                    <p className="font-semibold">{row.totalPower} kW</p>
                    <p className="text-muted-foreground">{row.time}</p>
                  </div>
                )
              }}
            />
            <Area
              dataKey="totalPower"
              dot={false}
              fill="url(#trendGrad)"
              isAnimationActive={false}
              stroke="var(--primary)"
              strokeWidth={1.5}
              type="monotone"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
