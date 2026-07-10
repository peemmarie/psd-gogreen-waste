import type { ComponentProps, ComponentType, ReactNode } from 'react'

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
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

type FormInputProps<T extends FieldValues> = {
  control: Control<T, any, any>
  desc?: string
  fluid?: boolean
  icon?: ComponentType
  label?: string
  name: Path<T>
  placeholder?: string
  suffix?: ReactNode | string
  variant?: 'default' | 'filter'
} & ComponentProps<'input'>

export function FormInput<T extends FieldValues>({
  control,
  desc,
  fluid = false,
  icon: Icon,
  label,
  name,
  placeholder,
  required = false,
  suffix,
  variant = 'default',
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={cn(fluid && 'w-full')}>
          {!!label && (
            <FieldLabel className="flex gap-1 font-bold">
              <span>{label}</span>
              {required && <span className="text-red-600">*</span>}
            </FieldLabel>
          )}
          <div className="relative">
            <Input
              className={cn(
                variant === 'filter' && 'h-8 border-dashed pl-8',
                suffix && 'pr-12',
                props.className
              )}
              placeholder={placeholder}
              {...props}
              {...field}
            />
            {Icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon />
              </div>
            )}
            {suffix && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                {typeof suffix === 'string' ? (
                  <span className="text-muted-foreground text-sm">
                    {suffix}
                  </span>
                ) : (
                  suffix
                )}
              </div>
            )}
          </div>
          <FieldError errors={[fieldState.error]} />
          {desc && (
            <FieldDescription className="text-[10px]">{desc}</FieldDescription>
          )}
        </Field>
      )}
    />
  )
}
