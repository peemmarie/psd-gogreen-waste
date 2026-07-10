import { useTranslations } from 'next-intl'

import { formatCount, formatNumber } from '~/utils/number'

type ValueDisplayProps = {
  className?: string
  type: 'full-date-time' | 'number-decimal' | 'number' | 'price' | 'year'
  value: number | string
}

export function ValueDisplay({ className, type, value }: ValueDisplayProps) {
  const t = useTranslations('common.table')

  function formatValue(
    value: number | string,
    type: 'full-date-time' | 'number-decimal' | 'number' | 'price' | 'year'
  ) {
    switch (type) {
      case 'full-date-time':
        return new Date(value).toLocaleString('th-TH', {
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })

      case 'number':
        return formatNumber(value, undefined, {
          maximumFractionDigits: undefined,
          minimumFractionDigits: undefined,
          useGrouping: true,
        })

      case 'number-decimal':
        return formatNumber(value, undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })

      case 'price':
        return formatNumber(value, 'en-US', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
          useGrouping: true,
        })

      case 'year': {
        let years = Math.floor(Number(value))
        let months = Math.ceil((Number(value) - years) * 12)

        if (months === 12) {
          years++
          months = 0
        }

        const yearStr = years > 0 ? `${formatCount(years)} ${t('year')}` : ''
        const monthStr = months > 0 ? `${months} ${t('month')}` : ''

        if (yearStr && monthStr) return `${yearStr} ${monthStr}`
        if (yearStr) return yearStr
        if (monthStr) return monthStr

        return `0 ${t('year')}`
      }

      default:
        return value
    }
  }

  return <div className={className}>{formatValue(value, type)}</div>
}
