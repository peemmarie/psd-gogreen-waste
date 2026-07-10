'use client'

import { Calendar, Download, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'

type HeaderInfoProps = {
  date?: string
  description?: string
  heading: string
  isRefreshing?: boolean
  onExport?: () => void
  onRefresh?: () => void
}

export function HeaderInfo({
  date,
  description,
  heading,
  isRefreshing,
  onExport,
  onRefresh,
}: HeaderInfoProps) {
  const t = useTranslations('common.system')

  const formattedDate = date
    ? new Date(date).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-'

  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-2xl font-bold">{heading}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Calendar className="size-4" />
        <span>{t('latest_data_date')}</span>
        <span className="text-foreground font-medium">{formattedDate}</span>

        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />

        <Button
          className="size-8"
          disabled={isRefreshing}
          onClick={onRefresh}
          size="icon"
          variant="ghost"
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </Button>

        <Button
          className="size-8"
          onClick={onExport}
          size="icon"
          variant="ghost"
        >
          <Download className="size-4" />
        </Button>
      </div>
    </div>
  )
}
