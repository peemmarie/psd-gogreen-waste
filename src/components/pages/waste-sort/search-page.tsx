'use client'

import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'

import {
  IconArrowRight,
  IconBolt,
  IconCloud,
  IconDroplet,
  IconGasStation,
  IconLeaf,
  IconPrinter,
  IconRecycle,
  IconSearch,
  IconSparkles,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

import {
  BIN_DETAILS,
  getWasteSortingTip,
  LEARNING_MODULES,
  WASTE_ITEMS,
  type WasteItem,
} from './data'
import { WasteBin } from './waste-bin'

const EXAMPLES = ['ถ่านไฟฉาย', 'ขวดน้ำพลาสติก', 'เศษอาหาร']
const HERO_BIN_OFFSETS = [
  'translate-y-2',
  '-translate-y-2',
  'translate-y-2',
  'translate-y-4',
]
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
    cardClass: 'border-[#eadb96] bg-[#fffbeb]',
    description: 'ลดพลังงานจากจุดใช้งานประจำวันในอาคาร',
    icon: IconBolt,
    iconClass: 'bg-[#fff3a8] text-[#8a6100]',
    title: 'การใช้ไฟฟ้า',
  },
  {
    action: 'ปิดน้ำ / แจ้งรั่ว / ใช้อย่างพอดี',
    cardClass: 'border-[#b7d3df] bg-[#edf7fb]',
    description: 'ใช้น้ำเท่าที่จำเป็นและรีบแก้ไขเมื่อพบการรั่วไหล',
    icon: IconDroplet,
    iconClass: 'bg-[#d8f0fa] text-[#2478a8]',
    title: 'การใช้น้ำ',
  },
  {
    action: 'ตรวจก่อนพิมพ์ / ใช้สองหน้า / ส่งไฟล์',
    cardClass: 'border-[#d7d9c3] bg-[#fbfbf0]',
    description: 'ลดเอกสารกระดาษและใช้เครื่องถ่ายเอกสารอย่างคุ้มค่า',
    icon: IconPrinter,
    iconClass: 'bg-[#ecefce] text-[#59631d]',
    title: 'การใช้กระดาษและเครื่องถ่ายเอกสาร',
  },
  {
    action: 'ลดพลาสติก / แยกสีถัง / แยกรีไซเคิล',
    cardClass: 'border-[#bfdec6] bg-[#eff8f1]',
    description: 'ลดขยะตั้งแต่ต้นทางและแยกประเภทก่อนนำไปทิ้ง',
    icon: IconRecycle,
    iconClass: 'bg-[#dcefd5] text-[#216c45]',
    title: 'การแยกขยะ',
  },
]
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

type WasteSearchWorkspaceProps = {
  handleQueryChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleSearch: (event: FormEvent<HTMLFormElement>) => void
  hasSearchState: boolean
  query: string
  resetSearch: () => void
  results: WasteItem[]
  searchedQuery: string
  searchExample: (example: string) => void
}

export function WasteSortSearchPage() {
  const [query, setQuery] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('')
  const hasSearchState = query.length > 0 || searchedQuery.length > 0

  const results = useMemo(() => {
    const normalized = searchedQuery.trim().toLocaleLowerCase('th')
    if (!normalized) return []

    return WASTE_ITEMS.filter((item) =>
      item.name.toLocaleLowerCase('th').includes(normalized)
    )
  }, [searchedQuery])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = query.trim()

    setQuery(nextQuery)
    setSearchedQuery(nextQuery)
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value

    setQuery(nextQuery)
    if (!nextQuery.trim()) {
      setSearchedQuery('')
    }
  }

  function resetSearch() {
    setQuery('')
    setSearchedQuery('')
  }

  function searchExample(example: string) {
    setQuery(example)
    setSearchedQuery(example)
  }

  return (
    <main className="min-h-dvh scroll-pt-24 overflow-x-hidden bg-[#f7f8f3] pt-[73px] text-[#111111]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#eceee7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3 text-lg font-bold" href="/">
            <span className="rounded-base flex size-10 items-center justify-center bg-[#111111] text-[#5df591]">
              <IconLeaf aria-hidden="true" />
            </span>
            <span>PSD GreenHub</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#4d5053] md:flex">
            <Link className="hover:text-[#111111]" href="#learning">
              เรียนรู้
            </Link>
            <Link className="hover:text-[#111111]" href="#search">
              ค้นหาถัง
            </Link>
            <Link className="hover:text-[#111111]" href="#waste-route">
              เส้นทางขยะ
            </Link>
            <Link className="hover:text-[#111111]" href="/game">
              เกมทั้งหมด
            </Link>
          </nav>
          <div className="flex items-center justify-end gap-2">
            <Button
              className="bg-[#5df591] px-5 font-bold text-[#111111] hover:bg-[#49db7b]"
              nativeButton={false}
              render={<Link href="/game/waste-sort" />}
            >
              เริ่มเล่น
              <IconArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </header>

      <LearningContent />
      <WasteSearchWorkspace
        handleQueryChange={handleQueryChange}
        handleSearch={handleSearch}
        hasSearchState={hasSearchState}
        query={query}
        resetSearch={resetSearch}
        results={results}
        searchedQuery={searchedQuery}
        searchExample={searchExample}
      />
      <WasteRouteContent />
    </main>
  )
}

function BinGuide() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2e7047]">จำสีให้แม่น</p>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
            ถังขยะ 4 ประเภท
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#5b7265] sm:text-right">
          สีช่วยให้เราแยกปลายทางของขยะได้ถูกต้องตั้งแต่ต้นทาง
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(['red', 'green', 'blue', 'yellow'] as const).map((color) => (
          <div
            className="neo-card px-4 py-6 transition-colors hover:border-[#a9c6ad]"
            key={color}
          >
            <WasteBin color={color} compact />
          </div>
        ))}
      </div>
      <div className="neo-card mt-8 p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2e7047]">
              อ่านแบบวิชาการ เข้าใจง่าย
            </p>
            <h2 className="mt-1 text-2xl font-bold">บทเรียนที่เชื่อมกับเกม</h2>
          </div>
          <Button
            className="w-fit bg-[#216c45] hover:bg-[#185437]"
            nativeButton={false}
            render={<Link href="/game" />}
          >
            ไปที่ Learning Platform
            <IconArrowRight data-icon="inline-end" />
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {LEARNING_MODULES.slice(0, 3).map((module) => (
            <article className="neo-surface bg-[#f7fbf4] p-4" key={module.id}>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-base bg-[#dcefd5] px-2.5 py-1 text-[#216c45]">
                  {module.duration}
                </span>
                <span className="rounded-base bg-[#fff3a8] px-2.5 py-1 text-[#604800]">
                  {module.level}
                </span>
              </div>
              <h3 className="mt-3 font-bold">{module.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#557164]">
                {module.academicNote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
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
              render={<Link href="#search" />}
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

function SearchResults({ results }: { results: WasteItem[] }) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2e7047]">ผลการค้นหา</p>
          <h2 className="mt-1 text-2xl font-bold">
            พบ {results.length} รายการ
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#5b7265] sm:text-right">
          ตรวจประเภทและสีถัง พร้อมเหตุผลสั้น ๆ ก่อนนำไปทิ้ง
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((item) => {
          const bin = BIN_DETAILS[item.bin]
          const relatedModule = LEARNING_MODULES.find(
            (learningModule) => learningModule.id === item.learnMoreId
          )
          return (
            <article
              className="neo-card grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_112px] md:items-center"
              key={item.name}
            >
              <div>
                <span aria-label="สิ่งของ" className="text-4xl" role="img">
                  {item.emoji}
                </span>
                <h2 className="mt-3 text-xl font-bold">{item.name}</h2>
                <p className="mt-2 text-[#5b7265]">ประเภท: {item.type}</p>
                <p className="mt-4 font-semibold text-[#216c45]">
                  ทิ้งลงถัง{bin.colorName}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5b7265]">
                  {getWasteSortingTip(item)}
                </p>
                {relatedModule ? (
                  <Link
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#216c45] hover:text-[#185437]"
                    href="/game"
                  >
                    อ่านต่อ: {relatedModule.title}
                    <IconArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                ) : null}
              </div>
              <div className="justify-self-start md:justify-self-end">
                <WasteBin color={item.bin} compact />
              </div>
            </article>
          )
        })}
      </div>
    </div>
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

function WasteSearchWorkspace({
  handleQueryChange,
  handleSearch,
  hasSearchState,
  query,
  resetSearch,
  results,
  searchedQuery,
  searchExample,
}: WasteSearchWorkspaceProps) {
  return (
    <>
      <section
        className="relative border-b border-[#eceee7] bg-white"
        id="search"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[#168542] sm:text-base">
              <IconSparkles aria-hidden="true" className="size-5" />
              คู่มือคัดแยกขยะ ฝวฟ.
            </p>
            <h2 className="max-w-2xl text-5xl leading-[1.02] font-bold tracking-[-0.03em] text-balance text-[#111111] sm:text-6xl">
              ชิ้นนี้ต้องลง
              <span className="block text-[#168542]">ถังสีอะไร?</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#4d5053] sm:text-lg sm:leading-8">
              ค้นหาชื่อขยะ แล้วดูประเภทและสีถังที่ถูกต้องก่อนทิ้ง
            </p>

            <form
              className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row"
              onSubmit={handleSearch}
            >
              <div className="relative sm:w-[32rem]">
                <IconSearch
                  aria-hidden="true"
                  className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#78867b]"
                />
                <Input
                  aria-label="ชื่อขยะ"
                  className="rounded-base h-14 border-[#e1e1e1] bg-[#f7f8f3] pr-12 pl-11 text-base placeholder:text-[#6f7470] focus-visible:border-[#5df591] focus-visible:ring-[#5df591]/30"
                  onChange={handleQueryChange}
                  placeholder="เช่น ถ่านไฟฉาย หรือ ขวดพลาสติก"
                  required
                  value={query}
                />
                <Button
                  aria-hidden={!hasSearchState}
                  aria-label="ล้างคำค้นหา"
                  className="absolute top-1/2 right-2 size-8 -translate-y-1/2 text-[#557164] hover:bg-[#eef7ea] hover:text-[#216c45] data-[hidden=true]:invisible"
                  data-hidden={!hasSearchState}
                  disabled={!hasSearchState}
                  onClick={resetSearch}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <IconX aria-hidden="true" />
                </Button>
              </div>
              <Button
                className="rounded-base h-14 bg-[#111111] px-7 text-base font-bold text-white hover:bg-[#2a2a2a]"
                type="submit"
              >
                <IconSearch data-icon="inline-start" />
                ค้นหา
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#4d5053] sm:text-base">
              <span>ลองค้นหา:</span>
              {EXAMPLES.map((example) => (
                <button
                  className="neo-interactive bg-secondary-background px-4 py-1.5 font-semibold transition-colors hover:border-[#5df591] hover:bg-[#effff3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5df591]"
                  key={example}
                  onClick={() => searchExample(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="neo-surface hidden min-h-[360px] items-center justify-center bg-[#f7f8f3] p-8 md:grid"
          >
            <div className="grid grid-cols-4 items-end gap-4 lg:gap-5">
              {(['red', 'green', 'blue', 'yellow'] as const).map(
                (color, index) => (
                  <WasteBin
                    className={HERO_BIN_OFFSETS[index]}
                    color={color}
                    compact
                    key={color}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-live="polite"
        className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
      >
        {!searchedQuery ? (
          <BinGuide />
        ) : results.length > 0 ? (
          <SearchResults results={results} />
        ) : (
          <div className="neo-surface mx-auto max-w-xl bg-[#fff8f1] p-6 text-center">
            <p className="text-lg font-semibold">
              ยังไม่พบ “{searchedQuery}” ในรายการ
            </p>
            <p className="mt-2 text-[#6d766f]">
              ลองใช้คำสั้นลง เช่น “ขวด” “กระดาษ” หรือ “ถ่าน”
            </p>
          </div>
        )}
      </section>
    </>
  )
}
