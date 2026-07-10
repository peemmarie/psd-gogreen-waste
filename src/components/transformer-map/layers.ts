import type { LayerProps } from 'react-map-gl/maplibre'

export const clusterBgLayer: LayerProps = {
  filter: ['has', 'point_count'],
  id: 'clusters-bg',
  paint: {
    'circle-color': '#c23f00', // theme primary orange, darkened for white label contrast
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    'circle-stroke-color': '#ffffff',
    'circle-stroke-width': 2,
  },
  type: 'circle',
}

export const clusterTextLayer: LayerProps = {
  filter: ['has', 'point_count'],
  id: 'clusters-text',
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
    'text-size': 14,
  },
  paint: {
    'text-color': '#ffffff',
  },
  type: 'symbol',
}

export const unclusteredPointLayer: LayerProps = {
  filter: ['!', ['has', 'point_count']],
  id: 'unclustered-point',
  layout: {
    'icon-allow-overlap': true,
    'icon-image': 'tr-map-marker',
    'icon-size': 0.07,
  },
  paint: {
    'icon-opacity': 1,
  },
  type: 'symbol',
}
