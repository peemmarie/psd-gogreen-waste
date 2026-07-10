import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import { Field, FieldDescription, FieldLabel } from '~/components/ui/field'
import { Switch } from '~/components/ui/switch'
import { cn } from '~/lib/utils'

type FormSwitchProps<T extends FieldValues> = {
  control: Control<T>
  desc?: string
  disabled?: boolean
  fluid?: boolean
  label?: string
  name: Path<T>
  required?: boolean
}

export function FormSwitch<T extends FieldValues>({
  control,
  desc,
  disabled,
  fluid = false,
  label,
  name,
  required = false,
}: FormSwitchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field className={cn(fluid && 'w-full')}>
          <div className="flex items-center gap-4">
            {!!label && (
              <FieldLabel className="order-2 flex gap-1 font-bold">
                <span>{label}</span>
                {required && <span className="text-red-600">*</span>}
              </FieldLabel>
            )}
            <Switch
              checked={field.value === '1'}
              disabled={disabled}
              onCheckedChange={(value) => field.onChange(value ? '1' : '0')}
            />
          </div>
          {desc && (
            <FieldDescription className="text-[10px]">{desc}</FieldDescription>
          )}
        </Field>
      )}
    />
  )
}
