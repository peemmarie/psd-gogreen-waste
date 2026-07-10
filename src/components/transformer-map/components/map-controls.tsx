import { useState } from 'react'

import {
  Cancel01Icon,
  CompassIcon,
  Layers01Icon,
  MaximizeScreenIcon,
  MinimizeScreenIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import type { MapLayerId } from '../constants'

import { Button } from '~/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

import { MAP_LAYERS } from '../constants'

type MapControlsProps = Readonly<{
  isFullscreen?: boolean
  onChangeStyle: (style: MapLayerId) => void
  onReset: () => void
  onToggleFullscreen?: () => void
  style: MapLayerId
}>

export function MapControls({
  isFullscreen,
  onChangeStyle,
  onReset,
  onToggleFullscreen,
  style,
}: MapControlsProps) {
  const [open, setOpen] = useState(false)

  const layerOptions: MapLayerId[] = ['osm', 'streets', 'satellite']

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <Button
        className="bg-background! size-11 cursor-pointer shadow-lg"
        onClick={onReset}
        size="icon"
        title="คืนค่ามุมมองแผนที่ (Reset)"
        variant="outline"
      >
        <HugeiconsIcon className="size-5" icon={CompassIcon} />
      </Button>

      {onToggleFullscreen && (
        <Button
          className="bg-background! size-11 cursor-pointer shadow-lg"
          onClick={onToggleFullscreen}
          size="icon"
          title={isFullscreen ? 'ย่อหน้าจอ' : 'ขยายเต็มจอ'}
          variant="outline"
        >
          <HugeiconsIcon
            className="size-4"
            icon={isFullscreen ? MinimizeScreenIcon : MaximizeScreenIcon}
          />
        </Button>
      )}

      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <Button
              className="bg-background! size-11 cursor-pointer shadow-lg"
              size="icon"
              title="ชั้นข้อมูลแผนที่"
              variant="outline"
            />
          }
        >
          <HugeiconsIcon className="size-4" icon={Layers01Icon} />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[360px] p-0" side="left">
          <PopoverHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                className="text-primary size-5"
                icon={Layers01Icon}
              />
              <PopoverTitle className="text-base font-semibold">
                แผนที่
              </PopoverTitle>
            </div>
            <Button
              className="size-8 cursor-pointer rounded-full"
              onClick={() => setOpen(false)}
              size="icon"
              variant="ghost"
            >
              <HugeiconsIcon className="size-4" icon={Cancel01Icon} />
            </Button>
          </PopoverHeader>
          <div className="grid grid-cols-4 gap-2 p-4">
            {layerOptions.map((layerId) => {
              const layer = MAP_LAYERS[layerId]
              const isSelected = style === layerId
              return (
                <button
                  className="group flex cursor-pointer flex-col items-center gap-2 outline-none"
                  key={layerId}
                  onClick={() => onChangeStyle(layerId)}
                  type="button"
                >
                  <div
                    className={cn(
                      'relative h-16 w-full overflow-hidden rounded-xl border-2 transition-all',
                      isSelected
                        ? 'border-primary shadow-sm'
                        : 'hover:border-muted-foreground/30 border-transparent'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={layer.name}
                      className="h-full w-full object-cover"
                      src={layer.thumbnail}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-center text-xs transition-colors',
                      isSelected
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {layer.name}
                  </span>
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
