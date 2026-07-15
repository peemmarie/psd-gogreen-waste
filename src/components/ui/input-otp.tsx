'use client'

import * as React from 'react'

import { OTPInput, OTPInputContext } from 'input-otp'
import { Dot } from 'lucide-react'

import { cn } from '~/lib/utils'

function InputOTP({
  className,
  containerClassName,
  ...props
}: {
  containerClassName?: string
} & React.ComponentProps<typeof OTPInput>) {
  return (
    <OTPInput
      className={cn('disabled:cursor-not-allowed', className)}
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName
      )}
      data-slot="input-otp"
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center', className)}
      data-slot="input-otp-group"
      {...props}
    />
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <Dot className="size-4" />
    </div>
  )
}

function InputOTPSlot({
  className,
  index,
  ...props
}: { index: number } & React.ComponentProps<'div'>) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      className={cn(
        'border-border bg-secondary-background font-base text-foreground first:rounded-l-base last:rounded-r-base relative flex size-10 items-center justify-center border-y-2 border-r-2 text-sm transition-all first:border-l-2',
        isActive && 'ring-ring z-10 ring-1',
        className
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-4 w-px bg-current duration-1000" />
        </div>
      )}
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
