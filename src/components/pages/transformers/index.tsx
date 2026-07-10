'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import type { PaginatedResponse } from '~/types/paginated'
import type { Transformer, TransformerSummary } from '~/types/transformer'

import { PageHeader } from '~/components/page-header'
import { TransformerMap } from '~/components/transformer-map'
import { Card, CardContent } from '~/components/ui/card'
import { nextApi } from '~/lib/axios/next-api'

import {
  type TransformerLayoutMode,
  TransformerMonitorWorkspace,
  TransformerStatusCards,
  TransformerTable,
  type TransformerToggleView,
  TransformerViewControls,
} from './components'
import {
  TransformerFilter,
  type TransformerFilterState,
} from './components/transformer-filter'
import { useTransformerSearchParams } from './hooks/use-transformer-search-params'

export function TransformersPage() {
  const [layoutMode, setLayoutMode] = useState<TransformerLayoutMode>('split')
  const [activeView, setActiveView] = useState<TransformerToggleView>('map')
  const [
    {
      capacity,
      district,
      limit,
      page,
      search,
      sortBy,
      sortOrder,
      status,
      tapChanger,
    },
    setParams,
  ] = useTransformerSearchParams()

  const filterState: TransformerFilterState = {
    capacityFilter: capacity,
    districtFilter: district,
    search: search ?? '',
    statusFilter: status,
    tapChangerFilter: tapChanger ?? '',
  }

  const hasActiveFilter =
    search.trim() !== '' ||
    district.length > 0 ||
    capacity.length > 0 ||
    status !== 'all' ||
    tapChanger !== ''

  // Build active chips
  const activeChips: { key: string; label: string; onRemove: () => void }[] = []
  if (search.trim()) {
    activeChips.push({
      key: 'search',
      label: `"${search.trim()}"`,
      onRemove: () => setParams({ page: 1, search: '' }),
    })
  }

  if (district.length > 0) {
    for (const d of district) {
      activeChips.push({
        key: `district-${d}`,
        label: d,
        onRemove: () =>
          setParams({
            district: district.filter((v) => v !== d),
            page: 1,
          }),
      })
    }
  }

  if (capacity.length > 0) {
    for (const cap of capacity) {
      activeChips.push({
        key: `capacity-${cap}`,
        label: `${cap} kVA`,
        onRemove: () =>
          setParams({
            capacity: capacity.filter((v) => v !== cap),
            page: 1,
          }),
      })
    }
  }

  if (tapChanger !== '') {
    activeChips.push({
      key: 'tapChanger',
      label: `Tap Changer: ${tapChanger === 'manual' ? 'Manual' : 'OLTC'}`,
      onRemove: () => setParams({ page: 1, tapChanger: '' }),
    })
  }

  if (status !== 'all') {
    activeChips.push({
      key: 'status',
      label: `สถานะ: ${status === 'online' ? 'ออนไลน์' : 'ออฟไลน์'}`,
      onRemove: () => setParams({ page: 1, status: 'all' }),
    })
  }

  function handleFilterChange(next: Partial<TransformerFilterState>) {
    const updates: Partial<{
      capacity: string[]
      district: string[]
      limit: number
      page: number
      search: string
      status: string
      tapChanger: string
    }> = { page: 1 }

    if ('search' in next) updates.search = next.search
    if ('districtFilter' in next) updates.district = next.districtFilter
    if ('capacityFilter' in next) updates.capacity = next.capacityFilter
    if ('tapChangerFilter' in next) updates.tapChanger = next.tapChangerFilter
    if ('statusFilter' in next) updates.status = next.statusFilter

    setParams(updates)
  }

  function resetFilters() {
    setParams({
      capacity: [],
      district: [],
      limit: 10,
      page: 1,
      search: '',
      status: 'all',
      tapChanger: '',
    })
  }

  const {
    data: result,
    isError,
    isLoading,
  } = useQuery<PaginatedResponse<Transformer>>({
    queryFn: () =>
      nextApi.get('/transformers', {
        params: {
          capacity,
          district,
          limit,
          page,
          search,
          sortBy,
          sortOrder,
          status,
          tapChanger,
        },
      }),
    queryKey: [
      'transformers',
      {
        capacity,
        district,
        limit,
        page,
        search,
        sortBy,
        sortOrder,
        status,
        tapChanger,
      },
    ],
  })

  // const { data: summary } = useQuery<TransformerSummary>({
  //   queryFn: () => nextApi.get('/transformers/summary'),
  //   queryKey: ['transformers-summary'],
  // })

  // const defaultSummary: TransformerSummary = {
  //   averageLoad: 0,
  //   maxLoad: 0,
  //   offline: 0,
  //   online: 0,
  //   total: 0,
  //   totalApparentPower: 0,
  //   utilizationFactor: 0,
  // }

  return (
    <div className="space-y-6">
      <PageHeader
        description="สถานะ ตำแหน่ง และข้อมูลหม้อแปลงจำหน่ายของ กฟน."
        title="Transformer Monitoring"
      >
        {/* <TransformerViewControls
          layoutMode={layoutMode}
          onLayoutChange={setLayoutMode}
        /> */}
      </PageHeader>

      {/* <TransformerStatusCards summary={summary ?? defaultSummary} /> */}

      <Card>
        <CardContent>
          <TransformerFilter
            activeChips={activeChips}
            hasActiveFilter={hasActiveFilter}
            onChange={handleFilterChange}
            onReset={resetFilters}
            state={filterState}
          />
        </CardContent>
      </Card>

      <TransformerMonitorWorkspace
        activeView={activeView}
        layoutMode={layoutMode}
        map={
          <TransformerMap
            filters={{ capacity, district, search, status, tapChanger }}
            isActive={layoutMode === 'split' || activeView === 'map'}
          />
        }
        onViewChange={setActiveView}
        table={
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">รายการหม้อแปลงทั้งหมด</h2>
                <p className="text-muted-foreground text-xs">
                  ผลลัพธ์ปรับตามตัวกรองเดียวกับแผนที่
                </p>
              </div>
            </div>
            {isError ? (
              <div className="text-destructive flex h-32 items-center justify-center text-sm">
                ไม่สามารถโหลดข้อมูลหม้อแปลงได้ กรุณาลองใหม่อีกครั้ง
              </div>
            ) : (
              <TransformerTable
                isLoading={isLoading}
                tableWrapperClassName="rounded-none border-0"
                total={result?.total ?? 0}
                totalUnfiltered={result?.totalUnfiltered}
                transformers={result?.data ?? []}
              />
            )}
          </div>
        }
      />
    </div>
  )
}
