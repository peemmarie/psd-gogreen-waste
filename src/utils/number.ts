export function formatCount(count: number): string {
  return formatNumber(count, undefined, {
    compactDisplay: 'short',
    notation: 'compact',
  })
}

/**
 * Formats a value where the base unit is in Kilo (e.g., kW, kVA).
 * Automatically scales up to Mega (M) or Giga (G) if the value is large enough.
 *
 * @param value The numerical value in Kilo (10^3)
 * @param baseUnit The base unit suffix (e.g., 'VA', 'W', 'var')
 * @param locale The locale to format the number in (default 'th-TH')
 * @returns Formatted string with appropriate prefix (e.g., "1.5 MW")
 */
export function formatKiloUnit(
  value: null | number | string | undefined,
  baseUnit: string = '',
  locale: string = 'th-TH'
): string {
  const num = Number(value ?? 0)

  if (num === 0) return `0 k${baseUnit}`

  let scaledValue = num
  let prefix = 'k'

  const absValue = Math.abs(num)

  if (absValue >= 1_000_000) {
    scaledValue = num / 1_000_000
    prefix = 'G'
  }

  if (absValue >= 1_000) {
    scaledValue = num / 1_000
    prefix = 'M'
  }

  const finalUnit = `${prefix}${baseUnit}`
  const formattedValue = formatNumber(scaledValue, locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })

  return `${formattedValue} ${finalUnit}`
}

export function formatNumber(
  value: number | string,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  const num = Number(value)
  if (isNaN(num)) return String(value)
  return new Intl.NumberFormat(locale, options).format(num)
}

export function formatReadingValue(value?: number) {
  if (!value) return '-'
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
}
