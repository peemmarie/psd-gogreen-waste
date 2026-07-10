import type maplibregl from 'maplibre-gl'

import { type StyleSpecification } from 'maplibre-gl'

export type MapLayerId = 'osm' | 'satellite' | 'streets'

function createRasterStyle(
  url: string,
  attribution: string
): StyleSpecification {
  return {
    layers: [
      {
        id: 'raster-tiles',
        maxzoom: 22,
        minzoom: 0,
        source: 'raster-tiles',
        type: 'raster',
      },
    ],
    sources: {
      'raster-tiles': {
        attribution,
        tiles: [url],
        tileSize: 256,
        type: 'raster',
      },
    },
    version: 8,
  }
}

export const MAP_LAYERS: Record<
  MapLayerId,
  { name: string; style: string | StyleSpecification; thumbnail: string }
> = {
  osm: {
    name: 'แผนที่มาตรฐาน',
    style: createRasterStyle(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    ),
    thumbnail: 'https://tile.openstreetmap.org/10/812/469.png',
  },
  satellite: {
    name: 'ภาพถ่ายดาวเทียม',
    style: createRasterStyle(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    ),
    thumbnail:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/469/812',
  },
  streets: {
    name: 'แผนที่เส้นถนน',
    style: 'https://tiles.openfreemap.org/styles/liberty',
    thumbnail: 'https://tile.openstreetmap.org/10/812/469.png',
  },
}

export const THAILAND_BOUNDS: [maplibregl.LngLatLike, maplibregl.LngLatLike] = [
  [90.0, 0.0], // Southwest coordinates - Expanded for popup space
  [112.0, 28.0], // Northeast coordinates - Expanded for popup space
]

// Default bounds for full page map (wider view)
export const FULL_PAGE_BOUNDS: [maplibregl.LngLatLike, maplibregl.LngLatLike] =
  [
    [100.0, 13.3],
    [101.15, 14.3],
  ]

// Tighter bounds for the widget/card view (Bangkok, Nonthaburi, Samut Prakan)
export const RECTANGLE_BOUNDS: [maplibregl.LngLatLike, maplibregl.LngLatLike] =
  [
    [99.9, 13.3],
    [101.15, 14.25],
  ]

/** @deprecated Use FULL_PAGE_BOUNDS or RECTANGLE_BOUNDS instead */
export const CENTRAL_THAILAND_BOUNDS = FULL_PAGE_BOUNDS
