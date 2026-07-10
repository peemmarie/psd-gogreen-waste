import type { SortingState } from '@tanstack/react-table'

import { create } from 'zustand'

import { PAGINATION } from '~/constants/pagination'

type TableStore = {
  filters: Record<string, any>
  pagination: {
    limit: number
    page: number
  }
  resetFilters: () => void
  setFilters: (filters: Record<string, any>) => void
  setPagination: (pagination: Partial<{ limit: number; page: number }>) => void
  setSortings: (sortings: SortingState) => void
  sortings: SortingState
}

export const useTableStore = create<TableStore>((set) => ({
  filters: {},
  pagination: PAGINATION,
  resetFilters: () => set({ filters: {} }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
  setSortings: (sortings) => set({ sortings }),
  sortings: [],
}))
