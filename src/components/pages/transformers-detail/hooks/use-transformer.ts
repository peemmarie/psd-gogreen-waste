import { useQuery } from '@tanstack/react-query'

import {
  getCurrentHistory,
  getDemandHistory,
  getTransformerById,
  getTransformerReading,
  getVoltageHistory,
} from '~/lib/mock-data'

export function useTransformer(id: string) {
  return useQuery({
    queryFn: async () => {
      // Simulate network delay

      const meter = getTransformerById(id)
      if (!meter) throw new Error('Transformer not found')

      const reading = getTransformerReading(id)
      const voltageHistory = getVoltageHistory(id, 24)
      const currentHistory = getCurrentHistory(id, 24)
      const demandHistory = getDemandHistory(id, 24)

      return {
        currentHistory,
        demandHistory,
        meter,
        reading,
        voltageHistory,
      }
    },
    queryKey: ['transformer', id],
  })
}
