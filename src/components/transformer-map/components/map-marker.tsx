import { Marker } from 'react-map-gl/maplibre'

import Image from 'next/image'

import trMapIcon from '~/assets/images/tr-map.png'
import { type Transformer } from '~/types/transformer'

type MapMarkerProps = {
  coordinates: { lat: number; lng: number }
  draggable?: boolean
  onDragEnd?: (lat: number, lng: number) => void
  onHover: (transformer: null | Transformer) => void
  status: 'offline' | 'online'
}

export function MapMarker({
  coordinates,
  draggable = false,
  onDragEnd,
  onHover: _onHover,
  status: _status,
}: MapMarkerProps) {
  return (
    <Marker
      draggable={draggable}
      latitude={coordinates.lat}
      longitude={coordinates.lng}
      onDragEnd={(e) => onDragEnd?.(e.lngLat.lat, e.lngLat.lng)}
    >
      <div
        className="cursor-pointer transition-transform hover:scale-110"
        // onMouseEnter={() => onHover(meter)}
        // onMouseLeave={() => onHover(null)}
      >
        <Image
          alt="Transformer Marker"
          height={36}
          src={trMapIcon}
          width={36}
        />
      </div>
    </Marker>
  )
}
