'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      className={cn(
        'rounded-base! border-border bg-main font-heading shadow-shadow border-2 p-3',
        className
      )}
      classNames={{
        caption:
          'flex justify-center pt-1 relative items-center w-full text-main-foreground',
        caption_label: 'text-sm font-heading',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-black/50 [&:has([aria-selected])]:text-white! [&:has([aria-selected].day-range-end)]:rounded-r-base',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-base [&:has(>.day-range-start)]:rounded-l-base [&:has([aria-selected])]:bg-black/50! first:[&:has([aria-selected])]:rounded-l-base last:[&:has([aria-selected])]:rounded-r-base'
            : '[&:has([aria-selected])]:rounded-base [&:has([aria-selected])]:bg-black/50'
        ),
        day: cn(
          buttonVariants({ variant: 'noShadow' }),
          'size-9 p-0 font-base aria-selected:opacity-100'
        ),
        day_disabled: 'text-main-foreground opacity-50 rounded-base',
        day_hidden: 'invisible',
        day_outside:
          'day-outside text-main-foreground opacity-50 aria-selected:bg-none',
        day_range_end:
          'day-range-end aria-selected:bg-black! aria-selected:text-white rounded-base',
        day_range_middle: 'aria-selected:bg-black/50! aria-selected:text-white',
        day_range_start:
          'day-range-start aria-selected:bg-black! aria-selected:text-white rounded-base',
        day_selected: 'bg-black! text-white! rounded-base',
        day_today: 'bg-secondary-background text-foreground!',
        head_cell:
          'text-main-foreground rounded-base w-9 font-base text-[0.8rem]',
        head_row: 'flex',
        month: 'flex flex-col gap-4',
        months: 'flex flex-col sm:flex-row gap-2',
        nav: 'gap-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'noShadow' }),
          'size-7 bg-transparent p-0'
        ),
        nav_button_next: 'absolute right-1',
        nav_button_previous: 'absolute left-1',
        row: 'flex w-full mt-2',
        table: 'w-full border-collapse space-y-1',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('size-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('size-4', className)} {...props} />
        ),
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
