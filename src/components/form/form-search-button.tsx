import type { ComponentType } from 'react'

import { useState } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import { buttonVariants } from '~/components/ui/button'
import { Field, FieldDescription } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

type FormSearchButtonProps<T extends FieldValues> = {
  control: Control<T>
  desc?: string
  disabled?: boolean
  fluid?: boolean
  icon?: ComponentType
  name: Path<T>
  placeholder?: string
}

export function FormSearchButton<T extends FieldValues>({
  control,
  desc,
  disabled,
  fluid = false,
  icon: Icon,
  name,
  placeholder,
}: FormSearchButtonProps<T>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field className={cn(fluid && 'w-full')}>
          <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'h-8 !justify-start overflow-x-hidden border-dashed',
                fluid && 'w-full'
              )}
              disabled={disabled}
            >
              {Icon && <Icon />}
              {field.value ? (
                <span className="truncate">{field.value}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[var(--radix-popover-trigger-width)] p-2"
            >
              <Input
                autoFocus
                onBlur={() => setIsOpen(false)}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setIsOpen(false)
                  }
                }}
                placeholder={placeholder}
                value={field.value || ''}
              />
            </PopoverContent>
          </Popover>
          {desc && (
            <FieldDescription className="text-[10px]">{desc}</FieldDescription>
          )}
        </Field>
      )}
    />
  )
}
