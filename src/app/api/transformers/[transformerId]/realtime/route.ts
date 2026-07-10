import { NextResponse } from 'next/server'

import { getRealtimeReading } from './service'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  Pragma: 'no-cache',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ transformerId: string }> }
) {
  try {
    const { transformerId } = await params

    if (!transformerId) {
      return NextResponse.json(
        { error: 'Transformer ID is required' },
        { status: 400 }
      )
    }

    const reading = await getRealtimeReading(transformerId)
    return NextResponse.json(reading, { headers: NO_STORE_HEADERS })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching realtime data from Thingworx:', error)

    const axiosError = error as {
      message?: string
      response?: { data?: unknown; status?: number }
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch realtime data',
        message: axiosError.message,
        upstream: axiosError.response?.data ?? null,
        upstreamStatus: axiosError.response?.status ?? null,
      },
      { status: 500 }
    )
  }
}
