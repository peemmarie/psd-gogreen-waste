'use client'

import * as React from 'react'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

function CollapsibleTrigger({
  children,
  nativeButton: _nativeButton,
  render,
  ...props
}: {
  nativeButton?: boolean
  render?: React.ReactElement<{ children?: React.ReactNode }>
} & React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      asChild={Boolean(render) || props.asChild}
      data-slot="collapsible-trigger"
      {...props}
    >
      {render
        ? React.cloneElement(
            render,
            undefined,
            children ?? render.props.children
          )
        : children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  )
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
