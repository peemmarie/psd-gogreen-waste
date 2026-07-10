import * as XLSX from 'xlsx'

export function downloadCsv(data: Record<string, unknown>[], filename: string) {
  const exportData = prepareExportData(data)
  if (exportData.length === 0) return

  const headers = Object.keys(exportData[0])
  const csvRows = [
    headers.join(','),
    ...exportData.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? ''
          const str = String(val)
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str
        })
        .join(',')
    ),
  ]
  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadXlsx(
  data: Record<string, unknown>[],
  filename: string
) {
  const exportData = prepareExportData(data)
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Historical Data')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

function flattenRow(
  row: Record<string, unknown>,
  prefix = ''
): Record<string, unknown> {
  return Object.entries(row).reduce<Record<string, unknown>>((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(acc, flattenRow(v as Record<string, unknown>, key))
    } else {
      acc[key] = v
    }
    return acc
  }, {})
}

function prepareExportData(
  data: Record<string, unknown>[]
): Record<string, unknown>[] {
  return data.map((row) => {
    const { time, value: _value, ...rest } = flattenRow(row)
    return { time, ...rest }
  })
}
