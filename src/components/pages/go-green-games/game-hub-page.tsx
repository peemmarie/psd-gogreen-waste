'use client'

import { useState } from 'react'

import {
  IconArrowLeft,
  IconBook,
  IconBottle,
  IconBuildingCommunity,
  IconCards,
  IconCheck,
  IconChecklist,
  IconClock,
  IconLeaf,
  IconRecycle,
  IconSparkles,
  IconTarget,
} from '@tabler/icons-react'
import Link from 'next/link'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'

import {
  LEARNING_MODULES,
  type LearningModule,
  type LearningModuleId,
} from '../waste-sort/data'

type CarbonChoice = {
  better: number
  options: [string, string]
  reason: string
}
type GameMode = 'bingo' | 'builder' | 'carbon' | 'city' | 'matching' | 'quiz'
type QuizQuestion = {
  answer: string
  options: string[]
  prompt: string
  reason: string
}

const MODES: {
  description: string
  icon: React.ComponentType<{ className?: string }>
  id: GameMode
  moduleId: LearningModuleId
  title: string
}[] = [
  {
    description: 'ตอบคำถามเร็ว ๆ พร้อมเฉลยเหตุผล',
    icon: IconSparkles,
    id: 'quiz',
    moduleId: 'hazardous-waste',
    title: 'Quiz ภารกิจสีเขียว',
  },
  {
    description: 'จับคู่สิ่งของกับถังให้ถูกต้อง',
    icon: IconCards,
    id: 'matching',
    moduleId: 'recycle-clean',
    title: 'จับคู่ขยะกับถัง',
  },
  {
    description: 'เช็กอินพฤติกรรมสีเขียวประจำวัน',
    icon: IconChecklist,
    id: 'bingo',
    moduleId: 'carbon-actions',
    title: 'Mission Bingo',
  },
  {
    description: 'เลือกไอเดีย reuse จากของเหลือใช้',
    icon: IconBottle,
    id: 'builder',
    moduleId: 'reuse-reduce',
    title: 'Recycle Builder',
  },
  {
    description: 'เก็บขยะในเมืองแล้วแยกตามประเภท',
    icon: IconBuildingCommunity,
    id: 'city',
    moduleId: 'organic-waste',
    title: 'Clean City Challenge',
  },
  {
    description: 'เลือกพฤติกรรมที่ลดคาร์บอนได้มากกว่า',
    icon: IconLeaf,
    id: 'carbon',
    moduleId: 'carbon-actions',
    title: 'Carbon Choice',
  },
]

const LEARNING_STEPS = [
  'อ่านแนวคิดหลัก',
  'เช็กความเข้าใจ',
  'เล่นเกมฝึกใช้จริง',
  'ทำภารกิจในชีวิตประจำวัน',
]

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    answer: 'ถังสีแดง',
    options: ['ถังสีแดง', 'ถังสีเขียว', 'ถังสีน้ำเงิน', 'ถังสีเหลือง'],
    prompt: 'ถ่านไฟฉายควรทิ้งลงถังสีอะไร?',
    reason: 'ถ่านไฟฉายมีสารอันตรายและโลหะหนัก จึงต้องแยกเป็นขยะอันตราย',
  },
  {
    answer: 'ล้างให้สะอาดและทำให้แห้ง',
    options: [
      'ใส่ถุงดำรวมกัน',
      'ล้างให้สะอาดและทำให้แห้ง',
      'เผาทิ้งทันที',
      'เทน้ำค้างไว้ในขวด',
    ],
    prompt: 'ก่อนทิ้งขวดพลาสติกลงถังรีไซเคิลควรทำอะไรก่อน?',
    reason: 'วัสดุสะอาดและแห้งช่วยให้รีไซเคิลได้จริงและไม่ปนเปื้อนของอื่น',
  },
  {
    answer: 'ถังสีเขียว',
    options: ['ถังสีแดง', 'ถังสีเขียว', 'ถังสีน้ำเงิน', 'ถังสีเหลือง'],
    prompt: 'เศษอาหารควรทิ้งลงถังสีอะไร?',
    reason: 'เศษอาหารเป็นขยะอินทรีย์ ย่อยสลายได้ และนำไปจัดการแบบขยะเปียกได้',
  },
]

const MATCHING_ITEMS = [
  { bin: 'ถังสีแดง', emoji: '🔋', item: 'แบตเตอรี่' },
  { bin: 'ถังสีเขียว', emoji: '🍚', item: 'เศษอาหาร' },
  { bin: 'ถังสีน้ำเงิน', emoji: '😷', item: 'หน้ากากใช้แล้ว' },
  { bin: 'ถังสีเหลือง', emoji: '🧴', item: 'ขวดพลาสติก' },
]

const BINGO_MISSIONS = [
  'พกแก้วน้ำส่วนตัว',
  'ปิดไฟเมื่อออกจากห้อง',
  'แยกขวดพลาสติก',
  'ใช้ถุงผ้า',
  'ล้างขวดก่อนรีไซเคิล',
  'ลดช้อนส้อมพลาสติก',
  'เก็บขยะรอบโต๊ะทำงาน',
  'แชร์ความรู้แยกขยะ',
  'ใช้กระดาษสองหน้า',
]

const BUILDER_ITEMS = [
  {
    choices: ['กระถางต้นไม้', 'ขยะทั่วไป', 'ถ่านไฟฉาย'],
    correct: 'กระถางต้นไม้',
    item: 'ขวดพลาสติก',
    result: 'ตัดขวดเป็นกระถางเล็ก ๆ สำหรับปลูกสมุนไพร',
  },
  {
    choices: ['ที่คั่นหนังสือ', 'เศษอาหาร', 'หลอดไฟ'],
    correct: 'ที่คั่นหนังสือ',
    item: 'กล่องกระดาษ',
    result: 'ตัดเป็นที่คั่นหนังสือหรือกล่องจัดระเบียบ',
  },
  {
    choices: ['ผ้าเช็ดโต๊ะ', 'ขยะอันตราย', 'ขวดแก้ว'],
    correct: 'ผ้าเช็ดโต๊ะ',
    item: 'เสื้อเก่า',
    result: 'ตัดเป็นผ้าทำความสะอาด ลดการซื้อของใช้ครั้งเดียว',
  },
]

const CITY_ITEMS = [
  { bin: 'รีไซเคิล', emoji: '🥤', item: 'แก้วพลาสติก' },
  { bin: 'ทั่วไป', emoji: '🧻', item: 'ทิชชู่เปียก' },
  { bin: 'อันตราย', emoji: '💡', item: 'หลอดไฟ' },
  { bin: 'อินทรีย์', emoji: '🍌', item: 'เปลือกกล้วย' },
]

const CARBON_CHOICES: CarbonChoice[] = [
  {
    better: 0,
    options: ['พกถุงผ้า', 'รับถุงพลาสติกใหม่'],
    reason: 'การใช้ถุงซ้ำช่วยลดขยะใช้ครั้งเดียว',
  },
  {
    better: 1,
    options: ['เปิดแอร์ 20°C', 'ตั้งแอร์ 26°C'],
    reason: 'อุณหภูมิที่เหมาะสมช่วยลดการใช้ไฟฟ้า',
  },
  {
    better: 0,
    options: ['เดินไปอาคารใกล้ ๆ', 'ขับรถระยะสั้น'],
    reason: 'การเดินลดการปล่อยคาร์บอนและดีต่อสุขภาพ',
  },
]

const BIN_OPTIONS = ['ถังสีแดง', 'ถังสีเขียว', 'ถังสีน้ำเงิน', 'ถังสีเหลือง']

export function GameHubPage() {
  const [activeModuleId, setActiveModuleId] =
    useState<LearningModuleId>('waste-basics')
  const [mode, setMode] = useState<GameMode | null>(
    getDefaultMode('waste-basics')
  )
  const activeMode = mode
    ? (MODES.find((item) => item.id === mode) ?? null)
    : null
  const activeModule =
    LEARNING_MODULES.find((module) => module.id === activeModuleId) ??
    LEARNING_MODULES[0]
  const courseModes = getModesForModule(activeModule.id)
  const ActiveIcon = activeMode?.icon

  function selectModule(moduleId: LearningModuleId) {
    setActiveModuleId(moduleId)
    setMode(getDefaultMode(moduleId))
  }

  function selectMode(nextMode: GameMode) {
    const nextActivity = MODES.find((item) => item.id === nextMode)
    if (!nextActivity) return

    setActiveModuleId(nextActivity.moduleId)
    setMode(nextMode)
  }

  return (
    <main className="min-h-dvh bg-[#f7f8f3] text-[#111111]">
      <header className="sticky top-0 z-50 border-b border-[#eceee7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="rounded-base border-[#e1e1e1] bg-white text-[#111111] hover:bg-[#f7f8f3]"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <IconArrowLeft data-icon="inline-start" />
              ย้อนกลับ
            </Button>
            <Link className="flex items-center gap-3 font-bold" href="/">
              <span className="rounded-base flex size-10 items-center justify-center bg-[#111111] text-[#5df591]">
                <IconLeaf aria-hidden="true" />
              </span>
              Go Green
            </Link>
          </div>
          <Button
            className="rounded-base bg-[#5df591] font-bold text-[#111111] hover:bg-[#49db7b]"
            nativeButton={false}
            render={<Link href="/game/waste-sort" />}
          >
            <IconRecycle data-icon="inline-start" />
            เกมแยกขยะ 4 สี
          </Button>
        </div>
      </header>

      <LearningHubHero />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[340px_1fr]">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <LearningPath
            activeModuleId={activeModule.id}
            onSelectModule={selectModule}
          />

          <nav aria-label="เลือกกิจกรรมฝึก" className="grid gap-2">
            <p className="px-1 text-sm font-bold text-[#173d2a]">
              กิจกรรมของบทนี้
            </p>
            {courseModes.length > 0 ? (
              courseModes.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    aria-pressed={mode === item.id}
                    className={cn(
                      'neo-interactive bg-secondary-background flex items-start gap-3 p-4 text-left',
                      mode === item.id && 'border-[#216c45] bg-[#eef7ea]'
                    )}
                    key={item.id}
                    onClick={() => selectMode(item.id)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="mt-0.5 size-5" />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{item.title}</span>
                        {mode === item.id ? (
                          <Badge
                            className="bg-[#216c45] text-white"
                            variant="secondary"
                          >
                            เลือกอยู่
                          </Badge>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-[#557164]">
                        {item.description}
                      </span>
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="neo-card p-4">
                <p className="font-bold">เริ่มฝึกจากเกมแยกขยะ 4 สี</p>
                <p className="mt-1 text-sm leading-5 text-[#557164]">
                  บทนี้เป็นพื้นฐานของทุกกิจกรรม จึงเชื่อมไปยังโหมด Learn
                  เพื่อฝึกจำสีถังให้ครบก่อน
                </p>
                <Button
                  className="mt-4 bg-[#216c45] hover:bg-[#185437]"
                  nativeButton={false}
                  render={<Link href="/game/waste-sort?mode=learn" />}
                >
                  <IconRecycle data-icon="inline-start" />
                  เริ่มโหมด Learn
                </Button>
              </div>
            )}

            {activeModule.id !== 'waste-basics' ? (
              <button
                className="neo-surface border-dashed bg-[#f7fbf4] p-4 text-left text-sm leading-6 text-[#557164] transition-colors hover:border-[#216c45] focus-visible:border-[#216c45] focus-visible:ring-2 focus-visible:ring-[#216c45]/30 focus-visible:outline-none"
                onClick={() => selectModule('waste-basics')}
                type="button"
              >
                อยากทบทวนพื้นฐาน? กลับไปบท “เข้าใจถังขยะ 4 สี”
              </button>
            ) : null}
          </nav>
        </aside>

        <div className="grid gap-6">
          <LearningCycle />
          <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <ModuleBrief module={activeModule} />

            <section className="neo-card min-h-[640px] p-5 sm:p-7">
              {activeMode && ActiveIcon ? (
                <>
                  <div className="mb-6 flex items-start gap-3">
                    <span className="rounded-base flex size-11 items-center justify-center bg-[#dcefd5] text-[#216c45]">
                      <ActiveIcon aria-hidden="true" className="size-6" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#2e7047]">
                        กิจกรรมฝึกของบทนี้
                      </p>
                      <h2 className="mt-1 text-2xl font-bold">
                        {activeMode.title}
                      </h2>
                      <p className="mt-1 text-[#557164]">
                        {activeMode.description}
                      </p>
                    </div>
                  </div>

                  {mode === 'quiz' ? <QuizGame /> : null}
                  {mode === 'matching' ? <MatchingGame /> : null}
                  {mode === 'bingo' ? <BingoGame /> : null}
                  {mode === 'builder' ? <BuilderGame /> : null}
                  {mode === 'city' ? <CleanCityGame /> : null}
                  {mode === 'carbon' ? <CarbonChoiceGame /> : null}
                </>
              ) : (
                <PracticeIntro module={activeModule} />
              )}
            </section>
          </section>
        </div>
      </section>
    </main>
  )
}

function BingoGame() {
  const [checked, setChecked] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const bingo = checked.length >= 5

  function toggle(mission: string) {
    if (finished) return
    setChecked((current) =>
      current.includes(mission)
        ? current.filter((item) => item !== mission)
        : [...current, mission]
    )
  }

  function finish() {
    setFinished(true)
  }

  function restart() {
    setChecked([])
    setFinished(false)
  }

  if (finished) {
    return (
      <SummaryCard
        detail={`ทำภารกิจครบ ${checked.length} รายการ เหมาะสำหรับ daily challenge`}
        onRestart={restart}
        title="สรุป Mission Bingo"
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {BINGO_MISSIONS.map((mission) => (
          <button
            className={cn(
              'neo-interactive bg-secondary-background min-h-28 p-4 text-left font-semibold hover:border-[#216c45]',
              checked.includes(mission) && 'border-[#216c45] bg-[#eef7ea]'
            )}
            key={mission}
            onClick={() => toggle(mission)}
            type="button"
          >
            <IconCheck aria-hidden="true" className="mb-3 size-5" />
            {mission}
          </button>
        ))}
      </div>
      {bingo ? (
        <Feedback
          actionLabel="ดูสรุปผล"
          ok
          onAction={finish}
          text="ครบ 5 ภารกิจแล้ว เหมาะมากสำหรับ daily challenge"
        />
      ) : (
        <p className="text-[#557164]">เลือกอย่างน้อย 5 ช่องเพื่อจบ Bingo</p>
      )}
    </div>
  )
}

function BuilderGame() {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState('')
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const item = BUILDER_ITEMS[index]
  const correct = choice === item.correct

  function choose(nextChoice: string) {
    if (choice) return
    setChoice(nextChoice)
    if (nextChoice === item.correct) {
      setCorrectCount((current) => current + 1)
    }
  }

  function next() {
    if (index === BUILDER_ITEMS.length - 1) {
      setFinished(true)
      return
    }
    setChoice('')
    setIndex((current) => current + 1)
  }

  function restart() {
    setChoice('')
    setFinished(false)
    setIndex(0)
    setCorrectCount(0)
  }

  if (finished) {
    return (
      <SummaryCard
        detail={`เลือกไอเดีย reuse ถูก ${correctCount} จาก ${BUILDER_ITEMS.length} ชิ้น`}
        onRestart={restart}
        title="สรุป Recycle Builder"
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid min-h-44 place-items-center bg-[#eef7ea] p-6 text-center">
        <div>
          <IconBottle aria-hidden="true" className="mx-auto mb-3 size-12" />
          <strong className="text-xl">{item.item}</strong>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {item.choices.map((option) => (
          <button
            className={cn(
              'neo-interactive bg-secondary-background min-h-20 p-4 text-left text-lg leading-7 font-semibold hover:border-[#216c45]',
              choice === option && correct && 'border-[#216c45] bg-[#eef7ea]',
              choice === option && !correct && 'border-[#d4622b] bg-[#fff5ed]'
            )}
            key={option}
            onClick={() => choose(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>

      {choice ? (
        <Feedback
          actionLabel={
            index === BUILDER_ITEMS.length - 1 ? 'ดูสรุปผล' : 'ของชิ้นต่อไป'
          }
          ok={correct}
          onAction={next}
          text={correct ? item.result : `ลองคิดแบบ reuse: ${item.result}`}
        />
      ) : null}
    </div>
  )
}

function CarbonChoiceGame() {
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [selected, setSelected] = useState<null | number>(null)
  const choice = CARBON_CHOICES[index]
  const correct = selected === choice.better

  function choose(optionIndex: number) {
    if (selected !== null) return
    setSelected(optionIndex)
    if (optionIndex === choice.better) {
      setCorrectCount((current) => current + 1)
    }
  }

  function next() {
    if (index === CARBON_CHOICES.length - 1) {
      setFinished(true)
      return
    }
    setSelected(null)
    setIndex((current) => current + 1)
  }

  function restart() {
    setFinished(false)
    setIndex(0)
    setCorrectCount(0)
    setSelected(null)
  }

  if (finished) {
    return (
      <SummaryCard
        detail={`เลือกทางเลือกคาร์บอนต่ำถูก ${correctCount} จาก ${CARBON_CHOICES.length} สถานการณ์`}
        onRestart={restart}
        title="สรุป Carbon Choice"
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {choice.options.map((option, optionIndex) => (
          <button
            className={cn(
              'neo-interactive bg-secondary-background min-h-36 p-5 text-left text-xl font-bold hover:border-[#216c45]',
              selected === optionIndex &&
                correct &&
                'border-[#216c45] bg-[#eef7ea]',
              selected === optionIndex &&
                !correct &&
                'border-[#d4622b] bg-[#fff5ed]'
            )}
            key={option}
            onClick={() => choose(optionIndex)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      {selected !== null ? (
        <Feedback
          actionLabel={
            index === CARBON_CHOICES.length - 1 ? 'ดูสรุปผล' : 'สถานการณ์ต่อไป'
          }
          ok={correct}
          onAction={next}
          text={choice.reason}
        />
      ) : null}
    </div>
  )
}

function CleanCityGame() {
  const [finished, setFinished] = useState(false)
  const [sorted, setSorted] = useState<Record<string, string>>({})
  const correctCount = CITY_ITEMS.filter(
    (item) => sorted[item.item] === item.bin
  ).length
  const complete = Object.keys(sorted).length === CITY_ITEMS.length

  function sort(item: string, bin: string) {
    if (finished) return
    setSorted((current) => ({ ...current, [item]: bin }))
  }

  function finish() {
    setFinished(true)
  }

  function restart() {
    setFinished(false)
    setSorted({})
  }

  if (finished) {
    return (
      <SummaryCard
        detail={`แยกขยะในเมืองถูก ${correctCount} จาก ${CITY_ITEMS.length} จุด`}
        onRestart={restart}
        title="สรุป Clean City Challenge"
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 rounded-none bg-[#e8f2df] p-3 sm:p-4">
        {CITY_ITEMS.map((item) => (
          <article
            className="flex min-h-[230px] flex-col items-center justify-between gap-4 bg-white p-5 text-center"
            key={item.item}
          >
            <div className="text-4xl leading-none">{item.emoji}</div>
            <h3 className="text-xl leading-7 font-bold text-pretty">
              {item.item}
            </h3>
            <Select
              onValueChange={(value) => {
                if (value) sort(item.item, value)
              }}
              value={sorted[item.item] ?? null}
            >
              <SelectTrigger className="h-11 w-full max-w-44 min-w-0 border-[#a9c6ad] bg-white">
                <SelectValue className="truncate" placeholder="ปลายทาง" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {['รีไซเคิล', 'ทั่วไป', 'อันตราย', 'อินทรีย์'].map((bin) => (
                    <SelectItem key={bin} value={bin}>
                      {bin}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </article>
        ))}
      </div>
      {complete ? (
        <Feedback
          actionLabel="ดูสรุปผล"
          ok={correctCount === CITY_ITEMS.length}
          onAction={finish}
          text={`เมืองสะอาดขึ้น ${correctCount} จุดจาก ${CITY_ITEMS.length} จุด`}
        />
      ) : null}
    </div>
  )
}

function Feedback({
  actionLabel,
  ok,
  onAction,
  text,
}: {
  actionLabel: string
  ok: boolean
  onAction: () => void
  text: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border p-4 lg:flex-row lg:items-center lg:justify-between',
        ok ? 'border-[#b9d9b2] bg-[#f1faed]' : 'border-[#e1c7b4] bg-[#fff8f1]'
      )}
    >
      <p className="max-w-prose min-w-0 leading-7 text-pretty text-[#4a6558]">
        {text}
      </p>
      <Button
        className="w-fit shrink-0 bg-[#216c45] hover:bg-[#185437]"
        onClick={onAction}
        type="button"
      >
        {actionLabel}
      </Button>
    </div>
  )
}

function getDefaultMode(moduleId: LearningModuleId): GameMode | null {
  return getModesForModule(moduleId)[0]?.id ?? null
}

function getModesForModule(moduleId: LearningModuleId) {
  return MODES.filter((item) => item.moduleId === moduleId)
}

function LearningCycle() {
  return (
    <section className="neo-card p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#2e7047]">
            วงจรการเรียนรู้
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            จากความรู้สู่พฤติกรรมสีเขียว
          </h2>
        </div>
        <Button
          className="w-fit bg-[#216c45] hover:bg-[#185437]"
          nativeButton={false}
          render={<Link href="/game/waste-sort?mode=learn" />}
        >
          <IconRecycle data-icon="inline-start" />
          เริ่มจากโหมด Learn
        </Button>
      </div>

      <ol className="mt-5 grid gap-3 md:grid-cols-4">
        {LEARNING_STEPS.map((step, index) => (
          <li
            className="neo-surface flex items-center gap-3 bg-[#f7fbf4] p-3"
            key={step}
          >
            <span className="rounded-base grid size-8 shrink-0 place-items-center bg-[#dcefd5] text-sm font-bold text-[#216c45]">
              {index + 1}
            </span>
            <span className="text-sm font-semibold">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function LearningHubHero() {
  return (
    <section className="border-b border-[#eceee7] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div>
          <p className="rounded-base inline-flex items-center gap-2 bg-[#effff3] px-4 py-2 text-sm font-bold text-[#168542]">
            <IconSparkles aria-hidden="true" className="size-4" />
            Learning Platform
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[0.98] font-bold tracking-[-0.03em] text-balance sm:text-7xl">
            เรียน เล่น และลงมือทำ
            <span className="block text-[#168542]">ในเส้นทางเดียว</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d5053]">
            เลือกบทเรียน อ่านสาระสำคัญ
            แล้วฝึกผ่านเกมที่เชื่อมกับพฤติกรรมสีเขียวในชีวิตจริง
          </p>
        </div>

        <div className="bg-[#111111] p-5 text-white">
          <div className="neo-surface bg-[#5df591] p-5 text-[#111111]">
            <p className="text-sm font-bold">เส้นทางแนะนำ</p>
            <h2 className="mt-3 text-3xl font-bold">Learn → Play → Act</h2>
            <p className="mt-3 text-sm leading-6 text-[#173d2a]">
              อ่านแนวคิด เล่นกิจกรรม แล้วนำกลับไปใช้กับพฤติกรรมจริงในอาคาร
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="neo-flat bg-white/8 p-4">
              <p className="text-4xl font-bold text-[#5df591]">6</p>
              <p className="mt-1 text-sm font-semibold text-white/72">
                บทเรียนสั้นพร้อมกิจกรรม
              </p>
            </div>
            <div className="neo-flat bg-white/8 p-4">
              <p className="text-4xl font-bold text-white">4</p>
              <p className="mt-1 text-sm font-semibold text-white/72">
                ขั้นตอนเรียนรู้จนลงมือทำ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LearningPath({
  activeModuleId,
  onSelectModule,
}: {
  activeModuleId: LearningModuleId
  onSelectModule: (moduleId: LearningModuleId) => void
}) {
  return (
    <section className="neo-card p-5">
      <div className="flex items-center gap-2 text-[#216c45]">
        <IconBook aria-hidden="true" className="size-5" />
        <h2 className="font-bold">หลักสูตร Go Green</h2>
      </div>
      <ol className="mt-4 grid gap-3">
        {LEARNING_MODULES.map((module, index) => {
          const active = module.id === activeModuleId

          return (
            <li key={module.id}>
              <button
                aria-pressed={active}
                className={cn(
                  'neo-interactive w-full bg-[#f7fbf4] p-3 text-left transition-colors hover:border-[#216c45] focus-visible:border-[#216c45] focus-visible:ring-2 focus-visible:ring-[#216c45]/30 focus-visible:outline-none',
                  active && 'border-[#216c45] bg-[#eef7ea]'
                )}
                onClick={() => onSelectModule(module.id)}
                type="button"
              >
                <span className="flex items-start gap-3">
                  <span className="rounded-base grid size-7 shrink-0 place-items-center bg-white text-xs font-bold text-[#216c45]">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{module.title}</span>
                      {active ? (
                        <Badge
                          className="bg-[#216c45] text-white"
                          variant="secondary"
                        >
                          เลือกอยู่
                        </Badge>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#557164]">
                      {module.duration} · {module.level}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function MatchingGame() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)
  const correctCount = MATCHING_ITEMS.filter(
    (item) => answers[item.item] === item.bin
  ).length
  const complete = Object.keys(answers).length === MATCHING_ITEMS.length

  function choose(item: string, bin: string) {
    if (finished) return
    setAnswers((current) => ({ ...current, [item]: bin }))
  }

  function claim() {
    setFinished(true)
  }

  function restart() {
    setAnswers({})
    setFinished(false)
  }

  if (finished) {
    return (
      <SummaryCard
        detail={`จับคู่ถูก ${correctCount} จาก ${MATCHING_ITEMS.length} รายการ`}
        onRestart={restart}
        title="สรุปเกมจับคู่ขยะกับถัง"
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3">
        {MATCHING_ITEMS.map((item) => (
          <article
            className="neo-surface grid gap-3 p-4 md:grid-cols-[1fr_220px]"
            key={item.item}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{item.emoji}</span>
              <strong>{item.item}</strong>
            </div>
            <Select
              onValueChange={(value) => {
                if (value) choose(item.item, value)
              }}
              value={answers[item.item] ?? null}
            >
              <SelectTrigger className="h-11 w-full border-[#a9c6ad] bg-white">
                <SelectValue placeholder="เลือกถัง" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {BIN_OPTIONS.map((bin) => (
                    <SelectItem key={bin} value={bin}>
                      {bin}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </article>
        ))}
      </div>
      {complete ? (
        <Feedback
          actionLabel="ดูสรุปผล"
          ok={correctCount === MATCHING_ITEMS.length}
          onAction={claim}
          text={`จับคู่ถูก ${correctCount} จาก ${MATCHING_ITEMS.length} รายการ`}
        />
      ) : null}
    </div>
  )
}

function ModuleBrief({ module }: { module: LearningModule }) {
  return (
    <section className="neo-card p-5 sm:p-7">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-base inline-flex items-center gap-1 bg-[#eef7ea] px-3 py-1 text-xs font-bold text-[#216c45]">
          <IconClock aria-hidden="true" className="size-4" />
          {module.duration}
        </span>
        <span className="rounded-base inline-flex bg-[#fff3a8] px-3 py-1 text-xs font-bold text-[#604800]">
          {module.level}
        </span>
      </div>

      <h2 className="mt-4 text-3xl leading-tight font-bold">{module.title}</h2>
      <p className="mt-4 leading-7 text-[#4a6558]">{module.academicNote}</p>

      <div className="mt-6">
        <h3 className="flex items-center gap-2 font-bold text-[#216c45]">
          <IconBook aria-hidden="true" className="size-5" />
          ประเด็นสำคัญ
        </h3>
        <ul className="mt-3 grid gap-2">
          {module.keyPoints.map((point) => (
            <li
              className="neo-surface flex gap-3 bg-[#f7fbf4] p-3 text-sm leading-6"
              key={point}
            >
              <IconCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[#216c45]"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="neo-surface mt-6 bg-[#fff8f1] p-4">
        <h3 className="flex items-center gap-2 font-bold text-[#9a4c22]">
          <IconTarget aria-hidden="true" className="size-5" />
          Challenge หลังอ่าน
        </h3>
        <p className="mt-2 leading-7 text-[#6b553f]">{module.challenge}</p>
      </div>
    </section>
  )
}

function PracticeIntro({ module }: { module: LearningModule }) {
  return (
    <section className="grid min-h-[520px] place-items-center bg-[#f7fbf4] p-6 text-center">
      <div className="max-w-md">
        <span className="rounded-base mx-auto flex size-14 items-center justify-center bg-[#dcefd5] text-[#216c45]">
          <IconRecycle aria-hidden="true" className="size-7" />
        </span>
        <p className="mt-5 text-sm font-semibold text-[#2e7047]">
          ขั้นฝึกพื้นฐาน
        </p>
        <h3 className="mt-2 text-2xl font-bold">{module.title}</h3>
        <p className="mt-3 leading-7 text-[#557164]">
          บทนี้ใช้เกมแยกขยะ 4 สีเป็นกิจกรรมหลัก
          เพื่อให้เห็นสีถังและตัวอย่างขยะก่อนเริ่มบทอื่น
        </p>
        <Button
          className="mt-6 bg-[#216c45] hover:bg-[#185437]"
          nativeButton={false}
          render={<Link href="/game/waste-sort?mode=learn" />}
        >
          <IconRecycle data-icon="inline-start" />
          เริ่มโหมด Learn
        </Button>
      </div>
    </section>
  )
}

function QuizGame() {
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [selected, setSelected] = useState('')
  const question = QUIZ_QUESTIONS[index]
  const correct = selected === question.answer

  function answer(option: string) {
    if (selected) return
    setSelected(option)
    if (option === question.answer) {
      setCorrectCount((current) => current + 1)
    }
  }

  function next() {
    if (index === QUIZ_QUESTIONS.length - 1) {
      setFinished(true)
      return
    }
    setSelected('')
    setIndex((current) => current + 1)
  }

  function restart() {
    setFinished(false)
    setIndex(0)
    setCorrectCount(0)
    setSelected('')
  }

  if (finished) {
    return (
      <SummaryCard
        detail={`ตอบถูก ${correctCount} จาก ${QUIZ_QUESTIONS.length} ข้อ`}
        onRestart={restart}
        title="สรุป Quiz ภารกิจสีเขียว"
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl font-bold">{question.prompt}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            className={cn(
              'neo-interactive bg-secondary-background p-4 text-left font-semibold hover:border-[#216c45]',
              selected === option && correct && 'border-[#216c45] bg-[#eef7ea]',
              selected === option && !correct && 'border-[#d4622b] bg-[#fff5ed]'
            )}
            key={option}
            onClick={() => answer(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      {selected ? (
        <Feedback
          actionLabel={
            index === QUIZ_QUESTIONS.length - 1 ? 'ดูสรุปผล' : 'ข้อต่อไป'
          }
          ok={correct}
          onAction={next}
          text={question.reason}
        />
      ) : null}
    </div>
  )
}

function SummaryCard({
  detail,
  onRestart,
  title,
}: {
  detail: string
  onRestart: () => void
  title: string
}) {
  return (
    <section className="neo-surface grid min-h-[420px] place-items-center bg-[#f7fbf4] p-6 text-center">
      <div className="max-w-md">
        <span className="rounded-base mx-auto flex size-14 items-center justify-center bg-[#dcefd5] text-[#216c45]">
          <IconCheck aria-hidden="true" className="size-7" />
        </span>
        <h3 className="mt-5 text-2xl font-bold">{title}</h3>
        <p className="mt-3 leading-7 text-[#557164]">{detail}</p>
        <Button
          className="mt-6 bg-[#216c45] hover:bg-[#185437]"
          onClick={onRestart}
          type="button"
        >
          เล่นใหม่
        </Button>
      </div>
    </section>
  )
}
