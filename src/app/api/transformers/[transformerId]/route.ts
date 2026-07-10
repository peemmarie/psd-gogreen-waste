import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

import { iotApi } from '~/lib/axios/iot-api'
import {
  type ThingworxRealtimeRow,
  type ThingworxResponse,
  type Transformer,
} from '~/types/transformer'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ transformerId: string }> }
) {
  try {
    const { transformerId } = await params

    const csvPath = path.join(
      process.cwd(),
      'src',
      'assets',
      'files',
      'tlm_properties.csv'
    )

    const content = fs.readFileSync(csvPath, 'utf-8')
    const lines = content.split(/\r?\n/).filter(Boolean)
    const dataLines = lines.slice(1)

    for (const line of dataLines) {
      const cols = splitCsvLine(line)

      const stationId = parseCsvValue(cols[1])
      if (stationId !== transformerId) continue

      const deviceId = parseCsvValue(cols[0])
      if (!deviceId) break

      const feeder = parseCsvValue(cols[2]) ?? ''
      const district = parseCsvValue(cols[3])
      const kva = parseFloat(parseCsvValue(cols[5]) ?? '0') || 0
      const installationType = parseCsvValue(cols[7]) ?? ''
      const latitude = parseFloat(parseCsvValue(cols[8]) ?? '0') || 0
      const longitude = parseFloat(parseCsvValue(cols[9]) ?? '0') || 0
      const meaNo = parseCsvValue(cols[10]) ?? ''
      const installationDateStr = parseCsvValue(cols[14])
      const manufacturer = parseCsvValue(cols[15]) ?? ''
      const ctHighStr = parseCsvValue(cols[17])
      const ctLowStr = parseCsvValue(cols[18])
      const tapChanger = parseCsvValue(cols[19]) ?? 'manual'

      const ctHigh = parseFloat(ctHighStr ?? '0') || 0
      const ctLow = parseFloat(ctLowStr ?? '5') || 5

      const installationDate = installationDateStr
        ? new Date(installationDateStr)
        : new Date()

      // Fetch realtime apparent power to compute load percentage
      let loadPercentage: number | undefined
      try {
        const realtimeJson: ThingworxResponse<ThingworxRealtimeRow> =
          await iotApi.post(`/${deviceId}/Services/GetNamedPropertiesAPI`, {
            propertyNames: {
              items: [
                'activePower_L1_Ins',
                'activePower_L2_Ins',
                'activePower_L3_Ins',
                'reactivePower_L1_Ins',
                'reactivePower_L2_Ins',
                'reactivePower_L3_Ins',
              ],
            },
          })
        const rt =
          realtimeJson.rows?.[0] ||
          (realtimeJson as unknown as ThingworxRealtimeRow)
        const totalActive =
          (Number(rt.activePower_L1_Ins) || 0) +
          (Number(rt.activePower_L2_Ins) || 0) +
          (Number(rt.activePower_L3_Ins) || 0)
        const totalReactive =
          (Number(rt.reactivePower_L1_Ins) || 0) +
          (Number(rt.reactivePower_L2_Ins) || 0) +
          (Number(rt.reactivePower_L3_Ins) || 0)
        const apparentPower = Math.sqrt(totalActive ** 2 + totalReactive ** 2)
        if (kva > 0) {
          loadPercentage = Math.min(
            999,
            Number(((apparentPower / kva) * 100).toFixed(1))
          )
        }
      } catch {
        // Non-critical — leave loadPercentage undefined if realtime fetch fails
      }

      const transformer: Transformer = {
        brand: manufacturer,
        capacity: kva,
        coordinates: { lat: latitude, lng: longitude },
        ctRatio: `${ctHigh}/${ctLow}`,
        district: district ?? undefined,
        feeder,
        id: deviceId,
        installationDate,
        installationType,
        lastReadingTime: new Date(0),
        loadPercentage,
        primaryVoltage: 24,
        secondaryVoltage: 400,
        serialNumber: meaNo,
        stationId,
        status: 'offline',
        tapChanger,
      }

      return NextResponse.json(transformer)
    }

    return NextResponse.json(
      { error: 'Transformer not found' },
      { status: 404 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to load transformer' },
      { status: 500 }
    )
  }
}

function parseCsvValue(raw: null | string | undefined): null | string {
  if (raw === undefined || raw === null) return null
  const trimmed = raw.trim()
  if (trimmed === 'NULL' || trimmed === '') return null
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/""/g, '"').trim()
  }
  return trimmed
}

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
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}
