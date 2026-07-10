/**
 * Meter Dashboard Types
 * Types and interfaces for electricity meter monitoring at distribution transformers
 */

/** Historical reading data point for charts */
export type ChartDataPoint = {
  /** Phase A value */
  phaseA: number
  /** Phase B value */
  phaseB: number
  /** Phase C value */
  phaseC: number
  /** Timestamp */
  time: string
}

/** Single-phase electrical measurements */
export type PhaseData = {
  /** Active power (kW) */
  activePower: number
  /** Current (A) */
  current: number
  /** Power factor */
  powerFactor?: number
  /** Reactive power (kVAR) */
  reactivePower: number
  /** Voltage (V) */
  voltage: number
}

/** IEC power quadrant derived from signs of active and reactive power */
export type PowerQuadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4'

/** Expected structure from Thingworx History API */
export type ThingworxHistoryRow = {
  activePower_L1_Ins?: number
  activePower_L2_Ins?: number
  activePower_L3_Ins?: number
  activePower_Total_Ins?: number
  apparentPower_L1_Ins?: number
  apparentPower_L2_Ins?: number
  apparentPower_L3_Ins?: number
  apparentPower_Total_Ins?: number
  current_L1_Ins?: number
  current_L2_Ins?: number
  current_L3_Ins?: number
  reactivePower_L1_Ins?: number
  reactivePower_L2_Ins?: number
  reactivePower_L3_Ins?: number
  reactivePower_Total_Ins?: number
  timestamp: number
  voltage_L1_Ins?: number
  voltage_L2_Ins?: number
  voltage_L3_Ins?: number
}

/** Expected structure from Thingworx Realtime API */
export type ThingworxRealtimeRow = {
  deviceOnline?: boolean
  feederID?: string
  frequency?: number
  lastDataTimestamp?: number
  lastPayload?: string
  LatLong?: string
  name?: string
  stationID?: string
  trRated?: number
} & ThingworxHistoryRow

/** Generic Thingworx Response */
export type ThingworxResponse<T> = {
  rows?: T[]
}

/** Basic transformer information */
export type Transformer = {
  /** Transformer brand */
  brand: string
  /** Transformer capacity (kVA) */
  capacity: number
  /** Geographic coordinates */
  coordinates: TransformerLocation
  /** Phase configuration */
  ctRatio: string
  /** Electric district */
  district?: string
  /** Associated transformer name/ID */
  feeder: string
  /** Unique transformer identifier */
  id: string
  /** Installation date */
  installationDate: Date | null
  /** Transformer installation type */
  installationType: string
  /** Last successful reading timestamp */
  lastReadingTime: Date
  /** Current load percentage relative to capacity */
  loadPercentage?: number
  /** Primary voltage (kV) */
  primaryVoltage: number
  /** Secondary voltage (V) */
  secondaryVoltage: number
  /** Serial number */
  serialNumber: string
  /** Transformer display name */
  stationId: string
  /** Current connection status */
  status: TransformerStatus
  /** Whether the transformer has an On-Load Tap Changer (OLTC) */
  tapChanger: string
}

/** Geographic coordinates for transformer location */
export type TransformerLocation = {
  /** Latitude */
  lat: number
  /** Longitude */
  lng: number
}

/** Complete transformer reading with all electrical parameters */
export type TransformerReading = {
  /** Active power (kW) — positive = import, negative = export */
  activePower: number
  /** Apparent power (kVA) */
  apparentPower: number
  /** Cumulative energy (kWh) */
  energy: number
  /** Frequency (Hz) */
  frequency: number
  /** True when active power is flowing into the grid (P ≥ 0) */
  isImport: boolean
  /** True when reactive power is inductive (Q ≥ 0) */
  isInductive: boolean
  /** Online status */
  isOnline: boolean
  /** Latest data timestamp */
  latestDataTimestamp: Date | null
  /** Load percentage relative to rated capacity (null if trRated unknown) */
  loadPercentage: null | number
  /** Phase A measurements */
  phaseA: PhaseData
  /** Phase B measurements */
  phaseB: PhaseData
  /** Phase C measurements */
  phaseC: PhaseData
  /** Power factor */
  powerFactor: number
  /** IEC power quadrant (Q1–Q4) derived from signs of P and Q */
  quadrant: PowerQuadrant
  /** Reactive power (kVAR) — positive = inductive, negative = capacitive */
  reactivePower: number
  /** Reading timestamp */
  timestamp: Date
  /** Associated transformer ID */
  transformerId: string
}

/** Transformer connection status */
export type TransformerStatus = 'offline' | 'online'

/** Summary statistics for dashboard cards */
export type TransformerSummary = {
  /** Average load across online transformers (kW) */
  averageLoad: number
  /** Maximum load observed on any single transformer (kW) */
  maxLoad: number
  /** Number of offline transformers */
  offline: number
  /** Number of online transformers */
  online: number
  /** Total number of transformers */
  total: number
  /** Total apparent power (kVA) */
  totalApparentPower: number
  /** System utilization factor (%) */
  utilizationFactor: number
}
