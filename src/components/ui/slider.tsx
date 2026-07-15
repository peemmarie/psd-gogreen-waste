'use client'

import * as React from 'react'

import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '~/lib/utils'

function Slider({
  className,
  defaultValue,
  max = 100,
  min = 0,
  onValueCommit,
  onValueCommitted,
  value,
  ...props
}: {
  onValueCommitted?: React.ComponentProps<
    typeof SliderPrimitive.Root
  >['onValueCommit']
} & React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      onValueCommit={onValueCommit ?? onValueCommitted}
      value={value}
      {...props}
    >
      <SliderPrimitive.Track
        className="rounded-base bg-secondary-background border-border relative w-full grow overflow-hidden border-2 data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3"
        data-slot="slider-track"
      >
        <SliderPrimitive.Range
          className="bg-main absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          data-slot="slider-range"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          className="border-border focus-visible:ring-ring rounded-base block h-5 w-5 border-2 bg-white ring-offset-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          data-slot="slider-thumb"
          key={index}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
