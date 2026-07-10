const SQRT3 = Math.sqrt(3)

export function ratedPhaseActivePower(capacityKva: number): number {
  return capacityKva / 3
}

export function ratedPhaseCurrent(
  capacityKva: number,
  voltageV: number
): number {
  return (capacityKva * 1000) / (SQRT3 * voltageV)
}

export function ratedPhaseReactivePower(capacityKva: number): number {
  return capacityKva / 3
}

export function transformerNominals(
  capacityKva: number,
  secondaryVoltage: number
) {
  return {
    current: ratedPhaseCurrent(capacityKva, secondaryVoltage),
    power: ratedPhaseActivePower(capacityKva),
    reactive: ratedPhaseReactivePower(capacityKva),
    totalPower: capacityKva,
    totalReactive: capacityKva,
    voltage: secondaryVoltage,
  }
}
