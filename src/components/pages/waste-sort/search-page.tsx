'use client'

import { type FormEvent, useMemo, useState } from 'react'

import {
  IconArrowRight,
  IconLeaf,
  IconSearch,
  IconSparkles,
} from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

import { BIN_DETAILS, WASTE_ITEMS, type WasteItem } from './data'
import { WasteBin } from './waste-bin'

const EXAMPLES = ['ถ่านไฟฉาย', 'ขวดน้ำพลาสติก', 'เศษอาหาร']

export function WasteSortSearchPage() {
  const [query, setQuery] = useState('')
  const [searchedQuery, setSearchedQuery] = useState('')

  const results = useMemo(() => {
    const normalized = searchedQuery.trim().toLocaleLowerCase('th')
    if (!normalized) return []

    return WASTE_ITEMS.filter((item) =>
      item.name.toLocaleLowerCase('th').includes(normalized)
    )
  }, [searchedQuery])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearchedQuery(query)
  }

  function searchExample(example: string) {
    setQuery(example)
    setSearchedQuery(example)
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-[#f6faf3] text-[#173d2a]">
      <header className="border-b border-[#d8e5d9] bg-white/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3 font-bold" href="/">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#dcefd5] text-[#2e7047]">
              <IconLeaf aria-hidden="true" />
            </span>
            <span>Go Green</span>
          </Link>
          <Button
            className="bg-[#216c45] hover:bg-[#185437]"
            render={<Link href="/game" />}
          >
            เล่นเกมแยกขยะ
            <IconArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </header>

      <section className="relative border-b border-[#d8e5d9] bg-[#e8f2df]">
        <div className="absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#d94b45_0_25%,#439b61_25%_50%,#2478a8_50%_75%,#f4bd2a_75%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#2e7047]">
              <IconSparkles aria-hidden="true" className="size-5" />
              คู่มือคัดแยกขยะ ฝวฟ.
            </p>
            <h1 className="max-w-2xl text-4xl leading-tight font-bold sm:text-5xl">
              ชิ้นนี้ต้องลง
              <span className="block text-[#d4622b]">ถังสีอะไร?</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#557164]">
              ค้นหาชื่อขยะ แล้วดูประเภทและสีถังที่ถูกต้องก่อนทิ้ง
            </p>

            <form
              className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
              onSubmit={handleSearch}
            >
              <Input
                aria-label="ชื่อขยะ"
                className="h-12 border-[#a9c6ad] bg-white px-4 text-base shadow-sm focus-visible:border-[#216c45] focus-visible:ring-[#216c45]/20"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="เช่น ถ่านไฟฉาย หรือ ขวดพลาสติก"
                required
                value={query}
              />
              <Button
                className="h-12 bg-[#d4622b] px-6 text-base hover:bg-[#b84c1f]"
                type="submit"
              >
                <IconSearch data-icon="inline-start" />
                ค้นหา
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#557164]">
              <span>ลองค้นหา:</span>
              {EXAMPLES.map((example) => (
                <button
                  className="rounded-full border border-[#bad0bc] bg-white px-3 py-1.5 transition-colors hover:border-[#216c45] hover:text-[#216c45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#216c45]"
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
            className="hidden grid-cols-4 items-end gap-3 md:grid"
          >
            {(['red', 'green', 'blue', 'yellow'] as const).map(
              (color, index) => (
                <WasteBin
                  className={index % 2 === 0 ? '-translate-y-6' : ''}
                  color={color}
                  compact
                  key={color}
                />
              )
            )}
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
          <div className="border border-[#e1c7b4] bg-[#fff8f1] p-6 text-center">
            <p className="text-lg font-semibold">
              ยังไม่พบ “{searchedQuery}” ในรายการ
            </p>
            <p className="mt-2 text-[#6d766f]">
              ลองใช้คำสั้นลง เช่น “ขวด” “กระดาษ” หรือ “ถ่าน”
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

function BinGuide() {
  return (
    <div>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#2e7047]">จำสีให้แม่น</p>
          <h2 className="mt-1 text-2xl font-bold">ถังขยะ 4 ประเภท</h2>
        </div>
        <p className="hidden max-w-sm text-right text-sm text-[#6d766f] sm:block">
          สีช่วยให้เราแยกปลายทางของขยะได้ถูกต้องตั้งแต่ต้นทาง
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {(['red', 'green', 'blue', 'yellow'] as const).map((color) => (
          <div
            className="border border-[#d8e5d9] bg-white px-4 py-7"
            key={color}
          >
            <WasteBin color={color} compact />
          </div>
        ))}
      </div>
    </div>
  )
}

function SearchResults({ results }: { results: WasteItem[] }) {
  return (
    <div>
      <p className="mb-5 text-sm font-semibold text-[#557164]">
        พบ {results.length} รายการ
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((item) => {
          const bin = BIN_DETAILS[item.bin]
          return (
            <article
              className="grid grid-cols-[1fr_112px] items-center gap-5 border border-[#d8e5d9] bg-white p-6 shadow-[0_10px_30px_rgba(42,83,55,0.07)]"
              key={item.name}
            >
              <div>
                <span aria-label="สิ่งของ" className="text-4xl" role="img">
                  {item.emoji}
                </span>
                <h2 className="mt-3 text-xl font-bold">{item.name}</h2>
                <p className="mt-2 text-[#557164]">ประเภท: {item.type}</p>
                <p className="mt-4 font-semibold text-[#216c45]">
                  ทิ้งลงถัง{bin.colorName}
                </p>
              </div>
              <WasteBin color={item.bin} compact />
            </article>
          )
        })}
      </div>
    </div>
  )
}
