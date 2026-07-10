import { useCallback } from 'react'

export function useOpenGoogleMap() {
  const openGoogleMap = useCallback((lat: number, lng: number) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      '_blank'
    )
  }, [])

  return { openGoogleMap }
}
