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
  IconHeart,
  IconLeaf,
  IconLock,
  IconPlayerPlay,
  IconRecycle,
  IconRefresh,
  IconShieldCheck,
  IconShoppingCart,
  IconSparkles,
  IconTargetArrow,
  IconTrophy,
  IconX,
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
    genre: 'Rapid Decision',
    howToPlay: 'ตัดสินใจทีละสถานการณ์ว่าควรหยุดพลังงานหรือใช้งานต่อ',
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
    genre: 'Memory Match',
    howToPlay: 'จับคู่จุดเสี่ยงกับวิธีแก้ไขโดยใช้จำนวนครั้งให้น้อยที่สุด',
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

const _SAFETY_HAZARDS = [
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

const SHOPPING_BUDGET = 900

const _SHOPPING_ITEMS = [
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

const ENERGY_TILES = [
  ...ENERGY_HOTSPOTS.map((item) => ({ ...item, isWaste: true })),
  {
    id: 'daylight',
    isWaste: false,
    label: 'พื้นที่ริมหน้าต่าง',
    signal: 'ใช้แสงธรรมชาติและปิดไฟแถวริมหน้าต่างแล้ว',
    tip: 'ทำได้ดีแล้ว ใช้แสงธรรมชาติช่วยลดการใช้ไฟ',
    zone: 'โซนทำงาน B',
  },
  {
    id: 'eco-mode',
    isWaste: false,
    label: 'เครื่องถ่ายเอกสาร',
    signal: 'เปิดโหมดประหยัดพลังงานและพิมพ์สองหน้าอัตโนมัติ',
    tip: 'การตั้งค่านี้เหมาะสมแล้ว ไม่ต้องแก้ไข',
    zone: 'ห้องเอกสาร',
  },
  {
    id: 'meeting',
    isWaste: false,
    label: 'จอห้องอบรม',
    signal: 'กำลังนำเสนอให้ผู้เข้าร่วม 24 คน',
    tip: 'อุปกรณ์กำลังถูกใช้งานตามความจำเป็น',
    zone: 'ห้องอบรม',
  },
  {
    id: 'server',
    isWaste: false,
    label: 'ระบบเซิร์ฟเวอร์',
    signal: 'ทำงานตามแผนระบบและมีการวัดโหลดแบบเรียลไทม์',
    tip: 'เป็นโหลดที่จำเป็นและมีระบบติดตามแล้ว',
    zone: 'ห้องระบบ',
  },
  {
    id: 'sensor',
    isWaste: false,
    label: 'ไฟทางเดิน',
    signal: 'เซนเซอร์เปิดไฟเฉพาะเมื่อมีคนเดินผ่าน',
    tip: 'ระบบควบคุมตามการใช้งานช่วยลดพลังงานได้ดี',
    zone: 'ทางเดินกลาง',
  },
]

const ENERGY_GAME_SITUATIONS = [
  ENERGY_TILES[0],
  ENERGY_TILES[5],
  ENERGY_TILES[1],
  ENERGY_TILES[7],
  ENERGY_TILES[2],
  ENERGY_TILES[6],
  ENERGY_TILES[3],
  ENERGY_TILES[9],
  ENERGY_TILES[4],
  ENERGY_TILES[8],
] as (typeof ENERGY_TILES)[number][]

const SHOPPING_ROUNDS = [
  {
    category: 'แสงสว่าง',
    mission: 'เปลี่ยนหลอดไฟในพื้นที่ส่วนกลาง',
    options: [
      {
        ecoScore: 25,
        id: 'led',
        label: 'หลอด LED ฉลากประหยัดไฟ',
        price: 260,
        reason: 'ใช้ไฟน้อย อายุใช้งานยาว และมีฉลากรับรอง',
      },
      {
        ecoScore: 7,
        id: 'cheap-bulb',
        label: 'หลอดราคาประหยัด ไม่ระบุประสิทธิภาพ',
        price: 120,
        reason: 'ราคาต่ำกว่า แต่ไม่มีข้อมูลประสิทธิภาพและอายุใช้งาน',
      },
    ],
  },
  {
    category: 'เอกสาร',
    mission: 'จัดซื้อกระดาษสำหรับงานประจำเดือน',
    options: [
      {
        ecoScore: 25,
        id: 'recycled-paper',
        label: 'กระดาษรีไซเคิล 80 gsm',
        price: 210,
        reason: 'ลดการใช้เยื่อใหม่และเหมาะกับงานพิมพ์ทั่วไป',
      },
      {
        ecoScore: 8,
        id: 'regular-paper',
        label: 'กระดาษขาว ไม่ระบุแหล่งที่มา',
        price: 180,
        reason: 'ยังไม่มีข้อมูลแหล่งที่มาหรือการรับรองสิ่งแวดล้อม',
      },
    ],
  },
  {
    category: 'ทำความสะอาด',
    mission: 'เลือกน้ำยาสำหรับทีมแม่บ้าน',
    options: [
      {
        ecoScore: 25,
        id: 'eco-cleaner',
        label: 'น้ำยาทำความสะอาด Eco Label',
        price: 190,
        reason: 'ลดสารเคมีรุนแรงและมีข้อมูลการใช้งานชัดเจน',
      },
      {
        ecoScore: 6,
        id: 'strong-cleaner',
        label: 'น้ำยาเข้มข้น ไม่ระบุฉลากสิ่งแวดล้อม',
        price: 110,
        reason: 'ราคาถูกกว่า แต่ข้อมูลผลกระทบและความปลอดภัยไม่ชัดเจน',
      },
    ],
  },
  {
    category: 'จัดเลี้ยง',
    mission: 'เตรียมแก้วสำหรับกิจกรรมภายใน',
    options: [
      {
        ecoScore: 25,
        id: 'reusable-cup',
        label: 'แก้วใช้ซ้ำพร้อมจุดล้างคืน',
        price: 280,
        reason: 'ลงทุนครั้งเดียวและลดขยะจากกิจกรรมครั้งต่อไปได้',
      },
      {
        ecoScore: 5,
        id: 'single-use-cup',
        label: 'แก้วพลาสติกใช้ครั้งเดียว 100 ใบ',
        price: 120,
        reason: 'ประหยัดงบระยะสั้นแต่สร้างขยะทันทีหลังจบกิจกรรม',
      },
    ],
  },
]

const SAFETY_PAIRS = [
  {
    hazard: 'สายไฟพาดทางเดิน',
    id: 'cable',
    solution: 'ใช้รางครอบสายและย้ายพ้นทางเดิน',
  },
  {
    hazard: 'พื้นเปียกไม่มีป้ายเตือน',
    id: 'spill',
    solution: 'เช็ดพื้นและตั้งป้ายจนกว่าจะแห้ง',
  },
  {
    hazard: 'กล่องวางบังทางออกฉุกเฉิน',
    id: 'exit',
    solution: 'ย้ายสิ่งกีดขวางและรักษาทางออกให้โล่ง',
  },
  {
    hazard: 'แฟ้มเอกสารกองสูงเสี่ยงหล่น',
    id: 'stack',
    solution: 'เก็บในชั้นมั่นคงและไม่วางสูงเกินไป',
  },
  {
    hazard: 'ขวดสารเคมีไม่มีฉลาก',
    id: 'chemical',
    solution: 'ติดฉลากและเก็บแยกในตู้เฉพาะ',
  },
]

type SafetyCard = {
  id: string
  kind: 'hazard' | 'solution'
  pairId: string
  text: string
}

export function GameHubPage() {
  const [activeGameId, setActiveGameId] = useState<MeaGoGameId>(
    'green-office-manager'
  )
  const activeGame =
    MEA_GO_GAMES.find((game) => game.id === activeGameId) ?? MEA_GO_GAMES[0]

  return (
    <main className="min-h-dvh bg-[#f7f8f3] text-[#111111]">
      <header className="sticky top-0 z-50 border-b border-[#eceee7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              aria-label="ย้อนกลับหน้าหลัก"
              className="rounded-base border-[#e1e1e1] bg-white text-[#111111] hover:bg-[#f7f8f3]"
              nativeButton={false}
              render={<Link href="/" />}
            >
              <IconArrowLeft data-icon="inline-start" />
              <span className="hidden sm:inline">ย้อนกลับ</span>
            </Button>
            <Link className="flex items-center gap-3 font-bold" href="/">
              <span className="rounded-base flex size-10 items-center justify-center bg-[#111111] text-[#5df591]">
                <IconLeaf aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">Go Green</span>
            </Link>
          </div>
          <Button
            aria-label="เปิดเกมแยกขยะ 4 สี"
            className="rounded-base bg-[#5df591] font-bold text-[#111111] hover:bg-[#49db7b]"
            nativeButton={false}
            render={<Link href="/game/waste-sort" />}
          >
            <IconRecycle data-icon="inline-start" />
            <span className="hidden sm:inline">เกมแยกขยะ 4 สี</span>
          </Button>
        </div>
      </header>

      <LearningHubHero />

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:py-10">
        <GameCatalogNav
          activeGameId={activeGame.id}
          onSelectGame={setActiveGameId}
        />
        <GamePlayArena game={activeGame} key={activeGame.id} />
      </section>
    </main>
  )
}

function createSafetyDeck(shuffle = false): SafetyCard[] {
  const cards = SAFETY_PAIRS.flatMap((pair) => [
    {
      id: `${pair.id}-hazard`,
      kind: 'hazard' as const,
      pairId: pair.id,
      text: pair.hazard,
    },
    {
      id: `${pair.id}-solution`,
      kind: 'solution' as const,
      pairId: pair.id,
      text: pair.solution,
    },
  ])

  if (shuffle) {
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      ;[cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]]
    }
  }

  return cards
}

function EnergyHunterGame() {
  const [roundIndex, setRoundIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const [selectedDecision, setSelectedDecision] = useState<
    'continue' | 'stop' | null
  >(null)
  const [combo, setCombo] = useState(0)
  const [score, setScore] = useState(0)
  const currentSituation = ENERGY_GAME_SITUATIONS[roundIndex]
  const answeredCorrectly =
    selectedDecision !== null &&
    currentSituation !== undefined &&
    (selectedDecision === 'stop') === currentSituation.isWaste

  function answer(decision: 'continue' | 'stop') {
    if (!started || finished || selectedDecision || !currentSituation) return

    const correct = (decision === 'stop') === currentSituation.isWaste
    setSelectedDecision(decision)

    if (correct) {
      const nextCombo = combo + 1
      setCombo(nextCombo)
      setScore((current) => current + 100 + Math.max(0, nextCombo - 1) * 20)
      return
    }

    setCombo(0)
    setLives((current) => Math.max(0, current - 1))
  }

  function continueGame() {
    if (roundIndex === ENERGY_GAME_SITUATIONS.length - 1 || lives === 0) {
      setFinished(true)
      setStarted(false)
      return
    }

    setRoundIndex((current) => current + 1)
    setSelectedDecision(null)
  }

  function start() {
    setRoundIndex(0)
    setLives(3)
    setFinished(false)
    setStarted(true)
    setSelectedDecision(null)
    setCombo(0)
    setScore(0)
  }

  return (
    <section className="grid gap-5">
      <GameStatusBar
        accent="#7a5c00"
        items={[
          {
            label: 'สถานการณ์',
            value: `${Math.min(roundIndex + 1, ENERGY_GAME_SITUATIONS.length)}/${ENERGY_GAME_SITUATIONS.length}`,
          },
          {
            label: 'พลังชีวิต',
            value: `${'♥'.repeat(lives)}${'♡'.repeat(3 - lives)}`,
          },
          { label: 'คะแนน / คอมโบ', value: `${score} · x${combo}` },
        ]}
      />

      {!started && !finished ? (
        <section className="overflow-hidden border border-[#111111] bg-white">
          <div className="bg-[#111111] p-5 text-white sm:p-7">
            <div className="flex items-start gap-4">
              <span className="rounded-base grid size-12 shrink-0 place-items-center bg-[#facc00] text-[#111111]">
                <IconTargetArrow aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="font-bold text-[#facc00]">ภารกิจของคุณ</p>
                <h3 className="mt-2 text-2xl leading-tight font-bold sm:text-3xl">
                  อ่านสถานการณ์ แล้วเลือกให้ถูก
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
                  เกมจะแสดงสถานการณ์ในสำนักงานทีละข้อ คุณมีพลังชีวิต 3 ดวง
                  และได้โบนัสเมื่อเลือกถูกต่อเนื่อง
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
            <div className="border border-[#111111] bg-[#fff8d7] p-4">
              <div className="flex items-center gap-2 font-bold">
                <IconBolt aria-hidden="true" className="size-5" />
                หยุดพลังงาน
              </div>
              <p className="mt-2 text-sm leading-6 text-[#5f5000]">
                เลือกเมื่อไม่มีคนใช้ เปิดทิ้งไว้ หรือใช้มากเกินจำเป็น
              </p>
            </div>
            <div className="border border-[#111111] bg-[#effff3] p-4">
              <div className="flex items-center gap-2 font-bold">
                <IconCheck aria-hidden="true" className="size-5" />
                ใช้งานต่อได้
              </div>
              <p className="mt-2 text-sm leading-6 text-[#234734]">
                เลือกเมื่อกำลังใช้งานจริง หรือมีระบบประหยัดพลังงานอยู่แล้ว
              </p>
            </div>
            <Button
              className="mt-1 bg-[#facc00] font-bold text-[#111111] hover:bg-[#e5b900] sm:col-span-2 sm:justify-self-center"
              onClick={start}
              type="button"
            >
              <IconPlayerPlay data-icon="inline-start" />
              เริ่มภารกิจ 10 สถานการณ์
            </Button>
          </div>
        </section>
      ) : null}

      {started && !finished && currentSituation ? (
        <section className="overflow-hidden border border-[#111111] bg-white">
          <div className="h-2 bg-[#e8eadf]">
            <div
              className="h-full bg-[#facc00] transition-[width] duration-200"
              style={{
                width: `${((roundIndex + (selectedDecision ? 1 : 0)) / ENERGY_GAME_SITUATIONS.length) * 100}%`,
              }}
            />
          </div>

          <div className="bg-[#111111] p-5 text-white sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="border border-white/25 px-3 py-1 text-sm font-bold text-[#facc00]">
                สถานการณ์ {roundIndex + 1} · {currentSituation.zone}
              </span>
              <span className="text-sm font-bold text-white/60">
                อ่านสิ่งที่เกิดขึ้นก่อนเลือก
              </span>
            </div>
            <div className="mt-7 flex items-start gap-4">
              <span className="rounded-base grid size-12 shrink-0 place-items-center bg-[#facc00] text-[#111111]">
                <IconBolt aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="text-lg font-bold text-[#facc00]">
                  {currentSituation.label}
                </p>
                <h3 className="mt-2 max-w-3xl text-2xl leading-tight font-bold text-balance sm:text-3xl">
                  {currentSituation.signal}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
            <button
              aria-pressed={selectedDecision === 'stop'}
              className={cn(
                'flex min-h-24 items-center gap-4 border border-[#111111] bg-[#fff8d7] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-[#fff1a6] focus-visible:ring-2 focus-visible:ring-[#facc00] focus-visible:ring-offset-2 focus-visible:outline-none',
                selectedDecision && 'cursor-default opacity-45',
                selectedDecision === 'stop' && 'opacity-100'
              )}
              disabled={selectedDecision !== null}
              onClick={() => answer('stop')}
              type="button"
            >
              <span className="rounded-base grid size-10 shrink-0 place-items-center bg-[#facc00]">
                <IconBolt aria-hidden="true" className="size-5" />
              </span>
              <span>
                <strong className="block">หยุดพลังงาน</strong>
                <span className="mt-1 block text-sm text-[#5f5000]">
                  ปิดหรือปรับทันที
                </span>
              </span>
            </button>

            <button
              aria-pressed={selectedDecision === 'continue'}
              className={cn(
                'flex min-h-24 items-center gap-4 border border-[#111111] bg-[#effff3] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-[#d9fbe2] focus-visible:ring-2 focus-visible:ring-[#5df591] focus-visible:ring-offset-2 focus-visible:outline-none',
                selectedDecision && 'cursor-default opacity-45',
                selectedDecision === 'continue' && 'opacity-100'
              )}
              disabled={selectedDecision !== null}
              onClick={() => answer('continue')}
              type="button"
            >
              <span className="rounded-base grid size-10 shrink-0 place-items-center bg-[#5df591]">
                <IconCheck aria-hidden="true" className="size-5" />
              </span>
              <span>
                <strong className="block">ใช้งานต่อได้</strong>
                <span className="mt-1 block text-sm text-[#234734]">
                  เป็นการใช้งานที่เหมาะสม
                </span>
              </span>
            </button>
          </div>

          {selectedDecision ? (
            <div
              aria-live="polite"
              className={cn(
                'grid gap-4 border-t border-[#111111] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6',
                answeredCorrectly ? 'bg-[#5df591]' : 'bg-[#ffb38d]'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="rounded-base grid size-9 shrink-0 place-items-center bg-[#111111] text-white">
                  {answeredCorrectly ? (
                    <IconCheck aria-hidden="true" className="size-5" />
                  ) : (
                    <IconX aria-hidden="true" className="size-5" />
                  )}
                </span>
                <div>
                  <p className="font-bold">
                    {answeredCorrectly
                      ? `ถูกต้อง${combo > 1 ? ` · คอมโบ x${combo}` : ''}`
                      : `ยังไม่ใช่ · คำตอบคือ ${currentSituation.isWaste ? 'หยุดพลังงาน' : 'ใช้งานต่อได้'}`}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#282c28]">
                    {currentSituation.tip}
                  </p>
                </div>
              </div>
              <Button
                className="bg-[#111111] text-white hover:bg-[#2a2a2a]"
                onClick={continueGame}
                type="button"
              >
                {roundIndex === ENERGY_GAME_SITUATIONS.length - 1 || lives === 0
                  ? 'ดูผลลัพธ์'
                  : 'สถานการณ์ถัดไป'}
              </Button>
            </div>
          ) : null}
        </section>
      ) : null}

      {finished ? (
        <GameResult
          actionLabel="เล่น Energy Hunter อีกครั้ง"
          detail={
            lives > 0 && score >= 900
              ? 'ยอดเยี่ยม แยกการใช้พลังงานที่จำเป็นออกจากจุดสิ้นเปลืองได้แม่นยำ'
              : 'ลองอีกครั้ง โดยดูว่าพื้นที่กำลังถูกใช้งานจริงหรือมีอุปกรณ์เปิดทิ้งไว้'
          }
          onRestart={start}
          score={score + lives * 50}
          title="สรุป Energy Hunter"
        />
      ) : null}
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

        <nav
          aria-label="เลือกเกม MEA GO"
          className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-1"
        >
          {MEA_GO_GAMES.map((game) => {
            const Icon = game.icon
            const active = activeGameId === game.id

            return (
              <button
                aria-pressed={active}
                className={cn(
                  'group min-h-32 border border-[#e4e8df] bg-[#f7f8f3] p-3 text-left transition hover:border-[#111111] focus-visible:ring-2 focus-visible:ring-[#5df591] focus-visible:ring-offset-2 focus-visible:outline-none lg:min-h-0 lg:p-4',
                  active && 'border-[#111111] bg-[#111111] text-white'
                )}
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                type="button"
              >
                <span className="flex flex-col items-start gap-3 lg:flex-row">
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
                        'mt-1 hidden text-sm leading-5 sm:block',
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

      <section className="hidden border border-[#111111] bg-[#5df591] p-5 text-[#111111] lg:block">
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
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<null | number>(
    null
  )
  const [score, setScore] = useState(0)
  const [trust, setTrust] = useState(3)
  const [combo, setCombo] = useState(0)
  const currentScenario = OFFICE_MANAGER_SCENARIOS[currentScenarioIndex]
  const finished = currentScenarioIndex >= OFFICE_MANAGER_SCENARIOS.length

  function chooseOption(optionIndex: number) {
    if (finished || selectedOptionIndex !== null || !currentScenario) return

    const option = currentScenario.options[optionIndex]
    const nextCombo = option.effect === 10 ? combo + 1 : 0
    const earnedScore = option.effect * 10 + Math.max(0, nextCombo - 1) * 20

    setSelectedOptionIndex(optionIndex)
    setScore((current) => current + earnedScore)
    setCombo(nextCombo)
    if (option.effect <= 1) setTrust((current) => Math.max(0, current - 1))
  }

  function continueGame() {
    setSelectedOptionIndex(null)
    setCurrentScenarioIndex((current) => current + 1)
  }

  function restart() {
    setCurrentScenarioIndex(0)
    setSelectedOptionIndex(null)
    setScore(0)
    setTrust(3)
    setCombo(0)
  }

  return (
    <section className="grid gap-5">
      <GameStatusBar
        accent="#168542"
        items={[
          {
            label: 'สถานการณ์',
            value: `${Math.min(currentScenarioIndex + 1, OFFICE_MANAGER_SCENARIOS.length)}/${OFFICE_MANAGER_SCENARIOS.length}`,
          },
          {
            label: 'ชื่อเสียงทีม',
            value: `${'♥'.repeat(trust)}${'♡'.repeat(3 - trust)}`,
          },
          { label: 'คะแนน / คอมโบ', value: `${score} · x${combo}` },
        ]}
      />

      {!finished && currentScenario ? (
        <div className="overflow-hidden border border-[#111111] bg-white">
          <div className="bg-[#111111] p-5 text-white sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="font-bold text-[#5df591]">
                ภารกิจ {currentScenarioIndex + 1}
              </p>
              <span className="flex items-center gap-1 text-sm font-bold text-white/70">
                <IconHeart
                  aria-hidden="true"
                  className="size-4 text-[#ff9f6e]"
                />
                รักษาความเชื่อมั่นของทีม
              </span>
            </div>
            <h3 className="mt-4 max-w-3xl text-2xl leading-tight font-bold text-balance sm:text-3xl">
              {currentScenario.prompt}
            </h3>
          </div>

          <div className="grid gap-3 p-4 sm:p-6">
            {currentScenario.options.map((option, optionIndex) => {
              const selected = selectedOptionIndex === optionIndex
              const answered = selectedOptionIndex !== null

              return (
                <button
                  className={cn(
                    'flex min-h-20 items-center justify-between gap-4 border border-[#d7ddd4] bg-white p-4 text-left transition duration-200 focus-visible:ring-2 focus-visible:ring-[#5df591] focus-visible:ring-offset-2 focus-visible:outline-none',
                    !answered &&
                      'hover:-translate-y-0.5 hover:border-[#111111] hover:bg-[#effff3]',
                    selected &&
                      option.effect === 10 &&
                      'border-[#111111] bg-[#effff3]',
                    selected &&
                      option.effect < 10 &&
                      'border-[#111111] bg-[#fff4ea]',
                    answered && !selected && 'opacity-45'
                  )}
                  disabled={answered}
                  key={option.label}
                  onClick={() => chooseOption(optionIndex)}
                  type="button"
                >
                  <span className="font-bold">{option.label}</span>
                  <span className="rounded-base grid size-9 shrink-0 place-items-center border border-[#111111] bg-[#f7f8f3]">
                    {selected ? (
                      option.effect === 10 ? (
                        <IconCheck
                          aria-hidden="true"
                          className="size-5 text-[#168542]"
                        />
                      ) : (
                        <IconAlertTriangle
                          aria-hidden="true"
                          className="size-5 text-[#9a3d16]"
                        />
                      )
                    ) : (
                      <span className="text-sm font-bold">?</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          {selectedOptionIndex !== null ? (
            <div
              aria-live="polite"
              className="grid gap-4 border-t border-[#111111] bg-[#5df591] p-5 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="font-bold">
                  +{currentScenario.options[selectedOptionIndex].effect * 10}{' '}
                  คะแนน
                  {currentScenario.options[selectedOptionIndex].effect === 10 &&
                  combo > 1
                    ? ` · โบนัสคอมโบ +${(combo - 1) * 20}`
                    : ''}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#173d2a]">
                  {currentScenario.options[selectedOptionIndex].feedback}
                </p>
              </div>
              <Button
                className="bg-[#111111] text-white hover:bg-[#2a2a2a]"
                onClick={continueGame}
                type="button"
              >
                {currentScenarioIndex === OFFICE_MANAGER_SCENARIOS.length - 1
                  ? 'ดูผลลัพธ์'
                  : 'ภารกิจถัดไป'}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {finished ? (
        <GameResult
          actionLabel="เริ่มบริหารใหม่"
          detail={
            score >= 360
              ? 'บริหารได้ยอดเยี่ยม รักษาชื่อเสียงทีมและตัดสินใจเชิงระบบได้ครบ'
              : 'ยังมีโอกาสเพิ่มคะแนนด้วยการเลือกแนวทางที่ลดทรัพยากรตั้งแต่ต้นทาง'
          }
          onRestart={restart}
          score={score + trust * 25}
          title="สรุป Green Office Manager"
        />
      ) : null}
    </section>
  )
}

function GreenShoppingChallengeGame() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [roundIndex, setRoundIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const selectedItems = SHOPPING_ROUNDS.flatMap(
    (round) => round.options
  ).filter((item) => selectedIds.includes(item.id))
  const spent = selectedItems.reduce((sum, item) => sum + item.price, 0)
  const ecoScore = selectedItems.reduce((sum, item) => sum + item.ecoScore, 0)
  const currentRound = SHOPPING_ROUNDS[roundIndex]

  function chooseItem(
    item: (typeof SHOPPING_ROUNDS)[number]['options'][number]
  ) {
    if (!running || finished || spent + item.price > SHOPPING_BUDGET) return

    setSelectedIds((current) => [...current, item.id])
    if (roundIndex === SHOPPING_ROUNDS.length - 1) {
      setRunning(false)
      setFinished(true)
      return
    }

    setRoundIndex((current) => current + 1)
  }

  function start() {
    setSelectedIds([])
    setRoundIndex(0)
    setSecondsLeft(30)
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
        accent="#167093"
        items={[
          { label: 'งบคงเหลือ', value: `${SHOPPING_BUDGET - spent} บาท` },
          { label: 'เวลา', value: `${secondsLeft}s` },
          { label: 'Eco Score', value: `${ecoScore}/100` },
        ]}
      />

      {!finished && currentRound ? (
        <section className="overflow-hidden border border-[#111111] bg-white">
          <div className="flex flex-col gap-4 bg-[#111111] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-[#8ce3ff]">
                ใบสั่งซื้อ {roundIndex + 1}/{SHOPPING_ROUNDS.length} ·{' '}
                {currentRound.category}
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {currentRound.mission}
              </h3>
            </div>
            <Button
              className="shrink-0 bg-[#8ce3ff] font-bold text-[#111111] hover:bg-[#70d8fa]"
              disabled={running}
              onClick={start}
              type="button"
            >
              <IconPlayerPlay data-icon="inline-start" />
              เริ่มภารกิจ 30 วิ
            </Button>
          </div>

          <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2">
            {currentRound.options.map((item) => {
              const unaffordable = spent + item.price > SHOPPING_BUDGET

              return (
                <button
                  className={cn(
                    'group flex min-h-64 flex-col border border-[#111111] bg-white p-5 text-left transition duration-200 focus-visible:ring-2 focus-visible:ring-[#8ce3ff] focus-visible:ring-offset-2 focus-visible:outline-none',
                    running &&
                      !unaffordable &&
                      'hover:-translate-y-1 hover:bg-[#f1fbff]',
                    (!running || unaffordable) &&
                      'cursor-not-allowed opacity-55'
                  )}
                  disabled={!running || unaffordable}
                  key={item.id}
                  onClick={() => chooseItem(item)}
                  type="button"
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    <span className="rounded-base bg-[#e9f9ff] px-2 py-1 text-xs font-bold text-[#12617e]">
                      ตัวเลือกจัดซื้อ
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <IconCoin aria-hidden="true" className="size-4" />
                      {item.price} บาท
                    </span>
                  </span>
                  <span className="mt-6 block text-xl leading-tight font-bold">
                    {item.label}
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-[#4d5053]">
                    {item.reason}
                  </span>
                  <span className="mt-auto pt-5 font-bold text-[#167093]">
                    {unaffordable ? 'งบไม่พอ' : 'เลือกเข้าตะกร้า'}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {selectedItems.length > 0 && !finished ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <IconShoppingCart aria-hidden="true" className="size-4" />
          <strong>ในตะกร้า:</strong>
          {selectedItems.map((item) => (
            <span
              className="border border-[#d7ddd4] bg-white px-2 py-1"
              key={item.id}
            >
              {item.label}
            </span>
          ))}
        </div>
      ) : null}

      {finished ? (
        <GameResult
          actionLabel="รับภารกิจใหม่"
          detail={
            selectedItems.length < SHOPPING_ROUNDS.length
              ? 'หมดเวลาก่อนจัดซื้อครบ ลองวางแผนงบและตัดสินใจให้เร็วขึ้น'
              : ecoScore >= 75
                ? 'ภารกิจสำเร็จ ตะกร้านี้ผ่านเกณฑ์ Green Procurement และยังอยู่ในงบ'
                : 'จัดซื้อครบและไม่เกินงบ แต่ยังเพิ่ม Eco Score ได้ด้วยสินค้าที่มีฉลากรับรอง'
          }
          onRestart={start}
          score={ecoScore * 10 + secondsLeft * 5 + (SHOPPING_BUDGET - spent)}
          title="สรุป Green Shopping Challenge"
        />
      ) : null}
    </section>
  )
}

function LearningHubHero() {
  return (
    <section className="border-b border-[#111111] bg-[#111111] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-9">
        <div className="flex items-start gap-4">
          <span className="rounded-base grid size-12 shrink-0 place-items-center bg-[#5df591] text-[#111111]">
            <IconSparkles aria-hidden="true" className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl leading-tight font-bold tracking-[-0.02em] text-balance sm:text-4xl">
              MEA GO Game Lab
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
              เลือกเกม แล้วทำภารกิจให้สำเร็จด้วยคะแนน เวลา คอมโบ และการตัดสินใจ
            </p>
          </div>
        </div>
        <p className="w-fit border border-white/25 px-3 py-2 text-sm font-bold text-[#5df591]">
          4 เกม · 4 หมวดมาตรฐาน
        </p>
      </div>
    </section>
  )
}

function SafetyInspectorGame() {
  const [deck, setDeck] = useState<SafetyCard[]>(() => createSafetyDeck())
  const [flippedIds, setFlippedIds] = useState<string[]>([])
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [started, setStarted] = useState(false)
  const [locked, setLocked] = useState(false)
  const [finished, setFinished] = useState(false)
  const score = Math.max(100, 1200 - moves * 60)

  function flipCard(card: SafetyCard) {
    if (
      !started ||
      locked ||
      finished ||
      flippedIds.includes(card.id) ||
      matchedPairIds.includes(card.pairId)
    )
      return

    if (flippedIds.length === 0) {
      setFlippedIds([card.id])
      return
    }

    setLocked(true)
    setMoves((current) => current + 1)
    setFlippedIds((current) => [...current, card.id])
  }

  function start() {
    setDeck(createSafetyDeck(true))
    setFlippedIds([])
    setMatchedPairIds([])
    setMoves(0)
    setLocked(false)
    setFinished(false)
    setStarted(true)
  }

  useEffect(() => {
    if (flippedIds.length !== 2) return

    const [firstCard, secondCard] = flippedIds.map((id) =>
      deck.find((card) => card.id === id)
    )
    if (!firstCard || !secondCard) return

    const matched =
      firstCard.pairId === secondCard.pairId &&
      firstCard.kind !== secondCard.kind
    const timer = window.setTimeout(
      () => {
        if (matched) {
          setMatchedPairIds((current) => {
            const next = [...current, firstCard.pairId]
            if (next.length === SAFETY_PAIRS.length) setFinished(true)
            return next
          })
        }
        setFlippedIds([])
        setLocked(false)
      },
      matched ? 450 : 850
    )

    return () => window.clearTimeout(timer)
  }, [deck, flippedIds])

  return (
    <section className="grid gap-5">
      <GameStatusBar
        accent="#9a3d16"
        items={[
          {
            label: 'จับคู่แล้ว',
            value: `${matchedPairIds.length}/${SAFETY_PAIRS.length}`,
          },
          { label: 'จำนวนครั้ง', value: `${moves}` },
          { label: 'คะแนน', value: `${score}` },
        ]}
      />

      <div className="flex flex-col gap-4 border border-[#111111] bg-[#111111] p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span className="rounded-base grid size-10 shrink-0 place-items-center bg-[#ff9f6e] text-[#111111]">
            <IconShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-bold text-[#ffb38d]">
              จับคู่จุดเสี่ยงกับวิธีแก้
            </p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              เปิดได้ครั้งละ 2 ใบ จำตำแหน่งให้แม่น และใช้จำนวนครั้งให้น้อยที่สุด
            </p>
          </div>
        </div>
        <Button
          className="shrink-0 bg-[#ff9f6e] font-bold text-[#111111] hover:bg-[#f28c58]"
          disabled={started && !finished}
          onClick={start}
          type="button"
        >
          <IconPlayerPlay data-icon="inline-start" />
          {finished ? 'สับไพ่ใหม่' : 'เริ่มจับคู่'}
        </Button>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {deck.map((card, index) => {
          const flipped = flippedIds.includes(card.id)
          const matched = matchedPairIds.includes(card.pairId)
          const visible = flipped || matched

          return (
            <button
              aria-label={visible ? card.text : `ไพ่ปิดใบที่ ${index + 1}`}
              className={cn(
                'relative min-h-44 border border-[#111111] p-3 text-center transition duration-200 focus-visible:ring-2 focus-visible:ring-[#ff9f6e] focus-visible:ring-offset-2 focus-visible:outline-none',
                visible && card.kind === 'hazard' && 'bg-[#fff0ea]',
                visible && card.kind === 'solution' && 'bg-[#effff3]',
                !visible &&
                  'bg-[#111111] text-white hover:-translate-y-1 hover:bg-[#292929]',
                matched && 'border-2 border-[#168542]'
              )}
              disabled={!started || locked || matched}
              key={card.id}
              onClick={() => flipCard(card)}
              type="button"
            >
              {visible ? (
                <span className="grid h-full content-between gap-4">
                  <span
                    className={cn(
                      'rounded-base mx-auto px-2 py-1 text-xs font-bold',
                      card.kind === 'hazard'
                        ? 'bg-[#ff9f6e] text-[#55210b]'
                        : 'bg-[#5df591] text-[#173d2a]'
                    )}
                  >
                    {card.kind === 'hazard' ? 'จุดเสี่ยง' : 'วิธีแก้'}
                  </span>
                  <span className="text-sm leading-6 font-bold">
                    {card.text}
                  </span>
                  {matched ? (
                    <IconCheck
                      aria-hidden="true"
                      className="mx-auto size-5 text-[#168542]"
                    />
                  ) : (
                    <span className="h-5" />
                  )}
                </span>
              ) : (
                <span className="grid h-full place-items-center">
                  {started ? (
                    <span className="text-4xl font-bold text-[#ff9f6e]">?</span>
                  ) : (
                    <IconLock
                      aria-hidden="true"
                      className="size-7 text-white/55"
                    />
                  )}
                </span>
              )}
            </button>
          )
        })}
      </section>

      {finished ? (
        <GameResult
          actionLabel="จับคู่อีกรอบ"
          detail={
            moves <= 8
              ? 'ความจำยอดเยี่ยม จับคู่จุดเสี่ยงกับวิธีควบคุมได้อย่างแม่นยำ'
              : 'จับคู่ครบแล้ว ลองเล่นอีกครั้งเพื่อจำวิธีควบคุมให้ได้เร็วขึ้น'
          }
          onRestart={start}
          score={score}
          title="สรุป Safety Inspector"
        />
      ) : null}
    </section>
  )
}
