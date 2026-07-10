'use client'

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsNativeArrayOf,
  parseAsString,
  useQueryStates,
} from 'nuqs'

export const transformerSearchParams = {
  capacity: parseAsArrayOf(parseAsString).withDefault([]),
  district: parseAsNativeArrayOf(parseAsString).withDefault([]),
  limit: parseAsInteger.withDefault(10),
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
  sortBy: parseAsString.withDefault('installation_date'),
  sortOrder: parseAsString.withDefault('desc'),
  status: parseAsString.withDefault('all'),
  tapChanger: parseAsString.withDefault(''),
}

export function useTransformerSearchParams() {
  return useQueryStates(transformerSearchParams)
}
