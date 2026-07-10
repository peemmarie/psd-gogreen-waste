import type { Metadata } from 'next'

import { WasteSortSearchPage } from '~/components/pages/waste-sort/search-page'

export const metadata: Metadata = {
  description: 'ค้นหาวิธีคัดแยกขยะและสีถังที่ถูกต้อง',
  title: 'ค้นหาการคัดแยกขยะ',
}

export default function RootPage() {
  return <WasteSortSearchPage />
}
