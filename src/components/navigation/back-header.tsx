'use client'

import { LuArrowLeft } from 'react-icons/lu'

import { useRouter } from 'next/navigation'

export function BackHeader() {
  const router = useRouter()

  return (
    <button
      className="flex w-fit items-center gap-2 transition-opacity hover:opacity-80"
      onClick={() => router.back()}
    >
      <LuArrowLeft className="text-primary size-5" />
      <span className="text-lg font-semibold">ย้อนกลับ</span>
    </button>
  )
}
