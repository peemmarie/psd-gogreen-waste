/** Generic paginated API response */
export type PaginatedResponse<T> = {
  data: T[]
  total: number
  totalUnfiltered?: number
}
