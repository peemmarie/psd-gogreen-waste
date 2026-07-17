'use client'

import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'

import {
  IconArrowRight,
  IconSearch,
  IconSparkles,
  IconX,
} from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

import {
  BIN_DETAILS,
  getWasteSortingTip,
  LEARNING_MODULES,
  WASTE_ITEMS,
  type WasteItem,
} from './data'
import { WasteSortPageShell } from './page-shell'
import { WasteBin } from './waste-bin'

const EXAMPLES = ['ถ่านไฟฉาย', 'ขวดน้ำพลาสติก', 'เศษอาหาร']

const HERO_BIN_OFFSETS = [
  'translate-y-2',
  '-translate-y-2',
  'translate-y-2',
  'translate-y-4',
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
    <WasteSortPageShell>
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
    </WasteSortPageShell>
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
            className="neo-surface hidden min-h-90 items-center justify-center bg-[#f7f8f3] p-8 md:grid"
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
