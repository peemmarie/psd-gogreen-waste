'use client'

import type maplibregl from 'maplibre-gl'

import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { MapProvider } from 'react-map-gl/maplibre'

import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleMapsIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { IconArrowLeft, IconMapPin } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import type { Transformer } from '~/types/transformer'

import { FormInput } from '~/components/form'
import { BaseMap } from '~/components/transformer-map/components/base-map'
import { MapMarker } from '~/components/transformer-map/components/map-marker'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { nextApi } from '~/lib/axios/next-api'

import { TransformerInfo } from './components/transformer-info'
import { TransformerMonitorWorkspace } from './components/transformer-monitor-workspace'
import { useOpenGoogleMap } from './hooks/use-open-google-map'

const transformerFormSchema = z.object({
  brand: z.string().min(1, 'ระบุยี่ห้อ'),
  capacity: z.coerce.number().min(1, 'ระบุขนาด (kVA)'),
  district: z.string().optional(),
  feeder: z.string().min(1, 'ระบุ Feeder'),
  id: z.string().optional(),
  installationDate: z.string().min(1, 'ระบุวันที่'),
  installationType: z.string().min(1, 'ระบุรุ่น'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  primaryVoltage: z.coerce.number().min(1, 'ระบุแรงดัน (kV)'),
  secondaryVoltage: z.coerce.number().min(1, 'ระบุแรงดัน (V)'),
  serialNumber: z.string().min(1, 'ระบุ S/N'),
  tapChanger: z.string().optional(),
})

type TransformerDetailPageProps = Readonly<{
  /** Whether the page is in editing mode (derived from URL path) */
  isEditing?: boolean
}>

type TransformerFormInput = z.input<typeof transformerFormSchema>
type TransformerFormValues = z.infer<typeof transformerFormSchema>

export function TransformerDetailPage({
  isEditing = false,
}: TransformerDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { openGoogleMap } = useOpenGoogleMap()

  const { data: transformer, isLoading } = useQuery<Transformer>({
    queryFn: () => nextApi.get(`/transformers/${id}`),
    queryKey: ['transformer', id],
  })

  const formValues = useMemo<TransformerFormValues | undefined>(() => {
    if (!transformer) return undefined

    return {
      brand: transformer.brand || '',
      capacity: transformer.capacity || 0,
      district: transformer.district || '',
      feeder: transformer.feeder || '',
      id: transformer.id,
      installationDate: transformer.installationDate
        ? formatDateForInput(transformer.installationDate)
        : '',
      installationType: transformer.installationType || '',
      lat: transformer.coordinates.lat,
      lng: transformer.coordinates.lng,
      primaryVoltage: transformer.primaryVoltage || 0,
      secondaryVoltage: transformer.secondaryVoltage || 0,
      serialNumber: transformer.serialNumber || '',
      tapChanger: transformer.tapChanger?.toLowerCase() || '',
    }
  }, [transformer])

  const form = useForm<TransformerFormInput, unknown, TransformerFormValues>({
    defaultValues: {
      brand: '',
      capacity: 0,
      district: '',
      feeder: '',
      id: '',
      installationDate: '',
      installationType: '',
      lat: 0,
      lng: 0,
      primaryVoltage: 0,
      secondaryVoltage: 0,
      serialNumber: '',
      tapChanger: '',
    },
    resolver: zodResolver(transformerFormSchema),
  })

  const watchedLat = useWatch({ control: form.control, name: 'lat' })
  const watchedLng = useWatch({ control: form.control, name: 'lng' })

  // Handler functions
  async function onSubmit(_values: TransformerFormValues) {
    try {
      // Mock API call since there's no save endpoint yet
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success('บันทึกข้อมูลสำเร็จ', {
        description: 'ข้อมูลหม้อแปลงถูกอัปเดตเรียบร้อยแล้ว',
      })
      router.push(`/transformers/${id}`)
    } catch {
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง',
      })
    }
  }

  function handleBack() {
    router.back()
  }

  // Effects
  useEffect(() => {
    window.scrollTo({ behavior: 'instant', left: 0, top: 0 })
  }, [])

  useEffect(() => {
    if (formValues) form.reset(formValues)
  }, [formValues, form])

  // Early returns
  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-label="กำลังโหลดข้อมูลหม้อแปลง"
        className="space-y-6"
      >
        <div className="flex items-start gap-4">
          <Skeleton className="size-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid gap-6 xl:grid-cols-12">
          <Skeleton className="h-136 xl:col-span-5" />
          <Skeleton className="h-136 xl:col-span-7" />
        </div>
      </div>
    )
  }

  if (!transformer) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center py-24">
        <div className="text-muted-foreground text-center text-sm">
          ไม่พบข้อมูลหม้อแปลง
        </div>
      </div>
    )
  }

  // Derived state
  const { lat, lng } = transformer.coordinates

  const currentLat = isEditing ? parseCoordinate(watchedLat, lat) : lat
  const currentLng = isEditing ? parseCoordinate(watchedLng, lng) : lng

  const bounds: [maplibregl.LngLatLike, maplibregl.LngLatLike] = [
    [currentLng - 0.02, currentLat - 0.01],
    [currentLng + 0.02, currentLat + 0.01],
  ]

  const detailStationTitle = `${transformer.feeder || 'ไม่พบข้อมูล Feeder'} • ${transformer.district}`
  return (
    <div className="space-y-8">
      <section aria-labelledby="transformer-title" className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex min-w-0 items-start gap-3">
            <Button
              aria-label="ย้อนกลับ"
              className="mt-0.5 shrink-0"
              onClick={handleBack}
              size="icon"
              type="button"
              variant="outline"
            >
              <IconArrowLeft className="size-4" />
            </Button>

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1
                  className="truncate text-2xl font-semibold tracking-normal tabular-nums"
                  id="transformer-title"
                >
                  {transformer.stationId}
                </h1>
              </div>
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <IconMapPin aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{detailStationTitle}</span>
              </p>
            </div>
          </div>

          {/* {isEditing ? (
            <div className="flex shrink-0 items-center gap-2">
              <Button
                className="gap-1.5"
                onClick={handleCancel}
                size="sm"
                type="button"
                variant="outline"
              >
                <IconX className="size-4" />
                ยกเลิก
              </Button>
              <Button
                className="gap-1.5"
                disabled={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
                size="sm"
                type="button"
              >
                <IconCheck className="size-4" />
                {form.formState.isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </div>
          ) : (
            <Link href={`/transformers/${id}/edit`}>
              <Button className="gap-1.5" size="sm" variant="outline">
                <IconEdit className="size-4" />
                แก้ไขข้อมูล
              </Button>
            </Link>
          )} */}
        </div>

        <div className="bg-muted/25 grid overflow-hidden rounded-lg border sm:grid-cols-2 xl:grid-cols-3">
          <SummaryMetric
            label="พิกัดหม้อแปลง"
            unit="kVA"
            value={formatNumber(transformer.capacity)}
          />
          <SummaryMetric
            label="แรงดัน Primary / Secondary"
            unit="kV / V"
            value={`${formatNumber(transformer.primaryVoltage)} / ${formatNumber(transformer.secondaryVoltage)}`}
          />
          <SummaryMetric
            label="Feeder"
            value={transformer.feeder || 'ไม่มีข้อมูล'}
          />
        </div>
      </section>

      {/* Info & Map Section */}
      <form id="transformer-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid items-stretch gap-6 xl:grid-cols-12">
          {/* Transformer Info */}
          <div className="xl:col-span-5">
            <TransformerInfo
              control={form.control}
              isEditing={isEditing}
              transformer={transformer}
            />
          </div>

          {/* Map */}
          <Card className="flex min-h-136 flex-col xl:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-5">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <IconMapPin
                  aria-hidden="true"
                  className="text-primary size-4"
                />
                ตำแหน่งที่ตั้ง
              </CardTitle>
              {!isEditing && (
                <Button
                  className="h-8 gap-1.5 px-3 text-xs shadow-none"
                  onClick={() => openGoogleMap(lat, lng)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <HugeiconsIcon className="size-3.5" icon={GoogleMapsIcon} />
                  Google Maps
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <FormInput
                  className="font-mono tabular-nums"
                  control={form.control}
                  disabled={!isEditing}
                  fluid
                  label="Latitude"
                  name="lat"
                  step="any"
                  type="number"
                />
                <FormInput
                  className="font-mono tabular-nums"
                  control={form.control}
                  disabled={!isEditing}
                  fluid
                  label="Longitude"
                  name="lng"
                  step="any"
                  type="number"
                />
              </div>
              <div className="min-h-80 flex-1 overflow-hidden rounded-md border">
                <MapProvider>
                  <BaseMap bounds={bounds} isDetailPage>
                    <MapMarker
                      coordinates={{ lat: currentLat, lng: currentLng }}
                      draggable={isEditing}
                      onDragEnd={(lat, lng) => {
                        form.setValue('lat', Number(lat.toFixed(6)), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                        form.setValue('lng', Number(lng.toFixed(6)), {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }}
                      onHover={() => {}}
                      status="online"
                    />
                  </BaseMap>
                </MapProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <TransformerMonitorWorkspace transformer={transformer} />
    </div>
  )
}

/**
 * Wrapper component for the edit route (`/transformers/[id]/edit`).
 * Passes `isEditing` prop to `TransformerDetailPage`.
 */
export function TransformerEditPage() {
  return <TransformerDetailPage isEditing />
}

function formatDateForInput(date: Date | string) {
  try {
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

function formatNumber(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString('th-TH', { maximumFractionDigits })
}

function parseCoordinate(val: unknown, fallback: number) {
  if (
    val === '' ||
    val === null ||
    val === undefined ||
    Number.isNaN(Number(val))
  ) {
    return fallback
  }

  return Number(val)
}

function SummaryMetric({
  className,
  label,
  unit,
  value,
}: Readonly<{
  className?: string
  label: string
  unit?: string
  value: string
}>) {
  return (
    <div className="min-w-0 border-b p-4 last:border-b-0 xl:border-r xl:border-b-0 xl:last:border-r-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p
        className={`mt-1 truncate font-mono text-base font-semibold tabular-nums ${className || ''}`}
      >
        {value}
        {unit && (
          <span className="text-muted-foreground ml-1.5 font-sans text-xs font-normal">
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}
