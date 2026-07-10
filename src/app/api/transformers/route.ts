import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { getTransformers } from './service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.max(1, Number(searchParams.get('limit')) || 10)
    const search = searchParams.get('search') ?? ''
    const district = searchParams.getAll('district')
    const capacity = searchParams.getAll('capacity')

    const result = await getTransformers({
      capacity,
      district,
      limit,
      page,
      search,
      sortBy: searchParams.get('sortBy') ?? 'installation_date',
      sortOrder: searchParams.get('sortOrder') ?? 'desc',
      status: searchParams.get('status') ?? 'all',
      tapChanger: searchParams.get('tapChanger') ?? '',
    })
    return NextResponse.json(result)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching transformers:', error)
    return NextResponse.json(
      { error: 'Failed to load transformers' },
      { status: 500 }
    )
  }
}
