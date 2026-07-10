import { PageHeader } from '~/components/page-header'
import {
  getAllTransformers,
  getCurrentHistory,
  getTransformerSummary,
} from '~/lib/mock-data'

import { ChartAreaInteractive, DataTable, SectionCards } from './components'

export function DashboardPage() {
  const summary = getTransformerSummary()
  // Use first transformer for chart demo, or aggregate
  const chartData = getCurrentHistory('KTT0001')
  const transformers = getAllTransformers()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <PageHeader
            description="แสดงมิเตอร์ไฟฟ้าที่ติดตั้งที่หม้อแปลงจำหน่ายทั้งหมด"
            title="Dashboard"
          />
          <SectionCards summary={summary} />
          <ChartAreaInteractive data={chartData} />
          <DataTable data={transformers} />
        </div>
      </div>
    </div>
  )
}
