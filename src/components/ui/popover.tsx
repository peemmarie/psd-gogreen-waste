'use client'

import * as React from 'react'

import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '~/lib/utils'

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverContent({
  align = 'center',
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        className={cn(
          'rounded-base border-border bg-main text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) border-2 p-4 outline-none',
          className
        )}
        data-slot="popover-content"
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function PopoverTitle({ className, ...props }: React.ComponentProps<'h4'>) {
  return (
    <h4 className={cn('font-heading leading-none', className)} {...props} />
  )
}

function PopoverTrigger({
  children,
  nativeButton: _nativeButton,
  render,
  ...props
}: {
  nativeButton?: boolean
  render?: React.ReactElement<{ children?: React.ReactNode }>
} & React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      asChild={Boolean(render) || props.asChild}
      data-slot="popover-trigger"
      {...props}
    >
      {render
        ? React.cloneElement(
            render,
            undefined,
            children ?? render.props.children
          )
        : children}
    </PopoverPrimitive.Trigger>
  )
}

export { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger }
