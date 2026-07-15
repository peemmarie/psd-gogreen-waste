import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'size-10',
        'icon-lg': 'size-11',
        'icon-sm': 'size-8',
        'icon-xs': 'size-6',
        lg: 'h-11 px-8',
        sm: 'h-9 px-3',
      },
      variant: {
        default:
          'text-main-foreground bg-main border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        destructive:
          'border-2 border-border bg-red-500 text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        ghost:
          'border-2 border-transparent bg-transparent text-foreground shadow-none hover:border-border hover:bg-main hover:text-main-foreground',
        link: 'h-auto border-0 bg-transparent p-0 text-foreground underline-offset-4 shadow-none hover:underline',
        neutral:
          'bg-secondary-background text-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        noShadow: 'text-main-foreground bg-main border-2 border-border',
        outline:
          'bg-secondary-background text-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
        reverse:
          'text-main-foreground bg-main border-2 border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
        secondary:
          'bg-secondary-background text-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
      },
    },
  }
)

function Button({
  asChild = false,
  children,
  className,
  nativeButton: _nativeButton,
  render,
  size,
  variant,
  ...props
}: {
  asChild?: boolean
  nativeButton?: boolean
  render?: React.ReactElement<{
    children?: React.ReactNode
    className?: string
  }>
} & React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>) {
  const Comp = asChild || render ? Slot : 'button'
  const buttonClassName = cn(buttonVariants({ className, size, variant }))

  return (
    <Comp className={buttonClassName} data-slot="button" {...props}>
      {render
        ? React.cloneElement(
            render,
            undefined,
            children ?? render.props.children
          )
        : children}
    </Comp>
  )
}

export { Button, buttonVariants }
