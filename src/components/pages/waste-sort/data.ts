export type BinColor = 'blue' | 'green' | 'red' | 'yellow'

export type LearningModule = {
  academicNote: string
  challenge: string
  duration: string
  gameMode: 'carbon' | 'matching' | 'practice' | 'quiz'
  id: LearningModuleId
  keyPoints: string[]
  level: 'ต่อยอด' | 'พื้นฐาน'
  title: string
}

export type LearningModuleId =
  | 'carbon-actions'
  | 'hazardous-waste'
  | 'organic-waste'
  | 'recycle-clean'
  | 'reuse-reduce'
  | 'waste-basics'

export type WasteItem = {
  bin: BinColor
  emoji: string
  learnMoreId?: LearningModuleId
  name: string
  sortingTip?: string
  type: string
}

export const BIN_DETAILS: Record<
  BinColor,
  { colorName: string; description: string; label: string }
> = {
  blue: {
    colorName: 'สีน้ำเงิน',
    description: 'ขยะทั่วไป',
    label: 'ทั่วไป',
  },
  green: {
    colorName: 'สีเขียว',
    description: 'ขยะอินทรีย์และขยะเปียก',
    label: 'อินทรีย์',
  },
  red: {
    colorName: 'สีแดง',
    description: 'ขยะอันตราย',
    label: 'อันตราย',
  },
  yellow: {
    colorName: 'สีเหลือง',
    description: 'ขยะรีไซเคิล',
    label: 'รีไซเคิล',
  },
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    academicNote:
      'การแยกขยะตั้งแต่ต้นทางช่วยลดการปนเปื้อน ทำให้กระบวนการเก็บ ขนส่ง และจัดการปลายทางมีประสิทธิภาพขึ้น',
    challenge:
      'อ่านแนวคิดหลัก แล้วเล่นโหมด Learn เพื่อจำสีถังให้ครบทั้ง 4 ประเภท',
    duration: '4 นาที',
    gameMode: 'practice',
    id: 'waste-basics',
    keyPoints: [
      'ถังสีน้ำเงินใช้กับขยะทั่วไปที่รีไซเคิลยาก',
      'ถังสีเขียวใช้กับขยะอินทรีย์หรือขยะเปียก',
      'ถังสีแดงใช้กับขยะที่มีความเสี่ยงต่อสุขภาพและสิ่งแวดล้อม',
      'ถังสีเหลืองใช้กับวัสดุที่นำกลับเข้าสู่ระบบรีไซเคิลได้',
    ],
    level: 'พื้นฐาน',
    title: 'เข้าใจถังขยะ 4 สี',
  },
  {
    academicNote:
      'วัสดุรีไซเคิลต้องสะอาด แห้ง และแยกจากเศษอาหาร เพราะสิ่งปนเปื้อนทำให้คุณภาพวัสดุต่ำลงหรือถูกคัดทิ้ง',
    challenge: 'ค้นหาขวด แก้ว กระดาษ หรือกระป๋อง แล้วลองเล่นเกมจับคู่ขยะกับถัง',
    duration: '5 นาที',
    gameMode: 'matching',
    id: 'recycle-clean',
    keyPoints: [
      'เทของเหลวออกก่อนทิ้ง',
      'ล้างคราบอาหารเท่าที่ทำได้',
      'ทำให้แห้งก่อนใส่ถังรีไซเคิล',
      'วัสดุเปื้อนมากอาจกลายเป็นขยะทั่วไป',
    ],
    level: 'พื้นฐาน',
    title: 'รีไซเคิลให้สะอาดและทำได้จริง',
  },
  {
    academicNote:
      'ขยะอันตรายอาจมีสารเคมี โลหะหนัก หรือส่วนประกอบที่รั่วไหลได้ จึงต้องแยกจัดการเพื่อลดความเสี่ยงต่อคนเก็บขยะและสิ่งแวดล้อม',
    challenge: 'ฝึกแยกถ่านไฟฉาย แบตเตอรี่ และหลอดไฟให้ถูกถัง',
    duration: '5 นาที',
    gameMode: 'quiz',
    id: 'hazardous-waste',
    keyPoints: [
      'ไม่ทิ้งรวมกับขยะทั่วไป',
      'เก็บในภาชนะที่ไม่รั่วหรือแตกง่าย',
      'มองหาจุดรับคืนหรือจุดรวบรวมเฉพาะ',
      'ติดฉลากหรือแยกถุงเมื่อจำเป็น',
    ],
    level: 'ต่อยอด',
    title: 'ขยะอันตรายต้องแยกพิเศษ',
  },
  {
    academicNote:
      'ขยะอินทรีย์ย่อยสลายได้ แต่หากปนกับขยะแห้งจะเพิ่มกลิ่น น้ำชะขยะ และทำให้วัสดุรีไซเคิลเสียคุณภาพ',
    challenge: 'ลองแยกเศษอาหาร เปลือกผลไม้ และของเปียกออกจากขยะอื่น',
    duration: '4 นาที',
    gameMode: 'practice',
    id: 'organic-waste',
    keyPoints: [
      'แยกเศษอาหารออกจากบรรจุภัณฑ์',
      'ลดน้ำส่วนเกินก่อนทิ้ง',
      'นำไปทำปุ๋ยได้เมื่อมีระบบรองรับ',
      'อย่าปนกับกระดาษหรือพลาสติกที่ตั้งใจรีไซเคิล',
    ],
    level: 'พื้นฐาน',
    title: 'ขยะอินทรีย์และขยะเปียก',
  },
  {
    academicNote:
      'แนวคิด reduce และ reuse ช่วยลดปริมาณขยะก่อนถึงขั้นตอนคัดแยก เป็นการลดภาระระบบจัดการขยะตั้งแต่ต้นทาง',
    challenge: 'เลือกของเหลือใช้หนึ่งชิ้น แล้วคิดวิธีใช้ซ้ำอย่างน้อย 1 วิธี',
    duration: '6 นาที',
    gameMode: 'quiz',
    id: 'reuse-reduce',
    keyPoints: [
      'ปฏิเสธของใช้ครั้งเดียวเมื่อไม่จำเป็น',
      'เลือกของที่ใช้ซ้ำหรือเติมซ้ำได้',
      'ซ่อม ดัดแปลง หรือส่งต่อก่อนทิ้ง',
      'แยกรีไซเคิลเป็นทางเลือกหลังลดและใช้ซ้ำแล้ว',
    ],
    level: 'ต่อยอด',
    title: 'ลด ใช้ซ้ำ ก่อนทิ้ง',
  },
  {
    academicNote:
      'พฤติกรรมประจำวัน เช่น การลดพลาสติก ใช้พลังงานอย่างเหมาะสม และเดินทางระยะสั้นด้วยวิธีคาร์บอนต่ำ ช่วยลดผลกระทบสะสมได้',
    challenge:
      'เลือก 1 พฤติกรรมสีเขียวที่ทำได้วันนี้ แล้วบันทึกเป็น Mission Bingo',
    duration: '5 นาที',
    gameMode: 'carbon',
    id: 'carbon-actions',
    keyPoints: [
      'พกถุงหรือแก้วใช้ซ้ำ',
      'ตั้งอุณหภูมิแอร์ให้เหมาะสม',
      'ลดการเดินทางระยะสั้นด้วยรถยนต์',
      'เปลี่ยนความรู้เป็นภารกิจที่ทำซ้ำได้',
    ],
    level: 'ต่อยอด',
    title: 'พฤติกรรมลดคาร์บอนใกล้ตัว',
  },
]

export const WASTE_ITEMS: WasteItem[] = [
  {
    bin: 'blue',
    emoji: '🧽',
    learnMoreId: 'waste-basics',
    name: 'ฟองน้ำล้างจาน',
    type: 'ทั่วไป',
  },
  {
    bin: 'red',
    emoji: '🔋',
    learnMoreId: 'hazardous-waste',
    name: 'ถ่านไฟฉาย',
    type: 'อันตราย',
  },
  {
    bin: 'yellow',
    emoji: '📄',
    learnMoreId: 'recycle-clean',
    name: 'กระดาษ',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '📄',
    learnMoreId: 'recycle-clean',
    name: 'กระดาษ A4',
    type: 'รีไซเคิล',
  },
  {
    bin: 'blue',
    emoji: '🧻',
    learnMoreId: 'waste-basics',
    name: 'กระดาษชำระใช้แล้ว',
    type: 'ทั่วไป',
  },
  {
    bin: 'yellow',
    emoji: '🧴',
    learnMoreId: 'recycle-clean',
    name: 'ขวดน้ำพลาสติก',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '🍾',
    learnMoreId: 'recycle-clean',
    name: 'ขวดแก้ว',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '🥫',
    learnMoreId: 'recycle-clean',
    name: 'กระป๋องอลูมิเนียม',
    type: 'รีไซเคิล',
  },
  {
    bin: 'green',
    emoji: '🍚',
    learnMoreId: 'organic-waste',
    name: 'เศษอาหาร',
    type: 'เปียก',
  },
  {
    bin: 'red',
    emoji: '💡',
    learnMoreId: 'hazardous-waste',
    name: 'หลอดไฟ',
    type: 'อันตราย',
  },
  {
    bin: 'red',
    emoji: '🔋',
    learnMoreId: 'hazardous-waste',
    name: 'แบตเตอรี่',
    type: 'อันตราย',
  },
  {
    bin: 'blue',
    emoji: '😷',
    learnMoreId: 'waste-basics',
    name: 'หน้ากากอนามัยใช้แล้ว',
    type: 'ทั่วไป',
  },
  {
    bin: 'blue',
    emoji: '👶',
    learnMoreId: 'waste-basics',
    name: 'ผ้าอ้อม',
    type: 'ทั่วไป',
  },
  {
    bin: 'blue',
    emoji: '🥡',
    learnMoreId: 'waste-basics',
    name: 'กล่องโฟมเปื้อนอาหาร',
    type: 'ทั่วไป',
  },
  {
    bin: 'yellow',
    emoji: '📦',
    learnMoreId: 'recycle-clean',
    name: 'กล่องกระดาษ',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '✉️',
    learnMoreId: 'recycle-clean',
    name: 'ซองเอกสาร',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '📁',
    learnMoreId: 'recycle-clean',
    name: 'แฟ้มกระดาษ',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '📚',
    learnMoreId: 'recycle-clean',
    name: 'หนังสือ',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '📰',
    learnMoreId: 'recycle-clean',
    name: 'หนังสือพิมพ์',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '🧴',
    learnMoreId: 'recycle-clean',
    name: 'ขวดแชมพู',
    type: 'รีไซเคิล',
  },
  {
    bin: 'blue',
    emoji: '🖊️',
    learnMoreId: 'waste-basics',
    name: 'ปากกา',
    type: 'ทั่วไป',
  },
  {
    bin: 'blue',
    emoji: '✏️',
    learnMoreId: 'waste-basics',
    name: 'ดินสอ',
    type: 'ทั่วไป',
  },
  {
    bin: 'blue',
    emoji: '▰',
    learnMoreId: 'waste-basics',
    name: 'ยางลบ',
    type: 'ทั่วไป',
  },
  {
    bin: 'yellow',
    emoji: '📎',
    learnMoreId: 'recycle-clean',
    name: 'คลิปหนีบกระดาษ',
    type: 'รีไซเคิล',
  },
  {
    bin: 'yellow',
    emoji: '〰️',
    learnMoreId: 'recycle-clean',
    name: 'ลวดเย็บกระดาษ',
    type: 'รีไซเคิล',
  },
  {
    bin: 'blue',
    emoji: '☕',
    learnMoreId: 'waste-basics',
    name: 'ซองกาแฟ',
    type: 'ทั่วไป',
  },
  {
    bin: 'yellow',
    emoji: '🥤',
    learnMoreId: 'recycle-clean',
    name: 'แก้วพลาสติก',
    type: 'รีไซเคิล',
  },
  {
    bin: 'blue',
    emoji: '🥄',
    learnMoreId: 'reuse-reduce',
    name: 'ช้อนพลาสติก',
    type: 'ทั่วไป',
  },
  {
    bin: 'yellow',
    emoji: '🧴',
    learnMoreId: 'recycle-clean',
    name: 'ขวดน้ำยาล้างมือ',
    type: 'รีไซเคิล',
  },
  {
    bin: 'blue',
    emoji: '🧻',
    learnMoreId: 'waste-basics',
    name: 'ทิชชู่เปียก',
    type: 'ทั่วไป',
  },
  {
    bin: 'blue',
    emoji: '🧻',
    learnMoreId: 'waste-basics',
    name: 'ทิชชู่',
    type: 'ทั่วไป',
  },
]

export function getWasteSortingTip(item: WasteItem) {
  if (item.sortingTip) return item.sortingTip

  if (item.bin === 'red') {
    return 'มีสารเคมี โลหะหนัก หรือส่วนประกอบที่เป็นอันตราย ควรแยกออกจากขยะทั่วไป'
  }

  if (item.bin === 'green') {
    return 'ย่อยสลายได้และเหมาะกับการนำไปทำปุ๋ยหรือจัดการแบบขยะเปียก'
  }

  if (item.bin === 'yellow') {
    return 'วัสดุยังมีมูลค่าและนำกลับไปรีไซเคิลได้ ควรทำให้สะอาดและแห้งก่อนทิ้ง'
  }

  return 'ปนเปื้อนหรือรีไซเคิลได้ยาก จึงควรลงถังขยะทั่วไป'
}
