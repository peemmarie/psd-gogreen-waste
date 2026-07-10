import { useState } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'

import { AlertCircle, Eye, EyeOff } from 'lucide-react'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

import { ENGLISH_REGEX } from '../../constants/regex'

type FormPasswordInputProps<T extends FieldValues> = {
  control: Control<T>
  desc?: string
  fluid?: boolean
  label?: string
  languageHintText?: string
  name: Path<T>
  placeholder?: string
  showLanguageHint?: boolean
} & Omit<React.ComponentProps<'input'>, 'type'>

export function FormPasswordInput<T extends FieldValues>({
  control,
  desc,
  fluid = false,
  label,
  languageHintText = 'กรุณาพิมพ์เป็นภาษาอังกฤษเท่านั้น',
  name,
  placeholder,
  required = false,
  showLanguageHint = false,
  ...props
}: FormPasswordInputProps<T>) {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [hasNonEnglish, setHasNonEnglish] = useState(false)

  function togglePasswordVisibility() {
    setIsShowPassword((prev) => !prev)
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string) => void
  ) {
    const value = e.target.value
    fieldOnChange(value)

    if (showLanguageHint && value) {
      return setHasNonEnglish(!ENGLISH_REGEX.test(value))
    }

    setHasNonEnglish(false)
  }

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
            <div className="relative">
              <Input
                placeholder={placeholder}
                type={isShowPassword ? 'text' : 'password'}
                {...props}
                {...field}
                className={cn(
                  'pr-10',
                  hasNonEnglish &&
                    'border-amber-500 focus-visible:ring-amber-500',
                  props.className
                )}
                onChange={(e) => handleInputChange(e, field.onChange)}
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                type="button"
              >
                {isShowPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
          <FieldError errors={[fieldState.error]} />
          {hasNonEnglish && showLanguageHint && (
            <FieldDescription className="flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle className="size-3.5" />
              {languageHintText}
            </FieldDescription>
          )}
          {desc && !hasNonEnglish && (
            <FieldDescription className="text-[10px]">{desc}</FieldDescription>
          )}
        </Field>
      )}
    />
  )
}
