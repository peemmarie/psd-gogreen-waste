import { IconRecycle } from '@tabler/icons-react'

import { WasteSortPageShell } from './page-shell'

const WASTE_ROUTE_STEPS = [
  {
    detail: 'ขยะจากอาคารของ ฝกส. เริ่มชั่งน้ำหนักและจดบันทึกเดือน ก.ค. 68',
    title: 'รวบรวมขยะจากอาคาร',
  },
  {
    detail: 'แม่บ้านชั่งน้ำหนักและบันทึกสถิติรายวัน',
    title: 'ชั่งน้ำหนักและบันทึกข้อมูล',
  },
  {
    detail: 'ขยะรีไซเคิลสามารถจำหน่ายเป็นรายได้หลังแยกประเภทถูกต้อง',
    title: 'ขยะรีไซเคิล',
  },
  {
    detail: 'ขยะทั่วไปจัดเก็บโดย กทม. และขยะเศษอาหารนำไปรวมกับขยะทั่วไป',
    title: 'ขยะทั่วไปและเศษอาหาร',
  },
  {
    detail: 'ฝกส. นำส่งโรงกำจัดขยะพิษของ กทม. เพื่อกำจัดอย่างถูกวิธี',
    title: 'ขยะมีพิษ',
  },
  {
    detail: 'ฝกพ. ประสาน บ.กรุงเทพธนาคม เพื่อจัดเก็บขยะติดเชื้อ',
    title: 'ขยะติดเชื้อ',
  },
]

export function WasteRoutePage() {
  return (
    <WasteSortPageShell>
      <WasteRouteContent />
    </WasteSortPageShell>
  )
}

function WasteRouteContent() {
  return (
    <section
      className="border-b border-[#eceee7] bg-[#f7f8f3]"
      id="waste-route"
    >
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
          <div className="flex flex-col justify-between gap-8 bg-[#111111] p-6 text-white">
            <div>
              <p className="rounded-base inline-flex items-center gap-2 bg-[#5df591] px-4 py-2 text-sm font-bold text-[#111111]">
                <IconRecycle aria-hidden="true" className="size-4" />
                เส้นทางการจัดการขยะ
              </p>
              <h2 className="mt-5 text-4xl leading-tight font-bold tracking-[-0.03em] text-balance sm:text-5xl">
                จากการรวบรวมในอาคาร สู่ปลายทางที่เหมาะสม
              </h2>
              <p className="mt-5 text-base leading-7 text-white/72">
                แยกขั้นตอนการจัดการขยะของหน่วยงานให้เห็นภาพชัดเจน
                ตั้งแต่การชั่งน้ำหนัก บันทึกข้อมูล ไปจนถึงการส่งกำจัด
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="neo-flat bg-white/8 p-4">
                <p className="text-4xl font-bold text-[#5df591]">
                  {WASTE_ROUTE_STEPS.length}
                </p>
                <p className="mt-1 text-white/72">ขั้นตอนหลัก</p>
              </div>
              <div className="neo-flat bg-white/8 p-4">
                <p className="text-4xl font-bold text-white">3</p>
                <p className="mt-1 text-white/72">ปลายทางขยะ</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {WASTE_ROUTE_STEPS.map((step, index) => (
              <article
                className="neo-card grid grid-cols-[44px_minmax(0,1fr)] gap-4 p-5"
                key={step.title}
              >
                <span className="rounded-base flex size-11 items-center justify-center bg-[#5df591] text-sm font-bold text-[#111111]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-[#111111]">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#4d5053]">
                    {step.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
