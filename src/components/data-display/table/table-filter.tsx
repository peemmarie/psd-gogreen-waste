'use client'

import { type RefObject, useEffect, useMemo, useRef, useState } from 'react'

import {
  IconCheck,
  IconChevronDown,
  IconSearch,
  IconX,
} from '@tabler/icons-react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '~/components/ui/combobox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useIsMobile } from '~/hooks/use-mobile'

export type TableFilterActiveChip = Readonly<{
  key: string
  label: string
  onRemove: () => void
}>

export type TableFilterField =
  | TableFilterMultiSelectField
  | TableFilterSearchField
  | TableFilterSelectField

export type TableFilterInputType = TableFilterField['inputType']

export type TableFilterProps = Readonly<{
  activeChips?: readonly TableFilterActiveChip[]
  fields: readonly TableFilterField[]
  hasActiveFilter: boolean
  onReset: () => void
  resetLabel?: string
}>

type BaseField = Readonly<{
  label: string
  name: string
}>

type MobileFilterDrawerProps = Readonly<{
  formatLabel?: (value: string) => string
  onChange: (next: string[]) => void
  options: readonly NormalizedOption[]
  placeholder: string
  selected: string[]
  title: string
}>

type NormalizedOption = {
  label: string
  value: string
}

type Option = NormalizedOption | number | string

type TableFilterMultiSelectField = BaseField &
  Readonly<{
    emptyMessage?: string
    formatLabel?: (value: string) => string
    inputType: 'multi-select'
    onChange: (next: string[]) => void
    options: readonly Option[]
    placeholder: string
    title?: string
    value: string[]
  }>

type TableFilterSearchField = BaseField &
  Readonly<{
    clearLabel?: string
    inputType: 'search'
    onChange: (next: string) => void
    placeholder?: string
    value: string
  }>

type TableFilterSelectField = BaseField &
  Readonly<{
    inputType: 'select'
    onChange: (next: string) => void
    options: readonly NormalizedOption[]
    placeholder?: string
    value: string
  }>

const LABEL_CLASS = 'text-foreground text-xs font-medium tracking-wide'

export function TableFilter({
  activeChips = [],
  fields,
  hasActiveFilter,
  onReset,
  resetLabel = 'ล้างทั้งหมด',
}: TableFilterProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4 xl:items-start">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:col-span-3">
          {fields.map((field) => (
            <TableFilterFieldControl field={field} key={field.name} />
          ))}
        </div>

        <div className="flex flex-col xl:col-span-1 xl:pt-[22px]">
          <Button
            className="h-9 w-full cursor-pointer transition-opacity"
            disabled={!hasActiveFilter}
            onClick={onReset}
            size="sm"
            type="button"
            variant="outline"
          >
            <IconX className="mr-1 h-3.5 w-3.5" />
            {resetLabel}
          </Button>
        </div>
      </div>

      <ActiveFilterChips chips={activeChips} />
    </div>
  )
}

function ActiveFilterChips({
  chips,
}: Readonly<{ chips: readonly TableFilterActiveChip[] }>) {
  return (
    <div className="flex min-h-6 flex-wrap items-center gap-1.5 pt-1">
      <span className="text-muted-foreground text-xs">ตัวกรองที่ใช้:</span>
      {chips.length === 0 && (
        <span className="text-muted-foreground text-xs">-</span>
      )}
      {chips.map((chip) => (
        <Badge
          className="gap-1 pr-1 text-xs font-normal"
          key={chip.key}
          variant="secondary"
        >
          {chip.label}
          <button
            aria-label={`ลบตัวกรอง ${chip.label}`}
            className="hover:text-foreground text-muted-foreground ml-0.5 cursor-pointer transition-colors"
            onClick={chip.onRemove}
            type="button"
          >
            <IconX className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}

function ComboboxSelectionSummary({
  chipsRef,
  formatLabel,
  items,
  onRemove,
}: Readonly<{
  chipsRef: RefObject<HTMLDivElement | null>
  formatLabel?: (value: string) => string
  items: readonly NormalizedOption[]
  onRemove: (value: string) => void
}>) {
  const measureRef = useRef<HTMLSpanElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(items.length)

  useEffect(() => {
    const chipsElement = chipsRef.current
    if (!chipsElement) return

    function updateVisibleCount() {
      const measureElement = measureRef.current
      if (!chipsElement || !measureElement) return

      const chipElements = Array.from(
        measureElement.querySelectorAll<HTMLElement>('[data-chip-width]')
      )
      const overflowElement = measureElement.querySelector<HTMLElement>(
        '[data-overflow-width]'
      )

      if (chipElements.length === 0) {
        setVisibleCount(0)
        return
      }

      const chipsStyle = window.getComputedStyle(chipsElement)
      const inlinePadding =
        Number.parseFloat(chipsStyle.paddingLeft) +
        Number.parseFloat(chipsStyle.paddingRight)
      const gap = Number.parseFloat(
        chipsStyle.columnGap || chipsStyle.gap || '0'
      )
      const inputMinWidth = 0
      const availableWidth = Math.max(
        0,
        chipsElement.clientWidth - inlinePadding - inputMinWidth
      )
      const chipWidths = chipElements.map(
        (element) => element.getBoundingClientRect().width
      )
      const fullWidth = getItemsWidth(chipWidths, chipWidths.length, gap)

      if (fullWidth <= availableWidth) {
        setVisibleCount(items.length)
        return
      }

      for (let count = items.length - 1; count >= 0; count -= 1) {
        if (overflowElement) {
          overflowElement.textContent = `+${items.length - count}`
        }

        const overflowWidth =
          overflowElement?.getBoundingClientRect().width ?? 0
        const width =
          getItemsWidth(chipWidths, count, gap) +
          (count > 0 ? gap : 0) +
          overflowWidth

        if (width <= availableWidth) {
          setVisibleCount(count)
          return
        }
      }

      setVisibleCount(0)
    }

    updateVisibleCount()

    const resizeObserver = new ResizeObserver(() => updateVisibleCount())
    resizeObserver.observe(chipsElement)

    return () => resizeObserver.disconnect()
  }, [chipsRef, formatLabel, items])

  if (items.length === 0) return null

  const normalizedVisibleCount = Math.min(visibleCount, items.length)
  const hiddenCount = items.length - normalizedVisibleCount
  const visibleItems = items.slice(0, normalizedVisibleCount)

  return (
    <span className="relative flex min-w-0 shrink-0 items-center gap-1.5 overflow-hidden">
      {visibleItems.map((item) => {
        const label = formatLabel?.(item.value) ?? item.label

        return (
          <Badge
            className="h-5.5 max-w-[120px] min-w-0 gap-1 rounded-sm pr-0 text-xs font-medium"
            key={item.value}
            variant="secondary"
          >
            <span className="truncate">{label}</span>
            <button
              aria-label={`ลบตัวกรอง ${label}`}
              className="hover:bg-muted-foreground/15 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm"
              onClick={() => onRemove(item.value)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              <IconX className="size-3" />
            </button>
          </Badge>
        )
      })}
      {hiddenCount > 0 && (
        <Badge
          aria-label={`เลือกเพิ่มเติมอีก ${hiddenCount} รายการ`}
          className="pointer-events-none h-5.5 shrink-0 rounded-sm px-1.5 text-xs font-medium"
          variant="secondary"
        >
          +{hiddenCount}
        </Badge>
      )}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 flex h-0 items-center gap-1.5 overflow-hidden opacity-0"
        ref={measureRef}
      >
        {items.map((item) => {
          const label = formatLabel?.(item.value) ?? item.label

          return (
            <Badge
              className="h-5.5 max-w-[120px] min-w-0 gap-1 rounded-sm pr-0 text-xs font-medium"
              data-chip-width
              key={item.value}
              variant="secondary"
            >
              <span className="truncate">{label}</span>
              <span className="flex size-5 shrink-0 items-center justify-center rounded-sm">
                <IconX className="size-3" />
              </span>
            </Badge>
          )
        })}
        <Badge
          className="pointer-events-none h-5.5 shrink-0 rounded-sm px-1.5 text-xs font-medium"
          data-overflow-width
          variant="secondary"
        >
          +{items.length}
        </Badge>
      </span>
    </span>
  )
}

function getItemsWidth(widths: number[], count: number, gap: number) {
  if (count <= 0) return 0

  return (
    widths.slice(0, count).reduce((total, width) => total + width, 0) +
    gap * Math.max(0, count - 1)
  )
}

function MobileFilterDrawer({
  formatLabel,
  onChange,
  options,
  placeholder,
  selected,
  title,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false)

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
      return
    }

    onChange([...selected, value])
  }

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <button
        className="border-input dark:bg-input/30 flex h-9 w-full items-center gap-1.5 rounded-md border bg-transparent px-2.5 text-sm shadow-xs transition-[color,box-shadow]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
          {selected.length === 0 && (
            <span className="text-muted-foreground truncate">
              {placeholder}
            </span>
          )}
          {selected.length > 0 &&
            selected.length <= 2 &&
            selected.map((value) => (
              <Badge
                className="text-xs font-normal"
                key={value}
                variant="secondary"
              >
                {formatLabel ? formatLabel(value) : value}
              </Badge>
            ))}
          {selected.length > 2 && (
            <Badge className="text-xs font-normal" variant="secondary">
              {selected.length} {title}
            </Badge>
          )}
        </span>
        <IconChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
      </button>

      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <Button
                className="h-7 cursor-pointer text-xs"
                onClick={() => onChange([])}
                size="sm"
                type="button"
                variant="ghost"
              >
                <IconX className="mr-1 h-3 w-3" />
                ล้าง
              </Button>
            )}
            <DrawerClose asChild>
              <Button
                className="h-7 cursor-pointer text-xs"
                size="sm"
                type="button"
                variant="outline"
              >
                เสร็จสิ้น
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="no-scrollbar max-h-[50vh] overflow-y-auto px-4 pb-6">
          <div className="flex flex-col gap-0.5">
            {options.map((option) => {
              const isSelected = selected.includes(option.value)

              return (
                <button
                  className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors"
                  key={option.value}
                  onClick={() => toggle(option.value)}
                  type="button"
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-input'
                    }`}
                  >
                    {isSelected && <IconCheck className="h-3 w-3" />}
                  </div>
                  <span className="text-left">
                    {formatLabel ? formatLabel(option.value) : option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function normalizeOptions(options: readonly Option[]): NormalizedOption[] {
  return options.map((option) => {
    if (typeof option === 'object') return option

    const value = String(option)
    return { label: value, value }
  })
}

function TableFilterFieldControl({
  field,
}: Readonly<{ field: TableFilterField }>) {
  if (field.inputType === 'search') return <TableFilterSearch field={field} />
  if (field.inputType === 'select') return <TableFilterSelect field={field} />

  return <TableFilterMultiSelect field={field} />
}

function TableFilterMultiSelect({
  field,
}: Readonly<{ field: TableFilterMultiSelectField }>) {
  const isMobile = useIsMobile()
  const anchorRef = useComboboxAnchor()
  const options = useMemo(
    () => normalizeOptions(field.options),
    [field.options]
  )
  const selectedItems = options.filter((option) =>
    field.value.includes(option.value)
  )

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label className={LABEL_CLASS}>{field.label}</Label>
      {isMobile ? (
        <MobileFilterDrawer
          formatLabel={field.formatLabel}
          onChange={field.onChange}
          options={options}
          placeholder={field.placeholder}
          selected={field.value}
          title={field.title ?? field.label}
        />
      ) : (
        <Combobox
          items={options}
          itemToStringLabel={(option) => option.label}
          itemToStringValue={(option) => option.value}
          multiple
          onValueChange={(nextOptions) =>
            field.onChange(nextOptions.map((option) => option.value))
          }
          value={selectedItems}
        >
          <ComboboxChips
            className="h-9 w-full flex-nowrap overflow-hidden"
            ref={anchorRef}
          >
            <ComboboxValue>
              <ComboboxSelectionSummary
                chipsRef={anchorRef}
                formatLabel={field.formatLabel}
                items={selectedItems}
                onRemove={(value) =>
                  field.onChange(
                    field.value.filter((selected) => selected !== value)
                  )
                }
              />
            </ComboboxValue>
            <ComboboxChipsInput
              className={
                field.value.length > 0 ? 'w-0 min-w-0 flex-none' : undefined
              }
              placeholder={field.value.length === 0 ? field.placeholder : ''}
            />
          </ComboboxChips>
          <ComboboxContent anchor={anchorRef}>
            <ComboboxList>
              <ComboboxEmpty>
                {field.emptyMessage ?? 'ไม่พบข้อมูลที่ค้นหา'}
              </ComboboxEmpty>
              <ComboboxCollection>
                {(option) => (
                  <ComboboxItem key={option.value} value={option}>
                    {field.formatLabel
                      ? field.formatLabel(option.value)
                      : option.label}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
    </div>
  )
}

function TableFilterSearch({
  field,
}: Readonly<{ field: TableFilterSearchField }>) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label className={LABEL_CLASS} htmlFor={field.name}>
        {field.label}
      </Label>
      <div className="relative">
        <IconSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
        <Input
          autoComplete="off"
          className="h-9 pr-8 pl-8 text-sm text-ellipsis"
          id={field.name}
          name={field.name}
          onChange={(event) => field.onChange(event.target.value)}
          placeholder={field.placeholder}
          spellCheck={false}
          value={field.value}
        />
        {field.value && (
          <button
            aria-label={field.clearLabel ?? `ล้าง ${field.label}`}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded transition-colors focus-visible:ring-1 focus-visible:outline-none"
            onClick={() => field.onChange('')}
            type="button"
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

function TableFilterSelect({
  field,
}: Readonly<{ field: TableFilterSelectField }>) {
  const selectedOption = field.options.find(
    (option) => option.value === field.value
  )

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label className={LABEL_CLASS}>{field.label}</Label>
      <Select
        onValueChange={(value) => field.onChange(value ?? '')}
        value={field.value}
      >
        <SelectTrigger className="h-9 w-full text-sm">
          <SelectValue placeholder={field.placeholder}>
            {selectedOption?.label ?? field.placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
