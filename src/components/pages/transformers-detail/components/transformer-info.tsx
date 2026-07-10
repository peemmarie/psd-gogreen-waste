import { useWatch } from 'react-hook-form'

import { IconInfoCircle } from '@tabler/icons-react'

import type { Transformer } from '~/types/transformer'

import { FormInput, FormSelect } from '~/components/form'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'

type TransformerInfoProps = {
  control: any
  isEditing: boolean
  transformer: Transformer
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TAP_CHANGER_OPTIONS = [
  { label: 'Manual', value: 'manual' },
  { label: 'OLTC', value: 'oltc' },
]

// ---------------------------------------------------------------------------
// Public components
// ---------------------------------------------------------------------------

export function TransformerInfo({
  control,
  isEditing,
  transformer,
}: TransformerInfoProps) {
  const watchedCapacity = useWatch({ control, name: 'capacity' })
  const watchedSecondaryVoltage = useWatch({
    control,
    name: 'secondaryVoltage',
  })

  const currentCapacity = isEditing ? watchedCapacity : transformer.capacity
  const currentSecondaryVolts = isEditing
    ? watchedSecondaryVoltage
    : transformer.secondaryVoltage

  const ratedCurrent =
    currentSecondaryVolts > 0
      ? Math.floor(
          (currentCapacity * 1000) / (Math.sqrt(3) * currentSecondaryVolts)
        ).toLocaleString()
      : '0'

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <IconInfoCircle className="h-5 w-5" />
          ข้อมูลหม้อแปลง
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-4 text-sm font-semibold">
            ข้อมูลทั่วไปและการติดตั้ง
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              className="text-muted-foreground h-9 font-mono font-medium"
              control={control}
              disabled
              fluid
              label="Device ID"
              name="id"
              placeholder="Device ID"
            />
            <FormInput
              className="h-9 font-mono text-sm"
              control={control}
              disabled={!isEditing}
              fluid
              label="MEA No."
              name="serialNumber"
              placeholder="ระบุ MEA No."
            />
            <FormInput
              className="h-9 text-sm"
              control={control}
              disabled={!isEditing}
              fluid
              label="การไฟฟ้าเขต"
              name="district"
              placeholder="ระบุการไฟฟ้าเขต"
            />
            <FormInput
              className="h-9 font-mono text-sm"
              control={control}
              disabled={!isEditing}
              fluid
              label="Feeder"
              name="feeder"
              placeholder="ระบุ Feeder"
            />
            <FormInput
              className="h-9 text-sm"
              control={control}
              disabled={!isEditing}
              fluid
              label="ประเภทติดตั้ง"
              name="installationType"
              placeholder="ระบุประเภทติดตั้ง"
            />
            <FormInput
              className="h-9 text-sm"
              control={control}
              disabled={!isEditing}
              fluid
              label="วันที่ติดตั้ง"
              name="installationDate"
              placeholder="เลือกวันที่"
              type="date"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="mb-4 text-sm font-semibold">พิกัดทางไฟฟ้า</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              className="h-9 text-sm"
              control={control}
              disabled={!isEditing}
              fluid
              label="พิกัดหม้อแปลง"
              name="capacity"
              placeholder="ระบุขนาด (kVA)"
              suffix="kVA"
              type="number"
            />

            <Field className="w-full">
              <FieldLabel className="flex gap-1 font-bold">
                <span>พิกัดแรงดันไฟฟ้า</span>
              </FieldLabel>
              <div className="flex items-center gap-2">
                <FormInput
                  className="h-9 text-sm"
                  control={control}
                  disabled={!isEditing}
                  fluid
                  name="primaryVoltage"
                  placeholder="Primary (kV)"
                  suffix="kV"
                  type="number"
                />
                <span className="text-muted-foreground text-sm">/</span>
                <FormInput
                  className="h-9 text-sm"
                  control={control}
                  disabled={!isEditing}
                  fluid
                  name="secondaryVoltage"
                  placeholder="Secondary (V)"
                  suffix="V"
                  type="number"
                />
              </div>
            </Field>

            <Field className="w-full">
              <FieldLabel className="flex gap-1 font-bold">
                <span>พิกัดกระแสไฟฟ้า</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  className="text-muted-foreground h-9 pr-12 font-medium"
                  disabled
                  value={ratedCurrent}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-muted-foreground text-sm">A</span>
                </div>
              </div>
              <FieldDescription>
                คำนวณจาก: (kVA × 1000) / (√3 × V)
              </FieldDescription>
            </Field>

            <FormSelect
              className="h-9 font-mono text-sm"
              control={control}
              disabled={!isEditing}
              fluid
              label="Tap Changer"
              name="tapChanger"
              options={TAP_CHANGER_OPTIONS}
              placeholder="เลือก Tap Changer"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
