import type { Control, FieldValues, Path } from 'react-hook-form'

import { FormInput } from '~/components/form/form-input'
import { FormSelect } from '~/components/form/form-select'

type InputCommon<T extends FieldValues> = {
  control: Control<T>
  fluid?: boolean
  name: Path<T>
}

type InputProps<T extends FieldValues> = WithInputType<T> | WithSelectType<T>

type WithInputType<T extends FieldValues> = {
  type: 'input'
} & InputCommon<T>

type WithSelectType<T extends FieldValues> = {
  options: { label: string; value: string }[]
  type: 'select'
} & InputCommon<T>

export function Input<T extends FieldValues>({
  control,
  fluid = false,
  name,
  type,
  ...props
}: InputProps<T>) {
  if (type === 'input') {
    return <FormInput control={control} fluid={fluid} name={name} />
  }

  const { options } = props as WithSelectType<T>

  return (
    <FormSelect
      control={control}
      fluid={fluid}
      name={name}
      options={options}
      shouldTranslate
    />
  )
}
