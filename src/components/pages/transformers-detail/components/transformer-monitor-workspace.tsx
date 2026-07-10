'use client'

import type { Transformer } from '~/types/transformer'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { transformerNominals } from '~/lib/electrical'

import { HistoricalMeasurements } from './historical-meaurement'
import { RealtimeDisplay } from './realtime-display'
import { TransformerAnalytics } from './transformer-analytics'
import { TransformerAssetRegistry } from './transformer-asset-registry'

type TransformerMonitorWorkspaceProps = Readonly<{
  transformer: Transformer
}>

export function TransformerMonitorWorkspace({
  transformer,
}: TransformerMonitorWorkspaceProps) {
  const monitoringId = transformer.stationId || transformer.id
  const nominals = transformerNominals(
    transformer.capacity,
    transformer.secondaryVoltage / Math.sqrt(3)
  )

  return (
    <section aria-labelledby="monitoring-title">
      <Tabs className="gap-5" defaultValue="realtime">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold" id="monitoring-title">
              Transformer Monitor
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              ติดตามสถานะ วิเคราะห์แนวโน้ม
              และตรวจสอบทะเบียนสินทรัพย์ในพื้นที่ทำงานเดียว
            </p>
          </div>

          <TabsList
            aria-label="Transformer Monitor modules"
            className="grid h-11 w-full grid-cols-4"
          >
            <TabsTrigger className="min-w-0" value="realtime">
              Realtime
            </TabsTrigger>
            <TabsTrigger className="min-w-0" value="analytics">
              Analytics
            </TabsTrigger>
            <TabsTrigger className="min-w-0" value="asset">
              <span className="sm:hidden">ทะเบียน</span>
              <span className="hidden sm:inline">ทะเบียนทรัพย์สิน</span>
            </TabsTrigger>
            <TabsTrigger className="min-w-0" disabled value="actions">
              Actions
              <span className="text-muted-foreground hidden text-xs lg:inline">
                (P2)
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="realtime">
          <div className="flex flex-col gap-6">
            <RealtimeDisplay
              capacity={transformer.capacity}
              transformerId={monitoringId}
            />
            <HistoricalMeasurements
              nominals={nominals}
              transformerId={monitoringId}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <TransformerAnalytics
            capacity={transformer.capacity}
            nominals={nominals}
            transformerId={monitoringId}
          />
        </TabsContent>

        <TabsContent value="asset">
          <TransformerAssetRegistry transformer={transformer} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
