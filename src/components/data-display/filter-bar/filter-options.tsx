'use client'

import type { ComponentType } from 'react'
import type { Control } from 'react-hook-form'

import type { FilterType, Options } from '../table/type'

import { FormCombobox } from '~/components/form/form-combobox'
import { FormDropdown } from '~/components/form/form-dropdown'
import { FormInput } from '~/components/form/form-input'
import { FormSearchButton } from '~/components/form/form-search-button'
import { FormSelect } from '~/components/form/form-select'
import { FormSwitch } from '~/components/form/form-switch'
import { MonthYearPicker } from '~/components/form/month-year-picker'
import { cn } from '~/lib/utils'

type FilterOptionsProps = {
  className?: string
  control: Control
  desc?: string
  disabled?: boolean
  icon?: ComponentType
  label?: string
  name: string
  options?: Options[]
  placeholder?: string
  shouldTranslate?: boolean
  suffix?: string
  type?: FilterType
  values?: number[]
}

export function FilterOptions({
  className,
  control,
  desc,
  disabled,
  icon,
  label,
  name,
  options = [],
  placeholder,
  shouldTranslate = false,
  suffix = '',
  type = 'input',
  values = [],
}: FilterOptionsProps) {
  const defaultStyle = 'h-8'

  if (type === 'select') {
    return (
      <FormSelect
        className={cn(defaultStyle, className)}
        control={control}
        desc={desc}
        disabled={disabled}
        fluid
        icon={icon}
        name={name}
        options={options}
        placeholder={placeholder}
        shouldTranslate={shouldTranslate}
      />
    )
  }

  if (type === 'combobox') {
    return (
      <FormCombobox
        control={control}
        disabled={disabled}
        fluid
        icon={icon}
        name={name}
        options={options}
        placeholder={placeholder}
        shouldTranslate={shouldTranslate}
      />
    )
  }

  if (type === 'dropdown-slide') {
    return (
      <FormDropdown
        control={control}
        desc={desc}
        disabled={disabled}
        fluid
        icon={icon}
        name={name}
        placeholder={placeholder}
        suffix={suffix}
        values={values}
      />
    )
  }

  if (type === 'switch') {
    return (
      <FormSwitch
        control={control}
        desc={desc}
        disabled={disabled}
        label={label}
        name={name}
      />
    )
  }

  // Use FormSearchButton for search inputs to match other filter styles
  if (name === 'search') {
    return (
      <FormSearchButton
        control={control}
        disabled={disabled}
        fluid
        icon={icon}
        name={name}
        placeholder={placeholder}
      />
    )
  }

  if (type === 'month-year-picker') {
    return (
      <MonthYearPicker
        className={className}
        control={control}
        monthPlaceholder={placeholder}
        name={name}
      />
    )
  }

  return (
    <FormInput
      className={cn(defaultStyle, className)}
      control={control}
      disabled={disabled}
      icon={icon}
      name={name}
      placeholder={placeholder}
      type={type}
      variant="filter"
    />
  )
}
