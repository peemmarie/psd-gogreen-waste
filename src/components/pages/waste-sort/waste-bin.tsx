import { IconRecycle } from '@tabler/icons-react'

import { cn } from '~/lib/utils'

import { BIN_DETAILS, type BinColor } from './data'

type WasteBinProps = {
  className?: string
  color: BinColor
  compact?: boolean
}

const BIN_STYLES: Record<BinColor, string> = {
  blue: 'bg-[#2478a8] border-[#185b80] text-white',
  green: 'bg-[#439b61] border-[#2f7547] text-white',
  red: 'bg-[#d94b45] border-[#a92f2c] text-white',
  yellow: 'bg-[#f4bd2a] border-[#c58c09] text-[#322306]',
}

export function WasteBin({ className, color, compact = false }: WasteBinProps) {
  const detail = BIN_DETAILS[color]

  return (
    <div
      aria-label={`ถังขยะ${detail.colorName} ${detail.description}`}
      className={cn('flex flex-col items-center', className)}
    >
      <div
        className={cn(
          'relative flex w-full items-end justify-center border-[3px] shadow-[inset_0_-12px_18px_rgba(0,0,0,0.14),0_10px_18px_rgba(32,67,49,0.13)]',
          compact
            ? 'h-24 max-w-24 rounded-b-2xl'
            : 'h-36 max-w-36 rounded-b-3xl',
          BIN_STYLES[color]
        )}
      >
        <div className="absolute -top-3 h-5 w-[108%] rounded-md border-b-[3px] border-inherit bg-inherit shadow-sm" />
        <IconRecycle
          aria-hidden="true"
          className={compact ? 'mb-4 size-8' : 'mb-6 size-12'}
          stroke={1.8}
        />
      </div>
      <div className="mt-4 text-center">
        <p className="font-semibold text-[#173d2a]">ถัง{detail.colorName}</p>
        <p className="text-sm text-[#557164]">{detail.description}</p>
      </div>
    </div>
  )
}
