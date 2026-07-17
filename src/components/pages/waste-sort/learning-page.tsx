import {
  IconArrowRight,
  IconBolt,
  IconCloud,
  IconDroplet,
  IconGasStation,
  IconLeaf,
  IconPrinter,
  IconRecycle,
  IconTrash,
} from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import { WasteSortPageShell } from './page-shell'

const ENVIRONMENT_TARGETS = [
  {
    icon: IconBolt,
    iconClass: 'bg-[#fff3a8] text-[#8a6100]',
    metric: 'การใช้ไฟฟ้า',
    reduction: 'ลดลงร้อยละ 3',
    unit: 'kW-h',
  },
  {
    icon: IconGasStation,
    iconClass: 'bg-[#ffe5d8] text-[#a1461c]',
    metric: 'การใช้น้ำมันเชื้อเพลิง',
    reduction: 'ลดลงร้อยละ 3',
    unit: 'ลิตร',
  },
  {
    icon: IconDroplet,
    iconClass: 'bg-[#d8f0fa] text-[#2478a8]',
    metric: 'การใช้น้ำ',
    reduction: 'ลดลงร้อยละ 3',
    unit: 'ลูกบาศก์เมตร',
  },
  {
    icon: IconPrinter,
    iconClass: 'bg-[#ecefce] text-[#59631d]',
    metric: 'การใช้กระดาษ',
    reduction: 'ลดลงร้อยละ 3',
    unit: 'รีม',
  },
  {
    icon: IconTrash,
    iconClass: 'bg-[#dcefd5] text-[#216c45]',
    metric: 'ปริมาณขยะทั่วไป',
    reduction: 'ลดลงร้อยละ 6',
    unit: 'กิโลกรัม',
  },
  {
    icon: IconCloud,
    iconClass: 'bg-[#e3e9ef] text-[#53616c]',
    metric: 'ปริมาณก๊าซเรือนกระจก',
    reduction: 'ลดลงร้อยละ 3',
    unit: 'KgCO₂e',
  },
]

const GO_STANDARD_CATEGORIES = [
  'หมวดที่ 1 การบริหารจัดการองค์กรสีเขียว',
  'หมวดที่ 2 การจัดการพลังงานและสิ่งแวดล้อม',
  'หมวดที่ 3 การจัดซื้อจัดจ้างที่เป็นมิตรกับสิ่งแวดล้อม',
  'หมวดที่ 4 สภาพแวดล้อมและความปลอดภัยในการทำงาน',
]

const RESOURCE_PRACTICE_SECTIONS = [
  {
    action: 'ปิดไฟ / พักหน้าจอ / ใช้บันได',
    description: 'ลดพลังงานจากจุดใช้งานประจำวันในอาคาร',
    icon: IconBolt,
    iconClass: 'bg-[#fff3a8] text-[#8a6100]',
    title: 'การใช้ไฟฟ้า',
  },
  {
    action: 'ปิดน้ำ / แจ้งรั่ว / ใช้อย่างพอดี',
    description: 'ใช้น้ำเท่าที่จำเป็นและรีบแก้ไขเมื่อพบการรั่วไหล',
    icon: IconDroplet,
    iconClass: 'bg-[#d8f0fa] text-[#2478a8]',
    title: 'การใช้น้ำ',
  },
  {
    action: 'ตรวจก่อนพิมพ์ / ใช้สองหน้า / ส่งไฟล์',
    description: 'ลดเอกสารกระดาษและใช้เครื่องถ่ายเอกสารอย่างคุ้มค่า',
    icon: IconPrinter,
    iconClass: 'bg-[#ecefce] text-[#59631d]',
    title: 'การใช้กระดาษและเครื่องถ่ายเอกสาร',
  },
  {
    action: 'ลดพลาสติก / แยกสีถัง / แยกรีไซเคิล',
    description: 'ลดขยะตั้งแต่ต้นทางและแยกประเภทก่อนนำไปทิ้ง',
    icon: IconRecycle,
    iconClass: 'bg-[#dcefd5] text-[#216c45]',
    title: 'การแยกขยะ',
  },
]

export function WasteSortLearningPage() {
  return (
    <WasteSortPageShell>
      <LearningContent />
    </WasteSortPageShell>
  )
}

function LearningContent() {
  return (
    <section className="border-b border-[#eceee7] bg-[#f7f8f3]" id="learning">
      <OrganizationOverview />

      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-5 sm:px-8 sm:py-6">
        <div className="neo-card mt-5 grid gap-3 p-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-bold text-[#168542]">
              มาตรฐานองค์กรสีเขียว
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#111111]">
              MEA GO Standard
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#4d5053]">
              โครงมาตรฐานที่ช่วยให้การทำงานสีเขียวเป็นระบบเดียวกัน
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {GO_STANDARD_CATEGORIES.map((category, index) => (
              <div
                className="neo-surface flex items-start gap-3 bg-[#f7f8f3] p-3"
                key={category}
              >
                <span className="rounded-base flex size-8 shrink-0 items-center justify-center bg-[#5df591] text-sm font-bold text-[#111111]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 font-semibold">{category}</p>
              </div>
            ))}
          </div>
        </div>
        <ResourcePracticeSection />
        <StandardsAndTargetsSection />
      </div>
    </section>
  )
}

function OrganizationOverview() {
  return (
    <section className="bg-white text-[#111111]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:min-h-[500px] lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)] lg:items-center">
        <div>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[0.98] font-bold tracking-[-0.03em] text-balance sm:text-7xl">
            <span className="relative isolate inline-block px-1 text-[#111111]">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[0.03em] z-0 h-[0.52em] bg-[#fe5000]"
              />
              <span className="relative z-10">MEA</span>
            </span>{' '}
            Green Organization
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#4d5053]">
            บริหารพลังงาน ทรัพยากร และของเสียอย่างเป็นระบบ
            เพื่อให้อาคารทำงานเป็นมิตรกับสิ่งแวดล้อมมากขึ้น
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              className="rounded-base h-12 bg-[#5df591] px-7 text-base font-bold text-[#111111] hover:bg-[#49db7b]"
              nativeButton={false}
              render={<Link href="/search" />}
            >
              ค้นหาถังขยะ
              <IconArrowRight data-icon="inline-end" />
            </Button>
            <Button
              className="rounded-base h-12 bg-[#111111] px-7 text-base font-bold text-white hover:bg-[#2a2a2a]"
              nativeButton={false}
              render={<Link href="/game" />}
            >
              ไปที่ Learning Platform
            </Button>
          </div>
        </div>

        <div className="neo-surface bg-[#e8f2df] p-5 text-[#111111] sm:p-7">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-base border-2 border-[#111111] bg-[#5df591] px-4 py-2 text-sm font-bold text-[#111111]">
                Green mission
              </span>
              <IconRecycle
                aria-hidden="true"
                className="size-8 text-[#216c45]"
              />
            </div>

            <div className="neo-surface bg-[#5df591] p-5 text-[#111111]">
              <p className="text-sm font-bold">Mission วันนี้</p>
              <h3 className="mt-3 text-3xl leading-tight font-bold">
                แยกขยะให้ถูกถัง
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#173d2a]">
                ค้นหา เรียนรู้ แล้วเล่นเกมฝึกแยกขยะในเส้นทางเดียว
              </p>
            </div>

            <blockquote className="neo-flat bg-white p-4 text-base leading-7 font-semibold text-[#173d2a]">
              “องค์กรด้านพลังงานที่เป็นมิตรกับสิ่งแวดล้อมอย่างยั่งยืน”
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResourcePracticeSection() {
  return (
    <section className="bg-[#f7f8f3] py-12 sm:py-16">
      <div className="mb-8 grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
        <h2 className="max-w-xl text-4xl leading-tight font-bold tracking-[-0.03em] text-balance sm:text-5xl">
          Why Go Green?
        </h2>
        <p className="max-w-2xl text-lg leading-8 text-[#4d5053]">
          เพราะพฤติกรรมเล็ก ๆ ในอาคารทำให้เป้าหมายพลังงาน น้ำ กระดาษ
          และขยะขยับได้จริง
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {RESOURCE_PRACTICE_SECTIONS.map((section) => {
          const SectionIcon = section.icon

          return (
            <article
              className="neo-card grid min-h-56 grid-rows-[auto_1fr_auto] p-5"
              key={section.title}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#111111]">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#4d5053]">
                    {section.description}
                  </p>
                </div>
                <span
                  className={cn(
                    'rounded-base flex size-12 shrink-0 items-center justify-center',
                    section.iconClass
                  )}
                >
                  <SectionIcon aria-hidden="true" className="size-7" />
                </span>
              </div>
              <div className="mt-5 h-px bg-[#e1e1e1]" />
              <p className="mt-4 text-base font-bold text-[#111111]">
                {section.action}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function StandardsAndTargetsSection() {
  return (
    <section className="overflow-hidden text-white">
      <div className="mb-4 bg-[#111111] p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="rounded-base inline-flex items-center gap-2 bg-[#5df591] px-4 py-2 text-sm font-bold text-[#111111]">
              <IconLeaf aria-hidden="true" className="size-4" />
              เป้าหมายปี 2569
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-bold text-balance sm:text-5xl">
              ลดการใช้ทรัพยากร
              <span className="block text-[#5df591]">จากปีฐาน 2568</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
              ตั้งเป้าลดพลังงาน น้ำ กระดาษ ขยะ และก๊าซเรือนกระจก
              ให้เห็นผลเป็นตัวเลขเดียวกันทั้งหน่วยงาน
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#f7f8f3] text-[#111111]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENVIRONMENT_TARGETS.map((target) => {
            const TargetIcon = target.icon

            return (
              <div className="neo-card p-4" key={target.metric}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base leading-6 font-bold text-[#111111]">
                      {target.metric}
                    </p>
                    <p className="mt-2 text-2xl leading-none font-bold text-[#168542]">
                      {target.reduction}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'flex size-14 shrink-0 items-center justify-center',
                      target.iconClass
                    )}
                  >
                    <TargetIcon aria-hidden="true" className="size-8" />
                  </span>
                </div>
                <p className="mt-4 border-t border-[#e1e1e1] pt-3 text-sm text-[#4d5053]">
                  หน่วยอ้างอิง: {target.unit}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
