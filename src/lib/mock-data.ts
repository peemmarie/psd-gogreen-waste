/**
 * Mock Data Service for Meter Dashboard
 * Provides sample data for development and demo purposes
 */

import type {
  ChartDataPoint,
  Transformer,
  TransformerReading,
  TransformerSummary,
} from '~/types/transformer'

/** Sample transformer data - Distribution transformers in Bangkok area */
export const mockTransformers: Transformer[] = [
  {
    brand: 'Ekarat',
    capacity: 160,
    coordinates: { lat: 13.7649, lng: 100.6422 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Bang Kapi',
    feeder: 'TR-BKP-001',
    id: 'KTT0001',
    installationDate: new Date('2020-01-15'),
    installationType: 'Distribution Transformer Oil Type',
    lastReadingTime: new Date('2026-01-20T13:30:00'),
    loadPercentage: 45,
    primaryVoltage: 22,
    secondaryVoltage: 400,
    serialNumber: 'EKR-2020-001',
    stationId: 'KTT0001',
    status: 'online',
    tapChanger: 'manual',
  },
  {
    brand: 'Tirathai',
    capacity: 250,
    coordinates: { lat: 13.8169, lng: 100.5614 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Lat Phrao',
    feeder: 'TR-LPR-002',
    id: 'KTT0002',
    installationDate: new Date('2019-05-20'),
    installationType: 'Amorphous Metal Distribution Transformer',
    lastReadingTime: new Date('2026-01-20T13:28:00'),
    primaryVoltage: 24,
    secondaryVoltage: 416,
    serialNumber: 'TRT-2019-045',
    stationId: 'KTT0002',
    status: 'online',
    tapChanger: 'manual',
  },
  {
    brand: 'Charoenchai',
    capacity: 160,
    coordinates: { lat: 13.7578, lng: 100.6241 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Khlong Toei',
    feeder: 'TR-RKH-001',
    id: 'KTT0003',
    installationDate: new Date('2021-03-10'),
    installationType: 'Hermetically Sealed Oil Type',
    lastReadingTime: new Date('2026-01-20T10:15:00'),
    primaryVoltage: 22,
    secondaryVoltage: 400,
    serialNumber: 'CNC-2021-089',
    stationId: 'KTT0003',
    status: 'offline',
    tapChanger: 'manual',
  },
  {
    brand: 'QTC',
    capacity: 500,
    coordinates: { lat: 13.7321, lng: 100.5831 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Khlong Toei',
    feeder: 'TR-SKV-001',
    id: 'KTT0004',
    installationDate: new Date('2018-11-05'),
    installationType: 'Cast Resin Transformer',
    lastReadingTime: new Date('2026-01-20T13:29:00'),
    primaryVoltage: 22,
    secondaryVoltage: 400,
    serialNumber: 'QTC-2018-112',
    stationId: 'KTT0004',
    status: 'online',
    tapChanger: 'manual',
  },
  {
    brand: 'Ekarat',
    capacity: 160,
    coordinates: { lat: 13.7572, lng: 100.5684 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Din Daeng',
    feeder: 'TR-PR9-001',
    id: 'KTT0005',
    installationDate: new Date('2020-08-12'),
    installationType: 'Distribution Transformer Oil Type',
    lastReadingTime: new Date('2026-01-20T13:31:00'),
    primaryVoltage: 22,
    secondaryVoltage: 400,
    serialNumber: 'EKR-2020-156',
    stationId: 'KTT0005',
    status: 'online',
    tapChanger: 'manual',
  },
  {
    brand: 'Tirathai',
    capacity: 100,
    coordinates: { lat: 13.7061, lng: 100.6014 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Phra Khanong',
    feeder: 'TR-ONN-001',
    id: 'KTT0006',
    installationDate: new Date('2022-02-28'),
    installationType: 'Amorphous Metal Distribution Transformer',
    lastReadingTime: new Date('2026-01-20T08:45:00'),
    primaryVoltage: 24,
    secondaryVoltage: 416,
    serialNumber: 'TRT-2022-033',
    stationId: 'KTT0006',
    status: 'offline',
    tapChanger: 'manual',
  },
  {
    brand: 'Charoenchai',
    capacity: 315,
    coordinates: { lat: 13.6693, lng: 100.6044 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Bang Na',
    feeder: 'TR-BNA-001',
    id: 'KTT0007',
    installationDate: new Date('2019-12-15'),
    installationType: 'Hermetically Sealed Oil Type',
    lastReadingTime: new Date('2026-01-20T13:25:00'),
    primaryVoltage: 22,
    secondaryVoltage: 400,
    serialNumber: 'CNC-2019-210',
    stationId: 'KTT0007',
    status: 'online',
    tapChanger: 'manual',
  },
  {
    brand: 'QTC',
    capacity: 250,
    coordinates: { lat: 13.6882, lng: 100.6099 },
    ctRatio: '3-Phase 4-Wire',
    district: 'Bang Na',
    feeder: 'TR-UDS-001',
    id: 'KTT0008',
    installationDate: new Date('2021-06-20'),
    installationType: 'Cast Resin Transformer',
    lastReadingTime: new Date('2026-01-20T13:30:00'),
    primaryVoltage: 22,
    secondaryVoltage: 400,
    serialNumber: 'QTC-2021-078',
    stationId: 'KTT0008',
    status: 'online',
    tapChanger: 'manual',
  },
]

// Generate 500 random transformers for clustering test
function generateMockTransformers(count: number): Transformer[] {
  const transformers: Transformer[] = [...mockTransformers]
  const baseLat = 13.7563
  const baseLng = 100.5018
  const districts = [
    'Khlong Toei',
    'Bang Kapi',
    'Lat Phrao',
    'Din Daeng',
    'Phra Khanong',
    'Bang Na',
  ]

  for (let i = 0; i < count; i++) {
    const isOnline = Math.random() > 0.2
    const idx = i + 1
    transformers.push({
      brand: 'Ekarat',
      capacity: 160,
      coordinates: {
        lat: baseLat + (Math.random() - 0.5) * 0.2,
        lng: baseLng + (Math.random() - 0.5) * 0.2,
      },
      ctRatio: '3-Phase 4-Wire',
      district: districts[Math.floor(Math.random() * districts.length)],
      feeder: `TR-GEN-${idx}`,
      id: `KTT-GEN-${idx}`,
      installationDate: new Date('2022-01-01'),
      installationType: 'Distribution Transformer Oil Type',
      lastReadingTime: new Date(),
      loadPercentage: Math.floor(Math.random() * 100),
      primaryVoltage: 22,
      secondaryVoltage: 400,
      serialNumber: `EKR-GEN-${idx}`,
      stationId: `KTT-GEN-${idx}`,
      status: isOnline ? 'online' : 'offline',
      tapChanger: 'manual',
    })
  }
  return transformers
}

export const allTransformers = generateMockTransformers(500)

/** Get all transformers */
export function getAllTransformers(): Transformer[] {
  return allTransformers
}

/** Generate historical current data for charts */
export function getCurrentHistory(
  _transformerId: string,
  hours: number = 24
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()
  const baseCurrent = 150

  // Simulate daily load pattern
  for (let i = hours * 4; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60 * 1000)
    const hour = time.getHours()

    // Higher load during business hours (8-18)
    const loadFactor = hour >= 8 && hour <= 18 ? 1.2 : 0.7

    data.push({
      phaseA: randomVariation(baseCurrent * loadFactor, 20),
      phaseB: randomVariation(baseCurrent * loadFactor, 20),
      phaseC: randomVariation(baseCurrent * loadFactor, 20),
      time: time.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })
  }

  return data
}

/** Generate historical demand data for charts */
export function getDemandHistory(
  _transformerId: string,
  _hours: number = 24
): { time: string; value: number }[] {
  const data: { time: string; value: number }[] = []
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const baseDemand = 90 // Base demand in kW

  // Generate 96 intervals (15 mins) for 00:00 to 23:45
  for (let i = 0; i < 96; i++) {
    const time = new Date(startOfDay.getTime() + i * 15 * 60 * 1000)
    const hour = time.getHours()

    // Higher demand during business hours (8-18)
    const loadFactor = hour >= 8 && hour <= 18 ? 1.3 : 0.6

    // Add some random variation dependent on time index to make it look consistent but varied
    const variation = Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 10

    data.push({
      time: time.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: Math.max(0, baseDemand * loadFactor + variation),
    })
  }

  return data
}

/** Get single transformer by ID */
export function getTransformerById(id: string): Transformer | undefined {
  return allTransformers.find((m) => m.id === id)
}

/** Get current transformer reading with realistic values */
export function getTransformerReading(
  transformerId: string
): TransformerReading {
  const baseVoltage = 240 // 240V system
  const baseCurrent = 150 // 150A typical load
  const basePower = 90 // 90 kW

  return {
    activePower: randomVariation(basePower, 10),
    apparentPower: randomVariation(95, 12),
    energy: Number((1234567 + Math.random() * 100).toFixed(3)),
    frequency: randomVariation(50, 0.1),
    isImport: true,
    isInductive: true,
    isOnline: false,
    latestDataTimestamp: new Date(),
    loadPercentage: 45,
    phaseA: {
      activePower: randomVariation(basePower / 3, 3),
      current: randomVariation(baseCurrent, 15),
      reactivePower: randomVariation(10, 2),
      voltage: randomVariation(baseVoltage, 5),
    },
    phaseB: {
      activePower: randomVariation(basePower / 3, 3),
      current: randomVariation(baseCurrent, 15),
      reactivePower: randomVariation(10, 2),
      voltage: randomVariation(baseVoltage, 5),
    },
    phaseC: {
      activePower: randomVariation(basePower / 3, 3),
      current: randomVariation(baseCurrent, 15),
      reactivePower: randomVariation(10, 2),
      voltage: randomVariation(baseVoltage, 5),
    },
    powerFactor: randomVariation(0.95, 0.03),
    quadrant: 'Q1',
    reactivePower: randomVariation(30, 5),
    timestamp: new Date(),
    transformerId,
  }
}

/** Filter transformers by status */
export function getTransformersByStatus(
  status: 'offline' | 'online'
): Transformer[] {
  return allTransformers.filter((m) => m.status === status)
}

/** Get summary statistics for dashboard cards */
export function getTransformerSummary(): TransformerSummary {
  const online = allTransformers.filter((m) => m.status === 'online').length
  const total = allTransformers.length

  // Calculate load metrics only for online transformers
  const onlineTransformers = allTransformers.filter(
    (m) => m.status === 'online'
  )

  let totalApparentPower = 0
  let maxLoad = 0

  if (onlineTransformers.length > 0) {
    const loads = onlineTransformers.map(() => {
      // Return a random load between 50kW and 120kW
      return 90 + (Math.random() - 0.5) * 60
    })

    totalApparentPower = loads.reduce((sum, load) => sum + load, 0)
    maxLoad = Math.max(...loads)
  }

  const averageLoad = online > 0 ? totalApparentPower / online : 0

  // Assuming 160 kVA as standard transformer capacity
  // Utilization Factor = (Total Load / Total Capacity) * 100
  // Total Capacity = online * 160
  const totalCapacity = online * 160
  const utilizationFactor =
    totalCapacity > 0 ? (totalApparentPower / totalCapacity) * 100 : 0

  return {
    averageLoad,
    maxLoad,
    offline: total - online,
    online,
    total,
    totalApparentPower,
    utilizationFactor,
  }
}

/** Generate historical voltage data for charts */
export function getVoltageHistory(
  _transformerId: string,
  hours: number = 24
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()
  const baseVoltage = 240

  for (let i = hours * 4; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60 * 1000) // 15-minute intervals
    data.push({
      phaseA: randomVariation(baseVoltage, 8),
      phaseB: randomVariation(baseVoltage, 8),
      phaseC: randomVariation(baseVoltage, 8),
      time: time.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })
  }

  return data
}

/** Generate random variation within a range */
function randomVariation(base: number, variance: number): number {
  return Number((base + (Math.random() - 0.5) * 2 * variance).toFixed(3))
}
