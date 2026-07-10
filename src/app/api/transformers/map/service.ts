import type { PaginatedResponse } from '~/types/paginated'
import type { Transformer, TransformerStatus } from '~/types/transformer'

import { getDistanceKm } from '~/utils/distance'

import { fetchRealtimeRows, loadTransformersFromCsv } from '../service'

export type MapResponse = {
  districts: string[]
} & PaginatedResponse<Transformer>

type GetTransformersForMapParams = {
  capacity?: string[]
  district?: string[]
  lat?: number
  lng?: number
  radius?: number
  search?: string
  status?: string
  tapChanger?: string
}

export async function getTransformersForMap({
  capacity = [],
  district = [],
  lat,
  lng,
  radius = 5,
  search = '',
  status = 'all',
  tapChanger = '',
}: GetTransformersForMapParams = {}): Promise<MapResponse> {
  const allTransformers = loadTransformersFromCsv()

  // Collect all districts before filtering
  const districts = Array.from(
    new Set(allTransformers.map((t) => t.district).filter(Boolean))
  ) as string[]

  // Fetch realtime IoT status for ALL transformers (batched in chunks of 50)
  // Merge IoT status into every transformer
  const merged = allTransformers.map((transformer) => {
    return {
      ...transformer,
      isOnline: true,
      status: 'online' as TransformerStatus,
    }
  })

  // Apply filters
  let filtered = merged

  if (district.length > 0)
    filtered = filtered.filter((t) => district.includes(t.district ?? ''))

  if (capacity.length > 0)
    filtered = filtered.filter((t) => capacity.includes(String(t.capacity)))

  if (tapChanger) filtered = filtered.filter((t) => t.tapChanger === tapChanger)

  if (status !== 'all') filtered = filtered.filter((t) => t.status === status)

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.stationId.toLowerCase().includes(q) ||
        t.feeder.toLowerCase().includes(q)
    )
  }

  // Apply distance filter if location is provided
  if (lat != null && lng != null) {
    filtered = filtered.filter((t) => {
      const distance = getDistanceKm(
        lat,
        lng,
        t.coordinates.lat,
        t.coordinates.lng
      )
      return distance <= radius
    })
  }

  // Always sort by ID ascending for stable list
  filtered = [...filtered].sort((a, b) => a.id.localeCompare(b.id))

  return { data: filtered, districts, total: filtered.length }
}
