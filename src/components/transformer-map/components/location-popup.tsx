import { Popup } from 'react-map-gl/maplibre'

import {
  Clock01Icon,
  FavouriteIcon,
  StarIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Badge } from '~/components/ui/badge'
import {
  tags as allTags,
  categories,
  type Location,
} from '~/mock-data/locations'

type LocationPopupProps = {
  location: Location
  onClose: () => void
}

export function LocationPopup({ location, onClose }: LocationPopupProps) {
  const category = categories.find((c) => c.id === location.categoryId)

  function getTagName(tagId: string) {
    return allTags.find((t) => t.id === tagId)?.name || tagId
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

  return (
    <Popup
      anchor="bottom"
      className="z-50"
      closeButton={false}
      closeOnClick={false}
      latitude={location.coordinates.lat}
      longitude={location.coordinates.lng}
      offset={[0, -10]}
      onClose={onClose}
    >
      <div className="flex w-[280px] flex-col gap-2 p-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex size-8 items-center justify-center rounded-md"
              style={{ backgroundColor: `${category?.color}20` }}
            >
              <div
                className="size-2.5 rounded-full"
                style={{ backgroundColor: category?.color }}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{location.name}</h3>
              <p className="text-muted-foreground text-xs">{category?.name}</p>
            </div>
          </div>
          {location.isFavorite && (
            <HugeiconsIcon
              className="size-4 fill-red-500 text-red-500"
              icon={FavouriteIcon}
            />
          )}
        </div>

        <p className="text-muted-foreground line-clamp-2 text-xs">
          {location.description}
        </p>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              className="size-3 fill-yellow-400 text-yellow-400"
              icon={StarIcon}
            />
            <span className="font-medium">{location.rating}</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
            <HugeiconsIcon className="size-3" icon={Clock01Icon} />
            <span>{formatDate(location.createdAt)}</span>
          </div>
          <div className="text-muted-foreground">
            {location.visitCount} visits
          </div>
        </div>

        {location.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {location.tags.slice(0, 3).map((tag) => (
              <Badge
                className="h-5 px-1.5 text-[10px] font-normal"
                key={tag}
                variant="secondary"
              >
                {getTagName(tag)}
              </Badge>
            ))}
            {location.tags.length > 3 && (
              <Badge
                className="h-5 px-1.5 text-[10px] font-normal"
                variant="outline"
              >
                +{location.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Popup>
  )
}
