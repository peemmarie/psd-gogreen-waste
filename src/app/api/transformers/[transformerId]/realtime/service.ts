import { iotApi } from '~/lib/axios/iot-api'
import {
  type ThingworxRealtimeRow,
  type ThingworxResponse,
  type TransformerReading,
} from '~/types/transformer'

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getRealtimeReading(
  transformerId: string
): Promise<TransformerReading> {
  const propertyNames = {
    items: [
      'name',
      'lastPayload',
      'LatLong',
      'lastDataTimestamp',
      'deviceOnline',

      'activePower_Total_Ins',
      'activePower_L1_Ins',
      'activePower_L2_Ins',
      'activePower_L3_Ins',

      'reactivePower_Total_Ins',
      'reactivePower_L1_Ins',
      'reactivePower_L2_Ins',
      'reactivePower_L3_Ins',

      'current_L1_Ins',
      'current_L2_Ins',
      'current_L3_Ins',

      'voltage_L1_Ins',
      'voltage_L2_Ins',
      'voltage_L3_Ins',

      'trRated',
      'stationID',
      'feederID',
    ],
  }

  const json: ThingworxResponse<ThingworxRealtimeRow> = await iotApi.post(
    `/${transformerId}/Services/GetNamedPropertiesAPI`,
    { propertyNames }
  )

  const data = json.rows?.[0] || ({} as ThingworxRealtimeRow)

  return buildReading(transformerId, data)
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function buildReading(
  transformerId: string,
  data: ThingworxRealtimeRow
): TransformerReading {
  const activePowerL1 = format(data.activePower_L1_Ins)
  const activePowerL2 = format(data.activePower_L2_Ins)
  const activePowerL3 = format(data.activePower_L3_Ins)

  const reactivePowerL1 = format(data.reactivePower_L1_Ins)
  const reactivePowerL2 = format(data.reactivePower_L2_Ins)
  const reactivePowerL3 = format(data.reactivePower_L3_Ins)

  const totalActivePower = format(data.activePower_Total_Ins)
  const totalReactivePower = format(data.reactivePower_Total_Ins)
  const apparentPower = calculateApparentPower(
    totalActivePower,
    totalReactivePower
  )

  const apparentPowerL1 = calculateApparentPower(activePowerL1, reactivePowerL1)
  const apparentPowerL2 = calculateApparentPower(activePowerL2, reactivePowerL2)
  const apparentPowerL3 = calculateApparentPower(activePowerL3, reactivePowerL3)

  const powerFactorL1 = format(
    apparentPowerL1 > 0 ? Math.abs(activePowerL1) / apparentPowerL1 : 0
  )
  const powerFactorL2 = format(
    apparentPowerL2 > 0 ? Math.abs(activePowerL2) / apparentPowerL2 : 0
  )
  const powerFactorL3 = format(
    apparentPowerL3 > 0 ? Math.abs(activePowerL3) / apparentPowerL3 : 0
  )

  const powerFactor = format(
    apparentPower > 0 ? Math.abs(totalActivePower) / apparentPower : 0
  )

  const trRated = Number(data.trRated) || 0
  const loadPercentage =
    trRated > 0 ? Number(((apparentPower / trRated) * 100).toFixed(1)) : null

  const quadrant = getPowerQuadrant(totalActivePower, totalReactivePower)
  const isImport = totalActivePower >= 0
  const isInductive = totalReactivePower >= 0

  return {
    activePower: totalActivePower,
    apparentPower,
    energy: 0, // not available in realtime payload
    frequency: Number(data?.frequency) || 0,
    isImport,
    isInductive,
    isOnline: data.deviceOnline ?? false,
    latestDataTimestamp: getLatestDataTimestamp(data),
    loadPercentage,
    phaseA: {
      activePower: activePowerL1,
      current: format(data.current_L1_Ins),
      powerFactor: powerFactorL1,
      reactivePower: reactivePowerL1,
      voltage: format(data.voltage_L1_Ins),
    },
    phaseB: {
      activePower: activePowerL2,
      current: format(data.current_L2_Ins),
      powerFactor: powerFactorL2,
      reactivePower: reactivePowerL2,
      voltage: format(data.voltage_L2_Ins),
    },
    phaseC: {
      activePower: activePowerL3,
      current: format(data.current_L3_Ins),
      powerFactor: powerFactorL3,
      reactivePower: reactivePowerL3,
      voltage: format(data.voltage_L3_Ins),
    },
    powerFactor,
    quadrant,
    reactivePower: totalReactivePower,
    timestamp: data.lastDataTimestamp
      ? new Date(data.lastDataTimestamp)
      : new Date(),
    transformerId,
  }
}

/** Calculate apparent power using S = sqrt(P^2 + Q^2). */
function calculateApparentPower(activePower: number, reactivePower: number) {
  return format(Math.hypot(activePower, reactivePower))
}

/** Round a raw numeric value to 3 decimal places. */
function format(val: unknown) {
  return Number((Number(val) || 0).toFixed(3))
}

function getLatestDataTimestamp(data: ThingworxRealtimeRow) {
  if (data.lastDataTimestamp) return new Date(data.lastDataTimestamp)

  if (data.lastPayload) {
    const parsedTimestamp = Date.parse(data.lastPayload)
    if (Number.isFinite(parsedTimestamp)) return new Date(parsedTimestamp)
  }

  return null
}

/**
 * Determine the IEC power quadrant from the signs of active and reactive power.
 *
 * | P  | Q  | Quadrant | Meaning              |
 * |----|----|----------|----------------------|
 * | +  | +  | Q1       | Import, Inductive    |
 * | -  | +  | Q2       | Export, Inductive    |
 * | -  | -  | Q3       | Export, Capacitive   |
 * | +  | -  | Q4       | Import, Capacitive   |
 */
function getPowerQuadrant(
  activePower: number,
  reactivePower: number
): TransformerReading['quadrant'] {
  if (activePower >= 0 && reactivePower >= 0) return 'Q1'
  if (activePower < 0 && reactivePower >= 0) return 'Q2'
  if (activePower < 0 && reactivePower < 0) return 'Q3'
  return 'Q4'
}
