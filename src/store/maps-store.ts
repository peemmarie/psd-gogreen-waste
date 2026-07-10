import { create } from 'zustand'

import { calculateDistance } from '~/components/transformer-map/utils'
import {
  locations as initialLocations,
  type Location,
} from '~/mock-data/locations'

// Cache for filtered locations to prevent re-computation
let filteredLocationsCache: {
  key: string
  result: Location[]
} | null = null

type MapsState = {
  clearRoute: () => void
  getFavoriteLocations: () => Location[]
  getFilteredLocations: () => Location[]
  getRecentLocations: () => Location[]
  isPanelVisible: boolean
  locations: Location[]
  resetSelectionIfNotInList: (locations: Location[]) => void
  routeDestinationId: null | string
  searchQuery: string
  selectedLocationId: null | string
  selectLocation: (locationId: null | string) => void
  setPanelVisible: (visible: boolean) => void
  setRouteDestination: (locationId: null | string) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: SortBy) => void
  setUserLocation: (location: { lat: number; lng: number } | null) => void
  sortBy: SortBy
  toggleFavorite: (locationId: string) => void
  userLocation: { lat: number; lng: number } | null
}

type SortBy =
  | 'alpha-az'
  | 'alpha-za'
  | 'date-newest'
  | 'date-oldest'
  | 'nearest'
  | 'rating'
  | 'visits'

// Generate cache key from state
// Generate cache key from state
function getFilterCacheKey(
  searchQuery: string,
  sortBy: string,
  userLocation: { lat: number; lng: number } | null
): string {
  return `${searchQuery}:${sortBy}:${userLocation?.lat ?? 'null'},${userLocation?.lng ?? 'null'}`
}

export const useMapsStore = create<MapsState>((set, get) => ({
  clearRoute: () => set({ routeDestinationId: null }),
  getFavoriteLocations: () => {
    const state = get()
    let filtered = state.locations.filter((l) => l.isFavorite)

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.address.toLowerCase().includes(query)
      )
    }

    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return filtered
  },

  getFilteredLocations: () => {
    const state = get()

    // Check cache
    const cacheKey = getFilterCacheKey(
      state.searchQuery,
      state.sortBy,
      state.userLocation
    )

    if (filteredLocationsCache?.key === cacheKey) {
      return filteredLocationsCache.result
    }

    let filtered = [...state.locations]

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.address.toLowerCase().includes(query)
      )
    }

    switch (state.sortBy) {
      case 'alpha-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'alpha-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'date-newest':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'date-oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        break
      case 'nearest':
        if (state.userLocation) {
          filtered.sort((a, b) => {
            const distA = calculateDistance(
              state.userLocation!.lat,
              state.userLocation!.lng,
              a.coordinates.lat,
              a.coordinates.lng
            )
            const distB = calculateDistance(
              state.userLocation!.lat,
              state.userLocation!.lng,
              b.coordinates.lat,
              b.coordinates.lng
            )
            return distA - distB
          })
        }
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'visits':
        filtered.sort((a, b) => b.visitCount - a.visitCount)
        break
    }

    // Store in cache
    filteredLocationsCache = { key: cacheKey, result: filtered }
    return filtered
  },
  getRecentLocations: () => {
    const state = get()
    let filtered = [...state.locations]

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.address.toLowerCase().includes(query)
      )
    }

    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return filtered.slice(0, 20)
  },
  isPanelVisible: true,
  locations: initialLocations,
  resetSelectionIfNotInList: (locations) => {
    const state = get()
    if (state.selectedLocationId) {
      const isInList = locations.some((l) => l.id === state.selectedLocationId)
      if (!isInList) {
        set({ routeDestinationId: null, selectedLocationId: null })
      }
    }
  },
  routeDestinationId: null,
  searchQuery: '',

  selectedLocationId: null,

  selectLocation: (locationId) => set({ selectedLocationId: locationId }),

  setPanelVisible: (visible) => set({ isPanelVisible: visible }),

  setRouteDestination: (locationId) => set({ routeDestinationId: locationId }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setUserLocation: (location) => set({ userLocation: location }),

  sortBy: 'nearest',

  toggleFavorite: (locationId) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId
          ? { ...location, isFavorite: !location.isFavorite }
          : location
      ),
    })),

  userLocation: null,
}))
