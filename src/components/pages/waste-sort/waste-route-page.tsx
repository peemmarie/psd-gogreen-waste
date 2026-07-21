import { IconExternalLink, IconRecycle } from '@tabler/icons-react'
import Image from 'next/image'

import wasteManagementImage from '~/assets/images/waste-management.png'

import { WasteSortPageShell } from './page-shell'

const WASTE_ROUTE_STEPS = [
  {
    detail: 'รวบรวมขยะจากอาคาร',
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
    detail: 'นำส่งโรงกำจัดขยะพิษของ กทม. เพื่อกำจัดอย่างถูกวิธี',
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
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="grid gap-8 border-b border-[#dfe3d9] pb-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-[#198754]">
              <span className="rounded-base flex size-8 items-center justify-center bg-[#5df591] text-[#111111]">
                <IconRecycle aria-hidden="true" className="size-4" />
              </span>
              เส้นทางการจัดการขยะ
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-[1.08] font-bold tracking-[-0.03em] text-balance text-[#111111] sm:text-5xl lg:text-6xl">
              ขยะทุกชิ้น มีปลายทาง
              <span className="block text-[#fe5000]">ที่ชัดเจน</span>
            </h1>
          </div>

          <div className="flex flex-col items-start gap-5 lg:pb-1">
            <p className="max-w-xl text-base leading-7 text-[#4d5053] sm:text-lg sm:leading-8">
              ดูเส้นทางตั้งแต่การรวบรวม แยก ชั่งน้ำหนัก และบันทึกข้อมูล
              ไปจนถึงการส่งขยะแต่ละประเภทสู่ปลายทางที่เหมาะสม
            </p>
            <a
              className="rounded-base inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[#111111] bg-[#5df591] px-5 text-sm font-bold text-[#111111] shadow-[4px_4px_0_#111111] transition-[transform,box-shadow,background-color] hover:translate-x-1 hover:translate-y-1 hover:bg-[#49db7b] hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#198754]"
              href={wasteManagementImage.src}
              rel="noreferrer"
              target="_blank"
            >
              เปิดภาพขนาดเต็ม
              <IconExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:mx-auto lg:h-[820px] lg:max-w-5xl lg:grid-cols-[300px_minmax(0,1fr)] lg:items-stretch xl:gap-12">
          <aside className="order-2 lg:sticky lg:top-28 lg:order-1 lg:h-full">
            <div className="h-full bg-[#111111] p-5 text-white sm:p-6">
              <div className="flex items-end justify-between gap-4 border-b border-white/20 pb-4">
                <div>
                  <p className="text-sm font-bold text-[#5df591]">
                    เส้นทางโดยย่อ
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">6 ขั้นตอนหลัก</h2>
                </div>
                <span className="text-sm text-white/70">ต้นทาง → ปลายทาง</span>
              </div>

              <ol className="divide-y divide-white/15">
                {WASTE_ROUTE_STEPS.map((step, index) => (
                  <li className="flex gap-3 py-4" key={step.title}>
                    <span className="rounded-base flex size-8 shrink-0 items-center justify-center bg-[#5df591] text-sm font-bold text-[#111111]">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="leading-6 font-bold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/70">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <figure className="order-1 flex min-w-0 flex-col lg:order-2 lg:h-full">
            <figcaption className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#198754]">
                  ภาพรวมการจัดการ
                </p>
                <h2 className="mt-1 text-xl leading-tight font-bold text-[#111111] sm:text-2xl">
                  จากแหล่งที่มา สู่ปลายทางของขยะ
                </h2>
              </div>
              <span className="hidden shrink-0 text-sm text-[#626762] sm:block">
                กฟน. · เขตคลองเตย
              </span>
            </figcaption>

            <div className="flex min-h-0 items-center justify-center overflow-hidden border-2 border-[#111111] bg-white shadow-[6px_6px_0_#111111] lg:flex-1 lg:bg-[#e8f2df] lg:p-4">
              <Image
                alt="แผนภาพเส้นทางการจัดการขยะ แสดงแหล่งที่มา การแยกประเภท และปลายทางของขยะแต่ละชนิด"
                className="h-auto w-full lg:h-full lg:w-auto lg:max-w-full lg:object-contain"
                placeholder="blur"
                priority
                sizes="(min-width: 1280px) 900px, (min-width: 1024px) calc(100vw - 380px), 100vw"
                src={wasteManagementImage}
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
