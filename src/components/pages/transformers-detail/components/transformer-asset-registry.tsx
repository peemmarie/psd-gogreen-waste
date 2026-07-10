'use client'

import {
  IconAntennaBars5,
  IconEdit,
  IconHistory,
  IconServer,
  IconTool,
} from '@tabler/icons-react'
import Link from 'next/link'

import type { Transformer } from '~/types/transformer'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'

type TransformerAssetRegistryProps = Readonly<{
  transformer: Transformer
}>

export function TransformerAssetRegistry({
  transformer,
}: TransformerAssetRegistryProps) {
  const isOnline = transformer.status === 'online'
  const routeId = transformer.stationId || transformer.id
  const reportingInterval = /^(WL|BR|SD)/.test(routeId)
    ? 'ทุก 1 นาที'
    : 'ทุก 15 นาที'

  const nameplateRows = [
    { label: 'Serial No.', value: transformer.serialNumber },
    { label: 'ผู้ผลิต', value: transformer.brand },
    {
      label: 'วันที่ติดตั้ง',
      value: formatDate(transformer.installationDate),
    },
    {
      label: 'ขนาดพิกัด',
      value: `${formatNumber(transformer.capacity)} kVA`,
    },
    { label: 'ชนิดการติดตั้ง', value: transformer.installationType },
    {
      label: 'แรงดัน HV / LV',
      value: `${formatNumber(transformer.primaryVoltage)} kV / ${formatNumber(transformer.secondaryVoltage)} V`,
    },
    { label: 'Tap Changer', value: transformer.tapChanger },
    { label: 'CT Ratio', value: transformer.ctRatio },
    { label: 'Feeder', value: transformer.feeder },
    { label: 'การไฟฟ้าเขต', value: transformer.district },
  ]

  const deviceRows = [
    { label: 'Device ID', value: transformer.id },
    { label: 'Station ID', value: transformer.stationId },
    { label: 'รอบส่งข้อมูล', value: reportingInterval },
    {
      label: 'Last seen',
      value: formatDateTime(transformer.lastReadingTime),
    },
    {
      label: 'พิกัดติดตั้ง',
      value: `${transformer.coordinates.lat.toFixed(6)}, ${transformer.coordinates.lng.toFixed(6)}`,
    },
    { label: 'รุ่น / Firmware', value: null },
    { label: 'SIM / ICCID', value: null },
    { label: 'ความแรงสัญญาณ (RSSI)', value: null },
    { label: 'Battery สำรอง', value: null },
    { label: 'Calibrate ถัดไป', value: null },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-semibold">ทะเบียนทรัพย์สิน</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            ข้อมูลประจำหม้อแปลง อุปกรณ์ TLM และประวัติการบำรุงรักษา
          </p>
        </div>
        <Button
          render={<Link href={`/transformers/${routeId}/edit`} />}
          variant="outline"
        >
          <IconEdit data-icon="inline-start" />
          แก้ไขข้อมูลทะเบียน
        </Button>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <IconServer aria-hidden="true" />
              ข้อมูลหม้อแปลง (Nameplate)
            </CardTitle>
            <CardDescription>
              ข้อมูลพิกัดและการติดตั้งจากทะเบียนหม้อแปลง
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DefinitionList rows={nameplateRows} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <IconAntennaBars5 aria-hidden="true" />
              อุปกรณ์ TLM
            </CardTitle>
            <CardDescription>
              การเชื่อมต่อและข้อมูลประจำอุปกรณ์ตรวจวัด
            </CardDescription>
            <CardAction>
              <Badge variant={isOnline ? 'secondary' : 'destructive'}>
                <span
                  aria-hidden="true"
                  className={
                    isOnline
                      ? 'size-1.5 rounded-full bg-emerald-600'
                      : 'bg-destructive size-1.5 rounded-full'
                  }
                />
                {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <DefinitionList rows={deviceRows} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <IconHistory aria-hidden="true" />
            ประวัติบำรุงรักษาและเปลี่ยนอุปกรณ์
          </CardTitle>
          <CardDescription>
            รายการงานตรวจสอบ ซ่อมบำรุง และการเปลี่ยนอุปกรณ์ที่ผูกกับสินทรัพย์นี้
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="min-h-52 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconTool aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>ยังไม่มีประวัติบำรุงรักษา</EmptyTitle>
              <EmptyDescription>
                เมื่อเชื่อมต่อข้อมูลจากระบบงานบำรุงรักษา
                รายการล่าสุดจะแสดงที่นี่
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

function DefinitionList({
  rows,
}: Readonly<{
  rows: { label: string; value?: null | string }[]
}>) {
  return (
    <dl className="divide-y">
      {rows.map((row) => (
        <div
          className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6"
          key={row.label}
        >
          <dt className="text-muted-foreground text-xs">{row.label}</dt>
          <dd className="min-w-0 text-sm font-medium break-words sm:text-right sm:tabular-nums">
            {row.value || <span className="text-muted-foreground">—</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function formatDate(value: Date | null) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatNumber(value: number) {
  return value.toLocaleString('th-TH', { maximumFractionDigits: 2 })
}
