import type { Feature, FeatureCollection, Point } from 'geojson'

import type { TransformerStatus } from '~/types/transformer'
import type { Transformer } from '~/types/transformer'

import { fetchRealtimeRows, loadTransformersFromCsv } from '../../service'

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

type GetTransformersGeoJsonParams = {
  /** District to filter by (empty = all) */
  district?: string
  /** Free-text search on ID / stationId / feeder */
  search?: string
  /** Sort option: 'id-asc' | 'id-desc' */
  sort?: string
}

type TransformerProperties = {
  /** Transformer capacity (kVA) */
  capacity: number
  /** CT ratio string */
  ctRatio: string
  /** District name */
  district: null | string
  /** Feeder name */
  feeder: string
  /** Unique transformer ID */
  id: string
  /** Station display ID */
  stationId: string
  /** Online / offline status resolved from ThingWorx */
  status: TransformerStatus
}

/**
 * Returns all (filtered) transformers as a GeoJSON FeatureCollection.
 * Each feature carries key transformer properties for map consumption.
 */
export async function getTransformersGeoJson({
  district = '',
  search = '',
  sort = 'id-asc',
}: GetTransformersGeoJsonParams = {}): Promise<
  FeatureCollection<Point, TransformerProperties>
> {
  const all = loadTransformersFromCsv()

  let filtered: Transformer[] = all

  if (district && district !== 'all')
    filtered = filtered.filter((t) => t.district === district)

  const trim = search.trim()
  if (trim) {
    const q = trim.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.stationId.toLowerCase().includes(q) ||
        t.feeder.toLowerCase().includes(q)
    )
  }

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'id-desc') return b.id.localeCompare(a.id)
    return a.id.localeCompare(b.id)
  })

  // Resolve online / offline status from ThingWorx for all filtered stations
  const stationIds = [
    ...new Set(filtered.map((t) => t.stationId).filter(Boolean)),
  ]
  const realtimeRows = await fetchRealtimeRows(stationIds).catch(() => [])
  const onlineByStationId = new Map<string, boolean>(
    realtimeRows
      .filter((row) => row.name != null)
      .map((row) => [row.name as string, row.deviceOnline ?? false])
  )

  const features: Feature<Point, TransformerProperties>[] = filtered.map(
    (t) => {
      const isOnline = onlineByStationId.get(t.stationId) ?? false
      const status: TransformerStatus = isOnline ? 'online' : 'offline'
      return {
        geometry: {
          coordinates: [t.coordinates.lng, t.coordinates.lat],
          type: 'Point',
        },
        properties: {
          capacity: t.capacity,
          ctRatio: t.ctRatio,
          district: t.district ?? null,
          feeder: t.feeder,
          id: t.id,
          stationId: t.stationId,
          status,
        },
        type: 'Feature',
      }
    }
  )

  return { features, type: 'FeatureCollection' }
}
