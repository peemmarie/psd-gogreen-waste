'use client'

import { useState } from 'react'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { type ChartDataPoint } from '~/types/transformer'

const chartConfig = {
  phaseA: {
    color: 'var(--chart-1)',
    label: 'Phase A',
  },
  phaseB: {
    color: 'var(--chart-2)',
    label: 'Phase B',
  },
  phaseC: {
    color: 'var(--chart-3)',
    label: 'Phase C',
  },
} satisfies ChartConfig

type ChartAreaInteractiveProps = {
  data?: ChartDataPoint[]
}

export function ChartAreaInteractive({ data = [] }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = useState('24h')

  function handleTimeRangeChange(value: null | string) {
    if (value) setTimeRange(value)
  }

  return (
    <Card className="@container/card">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>ปริมาณการใช้ไฟฟ้าเฉลี่ย</CardTitle>
          <CardDescription>
            แสดงแนวโน้มการใช้ไฟฟ้ารายเฟสในรอบ 24 ชั่วโมง
          </CardDescription>
        </div>
        <Select onValueChange={handleTimeRangeChange} value={timeRange}>
          <SelectTrigger
            aria-label="Select a value"
            className="w-[160px] rounded-lg sm:ml-auto"
          >
            <SelectValue placeholder="Last 24 hours" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem className="rounded-lg" value="24h">
              24 ชั่วโมงล่าสุด
            </SelectItem>
            <SelectItem className="rounded-lg" value="7d">
              7 วันล่าสุด
            </SelectItem>
            <SelectItem className="rounded-lg" value="30d">
              30 วันล่าสุด
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillPhaseA" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-phaseA)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-phaseA)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPhaseB" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-phaseB)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-phaseB)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPhaseC" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-phaseC)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-phaseC)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="time"
              minTickGap={32}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => value}
                />
              }
              cursor={false}
            />
            <Area
              dataKey="phaseA"
              fill="url(#fillPhaseA)"
              stackId="a"
              stroke="var(--color-phaseA)"
              type="natural"
            />
            <Area
              dataKey="phaseB"
              fill="url(#fillPhaseB)"
              stackId="a"
              stroke="var(--color-phaseB)"
              type="natural"
            />
            <Area
              dataKey="phaseC"
              fill="url(#fillPhaseC)"
              stackId="a"
              stroke="var(--color-phaseC)"
              type="natural"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
