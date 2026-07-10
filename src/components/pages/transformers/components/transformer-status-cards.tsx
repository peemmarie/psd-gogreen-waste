import {
  IconBolt,
  IconChartBar,
  IconGauge,
  IconTrendingUp,
} from '@tabler/icons-react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { formatKiloUnit } from '~/utils/number'

type TransformerStatusCardsProps = {
  summary: {
    averageLoad: number
    maxLoad: number
    offline: number
    online: number
    total: number
    totalApparentPower: number
    utilizationFactor: number
  }
}

export function TransformerStatusCards({
  summary,
}: TransformerStatusCardsProps) {
  const totalMeters = summary.total
  const onlinePercentage = calculatePercentage(summary.online, totalMeters)
  const offlinePercentage = calculatePercentage(summary.offline, totalMeters)

  function calculatePercentage(value: number, total: number) {
    if (total === 0) return 0
    return (value / total) * 100
  }

  function formatNumber(num: null | number | undefined, decimals = 0) {
    const safeNum = num ?? 0
    return safeNum.toLocaleString('th-TH', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })
  }

  function formatCountWithPercentage(count: number, percentage: number) {
    return `${formatNumber(count)} (${formatNumber(percentage, 1)}%)`
  }

  const cards = [
    {
      bgColor: 'bg-primary/10',
      color: 'text-primary',
      footer: (
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {formatCountWithPercentage(summary.online, onlinePercentage)}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {formatCountWithPercentage(summary.offline, offlinePercentage)}
          </span>
        </div>
      ),
      icon: IconGauge,
      subtitle: 'หม้อแปลงไฟฟ้าในระบบ',
      title: 'สถานะหม้อแปลงไฟฟ้าทั้งหมด',
      value: formatNumber(summary.total),
    },
    {
      bgColor: 'bg-chart-3/10',
      color: 'text-chart-3',
      footer: (
        <div className="text-muted-foreground text-xs">
          พิกัดเฉลี่ย {formatKiloUnit(summary.averageLoad, 'VA')} / หม้อแปลง
        </div>
      ),
      icon: IconBolt,
      subtitle: 'พิกัดของหม้อแปลงที่มีในระบบทั้งหมด',
      title: 'พิกัดกำลังไฟฟ้าปรากฏรวม',
      value: formatKiloUnit(summary.totalApparentPower, 'VA'),
    },
    {
      bgColor: 'bg-chart-2/10',
      color: 'text-chart-2',
      footer: (
        <div className="text-muted-foreground text-xs">
          จากหม้อแปลงที่มีโหลดสูงที่สุด
        </div>
      ),
      icon: IconTrendingUp,
      subtitle: 'พีคโหลดสูงสุด',
      title: 'โหลดสูงสุด',
      value: formatKiloUnit(summary.maxLoad, 'W'),
    },
    {
      bgColor: 'bg-chart-5/10',
      color: 'text-chart-5',
      footer: (
        <Progress
          className="bg-chart-5/20 h-1.5 w-full"
          indicatorClassName="bg-chart-5"
          trackClassName="bg-chart-5/20"
          value={summary.utilizationFactor}
        />
      ),
      icon: IconChartBar,
      subtitle: 'ประสิทธิภาพการใช้ไฟ',
      title: 'Utilization Factor',
      value: `${formatNumber(summary.utilizationFactor, 1)}%`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            className="ring-border/50 hover:bg-primary/5 overflow-hidden border-none shadow-sm ring-1 transition-all"
            key={index}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${card.bgColor}`}>
                <Icon className={card.color} size={18} stroke={2} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight tabular-nums">
                {card.value}
              </div>
              <p className="text-muted-foreground mt-1 mb-3 text-xs">
                {card.subtitle}
              </p>
              {card.footer && (
                <div className="border-border/50 mt-auto border-t pt-2">
                  {card.footer}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
