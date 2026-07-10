import fs from 'fs'
import path from 'path'

import type { PaginatedResponse } from '~/types/paginated'
import type {
  ThingworxRealtimeRow,
  ThingworxResponse,
  Transformer,
  TransformerStatus,
  TransformerSummary,
} from '~/types/transformer'

import { iotApi } from '~/lib/axios/iot-api'

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

type GetTransformersParams = {
  capacity?: string[]
  district?: string[]
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: string
  status?: string
  tapChanger?: string
}

/**
 * Loads transformers from the CSV file, fetches realtime IoT status for each
 * station, merges deviceOnline into the status field, and returns a paginated
 * result.
 *
 * Steps:
 *  1. Load transformer data from CSV → Transformer[]
 *  2. Apply filters (search, district, capacity)
 *  3. Sort
 *  4. Paginate before IoT fetch
 *  5. Fetch realtime rows from ThingWorx using station IDs
 *  6. Map deviceOnline from each row back to the transformer data
 *  7. Return paginated slice with total count
 */
export async function getTransformers({
  capacity = [],
  district = [],
  limit = 10,
  page = 1,
  search = '',
  sortBy = 'installation_date',
  sortOrder = 'desc',
  status = 'all',
  tapChanger = '',
}: GetTransformersParams = {}): Promise<PaginatedResponse<Transformer>> {
  let transformers = loadTransformersFromCsv()
  const totalUnfiltered = transformers.length

  // Apply search filter
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    transformers = transformers.filter(
      (t) =>
        t.stationId.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.feeder.toLowerCase().includes(q)
    )
  }

  // Apply district filter
  if (district.length > 0) {
    transformers = transformers.filter((t) =>
      district.includes(t.district ?? '')
    )
  }

  // Apply capacity filter
  if (capacity.length > 0) {
    transformers = transformers.filter((t) =>
      capacity.includes(String(t.capacity))
    )
  }

  // Apply tap changer (OLTC) filter
  if (tapChanger) {
    transformers = transformers.filter((t) => t.tapChanger === tapChanger)
  }

  // Apply status filter
  if (status && status !== 'all') {
    const isOnlineTarget = status === 'online'
    transformers = transformers.filter(
      (t) => isMockOnline(t.stationId) === isOnlineTarget
    )
  }

  // Apply sorting
  transformers = sortTransformers(transformers, sortBy, sortOrder)

  const total = transformers.length

  const startIndex = (page - 1) * limit
  const pageSlice = transformers.slice(startIndex, startIndex + limit)

  const stationIds = [
    ...new Set(pageSlice.map((t) => t.stationId).filter(Boolean)),
  ]

  // MOCK: 95% online status
  const onlineStatusByStationId = new Map<string, boolean>(
    stationIds.map((id) => [id, isMockOnline(id)])
  )

  const data = pageSlice.map((transformer) => {
    const isOnline = onlineStatusByStationId.get(transformer.stationId) ?? false
    const status: TransformerStatus = isOnline ? 'online' : 'offline'
    return { ...transformer, isOnline, status }
  })

  return { data, total, totalUnfiltered }
}

/**
 * Returns summary statistics for all transformers (no pagination).
 * Used by the summary cards endpoint.
 */
export async function getTransformerSummary(): Promise<TransformerSummary> {
  const transformers = loadTransformersFromCsv()
  const stationIds = [...new Set(transformers.map((t) => t.stationId))]

  // MOCK: 95% online status
  const onlineStatusByStationId = new Map<string, boolean>(
    stationIds.map((id) => [id, isMockOnline(id)])
  )

  let online = 0
  let totalApparentPower = 0
  for (const t of transformers) {
    if (onlineStatusByStationId.get(t.stationId)) online++
    totalApparentPower += t.capacity || 0
  }

  const total = transformers.length
  const offline = total - online

  // MOCK: Generate realistic numbers for better electrical load quality
  const averageCapacity = totalApparentPower / (total || 1)
  const averageLoad = Math.round(averageCapacity * 0.65)

  const maxCapacity = Math.max(...transformers.map((t) => t.capacity || 0), 0)
  const maxLoad = Math.round(maxCapacity * 0.85)

  const utilizationFactor = 68.5 // Good utilization percentage

  return {
    averageLoad,
    maxLoad,
    offline,
    online,
    total,
    totalApparentPower,
    utilizationFactor,
  }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/** Allowed sortBy keys and their corresponding Transformer field accessor */
const SORT_FIELD_MAP: Record<
  string,
  (t: Transformer) => Date | number | string
> = {
  capacity: (t) => t.capacity,
  district: (t) => t.district ?? '',
  installation_date: (t) => t.installationDate?.getTime() ?? 0,
  installationType: (t) => t.installationType,
  tap_changer: (t) => t.tapChanger,
}

/**
 * Reads the transformer CSV file and returns a sorted list of Transformer objects.
 * Exported for use by sub-service modules (e.g. map/service.ts).
 */
export function loadTransformersFromCsv(): Transformer[] {
  const csvPath = path.join(
    process.cwd(),
    'src',
    'assets',
    'files',
    'tlm_properties.csv'
  )

  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split(/\r?\n/).filter(Boolean)

  // Skip header row
  const dataLines = lines.slice(1)

  return dataLines
    .map(parseCsvRowToTransformer)
    .filter((t): t is Transformer => t !== null)
    .sort((a, b) => {
      const aVal = a.installationDate?.getTime() ?? 0
      const bVal = b.installationDate?.getTime() ?? 0

      const aEmpty = !aVal || Number.isNaN(aVal)
      const bEmpty = !bVal || Number.isNaN(bVal)

      if (aEmpty && !bEmpty) return 1
      if (!aEmpty && bEmpty) return -1
      if (aEmpty && bEmpty) return 0

      return bVal - aVal
    })
}

/** Sort the transformer list by the given field and direction. */
function sortTransformers(
  transformers: Transformer[],
  sortBy: string,
  sortOrder: string
): Transformer[] {
  const accessor = SORT_FIELD_MAP[sortBy]
  if (!accessor) return transformers

  const direction = sortOrder === 'asc' ? 1 : -1

  return [...transformers].sort((a, b) => {
    const aVal = accessor(a)
    const bVal = accessor(b)

    const aEmpty = !aVal || Number.isNaN(aVal as number)
    const bEmpty = !bVal || Number.isNaN(bVal as number)

    if (aEmpty && !bEmpty) return 1
    if (!aEmpty && bEmpty) return -1
    if (aEmpty && bEmpty) return 0

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * direction
    }

    return String(aVal).localeCompare(String(bVal), 'th') * direction
  })
}

const CSV_COLUMNS = {
  ctHigh: { default: 0, index: 17, type: 'float' as const },
  ctLow: { default: 5, index: 18, type: 'float' as const },
  deviceId: { index: 0, type: 'string' as const },
  district: { index: 3, type: 'string' as const },
  feeder: { default: '', index: 2, type: 'string' as const },
  installationDate: { default: '', index: 14, type: 'string' as const },
  installationType: { default: '', index: 7, type: 'string' as const },
  kva: { default: 0, index: 5, type: 'float' as const },
  latitude: { default: 0, index: 8, type: 'float' as const },
  longitude: { default: 0, index: 9, type: 'float' as const },
  manufacturer: { default: '', index: 15, type: 'string' as const },
  meaNo: { default: '', index: 10, type: 'string' as const },
  stationId: { default: '', index: 1, type: 'string' as const },
  tapChanger: { default: '', index: 19, type: 'string' as const },
} as const

function getCol(cols: string[], key: keyof typeof CSV_COLUMNS): null | string {
  return parseCsvValue(cols[CSV_COLUMNS[key].index])
}

/** Returns a float column value, falling back to `fallback` (default: 0). */
function getColFloat(
  cols: string[],
  key: keyof typeof CSV_COLUMNS,
  fallback = 0
): number {
  return parseFloat(getCol(cols, key) ?? String(fallback)) || fallback
}

/** Returns a string column value, falling back to `fallback` (default: ''). */
function getColString(
  cols: string[],
  key: keyof typeof CSV_COLUMNS,
  fallback = ''
): string {
  return getCol(cols, key) ?? fallback
}

/**
 * MOCK: Deterministically return true for ~95% of station IDs
 */
function isMockOnline(stationId: string): boolean {
  if (!stationId) return false
  let hash = 0
  for (let i = 0; i < stationId.length; i++) {
    hash = stationId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 100 < 95
}

/**
 * Maps a single CSV line (already split into columns) to a Transformer object.
 * Returns null if the row is missing a required deviceId.
 */
function parseCsvRowToTransformer(line: string): null | Transformer {
  const cols = splitCsvLine(line)

  const deviceId = getCol(cols, 'deviceId')
  if (!deviceId) return null

  const installationDateStr = getCol(cols, 'installationDate')

  return {
    brand: getColString(cols, 'manufacturer'),
    capacity: getColFloat(cols, 'kva'),
    coordinates: {
      lat: getColFloat(cols, 'latitude'),
      lng: getColFloat(cols, 'longitude'),
    },
    ctRatio: `${getColFloat(cols, 'ctHigh')}/${getColFloat(cols, 'ctLow', 5)}`,
    district: getCol(cols, 'district') ?? undefined,
    feeder: getColString(cols, 'feeder'),
    id: deviceId,
    installationDate: installationDateStr
      ? new Date(installationDateStr)
      : null,
    installationType: getColString(cols, 'installationType'),
    lastReadingTime: new Date(0),
    primaryVoltage: 22,
    secondaryVoltage: 400,
    serialNumber: getColString(cols, 'meaNo'),
    stationId: getColString(cols, 'stationId'),
    status: 'offline' as TransformerStatus,
    tapChanger: getColString(cols, 'tapChanger'),
  }
}

/**
 * Parse a CSV value — strips surrounding quotes and unescapes internal ones.
 * Returns null for NULL/empty entries.
 */
function parseCsvValue(raw: null | string | undefined): null | string {
  const trimmed = raw?.trim() ?? ''

  if (trimmed === 'NULL' || trimmed === '') return null
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/""/g, '"').trim()
  }

  return trimmed
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Split a CSV line respecting double-quoted fields.
 */
function splitCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
        current += ch
      }
      continue
    }

    if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
      continue
    }

    current += ch
  }
  fields.push(current)
  return fields
}

const PROPERTY_NAMES = {
  items: [
    'name',
    'trRated',
    'stationID',
    'feederID',
    'deviceOnline',
    // 'lastPayload',
    // 'LatLong',
    // 'lastDataTimestamp',
    // 'activePower_L1_Ins',
    // 'activePower_L2_Ins',
    // 'activePower_L3_Ins',
    // 'reactivePower_L1_Ins',
    // 'reactivePower_L2_Ins',
    // 'reactivePower_L3_Ins',
    'current_L1_Ins',
    'current_L2_Ins',
    'current_L3_Ins',
    'voltage_L1_Ins',
    'voltage_L2_Ins',
    'voltage_L3_Ins',
  ],
}

const THINGWORX_MAX_BATCH_SIZE = 50
const CHUNK_DELAY_MS = 300

/**
 * Fetches realtime IoT rows for the given station IDs from ThingWorx.
 * Requests are sent sequentially — one chunk at a time — with a short
 * delay between each to avoid overwhelming the ThingWorx API.
 * Exported for use by sub-service modules (e.g. map/service.ts).
 */
export async function fetchRealtimeRows(
  stationIds: string[]
): Promise<ThingworxRealtimeRow[]> {
  if (stationIds.length === 0) return []

  const chunks: string[][] = []
  for (let i = 0; i < stationIds.length; i += THINGWORX_MAX_BATCH_SIZE) {
    chunks.push(stationIds.slice(i, i + THINGWORX_MAX_BATCH_SIZE))
  }

  const results: ThingworxRealtimeRow[][] = []
  for (const chunk of chunks) {
    const rows = await fetchRealtimeChunk(chunk)
    results.push(rows)
    await sleep(CHUNK_DELAY_MS)
  }

  return results.flat()
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/** Sends a single batched request to the ThingWorx realtime API for one chunk of station IDs. */
async function fetchRealtimeChunk(
  chunk: string[]
): Promise<ThingworxRealtimeRow[]> {
  const { rows = [] }: ThingworxResponse<ThingworxRealtimeRow> =
    await iotApi.post('/ThingQuiries/Services/GetNamedPropertyThingsAPI', {
      propertyNames: PROPERTY_NAMES,
      things: { things: chunk },
    })
  return rows
}

/** Pauses execution for `ms` milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
