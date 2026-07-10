import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getTransformersForMap } from './service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const district = searchParams.getAll('district')
    const capacity = searchParams.getAll('capacity')
    const search = searchParams.get('search') ?? ''
    const status = searchParams.get('status') ?? 'all'
    const tapChanger = searchParams.get('tapChanger') ?? ''

    const result = await getTransformersForMap({
      capacity,
      district,
      search,
      status,
      tapChanger,
    })
    return NextResponse.json(result)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching transformers for map:', error)
    return NextResponse.json(
      { error: 'Failed to load transformers for map' },
      { status: 500 }
    )
  }
}
