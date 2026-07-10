import {
  IconArrowLeft,
  IconBolt,
  IconFlame,
  IconGauge,
  IconPlugConnected,
  IconWaveSine,
} from '@tabler/icons-react'

import type { TransformerReading } from '~/types/transformer'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

type TransformerParameterCardsProps = {
  reading: TransformerReading
}

export function TransformerParameterCards({
  reading,
}: TransformerParameterCardsProps) {
  const avgVoltage =
    (reading.phaseA.voltage + reading.phaseB.voltage + reading.phaseC.voltage) /
    3
  const avgCurrent =
    (reading.phaseA.current + reading.phaseB.current + reading.phaseC.current) /
    3

  const parameters = [
    {
      bgColor: 'bg-chart-1/10',
      color: 'text-chart-1',
      detail: `VA: ${reading.phaseA.voltage.toFixed(1)} | VB: ${reading.phaseB.voltage.toFixed(1)} | VC: ${reading.phaseC.voltage.toFixed(1)}`,
      icon: IconBolt,
      title: 'แรงดันไฟฟ้า',
      unit: 'V',
      value: avgVoltage.toFixed(1),
    },
    {
      bgColor: 'bg-chart-2/10',
      color: 'text-chart-2',
      detail: `IA: ${reading.phaseA.current.toFixed(1)} | IB: ${reading.phaseB.current.toFixed(1)} | IC: ${reading.phaseC.current.toFixed(1)}`,
      icon: IconArrowLeft,
      title: 'กระแสไฟฟ้า',
      unit: 'A',
      value: avgCurrent.toFixed(1),
    },
    {
      bgColor: 'bg-primary/10',
      color: 'text-primary',
      detail: `Reactive: ${reading.reactivePower.toFixed(1)} kVAR | Apparent: ${reading.apparentPower.toFixed(1)} kVA`,
      icon: IconFlame,
      title: 'กำลังไฟฟ้า',
      unit: 'kW',
      value: reading.activePower.toFixed(1),
    },
    {
      bgColor: 'bg-chart-5/10',
      color: 'text-chart-5',
      detail: `${reading.energy.toLocaleString('th-TH', { maximumFractionDigits: 0 })} kWh`,
      icon: IconGauge,
      title: 'พลังงานสะสม',
      unit: 'MWh',
      value: (reading.energy / 1000).toFixed(2),
    },
    {
      bgColor: 'bg-chart-4/10',
      color: 'text-chart-4',
      detail: reading.powerFactor >= 0.9 ? 'ดีเยี่ยม' : 'ต้องปรับปรุง',
      icon: IconPlugConnected,
      title: 'Power Factor',
      unit: '',
      value: reading.powerFactor.toFixed(3),
    },
    {
      bgColor: 'bg-chart-3/10',
      color: 'text-chart-3',
      detail: Math.abs(reading.frequency - 50) < 0.1 ? 'ปกติ' : 'ผิดปกติ',
      icon: IconWaveSine,
      title: 'ความถี่',
      unit: 'Hz',
      value: reading.frequency.toFixed(2),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {parameters.map((param) => {
        const Icon = param.icon
        return (
          <Card className="overflow-hidden" key={param.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {param.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${param.bgColor}`}>
                <Icon aria-hidden="true" className={`h-5 w-5 ${param.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-3xl font-bold tabular-nums ${param.color}`}
                >
                  {param.value}
                </span>
                <span className="text-muted-foreground text-lg">
                  {param.unit}
                </span>
              </div>
              <p className="text-muted-foreground mt-1.5 text-xs">
                {param.detail}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
