import type { ComponentType } from 'react'

import { useState } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import { Plus } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Field, FieldDescription, FieldLabel } from '~/components/ui/field'
import { Separator } from '~/components/ui/separator'
import { Slider } from '~/components/ui/slider'
import { cn } from '~/lib/utils'

type FromDropdownProps<T extends FieldValues> = {
  control: Control<T>
  desc?: string
  disabled?: boolean
  fluid?: boolean
  icon?: ComponentType
  label?: string
  name: Path<T>
  placeholder?: string
  required?: boolean
  suffix: string
  values: number[]
}

export function FormDropdown<T extends FieldValues>({
  control,
  desc,
  disabled,
  fluid = false,
  icon: Icon,
  label,
  name,
  placeholder,
  required = false,
  suffix,
  values,
  ...props
}: FromDropdownProps<T>) {
  const [value, setValue] = useState(values)

  function formatRangeValue(value: number[]) {
    return `${value[0]} - ${value[1]} ${suffix}`
  }

  function handleSliderChange(newValue: number[]) {
    setValue(newValue)
  }

  function handleSliderCommit(
    newValue: number[],
    onChange: (value: number[]) => void
  ) {
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Field className={cn(fluid && 'w-full')}>
            {!!label && (
              <FieldLabel className="flex gap-1 font-bold">
                <span>{label}</span>
                {required && <span className="text-red-600">*</span>}
              </FieldLabel>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'h-8 !justify-start overflow-x-hidden border-dashed',
                  fluid && 'w-full'
                )}
                disabled={disabled}
                {...props}
              >
                {Icon ? <Icon /> : <Plus />}
                {placeholder}
                {field.value && (
                  <>
                    <Separator className="mx-2 h-4" orientation="vertical" />
                    <Badge
                      className="rounded-sm px-1 font-normal"
                      variant="secondary"
                    >
                      {formatRangeValue(field.value)}
                    </Badge>
                  </>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px] p-2"
              >
                <DropdownMenuLabel>{formatRangeValue(value)}</DropdownMenuLabel>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Slider
                    max={values[1]}
                    min={values[0]}
                    onValueChange={(newValue) =>
                      handleSliderChange(newValue as number[])
                    }
                    onValueCommitted={(newValue) =>
                      handleSliderCommit(newValue as number[], field.onChange)
                    }
                    value={value}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {desc && (
              <FieldDescription className="text-[10px]">
                {desc}
              </FieldDescription>
            )}
          </Field>
        )
      }}
    />
  )
}
