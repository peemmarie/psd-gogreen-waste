import { NextResponse } from 'next/server'

import { iotApi } from '~/lib/axios/iot-api'
import {
  type ThingworxHistoryRow,
  type ThingworxResponse,
} from '~/types/transformer'

export type TrendRow = { time: string; totalPower: number }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ transformerId: string }> }
) {
  try {
    const { transformerId } = await params

    // Build yesterday's date range in UTC+7 (Asia/Bangkok): 00:15 → 23:59
    const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000
    const nowBangkok = new Date(Date.now() + BANGKOK_OFFSET_MS)
    // "yesterday" in Bangkok
    const yesterdayBangkok = new Date(nowBangkok)
    yesterdayBangkok.setUTCDate(yesterdayBangkok.getUTCDate() - 1)

    const isMinuteBased = /^(WL|BR|SD)/.test(transformerId)
    const intervalMs = isMinuteBased ? 60 * 1000 : 15 * 60 * 1000

    const start = new Date(yesterdayBangkok)
    start.setUTCHours(0, isMinuteBased ? 1 : 15, 0, 0)
    const startDate = start.getTime() - BANGKOK_OFFSET_MS // convert back to real UTC ms

    const end = new Date(yesterdayBangkok)
    end.setUTCHours(23, 59, 0, 0)
    const endDate = end.getTime() - BANGKOK_OFFSET_MS // convert back to real UTC ms
    const maxItems = Math.floor((endDate - startDate) / intervalMs)

    const json: ThingworxResponse<ThingworxHistoryRow> = await iotApi.post(
      `/${transformerId}/Services/GetElectricalHistoryAPI`,
      { endDate, maxItems, startDate }
    )

    const rawData: ThingworxHistoryRow[] =
      json.rows || (json as unknown as ThingworxHistoryRow[])

    const HALF_INTERVAL = intervalMs / 2
    const trendData: TrendRow[] = []

    for (let t = startDate; t <= endDate; t += intervalMs) {
      const matchedRow = rawData.find(
        (row) => Math.abs(row.timestamp - t) <= HALF_INTERVAL
      )
      const row = matchedRow || ({ timestamp: t } as ThingworxHistoryRow)

      const totalPower =
        (Number(row.activePower_L1_Ins) || 0) +
        (Number(row.activePower_L2_Ins) || 0) +
        (Number(row.activePower_L3_Ins) || 0)

      const time = new Date(t).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok',
      })

      trendData.push({ time, totalPower: Number(totalPower.toFixed(3)) })
    }

    return NextResponse.json(trendData)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching trend data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    )
  }
}
