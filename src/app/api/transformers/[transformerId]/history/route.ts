import { NextResponse } from 'next/server'

import { iotApi } from '~/lib/axios/iot-api'
import {
  type ThingworxHistoryRow,
  type ThingworxResponse,
} from '~/types/transformer'

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
}

const MAX_THINGWORX_ITEMS_PER_REQUEST = 360

export async function POST(
  request: Request,
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

    const body = await request.json()

    const intervalMs = getIntervalMs(transformerId, body.intervalMs)
    const rawData = await fetchHistoryRows(
      transformerId,
      {
        endDate: body.endDate,
        maxItems: body.maxItems,
        startDate: body.startDate,
      },
      intervalMs
    )

    // We'll search for the closest data point within a +/- half window
    // to map Thingworx data strictly into our intervals.
    const HALF_INTERVAL = intervalMs / 2

    const historyData: Record<string, unknown>[] = []

    // Generate strict intervals between startDate and endDate
    const { endDate, startDate } = body
    for (let t = startDate; t <= endDate; t += intervalMs) {
      // Find a row from Thingworx that strictly belongs to this bucket
      const matchedRow = rawData.find(
        (row) => Math.abs(row.timestamp - t) <= HALF_INTERVAL
      )
      const row = matchedRow || ({ timestamp: t } as ThingworxHistoryRow)
      const activePowerL1 = Number(row.activePower_L1_Ins) || 0
      const activePowerL2 = Number(row.activePower_L2_Ins) || 0
      const activePowerL3 = Number(row.activePower_L3_Ins) || 0

      const reactivePowerL1 = Number(row.reactivePower_L1_Ins) || 0
      const reactivePowerL2 = Number(row.reactivePower_L2_Ins) || 0
      const reactivePowerL3 = Number(row.reactivePower_L3_Ins) || 0

      const currentL1 = Number(row.current_L1_Ins) || 0
      const currentL2 = Number(row.current_L2_Ins) || 0
      const currentL3 = Number(row.current_L3_Ins) || 0

      const voltageL1 = Number(row.voltage_L1_Ins) || 0
      const voltageL2 = Number(row.voltage_L2_Ins) || 0
      const voltageL3 = Number(row.voltage_L3_Ins) || 0

      const totalPower = activePowerL1 + activePowerL2 + activePowerL3
      const totalReactive = reactivePowerL1 + reactivePowerL2 + reactivePowerL3

      const date = new Date(t) // Guaranteed 15 min interval
      const timeFormatOpts: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok',
      }
      const timeStr = date.toLocaleTimeString('th-TH', timeFormatOpts)
      const time = `${date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Bangkok' })} ${timeStr}`

      historyData.push({
        phaseA: {
          current: Number(currentL1.toFixed(3)),
          power: Number(activePowerL1.toFixed(3)),
          reactive: Number(reactivePowerL1.toFixed(3)),
          voltage: Number(voltageL1.toFixed(3)),
        },
        phaseB: {
          current: Number(currentL2.toFixed(3)),
          power: Number(activePowerL2.toFixed(3)),
          reactive: Number(reactivePowerL2.toFixed(3)),
          voltage: Number(voltageL2.toFixed(3)),
        },
        phaseC: {
          current: Number(currentL3.toFixed(3)),
          power: Number(activePowerL3.toFixed(3)),
          reactive: Number(reactivePowerL3.toFixed(3)),
          voltage: Number(voltageL3.toFixed(3)),
        },
        time,
        timestamp: t,
        totalPower: Number(totalPower.toFixed(3)),
        totalReactive: Number(totalReactive.toFixed(3)),
        // The Recharts area chart in demand-chart.tsx uses dataKey="value"
        value: Number(totalPower.toFixed(3)),
      })
    }

    return NextResponse.json(historyData, { headers: NO_STORE_HEADERS })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching demand history:', error)

    // Forward the upstream error details for easier debugging
    const axiosError = error as {
      message?: string
      response?: { data?: unknown; status?: number }
    }
    const upstreamStatus = axiosError.response?.status
    const upstreamData = axiosError.response?.data

    return NextResponse.json(
      {
        error: 'Failed to fetch demand history',
        message: axiosError.message,
        upstream: upstreamData ?? null,
        upstreamStatus: upstreamStatus ?? null,
      },
      { status: 500 }
    )
  }
}

async function fetchHistoryRows(
  transformerId: string,
  body: { endDate: number; maxItems: number; startDate: number },
  intervalMs: number
) {
  const startDate = Number(body.startDate)
  const endDate = Number(body.endDate)

  if (!Number.isFinite(startDate) || !Number.isFinite(endDate)) {
    const json: ThingworxResponse<ThingworxHistoryRow> = await iotApi.post(
      `/${transformerId}/Services/GetElectricalHistoryAPI`,
      body
    )

    return json.rows ?? []
  }

  const rows: ThingworxHistoryRow[] = []
  const chunkSpanMs = intervalMs * (MAX_THINGWORX_ITEMS_PER_REQUEST - 1)

  for (
    let chunkStart = startDate;
    chunkStart <= endDate;
    chunkStart += chunkSpanMs + intervalMs
  ) {
    const chunkEnd = Math.min(endDate, chunkStart + chunkSpanMs)
    const maxItems = Math.floor((chunkEnd - chunkStart) / intervalMs) + 1

    const json: ThingworxResponse<ThingworxHistoryRow> = await iotApi.post(
      `/${transformerId}/Services/GetElectricalHistoryAPI`,
      {
        ...body,
        endDate: chunkEnd,
        maxItems,
        startDate: chunkStart,
      }
    )

    rows.push(...(json.rows ?? []))
  }

  return rows.sort((a, b) => a.timestamp - b.timestamp)
}

function getIntervalMs(transformerId: string, intervalMs: unknown) {
  const parsedIntervalMs = Number(intervalMs)

  if (Number.isFinite(parsedIntervalMs) && parsedIntervalMs > 0) {
    return parsedIntervalMs
  }

  return /^(WL|BR|SD)/.test(transformerId) ? 60 * 1000 : 15 * 60 * 1000
}
