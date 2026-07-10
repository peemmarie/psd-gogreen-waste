'use client'

import { useState } from 'react'

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button, buttonVariants } from '~/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

import { MONTHS } from '../../constants/months'

export type MonthYearPickerControlledProps = {
  className?: string
  disabled?: boolean
  locale?: 'en' | 'th'
  onChange?: (value: MonthYearValue) => void
  placeholder?: string
  value?: MonthYearValue
  yearCount?: number
}

export type MonthYearValue = {
  month: string
  year: string
}

export function MonthYearPickerControlled({
  className = '',
  disabled = false,
  locale = 'th',
  onChange,
  placeholder = 'เลือกเดือนและปี',
  value,
  yearCount = 10,
}: MonthYearPickerControlledProps) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(
    value?.year ? parseInt(value.year) : new Date().getFullYear()
  )

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // 1-12

  const minYear = currentYear - yearCount + 1
  const maxYear = currentYear
  const isThLocale = locale === 'th'

  function formatDisplayValue() {
    if (!value?.month || !value?.year) return placeholder

    const monthData = MONTHS.find(
      (m) => m.value === parseInt(value.month)
    )?.label

    const yearDisplay = isThLocale
      ? `พ.ศ. ${parseInt(value.year) + 543}`
      : value.year

    return `${monthData} ${yearDisplay}`
  }

  function isMonthDisabled(monthValue: number) {
    // Disable if year is in the future
    if (viewYear > currentYear) return true

    // Disable if it's current year and month is in the future
    if (viewYear === currentYear && monthValue > currentMonth) return true

    return false
  }

  function handleMonthSelect(monthValue: number) {
    const monthStr = monthValue.toString().padStart(2, '0')
    const yearStr = viewYear.toString()

    onChange?.({
      month: monthStr,
      year: yearStr,
    })

    setOpen(false)
  }

  function handlePreviousYear() {
    if (viewYear > minYear) setViewYear(viewYear - 1)
  }

  function handleNextYear() {
    if (viewYear < maxYear) setViewYear(viewYear + 1)
  }

  function getYearDisplay() {
    return isThLocale ? `พ.ศ. ${viewYear + 543}` : viewYear.toString()
  }

  // Sync viewYear when opening popover
  function handleOpenChange(newOpen: boolean) {
    if (newOpen && value?.year) setViewYear(parseInt(value.year))
    setOpen(newOpen)
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="text-muted-foreground flex items-center gap-2">
        <Calendar className="size-5" />
      </div>

      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'w-[280px] justify-start text-left font-normal',
            (!value?.month || !value?.year) && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          {formatDisplayValue()}
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[320px] p-0">
          {/* Year Selector */}
          <div className="flex items-center justify-between border-b p-3">
            <Button
              disabled={viewYear <= minYear}
              onClick={handlePreviousYear}
              size="icon"
              variant="ghost"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="text-sm font-semibold">{getYearDisplay()}</div>

            <Button
              disabled={viewYear >= maxYear}
              onClick={handleNextYear}
              size="icon"
              variant="ghost"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2 p-3">
            {MONTHS.map(({ label, value: monthValue }) => {
              const isDisabled = isMonthDisabled(monthValue)
              const isSelected =
                value?.month === monthValue.toString().padStart(2, '0') &&
                value?.year === viewYear.toString()

              return (
                <Button
                  className={cn(
                    'h-auto py-2 text-sm',
                    isSelected && 'bg-primary text-primary-foreground'
                  )}
                  disabled={isDisabled}
                  key={monthValue}
                  onClick={() => handleMonthSelect(monthValue)}
                  variant={isSelected ? 'default' : 'ghost'}
                >
                  {label}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
