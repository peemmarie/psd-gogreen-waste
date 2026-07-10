import type {
  ArrayPath,
  Control,
  FieldArray,
  FieldValues,
  Path,
} from 'react-hook-form'

import { Controller, useFieldArray } from 'react-hook-form'

import { Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'

import { Input } from './input'

export type FormArrayProps<T extends FieldValues> =
  | WithInputType<T>
  | WithSelectType<T>

type FormArrayCommon<T extends FieldValues> = {
  addBtnLabel?: string
  control: Control<T>
  defaultValue: FieldArray<T, ArrayPath<T>>
  fieldKeys: string[]
  fluid?: boolean
  indexLabel?: string
  max: number
  name: ArrayPath<T>
  required?: boolean
  titleLabel: string
}

type WithInputType<T extends FieldValues> = {
  type: 'input'
} & FormArrayCommon<T>

type WithSelectType<T extends FieldValues> = {
  options: { label: string; value: string }[]
  type: 'select'
} & FormArrayCommon<T>

export function FormArray<T extends FieldValues>({
  addBtnLabel,
  control,
  defaultValue,
  fieldKeys,
  fluid,
  indexLabel,
  max,
  name,
  required = false,
  titleLabel,
  type,
  ...props
}: FormArrayProps<T>) {
  const t = useTranslations('pages.m_ev.form')
  const { append, fields, remove } = useFieldArray({
    control,
    name,
    rules: {
      maxLength: max,
      required,
    },
  })

  function handleAppendField() {
    append(defaultValue, { shouldFocus: false })
  }

  const options = type === 'select' ? (props as WithSelectType<T>).options : []

  const length = fields.length
  const isDisableRemoveBtn = length === 1
  const isMorethanFieldLimit = length >= max

  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ fieldState }) => (
        <Field>
          <FieldLabel className="flex gap-1 font-bold">
            <span>{titleLabel ?? t('ev_label')}</span>
            {required && <span className="text-red-600">*</span>}
          </FieldLabel>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div className="flex items-center gap-4" key={field.id}>
                <p className="shrink-0 text-sm">{`${indexLabel ?? t('ev_label')} ${index + 1}`}</p>
                {fieldKeys.map((fk) => (
                  <Input
                    control={control}
                    fluid={fluid}
                    key={fk}
                    name={`${name}.${index}.${fk}` as Path<T>}
                    options={options}
                    type={type}
                  />
                ))}
                <Button
                  disabled={isDisableRemoveBtn}
                  onClick={() => remove(index)}
                  size="icon"
                  type="button"
                  variant="link"
                >
                  <Trash2 className="text-red-600" />
                </Button>
              </div>
            ))}

            <Button
              className="flex gap-2"
              disabled={isMorethanFieldLimit}
              onClick={handleAppendField}
              type="button"
              variant="ghost"
            >
              <Plus />
              <p>{addBtnLabel ?? t('add_ev_btn')}</p>
            </Button>
          </div>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
