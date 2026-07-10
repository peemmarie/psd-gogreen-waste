'use client'

import type { FeatureCollection, Geometry, Point } from 'geojson'
import type maplibregl from 'maplibre-gl'
import type {
  GeoJSONSource,
  MapGeoJSONFeature,
  MapLayerMouseEvent,
} from 'maplibre-gl'
import type { MapRef } from 'react-map-gl/maplibre'

import { forwardRef, type ReactNode, useEffect, useRef, useState } from 'react'
import { Layer, Map, Source, useMap } from 'react-map-gl/maplibre'

import type { MapLayerId } from '../constants'

import meaBoundary from '~/assets/geo-json/mea_boundary.json'
import trMapIcon from '~/assets/images/tr-map.png'

import { FULL_PAGE_BOUNDS, MAP_LAYERS } from '../constants'
import { MapControls } from './map-controls'
import { MapsPanel } from './maps-panel'

import 'maplibre-gl/dist/maplibre-gl.css'

type BaseMapProps = {
  bounds?: [maplibregl.LngLatLike, maplibregl.LngLatLike]
  children?: ReactNode
  defaultStyle?: MapLayerId
  interactiveLayerIds?: string[]
  isDetailPage?: boolean
  isShowPanel?: boolean
  onFeatureClick?: (feature: MapGeoJSONFeature) => void
  onMapClick?: () => void
}

export const BaseMap = forwardRef<MapRef, BaseMapProps>(function BaseMap(
  {
    bounds = FULL_PAGE_BOUNDS,
    children,
    defaultStyle = 'osm',
    interactiveLayerIds,
    isDetailPage = false,
    isShowPanel = false,
    onFeatureClick,
    onMapClick,
  },
  ref
) {
  const { map } = useMap()
  const [style, setStyle] = useState<MapLayerId>(defaultStyle)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  function handleToggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  async function onClick(event: MapLayerMouseEvent) {
    if (!map) return

    const feature = event.features?.[0]
    if (!feature) return onMapClick?.()

    const clusterId = feature.properties?.cluster_id
    if (!clusterId && onFeatureClick) return onFeatureClick(feature)
    if (!clusterId) return onMapClick?.()

    const sourceId = feature.source
    const geojsonSource = map.getSource(sourceId) as GeoJSONSource
    const zoom = await geojsonSource.getClusterExpansionZoom(clusterId)

    const geometry = feature.geometry as Geometry
    if (geometry.type !== 'Point') return

    const coordinates = (geometry as Point).coordinates

    map.easeTo({
      center: coordinates as [number, number],
      duration: 500,
      zoom,
    })
  }

  function handleStyleChange(nextStyle: MapLayerId) {
    setStyle(nextStyle)
  }

  function handleReset() {
    setStyle(defaultStyle)
    map?.fitBounds(bounds, { bearing: 0, padding: 20, pitch: 0 })
    onMapClick?.()
  }

  function handleImageMissing(e: { id: string }) {
    if (e.id === 'tr-map-marker') {
      loadImages()
    }
  }

  function loadImages() {
    if (!map) return
    if (!map.hasImage('tr-map-marker')) {
      const img = new window.Image()
      img.onload = () => {
        if (!map.hasImage('tr-map-marker')) {
          map.addImage('tr-map-marker', img)
        }
      }
      img.src = trMapIcon.src
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (!map || !containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        map.resize()
      })
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [map])

  useEffect(() => {
    if (!map) return

    if (map.isStyleLoaded()) loadImages()

    map.on('style.load', loadImages)
    map.on('styleimagemissing', handleImageMissing)

    return () => {
      map.off('style.load', loadImages)
      map.off('styleimagemissing', handleImageMissing)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return (
    <div className="bg-background relative h-full w-full" ref={containerRef}>
      <Map
        id="map"
        initialViewState={{
          bounds,
          zoom: 10,
        }}
        interactiveLayerIds={interactiveLayerIds}
        mapStyle={MAP_LAYERS[style].style}
        maxBounds={bounds}
        onClick={onClick}
        ref={ref}
        style={{ height: '100%', width: '100%' }}
      >
        {!isDetailPage && (
          <Source
            data={meaBoundary as FeatureCollection}
            id="mea-boundary"
            type="geojson"
          >
            <Layer
              id="mea-boundary-fill"
              paint={{
                'fill-color': [
                  'match',
                  ['get', 'ID_CODE'],
                  55,
                  '#f43f5e', // Rose
                  56,
                  '#8b5cf6', // Violet
                  57,
                  '#0ea5e9', // Sky
                  58,
                  '#10b981', // Emerald
                  59,
                  '#f59e0b', // Amber
                  60,
                  '#ef4444', // Red
                  65,
                  '#3b82f6', // Blue
                  66,
                  '#ec4899', // Pink
                  67,
                  '#84cc16', // Lime
                  68,
                  '#06b6d4', // Cyan
                  69,
                  '#d946ef', // Fuchsia
                  70,
                  '#f97316', // Orange
                  75,
                  '#14b8a6', // Teal
                  76,
                  '#6366f1', // Indigo
                  77,
                  '#a855f7', // Purple
                  78,
                  '#4ade80', // Green 400
                  79,
                  '#eab308', // Yellow
                  80,
                  '#f87171', // Red 400
                  '#036870', // fallback
                ],
                'fill-opacity': 0.15,
              }}
              type="fill"
            />
            <Layer
              id="mea-boundary-line"
              paint={{
                'line-color': '#f97316',
                'line-dasharray': [2, 4],
                'line-width': 1.5,
              }}
              type="line"
            />
          </Source>
        )}

        {children}
      </Map>

      {isShowPanel && <MapsPanel />}

      <MapControls
        isFullscreen={isFullscreen}
        onChangeStyle={handleStyleChange}
        onReset={handleReset}
        onToggleFullscreen={handleToggleFullscreen}
        style={style}
      />
    </div>
  )
})
