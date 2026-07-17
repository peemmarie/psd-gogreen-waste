'use client'

import { useEffect, useState } from 'react'

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconBolt,
  IconBook,
  IconBuildingCommunity,
  IconCheck,
  IconCoin,
  IconLeaf,
  IconPlayerPlay,
  IconRecycle,
  IconRefresh,
  IconShieldCheck,
  IconShoppingCart,
  IconSparkles,
  IconTrophy,
} from '@tabler/icons-react'
import Link from 'next/link'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type MeaGoGameId =
  | 'energy-hunter'
  | 'green-office-manager'
  | 'green-shopping-challenge'
  | 'safety-inspector'

const MEA_GO_GAMES: {
  accent: string
  category: string
  genre: string
  howToPlay: string
  icon: React.ComponentType<{ className?: string }>
  id: MeaGoGameId
  learning: string
  title: string
}[] = [
  {
    accent: '#5df591',
    category: 'การบริหารจัดการองค์กรสีเขียว',
    genre: 'Simulation / ตัดสินใจ',
    howToPlay:
      'เลือกวิธีบริหารสำนักงานจากสถานการณ์ต่าง ๆ เพื่อเพิ่ม Green Score',
    icon: IconBuildingCommunity,
    id: 'green-office-manager',
    learning: 'การบริหารองค์กรสีเขียวและการลดการใช้ทรัพยากร',
    title: 'Green Office Manager',
  },
  {
    accent: '#facc00',
    category: 'การจัดการพลังงานและสิ่งแวดล้อม',
    genre: 'Find & Click',
    howToPlay: 'ค้นหาและคลิกจุดที่สิ้นเปลืองพลังงานภายในเวลาที่กำหนด',
    icon: IconBolt,
    id: 'energy-hunter',
    learning: 'การประหยัดพลังงานและลดการปล่อยคาร์บอน',
    title: 'Energy Hunter',
  },
  {
    accent: '#8ce3ff',
    category: 'การจัดซื้อจัดจ้างที่เป็นมิตรกับสิ่งแวดล้อม',
    genre: 'Budget / เลือกสินค้า',
    howToPlay: 'เลือกสินค้าที่เป็นมิตรต่อสิ่งแวดล้อมภายใต้งบประมาณ',
    icon: IconShoppingCart,
    id: 'green-shopping-challenge',
    learning: 'หลักการ Green Procurement และ Eco Label',
    title: 'Green Shopping Challenge',
  },
  {
    accent: '#ff9f6e',
    category: 'สภาพแวดล้อมและความปลอดภัยในการทำงาน',
    genre: 'Spot the Hazard',
    howToPlay: 'ค้นหาและคลิกจุดเสี่ยงหรือสิ่งผิดปกติในสำนักงาน',
    icon: IconShieldCheck,
    id: 'safety-inspector',
    learning: 'ความปลอดภัยในการทำงานและการจัดสภาพแวดล้อมที่เหมาะสม',
    title: 'Safety Inspector',
  },
]

const OFFICE_MANAGER_SCENARIOS = [
  {
    options: [
      {
        effect: 10,
        feedback: 'ดีมาก ปิดไฟและปรับแอร์ช่วยลดการใช้ไฟทันทีโดยไม่กระทบงาน',
        label: 'ปิดไฟ ปิดแอร์ และติดป้ายเตือนหลังใช้ห้อง',
      },
      {
        effect: 5,
        feedback:
          'ช่วยได้บางส่วน แต่ควรปิดระบบเมื่อห้องว่างเพื่อให้เกิดผลต่อเนื่อง',
        label: 'ลดอุณหภูมิแอร์ลงเล็กน้อยแล้วปล่อยไว้',
      },
      {
        effect: 0,
        feedback: 'ปล่อยไว้ทำให้สูญเสียพลังงานโดยไม่จำเป็น',
        label: 'ปล่อยไว้เพราะอาจมีคนเข้ามาใช้ต่อ',
      },
    ],
    prompt: 'ช่วงพักกลางวัน ห้องประชุมยังเปิดไฟและแอร์ไว้ทั้งที่ไม่มีคนใช้',
  },
  {
    options: [
      {
        effect: 10,
        feedback:
          'เหมาะสมที่สุด ตรวจรายละเอียดก่อนพิมพ์และใช้สองหน้าช่วยลดกระดาษ',
        label: 'ตรวจไฟล์ ส่งเอกสารอิเล็กทรอนิกส์ และพิมพ์สองหน้าเฉพาะที่จำเป็น',
      },
      {
        effect: 6,
        feedback: 'การพิมพ์สองหน้าช่วยลดกระดาษ แต่ยังควรลดจำนวนชุดพิมพ์ด้วย',
        label: 'พิมพ์สองหน้าทุกชุด',
      },
      {
        effect: 1,
        feedback: 'พิมพ์ตามเดิมเสี่ยงเกิดกระดาษเหลือและของเสียเพิ่ม',
        label: 'พิมพ์ตามเดิมเพื่อความสะดวก',
      },
    ],
    prompt: 'เอกสารประชุม 40 ชุดถูกเตรียมพิมพ์หน้าเดียวทั้งหมด',
  },
  {
    options: [
      {
        effect: 10,
        feedback:
          'ถูกต้อง การแยกต้นทางและสื่อสารให้ทีมเห็นภาพช่วยให้รีไซเคิลได้จริง',
        label: 'จัดจุดแยกขยะพร้อมป้ายตัวอย่าง และแจ้งทีมแม่บ้านให้เก็บสถิติ',
      },
      {
        effect: 4,
        feedback:
          'การเพิ่มถังช่วยได้ แต่ถ้าไม่มีป้ายหรือการสื่อสาร คนยังแยกผิดได้ง่าย',
        label: 'เพิ่มถังรีไซเคิลอีกใบโดยไม่อธิบายเพิ่มเติม',
      },
      {
        effect: 0,
        feedback: 'ขยะปนเปื้อนทำให้วัสดุรีไซเคิลเสียคุณภาพและจัดการยากขึ้น',
        label: 'ปล่อยให้รวมกันเพราะแม่บ้านคัดแยกภายหลังได้',
      },
    ],
    prompt: 'พบถังขยะใน pantry มีขวดพลาสติกปนกับเศษอาหารจำนวนมาก',
  },
  {
    options: [
      {
        effect: 10,
        feedback:
          'ดีมาก เลือกของที่ใช้ซ้ำได้และลดบรรจุภัณฑ์คือแนวคิดจัดซื้อสีเขียว',
        label: 'เลือกของใช้ซ้ำได้ มีฉลากสิ่งแวดล้อม และลดบรรจุภัณฑ์',
      },
      {
        effect: 5,
        feedback:
          'ช่วยลดค่าใช้จ่ายได้ แต่ราคาถูกอย่างเดียวอาจสร้างขยะและผลกระทบเพิ่ม',
        label: 'เลือกสินค้าราคาถูกที่สุดเพื่อประหยัดงบ',
      },
      {
        effect: 1,
        feedback:
          'ของใช้ครั้งเดียวทำให้เกิดขยะหลังงานจำนวนมาก ควรหาทางเลือกที่ยั่งยืนกว่า',
        label: 'สั่งของใช้ครั้งเดียวจำนวนมากเพื่อให้แจกง่าย',
      },
    ],
    prompt: 'ทีมจัดกิจกรรมภายในต้องสั่งของใช้และของแจกสำหรับผู้เข้าร่วม',
  },
]

const ENERGY_HOTSPOTS = [
  {
    id: 'lights',
    label: 'ไฟห้องประชุมเปิดค้าง',
    signal: 'ห้องว่างแต่ไฟยังเปิดอยู่',
    tip: 'ปิดไฟทันทีเมื่อไม่มีคนใช้งาน',
    x: '18%',
    y: '20%',
    zone: 'ห้องประชุม',
  },
  {
    id: 'air',
    label: 'แอร์ตั้งอุณหภูมิต่ำเกินไป',
    signal: 'ตั้งไว้ 20°C ทั้งวัน',
    tip: 'ตั้งอุณหภูมิประมาณ 26°C และปิดเมื่อเลิกใช้งาน',
    x: '72%',
    y: '18%',
    zone: 'โซนแอร์',
  },
  {
    id: 'monitor',
    label: 'จอคอมพิวเตอร์เปิดทิ้งไว้',
    signal: 'ไม่มีคนอยู่หน้าโต๊ะ',
    tip: 'ตั้งพักหน้าจอหรือปิดจอเมื่อไม่ใช้งานเกิน 15 นาที',
    x: '42%',
    y: '50%',
    zone: 'โต๊ะทำงาน',
  },
  {
    id: 'charger',
    label: 'ปลั๊กชาร์จเสียบทิ้งไว้',
    signal: 'ชาร์จเต็มแล้วแต่ยังเสียบคาไว้',
    tip: 'ถอดปลั๊กเมื่อชาร์จเสร็จเพื่อลด standby power',
    x: '79%',
    y: '67%',
    zone: 'จุดชาร์จอุปกรณ์',
  },
  {
    id: 'printer',
    label: 'เครื่องพิมพ์เปิดรอทั้งวัน',
    signal: 'ไม่มีงานพิมพ์ค้างแต่เครื่องยัง active',
    tip: 'ใช้โหมดประหยัดพลังงานและปิดหลังเลิกงาน',
    x: '23%',
    y: '70%',
    zone: 'มุมเครื่องพิมพ์',
  },
]

const SAFETY_HAZARDS = [
  {
    id: 'cable',
    label: 'สายไฟพาดทางเดิน',
    signal: 'คนเดินผ่านประจำ',
    tip: 'รวบสายไฟและใช้รางครอบสายเพื่อลดการสะดุด',
    x: '28%',
    y: '72%',
    zone: 'ทางเดินกลาง',
  },
  {
    id: 'spill',
    label: 'พื้นเปียกไม่มีป้ายเตือน',
    signal: 'มีรอยน้ำใกล้ pantry',
    tip: 'เช็ดพื้นทันทีและตั้งป้ายเตือนจนกว่าพื้นจะแห้ง',
    x: '61%',
    y: '74%',
    zone: 'พื้นที่ pantry',
  },
  {
    id: 'exit',
    label: 'กล่องวางบังทางออกฉุกเฉิน',
    signal: 'ทางออกเปิดได้ไม่สุด',
    tip: 'ทางออกฉุกเฉินต้องโล่งและเข้าถึงได้เสมอ',
    x: '80%',
    y: '42%',
    zone: 'ประตูฉุกเฉิน',
  },
  {
    id: 'stack',
    label: 'แฟ้มเอกสารกองสูงเสี่ยงหล่น',
    signal: 'วางสูงเกินระดับสายตา',
    tip: 'จัดเก็บในชั้นที่มั่นคงและไม่วางสูงเกินระดับปลอดภัย',
    x: '17%',
    y: '44%',
    zone: 'ชั้นเอกสาร',
  },
  {
    id: 'chemical',
    label: 'น้ำยาทำความสะอาดไม่มีฉลาก',
    signal: 'ไม่รู้ชนิดสารในขวด',
    tip: 'ภาชนะสารเคมีต้องมีฉลากและเก็บแยกจากพื้นที่ใช้งานทั่วไป',
    x: '50%',
    y: '31%',
    zone: 'ตู้เก็บอุปกรณ์',
  },
]

const SHOPPING_BUDGET = 1200

const SHOPPING_ITEMS = [
  {
    category: 'แสงสว่าง',
    ecoScore: 24,
    id: 'led',
    label: 'หลอดไฟ LED ฉลากประหยัดไฟ',
    price: 260,
    reason: 'ใช้ไฟน้อย อายุการใช้งานยาว และลดค่าไฟระยะยาว',
  },
  {
    category: 'เอกสาร',
    ecoScore: 20,
    id: 'recycled-paper',
    label: 'กระดาษรีไซเคิล 80 gsm',
    price: 210,
    reason: 'ลดการใช้เยื่อกระดาษใหม่และเหมาะกับงานพิมพ์ทั่วไป',
  },
  {
    category: 'ทำความสะอาด',
    ecoScore: 22,
    id: 'eco-cleaner',
    label: 'น้ำยาทำความสะอาด Eco Label',
    price: 190,
    reason: 'ลดสารเคมีรุนแรงและปลอดภัยกับผู้ใช้งานมากขึ้น',
  },
  {
    category: 'อุปกรณ์สำนักงาน',
    ecoScore: 18,
    id: 'refill-pen',
    label: 'ปากกาแบบเติมไส้ได้',
    price: 140,
    reason: 'ลดขยะจากปากกาใช้แล้วทิ้ง',
  },
  {
    category: 'พลังงาน',
    ecoScore: 21,
    id: 'recharge-battery',
    label: 'ถ่านชาร์จพร้อมกล่องเก็บ',
    price: 320,
    reason: 'ใช้ซ้ำได้หลายรอบและลดขยะอันตรายจากถ่านใช้ครั้งเดียว',
  },
  {
    category: 'จัดเลี้ยง',
    ecoScore: 16,
    id: 'reusable-cup',
    label: 'แก้วใช้ซ้ำสำหรับกิจกรรม',
    price: 280,
    reason: 'ลดแก้วพลาสติกใช้ครั้งเดียวหลังจบกิจกรรม',
  },
  {
    category: 'ตัวเลือกเสี่ยง',
    ecoScore: 4,
    id: 'single-use-cup',
    label: 'แก้วพลาสติกใช้ครั้งเดียว 100 ใบ',
    price: 120,
    reason: 'ราคาถูกแต่สร้างขยะจำนวนมากหลังใช้งาน',
  },
  {
    category: 'ตัวเลือกเสี่ยง',
    ecoScore: 6,
    id: 'regular-paper',
    label: 'กระดาษขาวทั่วไปแบบไม่ระบุแหล่งที่มา',
    price: 180,
    reason: 'ควรเลือกวัสดุที่มีข้อมูลสิ่งแวดล้อมหรือแหล่งที่มาชัดเจนกว่า',
  },
]

export function GameHubPage() {
  const [activeGameId, setActiveGameId] = useState<MeaGoGameId>(
    'green-office-manager'
  )
  const activeGame =
    MEA_GO_GAMES.find((game) => game.id === activeGameId) ?? MEA_GO_GAMES[0]

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

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:py-12">
        <GameCatalogNav
          activeGameId={activeGame.id}
          onSelectGame={setActiveGameId}
        />
        <GamePlayArena game={activeGame} key={activeGame.id} />
      </section>
    </main>
  )
}

function EnergyHunterGame() {
  const [foundIds, setFoundIds] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(45)
  const [finished, setFinished] = useState(false)
  const complete = foundIds.length === ENERGY_HOTSPOTS.length

  function findHotspot(id: string) {
    if (!running || foundIds.includes(id)) return

    const nextFoundIds = [...foundIds, id]
    setFoundIds(nextFoundIds)
    if (nextFoundIds.length === ENERGY_HOTSPOTS.length) {
      setRunning(false)
      setFinished(true)
    }
  }

  function start() {
    setFoundIds([])
    setSecondsLeft(45)
    setFinished(false)
    setRunning(true)
  }

  useEffect(() => {
    if (!running || finished) return

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          setRunning(false)
          setFinished(true)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [finished, running])

  return (
    <section className="grid gap-5">
      <GameStatusBar
        accent="#7a5c00"
        items={[
          { label: 'เวลา', value: `${secondsLeft}s` },
          {
            label: 'พบแล้ว',
            value: `${foundIds.length}/${ENERGY_HOTSPOTS.length}`,
          },
          { label: 'คะแนน', value: `${foundIds.length * 20}` },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <OfficeScene
          disabled={!running}
          foundIds={foundIds}
          hotspots={ENERGY_HOTSPOTS}
          onFindHotspot={findHotspot}
          tone="energy"
        />
        <GameInstructionPanel
          actionLabel={running ? 'กำลังค้นหา' : 'เริ่มจับเวลา'}
          disabled={running}
          icon={<IconBolt aria-hidden="true" className="size-5" />}
          onAction={start}
          title="หาให้ครบก่อนหมดเวลา"
        >
          คลิกจุดที่สิ้นเปลืองพลังงานในสำนักงาน เช่น ไฟ แอร์ จอคอมพิวเตอร์
          หรือปลั๊กที่เปิดทิ้งไว้
        </GameInstructionPanel>
      </div>

      <FoundFeedback
        emptyText="เริ่มเกมแล้วคลิกจุดสิ้นเปลืองพลังงานเพื่อดูคำแนะนำ"
        foundIds={foundIds}
        hotspots={ENERGY_HOTSPOTS}
      />

      {finished ? (
        <GameResult
          actionLabel="เล่น Energy Hunter อีกครั้ง"
          detail={
            complete
              ? 'ยอดเยี่ยม พบจุดสิ้นเปลืองพลังงานครบทั้งหมด'
              : 'หมดเวลาแล้ว ลองเล่นอีกครั้งเพื่อหาจุดที่เหลือให้ครบ'
          }
          onRestart={start}
          score={foundIds.length * 20}
          title="สรุป Energy Hunter"
        />
      ) : null}
    </section>
  )
}

function FoundFeedback({
  emptyText,
  foundIds,
  hotspots,
}: {
  emptyText: string
  foundIds: string[]
  hotspots: typeof ENERGY_HOTSPOTS
}) {
  const foundItems = hotspots.filter((item) => foundIds.includes(item.id))

  return (
    <section className="border border-[#e4e8df] bg-white p-5">
      <h3 className="font-bold">Feedback ที่พบแล้ว</h3>
      {foundItems.length > 0 ? (
        <ul className="mt-3 grid gap-2">
          {foundItems.map((item) => (
            <li
              className="flex gap-3 border border-[#e4e8df] bg-[#effff3] p-3 text-sm leading-6"
              key={item.id}
            >
              <IconCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[#168542]"
              />
              <span>
                <strong>{item.label}</strong>: {item.tip}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[#5a615b]">{emptyText}</p>
      )}
    </section>
  )
}

function GameCatalogNav({
  activeGameId,
  onSelectGame,
}: {
  activeGameId: MeaGoGameId
  onSelectGame: (gameId: MeaGoGameId) => void
}) {
  return (
    <aside className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
      <section className="border border-[#e4e8df] bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-base grid size-10 place-items-center bg-[#111111] text-[#5df591]">
            <IconBook aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold">MEA GO Games</h2>
            <p className="text-sm leading-5 text-[#5a615b]">
              เกมฝึกตาม 4 หมวดมาตรฐานองค์กรสีเขียว
            </p>
          </div>
        </div>

        <nav aria-label="เลือกเกม MEA GO" className="mt-5 grid gap-2">
          {MEA_GO_GAMES.map((game) => {
            const Icon = game.icon
            const active = activeGameId === game.id

            return (
              <button
                aria-pressed={active}
                className={cn(
                  'group border border-[#e4e8df] bg-[#f7f8f3] p-4 text-left transition hover:border-[#111111] focus-visible:ring-2 focus-visible:ring-[#5df591] focus-visible:ring-offset-2 focus-visible:outline-none',
                  active && 'border-[#111111] bg-[#111111] text-white'
                )}
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                type="button"
              >
                <span className="flex items-start gap-3">
                  <span
                    className={cn(
                      'rounded-base grid size-11 shrink-0 place-items-center text-[#111111]',
                      active ? 'bg-[#5df591]' : 'bg-white'
                    )}
                    style={{
                      backgroundColor: active ? '#5df591' : game.accent,
                    }}
                  >
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold">{game.title}</span>
                    <span
                      className={cn(
                        'mt-1 block text-sm leading-5',
                        active ? 'text-white/72' : 'text-[#5a615b]'
                      )}
                    >
                      {game.genre}
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </nav>
      </section>

      <section className="border border-[#111111] bg-[#5df591] p-5 text-[#111111]">
        <p className="text-sm font-bold">Learning outcome</p>
        <p className="mt-2 text-2xl leading-tight font-bold">
          เลือกเกมให้ตรงกับพฤติกรรมที่อยากเปลี่ยน
        </p>
        <p className="mt-3 text-sm leading-6 text-[#173d2a]">
          ทุกเกมถูกออกแบบให้เริ่มจากสถานการณ์ในสำนักงาน
          แล้วสรุปกลับเป็นแนวทางปฏิบัติจริง
        </p>
      </section>
    </aside>
  )
}

function GameInstructionPanel({
  actionLabel,
  children,
  disabled,
  icon,
  onAction,
  title,
}: {
  actionLabel: string
  children: React.ReactNode
  disabled?: boolean
  icon: React.ReactNode
  onAction: () => void
  title: string
}) {
  return (
    <aside className="border border-[#111111] bg-[#111111] p-5 text-white">
      <div className="flex items-center gap-2 text-[#5df591]">
        {icon}
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/72">{children}</p>
      <Button
        className="mt-5 w-full bg-[#5df591] font-bold text-[#111111] hover:bg-[#49db7b]"
        disabled={disabled}
        onClick={onAction}
        type="button"
      >
        <IconPlayerPlay data-icon="inline-start" />
        {actionLabel}
      </Button>
    </aside>
  )
}

function GamePlayArena({ game }: { game: (typeof MEA_GO_GAMES)[number] }) {
  const Icon = game.icon

  return (
    <section className="border border-[#111111] bg-white">
      <div className="grid border-b border-[#111111] lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-base grid size-12 place-items-center text-[#111111]"
              style={{ backgroundColor: game.accent }}
            >
              <Icon aria-hidden="true" className="size-7" />
            </span>
            <div>
              <Badge className="rounded-base bg-[#111111] text-white">
                {game.category}
              </Badge>
              <h2 className="mt-2 text-3xl leading-tight font-bold tracking-[-0.02em]">
                {game.title}
              </h2>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#343b35]">
            {game.howToPlay}
          </p>
        </div>
        <aside className="grid content-center gap-4 border-t border-[#111111] bg-[#f7f8f3] p-5 lg:border-t-0 lg:border-l">
          <div>
            <p className="text-sm font-bold text-[#168542]">
              สิ่งที่ได้เรียนรู้
            </p>
            <p className="mt-1 leading-7 text-[#234734]">{game.learning}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-base bg-white text-[#111111]">
              {game.genre}
            </Badge>
            <Badge className="rounded-base bg-[#5df591] text-[#111111]">
              เล่นได้ทันที
            </Badge>
          </div>
        </aside>
      </div>

      <div className="p-5 sm:p-7">
        <div className="mb-5 grid gap-3 border border-[#e4e8df] bg-[#effff3] p-4 md:grid-cols-3">
          {['อ่านโจทย์', 'เลือกหรือคลิก', 'ดู feedback'].map((step) => (
            <div className="flex items-center gap-3" key={step}>
              <span className="rounded-base grid size-8 shrink-0 place-items-center bg-[#111111] text-[#5df591]">
                <IconCheck aria-hidden="true" className="size-4" />
              </span>
              <span className="font-bold">{step}</span>
            </div>
          ))}
        </div>

        {game.id === 'green-office-manager' ? <GreenOfficeManagerGame /> : null}
        {game.id === 'energy-hunter' ? <EnergyHunterGame /> : null}
        {game.id === 'green-shopping-challenge' ? (
          <GreenShoppingChallengeGame />
        ) : null}
        {game.id === 'safety-inspector' ? <SafetyInspectorGame /> : null}
      </div>
    </section>
  )
}

function GameResult({
  actionLabel,
  detail,
  onRestart,
  score,
  title,
}: {
  actionLabel: string
  detail: string
  onRestart: () => void
  score: number
  title: string
}) {
  return (
    <section className="grid gap-4 border border-[#111111] bg-[#effff3] p-5 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex gap-3">
        <span className="rounded-base grid size-12 shrink-0 place-items-center bg-[#111111] text-[#5df591]">
          <IconTrophy aria-hidden="true" className="size-6" />
        </span>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="mt-1 leading-6 text-[#234734]">{detail}</p>
          <p className="mt-2 font-bold text-[#111111]">คะแนนรวม {score}</p>
        </div>
      </div>
      <Button
        className="w-fit bg-[#111111] text-white hover:bg-[#2a2a2a]"
        onClick={onRestart}
        type="button"
      >
        <IconRefresh data-icon="inline-start" />
        {actionLabel}
      </Button>
    </section>
  )
}

function GameStatusBar({
  accent,
  items,
}: {
  accent: string
  items: { label: string; value: string }[]
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div className="border border-[#111111] bg-white p-4" key={item.label}>
          <p className="text-sm font-bold text-[#4d5053]">{item.label}</p>
          <p className="mt-1 text-3xl font-bold" style={{ color: accent }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function GreenOfficeManagerGame() {
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const currentScenario = OFFICE_MANAGER_SCENARIOS[answers.length]
  const totalScore = answers.reduce(
    (sum, answerIndex, scenarioIndex) =>
      sum + OFFICE_MANAGER_SCENARIOS[scenarioIndex].options[answerIndex].effect,
    0
  )
  const maxScore = OFFICE_MANAGER_SCENARIOS.length * 10

  function choose(optionIndex: number) {
    if (finished || !currentScenario) return

    const nextAnswers = [...answers, optionIndex]
    setAnswers(nextAnswers)
    if (nextAnswers.length === OFFICE_MANAGER_SCENARIOS.length) {
      setFinished(true)
    }
  }

  function restart() {
    setAnswers([])
    setFinished(false)
  }

  return (
    <section className="grid gap-5">
      <GameStatusBar
        accent="#168542"
        items={[
          {
            label: 'สถานการณ์',
            value: `${Math.min(answers.length + 1, OFFICE_MANAGER_SCENARIOS.length)}/${OFFICE_MANAGER_SCENARIOS.length}`,
          },
          { label: 'Green Score', value: `${totalScore}/${maxScore}` },
          { label: 'ตัวเลือกที่ทำแล้ว', value: `${answers.length}` },
        ]}
      />

      {!finished && currentScenario ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="border border-[#111111] bg-[#f7f8f3] p-5 sm:p-6">
            <p className="text-sm font-bold text-[#168542]">
              สถานการณ์ในสำนักงาน
            </p>
            <h3 className="mt-2 text-2xl leading-tight font-bold">
              {currentScenario.prompt}
            </h3>
            <div className="mt-5 grid gap-3">
              {currentScenario.options.map((option, index) => (
                <button
                  className="border border-[#d7ddd4] bg-white p-4 text-left transition hover:border-[#111111] hover:bg-[#effff3] focus-visible:ring-2 focus-visible:ring-[#5df591] focus-visible:ring-offset-2 focus-visible:outline-none"
                  key={option.label}
                  onClick={() => choose(index)}
                  type="button"
                >
                  <span className="font-bold">{option.label}</span>
                  <span className="mt-1 block text-sm text-[#5a615b]">
                    +{option.effect} Green Score
                  </span>
                </button>
              ))}
            </div>
          </section>
          <aside className="border border-[#111111] bg-[#5df591] p-5 text-[#111111]">
            <IconBuildingCommunity aria-hidden="true" className="size-8" />
            <h3 className="mt-4 text-xl font-bold">เลือกแนวทางบริหาร</h3>
            <p className="mt-2 text-sm leading-6 text-[#173d2a]">
              คะแนนสูงมาจากทางเลือกที่ลดการใช้ทรัพยากร สื่อสารให้ทีมทำตามได้
              และเก็บข้อมูลต่อเนื่อง
            </p>
          </aside>
        </div>
      ) : null}

      <OfficeManagerFeedback answers={answers} />

      {finished ? (
        <GameResult
          actionLabel="เริ่มบริหารใหม่"
          detail={
            totalScore >= 35
              ? 'บริหารได้ดีมาก เห็นทั้งพลังงาน กระดาษ ขยะ และการจัดซื้อ'
              : 'ยังมีโอกาสเพิ่มคะแนนด้วยการเลือกแนวทางที่ลดทรัพยากรตั้งแต่ต้นทาง'
          }
          onRestart={restart}
          score={totalScore}
          title="สรุป Green Office Manager"
        />
      ) : null}
    </section>
  )
}

function GreenShoppingChallengeGame() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const selectedItems = SHOPPING_ITEMS.filter((item) =>
    selectedIds.includes(item.id)
  )
  const spent = selectedItems.reduce((sum, item) => sum + item.price, 0)
  const ecoScore = selectedItems.reduce((sum, item) => sum + item.ecoScore, 0)
  const overBudget = spent > SHOPPING_BUDGET
  const canFinish = selectedItems.length >= 4 && !overBudget

  function toggleItem(id: string) {
    if (finished) return
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    )
  }

  function restart() {
    setSelectedIds([])
    setFinished(false)
  }

  return (
    <section className="grid gap-5">
      <GameStatusBar
        accent={overBudget ? '#c94a24' : '#168542'}
        items={[
          { label: 'งบประมาณ', value: `${spent}/${SHOPPING_BUDGET}` },
          { label: 'สินค้า', value: `${selectedItems.length}` },
          { label: 'Eco Score', value: `${ecoScore}` },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {SHOPPING_ITEMS.map((item) => {
            const active = selectedIds.includes(item.id)

            return (
              <button
                aria-pressed={active}
                className={cn(
                  'border border-[#d7ddd4] bg-white p-4 text-left transition hover:border-[#111111] focus-visible:ring-2 focus-visible:ring-[#5df591] focus-visible:ring-offset-2 focus-visible:outline-none',
                  active && 'border-[#111111] bg-[#effff3]'
                )}
                key={item.id}
                onClick={() => toggleItem(item.id)}
                type="button"
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-bold">{item.label}</span>
                    <span className="mt-1 block text-xs font-bold text-[#168542]">
                      {item.category}
                    </span>
                  </span>
                  {active ? (
                    <IconCheck
                      aria-hidden="true"
                      className="size-5 shrink-0 text-[#168542]"
                    />
                  ) : null}
                </span>
                <span className="mt-4 flex items-center gap-2 text-sm font-bold">
                  <IconCoin aria-hidden="true" className="size-4" />
                  {item.price} บาท
                </span>
                <span className="mt-2 block text-sm leading-6 text-[#5a615b]">
                  {item.reason}
                </span>
              </button>
            )
          })}
        </section>

        <aside className="border border-[#111111] bg-[#111111] p-5 text-white">
          <div className="flex items-center gap-2 text-[#5df591]">
            <IconShoppingCart aria-hidden="true" className="size-5" />
            <h3 className="font-bold">ตะกร้าจัดซื้อ</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/72">
            เลือกอย่างน้อย 4 รายการโดยไม่เกินงบ 1,200 บาท
            คะแนนสูงเมื่อเลือกสินค้าที่ลดผลกระทบต่อสิ่งแวดล้อม
          </p>
          <div className="mt-4 border border-white/20 bg-white/8 p-3">
            <p className={cn('font-bold', overBudget && 'text-[#ff9f6e]')}>
              ใช้งบ {spent} / {SHOPPING_BUDGET} บาท
            </p>
            <p className="mt-1 text-sm text-white/72">
              {overBudget
                ? 'งบเกินแล้ว ลองถอดบางรายการออก'
                : canFinish
                  ? 'พร้อมส่งตะกร้าแล้ว'
                  : 'เลือกสินค้าให้ครบอย่างน้อย 4 รายการ'}
            </p>
          </div>
          <Button
            className="mt-5 w-full bg-[#5df591] font-bold text-[#111111] hover:bg-[#49db7b]"
            disabled={!canFinish || finished}
            onClick={() => setFinished(true)}
            type="button"
          >
            <IconCheck data-icon="inline-start" />
            ส่งตะกร้า
          </Button>
        </aside>
      </div>

      {finished ? (
        <GameResult
          actionLabel="เลือกสินค้าใหม่"
          detail={
            ecoScore >= 80
              ? 'ตะกร้านี้สมดุลดี เลือกของใช้ซ้ำได้ ประหยัดพลังงาน และมีข้อมูลสิ่งแวดล้อม'
              : 'ผ่านงบแล้ว แต่ยังเพิ่ม Eco Score ได้ด้วยการเลี่ยงสินค้าใช้ครั้งเดียว'
          }
          onRestart={restart}
          score={ecoScore}
          title="สรุป Green Shopping Challenge"
        />
      ) : null}
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
            เรียนรู้ MEA GO
            <span className="block text-[#168542]">ในรูปแบบเกม</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4d5053]">
            เปลี่ยน 4 หมวดมาตรฐานองค์กรสีเขียวให้เป็นเกมสั้น ๆ
            ที่ช่วยให้ผู้เรียนตัดสินใจ ค้นหา เลือกซื้อ
            และตรวจความปลอดภัยจากสถานการณ์ใกล้ตัว
          </p>
        </div>

        <div className="bg-[#111111] p-5 text-white">
          <div className="neo-surface bg-[#5df591] p-5 text-[#111111]">
            <p className="text-sm font-bold">เส้นทางแนะนำ</p>
            <h2 className="mt-3 text-3xl font-bold">Standard → Game → Habit</h2>
            <p className="mt-3 text-sm leading-6 text-[#173d2a]">
              เริ่มจากหมวดมาตรฐาน เล่นผ่านสถานการณ์
              แล้วแปลงเป็นพฤติกรรมสีเขียวในสำนักงาน
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="neo-flat bg-white/8 p-4">
              <p className="text-4xl font-bold text-[#5df591]">4</p>
              <p className="mt-1 text-sm font-semibold text-white/72">
                เกมหลักตาม MEA GO Standard
              </p>
            </div>
            <div className="neo-flat bg-white/8 p-4">
              <p className="text-4xl font-bold text-white">4</p>
              <p className="mt-1 text-sm font-semibold text-white/72">
                หมวดองค์กรสีเขียวที่ต้องฝึก
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OfficeManagerFeedback({ answers }: { answers: number[] }) {
  if (answers.length === 0) {
    return (
      <section className="border border-[#e4e8df] bg-white p-5">
        <h3 className="font-bold">Feedback</h3>
        <p className="mt-2 text-sm leading-6 text-[#5a615b]">
          เลือกคำตอบแรกเพื่อดูเหตุผลและคะแนนของการตัดสินใจ
        </p>
      </section>
    )
  }

  return (
    <section className="border border-[#e4e8df] bg-white p-5">
      <h3 className="font-bold">Feedback จากการตัดสินใจ</h3>
      <ol className="mt-3 grid gap-2">
        {answers.map((answerIndex, scenarioIndex) => {
          const option =
            OFFICE_MANAGER_SCENARIOS[scenarioIndex].options[answerIndex]

          return (
            <li
              className="border border-[#e4e8df] bg-[#f7f8f3] p-3 text-sm leading-6"
              key={`${scenarioIndex}-${answerIndex}`}
            >
              <strong>+{option.effect}:</strong> {option.feedback}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function OfficeScene({
  disabled,
  foundIds,
  hotspots,
  onFindHotspot,
  tone,
}: {
  disabled?: boolean
  foundIds: string[]
  hotspots: typeof ENERGY_HOTSPOTS
  onFindHotspot: (id: string) => void
  tone: 'energy' | 'safety'
}) {
  return (
    <section className="border border-[#111111] bg-[#f7f8f3] p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">
            {tone === 'energy' ? 'บอร์ดตรวจพลังงาน' : 'บอร์ดตรวจความปลอดภัย'}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#5a615b]">
            {tone === 'energy'
              ? 'กดเริ่มจับเวลา แล้วคลิกโซนที่มีสัญญาณสิ้นเปลืองพลังงาน'
              : 'คลิกโซนที่มีสัญญาณเสี่ยงเพื่อดูแนวทางแก้ไข'}
          </p>
        </div>
        <span className="w-fit border border-[#111111] bg-white px-3 py-1 text-sm font-bold">
          {foundIds.length}/{hotspots.length} จุด
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
        {hotspots.map((hotspot) => {
          const found = foundIds.includes(hotspot.id)

          return (
            <button
              aria-label={hotspot.label}
              aria-pressed={found}
              className={cn(
                'min-h-44 border border-[#d7ddd4] bg-white p-4 text-left transition focus-visible:ring-2 focus-visible:ring-[#5df591] focus-visible:ring-offset-2 focus-visible:outline-none',
                found && 'border-[#111111] bg-[#effff3]',
                !found &&
                  !disabled &&
                  'hover:border-[#111111] hover:bg-[#fffef0]',
                disabled && !found && 'cursor-not-allowed opacity-50'
              )}
              disabled={disabled || found}
              key={hotspot.id}
              onClick={() => onFindHotspot(hotspot.id)}
              type="button"
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-xs font-bold text-[#168542]">
                    {hotspot.zone}
                  </span>
                  <span className="mt-1 block text-lg leading-tight font-bold">
                    {hotspot.label}
                  </span>
                </span>
                <span
                  className={cn(
                    'rounded-base grid size-9 shrink-0 place-items-center border border-[#111111]',
                    found
                      ? 'bg-[#5df591]'
                      : tone === 'energy'
                        ? 'bg-[#facc00]'
                        : 'bg-[#ff9f6e]'
                  )}
                >
                  {found ? (
                    <IconCheck aria-hidden="true" className="size-5" />
                  ) : tone === 'energy' ? (
                    <IconBolt aria-hidden="true" className="size-5" />
                  ) : (
                    <IconAlertTriangle aria-hidden="true" className="size-5" />
                  )}
                </span>
              </span>
              <span className="mt-4 block text-sm leading-6 text-[#5a615b]">
                {found ? hotspot.tip : hotspot.signal}
              </span>
              <span className="mt-3 inline-flex border border-[#d7ddd4] bg-[#f7f8f3] px-2 py-1 text-xs font-bold text-[#343b35]">
                {found
                  ? 'แก้ไขแล้ว'
                  : disabled
                    ? 'กดเริ่มก่อน'
                    : 'คลิกเพื่อตรวจ'}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function SafetyInspectorGame() {
  const [foundIds, setFoundIds] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const complete = foundIds.length === SAFETY_HAZARDS.length

  function findHazard(id: string) {
    if (finished || foundIds.includes(id)) return

    const nextFoundIds = [...foundIds, id]
    setFoundIds(nextFoundIds)
    if (nextFoundIds.length === SAFETY_HAZARDS.length) {
      setFinished(true)
    }
  }

  function restart() {
    setFoundIds([])
    setFinished(false)
  }

  return (
    <section className="grid gap-5">
      <GameStatusBar
        accent="#9a3d16"
        items={[
          {
            label: 'จุดเสี่ยง',
            value: `${foundIds.length}/${SAFETY_HAZARDS.length}`,
          },
          { label: 'ระดับตรวจครบ', value: complete ? 'ผ่าน' : 'กำลังตรวจ' },
          { label: 'คะแนน', value: `${foundIds.length * 20}` },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <OfficeScene
          foundIds={foundIds}
          hotspots={SAFETY_HAZARDS}
          onFindHotspot={findHazard}
          tone="safety"
        />
        <GameInstructionPanel
          actionLabel="เริ่มตรวจใหม่"
          icon={<IconShieldCheck aria-hidden="true" className="size-5" />}
          onAction={restart}
          title="ตรวจจุดเสี่ยง"
        >
          คลิกตำแหน่งที่เสี่ยงต่ออุบัติเหตุในสำนักงาน
          แล้วอ่านวิธีแก้ไขเพื่อจัดสภาพแวดล้อมให้ปลอดภัยขึ้น
        </GameInstructionPanel>
      </div>

      <FoundFeedback
        emptyText="คลิกจุดเสี่ยงในภาพเพื่อดูวิธีแก้ไข"
        foundIds={foundIds}
        hotspots={SAFETY_HAZARDS}
      />

      {finished ? (
        <GameResult
          actionLabel="ตรวจอีกรอบ"
          detail="ตรวจพบจุดเสี่ยงครบแล้ว พร้อมนำรายการนี้ไปทำ safety walk ในพื้นที่จริง"
          onRestart={restart}
          score={foundIds.length * 20}
          title="สรุป Safety Inspector"
        />
      ) : null}
    </section>
  )
}
