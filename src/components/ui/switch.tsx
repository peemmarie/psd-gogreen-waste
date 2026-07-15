'use client'

import * as React from 'react'

import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '~/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer border-border bg-secondary-background focus-visible:ring-ring data-[state=checked]:bg-main data-[state=unchecked]:bg-secondary-background rounded-base inline-flex h-6 w-12 shrink-0 cursor-pointer items-center border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'border-border rounded-base pointer-events-none block h-4 w-4 border-2 bg-white ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1'
        )}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
