'use client'

import type {
  Formatter,
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'

import type { BaseChartData, ChartProps } from './types'
import type { ChartConfig } from '~/components/ui/chart'

import { Card } from '~/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import { cn } from '~/lib/utils'

import { DEFAULT_PASTEL_COLORS } from './types'

export function Chart({
  barCategoryGap,
  children,
  className,
  colors,
  config,
  data,
  description,
  height,
  nameKey,
  showGrid = true,
  showLabels = false,
  // showLegend = false,
  title,
  tooltipFormatter,
  tooltipLabelFormatter,
  type,
  width,
  xAxisKey = 'name',
  xAxisLabel,
  // yAxisKey,
  yAxisLabel,
}: ChartProps) {
  function renderChart() {
    switch (type) {
      case 'area':
        return (
          <AreaChartComponent
            colors={colors}
            config={config}
            data={data}
            height={height}
            showGrid={showGrid}
            width={width}
            xAxisKey={xAxisKey}
          />
        )

      case 'bar':
        return (
          <BarChartComponent
            barCategoryGap={barCategoryGap}
            colors={colors}
            config={config}
            data={data}
            height={height}
            showGrid={showGrid}
            showLabels={showLabels}
            tooltipFormatter={tooltipFormatter}
            tooltipLabelFormatter={tooltipLabelFormatter}
            width={width}
            xAxisKey={xAxisKey}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
          />
        )

      case 'line':
        return (
          <LineChartComponent
            colors={colors}
            config={config}
            data={data}
            height={height}
            showGrid={showGrid}
            width={width}
            xAxisKey={xAxisKey}
          />
        )

      case 'pie':
        return (
          <PieChartComponent
            colors={colors}
            config={config}
            data={data}
            height={height}
            nameKey={nameKey}
            showLabels={showLabels}
            tooltipFormatter={tooltipFormatter}
            tooltipLabelFormatter={tooltipLabelFormatter}
            width={width}
          />
        )
    }
  }

  return (
    <Card className={cn('p-4', className)}>
      {(title || description) && (
        <div className={cn('mb-4 flex', type === 'pie' && 'justify-center')}>
          {title && (
            <p className="text-lg font-semibold text-gray-900">{title}</p>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}

      {renderChart()}

      {children}
    </Card>
  )
}

function AreaChartComponent({
  colors,
  config,
  data,
  height,
  showGrid,
  width,
  xAxisKey = 'name',
}: {
  colors?: string[]
  config: ChartConfig
  data: BaseChartData[]
  height?: number
  showGrid?: boolean
  width?: number
  xAxisKey?: string
}) {
  const dataKeys = Object.keys(config).filter((key) => key !== 'label')

  function getColor(index: number) {
    return (
      colors?.[index % colors.length] ??
      DEFAULT_PASTEL_COLORS[index % DEFAULT_PASTEL_COLORS.length]
    )
  }

  return (
    <ChartContainer
      className={cn(!width && 'w-full', !height && '!aspect-none')}
      config={config}
      style={{
        height: height ? `${height}px` : undefined,
        width: width ? `${width}px` : undefined,
      }}
    >
      <AreaChart data={data}>
        <defs>
          {dataKeys.map((key, index) => (
            <linearGradient
              id={`fill${key}`}
              key={key}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="5%" stopColor={getColor(index)} stopOpacity={0.8} />
              <stop
                offset="95%"
                stopColor={getColor(index)}
                stopOpacity={0.1}
              />
            </linearGradient>
          ))}
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          axisLine={false}
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis axisLine={false} tick={{ fontSize: 12 }} tickLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {dataKeys.map((key, index) => (
          <Area
            dataKey={key}
            fill={`url(#fill${key})`}
            key={key}
            stroke={getColor(index)}
            type="natural"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

function BarChartComponent({
  barCategoryGap,
  colors,
  config,
  data,
  height,
  showGrid,
  showLabels,
  tooltipFormatter,
  tooltipLabelFormatter,
  width,
  xAxisKey = 'name',
  xAxisLabel,
  yAxisLabel,
}: {
  barCategoryGap?: number
  colors?: string[]
  config: ChartConfig
  data: BaseChartData[]
  height?: number
  showGrid?: boolean
  showLabels?: boolean
  tooltipFormatter?: (value: unknown, name?: string) => [string, string?]
  tooltipLabelFormatter?: (
    label: unknown,
    payload: Payload<ValueType, NameType>[]
  ) => string
  width?: number
  xAxisKey?: string
  xAxisLabel?: string
  yAxisLabel?: string
}) {
  const dataKey = getDataKeyFromConfig(config)
  const chartColors = colors ?? DEFAULT_PASTEL_COLORS

  function getBarColor(index: number) {
    return chartColors[index % chartColors.length]
  }

  return (
    <ChartContainer
      className={cn(!width && 'w-full', !height && '!aspect-none')}
      config={config}
      style={{
        height: height ? `${height}px` : undefined,
        width: width ? `${width}px` : undefined,
      }}
    >
      <BarChart barCategoryGap={barCategoryGap} data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          axisLine={false}
          dataKey={xAxisKey}
          label={
            xAxisLabel ? (
              <Label
                className="font-bold"
                dy={10}
                position="insideBottom"
                value={xAxisLabel}
              />
            ) : undefined
          }
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          label={
            yAxisLabel ? (
              <Label
                angle={-90}
                className="font-bold"
                dx={-5}
                dy="50%"
                position="insideLeft"
                style={{ textAnchor: 'middle' }}
                value={yAxisLabel}
              />
            ) : undefined
          }
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={tooltipFormatter as Formatter<ValueType, NameType>}
              labelFormatter={tooltipLabelFormatter}
              nameKey={dataKey}
            />
          }
        />
        <Bar dataKey={dataKey}>
          {data.map((_entry, index) => (
            <Cell fill={getBarColor(index)} key={`cell-${index}`} />
          ))}
          {showLabels && (
            <LabelList
              className="fill-background"
              dataKey={dataKey}
              fontSize={12}
              position="top"
              stroke="none"
            />
          )}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

function getChartDataWithColors(
  data: BaseChartData[],
  colors?: string[]
): BaseChartData[] {
  const chartColors = colors ?? DEFAULT_PASTEL_COLORS

  return data.map((item, index) => ({
    ...item,
    fill: chartColors[index % chartColors.length],
  }))
}

function getDataKeyFromConfig(config: ChartConfig): string {
  const keys = Object.keys(config)

  return keys.find((key) => key !== 'label') || keys[0] || 'value'
}

function LineChartComponent({
  colors,
  config,
  data,
  height,
  showGrid,
  width,
  xAxisKey = 'name',
}: {
  colors?: string[]
  config: ChartConfig
  data: BaseChartData[]
  height?: number
  showGrid?: boolean
  width?: number
  xAxisKey?: string
}) {
  const dataKeys = Object.keys(config).filter((key) => key !== 'label')

  return (
    <ChartContainer
      className={cn(!width && 'w-full', !height && '!aspect-none')}
      config={config}
      style={{
        height: height ? `${height}px` : undefined,
        width: width ? `${width}px` : undefined,
      }}
    >
      <LineChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          axisLine={false}
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis axisLine={false} tick={{ fontSize: 12 }} tickLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {dataKeys.map((key, index) => (
          <Line
            dataKey={key}
            dot={false}
            key={key}
            stroke={
              colors?.[index % colors.length] ??
              DEFAULT_PASTEL_COLORS[index % DEFAULT_PASTEL_COLORS.length]
            }
            strokeWidth={2}
            type="linear"
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

function PieChartComponent({
  colors,
  config,
  data,
  height,
  nameKey = 'name',
  showLabels,
  tooltipFormatter,
  tooltipLabelFormatter,
  width,
}: {
  colors?: string[]
  config: ChartConfig
  data: BaseChartData[]
  height?: number
  nameKey?: string
  showLabels?: boolean
  tooltipFormatter?: (value: unknown, name?: string) => [string, string?]
  tooltipLabelFormatter?: (
    label: unknown,
    payload: Payload<ValueType, NameType>[]
  ) => string
  width?: number
}) {
  const dataKey = getDataKeyFromConfig(config)
  const chartData = getChartDataWithColors(data, colors)

  return (
    <ChartContainer
      className={cn('mx-auto', !height && !width && 'aspect-square')}
      config={config}
      style={{
        height: height ? `${height}px` : undefined,
        width: width ? `${width}px` : undefined,
      }}
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={tooltipFormatter as Formatter<ValueType, NameType>}
              labelFormatter={tooltipLabelFormatter}
              nameKey={nameKey}
            />
          }
        />
        <Pie data={chartData} dataKey={dataKey} nameKey={nameKey}>
          {showLabels && (
            <LabelList
              className="fill-background"
              dataKey={nameKey}
              fontSize={12}
              stroke="none"
            />
          )}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export default Chart
