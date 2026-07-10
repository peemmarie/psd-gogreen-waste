import type { ComponentType } from 'react'

import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import { PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Badge } from '~/components/ui/badge'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>
  desc?: string
  fluid?: boolean
  icon?: ComponentType<{ className?: string }>
  label?: string
  name: Path<T>
  options: {
    disabled?: boolean
    label: string
    value: string
  }[]
  placeholder?: string
  required?: boolean
  shouldTranslate?: boolean
} & React.ComponentProps<typeof SelectTrigger>

export function FormSelect<T extends FieldValues>({
  control,
  desc,
  fluid = false,
  icon: Icon,
  label,
  name,
  options,
  placeholder,
  required = false,
  shouldTranslate = false,
  ...props
}: FormSelectProps<T>) {
  const tOptions = useTranslations('common.options')

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value
        )
        const hasValue = !!field.value

        return (
          <Field className={cn(fluid && 'w-full')}>
            {!!label && (
              <FieldLabel className="flex gap-1 font-bold">
                <span>{label}</span>
                {required && <span className="text-red-600">*</span>}
              </FieldLabel>
            )}
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger
                {...props}
                className={cn(!label && 'h-8 border-dashed', props.className)}
              >
                {!label ? (
                  <div className="flex w-full items-center gap-2 overflow-hidden">
                    {Icon ? (
                      <Icon className="size-4 shrink-0" />
                    ) : (
                      <PlusCircle className="size-4 shrink-0" />
                    )}
                    {hasValue && selectedOption ? (
                      <>
                        <span className="text-muted-foreground shrink-0 text-sm">
                          {placeholder}
                        </span>
                        <Separator
                          className="mx-1 h-4 shrink-0"
                          orientation="vertical"
                        />
                        <Badge
                          className="rounded-sm px-2 text-xs font-normal"
                          variant="secondary"
                        >
                          {shouldTranslate
                            ? tOptions(selectedOption.label)
                            : selectedOption.label}
                        </Badge>
                      </>
                    ) : (
                      <span className="text-sm">{placeholder}</span>
                    )}
                  </div>
                ) : (
                  <span className="truncate">
                    {hasValue && selectedOption ? (
                      shouldTranslate ? (
                        tOptions(selectedOption.label)
                      ) : (
                        selectedOption.label
                      )
                    ) : (
                      <SelectValue placeholder={placeholder} />
                    )}
                  </span>
                )}
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    disabled={option.disabled ?? false}
                    key={option.value}
                    value={option.value}
                  >
                    {shouldTranslate ? tOptions(option.label) : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
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
