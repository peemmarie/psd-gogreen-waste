'use client'

import type { FeatureCollection } from 'geojson'

import { useEffect, useRef, useState } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { MapProvider } from 'react-map-gl/maplibre'
import { type MapRef } from 'react-map-gl/maplibre'

import { useQuery } from '@tanstack/react-query'

import type { MapResponse } from '~/app/api/transformers/map/service'

import { nextApi } from '~/lib/axios/next-api'
import { type Transformer } from '~/types/transformer'

import { BaseMap } from './components/base-map'
import { TransformerPopup } from './components/transformer-popup'
import { FULL_PAGE_BOUNDS } from './constants'
import {
  clusterBgLayer,
  clusterTextLayer,
  unclusteredPointLayer,
} from './layers'

const STALE_TIME = 10 * 60 * 1000 // 10 minutes

const DEFAULT_RESPONSE: MapResponse = {
  data: [],
  districts: [],
  total: 0,
}

export type TransformerMapFilters = {
  capacity: string[]
  district: string[]
  search: string
  status: string
  tapChanger: string
}

type TransformerMapProps = {
  filters: TransformerMapFilters
  isActive?: boolean
}

export function TransformerMap({
  filters,
  isActive = true,
}: TransformerMapProps) {
  const mapRef = useRef<MapRef>(null)

  const { capacity, district, search, status, tapChanger } = filters

  const [selectedTr, setSelectedTr] = useState<null | Transformer>(null)

  const { data: result = DEFAULT_RESPONSE } = useQuery<MapResponse>({
    queryFn: () =>
      nextApi.get('/transformers/map', {
        params: {
          capacity,
          district,
          search,
          status,
          tapChanger,
        },
      }),
    queryKey: [
      'transformers-map',
      {
        capacity,
        district,
        search,
        status,
        tapChanger,
      },
    ],
    staleTime: STALE_TIME,
  })

  const { data: trs } = result

  const mapData: FeatureCollection = {
    features: trs.map(toFeature),
    type: 'FeatureCollection',
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      setSelectedTr(null)
    }
  }

  function handleSelectTransformer(transformer: Transformer) {
    setSelectedTr(transformer)
    const currentZoom = mapRef.current?.getZoom() || 14
    mapRef.current?.flyTo({
      center: [
        transformer.coordinates.lng,
        transformer.coordinates.lat + 0.005,
      ],
      duration: 1500,
      essential: true,
      zoom: Math.max(currentZoom, 14),
    })
  }

  function toFeature(tr: Transformer) {
    return {
      geometry: {
        coordinates: [tr.coordinates.lng, tr.coordinates.lat],
        type: 'Point' as const,
      },
      properties: { cluster: false, id: tr.id, status: tr.status },
      type: 'Feature' as const,
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isActive) {
      // Small delay to ensure the DOM has updated and is visible
      const timer = setTimeout(() => {
        mapRef.current?.resize()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative h-full w-full overflow-hidden rounded-xl border-2 shadow-sm sm:border">
        {/* Map */}
        <div className="h-full w-full">
          <MapProvider>
            <BaseMap
              bounds={FULL_PAGE_BOUNDS}
              interactiveLayerIds={[
                clusterBgLayer.id!,
                unclusteredPointLayer.id!,
              ]}
              onFeatureClick={(feature) => {
                const transformer = trs.find(
                  (t) => t.id === feature.properties.id
                )
                if (transformer) handleSelectTransformer(transformer)
              }}
              onMapClick={() => setSelectedTr(null)}
              ref={mapRef}
            >
              <Source
                cluster
                clusterMaxZoom={14}
                clusterRadius={50}
                data={mapData}
                id="transformers"
                type="geojson"
              >
                <Layer {...clusterBgLayer} />
                <Layer {...clusterTextLayer} />
                <Layer {...unclusteredPointLayer} />
              </Source>

              {selectedTr && (
                <TransformerPopup
                  onClose={() => setSelectedTr(null)}
                  transformer={selectedTr}
                />
              )}
            </BaseMap>
          </MapProvider>

          {/* Map Legend Overlay */}
          {/* <div className="bg-background/90 absolute bottom-6 left-6 z-10 flex items-center gap-4 rounded-lg border p-3 text-sm shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/15">
                <span className="size-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              </div>
              <span className="font-medium">ออนไลน์</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-red-500/15">
                <span className="size-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20" />
              </div>
              <span className="font-medium">ออฟไลน์</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
