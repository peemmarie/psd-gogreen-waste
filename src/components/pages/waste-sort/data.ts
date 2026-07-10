export type BinColor = 'blue' | 'green' | 'red' | 'yellow'

export type WasteItem = {
  bin: BinColor
  emoji: string
  name: string
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

export const WASTE_ITEMS: WasteItem[] = [
  { bin: 'blue', emoji: '🧽', name: 'ฟองน้ำล้างจาน', type: 'ทั่วไป' },
  { bin: 'red', emoji: '🔋', name: 'ถ่านไฟฉาย', type: 'อันตราย' },
  { bin: 'yellow', emoji: '📄', name: 'กระดาษ', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '📄', name: 'กระดาษ A4', type: 'รีไซเคิล' },
  { bin: 'blue', emoji: '🧻', name: 'กระดาษชำระใช้แล้ว', type: 'ทั่วไป' },
  { bin: 'yellow', emoji: '🧴', name: 'ขวดน้ำพลาสติก', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '🍾', name: 'ขวดแก้ว', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '🥫', name: 'กระป๋องอลูมิเนียม', type: 'รีไซเคิล' },
  { bin: 'green', emoji: '🍚', name: 'เศษอาหาร', type: 'เปียก' },
  { bin: 'red', emoji: '💡', name: 'หลอดไฟ', type: 'อันตราย' },
  { bin: 'red', emoji: '🔋', name: 'แบตเตอรี่', type: 'อันตราย' },
  { bin: 'blue', emoji: '😷', name: 'หน้ากากอนามัยใช้แล้ว', type: 'ทั่วไป' },
  { bin: 'blue', emoji: '🧷', name: 'ผ้าอ้อม', type: 'ทั่วไป' },
  { bin: 'blue', emoji: '🥡', name: 'กล่องโฟมเปื้อนอาหาร', type: 'ทั่วไป' },
  { bin: 'yellow', emoji: '📦', name: 'กล่องกระดาษ', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '✉️', name: 'ซองเอกสาร', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '📁', name: 'แฟ้มกระดาษ', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '📚', name: 'หนังสือ', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '📰', name: 'หนังสือพิมพ์', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '🧴', name: 'ขวดแชมพู', type: 'รีไซเคิล' },
  { bin: 'blue', emoji: '🖊️', name: 'ปากกา', type: 'ทั่วไป' },
  { bin: 'blue', emoji: '✏️', name: 'ดินสอ', type: 'ทั่วไป' },
  { bin: 'blue', emoji: '▰', name: 'ยางลบ', type: 'ทั่วไป' },
  { bin: 'yellow', emoji: '📎', name: 'คลิปหนีบกระดาษ', type: 'รีไซเคิล' },
  { bin: 'yellow', emoji: '〰️', name: 'ลวดเย็บกระดาษ', type: 'รีไซเคิล' },
  { bin: 'blue', emoji: '☕', name: 'ซองกาแฟ', type: 'ทั่วไป' },
  { bin: 'yellow', emoji: '🥤', name: 'แก้วพลาสติก', type: 'รีไซเคิล' },
  { bin: 'blue', emoji: '🥄', name: 'ช้อนพลาสติก', type: 'ทั่วไป' },
  { bin: 'yellow', emoji: '🧴', name: 'ขวดน้ำยาล้างมือ', type: 'รีไซเคิล' },
  { bin: 'blue', emoji: '🧻', name: 'ทิชชู่เปียก', type: 'ทั่วไป' },
  { bin: 'blue', emoji: '🧻', name: 'ทิชชู่', type: 'ทั่วไป' },
]
