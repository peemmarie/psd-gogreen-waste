import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '~/components/ui/field'

import { MonthYearPickerControlled } from './month-year-picker-controlled'

export type MonthYearPickerProps<T extends FieldValues> = {
  className?: string
  control: Control<T>
  desc?: string
  disabled?: boolean
  label?: string
  locale?: 'en' | 'th'
  monthPlaceholder?: string
  name: Path<T>
  required?: boolean
  yearCount?: number
}

export function MonthYearPicker<T extends FieldValues>({
  className = '',
  control,
  desc,
  disabled = false,
  label,
  locale = 'th',
  monthPlaceholder,
  name,
  required = false,
  yearCount,
}: MonthYearPickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={className}>
          {!!label && (
            <FieldLabel className="flex gap-1 font-bold">
              <span>{label}</span>
              {required && <span className="text-red-600">*</span>}
            </FieldLabel>
          )}
          <MonthYearPickerControlled
            disabled={disabled}
            locale={locale}
            onChange={field.onChange}
            placeholder={monthPlaceholder}
            value={field.value}
            yearCount={yearCount}
          />
          <FieldError errors={[fieldState.error]} />
          {desc && (
            <FieldDescription className="text-[10px]">{desc}</FieldDescription>
          )}
        </Field>
      )}
    />
  )
}
