import type { ReactNode } from 'react'
import type {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

import type { ChartConfig } from '~/components/ui/chart'

export type BaseChartData = Record<string, number | string>

export type ChartComponentProps = {
  colors?: string[]
  config: ChartConfig
  data: BaseChartData[]
  showGrid?: boolean
  showLabels?: boolean
  xAxisKey?: string
}

export type ChartProps = {
  barCategoryGap?: number
  children?: ReactNode
  className?: string
  colors?: string[]
  config: ChartConfig
  data: BaseChartData[]
  description?: string
  height?: number
  nameKey?: string
  showGrid?: boolean
  showLabels?: boolean
  showLegend?: boolean
  title?: string
  tooltipFormatter?: (value: unknown, name?: string) => [string, string?]
  tooltipLabelFormatter?: (
    label: unknown,
    payload: Payload<ValueType, NameType>[]
  ) => string
  type: ChartType
  width?: number
  xAxisKey?: string
  xAxisLabel?: string
  yAxisKey?: string
  yAxisLabel?: string
}

export type ChartType = 'area' | 'bar' | 'line' | 'pie'

export const CHART_TYPES = {
  AREA: 'area',
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
} as const

export const DEFAULT_PASTEL_COLORS = [
  '#FFB3BA', // Light pink
  '#BAFFC9', // Light green
  '#BAE1FF', // Light blue
  '#FFFFBA', // Light yellow
  '#FFDFBA', // Light peach
  '#E0BBE4', // Light purple
  '#FFC9DE', // Light rose
  '#C7CEEA', // Light lavender
  '#B8E6B8', // Light mint
  '#FFE5CC', // Light cream
  '#D4C5F9', // Light lilac
  '#FFD1DC', // Light blush
] as const
