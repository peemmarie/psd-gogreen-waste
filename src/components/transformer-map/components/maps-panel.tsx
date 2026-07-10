import { useCallback, useEffect, useRef, useState } from 'react'

import {
  ArrowUpDownIcon,
  Calendar01Icon,
  Cancel01Icon,
  ChartIncreaseIcon,
  Clock01Icon,
  FavouriteIcon,
  Loading01Icon,
  Location01Icon,
  Menu01Icon,
  Navigation01Icon,
  Route01Icon,
  Search01Icon,
  SortByDown02Icon,
  SortByUp02Icon,
  StarIcon,
  Tick01Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useMediaQuery } from 'usehooks-ts'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Sheet, SheetContent } from '~/components/ui/sheet'
import { cn } from '~/lib/utils'
import {
  tags as allTags,
  categories,
  type Location,
} from '~/mock-data/locations'
import { useMapsStore } from '~/store/maps-store'

import { calculateDistance, formatDistance } from '../utils'

type MapsPanelProps = {
  mode?: PanelMode
}

type PanelMode = 'all' | 'favorites' | 'recents'

const panelConfig = {
  all: {
    emptyDescription: null,
    emptyIcon: Location01Icon,
    emptyTitle: 'No locations found',
    getSubtitle: (count: number) =>
      `${count} location${count !== 1 ? 's' : ''}`,
    title: 'All Locations',
  },
  favorites: {
    emptyDescription:
      'Click the heart icon on a location to add it to favorites',
    emptyIcon: FavouriteIcon,
    emptyTitle: 'No favorites yet',
    getSubtitle: (count: number) =>
      `${count} favorite${count !== 1 ? 's' : ''}`,
    title: 'Favorites',
  },
  recents: {
    emptyDescription: null,
    emptyIcon: Clock01Icon,
    emptyTitle: 'No recent locations',
    getSubtitle: (count: number) => `Last ${count} added locations`,
    title: 'Recent Locations',
  },
}

export function MapsPanel({ mode = 'all' }: MapsPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [isRequestingLocation, setIsRequestingLocation] = useState(false)
  const {
    clearRoute,
    getFavoriteLocations,
    getFilteredLocations,
    getRecentLocations,
    isPanelVisible,
    routeDestinationId,
    searchQuery,
    selectedLocationId,
    selectLocation,
    setPanelVisible,
    setRouteDestination,
    setSearchQuery,
    setSortBy,
    setUserLocation,
    sortBy,
    toggleFavorite,
    userLocation,
  } = useMapsStore()

  // Increased breakpoint for tablet support
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const hasAutoOpenedOnDesktop = useRef(false)

  const getDistance = useCallback(
    (location: Location) => {
      if (!userLocation) return null

      return calculateDistance(
        userLocation.lat,
        userLocation.lng,
        location.coordinates.lat,
        location.coordinates.lng
      )
    },
    [userLocation]
  )

  const getLocationFromIP = useCallback(async (): Promise<{
    lat: number
    lng: number
  } | null> => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()

      if (!data.latitude || !data.longitude) {
        throw new Error('Unable to get your location')
      }

      return { lat: data.latitude, lng: data.longitude }
    } catch {
      return null
    }
  }, [])

  const requestUserLocation = useCallback(() => {
    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      setIsRequestingLocation(true)

      async function tryIPFallback() {
        const ipLocation = await getLocationFromIP()
        setIsRequestingLocation(false)

        if (!ipLocation) {
          window.alert('Unable to get your location. Please try again later.')
          resolve(null)
          return
        }

        setUserLocation(ipLocation)
        resolve(ipLocation)
      }

      if (!('geolocation' in navigator)) {
        tryIPFallback()
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setIsRequestingLocation(false)
          resolve(location)
        },
        () => {
          tryIPFallback()
        },
        { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 }
      )
    })
  }, [setUserLocation, getLocationFromIP])

  const rawLocations = getLocations()
  const locations = toFormatLocation(rawLocations, selectedLocationId)

  const config = panelConfig[mode]
  const EmptyIcon = config.emptyIcon

  async function handleGetDirections(e: React.MouseEvent, location: Location) {
    e.stopPropagation()

    if (routeDestinationId === location.id) return clearRoute()

    let currentUserLocation = userLocation

    if (!currentUserLocation) {
      currentUserLocation = await requestUserLocation()
      if (!currentUserLocation) return
    }

    setIsLoadingRoute(true)
    setRouteDestination(location.id)

    setTimeout(() => {
      setIsLoadingRoute(false)
    }, 1500)
  }

  function handleLocationClick(location: Location) {
    if (selectedLocationId === location.id) return selectLocation(null)
    selectLocation(location.id)
  }

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation()
    selectLocation(null)
    clearRoute()
  }

  function toFormatLocation(locations: Location[], selectedId: null | string) {
    if (!selectedId) return locations

    const selected = locations.find((l) => l.id === selectedId)
    if (!selected) return locations

    return [selected, ...locations.filter((l) => l.id !== selectedId)]
  }

  function getLocations() {
    switch (mode) {
      case 'favorites':
        return getFavoriteLocations()
      case 'recents':
        return getRecentLocations()
      default:
        return getFilteredLocations()
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  function getTagName(tagId: string) {
    return allTags.find((t) => t.id === tagId)?.name || tagId
  }

  useEffect(() => {
    if (!selectedLocationId) return

    const isInList = rawLocations.some((l) => l.id === selectedLocationId)
    if (isInList) return

    selectLocation(null)
    clearRoute()
  }, [rawLocations, selectedLocationId, selectLocation, clearRoute])

  useEffect(() => {
    if (selectedLocationId && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ behavior: 'smooth', top: 0 })
    }
  }, [selectedLocationId])

  useEffect(() => {
    if (isDesktop && !hasAutoOpenedOnDesktop.current) {
      setPanelVisible(true)
      hasAutoOpenedOnDesktop.current = true
    }
  }, [isDesktop, setPanelVisible])

  const panelContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-3">
        <div className="">
          <h2 className="flex items-center gap-2 font-semibold">
            {mode === 'recents' && (
              <HugeiconsIcon className="size-4" icon={Clock01Icon} />
            )}
            {config.title}
          </h2>
          <p className="text-muted-foreground text-xs">
            {config.getSubtitle(locations.length)}
          </p>
        </div>
        <Button
          className="size-8"
          onClick={() => setPanelVisible(false)}
          size="icon"
          variant="ghost"
        >
          <HugeiconsIcon className="size-4" icon={Menu01Icon} />
        </Button>
      </div>

      <div className="border-b p-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <HugeiconsIcon
              className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              icon={Search01Icon}
            />
            <Input
              className={cn('h-9 pl-8', searchQuery && 'pr-8')}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations..."
              value={searchQuery}
            />
            {searchQuery && (
              <Button
                className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
                size="icon"
                variant="ghost"
              >
                <HugeiconsIcon className="size-3.5" icon={Cancel01Icon} />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="size-9 shrink-0"
                  size="icon"
                  variant="outline"
                >
                  <HugeiconsIcon className="size-4" icon={ArrowUpDownIcon} />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setSortBy('nearest')}
                >
                  <HugeiconsIcon className="size-4" icon={Navigation01Icon} />
                  <span className="flex-1">Nearest</span>
                  {sortBy === 'nearest' && (
                    <HugeiconsIcon className="size-4" icon={Tick01Icon} />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setSortBy('rating')}
                >
                  <HugeiconsIcon className="size-4" icon={StarIcon} />
                  <span className="flex-1">Best rated</span>
                  {sortBy === 'rating' && (
                    <HugeiconsIcon className="size-4" icon={Tick01Icon} />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setSortBy('visits')}
                >
                  <HugeiconsIcon className="size-4" icon={ChartIncreaseIcon} />
                  <span className="flex-1">Most visited</span>
                  {sortBy === 'visits' && (
                    <HugeiconsIcon className="size-4" icon={Tick01Icon} />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setSortBy('date-newest')}
                >
                  <HugeiconsIcon className="size-4" icon={Calendar01Icon} />
                  <span className="flex-1">Newest first</span>
                  {sortBy === 'date-newest' && (
                    <HugeiconsIcon className="size-4" icon={Tick01Icon} />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setSortBy('date-oldest')}
                >
                  <HugeiconsIcon className="size-4" icon={Calendar01Icon} />
                  <span className="flex-1">Oldest first</span>
                  {sortBy === 'date-oldest' && (
                    <HugeiconsIcon className="size-4" icon={Tick01Icon} />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setSortBy('alpha-az')}
                >
                  <HugeiconsIcon className="size-4" icon={SortByDown02Icon} />
                  <span className="flex-1">A to Z</span>
                  {sortBy === 'alpha-az' && (
                    <HugeiconsIcon className="size-4" icon={Tick01Icon} />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setSortBy('alpha-za')}
                >
                  <HugeiconsIcon className="size-4" icon={SortByUp02Icon} />
                  <span className="flex-1">Z to A</span>
                  {sortBy === 'alpha-za' && (
                    <HugeiconsIcon className="size-4" icon={Tick01Icon} />
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        <div className="space-y-2 p-2">
          {locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <HugeiconsIcon
                className="text-muted-foreground mb-2 size-8"
                icon={EmptyIcon}
              />
              <p className="text-sm font-medium">{config.emptyTitle}</p>
              {config.emptyDescription && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {config.emptyDescription}
                </p>
              )}
            </div>
          ) : (
            locations.map((location) => {
              const category = categories.find(
                (c) => c.id === location.categoryId
              )
              const isSelected = selectedLocationId === location.id
              const isRouteActive = routeDestinationId === location.id

              if (isSelected) {
                return (
                  <div
                    className={cn(
                      'flex flex-col overflow-hidden rounded-lg border-2',
                      isRouteActive
                        ? 'border-chart-4 bg-chart-4/10'
                        : 'border-primary bg-primary/5'
                    )}
                    key={location.id}
                  >
                    <div className="p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex size-11 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${category?.color}20` }}
                          >
                            <HugeiconsIcon
                              className="size-5"
                              icon={Location01Icon}
                              style={{ color: category?.color }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-semibold">
                                {location.name}
                              </h3>
                              {location.isFavorite && (
                                <HugeiconsIcon
                                  className="size-4 shrink-0 fill-red-500 text-red-500"
                                  icon={FavouriteIcon}
                                />
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {category?.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="size-8 shrink-0"
                          onClick={handleClose}
                          size="icon"
                          variant="ghost"
                        >
                          <HugeiconsIcon
                            className="size-4"
                            icon={Cancel01Icon}
                          />
                        </Button>
                      </div>

                      <p className="text-muted-foreground mb-3 text-sm">
                        {location.address}
                      </p>

                      <p className="mb-4 text-sm">{location.description}</p>

                      <div className="mb-4 flex flex-wrap items-center gap-4">
                        {userLocation && (
                          <div className="flex items-center gap-1.5">
                            <HugeiconsIcon
                              className="text-primary size-4"
                              icon={Navigation01Icon}
                            />
                            <span className="text-primary font-semibold">
                              {formatDistance(getDistance(location) || 0)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <HugeiconsIcon
                            className="size-4 fill-yellow-400 text-yellow-400"
                            icon={StarIcon}
                          />
                          <span className="font-semibold">
                            {location.rating}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            /5
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HugeiconsIcon
                            className="text-muted-foreground size-4"
                            icon={ViewIcon}
                          />
                          <span className="text-muted-foreground text-sm">
                            {location.visitCount} visits
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <HugeiconsIcon
                            className="text-muted-foreground size-4"
                            icon={Clock01Icon}
                          />
                          <span className="text-muted-foreground text-sm">
                            {formatDate(location.createdAt)}
                          </span>
                        </div>
                      </div>

                      {location.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {location.tags.map((tag) => (
                            <Badge
                              className="text-xs"
                              key={tag}
                              variant="secondary"
                            >
                              {getTagName(tag)}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(location.id)
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <HugeiconsIcon
                            className={cn(
                              'mr-2 size-4',
                              location.isFavorite && 'fill-red-500 text-red-500'
                            )}
                            icon={FavouriteIcon}
                          />
                          {location.isFavorite ? 'Unfavorite' : 'Favorite'}
                        </Button>
                        <Button
                          className={cn(
                            'flex-1',
                            isRouteActive
                              ? 'bg-chart-4 hover:bg-chart-4/90 text-white'
                              : ''
                          )}
                          disabled={isLoadingRoute || isRequestingLocation}
                          onClick={(e) => handleGetDirections(e, location)}
                          size="sm"
                        >
                          {isLoadingRoute || isRequestingLocation ? (
                            <HugeiconsIcon
                              className="mr-2 size-4 animate-spin"
                              icon={Loading01Icon}
                            />
                          ) : (
                            <HugeiconsIcon
                              className="mr-2 size-4"
                              icon={Route01Icon}
                            />
                          )}
                          {isRequestingLocation
                            ? 'Getting location...'
                            : isRouteActive
                              ? 'Clear route'
                              : 'Get directions'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  className={cn(
                    'group hover:bg-accent/50 flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-colors',
                    routeDestinationId === location.id &&
                      'border-chart-4 bg-chart-4/10'
                  )}
                  key={location.id}
                  onClick={() => handleLocationClick(location)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      <HugeiconsIcon
                        className="size-4"
                        icon={Location01Icon}
                        style={{ color: category?.color }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-medium">
                          {location.name}
                        </h3>
                        {location.isFavorite && (
                          <HugeiconsIcon
                            className="size-3 shrink-0 fill-red-500 text-red-500"
                            icon={FavouriteIcon}
                          />
                        )}
                        {routeDestinationId === location.id && (
                          <Badge
                            className="bg-chart-4/10 text-chart-4 h-5 text-[10px] shadow-none"
                            variant="secondary"
                          >
                            Route active
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {location.address}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <HugeiconsIcon
                        className="size-3 fill-yellow-400 text-yellow-400"
                        icon={StarIcon}
                      />
                      <span className="text-xs font-medium">
                        {location.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {userLocation && (
                        <div className="flex items-center gap-1">
                          <HugeiconsIcon
                            className="text-muted-foreground size-3"
                            icon={Navigation01Icon}
                          />
                          <span className="text-muted-foreground text-xs font-medium">
                            {formatDistance(getDistance(location) || 0)}
                          </span>
                        </div>
                      )}
                      {mode === 'recents' && (
                        <div className="flex items-center gap-1">
                          <HugeiconsIcon
                            className="text-muted-foreground size-3"
                            icon={Clock01Icon}
                          />
                          <span className="text-muted-foreground text-xs">
                            {formatDate(location.createdAt)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon
                          className="text-muted-foreground size-3"
                          icon={ViewIcon}
                        />
                        <span className="text-muted-foreground text-xs">
                          {location.visitCount} {mode !== 'recents' && 'visits'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button
                        className="size-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(location.id)
                        }}
                        size="icon"
                        variant="ghost"
                      >
                        <HugeiconsIcon
                          className={cn(
                            'size-3.5',
                            location.isFavorite && 'fill-red-500 text-red-500'
                          )}
                          icon={FavouriteIcon}
                        />
                      </Button>
                      <Button
                        className={cn(
                          'size-7',
                          routeDestinationId === location.id && 'text-chart-4'
                        )}
                        onClick={(e) => handleGetDirections(e, location)}
                        size="icon"
                        variant="ghost"
                      >
                        <HugeiconsIcon
                          className="size-3.5"
                          icon={Route01Icon}
                        />
                      </Button>
                    </div>
                  </div>

                  {location.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {location.tags.slice(0, 3).map((tag) => (
                        <Badge
                          className="h-5 text-[10px]"
                          key={tag}
                          variant="secondary"
                        >
                          {getTagName(tag)}
                        </Badge>
                      ))}
                      {location.tags.length > 3 && (
                        <Badge className="h-5 text-[10px]" variant="outline">
                          +{location.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {!isPanelVisible && (
        <Button
          className="bg-background! absolute top-4 left-4 z-20 size-10 shadow-xl"
          onClick={() => setPanelVisible(true)}
          size="icon"
          variant="outline"
        >
          <HugeiconsIcon className="size-5" icon={Menu01Icon} />
        </Button>
      )}

      {!isDesktop ? (
        <Sheet onOpenChange={setPanelVisible} open={isPanelVisible}>
          <SheetContent
            className="w-full p-0 sm:w-[400px]"
            showCloseButton={false}
            side="left"
          >
            {panelContent}
          </SheetContent>
        </Sheet>
      ) : (
        isPanelVisible && (
          <div className="bg-background absolute top-4 bottom-4 left-4 z-20 flex w-80 flex-col overflow-hidden rounded-xl border shadow-xl sm:w-[400px]">
            {panelContent}
          </div>
        )
      )}
    </>
  )
}
