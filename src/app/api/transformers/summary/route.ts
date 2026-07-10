import { NextResponse } from 'next/server'

import { getTransformerSummary } from '../service'

export async function GET() {
  try {
    const summary = await getTransformerSummary()
    return NextResponse.json(summary)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching transformer summary:', error)
    return NextResponse.json(
      { error: 'Failed to load transformer summary' },
      { status: 500 }
    )
  }
}
