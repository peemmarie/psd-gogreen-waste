import type { Metadata } from 'next'

import { WasteSortGamePage } from '~/components/pages/waste-sort/game-page'

export const metadata: Metadata = {
  description: 'ฝึกคัดแยกขยะลงถัง 4 สีให้ถูกต้อง',
  title: 'เกมแยกขยะ 4 สี',
}

export default function GamePage() {
  return <WasteSortGamePage />
}
