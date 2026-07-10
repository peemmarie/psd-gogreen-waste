import {
  ActivityIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  ServerIcon,
  TrendingUpIcon,
} from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { type TransformerSummary } from '~/types/transformer'

type SectionCardsProps = {
  summary: TransformerSummary
}

export function SectionCards({ summary }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>หม้อแปลงทั้งหมด</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.total}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-xs" variant="outline">
              <ServerIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            ติดตั้งแล้ว <CheckCircle2Icon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground">ครอบคลุมพื้นที่ให้บริการ</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>ออนไลน์</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.online}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg border-0 bg-emerald-500/10 text-xs text-emerald-500 shadow-none hover:bg-emerald-500/20">
              {((summary.online / summary.total) * 100).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            สถานะปกติ <ActivityIcon className="size-4 text-emerald-500" />
          </div>
          <div className="text-muted-foreground">รับส่งข้อมูลได้ตามปกติ</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>ออฟไลน์</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.offline}
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg border-0 bg-red-500/10 text-xs text-red-500 shadow-none hover:bg-red-500/20">
              {((summary.offline / summary.total) * 100).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            ขาดการเชื่อมต่อ{' '}
            <AlertTriangleIcon className="size-4 text-red-500" />
          </div>
          <div className="text-muted-foreground">ตรวจสอบระบบสื่อสาร</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>การใช้พลังงานปรากฏรวม</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {(summary.totalApparentPower ?? 0).toLocaleString('th-TH', {
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            })}{' '}
            kVA
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-xs" variant="outline">
              <TrendingUpIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            โหลดรวมทั้งหมด <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">ผลรวมโหลดจริงขณะนี้</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>โหลดสูงสุด (Max)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.maxLoad.toLocaleString('th-TH', {
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            })}{' '}
            kW
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-xs" variant="outline">
              <TrendingUpIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            สูงสุดรายหม้อแปลง
          </div>
          <div className="text-muted-foreground">หม้อแปลงที่จ่ายโหลดสูงสุด</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>โหลดเฉลี่ย (Avg)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.averageLoad.toLocaleString('th-TH', {
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            })}{' '}
            kW
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-xs" variant="outline">
              <ActivityIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            เฉลี่ยต่อหม้อแปลง
          </div>
          <div className="text-muted-foreground">
            ค่าเฉลี่ยของหม้อแปลงออนไลน์
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Utilization Factor</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.utilizationFactor.toFixed(1)}%
          </CardTitle>
          <div className="absolute top-4 right-4">
            <Badge className="flex gap-1 rounded-lg text-xs" variant="outline">
              <ServerIcon className="size-3" />
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            สัดส่วนการใช้งาน
          </div>
          <div className="text-muted-foreground">เทียบกับพิกัดหม้อแปลงรวม</div>
        </CardFooter>
      </Card>
    </div>
  )
}
