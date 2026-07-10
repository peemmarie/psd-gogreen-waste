'use client'

import type {
  TableFilterActiveChip,
  TableFilterField,
} from '~/components/data-display/table/table-filter'

import { TableFilter } from '~/components/data-display/table/table-filter'
import { CAPACITY_OPTIONS, DISTRICT_OPTIONS } from '~/constants/transformer'

export type TransformerFilterState = {
  capacityFilter: string[]
  districtFilter: string[]
  search: string
  statusFilter: string
  tapChangerFilter: string
}

type TransformerFilterProps = Readonly<{
  /** Active filter chips to display below the controls */
  activeChips: TableFilterActiveChip[]
  /** Whether any filter is currently active */
  hasActiveFilter: boolean
  /** Called when a filter value changes */
  onChange: (next: Partial<TransformerFilterState>) => void
  /** Called when all filters should be reset */
  onReset: () => void
  /** Current filter state */
  state: TransformerFilterState
}>

const CAPACITY_COMBOBOX_OPTIONS = CAPACITY_OPTIONS.map(String)

const STATUS_OPTIONS = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'ออนไลน์', value: 'online' },
  { label: 'ออฟไลน์', value: 'offline' },
] as const

const TAP_CHANGER_OPTIONS = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'OLTC', value: 'oltc' },
  { label: 'Manual', value: 'manual' },
] as const

export function TransformerFilter({
  activeChips,
  hasActiveFilter,
  onChange,
  onReset,
  state,
}: TransformerFilterProps) {
  const fields: TableFilterField[] = [
    {
      clearLabel: 'ล้างคำค้นหา',
      inputType: 'search',
      label: 'ค้นหา',
      name: 'transformer-search',
      onChange: (search) => onChange({ search }),
      placeholder: 'Station ID, Device ID, Feeder, MEA No.',
      value: state.search,
    },
    {
      emptyMessage: 'ไม่พบเขตที่ค้นหา',
      inputType: 'multi-select',
      label: 'การไฟฟ้าเขต',
      name: 'districtFilter',
      onChange: (districtFilter) => onChange({ districtFilter }),
      options: DISTRICT_OPTIONS,
      placeholder: 'ทุกเขต',
      title: 'เขต',
      value: state.districtFilter,
    },
    {
      emptyMessage: 'ไม่พบพิกัดที่ค้นหา',
      formatLabel: (capacity) => `${capacity} kVA`,
      inputType: 'multi-select',
      label: 'พิกัดหม้อแปลง (kVA)',
      name: 'capacityFilter',
      onChange: (capacityFilter) => onChange({ capacityFilter }),
      options: CAPACITY_COMBOBOX_OPTIONS,
      placeholder: 'ทุกขนาด',
      title: 'ขนาด',
      value: state.capacityFilter,
    },
    {
      inputType: 'select',
      label: 'Tap Changer',
      name: 'tapChangerFilter',
      onChange: (tapChangerFilter) =>
        onChange({
          tapChangerFilter:
            tapChangerFilter === 'all' ? '' : (tapChangerFilter ?? ''),
        }),
      options: TAP_CHANGER_OPTIONS,
      placeholder: 'ทั้งหมด',
      value:
        (state.tapChangerFilter ?? '') === '' ? 'all' : state.tapChangerFilter,
    },
    // {
    //   inputType: 'select',
    //   label: 'สถานะ',
    //   name: 'statusFilter',
    //   onChange: (statusFilter) => onChange({ statusFilter }),
    //   options: STATUS_OPTIONS,
    //   placeholder: 'ทั้งหมด',
    //   value: state.statusFilter || 'all',
    // },
  ]

  return (
    <TableFilter
      activeChips={activeChips}
      fields={fields}
      hasActiveFilter={hasActiveFilter}
      onReset={onReset}
    />
  )
}
