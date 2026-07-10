import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getTransformersGeoJson } from './service'

/**
 * GET /api/transformers/map/geojson
 *
 * Returns all visible transformers as a GeoJSON FeatureCollection.
 * Accepts optional query params: `district`, `search`, `sort`.
 *
 * @example
 * GET /api/transformers/map/geojson?district=%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A2&search=BKT&sort=id-asc
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const district = searchParams.get('district') ?? ''
    const search = searchParams.get('search') ?? ''
    const sort = searchParams.get('sort') ?? 'id-asc'

    const featureCollection = await getTransformersGeoJson({
      district,
      search,
      sort,
    })

    return NextResponse.json(featureCollection, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Content-Type': 'application/geo+json',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating transformer GeoJSON:', error)
    return NextResponse.json(
      { error: 'Failed to generate transformer GeoJSON' },
      { status: 500 }
    )
  }
}
