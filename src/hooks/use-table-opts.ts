import type { SortingState } from '@tanstack/react-table'

import { useTableStore } from '~/store/table-store'

import { useNavigate } from './use-navigate'

export function useTableOpts(isApi = true) {
  const { navigate } = useNavigate()
  const { setPagination, setSortings } = useTableStore()

  function handleLimitChange(limit: number) {
    setPagination({ limit, page: 1 })
    if (isApi) navigate({ limit, page: 1 })
  }

  function handlePageChange({ page }: { page: number }) {
    setPagination({ page })
    if (isApi) navigate({ page })
  }

  function handlePaginationChange(pagination: { limit: number; page: number }) {
    setPagination(pagination)
    if (isApi) navigate(pagination)
  }

  function handleSortChange(sortings: SortingState) {
    setSortings(sortings)
    if (isApi) navigate({ sortings: formatSorting(sortings) })
  }

  function formatSorting(sortings: SortingState) {
    return sortings.map(({ desc, id }) => `${desc ? '-' : ''}${id}`).join(',')
  }

  return {
    onLimitChange: handleLimitChange,
    onPageChange: handlePageChange,
    onPaginationChange: handlePaginationChange,
    onSortChange: handleSortChange,
  }
}
